(function() {
  'use strict';
})();


$(document).on('keydown', function (event) {
  let key = event.which;
    // Allow user to use either directional arrows or WASD
  if ( (key == '37' || key == '65') && direction != 'right') {
    direction = 'left';
  } else if ( (key == '38' || key == '87') && direction != 'down') {
    direction = 'up';
  } else if ( (key == '39' || key == '68') && direction != 'left') { 
    direction = 'right';
  } else if ( (key == '40' || key == '83') && direction != 'up') {
    direction = 'down';
    // Check if 'm' has been pressed
  } else if (key == '77') {
    // Set 'muted' to true/false
    $($innerAudio).prop('muted', !$($innerAudio).prop('muted'));
  } 
});


const $audio = $('.audio');
const $innerAudio = $('.audio audio');
const $wrapper = $('.wrapper');
const $canvas = $('#canvas');
const $context = $canvas[0].getContext('2d');

// Global variable for click handler
let solidSnake = false;

// Global variables to update accordingly
let cellWidth = 15;
let direction;
let food;
let tail;
let snakeArray;

// Hide score from user until end, and increase speed as more 'food' is consumed 
let score;
let speed; 


// New width
function increaseWidth(incWidth) {
  $canvas.prop('width', incWidth);
  // Returns correct value 
  return $canvas.prop('width');
}

// New height
function increaseHeight(incHeight) {
  $canvas.prop('height', incHeight);
  // Returns correct value
  return $canvas.prop('height');
}


function runningGame(newSpeed, newWidth, newHeight){
  if (typeof gameLoop != 'undefined') {
    clearInterval(gameLoop);
  } 
  // Use anonymous function to pass several arguments from runningGame
  gameLoop = setInterval(function() {
    paint(newWidth, newHeight);
  }, newSpeed);
}


function start() {
  // Use Math.round() to 'round' to nearest integer . . .
    // 0 = false = 'right' . . . 1 = true = 'down'
  direction = Math.round(Math.random()) ? 'right' : 'down'; 
  createSnake();
  createFood();

  // Initial score/speed
  score = 0;
  speed = 125;

  // Initially, set speed to semi-high value so that player can
    // read directions and (hopefully) find the bonus
  runningGame(200, $canvas.width(), $canvas.height());
}

start();


function createSnake() {
  let length = 1; 
  snakeArray = [];
  // Subtract one so that snake starts in upper left
  snakeArray.push({x: length - 1, y:0});
}


function createFood() {
  food = {
    x: Math.round(Math.random() * ($canvas.width() - cellWidth) / cellWidth), 
    y: Math.round(Math.random() * ($canvas.height() - cellWidth) / cellWidth), 
  };
}


function randomHexColor() {
  return '#' + Math.random().toString(16).slice(2,8);
}


function paint(newWidth, newHeight) {
  if (solidSnake === false) {
    $context.fillStyle = '#fff';
    $context.fillRect(0, 0, newWidth, newHeight);
    $context.strokeStyle = '#000';
    $context.strokeRect(0, 0, newWidth, newHeight);

    // Changing background color will prevent tearing from increase in size
    $canvas.css('background', '#fff');
  } else {
    $context.fillStyle = '#000';
    $context.fillRect(0, 0, newWidth, newHeight);
    $context.strokeStyle = '#fff';
    $context.strokeRect(0, 0, newWidth, newHeight);

    // Same as above
    $canvas.css('background', '#000');
  }

  let numX = snakeArray[0].x;
  let numY = snakeArray[0].y;

  // Update 'direction' of snake, using switch
  switch (direction) {
    case 'right':
      numX++;
      break;
    case 'left':
      numX--;
      break;
    case 'up':
      numY--;
      break;
    case 'down':
      numY++;
      break;
  }
  
  // Check board/snake
  if (numX == -1 || numX == newWidth/cellWidth || numY == -1 || 
    numY == newHeight/cellWidth || collision(numX, numY, snakeArray)) {
    gameOver();
  }

  // Check if "eaten"
  if (numX == food.x && numY == food.y) {
    playAudio('http://soundbible.com/grab.php?id=2067&type=mp3');

    tail = {x: numX, y: numY};
    score++;
   
    // Increase speed of snake
    // Increase game board
  switch (score) {
    case 1:
      runningGame(speed, increaseWidth(315) , increaseHeight(315));
      break;
    case 5:
      runningGame(speed -= 5, increaseWidth(345), increaseHeight(345));
      break;
    case 10:
      runningGame(speed -= 5, increaseWidth(375), increaseHeight(375));
      break;
    case 15:
      runningGame(speed -= 5, increaseWidth(405), increaseHeight(405));
      break;
    case 20:
      runningGame(speed -= 5, increaseWidth(435), increaseHeight(435));
      break;
    case 25:
      runningGame(speed -= 5, increaseWidth(450), increaseHeight(450));
      break;
    case 50:
      runningGame(speed -= 25, increaseWidth(480), increaseHeight(480));
      break;
  }
  // Create more food after speed/size increase
  createFood();

  } else {
    tail = snakeArray.pop();
    tail.x = numX; 
    tail.y = numY;
  }

  snakeArray.unshift(tail); 
  
  for (let i = 0; i < snakeArray.length; i++) {
    let c = snakeArray[i];
    paintSnake(c.x, c.y);
  }
  
  paintSnake(food.x, food.y);
}


function paintSnake(x, y) {
  // Check if logo has not been clicked
  if (solidSnake === false) {
    $context.fillStyle = 'rgba(44, 155, 44, .9)';  
  } else {
    $context.fillStyle = randomHexColor();
  }
  
  $context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}


function collision(x, y, array) {
  for (let i = 0; i < array.length; i++) {
    if(array[i].x == x && array[i].y == y) {
      return true;
    }
  }
  return false;
}


$('.solidSnake').on('click', function () {
  if (solidSnake === false) {
    solidSnake = true;
    $(this).css('color', 'rgba(44, 155, 44, .85)');
  } else {
    solidSnake = false;
    $(this).css('color', '#fff');
  }
});


function gameOver() {
  const $gameOver = $('.gameOverWrapper');
  const $score = $('.score');

  $score.text(`Score: ${score}`);
  $gameOver.fadeIn(1500);
  clearInterval(gameLoop);

  playAudio('http://soundbible.com/grab.php?id=1986&type=mp3');
}


// Use sessionStorage object to log message to user
  // Message only reappears when user closes browser or opens new tab
if (sessionStorage.getItem('name') !== 'true') {
  $wrapper.append('<h3>Move with arrow keys or WASD.</h3>');
  $wrapper.children('h3').fadeOut(5000);

  setTimeout(function () {
    $wrapper.append('<h3>Press m to mute sounds.</h3>');
    $wrapper.children('h3').fadeOut(5000);
  }, 5000);
  sessionStorage.setItem('name', 'true');
}


function playAudio(audioURL) {
  $innerAudio.attr('src', audioURL);
  $innerAudio.prop('volume', 0.5);
  $innerAudio[0].play();
}
