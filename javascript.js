// Gameboard Module: Manages the game board state and cell operations
const Gameboard = (function () {
    // internal 3x3 board state
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    return {
        getState(row, col) {
            if (row < 0 || row > 2 || col < 0 || col > 2) {
                throw new Error("Row or column index out of range");
            }
            return board[row][col];
        },

        isEmpty(row, col) {
            return this.getState(row, col) === "";
        },

        placeMark(row, col, mark) {
            if (mark !== "X" && mark !== "O") {
                throw new Error("Invalid mark. Must be 'X' or 'O'.");
            }
            if (!this.isEmpty(row, col)) {
                throw new Error("Cell is already occupied!");
            }
            board[row][col] = mark;
        },

        resetBoard() {
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    board[r][c] = "";
                }
            }
        }
    };
})();

// Scoreboard Module: Tracks and displays game scores (X wins, O wins, draws)
const Scoreboard = (function() {
    let scores = { X: 0, O: 0, draws: 0 };

    return {
        update(winner) {
            if (winner === 'draw') {
                scores.draws++;
            } else {
                scores[winner]++;
            }
            this.show();
        },

        show() {
            document.getElementById('points-x').textContent = scores.X;
            document.getElementById('points-o').textContent = scores.O;
            document.getElementById('points-draws').textContent = scores.draws;
        },

        reset() {
            scores = { X: 0, O: 0, draws: 0 };
            this.show();
        }
    };
})();

