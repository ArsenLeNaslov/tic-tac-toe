# Odin's Tic Tac Toe

A modern space-themed, feature-rich implementation of the classic Tic Tac Toe game built with vanilla JavaScript, HTML, and CSS. 
Play against another player or challenge an AI opponent with adjustable difficulty levels.

Live preview: [Odin's Tic Tac Toe](https://arsenlenaslov.github.io/tic-tac-toe/).

<img width="1837" height="892" alt="image" src="https://github.com/user-attachments/assets/efb23682-dac6-4e5a-bdcb-1b8cb23ee581" />

## Features

### Game Modes
https://arsenlenaslov.github.io/tic-tac-toe/- **Two Players (PvP)** : Play locally against another person on the same device
- **Play vs Computer (PvC)** : Challenge an AI ohttps://arsenlenaslov.github.io/tic-tac-toe/pponent with three difficulty levels:
  - **Easy** : Random moves (unpredictable but beatable)
  - **Intermediate** : Smart move selection with 30% random moves (balanced challenge)
  - **Hard** : Minimax algorithm for optimal play (unbeatable)

### Game Management
- **Live Scoreboard** : Tracks wins for Player X, Player O, and draws across multiple games
- **Reset Game** : Start a fresh round without resetting the scoreboard
- **Reset Scoreboard** : Clear all scores and begin fresh
- **Turn Indicator** : Visual display of whose turn it is with animated emojis

### User Experience
- **Responsive Design** : Works seamlessly on desktop, tablet, and mobile devices
- **Cosmic Theme** : Beautiful gradient background with stardust imagery and themed emoji indicators
- **Smooth Animations** : Fade-in effects for marks, hover states on cells, and celebration animations for wins
- **Accessible Controls** : Clear radio buttons for mode selection and dropdown for difficulty choice

## How to Play

1. **Select Game Mode**
   - Choose "Two Players" for local multiplayer
   - Choose "Play vs Computer" and select a difficulty level

2. **Make Your Move**
   - Click on any empty cell to place your mark (X or O)
   - The game automatically detects wins, draws, and switches turns

3. **Game End**
   - When someone wins or the board fills up (draw), the game displays the result
   - Scores update automatically
   - Click "Reset Game" to play again with the same settings

## Project Structure

```
tic-tac-toe/
├── index.html          # Game markup and structure
├── style.css           # Responsive styling and theme
├── javascript.js       # Game logic, AI, and UI controller
├── img/                # Emoji and icon assets
│   ├── solar-system.gif
│   ├── star.gif
│   ├── planet.gif
│   ├── scales.gif
│   ├── robot.gif
│   ├── fight.gif
│   ├── joypad.gif
│   ├── trophy.gif
│   ├── game-over.gif
│   ├── turns.gif
│   └── stardust-galaxy.jpg
└── README.md           # This awesome file!
```

## Architecture

The JavaScript is organized into four self-contained modules:

### Gameboard Module
Manages the 3×3 board state with methods for:
- Getting cell values
- Checking if cells are empty
- Placing marks with validation
- Resetting the board

### Scoreboard Module
Tracks game statistics and updates the DOM display:
- Win counts for X and O
- Draw counts
- Live score updates

### GameController Module
Central game logic handling:
- Turn management and player switching
- Win and draw detection
- Game state management
- **AI Engine** : Implements three difficulty strategies:
  - Easy: Random move selection
  - Intermediate: Hybrid approach (70% optimal via Minimax, 30% random)
  - Hard: Full Minimax algorithm with depth-based scoring for unbeatable play

### DisplayController Module
Manages all UI interactions:
- Board rendering and updates
- Event listeners for cells, buttons, and mode selectors
- Message display with emoji-enhanced feedback
- Difficulty dropdown visibility control
- Game initialization on page load

## Technologies Used

- **HTML5** : Semantic markup structure
- **CSS3** : Flexbox layouts, gradients, animations, and responsive design
- **Vanilla JavaScript** : No frameworks; pure modular architecture
- **Minimax Algorithm** : For optimal AI decision-making in hard mode

## Responsive Design

The game adapts to all screen sizes:
- **Desktop** : Full-featured layout with optimized spacing
- **Tablet** : Scaled board and readable touch targets
- **Mobile** : Compact layout with adjusted font sizes and button spacing
- **Short Screens** : Optimized vertical spacing for landscape orientation

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript (Arrow functions, `const`/`let`, Template literals)
- CSS Grid and Flexbox
- CSS Gradients and Transforms

## Author

Created by [ArsenLeNaslov](https://github.com/ArsenLeNaslov) for [The Odin Project](https://www.theodinproject.com/) 🎴

## License

- Open source: feel free to fork, modify, and learn! 
- Favicon and GIFs fron [Flaticon](https://www.flaticon.com/), creative common license [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Background image from [Freepic](https://www.freepik.com/free-photo/space-background-realistic-starry-night-cosmos-shining-stars-milky-way-stardust-color-galaxy_39616662.htm#fromView=keyword&page=2&position=49&uuid=2d41c603-82ba-4dd8-8955-edbb7d76d813&query=Cosmic+background), free for use under the website content license [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- ["ZenDots](https://www.cufonfonts.com/font/zen-dots) font is free to use under the [Open Font License](https://openfontlicense.org/)
