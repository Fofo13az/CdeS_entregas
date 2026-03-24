"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

let playerSpeed = 0.5;
let ballSpeed = 0.5;


//Class Ball
class Ball extends GameObject{
    constructor(position, width, height, color, sheetCols){
        super(position, width, height, color, 'ball', sheetCols);
        this.velocity = new Vector(0, 0);
    }
    update(deltaTime){
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset(){
        this.position = new Vector(canvasWidth/2, canvasHeight/2);
        this.velocity = new Vector(0, 0);
    }

    serve(){
        let angle = Math.random() * Math.PI/2 - (Math.PI/4);
        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        if (Math.random() > 0.5){
            this.velocity.x *= -1;
        }
    }

}
// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
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
        // TODO: Normalize the velocity to avoid greater speed on diagonals

        this.velocity = this.velocity.normalize().times(playerSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        // Left border
        }
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        // Bottom border
        }
        if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
        // Right border
        }
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        this.pointsRight = 0;
        this.pointsLeft = 0;
    }

    initObjects() {
        // Add another object to draw a background
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight, "black");

        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 10, 200, "red");
        //this.paddlleLeft.setSprite("../assets/sprites/link_front.png");
        this.paddleRight = new Paddle(new Vector(canvasWidth - 50, canvasHeight / 2), 10, 200, "blue");
        this.ball = new Ball(new Vector(canvasWidth/2, canvasHeight/2), 20, 20, "white");

        this.barrierTop = new GameObject(new Vector(canvasWidth/2, 0), canvasWidth, 20);
        this.barrierBottom = new GameObject(new Vector(canvasWidth/2, canvasHeight), canvasWidth, 20);

        this.goalLeft = new GameObject(new Vector(0, canvasHeight/2), 20, canvasHeight, "green");
        this.goalRight = new GameObject(new Vector(canvasWidth, canvasHeight/2), 20, canvasHeight, "green");

        this.pointsTextLeft = new TextLabel(canvasWidth/4, 80, "20px Ubuntu Mono", "white");
        this.pointsTextRight = new TextLabel(canvasWidth/4 * 3, 80, "20px Ubuntu Mono", "white");
    }

    draw(ctx) {
        // Draw the background first, so everything else is drawn on top
        this.background.draw(ctx);

        this.paddleLeft.draw(ctx);
        this.paddleRight.draw(ctx);
        this.ball.draw(ctx);
        this.barrierTop.draw(ctx);
        this.barrierBottom.draw(ctx);
        this.goalLeft.draw(ctx);
        this.goalRight.draw(ctx);

        this.pointsTextLeft.draw(ctx, this.pointsLeft);
        this.pointsTextRight.draw(ctx, this.pointsRight);

    }

    update(deltaTime) {
        // Move the paddle
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);

        this.ball.update(deltaTime);

        if (boxOverlap(this.ball, this.barrierTop) || boxOverlap(this.ball, this.barrierBottom)){
            this.ball.velocity.y *= -1;
        }
        if (boxOverlap(this.ball, this.paddleLeft) || boxOverlap(this.ball, this.paddleRight)){
            this.ball.velocity.x *= -1;
        }

        if(boxOverlap(this.ball, this.goalLeft)){
            this.pointsRight += 1;
            this.ball.reset();
        }

        if(boxOverlap(this.ball, this.goalRight)){
            this.pointsLeft += 1;
            this.ball.reset();
        }

    }


    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.addKey('up', this.paddleLeft);
            } else if (event.key == 'ArrowUp') {
                this.addKey('up', this.paddleRight); 
            }else if (event.key == 's') {
                this.addKey('down', this.paddleLeft);
            } else if (event.key == 'ArrowDown') {
                this.addKey('down', this.paddleRight); 
            }

            if (event.code == 'Space'){
                this.ball.serve();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up', this.paddleLeft);
            } else if (event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            }else if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            } else if (event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight); 
            }
        });

    }

    //Listeners for left Paddle
    addKey(direction, paddle) {
        if (!paddle.keys.includes(direction)) {
            paddle.keys.push(direction);
        }
    }

    delKey(direction, paddle) {
        if (paddle.keys.includes(direction)) {
            paddle.keys.splice(paddle.keys.indexOf(direction), 1);
        }
    }
}


// Starting function that will be called from the HTML page
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


// Main loop function to be called once per frame
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