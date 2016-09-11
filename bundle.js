/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	const Hero = __webpack_require__(1);
	const handleInput = __webpack_require__(2);

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


/***/ },
/* 1 */
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

	class Hero {
	  constructor(boardDimensions = [[332,0],[812,512]]) {
	    this.boardDimensions = boardDimensions;
	    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
	    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];
	    this.width = 32;
	    this.height = 32;
	    this.shakingAss = false;
	    this.speed = 200;
	    this.directionVector = [0,0];
	    this.animSet = 4;
	    this.animFrame = 0;
	    this.animNumFrames = 2;
	    this.animDelay = 200;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src = "/Users/Eihcir0/Desktop/sprite_game/images/hero_sheet.png";
	    this.image.onload = () => (this.imageReady = true);

	    // this.stop = this.stop.bind(this);
	    // this.face = this.face.bind(this);
	    // this.shakeAssOn = this.shakeAssOn.bind(this);
	    // this.shakeAssOff = this.shakeAssOff.bind(this);
	    // this.updateDirection = this.updateDirection.bind(this);
	    // this.updateAnimSet = this.updateAnimSet.bind(this);
	    // this.update = this.update.bind(this);
	    // this.updateAnim = this.updateAnim.bind(this);
	    // this.move = this.move.bind(this);
	    // this.preventOutOfBounds = this.preventOutOfBounds.bind(this);
	    // this.posCenter = this.posCenter.bind(this);
	    // this.currentSprite = this.currentSprite.bind(this);
	    this.posCenter();
	    this.updateDirection();
	  }


	  posCenter() {
	    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
	    + 166 - (this.width / 2));
	    var yyy = Math.floor((this.boardHeight / 2) - (this.width / 2));
	    this.pos = [xxx,yyy];
	  }

	  shakeAssOn() {
	    this.shakingAss = true;
	    this.directionVector = [0,0];
	  }

	  shakeAssOff() {
	    this.shakingAss = false;
	    this.directionVector = [0,0];
	    this.animSet = 4;
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

	  updateAnim(elapsed) {
	    this.updateDirection();
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;}
	    if (this.direction!=="STOP" || this.shakingAss) {
	          ++this.animFrame;

	        if (this.animFrame >= this.animNumFrames) {
	          this.animFrame = 0;
	        }
	      }
	    }



	  move(elapsed) {
	    var move = (this.speed * (elapsed / 1000));
	    let speedFactor;

	    if (DIAGS.includes(this.direction)) { //reduce diag velocity
	      speedFactor = 0.75;
	    } else {
	      speedFactor=1;
	    }
	  	this.pos[0] += Math.round(move *  this.directionVector[0]);
	  	this.pos[1] += Math.round(move * speedFactor * this.directionVector[1]);

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

	module.exports = Hero;


/***/ },
/* 2 */
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


/***/ }
/******/ ]);