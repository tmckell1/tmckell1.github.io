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

    // Check if a block position is valid
    function isValidBlockPosition(x, y) {
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
        const x = 2 + Math.floor(Math.random() * (size-4)), y = 2 + Math.floor(Math.random() * (size-4));
        if (level[y][x] === EMPTY) {
            clearSpaceAround(x, y);
            level[y][x] = PLAYER;
            playerPos = { x, y };
            playerPlaced = true;
        }
    }

    // Place blocks and targets in random valid positions
    let blocksPlaced = 0, targetsPlaced = 0, numBlocksAndTargets = 2;
    while (blocksPlaced < numBlocksAndTargets && targetsPlaced < numBlocksAndTargets) {
        // Place a block
        let blockX = 2 + Math.floor(Math.random() * (size - 4));
        let blockY = 2 + Math.floor(Math.random() * (size - 4));
        if (level[blockY][blockX] === EMPTY && isValidBlockPosition(blockX, blockY)) {
            level[blockY][blockX] = BLOCK;
            blocksPlaced++;
        }
    
        // Place a target
        let targetX = 2 + Math.floor(Math.random() * (size - 4));
        let targetY = 2 + Math.floor(Math.random() * (size - 4));
        if (level[targetY][targetX] === EMPTY && isValidBlockPosition(targetX, targetY)) {
            level[targetY][targetX] = TARGET;
            targetsPlaced++;
        }
    }

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
    const blocksOnTarget = blocks.reduce((count, _) => {
        let blockCount = 0;
        currentLevel.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === BLOCK && isOnTarget(x, y)) blockCount++;
            });
        });
        return blockCount;
    }, 0);
    if (blocksOnTarget === blocks.length && blocksOnTarget === targets.length) initializeGame();
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
    blocks = [], targets = [], currentLevel = generateLevel();
    for (let y = 0; y < currentLevel.length; y++) {
        for (let x = 0; x < currentLevel[y].length; x++) {
            if (currentLevel[y][x] === PLAYER) playerPos = { x, y };
            else if (currentLevel[y][x] === BLOCK) blocks.push({ x, y });
            else if (currentLevel[y][x] === TARGET) targets.push({ x, y });
        }
    }
    renderGame();
}

// Check if the player can move to a new position
function canMove(newPos, movement) {
    if ([WALL, TARGET].includes(currentLevel[newPos.y][newPos.x])) return false;
    if (currentLevel[newPos.y][newPos.x] === BLOCK) {
        const beyondBlock = { x: newPos.x + movement.x, y: newPos.y + movement.y };
        if (isOnTarget(newPos.x, newPos.y)) return false;
        if ([EMPTY, TARGET].includes(currentLevel[beyondBlock.y][beyondBlock.x])) {
            currentLevel[beyondBlock.y][beyondBlock.x] = BLOCK;
            currentLevel[newPos.y][newPos.x] = EMPTY;
            return true;
        }
        return false;
    }
    return true;
}

// Move the player
function move(direction) {
    const movements = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const movement = movements[direction], newPos = { x: playerPos.x + movement.x, y: playerPos.y + movement.y };
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
    const keyActions = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right' };
    if (keyActions[e.key]) {
        e.preventDefault();
        move(keyActions[e.key]);
    }
});