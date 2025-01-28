// Define constants for different cell types
const EMPTY = 0, WALL = 1, PLAYER = 2, BLOCK = 3, TARGET = 4;

// Store all predefined levels
const LEVELS = [
    // Level 1 - Simple U shape, one box to push around a corner
    {
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 3, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 4, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        playerPos: { x: 2, y: 3 },
        blocks: [{ x: 3, y: 3 }],
        targets: [{ x: 3, y: 6 }]
    },
    
    // Level 2 - Two boxes, simple parallel pushing
    {
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 2, 0, 1, 4, 0, 1],
            [1, 0, 3, 0, 1, 4, 0, 1],
            [1, 0, 3, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        playerPos: { x: 2, y: 2 },
        blocks: [{ x: 2, y: 3 }, { x: 2, y: 4 }],
        targets: [{ x: 5, y: 2 }, { x: 5, y: 3 }]
    },
    
    // Level 3 - Three boxes with some tricky maneuvering
    {
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 4, 4, 4, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 3, 0, 1],
            [1, 0, 3, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 3, 0, 1],
            [1, 0, 2, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        playerPos: { x: 2, y: 5 },
        blocks: [{ x: 5, y: 2 }, { x: 2, y: 3 }, { x: 5, y: 4 }],
        targets: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
    }
];

// Initialize game with first level
let currentLevelIndex = 0;
let currentLevel, playerPos, blocks, targets;

function initializeLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    currentLevel = level.grid.map(row => [...row]);
    playerPos = { ...level.playerPos };
    blocks = level.blocks.map(block => ({...block}));
    targets = level.targets.map(target => ({...target}));
    renderGame();
}

function initializeGame() {
    initializeLevel(currentLevelIndex);
}

// // When level is completed, move to next level
// function checkWinCondition() {
//     let blocksOnTarget = 0;
//     blocks.forEach(block => {
//         if (isOnTarget(block.x, block.y)) blocksOnTarget++;
//     });
//     if (blocksOnTarget === blocks.length) {
//         currentLevelIndex = (currentLevelIndex + 1) % LEVELS.length;
//         initializeLevel(currentLevelIndex);
//     }
// }

// // Reset current level
// function resetLevel() {
//     initializeLevel(currentLevelIndex);
// }

// // Render the game
// function renderGame() {
//     const gameGrid = document.getElementById('gameGrid');
//     gameGrid.innerHTML = '';
//     for (let y = 0; y < currentLevel.length; y++) {
//         for (let x = 0; x < currentLevel[y].length; x++) {
//             const cell = document.createElement('div');
//             cell.className = 'cell';
//             if (currentLevel[y][x] === WALL) cell.classList.add('wall');
//             else if (x === playerPos.x && y === playerPos.y) cell.classList.add('player');
//             else if (currentLevel[y][x] === BLOCK) {
//                 cell.classList.add('block');
//                 if (isOnTarget(x, y)) cell.classList.add('on-target');
//             } else if (currentLevel[y][x] === TARGET) cell.classList.add('target');
//             gameGrid.appendChild(cell);
//         }
//     }
//     checkWinCondition();
// }

// // Initialize the game
// function initializeGame() {
//     blocks = [];
//     targets = [];
//     currentLevel = generateLevel();
//     renderGame();
// }

// // Check if the player can move to a new position
// function canMove(newPos, movement) {
//     if (currentLevel[newPos.y][newPos.x] === WALL) return false;
//     if (currentLevel[newPos.y][newPos.x] === BLOCK) {
//         const beyondBlock = { x: newPos.x + movement.x, y: newPos.y + movement.y };
//         if (currentLevel[beyondBlock.y][beyondBlock.x] === WALL || 
//             currentLevel[beyondBlock.y][beyondBlock.x] === BLOCK) return false;
//         currentLevel[beyondBlock.y][beyondBlock.x] = BLOCK;
//         currentLevel[newPos.y][newPos.x] = EMPTY;
//         // Update block position in blocks array
//         const blockIndex = blocks.findIndex(b => b.x === newPos.x && b.y === newPos.y);
//         if (blockIndex !== -1) {
//             blocks[blockIndex] = {x: beyondBlock.x, y: beyondBlock.y};
//         }
//         return true;
//     }
//     return true;
// }

// // Move the player
// function move(direction) {
//     const movements = {
//         up: { x: 0, y: -1 },
//         down: { x: 0, y: 1 },
//         left: { x: -1, y: 0 },
//         right: { x: 1, y: 0 }
//     };
//     const movement = movements[direction];
//     const newPos = { x: playerPos.x + movement.x, y: playerPos.y + movement.y };
//     if (canMove(newPos, movement)) {
//         currentLevel[playerPos.y][playerPos.x] = EMPTY;
//         playerPos = newPos;
//         currentLevel[playerPos.y][playerPos.x] = PLAYER;
//         renderGame();
//     }
// }

// Initialize the game on window load
window.onload = initializeGame;

// Add event listener for keydown events
document.addEventListener('keydown', (e) => {
    const keyActions = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    if (keyActions[e.key]) {
        e.preventDefault();
        move(keyActions[e.key]);
    }
});