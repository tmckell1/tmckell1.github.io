# Zelda-style Block Puzzle Game

A browser-based puzzle game inspired by block-pushing puzzles from The Legend of Zelda series. Players must strategically push blocks onto target spaces while navigating through procedurally generated levels.

## Features

- **Procedurally Generated Levels**: Each level is uniquely generated with:
  - Random player starting position
  - Two blocks and two corresponding targets
  - Randomized wall placements
  - Guaranteed solvable layouts
  
- **Intuitive Controls**:
  - Arrow keys for keyboard control
  - On-screen buttons for touch/mouse input
  - Smooth player movement
  
- **Game Mechanics**:
  - Push blocks onto target spaces
  - Cannot pull blocks
  - Cannot push multiple blocks at once
  - Blocks cannot be pushed through walls
  
- **Progressive Gameplay**:
  - Infinite levels
  - Automatic level progression upon completion
  - Level counter to track progress
  - Reset button to restart current level

## Installation

1. Download all files to a local directory
2. Open `index.html` in a modern web browser
3. No additional dependencies or installation required

## How to Play

1. **Movement**:
   - Use arrow keys on your keyboard
   - Or click/tap the directional buttons below the game grid
   
2. **Objective**:
   - Push both yellow blocks onto the green target spaces
   - All blocks must be on targets to complete the level
   
3. **Strategy**:
   - Plan your moves carefully
   - Avoid pushing blocks into corners
   - Use walls to your advantage
   - Consider the order of block placement

4. **Level Progression**:
   - Levels advance automatically upon completion
   - Each new level presents a unique layout
   - Use the reset button if you get stuck

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies
- Mobile-responsive design
- Modular code structure for easy modification

## Customization

The game can be customized by modifying the following parameters:

- Grid size (currently 8x8)
- Number of blocks and targets
- Wall density (currently 25% chance per inner cell)
- Color scheme (via CSS)
- Movement controls

## Contributing

Feel free to fork this project and submit pull requests for:

- New features
- Bug fixes
- Performance improvements
- Additional game mechanics
- UI/UX enhancements

## License

This project is open source and available for personal and commercial use.

## Credits

Inspired by block-pushing puzzles from The Legend of Zelda series.
