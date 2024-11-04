const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasSize = 400;
const tileCount = 20;
const tileSize = canvasSize / tileCount;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let velocity = { x: 0, y: 0 };
let score = 0;
let gameSpeed = localStorage.getItem("snakeDifficulty") || 100;
let gamePaused = false;
let gameOver = false;

const liveScoreElement = document.getElementById("liveScore");

const foodColors = ["#ff0000", "#ff8080"]; // Warna berkedip untuk umpan
let currentFoodColorIndex = 0;

// Ubah warna umpan setiap 500ms
setInterval(() => {
    currentFoodColorIndex = (currentFoodColorIndex + 1) % foodColors.length;
}, 500);

function drawGame() {
    if (gamePaused || gameOver) return;

    updateSnake();
    if (isGameOver()) {
        gameOver = true;
        saveScore();
        alert("Game Over! Skor Anda: " + score);
        resetGame();
    } else {
        clearScreen();
        drawSnake();
        drawFood();
        checkFoodCollision();
        updateLiveScore();
        setTimeout(drawGame, gameSpeed);
    }
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "yellow"; // Warna kepala ular
    ctx.fillRect(snake[0].x * tileSize, snake[0].y * tileSize, tileSize, tileSize);

    ctx.fillStyle = "lime"; // Warna tubuh ular
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * tileSize, snake[i].y * tileSize, tileSize, tileSize);
    }
}

function drawFood() {
    ctx.fillStyle = foodColors[currentFoodColorIndex];
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

function updateSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, SPACE = 32;

    if (keyPressed === LEFT && velocity.x === 0) velocity = { x: -1, y: 0 };
    if (keyPressed === UP && velocity.y === 0) velocity = { x: 0, y: -1 };
    if (keyPressed === RIGHT && velocity.x === 0) velocity = { x: 1, y: 0 };
    if (keyPressed === DOWN && velocity.y === 0) velocity = { x: 0, y: 1 };

    // Pause/Resume game dengan spasi
    if (keyPressed === SPACE) {
        gamePaused = !gamePaused;
        if (!gamePaused && !gameOver) drawGame();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        snake.push({});
        placeFood();
    }
}

function updateLiveScore() {
    liveScoreElement.textContent = score;
}

function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

// Fungsi reset permainan
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    gamePaused = false;
    gameOver = false;
    placeFood();
    updateLiveScore();
}

function saveScore() {
    const scores = JSON.parse(localStorage.getItem("snakeScores") || "[]");
    scores.push(score);
    scores.sort((a, b) => b - a);
    localStorage.setItem("snakeScores", JSON.stringify(scores.slice(0, 5)));
}

window.addEventListener("keydown", changeDirection);
drawGame();
