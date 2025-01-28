// Define constants for different cell types
const EMPTY = 0, WALL = 1, PLAYER = 2, BLOCK = 3, TARGET = 4;

// Initialize player position, blocks, targets, and current level
let playerPos = { x: 1, y: 1 }, blocks = [], targets = [], currentLevel;

// Ensure accessibility of the level
function ensureAccessibility(level) {
    for (let y = 1; y < level.length - 1; y++) {
        for (let x = 1; x < level[y].length - 1; x++) {
            if ([BLOCK, TARGET, PLAYER].includes(level[y][x])) {
                if (Math.random() < 0.5) level[y][x-1] = EMPTY;
                else level[y][x+1] = EMPTY;
                if (Math.random() < 0.5) level[y-1][x] = EMPTY;
                else level[y+1][x] = EMPTY;
            }
        }
    }
}

// Generate a new level
function generateLevel() {
    const size = 8;
    const level = Array(size).fill().map(() => Array(size).fill(EMPTY));

    // Create the outer walls of the level
    for (let i = 0; i < size; i++) level[0][i] = level[size-1][i] = level[i][0] = level[i][size-1] = WALL;

    // Randomly place inner walls
    for (let y = 2; y < size-2; y++) {
        for (let x = 2; x < size-2; x++) {
            if (Math.random() < 0.2) level[y][x] = WALL;
        }
    }

    // Check if a position is valid for placement
    function isValidPosition(x, y) {
        if (x <= 1 || x >= size-2 || y <= 1 || y >= size-2) return false;
        if (level[y][x] !== EMPTY) return false;
        let emptySpaces = { horizontal: 0, vertical: 0 };
        if (level[y][x-1] === EMPTY) emptySpaces.horizontal++;
        if (level[y][x+1] === EMPTY) emptySpaces.horizontal++;
        if (level[y-1][x] === EMPTY) emptySpaces.vertical++;
        if (level[y+1][x] === EMPTY) emptySpaces.vertical++;
        return emptySpaces.horizontal >= 1 && emptySpaces.vertical >= 1;
    }

    // Clear space around a given position
    function clearSpaceAround(x, y) {
        if (level[y-1][x] === WALL) level[y-1][x] = EMPTY;
        if (level[y+1][x] === WALL) level[y+1][x] = EMPTY;
        if (level[y][x-1] === WALL) level[y][x-1] = EMPTY;
        if (level[y][x+1] === WALL) level[y][x+1] = EMPTY;
    }

    // Place the player in a random empty position
    let playerPlaced = false;
    while (!playerPlaced) {
        const x = 2 + Math.floor(Math.random() * (size-4));
        const y = 2 + Math.floor(Math.random() * (size-4));
        if (level[y][x] === EMPTY) {
            clearSpaceAround(x, y);
            level[y][x] = PLAYER;
            playerPos = { x, y };
            playerPlaced = true;
        }
    }

    // Place blocks and targets in random valid positions
    const numBlocksAndTargets = 2;
    const blockPositions = [];
    const targetPositions = [];

    // Keep trying to place blocks and targets until we have equal numbers of both
    let maxAttempts = 100; // Prevent infinite loops
    let attempts = 0;

    while ((blockPositions.length < numBlocksAndTargets || targetPositions.length < numBlocksAndTargets) && attempts < maxAttempts) {
        attempts++;
        
        // Try to place a block if needed
        if (blockPositions.length < numBlocksAndTargets) {
            const x = 2 + Math.floor(Math.random() * (size-4));
            const y = 2 + Math.floor(Math.random() * (size-4));
            
            if (level[y][x] === EMPTY && isValidPosition(x, y)) {
                level[y][x] = BLOCK;
                blockPositions.push({x, y});
                clearSpaceAround(x, y);
            }
        }

        // Try to place a target if needed
        if (targetPositions.length < numBlocksAndTargets) {
            const x = 2 + Math.floor(Math.random() * (size-4));
            const y = 2 + Math.floor(Math.random() * (size-4));
            
            if (level[y][x] === EMPTY && isValidPosition(x, y)) {
                level[y][x] = TARGET;
                targetPositions.push({x, y});
                clearSpaceAround(x, y);
            }
        }
    }

    // If we couldn't place all blocks and targets, try generating a new level
    if (blockPositions.length !== numBlocksAndTargets || targetPositions.length !== numBlocksAndTargets) {
        return generateLevel(); // Recursively try again
    }

    // Store the positions
    blocks = blockPositions;
    targets = targetPositions;

    // Ensure the level is accessible
    ensureAccessibility(level);
    return level;
}

// Check if a position is on a target
function isOnTarget(x, y) {
    return targets.some(target => target.x === x && target.y === y);
}

// Check win condition
function checkWinCondition() {
    let blocksOnTarget = 0;
    blocks.forEach(block => {
        if (isOnTarget(block.x, block.y)) blocksOnTarget++;
    });
    if (blocksOnTarget === blocks.length && blocksOnTarget === targets.length) {
        initializeGame();
    }
}

// Reset the level
function resetLevel() {
    initializeGame();
}

// Render the game
function renderGame() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    for (let y = 0; y < currentLevel.length; y++) {
        for (let x = 0; x < currentLevel[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (currentLevel[y][x] === WALL) cell.classList.add('wall');
            else if (x === playerPos.x && y === playerPos.y) cell.classList.add('player');
            else if (currentLevel[y][x] === BLOCK) {
                cell.classList.add('block');
                if (isOnTarget(x, y)) cell.classList.add('on-target');
            } else if (currentLevel[y][x] === TARGET) cell.classList.add('target');
            gameGrid.appendChild(cell);
        }
    }
    checkWinCondition();
}

// Initialize the game
function initializeGame() {
    blocks = [];
    targets = [];
    currentLevel = generateLevel();
    renderGame();
}

// Check if the player can move to a new position
function canMove(newPos, movement) {
    if (currentLevel[newPos.y][newPos.x] === WALL) return false;
    if (currentLevel[newPos.y][newPos.x] === BLOCK) {
        const beyondBlock = { x: newPos.x + movement.x, y: newPos.y + movement.y };
        if (currentLevel[beyondBlock.y][beyondBlock.x] === WALL || 
            currentLevel[beyondBlock.y][beyondBlock.x] === BLOCK) return false;
        currentLevel[beyondBlock.y][beyondBlock.x] = BLOCK;
        currentLevel[newPos.y][newPos.x] = EMPTY;
        // Update block position in blocks array
        const blockIndex = blocks.findIndex(b => b.x === newPos.x && b.y === newPos.y);
        if (blockIndex !== -1) {
            blocks[blockIndex] = {x: beyondBlock.x, y: beyondBlock.y};
        }
        return true;
    }
    return true;
}

// Move the player
function move(direction) {
    const movements = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };
    const movement = movements[direction];
    const newPos = { x: playerPos.x + movement.x, y: playerPos.y + movement.y };
    if (canMove(newPos, movement)) {
        currentLevel[playerPos.y][playerPos.x] = EMPTY;
        playerPos = newPos;
        currentLevel[playerPos.y][playerPos.x] = PLAYER;
        renderGame();
    }
}

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