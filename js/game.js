
const Hero = require('./hero.js');
const handleInput = require('./handle_input.js');

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

	// Draw hero
	if (hero.imageReady) {

		// Determine which part of the sprite sheet to draw from


		// Render image to canvas
		ctx.drawImage(
			hero.image,
			hero.currentSprite(), 0, hero.width, hero.height,
			hero.pos[0], hero.pos[1], hero.width, hero.height
		);


	} else {
		// Image not ready. Draw a gray box
		ctx.fillStyle = "rgb(100, 100, 100)";
		ctx.fillRect(hero.pos[0], hero.pos[1], hero.width, hero.height);
	}

  // Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "30px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
  ctx.fontColor = "black";
	ctx.fillText("DEMO", 10, 32);
	ctx.fillText("arrow keys to move", 10, 62);
	ctx.fillText("spacebar: shakes ass", 10, 92);

};
// Main game loop
var main = function () {
	// Calculate time since last frame
	var now = Date.now();
	var delta = (now - last);

	hero.update(delta);
	handleInput(hero, keysDown);

	// Render to the screen
	last = now;
	render();
	// setTimeout(() => (requestAnimationFrame(main)), 70);

};

// Start the main game loop!
var hero = new Hero();
var last = Date.now();
var keysDown = {};
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
// var w = window;
// requestAnimationFrame = w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// main();
setInterval(main, 1);
