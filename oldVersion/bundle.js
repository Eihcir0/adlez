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
	const Monster2 = __webpack_require__(5);
	const Coin = __webpack_require__(6);
	const Fireball = __webpack_require__(7);
	
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
	
	const DIAGS = ["NE","NW","SE","SW"];
	const Moveable = __webpack_require__(2);
	
	class Hero extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.newFireball = false;
	    this.lastFireball = Date.now();
	    this.lastDir = [0,-1];
	    this.name = "HERO";
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
	
	    this.spriteVertOffset = 0;
	    this.posCenter();
	    this.updateDirection();
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
	    if (this.direction !== "STOP") {
	    this.lastDir = this.directionVector;}
	    this.directionVector = [0,0];
	    this.updateDirection();
	
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
	
	
	
	  update(elapsed) {
	    this.updateAnim(elapsed);
	    this.move(elapsed);
	
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
	
		if (83 in keysDown) { // S
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
		if (32 in keysDown) { // space
			hero.newFireball = true;
		}
	
	
	};
	
	module.exports = handleInput;


/***/ },
/* 4 */
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
	
	const DIAGS = ["NE","NW","SE","SW"];
	
	const Moveable = __webpack_require__(2);
	
	class Monster extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.pos = obj.pos;
	    this.name = "MONSTER";
	    this.width = 32;
	    this.height = 32;
	    this.speed = 200;
	    this.directionVector = [0,1];
	    this.spriteVertOffset = 32;
	    this.animSet = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 3;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "/Users/Eihcir0/Desktop/my_little_rpg/images/monsters-32x32.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.sound =
	    new Audio('./images/smb_bowserfire.wav');
	    this.movements = ["E","E","E","E","E","E","N", "N", "W", "W", "W", "W", "W", "W", "S","S","S"];
	    this.currentMovement = 0;
	    this.numMovements = 17;
	    this.updateDirection();
	  }
	
	  face(dir) {
	    this.directionVector = MOVES[dir];
	    this.updateDirection();
	    this.updateAnimSet();
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
	      this.animSet = 2;
	    } else if (d === "NE") {
	      this.animSet = 2;
	    } else if (d === "E") {
	      this.animSet = 1;
	    } else if (d==="SE") {
	      this.animSet = 0;
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 0;
	    } else if (d==="SW") {
	      this.animSet = 0;
	    } else if (d==="W") {
	      this.animSet = 3;
	    } else if (d==="NW") {
	      this.animSet = 2;
	    }
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
	
	
	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;
	      if (this.direction!=="STOP" ) {
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
	
	const Moveable = __webpack_require__(2);
	
	class Monster2 extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.pos = obj.pos;
	    this.name = "MONSTER2";
	    this.width = 32;
	    this.height = 32;
	    this.speed = 200;
	    this.spriteVertOffset = 64;
	    this.directionVector = [0,1];
	    this.animSet = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 3;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "/Users/Eihcir0/Desktop/my_little_rpg/images/monsters-32x32.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.sound =
	    new Audio('./images/smb_bowserfire.wav');
	    this.movements = ["S","S","S","S","S","S","E", "E", "N", "N", "N", "N", "N", "N", "W","W","W"];
	    this.currentMovement = 0;
	    this.numMovements = 17;
	    this.updateDirection();
	  }
	
	  face(dir) {
	    this.directionVector = MOVES[dir];
	    this.updateDirection();
	    this.updateAnimSet();
	  }
	
	  currentSprite() {
	    return (
	      (this.animSet * (this.width * this.animNumFrames)) +
	      (this.animFrame * this.width)
	    );
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
	
	
	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.direction;
	    if (d === "N") {
	      this.animSet = 2;
	    } else if (d === "NE") {
	      this.animSet = 2;
	    } else if (d === "E") {
	      this.animSet = 1;
	    } else if (d==="SE") {
	      this.animSet = 0;
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 0;
	    } else if (d==="SW") {
	      this.animSet = 0;
	    } else if (d==="W") {
	      this.animSet = 3;
	    } else if (d==="NW") {
	      this.animSet = 2;
	    }
	  }
	
	
	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;
	      if (this.direction!=="STOP" ) {
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
	
	module.exports = Monster2;


/***/ },
/* 6 */
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
	
	const DIAGS = ["NE","NW","SE","SW"];
	
	class Coin extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.width = 32;
	    this.height = 32;
	    this.pos = obj.pos;
	    this.dying = false;
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
	  currentSprite() {
	    return (
	      (this.animSet * (this.width * this.animNumFrames)) +
	      (this.animFrame * this.width)
	    );
	  }
	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.direction;
	    if (d === "N") {
	      this.animSet = 2;
	    } else if (d === "NE") {
	      this.animSet = 2;
	    } else if (d === "E") {
	      this.animSet = 1;
	    } else if (d==="SE") {
	      this.animSet = 0;
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 0;
	    } else if (d==="SW") {
	      this.animSet = 0;
	    } else if (d==="W") {
	      this.animSet = 3;
	    } else if (d==="NW") {
	      this.animSet = 2;
	    }
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
	
	
	  updateAnim(elapsed) {
	    if (this.dying) {
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


/***/ },
/* 7 */
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
	
	const DIAGS = ["NE","NW","SE","SW"];
	
	const Moveable = __webpack_require__(2);
	
	class Fireball extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.name = "FIREBALL";
	    this.pos = obj.pos;
	    this.width = 64;
	    this.height = 64;
	    this.speed = 500;
	    this.directionVector = obj.directionVector;
	    this.animSet = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 4;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/fireball_0.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.done = false;
	
	    this.updateDirection();
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
	      this.spriteVertOffset = 2;
	    } else if (d === "NE") {
	      this.animSet = 0;
	      this.spriteVertOffset = 3;
	    } else if (d === "E") {
	      this.animSet = 0;
	      this.spriteVertOffset = 4;
	    } else if (d==="SE") {
	      this.animSet = 0;
	      this.spriteVertOffset = 5;
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 0;
	      this.spriteVertOffset = 6;
	    } else if (d==="SW") {
	      this.animSet = 0;
	      this.spriteVertOffset = 7;
	    } else if (d==="W") {
	      this.animSet = 0;
	      this.spriteVertOffset = 0;
	    } else if (d==="NW") {
	      this.animSet = 0;
	      this.spriteVertOffset = 1;
	    }
	  }
	
	
	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;
	      if (this.direction!=="STOP") {
	          ++this.animFrame;
	      if (this.animFrame >= this.animNumFrames) {
	          this.animFrame = 0;
	        }
	      }
	    }
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
	    if (this.pos[0] <= western || this.pos[0] >= eastern || this.pos[1] <= northern || this.pos[1] >= southern) {
	      this.done = true;
	    }
	  }
	
	
	}
	
	module.exports = Fireball;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map