// Game Controller Module: Handles game logic, turn management, win/draw detection, and optional AI
const GameController = (function() {
    let currentPlayer = null;
    let gameOver = false;

    const players = [
        { name: "Player X", symbol: "X" },
        { name: "Player O", symbol: "O" }
    ];

    // Mode and AI settings
    let mode = 'pvp'; // 'pvp' or 'pvc'
    let aiDifficulty = 'hard'; // 'easy', 'intermediate', or 'hard'
    let aiSymbol = 'O';

    function getBoardArray() {
        const b = [];
        for (let r = 0; r < 3; r++) {
            b[r] = [];
            for (let c = 0; c < 3; c++) {
                b[r][c] = Gameboard.getState(r, c);
            }
        }
        return b;
    }

    function checkWinnerOnBoard(boardArr) {
        const lines = [
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],
            [[0,2],[1,1],[2,0]]
        ];

        for (let line of lines) {
            const [a,b,c] = line;
            const vA = boardArr[a[0]][a[1]];
            const vB = boardArr[b[0]][b[1]];
            const vC = boardArr[c[0]][c[1]];
            if (vA !== '' && vA === vB && vA === vC) return vA;
        }
        return null;
    }

    function getAvailableMoves(boardArr) {
        const moves = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (boardArr[r][c] === '') moves.push([r,c]);
            }
        }
        return moves;
    }

    function minimax(boardArr, depth, isMaximizing, aiSym, humanSym) {
        const winner = checkWinnerOnBoard(boardArr);
        if (winner === aiSym) return {score: 10 - depth};
        if (winner === humanSym) return {score: depth - 10};
        if (getAvailableMoves(boardArr).length === 0) return {score: 0};

        if (isMaximizing) {
            let best = {score: -Infinity};
            for (let [r,c] of getAvailableMoves(boardArr)) {
                boardArr[r][c] = aiSym;
                const result = minimax(boardArr, depth + 1, false, aiSym, humanSym);
                boardArr[r][c] = '';
                if (result.score > best.score) {
                    best = {score: result.score, move: [r,c]};
                }
            }
            return best;
        } else {
            let best = {score: Infinity};
            for (let [r,c] of getAvailableMoves(boardArr)) {
                boardArr[r][c] = humanSym;
                const result = minimax(boardArr, depth + 1, true, aiSym, humanSym);
                boardArr[r][c] = '';
                if (result.score < best.score) {
                    best = {score: result.score, move: [r,c]};
                }
            }
            return best;
        }
    }

    return {
        startGame() {
            gameOver = false;
            currentPlayer = players[0];
            Gameboard.resetBoard();
            return {
                type: 'start',
                message: '<img src="img/joypad.gif" alt="game controller" class="emoji"> Game started - Turn: ' + currentPlayer.name,
                player: currentPlayer
            };
        },

        setMode(newMode) {
            mode = newMode === 'pvc' ? 'pvc' : 'pvp';
            // default AI symbol is O, player is X
            aiSymbol = 'O';
        },

        setAIDifficulty(d) {
            if (d === 'easy') aiDifficulty = 'easy';
            else if (d === 'intermediate') aiDifficulty = 'intermediate';
            else aiDifficulty = 'hard';
        },

        isComputerTurn() {
            return mode === 'pvc' && currentPlayer && currentPlayer.symbol === aiSymbol;
        },

        performAIMove() {
            if (gameOver) return { type: 'error', message: '<img src="img/game-over.gif" alt="game over" class="emoji"> The game is over. Reset to play again!' };

            const boardArr = getBoardArray();
            const aiSym = aiSymbol;
            const humanSym = aiSym === 'X' ? 'O' : 'X';

            let move;
            const available = getAvailableMoves(boardArr);
            if (available.length === 0) {
                return { type: 'draw', message: '<img src="img/scales.gif" alt="scales" class="emoji"> It\'s a Draw! No more possible moves!' };
            }

            if (aiDifficulty === 'easy') {
                move = available[Math.floor(Math.random() * available.length)];
            } else if (aiDifficulty === 'intermediate') {
                // 70% chance of making a smart move, 30% chance of random move
                if (Math.random() < 0.7) {
                    const result = minimax(boardArr, 0, true, aiSym, humanSym);
                    move = result.move || available[Math.floor(Math.random() * available.length)];
                } else {
                    move = available[Math.floor(Math.random() * available.length)];
                }
            } else {
                // hard: minimax
                const result = minimax(boardArr, 0, true, aiSym, humanSym);
                move = result.move || available[Math.floor(Math.random() * available.length)];
            }

            // place mark using Gameboard
            try {
                Gameboard.placeMark(move[0], move[1], aiSym);
            } catch (e) {
                // if unexpected, pick random
                const fallback = available[Math.floor(Math.random() * available.length)];
                Gameboard.placeMark(fallback[0], fallback[1], aiSym);
            }

            const winner = this.checkWinner();
            if (winner) {
                gameOver = true;
                const winningPlayer = players.find(p => p.symbol === winner);
                Scoreboard.update(winner);
                return {
                    type: 'winner',
                    message: '<img src="img/trophy.gif" alt="trophy" class="emoji"> ' + winningPlayer.name + ' Wins!'
                };
            }

            if (this.checkDraw()) {
                gameOver = true;
                Scoreboard.update('draw');
                return { type: 'draw', message: '<img src="img/scales.gif" alt="scales" class="emoji"> It\'s a Draw! No more possible moves!' };
            }

            // switch back to human
            this.switchTurn();
            return {
                type: 'turn',
                message: '<img src="img/turns.gif" alt="turn arrow" class="emoji"> Turn: ' + currentPlayer.name,
                player: currentPlayer
            };
        },

        makeMove(row, col) {
            if (gameOver) {
                return { type: 'error', message: '<img src="img/game-over.gif" alt="game over" class="emoji"> The game is over. Reset to play again!' };
            }

            if (!Gameboard.isEmpty(row, col)) {
                return { type: 'error', message: 'Cell taken. Choose another!' };
            }

            Gameboard.placeMark(row, col, currentPlayer.symbol);

            const winner = this.checkWinner();
            if (winner) {
                gameOver = true;
                const winningPlayer = players.find(p => p.symbol === winner);
                Scoreboard.update(winner);
                return {
                    type: 'winner',
                    message: '<img src="img/trophy.gif" alt="trophy" class="emoji"> ' + winningPlayer.name + ' Wins!'
                };
            }

            if (this.checkDraw()) {
                gameOver = true;
                Scoreboard.update('draw');
                return { type: 'draw', message: '<img src="img/scales.gif" alt="scales" class="emoji"> It\'s a Draw! No more possible moves!' };
            }

            this.switchTurn();
            return {
                type: 'turn',
                message: '<img src="img/turns.gif" alt="turn arrow" class="emoji"> Turn: ' + currentPlayer.name,
                player: currentPlayer
            };
        },

        switchTurn() {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        },

        checkWinner() {
            const winningLines = [
                [[0,0], [0,1], [0,2]],
                [[1,0], [1,1], [1,2]],
                [[2,0], [2,1], [2,2]],
                [[0,0], [1,0], [2,0]],
                [[0,1], [1,1], [2,1]],
                [[0,2], [1,2], [2,2]],
                [[0,0], [1,1], [2,2]],
                [[0,2], [1,1], [2,0]]
            ];

            for (let line of winningLines) {
                const [a, b, c] = line;
                const valA = Gameboard.getState(a[0], a[1]);
                const valB = Gameboard.getState(b[0], b[1]);
                const valC = Gameboard.getState(c[0], c[1]);

                if (valA !== "" && valA === valB && valA === valC) {
                    return valA;
                }
            }
            return null;
        },

        checkDraw() {
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (Gameboard.isEmpty(r, c)) {
                        return false;
                    }
                }
            }
            return true;
        },

        getCurrentPlayer() {
            return currentPlayer;
        },

        isGameOver() {
            return gameOver;
        }
    };
})();

