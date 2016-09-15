
const Hero = require('./hero.js');
const handleInput = require('./handle_input.js');
const Monster = require('./monster.js');
const Monster2 = require('./monster2.js');
const Coin = require('./coin.js');
const Fireball = require('./fireball.js');

var requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 512;
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
		hero.currentSprite(), hero.spriteVertOffset*hero.height, hero.width, hero.height,
		hero.pos[0], hero.pos[1], hero.width,
		hero.height
	);

	for (var i = 0; i < fireballs.length; i++) {

		ctx.drawImage(
			fireballs[i].image,
			fireballs[i].currentSprite(), fireballs[i].spriteVertOffset*fireballs[i].height, fireballs[i].width, fireballs[i].height,
			fireballs[i].pos[0], fireballs[i].pos[1], fireballs[i].width,
			fireballs[i].height
		);
	}


	for (var i = 0; i < coins.length; i++) {
		let coin = coins[i];

		ctx.drawImage(
			coin.image,
			coin.currentSprite(), 0, coin.width, coin.height,
			coin.pos[0], coin.pos[1], coin.width,
			coin.height
		);}
	for (var i = 0; i < monsters.length; i++) {
		ctx.drawImage(
			monsters[i].image,
			monsters[i].currentSprite(), monsters[i].spriteVertOffset, monsters[i].width, monsters[i].height,
			monsters[i].pos[0], monsters[i].pos[1], monsters[i].width,
			monsters[i].height
		);
	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "30px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fontColor = "black";
	ctx.fillText("DEMO", 10, 32);
	ctx.fillText("arrow keys to move", 10, 62);
	ctx.fillText("'S': shakes ass", 10, 92);
	ctx.fillText("Monsters caught: " + monstersCaught, 10, 132);
	ctx.fillText("Coins: " + coinsdying, 10, 162);

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
	for (var i = 0; i < monsters.length; i++) {
		monsters[i].update(delta);
	}

	for (var i = 0; i < fireballs.length; i++) {

		fireballs[i].update(delta);
	}

	handleInput(hero, keysDown);
	if (hero.newFireball) {
		if (Date.now() - hero.lastFireball > 1000) {
			hero.newFireball = false;
			hero.lastFireball = Date.now();
			fireballs.push(new Fireball(
				{pos: hero.pos, directionVector: hero.lastDir, boardDimensions: [[332,0],[812,512]]}
			));
		}
	}
	last = now;
	render();
	var currMonster;
		// replace below with collision detection
	for (var i = 0; i < monsters.length; i++) {
		currMonster = monsters[i];

		if (
			hero.pos[0] <= (currMonster.pos[0] + 32)
			&& currMonster.pos[0] <= (hero.pos[0] + 32)
			&& hero.pos[1] <= (currMonster.pos[1] + 32)
			&& currMonster.pos[1] <= (hero.pos[1] + 32)
		) {
			++monstersCaught;
			currMonster.sound.play();
			currMonster.pos = [(Math.random()*(canvas.width - 312))+312,
				(Math.random()*(canvas.height)) ];
		}
	}
	for (var i = 0; i < coins.length; i++) {
		let coin = coins[i];
		if (
			hero.pos[0] <= (coin.pos[0] + 32)
			&& coin.pos[0] <= (hero.pos[0] + 32)
			&& hero.pos[1] <= (coin.pos[1] + 32)
			&& coin.pos[1] <= (hero.pos[1] + 32)
			&& (!coin.dying)
		) {
			coin.dying = true;
			coin.sound.play();
			++coinsdying;
		}
		}


	requestAnimationFrame(main);

};

// Start the main game loop!
var hero = new Hero({name: "Johnny", boardDimensions: [[332,0],[812,512]]});
var monsters = [];
var coins = [];
var fireballs = [];
var monster = new Monster({pos: [350,200],
	boardDimensions: [[332,0],[812,512]]});
monsters.push(monster);
var monster2 = new Monster2({pos: [550,200],
	boardDimensions: [[332,0],[812,512]]});
monsters.push(monster2);
for (var i = 0; i < 10; i++) {
	var coin = new Coin({ boardDimensions: [[332,0],[812,512]]});
	coin.pos = [(Math.random()*(canvas.width - 312))+312,
		(Math.random()*(canvas.height)) ];
	coins.push(coin);
}
var last = Date.now();
var keysDown = {};
var monstersCaught = 0;
var coinsdying = 0;
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	if (e.keyCode === 83) {
		hero.directionVector = [0,0];
		hero.animDelay = 200;
		hero.updateDirection();
		hero.shakeAssOff();
	}
	delete keysDown[e.keyCode];
}, false);
main();
