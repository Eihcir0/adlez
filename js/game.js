
const Hero = require('./hero.js');
const handleInput = require('./handle_input.js');
const Monster = require('./monster.js');
const Coin = require('./coin.js');

var w = window;
requestAnimationFrame = w.webkitRequestAnimationFrame
|| w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 812;
canvas.height = 512;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");



var render = function () {

	// Draw a green background. Pretend it's grass
	ctx.fillStyle = "rgb(51, 118, 36)";
	ctx.fillRect(330, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.fillRect(0,0, 330, 512);

	// Draw hero
	ctx.drawImage(
		hero.image,
		hero.currentSprite(), 0, hero.width, hero.height,
		hero.pos[0], hero.pos[1], hero.width,
		hero.height
	);


	ctx.drawImage(
		monster.image,
		monster.currentSprite(), 0, monster.width, monster.height,
		monster.pos[0], monster.pos[1], monster.width,
		monster.height
	);

	for (var i = 0; i < coins.length; i++) {
		let coin = coins[i];

	ctx.drawImage(
		coin.image,
		coin.currentSprite(), 0, coin.width, coin.height,
		coin.pos[0], coin.pos[1], coin.width,
		coin.height
	);}

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
	ctx.fillText("Coins: " + coinsTaken, 10, 152);

};
// Main game loop
var main = function () {
	// Calculate time since last frame
	var now = Date.now();
	var delta = (now - last);
	var newCoins = coins.slice(0);
	for (var i = 0; i < coins.length; i++) {
		coins[i].update(delta);
		if (coins[i].done) {
			newCoins.splice(i,1);
		}
	coins = newCoins;
	}
	hero.update(delta);
	monster.update(delta);

	handleInput(hero, keysDown);

	last = now;
	render();
		// replace below with collision detection
	if (
		hero.pos[0] <= (monster.pos[0] + 32)
		&& monster.pos[0] <= (hero.pos[0] + 32)
		&& hero.pos[1] <= (monster.pos[1] + 32)
		&& monster.pos[1] <= (hero.pos[1] + 32)
	) {
		++monstersCaught;
		monster.sound.play();
		monster.pos = [(Math.random()*(canvas.width - 312))+312,
			(Math.random()*(canvas.height)) ];
	}

	for (var i = 0; i < coins.length; i++) {
		let coin = coins[i];
		if (
			hero.pos[0] <= (coin.pos[0] + 32)
			&& coin.pos[0] <= (hero.pos[0] + 32)
			&& hero.pos[1] <= (coin.pos[1] + 32)
			&& coin.pos[1] <= (hero.pos[1] + 32)
			&& (!coin.taken)
		) {
			coin.taken = true;
			coin.sound.play();
			++coinsTaken;
		}
		}


	requestAnimationFrame(main);

};

// Start the main game loop!
var hero = new Hero({name: "Johnny", boardDimensions: [[332,0],[812,512]]});
var monsters = [];
var coins = [];
var monster = new Monster({pos: [350,200],
	boardDimensions: [[332,0],[812,512]]});
monsters.push(monster);
for (var i = 0; i < 10; i++) {
	var coin = new Coin({ boardDimensions: [[332,0],[812,512]]});
	coin.pos = [(Math.random()*(canvas.width - 312))+312,
		(Math.random()*(canvas.height)) ];
	coins.push(coin);
}
var last = Date.now();
var keysDown = {};
var monstersCaught = 0;
var coinsTaken = 0;
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	if (e.keyCode === 32) {
		hero.directionVector = [0,0];
		hero.animDelay = 200;
		hero.updateDirection();
		hero.shakeAssOff();
	}
	delete keysDown[e.keyCode];
}, false);
main();
