const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Snake Paddle
const paddle = {
    x: 200,
    y: 370,
    width: 100,
    height: 15,
    dx: 0
};

// Ball
const ball = {
    x: 250,
    y: 200,
    radius: 10,
    dx: 3,
    dy: -3
};

// Snake Body
let snake = [{x: 250, y: 370}];
let snakeLength = 1;

// Bricks
const brickRowCount = 4;
const brickColCount = 8;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 20;
let bricks = [];
for (let c = 0; c < brickColCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let gameOver = false;

function drawPaddle() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, paddle.width, paddle.height);
    });
}

function drawBricks() {
    for (let c = 0; c < brickColCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#ffa500';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.y + ball.radius >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
    ) {
        ball.dy *= -1;
        score++;
        // Snake grows
        snakeLength++;
    }

    // Brick collision
    for (let c = 0; c < brickColCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickWidth &&
                    ball.y - ball.radius < b.y + brickHeight &&
                    ball.y + ball.radius > b.y
                ) {
                    ball.dy *= -1;
                    b.status = 0;
                    score += 5;
                }
            }
        }
    }

    // Bottom collision (game over)
    if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
    }
}

function updateSnake() {
    // Add new head at paddle position
    snake.unshift({x: paddle.x, y: paddle.y});
    // Keep only the needed length
    while (snake.length > snakeLength) snake.pop();
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 390);
}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.fillText('Game Over!', 170, 200);
    ctx.font = '20px Arial';
    ctx.fillText('Final Score: ' + score, 190, 240);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameOver) {
        movePaddle();
        moveBall();
        updateSnake();
        drawBricks();
        drawPaddle();
        drawBall();
        drawSnake();
        drawScore();
        requestAnimationFrame(loop);
    } else {
        drawGameOver();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        paddle.dx = -7;
    } else if (e.key === 'ArrowRight') {
        paddle.dx = 7;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        paddle.dx = 0;
    }
});

loop();
