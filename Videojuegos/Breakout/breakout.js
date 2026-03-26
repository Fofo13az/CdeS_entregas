"use strict";

const canvasWidth = 800;
const canvasHeight = 800;

let ctx;
let game;

let oldTime = 0; 
let playerSpeed = 0.5;
let ballSpeed = 0.4;

// Block grid configuration
const blockRows = 7;
const blockCols = 8;
const blockWidth = 88;
const blockHeight = 25;
const blockPadding = 10;
const blockOffsetTop = 50;
const blockOffsetLeft = (canvasWidth - (blockCols * (blockWidth + blockPadding) - blockPadding)) / 2;

//Ball
class Ball extends GameObject{
    constructor(position, width, height, color, sheetCols){
        super(position, width, height, color, 'ball', sheetCols);
        this.velocity = new Vector(0, 0);
    }
    update(deltaTime){
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
    }

    

    serve(){
        // Random angle between 45°-70° or 110°-135° (avoids straight down)
        let angle = Math.PI/4 + Math.random() * (25 * Math.PI/180);

        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        if (Math.random() > 0.5){
            this.velocity.x *= -1;
        }
    }

    reset(){
        this.position = new Vector(canvasWidth/2, canvasHeight/2);
        this.velocity = new Vector(0, 0);
    }

    clampWithinCanvas() {
        //Left border
        if (this.position.x - this.halfSize.x < 0) {
            this.velocity.x *= -1;
        }
        //Right border
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.velocity.x *= -1;
        }
        //Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.velocity.y *= -1;
        }

        
    }

}

//Player
class Player extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            right: {
                axis: "x",
                sign: 1,
            },
            left: {
                axis: "x",
                sign: -1,
            },
        }

        // Keys pressed to move the player
        this.keys = [];
    }

    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }

        this.velocity = this.velocity.normalize().times(playerSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        //Left border
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        }
        //Right border
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}


class Game {
    constructor() {
        this.pointsStr = "Points: ";
        this.points = 0;
        this.livesStr = "Lives: ";
        this.lives = 3;
        this.youStr = "You";
        this.loseStr = "Lose!";
        this.winStr = "Win!";
        this.restartStr = "Press 'r' to restart"

        this.playerSize = 200;

        this.gameOver = false;
        this.gameRestart = false;

        this.audio = document.createElement("audio");
        this.audio.src = "audio/4387__noisecollector__pongblipe4.wav";

        this.createEventListeners();
        this.initObjects(this.playerSize);


    }

    initObjects(playerSize) {
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight, "black");

        this.player = new Player(new Vector(canvasWidth/2, canvasHeight - 50), playerSize, 20, "yellow");

        this.ball = new Ball(new Vector(canvasWidth/2, canvasHeight/2), 20, 20, "white");

        this.blocks = [];
        for (let row = 0; row < blockRows; row++) {
            for (let col = 0; col < blockCols; col++) {
                let x = blockOffsetLeft + col * (blockWidth + blockPadding) + blockWidth / 2;
                let y = blockOffsetTop + row * (blockHeight + blockPadding) + blockHeight / 2;
                let block = new GameObject(new Vector(x, y), blockWidth, blockHeight, "red");
                block.isBroken = false;
                this.blocks.push(block);
            }
        }

        this.pointsStrText = new TextLabel(canvasWidth/8 - 80, 35, "35px Courier New", "white");
        this.pointsText = new TextLabel(canvasWidth/8 + 70, 35, "35px Courier New", "white");

        this.livesStrText = new TextLabel(canvasWidth - canvasWidth/8 - 80, 35, "35px Courier New", "white");
        this.livesText = new TextLabel(canvasWidth - canvasWidth/8 + 50, 35, "35px Courier New", "white");

        this.youText = new TextLabel(canvasWidth/2 - 115, canvasHeight/2 - 50, "120px Courier New", "white");
        this.loseText = new TextLabel(canvasWidth/2 - 165, canvasHeight/2 + 50, "120px Courier New", "white");
        this.winText = new TextLabel(canvasWidth/2 - 130, canvasHeight/2 + 50, "120px Courier New", "white");
        this.restartText = new TextLabel(canvasWidth/2 - 180, canvasHeight - 50, "30px Courier New", "white");

    }

    initPlayer(size){
        
    }

    draw(ctx) {
        // Draw the background first, so everything else is drawn on top
        this.background.draw(ctx);

        if (!this.gameOver){
            this.player.draw(ctx);

            for (let block of this.blocks) {
                if (block.isBroken == false){
                    block.draw(ctx);
                }
            }

            this.ball.draw(ctx);

            this.pointsStrText.draw(ctx, this.pointsStr);
            this.pointsText.draw(ctx, this.points);

            this.livesStrText.draw(ctx, this.livesStr);
            this.livesText.draw(ctx, this.lives);
        }
        else if (this.lives >= 0 && this.points < this.blocks.length){
            this.youText.draw(ctx, this.youStr);
            this.loseText.draw(ctx, this.loseStr);
            this.restartText.draw(ctx, this.restartStr);
        }
        else {
            this.youText.draw(ctx, this.youStr);
            this.winText.draw(ctx, this.winStr);
            this.restartText.draw(ctx, this.restartStr);
        }
    }

    update(deltaTime) {
        // Move
        this.player.update(deltaTime);
        this.ball.update(deltaTime);
        
        //Ball bounce on player
        if (boxOverlap(this.ball, this.player)){
            this.ball.velocity.y *= -1;
            this.audio.play();
        }

        //Block destroy and game win logic
        for (let block of this.blocks){
            if (!block.isBroken && boxOverlap(this.ball, block)){
                block.isBroken = true;
                this.ball.velocity.y *= -1;
                this.ball.position.y += this.ball.velocity.y * 10; //Move ball to avoid multiple block destruction
                this.points ++;
                if (this.points % blockCols == 0) {
                    if (this.playerSize > 50) {
                        this.playerSize -= 30;
                        this.player = new Player(new Vector(this.player.position.x, canvasHeight - 50), this.playerSize, 20, "yellow");
                    }
                    if (playerSpeed < 0.8) playerSpeed += 0.07;
                    if (ballSpeed < 0.7) ballSpeed += 0.07;
                }
                if (this.points >= this.blocks.length){
                    this.gameOver = true;
                }

                this.audio.play();
            }
        }

        //Life loss and Game over logic
        if (this.ball.position.y - this.ball.halfSize.y > canvasHeight) {
            this.ball.reset();
            this.lives --;
            if (this.lives <= 0){
                this.gameOver = true;
            }
        }

        //Game restart logic
        if (this.gameRestart){
            this.lives = 3;
            this.points = 0;
            this.playerSize = 200;
            playerSpeed = 0.5;
            ballSpeed = 0.4;
            this.gameOver = false;
            this.gameRestart = false;
            this.initObjects(this.playerSize);
        }


    }


    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'd') {
                this.addKey('right', this.player);
            }
            else if (event.key == 'a') {
                this.addKey('left', this.player);
            }

            if (event.code == 'Space'){
                this.ball.serve();
            }

            if (this.gameOver){
                if (event.key == 'r'){
                    this.gameRestart = true;
                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'd') {
                this.delKey('right', this.player);
            }
            else if (event.key == 'a') {
                this.delKey('left', this.player);
            }
        });

    }

    //Listeners for player
    addKey(direction, player) {
        if (!player.keys.includes(direction)) {
            player.keys.push(direction);
        }
    }

    delKey(direction, player) {
        if (player.keys.includes(direction)) {
            player.keys.splice(player.keys.indexOf(direction), 1);
        }
    }
}

// Main
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}

function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}