// Display Controller Module: Manages UI updates, event handling, and game display
const DisplayController = (function(){
    return {
        renderBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                const row = cell.getAttribute('data-row');
                const col = cell.getAttribute('data-col');
                const val = Gameboard.getState(parseInt(row), parseInt(col));

                cell.textContent = val;

                // Reset classes and add style class for mark
                cell.className = 'cell';
                if (val === 'X') {
                    cell.classList.add('mark-x');
                } else if (val === 'O') {
                    cell.classList.add('mark-o');
                }
            });
        },

        updateMessage(message, type = '') {
            const msgEl = document.getElementById('game-message');
            if (msgEl) {
                msgEl.innerHTML = message;
                msgEl.className = `game-message ${type}`;
            }
        },

        updateTurn(player = null) {
            const turnEl = document.getElementById('current-turn');
            if (turnEl) {
                if (!player) {
                    player = GameController.getCurrentPlayer();
                }
                const emoji = player.symbol === 'X' ? 
                    '<img src="img/star.gif" alt="star" class="emoji">' : 
                    '<img src="img/planet.gif" alt="planet" class="emoji">';
                turnEl.innerHTML = `Turn: ${emoji} ${player.name}`;
            }
        },

        initEvents() {
            // Play mode controls (pvp / pvc) and difficulty
            document.querySelectorAll('input[name="mode"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const mode = e.target.value;
                    GameController.setMode(mode);
                    const diffLabel = document.getElementById('difficulty-label');
                    if (mode === 'pvc') {
                        diffLabel.style.display = 'inline-block';
                    } else {
                        diffLabel.style.display = 'none';
                    }
                });
            });

            const difficultySelect = document.getElementById('ai-difficulty');
            if (difficultySelect) {
                difficultySelect.addEventListener('change', (e) => {
                    GameController.setAIDifficulty(e.target.value);
                });
            }

            // Reset Game button
            document.getElementById('reset-game').addEventListener('click', () => {
                // apply mode/difficulty from UI before starting
                const selectedMode = document.querySelector('input[name="mode"]:checked').value;
                GameController.setMode(selectedMode);
                const selectedDiff = (difficultySelect) ? difficultySelect.value : 'hard';
                GameController.setAIDifficulty(selectedDiff);

                const result = GameController.startGame();
                this.renderBoard();
                this.updateMessage(result.message);
                this.updateTurn(result.player);

                // if AI starts, schedule its move
                if (GameController.isComputerTurn()) {
                    setTimeout(() => {
                        const aiResult = GameController.performAIMove();
                        this.renderBoard();
                        this.updateMessage(aiResult.message, aiResult.type);
                        if (aiResult.player) this.updateTurn(aiResult.player);
                    }, 600);
                }
            });

            // Reset Scoreboard button
            document.getElementById('reset-scoreboard').addEventListener('click', () => {
                Scoreboard.reset();
                this.updateMessage('<img src="img/scales.gif" alt="scales" class="emoji"> Scoreboard reset', '');
            });

            // Board cells
            document.querySelectorAll('.cell').forEach(cell => {
                cell.addEventListener('click', (event) => {
                    const row = event.target.getAttribute('data-row');
                    const col = event.target.getAttribute('data-col');

                    const result = GameController.makeMove(parseInt(row), parseInt(col));
                    this.renderBoard();
                    this.updateMessage(result.message, result.type);

                    if (result.player) {
                        this.updateTurn(result.player);

                        // if the next player is the computer, let it play after a short delay
                        if (GameController.isComputerTurn()) {
                            setTimeout(() => {
                                const aiResult = GameController.performAIMove();
                                this.renderBoard();
                                this.updateMessage(aiResult.message, aiResult.type);
                                if (aiResult.player) this.updateTurn(aiResult.player);
                            }, 600);
                        }
                    }
                });
            });

            // Initialize game on load (apply current UI mode)
            const initMode = document.querySelector('input[name="mode"]:checked');
            if (initMode) GameController.setMode(initMode.value);
            if (difficultySelect) GameController.setAIDifficulty(difficultySelect.value);

            // show/hide difficulty label based on initial mode
            const diffLabel = document.getElementById('difficulty-label');
            if (initMode && initMode.value === 'pvc') {
                diffLabel.style.display = 'inline-block';
            } else if (diffLabel) {
                diffLabel.style.display = 'none';
            }

            const initialResult = GameController.startGame();
            this.renderBoard();
            this.updateMessage(initialResult.message);
            this.updateTurn(initialResult.player);
            Scoreboard.show();

            // if AI starts right away, schedule AI move
            if (GameController.isComputerTurn()) {
                setTimeout(() => {
                    const aiResult = GameController.performAIMove();
                    this.renderBoard();
                    this.updateMessage(aiResult.message, aiResult.type);
                    if (aiResult.player) this.updateTurn(aiResult.player);
                }, 600);
            }
        }
    };
})();

// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    DisplayController.initEvents();
});