// Initialise variables.
var canvas, ctx;

var snakeX = 10;
var snakeY = 10;
var xVelocity = 0;
var yVelocity = 0;
var trail = [];
var tail = 1;

const GRID_SIZE = 20;
const TILE_COUNT = 20;

var appleX = Math.floor(Math.random() * TILE_COUNT);
var appleY = Math.floor(Math.random() * TILE_COUNT);

window.onload = function() {
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 400;

  // Change the direction of the snake when a key is pressed.
  document.addEventListener("keydown", function(evt) {
    switch(evt.keyCode) {
      case 37:
        xVelocity = -1;
        yVelocity = 0;
        break;

      case 38:
        xVelocity = 0; 
        yVelocity = -1;
        break;

      case 39:
        xVelocity = 1;
        yVelocity = 0;
        break;

      case 40:
        xVelocity = 0;
        yVelocity = 1;
        break;
    }
  });

  // Update the canvas 15 times a second.
  let framesPerSecond = 15;
  setInterval(game, 1000/ framesPerSecond);
}

function game() {

  // Update the snake's coordinates.
  snakeX += xVelocity;
  snakeY += yVelocity;

  // Wrap the snake if it goes out of the canvas.
  if (snakeX < 0) {
    snakeX = TILE_COUNT - 1;
  }
  if (snakeX > TILE_COUNT - 1) {
    snakeX = 0;
  }
  if (snakeY < 0) {
    snakeY = TILE_COUNT - 1;
  }
  if (snakeY > TILE_COUNT - 1) {
    snakeY = 0;
  }

  // Draw a black rectangle the size of the canvas to form the background.
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // Draw a white square for each item in the snake's trail.
  for (let i = 0; i < trail.length; i++) {
    colorRect(trail[i].x * GRID_SIZE, trail[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE, "white");

    // If the snake's coordinates and any of the trail's coordinates are the same...
    if (trail[i].x == snakeX && trail[i].y == snakeY) {

      // ...set the snake's maximum length to 1.
      tail = 1;
    }
  }

  // Push the snake's coordinates into the trail.
  trail.push({x: snakeX, y: snakeY});

  // While the trail is longer than the maximum length...
  while (trail.length > tail) {

    // ...remove the coordinates from the end.
    trail.shift();
  }

  // If the apple's coordinates and the snake's coordinates are the same...
  if (appleX == snakeX && appleY == snakeY) {

    // ...increase the max trail length.
    tail++;

    // And choose a new random location for the apple.
    appleX = Math.floor(Math.random() * TILE_COUNT);
    appleY = Math.floor(Math.random() * TILE_COUNT);
  }

  // Draw a whiet square for the apple.
  colorRect(appleX * GRID_SIZE, appleY * GRID_SIZE, GRID_SIZE, GRID_SIZE, "white");
}

// Function to simplify drawing rectangles.
function colorRect(leftX, topY, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
}
