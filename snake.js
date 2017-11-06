// Initialise variables.
var canvas, ctx;

var snakeX = 0;
var snakeY = 0;
var buffer = [{x: 1, y: 0}];

var gridSizeX, gridSizeY;
var tileCountX, tileCounY;

var appleX, appleY;

var trail = [];
var tail = 1;

var gameover = false;

// Simplify resizing the canvas and the squares.
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gridSizeX = canvas.width / tileCountX;
  gridSizeY = canvas.height / tileCountY;
}

window.onload = function() {
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  // Work out how many squares of size 20 can fit in the window.
  tileCountX = Math.floor(window.innerWidth / 20);
  tileCountY = Math.floor(window.innerHeight / 20);

  // Set the canvas size to fill the window.
  resize();

  // Set the starting coordinates for the apple.
  appleX = Math.floor(Math.random() * tileCountX);
  appleY = Math.floor(Math.random() * tileCountY);

  // Update the canvas 15 times a second.
  let framesPerSecond = 15;
  setInterval(function() {
    update();
    draw();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", function() {
    if (gameover) {
      window.top.location.reload();
    }
  });

  // Resize the canvas when the window is resized.
  window.addEventListener("resize", resize);

  // Resize the canvas when the window is reoriented.
  window.addEventListener("resize", resize);

  // Push the next direction to the buffer.
  document.addEventListener("keydown", function(evt) {
    switch(evt.keyCode) {
      case 37:
        if (buffer[0].x != 1) {
          buffer.push({x: -1, y: 0});
        }
        break;

      case 38:
        if (buffer[0].y != 1) {
          buffer.push({x: 0, y: -1});
        }
        break;

      case 39:
        if (buffer[0].x != -1) {
          buffer.push({x: 1, y: 0});
        }
        break;

      case 40:
        if (buffer[0].y != -1) {
          buffer.push({x: 0, y: 1});
        }
        break;
    }
  });
}

function update() {

  // If the game is over, ignore the rest of the function.
  if (gameover) {
    return;
  }

  // Update the snake's coordinates.
  snakeX += buffer[0].x;
  snakeY += buffer[0].y;

  // If the buffer is longer than one...
  if (buffer.length > 1) {

    // ...remove the first entry.
    buffer.shift();
  }

  // Wrap the snake if it goes off of the canvas.
  if (snakeX < 0) {
    snakeX = tileCountX - 1;
  }
  
  if (snakeX > tileCountX - 1) {
    snakeX = 0;
  }

  if (snakeY < 0) {
    snakeY = tileCountY - 1;
  }

  if (snakeY > tileCountY - 1) {
    snakeY = 0;
  }

  // For each section of the snake's body...
  for (let i = 0; i < trail.length; i++) {

    // ...if the snake is longer than one...
    if (trail.length > 1) {

      // ...if the snake's head is touching it's body...
      if (snakeX == trail[i].x && snakeY == trail[i].y) {

        // ...set gameover to true.
        gameover = true;
      }
    }
  }

  // Push the snakes current x and y positions to the trail.
  trail.push({x: snakeX, y: snakeY});

  // Remove the old trail sections.
  while (trail.length > tail) {
    trail.shift();
  }

  // If the snake is on the same square as the apple...
  if (snakeX == appleX && snakeY == appleY) {

    // ...increase the maximum tail length...
    tail++;

    // ...and choose a new random square for the apple.
    appleX = Math.floor(Math.random() * tileCountX);
    appleY = Math.floor(Math.random() * tileCountY);
  }
}

function draw() {

  // Draw a black rectangle the size of the canvas to form the background.
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // If the game is over...
  if (gameover) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // ...print "Game over!" and the score in the middle of the screen.
    ctx.fillText("Game over!", canvas.width / 2, canvas.height / 3);
    ctx.fillText(tail, canvas.width / 2, canvas.height / 3 + 15);

    // Inform the user the can play again if they click the screen.
    ctx.fillText("Click to continue.", canvas.width / 2, canvas.height - canvas.height / 3);

    // Ignore the rest of the function.
    return;
  }

  // Draw a white rectangle for each section of the snake's tail.
  for (let i = 0; i < trail.length; i++) {
    colorRect(trail[i].x * gridSizeX, trail[i].y * gridSizeY, gridSizeX, gridSizeY, "white");
  }

  // Draw a white rectangle for the apple.
  colorRect(appleX * gridSizeX, appleY * gridSizeY, gridSizeX, gridSizeY, "white");

  // Draw the score in the top right corner.
  ctx.fillText(tail, 10, 20);
}

// Simplify drawing rectangles.
function colorRect(leftX, topY, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
}
