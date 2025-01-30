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
            [1, 0, 0, 1, 1, 0, 0, 1],
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
            [1, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 2, 0, 0, 4, 0, 1],
            [1, 0, 3, 0, 0, 4, 0, 1],
            [1, 0, 3, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
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
let currentLevel, playerPos, blocks, targets; // Global variables to store the current level, player position, block positions, and target positions

function initializeLevel(levelIndex) {
    const level = LEVELS[levelIndex];
    currentLevel = level.grid.map(row => [...row]); // Create a deep copy of the level grid array
    playerPos = { ...level.playerPos }; // Create a deep copy of the player position
    blocks = level.blocks.map(block => ({...block})); // Create a deep copy of the block positions
    targets = level.targets.map(target => ({...target})); // Create a deep copy of the target positions
    document.getElementById('level-display').innerHTML = `Current Level: ${levelIndex + 1}`; // Update the level display
    renderGame();
}

function initializeGame() {
    initializeLevel(currentLevelIndex);
}

// When level is completed, move to next level
function checkWinCondition() {
    let blocksOnTarget = 0; // Initialize a counter for blocks on target
    blocks.forEach(block => { // Iterate over each block position
        if (isOnTarget(block.x, block.y)) blocksOnTarget++; // If the block is on a target, increment the counter
    });
    if (blocksOnTarget === blocks.length) { // If all blocks are on targets
        currentLevelIndex = (currentLevelIndex + 1) % LEVELS.length; // Move to the next level
        initializeLevel(currentLevelIndex); // Initialize the next level
    }
}

// Reset current level
function resetLevel() {
    initializeLevel(currentLevelIndex);
}

// Check if a block is on a target
function isOnTarget(x, y) {
    for (let target of targets) { // Iterate over each target position
        if (target.x === x && target.y === y) { // If the block position matches a target position
            return true; // Return true
        }
    }
    return false; // If no target position matches the block position, return false
}

// Render the game
function renderGame() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = ''; // Clears any existing content inside the gameGrid element. Ensures that the grid is empty before rendering the new game state.
    for (let y = 0; y < currentLevel.length; y++) { // This loop iterates over each row of the current level grid array (length of grid is 8)
        for (let x = 0; x < currentLevel[y].length; x++) { // This loop iterates over each cell in the current row (length of row is 8)
            const cell = document.createElement('div'); // Create a new div element for each cell
            cell.className = 'cell'; // Add the 'cell' class to the div element
            if (currentLevel[y][x] === WALL) cell.classList.add('wall'); // If the cell value is WALL (1), add the 'wall' class to the div element
            else if (x === playerPos.x && y === playerPos.y) cell.classList.add('player'); // If the cell value is PLAYER (2), add the 'player' class to the div element
            else if (currentLevel[y][x] === BLOCK) { // If the cell value is BLOCK (3) 
                cell.classList.add('block'); // Add the 'block' class to the div element
                if (isOnTarget(x, y)) cell.classList.add('on-target'); // If the block is on a target, add the 'on-target' class to the div element
            } else if (currentLevel[y][x] === TARGET) cell.classList.add('target'); // If the cell value is TARGET (4), add the 'target' class to the div element
            gameGrid.appendChild(cell); // Append the div element to the gameGrid element
        }
    }
    checkWinCondition();
}



// Check if the player can move to a new position
function canMove(newPos, movement) { // newPos is the new position the player is trying to move to, movement is the direction of movement
    if (currentLevel[newPos.y][newPos.x] === WALL) return false; // If the new position is a WALL, return false
    if (currentLevel[newPos.y][newPos.x] === TARGET) return false; // If the new position is a TARGET, return false
    if (currentLevel[newPos.y][newPos.x] === BLOCK) { // If the new position is a BLOCK
        const blockIndex = blocks.findIndex(b => b.x === newPos.x && b.y === newPos.y); // Find the index of the block in the blocks array
        if (blockIndex !== -1 && isOnTarget(blocks[blockIndex].x, blocks[blockIndex].y)) return false; // If the block is on a target, return false
        const beyondBlock = { x: newPos.x + movement.x, y: newPos.y + movement.y }; // Calculate the position beyond the block
        if (currentLevel[beyondBlock.y][beyondBlock.x] === WALL || // If the position beyond the block is a WALL or another BLOCK
            currentLevel[beyondBlock.y][beyondBlock.x] === BLOCK) return false; // Return false
        currentLevel[beyondBlock.y][beyondBlock.x] = BLOCK; // Set the position beyond the block to BLOCK
        currentLevel[newPos.y][newPos.x] = EMPTY; // Set the current block position to EMPTY
        if (blockIndex !== -1) { // If the block is found in the blocks array
            blocks[blockIndex] = {x: beyondBlock.x, y: beyondBlock.y}; // Update the block position to the position beyond the block
        }
        return true; // Return true
    }
    return true; // If the new position is not a WALL or a BLOCK, return true
}

// Move the player
function move(direction) {
    const movements = { // Define movement vectors for different directions
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };
    const movement = movements[direction]; // Get the movement vector for the specified direction
    const newPos = { x: playerPos.x + movement.x, y: playerPos.y + movement.y }; // Calculate the new player position
    if (canMove(newPos, movement)) { // Check if the player can move to the new position
        currentLevel[playerPos.y][playerPos.x] = EMPTY; // Set the current player position to EMPTY
        playerPos = newPos; // Update the player position
        currentLevel[playerPos.y][playerPos.x] = PLAYER; // Set the new player position to PLAYER
        renderGame(); // Render the updated game state
    }
}

// Initialize the game on window load
window.onload = initializeGame;

// Add event listener for keydown events
document.addEventListener('keydown', (e) => {
    const keyActions = { // Define key actions for different arrow keys
        'ArrowUp': 'up', 
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };
    if (keyActions[e.key]) { // If the pressed key has a corresponding action defined
        e.preventDefault(); // Prevent default scrolling behavior
        move(keyActions[e.key]); // Move the player in the corresponding direction
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { // Check if the pressed key is the spacebar
        e.preventDefault(); // Prevent the default action (e.g., scrolling)
        resetLevel(); // Call the resetLevel function
    }
});