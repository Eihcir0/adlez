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

	const Game = __webpack_require__(1);
	const handleInput = __webpack_require__(8);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	const Hero = __webpack_require__(3);
	const Fireball = __webpack_require__(5);
	const skullGuy = __webpack_require__(6);
	const Greeny = __webpack_require__(9);
	const Coin = __webpack_require__(11);

	class Game {
	  constructor(obj) {
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardDimensions = obj.boardDimensions;

	    this.board = new Board({id: 1, ctx: this.ctx, canvas: this.canvas, boardDimensions: this.boardDimensions});

	    this.hero = new Hero({board: this.board, pos: this.board.posCenter()});

	    this.monsters = [];
	    this.monsters.push(new skullGuy({board: this.board, pos: [100,100]}));
	    this.monsters.push(new Greeny({board: this.board, pos: [200,100]}));

	    this.coins = [];
	    for (var i = 0; i < 10; i++) {
		     var coin = new Coin({board: this.board});
		      coin.pos = [(Math.random()*(this.canvas.width)),
			    (Math.random()*(this.canvas.height)) ];
		      this.coins.push(coin);
	    }



	    this.fireballs = [];

	  }

	  update(dt) {
	    this.hero.update(dt);
	    this.updateFireballs(dt);
	    this.updateMonsters(dt);
	    this.updateCoins(dt);
	    this.collsionCheckFireballs();
	    this.collsionCheckCoins();
	    // this.collsionCheckMonsters();
	  }




	  render () {

	    this.board.render();

	    this.hero.render();

	    for (var i = 0; i < this.fireballs.length; i++) {
	      this.fireballs[i].render();
	    }

	    for (var j = 0; j < this.monsters.length; j++) {
	      this.monsters[j].render();
	    }

	    for (var k = 0; k < this.coins.length; k++) {
	      this.coins[k].render();
	    }
	  }

	  updateFireballs(dt) {
	    if (this.hero.newFireball) {
	      this.addFireball();}

	    var tempFireballs = this.fireballs.slice(0);
	    for (var i = 0; i < this.fireballs.length; i++) {
	      if (this.fireballs[i].isOutOfBounds() || this.fireballs[i].done) {
	        tempFireballs.splice(i,1);
	      }
	    }
	    this.fireballs = tempFireballs;
	    for (var j = 0; j < this.fireballs.length; j++) {
	      this.fireballs[j].update(dt);
	    }

	  }

	  updateMonsters(dt) {

	    var tempMonsters = this.monsters.slice(0);
	    for (var i = 0; i < this.monsters.length; i++) {
	      if (this.monsters[i].done) {
	        tempMonsters.splice(i,1);
	      }
	    }
	    this.monsters = tempMonsters;
	    for (var j = 0; j < this.monsters.length; j++) {
	      this.monsters[j].update(dt);
	      this.monsters[j].preventOutOfBounds();
	    }

	  }
	  updateCoins(dt) {

	    var tempCoins = this.coins.slice(0);
	    for (var i = 0; i < this.coins.length; i++) {
	      if (this.coins[i].done) {
	        tempCoins.splice(i,1);
	      }
	    }
	    this.coins = tempCoins;
	    for (var j = 0; j < this.coins.length; j++) {
	      this.coins[j].update(dt);
	    }

	  }

	  addFireball() {
	    this.hero.newFireball = false;
	    var now = Date.now();
	    if (now - this.hero.lastFireball > this.hero.fireballDelay) {
	      this.hero.lastFireball = now;
	      var newFB = new Fireball({pos: this.calcFBpos(), facing: this.hero.lastDir, board: this.board});
	      this.fireballs.push(newFB);
	    }
	  }

	  calcFBpos() {
	    var temp = this.hero.pos.slice(0);
	    var x = temp[0];
	    var y = temp[1];
	    switch (this.hero.lastDir) {
	    case "N":
	      x -= this.hero.width/2;
	      y -= this.hero.height;
	      break;
	    case "E":
	      y -= this.hero.height/2;
	      break;
	    case "S":
	      x -= this.hero.width/2;
	      break;
	    case "W":
	      x -= this.hero.width;
	      y -= this.hero.height/2;
	      break;
	    case "NE":
	      y -= this.hero.height;
	      break;
	    case "NW":
	      x -= this.hero.width;
	      y -= this.hero.height;
	      break;
	    case "SW":
	      x -= this.hero.width;
	      break;
	    default:
	      break;

	      }
	      console.log(this.hero.pos);
	      console.log([x,y]);
	      return [x,y];
	  }
	  collsionCheckFireballs() {
	    var fb;
	    var m;
	    for (var i = 0; i < this.fireballs.length; i++) {
	      fb = this.fireballs[i];
	      for (var i = 0; i < this.monsters.length; i++) {
	        m = this.monsters[i];
	        if (
	    			fb.pos[0] <= (m.pos[0] + 32)
	    			&& m.pos[0] <= (fb.pos[0] + 32)
	    			&& fb.pos[1] <= (m.pos[1] + 32)
	    			&& m.pos[1] <= (fb.pos[1] + 32)
	    		) {
	            m.done = true;
	            fb.done = true;
	          }
	      }
	    }
	  }

	  collsionCheckCoins() {
	    for (var i = 0; i < this.coins.length; i++) {
	      let coin = this.coins[i];
	      let hero = this.hero;
	      if (
	        hero.pos[0] <= (coin.pos[0] + 32)
	        && coin.pos[0] <= (hero.pos[0] + 32)
	        && hero.pos[1] <= (coin.pos[1] + 32)
	        && coin.pos[1] <= (hero.pos[1] + 32)
	        && (!coin.taken)
	      ) {
	          coin.taken = true;
	          coin.sound.play();
	        }
	    }
	  }


	  collsionCheckMonsters() {

	  }




	} // end class

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Board {
	  constructor(obj) {
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardId = obj.id;
	    this.height = 512;
	    this.width = 512;
	    this.boardDimensions = obj.boardDimensions;
	    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
	    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];
	  }

	  posCenter() {
	    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
	    + 166 );
	    var yyy = Math.floor((this.boardHeight / 2) );
	    return [xxx,yyy];

	  }

	  render() {
	  // Draw a green background. Pretend it's grass
	  	this.ctx.fillStyle = "rgb(51, 118, 36)";
	  	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	  }

	} //end class

	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(4);

	class Hero extends Moveable {
	  constructor(obj) {
	    super(obj);

	    this.newFireball = false;
	    this.lastFireball = Date.now();
	    this.fireballDelay = 1000;
	    this.name = "HERO";
	    this.width = 32;
	    this.height = 32;
	    this.shakingAss = false;

	    this.speed = 0;
	    this.Maxspeed = 200;

	    this.pos = obj.pos;

	    this.animSet = 4;
	    this.spriteYoffset = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 2;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/hero_sheet.png";
	    this.image.onload = () => (this.imageReady = true);


	  }



	  shakeAssOn() {
	    this.shakingAss = true;
	    this.facing = "N";
	    this.updateAnimSet();
	    this.animDelay = 50;
	    this.movementOn = false;
	    this.animationOn = true;


	  }

	  shakeAssOff() {
	    this.shakingAss = false;
	    this.facing = "S";
	    this.updateAnimSet(); //DRY THIS UP LATER?  based on facing?
	    this.animDelay = 200;
	    this.movementOn = true;
	    this.automover = false;
	  }


	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.facing;
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




	} //end class

	module.exports = Hero;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	class Moveable {
	  constructor(obj) {

	    this.board = obj.board;
	    this.boardDimensions = this.board.boardDimensions;
	    this.MOVES = {
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
	    this.DIAGS = ["NE","NW","SE","SW"];
	    this.ctx = this.board.ctx;
	    this.canvas = this.board.canvas;
	    this.lastDir = "S";
	    this.animationOn = true;
	    this.movementOn = true;
	    this.done = false;
	  }

	  currentSprite() { //this is really just the X offset calc'd
	    return (
	      (this.animSet * (this.width * this.animNumFrames)) +
	      (this.animFrame * this.width)
	    );
	  }

	  stop() {
	    if (this.facing !== "STOP") {
	    this.lastDir = this.facing;}
	    this.facing = "STOP";
	    this.animationOn = false;

	  }

	  go(dir) {
	    this.facing = dir;
	    this.animationOn = true;
	    this.speed = this.Maxspeed;
	    this.updateAnimSet();
	  }

	  update(elapsed) {
	    this.updateAnim(elapsed);
	    this.move(elapsed);

	  }

	  updateAnim(elapsed) {
	    if (this.animationOn) {
	      this.animTimer += elapsed;

	      if (this.animTimer >= this.animDelay) {
	        if (this.automover) {
	          ++this.currentMovement;

	          if (this.currentMovement >= this.numMovements - 1) {
	            this.currentMovement = 0;
	          }
	          this.facing = (this.movements[this.currentMovement]);

	        }

	        this.animTimer = 0;
	        ++this.animFrame;
	        if (this.done) {
	          this.pos[1] -= 3;
	          if (this.animFrame >= this.animNumFrames) {
	            this.done = true;
	          }
	        }
	        if (this.animFrame >= this.animNumFrames) {
	            this.animFrame = 0;
	          }

	      }
	    }
	  }



	  move(elapsed) {
	    let newPos = this.pos;
	    if (this.movementOn) {
	      var move = (this.speed * (elapsed / 1000));
	      let speedFactor;

	      if (this.DIAGS.includes(this.facing)) { //reduce diag velocity
	        speedFactor = 0.75;
	      } else {
	        speedFactor=1;
	      }
	      newPos[0] += Math.round(move *  this.MOVES[this.facing][0]);
	      newPos[1] += Math.round(move * speedFactor * this.MOVES[this.facing][1]);
	    }
	    this.pos = newPos;
	  }

	  render() {

	    this.ctx.drawImage(
			this.image,
			this.currentSprite(),
	    this.spriteYoffset*this.height,
	    this.width,
	    this.height,
			this.pos[0],
	    this.pos[1],
	    this.width,
			this.height
		);
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

	  isOutOfBounds() {
	    let northern = this.boardDimensions[0][1];
	    let western = this.boardDimensions[0][0];
	    let southern = this.boardDimensions[1][1] - this.height;
	    let eastern = this.boardDimensions[1][0] - this.width;
	    return (
	      this.pos[0]< western ||
	      this.pos[0]> eastern ||
	      this.pos[1]< northern ||
	      this.pos[1]> southern);
	  }


	} //end class

	module.exports = Moveable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(4);

	class Fireball extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.facing = obj.facing;
	    this.pos = obj.pos;
	    this.automover = false;

	    this.name = "FIREBALL";
	    this.width = 64;
	    this.height = 64;

	    this.speed = 500;
	    this.Maxspeed = 500;
	    this.animSet = 0;
	    this.spriteYoffset = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 4;
	    this.animDelay = 1;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/fireball_0.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.updateAnimSet();
	  }



	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.facing;
	    if (d === "N") {
	        this.animSet = 0;
	        this.spriteYoffset = 2;
	      } else if (d === "NE") {
	        this.animSet = 0;
	        this.spriteYoffset = 3;
	      } else if (d === "E") {
	        this.animSet = 0;
	        this.spriteYoffset = 4;
	      } else if (d==="SE") {
	        this.animSet = 0;
	        this.spriteYoffset = 5;
	      } else if (d==="S" || d==="STOP") {
	        this.animSet = 0;
	        this.spriteYoffset = 6;
	      } else if (d==="SW") {
	        this.animSet = 0;
	        this.spriteYoffset = 7;
	      } else if (d==="W") {
	        this.animSet = 0;
	        this.spriteYoffset = 0;
	      } else if (d==="NW") {
	        this.animSet = 0;
	        this.spriteYoffset = 1;
	      }
	    }




	} //end class

	module.exports = Fireball;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(7);

	class skullGuy extends Monster {
	  constructor(obj) {
	    super(obj);

	    this.width = 32;
	    this.height = 32;

	    this.Maxspeed = 150;
	    this.speed = 150;
	    this.facing = "N";

	    this.animSet = 0;
	    this.spriteYoffset = 1;
	    this.animFrame = 0;
	    this.animNumFrames = 3;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/monsters-32x32.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.movements = ["E","E","E","E","E","E","N", "N", "W", "W", "W", "W", "W", "W", "S","S","S"];
	    this.currentMovement = 0;
	    this.numMovements = 17;
	  }

	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.facing;
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




	} //end class

	module.exports = skullGuy;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(4);

	class Monster extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.pos = obj.pos;
	    this.automover = true;


	  }



	} //end class

	module.exports = Monster;


