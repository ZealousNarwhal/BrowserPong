//#region Variables
var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext("2d");

var FPS = 60;

var timeLastFrame = Date.now();
var deltaTime = 0;

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/FPS) };

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var playerObj = new Paddle(10, ((canvas.height / 2) - 40), 10, 80);
var OpponentObj = new Paddle((canvas.width - 20), ((canvas.height / 2) - 40), 10, 80);
var ballObj = new Ball(((canvas.width / 2) - 10), ((canvas.height / 2) - 10), 10);

var isPlayerMovingUp = false;
var isPlayerMovingDown = false;

var PlayerScore = 0;
var OpponentScore = 0;

//#endregion

//#region Objects
function Paddle(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
}

function Ball(x, y, radius)
{
    this.x = x;
    this.y = y;
    this.r = radius;
    this.velocityX = 3; 
    this.velocityY = 1; 
}

//#endregion

//#region Game Loop
window.onload = function()
{
    animate(step);
};

function keyDownHandler(e)
{
    if(e.key == "Up" || e.key == "ArrowUp") 
    {
        isPlayerMovingUp = true;
    }

    else if(e.key == "Down" || e.key == "ArrowDown") 
    {
        isPlayerMovingDown = true;
    }
};

function keyUpHandler(e)
{
    if(e.key == "Up" || e.key == "ArrowUp") 
    {
        isPlayerMovingUp = false;
    }

    else if(e.key == "Down" || e.key == "ArrowDown") 
    {
        isPlayerMovingDown = false;
    }
};

var step = function()
{
    update();
    draw();
    animate(step);
};

var update = function() 
{
    var currentTime = Date.now();
    deltaTime = currentTime - timeLastFrame;
    timeLastFrame = currentTime;
    UpdatePlayer();
    UpdateOpponent();
    UpdateBall();
};

var draw = function()
{
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    DrawFPS();
    DrawPaddles();
    DrawBall();
    DrawScore();
    context.closePath();
};
//#endregion

var DrawFPS = function()
{
    context.font = "10px Arial";
    context.fillStyle = "#aaa";
    context.fillText("FPS: " + Math.round(1000 / deltaTime), 10, 10);
    context.fill();
};

var DrawScore = function()
{
    context.font = "50px Arial";
    context.fillStyle = "#fff";
    context.fillText(PlayerScore, (canvas.width * 0.25), 60);
    context.fillText(OpponentScore, ((canvas.width * 0.75) - context.measureText(OpponentScore).width), 60);
    context.fill();
}

var DrawPaddles = function()
{
    context.rect(playerObj.x, playerObj.y, playerObj.w, playerObj.h);
    context.rect(OpponentObj.x, OpponentObj.y, OpponentObj.w, OpponentObj.h);
    context.fillStyle = "#fff";
    context.fill();
};

var DrawBall = function()
{
    context.arc(ballObj.x, ballObj.y, ballObj.r, 0, Math.PI*2, false);
    context.fillStyle = "#fff";
    context.fill();
};

var ResetBoard = function()
{
    playerObj.x = 10;
    playerObj.y = ((canvas.height / 2) - 40);

    OpponentObj.x = (canvas.width - 20);
    OpponentObj.y = ((canvas.height / 2) - 40);

    ballObj.x = ((canvas.width / 2) - 10);
    ballObj.y = ((canvas.height / 2) - 10);

    ballObj.velocityY = 1;
};

var UpdatePlayer = function()
{
    if(isPlayerMovingUp)
    {
        playerObj.y -= 3;
    }

    else if(isPlayerMovingDown)
    {
        playerObj.y += 3;
    }
};

var UpdateOpponent = function()
{
    OpponentObj.y = (ballObj.y - (OpponentObj.h / 2));
};

var UpdateBall = function()
{
    CheckBallCollision();
    UpdateBallPosition()
};

var CheckBallCollision = function()
{
    var ballPosX = (ballObj.x + ballObj.velocityX);
    var ballPosY = (ballObj.y + ballObj.velocityY);

    if((ballObj.x - ballObj.r - ballObj.velocityX) > (playerObj.x + playerObj.w) && //ball isn't touching padle
        (ballPosX - ballObj.r) < (playerObj.x + playerObj.w) && //ball will touch padle
        (ballPosY + ballObj.r) > playerObj.y &&
        (ballPosY - ballObj.r) < (playerObj.y + playerObj.h))
    {
        ballObj.velocityX = -ballObj.velocityX;

        if(isPlayerMovingUp)
        {
            ballObj.velocityY -= 1;
        }

        else if(isPlayerMovingDown)
        {
            ballObj.velocityY += 1;
        }
    }

    else if((ballObj.x + ballObj.r - ballObj.velocityX) < OpponentObj.x && //ball isn't touching padle
        (ballPosX + ballObj.r) > OpponentObj.x && //ball will touch padle
        (ballPosY + ballObj.r) > OpponentObj.y &&
        (ballPosY - ballObj.r) < (OpponentObj.y + OpponentObj.h))
    {
        ballObj.velocityX = -ballObj.velocityX;
    }

    if((ballPosY + ballObj.r) > canvas.height || (ballPosY - ballObj.r) < 0)
    {
        ballObj.velocityY = -ballObj.velocityY;
    }

    if((ballPosX + ballObj.r) > canvas.width)
    {
        PlayerScore++;
        ResetBoard();
    }

    else if((ballPosX - ballObj.r) < 0)
    {
        OpponentScore++;
        ResetBoard();
    }
};

var UpdateBallPosition = function()
{
    ballObj.x += ballObj.velocityX;
    ballObj.y += ballObj.velocityY;
};