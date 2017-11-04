// Initialise variables.
var canvas, ctx;

var ballX, ballY;
var ballSpeedX = 10;
var ballSpeedY = 4;
const BALL_RADIUS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var win = false;

var paddle1Y, paddle2Y;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

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

// Function to simplify constraining the paddles to the canvas.
function clamp(number) {
  return Math.min(Math.max(number, 10), canvas.height - PADDLE_HEIGHT - 10);
}

window.onload = function() {
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  // Set the canvas to fill the window.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Start the ball in center of the canvas.
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  //Initialise the starting position for paddles.
  paddle1Y = paddle2Y = canvas.height / 2;

  // Update the canvas 30 times a second.
  let framesPerSecond = 30;
  setInterval(function() {
    update();
    draw();
  }, 1000 / framesPerSecond);

  // Load a new game on mouse click.
  canvas.addEventListener("mousedown", function() {
    if (win) {
      window.top.location.reload();
    }
  });

  // Align the center of the left paddle with the mouse.
  canvas.addEventListener("mousemove", function(evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = clamp(mousePos.y - PADDLE_HEIGHT / 2);
  });
}

// Reset the ball when a point is scored, or when the game is over.
function reset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    win = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

// Make the right paddle update it's y value to match the ball's.
function ai() {
  let paddle2Center = paddle2Y + PADDLE_HEIGHT / 2;

  if (paddle2Center < ballY - 35) {
    paddle2Y = clamp(paddle2Y + 6)
  } else if (paddle2Center > ballY + 35) {
    paddle2Y = clamp(paddle2Y - 6)
  }
}

function update() {

  // If the game is over, ignore the rest of the function.
  if (win) {
    return;
  }

  // Update the right paddle x value.
  ai();

  // Update the ball's coordinates.
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // If the left edge of the ball is inline with the right edge of the paddle...
  if (ballX < 10 + PADDLE_THICKNESS + BALL_RADIUS) {

    // ...reflect the ball if it hits the paddle.
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // Angle of reflection depends on where the ball hits the paddle.
      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    }

    // Otherwise, if the ball goes past the paddle, increase player2's score and reset the ball to the middle.
    else if (ballX < 0) {
      player2Score++;
      reset();
    }
  }

  // If the right edge of the ball is inline with the left edge of the paddle...
  if (ballX > canvas.width - 10 - PADDLE_THICKNESS - BALL_RADIUS) {

    // ...reflect the ball if it hits the paddle.
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // Angle of reflection depends on where the ball hits the paddle.
      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } 

    // Otherwise, if the ball goes past the paddle, increase player1's score and reset the ball to the middle.
    else if (ballX > canvas.width) {
      player1Score++;
      reset();
    }
  }

  // If the ball is at the top of the screen...
  if (ballY < 0 + BALL_RADIUS) {

    // ...reflect the ball.
    ballSpeedY = -ballSpeedY;
  }

  // If the ball is at the bottom of the screen...
  if (ballY > canvas.height - BALL_RADIUS) {

    // ...reflect the ball.
    ballSpeedY = -ballSpeedY;
  }
}

// Draw a line every 40px to make a net.
function drawNet() {
  for (let i = canvas.height % 20 / 2; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function draw() {

  // Draw a black rectangle the size of the canvas to form the background.
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // If the game is over...
  if (win) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // ...if player1 achieved the winning score...
    if (player1Score >= WINNING_SCORE) {

      // ...print "Player1 wins!" in the middle of the screen.
      ctx.fillText("Player1 wins!", canvas.width / 2, canvas.height / 3);
    } 

    // Or...
    else if (player2Score >= WINNING_SCORE) {

      // ...print "Player2 wins!" in the middle of the screen.
      ctx.fillText("Player2 wins!", canvas.width / 2, canvas.height / 3);
    }

    // Inform the user that they can play again if they click the screen.
    ctx.fillText("Click to continue.", canvas.width / 2, canvas.height - canvas.height / 3);

    // Ignore the rest of the function.
    return;
  }

  // Draw a white rectangle on the left side of the screen for player1's paddle.
  colorRect(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // Draw another white rectangle on the right side of the screen for player2's paddle.
  colorRect(canvas.width - PADDLE_THICKNESS - 10, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // Draw the net.
  drawNet();

  // Draw the ball.
  colorCircle(ballX, ballY, BALL_RADIUS, "white");

  // Draw the players' scores.
  ctx.fillText(player1Score, canvas.width / 2 - 50, 50);
  ctx.fillText(player2Score, canvas.width - (canvas.width / 2 - 45), 50);
}

// Function to simplify drawing circles.
function colorCircle(centerX, centerY, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

// Function to simplify drawing rectangles.
function colorRect(leftX, topY, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
}
