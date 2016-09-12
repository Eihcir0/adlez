
const Hero = require('./hero.js');
const handleInput = require('./handle_input.js');
const Monster = require('./monster.js');

// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 812;
canvas.height = 512;
document.body.appendChild(canvas);

// Grab a reference to the canvas 2D context
var ctx = canvas.getContext("2d");
// Create the canvas



var render = function () {

	// Draw a green background. Pretend it's grass
	ctx.fillStyle = "rgb(51, 118, 36)";
	ctx.fillRect(330, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillRect(0,0, 330, 512);

	// Draw hero
	moveable.forEach(moveable => {
		if (moveable.imageReady) {

			// Determine which part of the sprite sheet to draw from


			// Render image to canvas
			ctx.drawImage(
				moveable.image,
				moveable.currentSprite(), 0, moveable.width, moveable.height,
				moveable.pos[0], moveable.pos[1], moveable.width,
				moveable.height
			);


		} else {
			// Image not ready. Draw a gray box
			ctx.fillStyle = "rgb(100, 100, 100)";
			ctx.fillRect(moveable.pos[0], moveable.pos[1],
				moveable.width, moveable.height);
		}

	});

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "30px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fontColor = "black";
	ctx.fillText("DEMO", 10, 32);
	ctx.fillText("arrow keys to move", 10, 62);
	ctx.fillText("spacebar: shakes ass", 10, 92);
	ctx.fillText("Monsters caught: " + monstersCaught, 10, 132);

};
// Main game loop
var main = function () {
	// Calculate time since last frame
	var now = Date.now();
	var delta = (now - last);
	moveable.forEach(moveable => moveable.update(delta));

	handleInput(hero, keysDown);

	// Render to the screen
	last = now;
	render();
	if (
		hero.pos[0] <= (monster.pos[0] + 32)
		&& monster.pos[0] <= (hero.pos[0] + 32)
		&& hero.pos[1] <= (monster.pos[1] + 32)
		&& monster.pos[1] <= (hero.pos[1] + 32)
	) {
		++monstersCaught;
		monster.pos = [(Math.random()*(canvas.width - 312))+312,
			(Math.random()*(canvas.height)) ];
	}
	// setTimeout(() => (requestAnimationFrame(main)), 70);

};

// Start the main game loop!
var hero = new Hero({name: "Johnny", boardDimensions: [[332,0],[812,512]]});
var monster = new Monster({pos: [350,200],
	boardDimensions: [[332,0],[812,512]]});

var moveable = [];
moveable.push(hero);
moveable.push(monster);
var last = Date.now();
var keysDown = {};
var monstersCaught = 0;
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	if (e.keyCode === 32) {
		hero.directionVector = [0,0];
		hero.updateDirection();
		hero.shakeAssOff();
	}
	delete keysDown[e.keyCode];
}, false);
setInterval(main, 1);




// var w = window;
// requestAnimationFrame = w.webkitRequestAnimationFrame
// || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// main();
