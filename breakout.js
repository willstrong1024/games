// Initialise variables.
var canvas, ctx;

var ballX, ballY;
var ballSpeedX = 4;
var ballSpeedY = 10;
const BALL_RADIUS = 10;

var lives = 5;
var score = 0;

var gameover = false;

var paddleX;
const PADDLE_THICKNESS = 10;
const PADDLE_WIDTH = 100;

const BRICK_ROWS = 6;
const BRICK_COLUMNS = 20;
const BRICK_HEIGHT = 20;
var brickWidth;
var bricks = [];

// Fill the bricks array with bricks.
for (let c = 0; c < BRICK_COLUMNS; c++) {
  bricks[c] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    bricks[c][r] = { x: 0, y: 0, visible: true };
  }
}

// Return the mouse x and y position on the canvas.
function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

// Simplify constraining the paddle to the canvas.
function clamp(number) {
  return Math.min(Math.max(number, 10), canvas.width - PADDLE_WIDTH - 10);
}

window.onload = function() {
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  // Set canvas to fill the window.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Start the ball in the center of the canvas.
  ballX = canvas.width / 2;
  ballY = canvas.height;

  // Initialise the starting position for the paddle.
  paddleX = canvas.width / 2;

  // Set the bricks to the width of the column.
  brickWidth = canvas.width / BRICK_COLUMNS;

  // Update the canvas 30 times a second.
  let framesPerSecond = 30;
  setInterval(function() {
    update();
    draw();
  }, 1000/ framesPerSecond);

  // Load a new game on mouse click.
  canvas.addEventListener("mousedown", function() {
    if (gameover) {
      window.top.location.reload();
    }
  });

  // Align the center of the paddle with the mouse.
  canvas.addEventListener("mousemove", function(evt) {
    let mousePos = calculateMousePos(evt);
    paddleX = clamp(mousePos.x - PADDLE_WIDTH / 2);
  });
}

// Reset the ball when it goes past the paddle, or when the game is over.
function reset() {
  if (lives <= 0) {
    gameover = true;
  }

  ballSpeedY = -ballSpeedY;
  ballX = canvas.width / 2;
  ballY = canvas.height - 10 - PADDLE_THICKNESS - BALL_RADIUS;
}

function update() {
  
  // If the game is over, ignore the rest of the function.
  if (gameover) {
    return;
  }

  // Update the ball's coordinates.
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // If the ball is at the top of the screen...
  if (ballY < 0) {

    // ...reflect the ball.
    ballSpeedY = -ballSpeedY;
  }

  // If the bottom of the ball is inline with the top of the paddle...
  if (ballY > canvas.height - 10 - PADDLE_THICKNESS - BALL_RADIUS) {

    // ...reflect the ball if it hits the paddle.
    if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
      ballSpeedY = -ballSpeedY;

      // Angle of reflection depends on where the ball hits the paddle.
      let deltaX = ballX - (paddleX + PADDLE_WIDTH / 2);
      ballSpeedX = deltaX * 0.35;
    }

    // Otherwise, if the ball goes past the paddle, reset the ball.
    else if (ballY > canvas.height) {
      lives--;
      reset();
    }
  }

  // If the ball is at the left side of the screen...
  if (ballX < 0 + BALL_RADIUS) {

    // ...reflect the ball.
    ballSpeedX = -ballSpeedX;
  }

  // If the ball is at the right side of the screen...
  if (ballX > canvas.width - BALL_RADIUS) {

    // ...reflect the ball.
    ballSpeedX = -ballSpeedX;
  }

  // For each brick...
  for (let c = 0; c < BRICK_COLUMNS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      let b = bricks[c][r];

      // If the brick is visible...
      if (b.visible == true) {

        // ...and the ball is touching the brick...
        if(ballX + BALL_RADIUS > b.x && ballX - BALL_RADIUS < b.x + brickWidth && ballY + BALL_RADIUS > b.y && ballY - BALL_RADIUS < b.y + BRICK_HEIGHT) {

          // ...reflect the ball...
          ballSpeedY = -ballSpeedY;

          // ...hide the brick...
          b.visible = false;

          // ...increase the score...
          score ++;

          // ...and check to see if all the bricks have been destroyed.
          if (score == BRICK_ROWS * BRICK_COLUMNS) {
            gameover = true;
          }
        } 
      }
    }
  }
}

// Draw rows of rectangles to form the bricks.
function drawBricks() {
  let colors = ["red", "orange", "darkOrange", "yellow", "green", "blue"]

  for (let c = 0; c < BRICK_COLUMNS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      if (bricks[c][r].visible == true) {
        bricks[c][r].x = c * brickWidth;
        bricks[c][r].y = r * BRICK_HEIGHT + 2 * BRICK_HEIGHT;
        colorRect(bricks[c][r].x, bricks[c][r].y, brickWidth, BRICK_HEIGHT, colors[r]);
      }
    }
  }
}

function draw() {
  
  // Draw a black rectangle the size of the canvas to form the background.
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // If the game is over...
  if (gameover) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // ...and all of the bricks have been destroyed...
    if (score == BRICK_ROWS * BRICK_COLUMNS) {

      // ...print "Winner!" in the middle of the screen.
      ctx.fillText("Winner!", canvas.width / 2, canvas.height / 3);
    }

    // Otherwise...
    else {

      // ...print "Game over!" and the score in the middle of the screen.
      ctx.fillText("Game over!", canvas.width / 2, canvas.height / 3);
      ctx.fillText(score, canvas.width / 2, canvas.height / 3 + 15);  
    }

    // Inform the user that they can play again if they click the screen.
    ctx.fillText("Click to continue.", canvas.width / 2, canvas.height - canvas.height / 3);

    // Ignore the rest of the function.
    return;
  }

  // Draw a white rectangle at the bottom of the screen for the player's paddle.
  colorRect(paddleX, canvas.height - PADDLE_THICKNESS - 10, PADDLE_WIDTH, PADDLE_THICKNESS, "white");

  // Draw the ball.
  colorCircle(ballX, ballY, BALL_RADIUS, "white");

  // Draw the bricks.
  drawBricks();

  // Draw the player's score and lives.
  ctx.fillStyle = "white";
  ctx.fillText(score, 10, 20);
  ctx.fillText(lives, canvas.width - 15, 20);
}

// Simplify drawing circles.
function colorCircle(centerX, centerY, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

// Simplify drawing rectangles.
function colorRect(leftX, topY, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
}