/***/ },
/* 8 */
/***/ function(module, exports) {

	const handleInput = function (hero, keysDown) {

		// Stop moving the hero
		hero.stop();
		// if (hero.shakingAss) {hero.face("N");}

		if (83 in keysDown) { // S
			hero.shakeAssOn();

		}

		if (37 in keysDown) { // Left
			hero.go("W");
		}

		if (38 in keysDown) { // Up
			hero.go("N");
		}


		if (39 in keysDown) { // Right
			hero.go("E");
		}


		if (40 in keysDown) { // Down
			hero.go("S");
		}

		if (38 in keysDown && 39 in keysDown) { // Up/Right
			hero.go("NE");
		}

		if (38 in keysDown && 37 in keysDown) { // Up/Left
			hero.go("NW");
		}

		if (40 in keysDown && 39 in keysDown) { // Down/Right
			hero.go("SE");
		}

		if (40 in keysDown && 37 in keysDown) { // Down/Left
			hero.go("SW");
		}
		if (32 in keysDown) { // space
			hero.newFireball = true;
		}


	};

	module.exports = handleInput;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(7);

	class Greeny extends Monster {
	  constructor(obj) {
	    super(obj);

	    this.width = 32;
	    this.height = 32;

	    this.Maxspeed = 150;
	    this.speed = 150;
	    this.facing = "N";

	    this.animSet = 0;
	    this.spriteYoffset = 2;
	    this.animFrame = 0;
	    this.animNumFrames = 3;
	    this.animDelay = 100;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/monsters-32x32.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.movements = ["S","S","S","S","S","S","E", "E", "N", "N", "N", "N", "N", "N", "W","W","W"];
	    this.currentMovement = 0;
	    this.numMovements = 17;
	  }

	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.facing;
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




	} //end class

	module.exports = Greeny;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(4);

	class Coin extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.animationOn = false;
	    this.pos = obj.pos;
	    this.automover = false;
	    this.taken = false;
	    this.facing = "N";
	    this.name = "COIN";
	    this.width = 32;
	    this.height = 32;

	    this.speed = 0;
	    this.Maxspeed = 0;
	    this.animSet = 0;
	    this.spriteYoffset = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 8;
	    this.animDelay = 50;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/spinning_coin_gold.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.sound = new Audio('./images/smb_1-up.wav');


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






	} //end class

	module.exports = Coin;


/***/ }
/******/ ]);