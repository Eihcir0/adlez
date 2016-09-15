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
	const handleInput = __webpack_require__(12);

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
	canvas.height = 480;
	document.body.appendChild(canvas);

	var lifeMeter = document.getElementById('score');
	var expMeter = document.getElementById('exp');
	var levelMeter = document.getElementById('level');
	var atkStrMeter = document.getElementById('atkStr');
	var coinMeter = document.getElementById('coins');
	// The main game loop

	let game = new Game({ctx: ctx, canvas: canvas, expMeter: expMeter, atkStrMeter: atkStrMeter, levelMeter: levelMeter, coinMeter: coinMeter, lifeMeter: lifeMeter, boardDimensions:
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
	const Hero = __webpack_require__(5);
	const Fireball = __webpack_require__(7);
	const skullGuy = __webpack_require__(8);
	const Greeny = __webpack_require__(10);
	const Coin = __webpack_require__(11);

	class Game {
	  constructor(obj) {
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardDimensions = obj.boardDimensions;

	    this.board = new Board({id: 1, ctx: this.ctx, canvas: this.canvas, boardDimensions: this.boardDimensions});


	    this.hero = new Hero({board: this.board, pos: this.board.posCenter()});
	    this.lifeMeter = obj.lifeMeter;
	    this.coinMeter = obj.coinMeter;
	    this.levelMeter = obj.levelMeter;
	    this.expMeter = obj.expMeter;
	    this.atkStrMeter = obj.atkStrMeter;

	    this.monsters = [];
	    this.monsters.push(new skullGuy({board: this.board, pos: [100,100]}));
	    this.monsters.push(new Greeny({board: this.board, pos: [200,100]}));

	    this.monsters.push(new Greeny({board: this.board, pos: [50,300]}));

	    this.coins = [];
	    for (var i = 0; i < 10; i++) {
		     var coin = new Coin({board: this.board, value: Math.floor(Math.random()*30)});
		    coin.pos = [(Math.random()*(this.board.width - 96)+32),
			    (Math.random()*(this.board.height-96)+32) ];
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
	    if (this.hero.attackApex) {this.collisionCheckHeroWeapon();}
	    this.collsionCheckCoins();
	    this.collsionCheckMonsters();
	  }




	  render () {
	    this.lifeMeter.innerHTML = this.hero.life > 0 ? "♡".repeat(this.hero.life) : "DEAD	☠";
	    this.coinMeter.innerHTML = Math.floor(this.hero.coins);


	    this.levelMeter.innerHTML = "LEVEL: " + this.hero.level;


	    this.expMeter.innerHTML = "EXP: " + Math.floor(this.hero.exp);


	    this.atkStrMeter.innerHTML = "Attack Strength: " + Math.floor(this.hero.atkDamage);


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
	      if (this.fireballs[i].isOutOfBounds() || this.fireballs[i].hitSomething || this.fireballs[i].done) {
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
	        this.hero.exp += this.monsters[i].maxHp * 500;
	        this.coins.push(new Coin({blinking: 8, board: this.board, pos: this.monsters[i].pos.slice(0), value:
	           Math.floor((Math.random()*10+1)*this.monsters[i].maxHp)}));
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
	    console.log("add fireball");
	    this.hero.newFireball = false;
	    var now = Date.now();
	    if (now - this.hero.lastFireball > this.hero.fireballDelay) {
	      this.hero.lastFireball = now;
	      var newFB = new Fireball({pos: this.calcFBpos(), facing: this.hero.lastDir, board: this.board});
	      this.fireballs.push(newFB);
	      newFB.fireballSound.play();
	    }
	  }

	  calcFBpos() {
	    var temp = this.hero.pos.slice(0);
	    var x = temp[0];
	    var y = temp[1];
	    switch (this.hero.lastDir) {
	    case "N":
	      y -= this.hero.height / 2;
	      break;
	    case "E":
	      x += this.hero.width / 3;
	      y += this.hero.height * 0.10;
	      break;
	    case "S":
	      break;
	    case "W":
	      x -= this.hero.width / 3;
	      y += this.hero.height*.1;
	      break;
	    case "NE":
	      break;
	    case "NW":
	      break;
	    case "SW":
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
	      for (var j = 0; j < this.monsters.length; j++) {
	        m = this.monsters[j];
	        if (
	    			fb.pos[0] <= (m.pos[0] + 32)
	    			&& m.pos[0] <= (fb.pos[0] + 32)
	    			&& fb.pos[1] <= (m.pos[1] + 32)
	    			&& m.pos[1] <= (fb.pos[1] + 32)
	    		) {
	            m.getHit(fb.damage);
	            fb.done = true;
	          }
	      }
	    }
	  }

	  collisionCheckHeroWeapon() {
	    var hero = this.hero;
	    var x = 0;
	    var y = 0;
	    var ymod = 35;
	    var xmod = 50;
	    switch (this.hero.facing) { // last dir??
	    case "N":
	      y -= ymod;
	      break;
	    case "E":
	      x += xmod;
	      break;
	    case "S":
	      y += ymod * 2;
	      break;
	    case "W":
	      x -= xmod;
	      y += ymod;
	      break;
	    case "NE":
	      x += xmod;
	      break;
	    case "NW":
	      x -= xmod;
	      y += ymod;
	      break;
	    case "SW":
	      x -= xmod;
	      y += ymod;
	      break;
	    default:
	      break;

	      }
	    var m;
	    for (var i = 0; i < this.monsters.length; i++) {
	      m = this.monsters[i];
	      if (
	  			hero.pos[0] + x <= (m.pos[0] + 32)
	  			&& m.pos[0] <= (hero.pos[0] + 32 + x)
	  			&& hero.pos[1] + y <= (m.pos[1] + 32)
	  			&& m.pos[1] <= (hero.pos[1] + 32 + y )
	  		) {
	          if (!(hero.directHit)) {
	            m.getHit(hero.atkDamage);
	            hero.directHit = true;
	          }
	        }
	    }
	  }



	  collsionCheckCoins() {
	    if (!(this.hero.attacking)) {
	      for (var i = 0; i < this.coins.length; i++) {
	        let coin = this.coins[i];
	        let hero = this.hero;
	        let heroX = hero.pos[0];
	        let heroY = hero.pos[1];

	        if (
	             coin.pos[0] <= (hero.pos[0] + (hero.width *0.75))
	          && hero.pos[0] <= (coin.pos[0] + (coin.width /2))
	          && coin.pos[1] <= (hero.pos[1] + hero.height)
	          && hero.pos[1] <= (coin.pos[1] + coin.width / 2)
	          && (!coin.dying)
	        ) {
	            coin.dying = true;
	            coin.animDelay = 25;
	            coin.sound.play();
	            hero.coins += coin.value % 10;
	            hero.exp += (coin.value % 10) * 10;
	            for (var i = 1; i < (coin.value / 10); i++) {

	              window.setTimeout(() => {
	                hero.exp += 100;
	                hero.coins += 10;
	                new Coin({board: this.board}).sound.play();}, i*130);
	          }
	      }
	    }
	  }
	}


	  collsionCheckMonsters() {
	    for (var i = 0; i < this.monsters.length; i++) {
	      let monster = this.monsters[i];
	      let hero = this.hero;
	      let heroX = hero.pos[0];
	      let heroY = hero.pos[1];

	      if (
	           monster.pos[0] <= (hero.pos[0] + (hero.width *0.75))
	        && hero.pos[0] <= (monster.pos[0] + (monster.width /2))
	        && monster.pos[1] <= (hero.pos[1] + hero.height)
	        && hero.pos[1] <= (monster.pos[1] + monster.width / 2)
	        && (!hero.dying) && (!hero.justHit)
	      ) {hero.getHit();}
	    }
	  }




	} // end class

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Tree = __webpack_require__(3);


	class Board {
	  constructor(obj) {


	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardId = obj.id;
	    this.height = this.canvas.height;  ///temporary fix ??
	    this.width = this.canvas.width;
	    this.boardDimensions = obj.boardDimensions;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/background.png";
	    this.image.onload = () => (this.imageReady = true);
	    let temp = this.outerTrees1();

	    this.IMMOVEABLES = {
	      1: temp
	    };
	    this.immoveables = this.IMMOVEABLES[this.boardId];
	    this.immoveables.forEach((el) => el.render() );
	  }

	  outerTrees1() {
	    var results = [];
	    for (var i = 0; i < 16; i++) {
	      results.push(new Tree({board: this, pos: [i*32, 0]}));
	    }
	    for (i = 0; i < 16; i++) {
	      results.push(new Tree({board: this, pos: [i*32, 448]}));
	    }

	    for (i = 0; i < 15; i++) {
	      results.push(new Tree({board: this, pos: [0, i*32]}));
	    }
	    for (i = 0; i < 15; i++) {
	      results.push(new Tree({board: this, pos: [480, i*32]}));
	    }
	    return results;

	  }

	  posCenter() {
	    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
	    + 166 );
	    var yyy = Math.floor((this.height / 2) );
	    return [xxx,yyy];

	  }

	  checkCollisionImmoveables(obj) {
	    //chxeck for DOORS!!!
	    for (var i = 0; i < this.immoveables.length; i++) {
	      var immoveable = this.immoveables[i];


	      if (
	           obj.pos[0] <= (immoveable.pos[0] + (immoveable.width *.3))
	        && immoveable.pos[0] <= (obj.pos[0] + (obj.width * .6))
	        && obj.pos[1] <= (immoveable.pos[1] + immoveable.height *.4)
	        && immoveable.pos[1] <= (obj.pos[1] + obj.width)
	      ) {return true;}

	    }//end for
	    return false;
	  }

	  render() {
	  // Draw a green background. Pretend it's grass
	  	this.ctx.fillStyle = "rgb(51, 118, 36)";
	  	this.ctx.fillRect(0, 0, this.width, this.height);
	    this.ctx.drawImage(
			this.image,
			0,
	    0,
	    512,
	    512,
			0,
	    0,
	    512,
			512
		);
	  this.IMMOVEABLES[this.boardId].forEach((el) => el.render() );
	  }


	} //end class

	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Immoveable = __webpack_require__(4);


	class Tree extends Immoveable {
	  constructor (obj) {
	  super(obj);
	  this.pos = obj.pos;
	  this.width = 32;
	  this.height = 32;
	  this.image = new Image();
	  this.image.src =
	  "./images/background.png";
	  this.image.onload = () => (this.imageReady = true);

	  }

	  render () {
	    this.ctx.drawImage(
	    this.image,
	    0,
	    32,
	    this.width,
	    this.height,
	    this.pos[0],
	    this.pos[1],
	    this.width,
	    this.height
	    );
	  }
	}


	module.exports = Tree;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	class Immoveable {
	  constructor(obj) {

	    this.board = obj.board;
	    this.boardDimensions = this.board.boardDimensions;
	    this.ctx = this.board.ctx;
	    this.canvas = this.board.canvas;
	    this.done = false;
	  }



	} //end class

	module.exports = Immoveable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(6);

	class Hero extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.attackSound = new Audio("./images/209121__lukesharples__sword-swipe11.wav");
	    this.gotHitSound = new Audio ("./images/242623__reitanna__grunt.wav");
	    this.dyingSound = new Audio ("./images/101120__robinhood76__01685-harp-groan.wav");
	    this.life = 5;
	    this.coins = 0;
	    this.level = 5;
	    this.exp = 0;
	    this.endAttack();
	    this.lastAttack = Date.now();
	    this.justHit = false;
	    this.justHitTimer = 0;
	    this.newFireball = false;
	    this.lastFireball = Date.now();
	    this.fireballDelay = 2000;
	    this.attackDelay = 200;
	    this.name = "HERO";
	    this.width = 64;
	    this.height = 64;
	    this.shakingAss = false;
	    this.atkDamage = 1;
	    this.directHit = true;
	    this.speed = 0;
	    this.Maxspeed = 200;

	    this.pos = obj.pos;

	    this.animSet = 3;
	    this.spriteYoffset = 0;
	    this.animFrame = 0;
	    this.animNumFrames = 9;
	    this.animDelay = 40;
	    this.animTimer = 0;
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/new_mimi.png";
	    this.image.onload = () => (this.imageReady = true);
	    this.facing = "S";
	    this.updateAnimSet();

	  }

	  stop() {
	    if (!(this.attacking)) {
	      if (this.facing !== "STOP") {
	        this.lastDir = this.facing;}
	        this.facing = "STOP";
	        this.animationOn = false;
	      }
	  }


	  shakeAssOn() {
	    this.shakingAss = true;
	    this.facing = "N";
	    this.updateAnimSet();
	    this.animDelay = 10;
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

	  getHit() {
	    if (this.life === 1) {
	        this.gotHitSound.play();
	        this.dyingSound.play();
	        this.stop();
	        this.endAttack();
	        this.animationOn = true;
	        this.justHit = false;
	        this.justHitTimer = 0;
	        this.life = 0;
	        this.animFrame = 0;
	        this.dying = true;
	        this.spriteYoffset = 20;
	        this.animNumFrames = 5;
	        this.animDelay = 200;
	        this.speed = 0;
	      } else {
	        this.gotHitSound.play();
	        this.life -= 1;
	        this.justHit = true;
	      }

	  }



	  attack() {
	    if (Date.now() - this.lastAttack  > this.attackDelay) {
	        if (this.level > 1) {this.newFireball=true;}
	        this.lastAttack = Date.now();
	        this.attacking = true;
	        this.animationOn = true;
	        this.movementOn = false;
	        this.animFrame = 0;
	        this.animNumFrames = 6;
	        this.facing = this.lastDir;
	        this.directHit = false;
	        this.updateAnimSet();
	        this.attackSound.play();
	      }
	    }

	    endAttack() {
	      this.attacking = false;
	      this.movementOn = true;
	      this.height = 64;
	      this.width = 64;
	      this.attackXoffset = 0;
	      this.attackYoffset = 0;
	      this.attackApex = false;
	      this.updateAnimSet();
	      this.facing = "STOP";
	    }


	  updateAnimSet() {  //should refactor this with a const array
	    let d = this.facing;
	    if (d === "N") {
	      this.animSet = 0;
	      this.spriteYoffset = 8;
	      if (this.attacking) {
	        this.attackXoffset = -64;
	        this.spriteYoffset = 22 / 3;
	      }
	    } else if (d === "NE") {
	      this.animSet = 0;
	      this.spriteYoffset = 11;
	      if (this.attacking) {
	        this.attackXoffset = -64;
	        this.spriteYoffset = 31/3;
	      }
	    } else if (d === "E") {
	      this.animSet = 0;
	      this.spriteYoffset = 11;
	      if (this.attacking) {
	        this.attackXoffset = -64;
	        this.spriteYoffset = 31/3;
	      }
	    } else if (d==="SE") {
	      this.animSet = 0;
	      this.spriteYoffset = 11;
	      if (this.attacking) {
	        this.attackXoffset = -64;
	        this.spriteYoffset = 31/3;
	      }
	    } else if (d==="S" || d==="STOP") {
	      this.animSet = 0;
	      this.spriteYoffset = 10;
	      if (this.attacking) {
	        this.spriteYoffset = 28/ 3;
	        this.attackXoffset = -64;
	      }
	    } else if (d==="SW") {
	      this.animSet = 0;
	      this.spriteYoffset = 9;
	      if (this.attacking) {
	        this.spriteYoffset = 23/ 3;
	        this.attackXoffset = -64;
	        this.attackYoffset = -128;
	      }
	    } else if (d==="W") {
	      this.animSet = 0;
	      this.spriteYoffset = 9;
	      if (this.attacking) {
	        this.spriteYoffset = 23/ 3;
	        this.attackXoffset = -64;
	        this.attackYoffset = -128;
	      }
	    } else if (d==="NW") {
	      this.animSet = 0;
	      this.spriteYoffset = 9;
	      if (this.attacking) {
	        this.spriteYoffset = 23/ 3;
	        this.attackXoffset = -64;
	        this.attackYoffset = -128;
	      }
	    }
	  }

	  updateAnim(elapsed) {
	    if (this.animationOn) {
	      this.animTimer += elapsed;

	      if (this.animTimer >= this.animDelay) {
	        this.animTimer = 0;
	        ++this.animFrame;
	        if (this.animFrame > 3 && this.attacking) {this.attackApex = true;console.log("APEX!");}
	        if (this.animFrame >= this.animNumFrames) {
	          if (this.dying) {
	            this.animFrame = 5;
	            this.done = true;
	          } else if (this.attacking) {
	            this.endAttack();
	          } else {
	            this.animFrame = 0;
	          }
	        }
	      }
	    }
	  }
	  render() {
	    if (this.attacking) {
	      this.ctx.drawImage(
	  		this.image,
	  		(this.animSet * (this.width * 3 * this.animNumFrames)) +
	      (this.animFrame * this.width * 3),
	      this.spriteYoffset*this.height*3,
	      this.width*3,
	      this.height*3,
	  		this.pos[0] + this.attackXoffset,
	      this.pos[1] + this.attackYoffset,
	      this.width*3,
	  		this.height*3
	      );

	    } else {
	      this.ctx.drawImage(
	  		this.image,
	  		this.currentSprite(),
	      this.spriteYoffset*this.height,
	      this.width,
	      this.height,
	  		this.pos[0] + this.attackXoffset,
	      this.pos[1] + this.attackYoffset,
	      this.width,
	  		this.height
	      );}
	    }

	} //end class

	module.exports = Hero;


/***/ },
/* 6 */
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
	    this.blinking = obj.blinking || 0;
	    if (this.blinking) {console.log("blinking");}
	    this.hitSomething = false;
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

	    this.animTimer += elapsed;

	    if (this.animTimer >= this.animDelay) {
	      if (this.blinking) {this.blinking--;}
	      if (this.automover) {
	        ++this.currentMovement;

	        if (this.currentMovement >= this.numMovements - 1) {
	          this.currentMovement = 0;
	        }
	        this.facing = (this.movements[this.currentMovement]);
	      }
	      this.animTimer = 0;
	      if (this.animationOn) {++this.animFrame;
	        if (this.animFrame >= this.animNumFrames) {
	            this.animFrame = 0;
	        }

	        }
	    }
	  }



	  move(elapsed) {
	    let newPos = this.pos.slice(0);
	    if (this.movementOn) {
	      var move = (this.speed * (elapsed / 1000));
	      let speedFactor;

	      if (this.DIAGS.includes(this.facing)) { //reduce diag velocity
	        speedFactor = 0.75;
	      } else {
	        speedFactor=1;
	      }
	      if (this.justHit) {
	        newPos[0] += Math.round(-1 * 4 * move *  this.MOVES[this.lastDir][0]);
	        newPos[1] += Math.round(-1 * 4 * move * speedFactor * this.MOVES[this.lastDir][1]);
	        this.justHitTimer++;
	        if (this.justHitTimer > 5) {
	          this.justHit = false;
	          this.justHitTimer = 0;
	          this.stop();
	        }
	    } else {
	        newPos[0] += Math.round(move *  this.MOVES[this.facing][0]);
	        newPos[1] += Math.round(move * speedFactor * this.MOVES[this.facing][1]);
	      }
	    }
	    if (!(this.board.checkCollisionImmoveables({height: this.height, width: this.width, pos: newPos}))) {
	    this.pos = newPos;
	  } else {this.hitSomething = true;}
	  }

	  render() {
	    if (!(this.blinking) || (this.blinking && (this.blinking % 2 !== 0))) {
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(6);

	class Fireball extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.facing = obj.facing;
	    this.pos = obj.pos;
	    this.automover = false;
	    this.damage = 3;
	    this.fireballSound = new Audio ("./images/105016__julien-matthey__jm-fx-fireball-01.wav");

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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(9);

	class skullGuy extends Monster {
	  constructor(obj) {
	    super(obj);

	    this.width = 32;
	    this.height = 32;
	    this.maxHp = 10;
	    this.hp = this.maxHp;
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(6);

	class Monster extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.pos = obj.pos;
	    this.automover = true;
	    this.getHitSound = new Audio ("./images/146977__jwmalahy__desk-thud.wav");
	    this.dyingSound = new Audio ("./images/137036__pyrocamancer__beast-death.wav");
	    this.blinking = 0;


	  }

	  getHit(damage) {
	    this.getHitSound.play();
	    this.hp -= damage;
	    this.blinking = 6;
	    if (this.hp <= 0) {
	      this.done = true;
	      this.dyingSound.play();}
	  }



	} //end class

	module.exports = Monster;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(9);

	class Greeny extends Monster {
	  constructor(obj) {
	    super(obj);

	    this.width = 32;
	    this.height = 32;
	    this.maxHp = 2;
	    this.hp = this.maxHp;
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(6);

	class Coin extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.value = obj.value;
	    this.animationOn = false;
	    this.pos = obj.pos;
	    this.automover = false;
	    this.dying = false;
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
	    this.sound = new Audio('./images/349281__adam-n__coin-on-coins-05.wav');


	  }

	  updateAnim(elapsed) {

	  if (this.dying || this.blinking) {
	    this.animTimer += elapsed;
	    if (this.animTimer >= this.animDelay) {
	      this.animTimer = 0;
	      if (this.blinking) {this.blinking -= 1;}
	      if (this.dying) {

	      ++this.animFrame;
	      this.pos[1] -= 3;
	      if (this.animFrame >= this.animNumFrames) {
	          this.done = true;}
	      }
	    }
	  }
	}






	} //end class

	module.exports = Coin;


/***/ },
/* 12 */
/***/ function(module, exports) {

	const handleInput = function (hero, keysDown) {
		if (hero.dying || hero.attacking) {return;}

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
			hero.attack();
		}


	};

	module.exports = handleInput;


/***/ }
/******/ ]);