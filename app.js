const Game = require('./js/game.js');
const handleInput = require('./js/handle_input.js');

// A cross-browser requestAnimationFrame
// https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/

var requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

// The main game loop

let game = new Game({ctx: ctx, canvas: canvas, boardDimensions:
  [[0,0], [canvas.height, canvas.width]]});

	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;

	}, false);

	addEventListener("keyup", function (e) {
		if (e.keyCode === 83) {
			game.hero.shakeAssOff();
		}

		delete keysDown[e.keyCode];
	}, false);




var lastTime = Date.now();
main();

function main() {

    var dt = (Date.now() - lastTime);

    handleInput(game.hero, keysDown);
    game.update(dt);
    game.render();


    lastTime = Date.now();
    requestAnimationFrame(main);
}
