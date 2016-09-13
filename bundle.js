/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	const Hero = __webpack_require__(1);
	const handleInput = __webpack_require__(3);
	const Monster = __webpack_require__(4);
	const Coin = __webpack_require__(5);
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const MOVES = {
	  "N"    : [ 0,-1],
	  "S"    : [ 0, 1],
	  "E"    : [ 1, 0],
	  "W"    : [-1, 0],
	  "NE"   : [ 1,-1],
	  "NW"   : [-1,-1],
	  "SE"   : [ 1, 1],
	  "SW"   : [-1, 1],
	  "STOP" : [ 0, 0]
	};
	
	const Moveable = __webpack_require__(2);
	
	class Hero extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.name = obj.name;
	    this.width = 32;
	    this.height = 32;
	    this.shakingAss = false;
	    this.speed = 200;
	    this.directionVector = [0,0];
	    this.animSet = 4;
	    this.animFrame = 0;
	    this.animNumFrames = 2;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/hero_sheet.png";
	    this.image.onload = () => (this.imageReady = true);
	
	
	    this.posCenter();
	    this.updateDirection();
	  }
	
	  face(dir) {
	    this.directionVector = MOVES[dir];
	    this.updateDirection();
	    this.updateAnimSet();
	  }
	
	  shakeAssOn() {
	    this.shakingAss = true;
	    this.directionVector = [0,0];
	    this.animDelay = 50;
	
	  }
	
	  shakeAssOff() {
	    this.shakingAss = false;
	    this.directionVector = [0,0];
	    this.animSet = 4;
	    this.animDelay = 200;
	
	  }
	
	
	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;
	      if (this.direction!=="STOP" || this.shakingAss) {
	          ++this.animFrame;
	      if (this.animFrame >= this.animNumFrames) {
	          this.animFrame = 0;
	        }
	      }
	    }
	  }
	
	}
	
	module.exports = Hero;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const MOVES = {
	  "N"    : [ 0,-1],
	  "S"    : [ 0, 1],
	  "E"    : [ 1, 0],
	  "W"    : [-1, 0],
	  "NE"   : [ 1,-1],
	  "NW"   : [-1,-1],
	  "SE"   : [ 1, 1],
	  "SW"   : [-1, 1],
	  "STOP" : [ 0, 0]
	};
	
	const DIAGS = ["NE","NW","SE","SW"];
	
	class Moveable {
	  constructor(obj = {boardDimensions: [[332,0],[812,512]]}) {
	    this.boardDimensions = obj.boardDimensions;
	    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
	    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];
	
	  }
	
	
	  posCenter() {
	    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
	    + 166 - (this.width / 2));
	    var yyy = Math.floor((this.boardHeight / 2) - (this.width / 2));
	    this.pos = [xxx,yyy];
	  }
	
	
	
	  stop() {
	    this.directionVector = [0,0];
	  }
	
	  updateDirection() {
	    let x = this.directionVector[0];
	    let y = this.directionVector[1];
	    Object.keys(MOVES).forEach((key) => {
	      if (MOVES[key][0]===x && MOVES[key][1]===y) {
	        this.direction = key;
	      }
	    });
	
	  }
	
	
	  currentSprite() {
	    return (
	      (this.animSet * (this.width * this.animNumFrames)) +
	      (this.animFrame * this.width)
	    );
	  }
	
	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.direction;
	    if (d === "N") {
	      this.animSet = 0;
	    } else if (d === "NE") {
	      this.animSet = 1;
	    } else if (d === "E") {
	      this.animSet = 2;
	    } else if (d==="SE") {
	      this.animSet = 3;
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 4;
	    } else if (d==="SW") {
	      this.animSet = 5;
	    } else if (d==="W") {
	      this.animSet = 6;
	    } else if (d==="NW") {
	      this.animSet = 7;
	    }
	  }
	
	  update(elapsed) {
	    this.updateAnim(elapsed);
	    this.move(elapsed);
	
	  }
	
	
	  move(elapsed) {
	    let newPos = this.pos;
	    var move = (this.speed * (elapsed / 1000));
	    let speedFactor;
	
	    if (DIAGS.includes(this.direction)) { //reduce diag velocity
	      speedFactor = 0.75;
	    } else {
	      speedFactor=1;
	    }
	
	
	    newPos[0] += Math.round(move *  this.directionVector[0]);
	    newPos[1] += Math.round(move * speedFactor * this.directionVector[1]);
	
	    this.pos = newPos;
	    this.preventOutOfBounds();
	  }
	
	  preventOutOfBounds() {
	    let northern = this.boardDimensions[0][1];
	    let western = this.boardDimensions[0][0];
	    let southern = this.boardDimensions[1][1] - this.height;
	    let eastern = this.boardDimensions[1][0] - this.width;
	    this.pos[0] = Math.max(this.pos[0], western);
	    this.pos[0] = Math.min(this.pos[0], eastern);
	    this.pos[1] = Math.max(this.pos[1], northern);
	    this.pos[1] = Math.min(this.pos[1], southern);
	  }
	
	} //end class
	
	module.exports = Moveable;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const handleInput = function (hero, keysDown) {
	
		// Stop moving the hero
		hero.stop();
		if (hero.shakingAss) {hero.face("N");}
	
	
		if (37 in keysDown) { // Left
			hero.face("W");
		}
	
		if (38 in keysDown) { // Up
			hero.face("N");
		}
	
		if (32 in keysDown) { // space
	    hero.shakeAssOn();
	
		}
	
		if (39 in keysDown) { // Right
			hero.face("E");
		}
	
		if (40 in keysDown) { // Down
			hero.face("S");
		}
	
		if (38 in keysDown && 39 in keysDown) { // Up/Right
			hero.face("NE");
		}
	
		if (38 in keysDown && 37 in keysDown) { // Up/Left
			hero.face("NW");
		}
	
		if (40 in keysDown && 39 in keysDown) { // Down/Right
			hero.face("SE");
		}
	
		if (40 in keysDown && 37 in keysDown) { // Down/Left
			hero.face("SW");
		}
	
	
	
	};
	
	module.exports = handleInput;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(2);
	
	const MOVES = {
	  "N"    : [ 0,-1],
	  "S"    : [ 0, 1],
	  "E"    : [ 1, 0],
	  "W"    : [-1, 0],
	  "NE"   : [ 1,-1],
	  "NW"   : [-1,-1],
	  "SE"   : [ 1, 1],
	  "SW"   : [-1, 1],
	  "STOP" : [ 0, 0]
	};
	
	
	class Monster extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.width = 32;
	    this.height = 32;
	    this.shakingAss = false;
	    this.pos = obj.pos;
	    this.speed = 100;
	    this.directionVector = [1,0];
	    this.animSet = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 1;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src = "./images/monster.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.movements = ["E","E","E","E","E","E","N", "N", "W", "W", "W", "W", "W", "W", "S","S","S"];
	    this.sound =
	    new Audio('./images/smb_bowserfire.wav');
	    this.currentMovement = 0;
	    this.numMovements = 17;
	
	  }
	
	  face(dir) {
	    this.directionVector = MOVES[dir];
	    this.updateDirection();
	  }
	
	
	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer > this.animDelay) {
	      this.animTimer = 0;
	      if (this.direction!=="STOP") {
	          ++this.animFrame;
	          ++this.currentMovement;
	          if (this.currentMovement >= this.numMovements - 1) {
	            this.currentMovement = 0;
	          }
	          this.face(this.movements[this.currentMovement]);
	      if (this.animFrame >= this.animNumFrames) {
	          this.animFrame = 0;
	        }
	      }
	    }
	  }
	}
	
	module.exports = Monster;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(2);
	
	class Coin extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.width = 32;
	    this.height = 32;
	    this.pos = obj.pos;
	    this.taken = false;
	    this.done = false;
	    this.speed = 0;
	    this.directionVector = [0,0];
	    this.animSet = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 8;
	    this.animDelay = 50;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.sound =
	    new Audio('./images/smb_1-up.wav');
	    this.image = new Image();
	    this.image.src =
	    "./images/spinning_coin_gold.png";
	    this.image.onload = () => (this.imageReady = true);
	  }
	
	  updateAnim(elapsed) {
	    if (this.taken) {
	      this.animTimer += elapsed;
	      if (this.animTimer >= this.animDelay) {
	        this.animTimer = 0;
	        ++this.animFrame;
	        this.pos[1] -= 3;
	        if (this.animFrame >= this.animNumFrames) {
	            this.done = true;}
	      }
	    }
	  }
	}
	
	module.exports = Coin;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map