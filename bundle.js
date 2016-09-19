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
	const handleInput = __webpack_require__(14);

	// A cross-browser requestAnimationFrame
	// https:
	// hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/

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

	const Quadrant = __webpack_require__(2);
	const Hero = __webpack_require__(7);

	class Game {
	  constructor (obj) {
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardDimensions = obj.boardDimensions;


	    this.quadrants = [];
	    this.quadrant = new Quadrant({quadrantId: 1, active: true, ctx: this.ctx, canvas: this.canvas});
	    this.quadrants.push (this.quadrant);
	    this.quadrants.push (new Quadrant({quadrantId: 2, active: false, hero: this.hero, ctx: this.ctx, canvas: this.canvas}));

	    this.hero = new Hero({board: this.quadrant.board, pos: this.quadrant.board.posCenter()});

	    this.quadrants.forEach(quad => {
	      quad.hero = this.hero;
	    });

	    this.lifeMeter = obj.lifeMeter;
	    this.coinMeter = obj.coinMeter;
	    this.levelMeter = obj.levelMeter;
	    this.expMeter = obj.expMeter;
	    this.atkStrMeter = obj.atkStrMeter;

	  }

	  update(dt) {
	    if (this.quadrant.board.changeBoard) {
	      var newBoard = this.quadrant.board.changeBoard.next;
	      var newHeroPos = this.quadrant.board.changeBoard.newHeroPos;

	      this.quadrant.active = false;
	      this.quadrant.board.active = false;
	      this.quadrant.board.changeBoard= false;
	      this.quadrant = this.quadrants[newBoard - 1 ]; //quad ids = 1,2,3...
	      this.quadrant.active = true;
	      this.quadrant.board.active = true;
	      if (newHeroPos[0] !== null) {this.hero.pos[0] = newHeroPos[0];}
	      if (newHeroPos[1] !== null) {this.hero.pos[1] = newHeroPos[1];}
	      this.hero.board = this.quadrant.board;


	    }

	    this.quadrants.forEach(quad => quad.update(dt));
	  }

	  render() {
	    this.lifeMeter.innerHTML = this.hero.life > 0 ? "♡".repeat(Math.floor(this.hero.life / 10)) : "DEAD	☠";
	    this.coinMeter.innerHTML = Math.floor(this.hero.coins);


	    this.levelMeter.innerHTML = "LEVEL: " + this.hero.level;


	    this.expMeter.innerHTML = "EXP: " + Math.floor(this.hero.exp);


	    this.atkStrMeter.innerHTML = "Attack Strength: " + Math.floor(this.hero.atkDamage);

	    this.quadrants.forEach(quad => {
	      if (quad.active) {quad.render();}
	    });
	  }

	}//end class

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(3);
	const Hero = __webpack_require__(7);
	const Fireball = __webpack_require__(9);
	const skullGuy = __webpack_require__(10);
	const Greeny = __webpack_require__(12);
	const Coin = __webpack_require__(13);


	class Quadrant {

	  constructor(obj) {
	    this.quadrantId = obj.quadrantId;
	    this.active = obj.active;
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;



	    this.boardDimensions =
	      [[0,0], [this.canvas.height, this.canvas.width]];


	    this.board = new Board(
	      {boardId: this.quadrantId, ctx: this.ctx,
	        canvas: this.canvas, active: this.active});

	    this.InitLibrary = {
	      1: {
	        monsters: [
	          new skullGuy({board: this.board, pos: [100,100]}),
	          new Greeny({board: this.board, pos: [200,100]}),
	          new Greeny({board: this.board, pos: [50,300]})],

	        coins: () => {
	          var results = [];
	          for (var i = 0; i < 10; i++) {
	            var coin = new Coin({board: this.board,
	              value: Math.floor(Math.random()*30)});
	            coin.pos = [(Math.random()*(this.board.width - 96)+32),
	             (Math.random()*(this.board.height-96)+32) ];
	            results.push(coin);
	            }
	          return results;
	        }
	      },

	      2: {
	        monsters: [
	          new skullGuy({board: this.board, pos: [100,100]}),
	          new skullGuy({board: this.board, pos: [150,100]}),
	          new skullGuy({board: this.board, pos: [100,150]}),
	          new skullGuy({board: this.board, pos: [200,200]}),
	          new skullGuy({board: this.board, pos: [300,250]})],

	        coins: () => []
	      }
	    };//end library


	    this.fireballs = [];

	    this.monsters = this.InitLibrary[this.quadrantId].monsters;
	    this.coins = this.InitLibrary[this.quadrantId].coins();
	  }



	  update(dt) {
	    this.updateMonsters(dt);
	    if (this.active) {
	      this.updateFireballs(dt);
	      this.hero.update(dt);
	      this.updateCoins(dt);
	      if (this.hero.attackApex) {this.collisionCheckHeroWeapon();}
	      this.collsionCheckFireballs();
	      this.collsionCheckCoins();
	      this.collsionCheckMonsters();
	    }
	  }




	  render () {
	    this.board.render();


	    for (var j = 0; j < this.monsters.length; j++) {
	      this.monsters[j].render();
	    }

	    for (var k = 0; k < this.coins.length; k++) {
	      this.coins[k].render();
	    }
	    if (this.active) {this.hero.render();}
	    for (var i = 0; i < this.fireballs.length; i++) {
	      this.fireballs[i].render();
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

	  spawnMonsters() {
	    switch (this.quadrantId) {
	    case 1:
	      this.monsters = [
	        new skullGuy({board: this.board, pos: [100,100]}),
	        new Greeny({board: this.board, pos: [200,100]}),
	        new Greeny({board: this.board, pos: [50,300]})];
	      break;
	    case 2:
	      this.monsters = [new skullGuy({board: this.board, pos: [100,100]}),
	        new skullGuy({board: this.board, pos: [150,100]}),
	        new skullGuy({board: this.board, pos: [100,150]}),
	        new skullGuy({board: this.board, pos: [200,200]}),
	        new skullGuy({board: this.board, pos: [300,250]})];
	      break;
	    default:
	      break;
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

	    if (this.monsters.length === 0) {
	      if (this.waitingToSpawn) {
	        if (Date.now() > this.nextSpawnTime) {
	          this.waitingToSpawn = false;
	          this.spawnMonsters();}
	        } else {
	            this.waitingToSpawn = true;
	            this.nextSpawnTime = Date.now() + 20000;
	          }

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
	      newFB.fireballSound.play();

	    }
	  }

	  calcFBpos() {
	    var temp = this.hero.pos.slice(0);
	    var x = temp[0];
	    var y = temp[1];
	    switch (this.hero.lastDir) {
	    case "N":
	      y += this.hero.height/4;
	      break;
	    case "E":
	      x += this.hero.width / 3;
	      y += this.hero.height * 0.10;
	      break;
	    case "S":
	      break;
	    case "W":
	      x += this.hero.width/3 ;
	      y += this.hero.height*.1;
	      break;
	    case "NE":
	      break;
	    case "NW":
	    x += this.hero.width/3 ;
	    y += this.hero.height*.1;
	      break;
	    case "SW":
	    x += this.hero.width/3 ;
	    y += this.hero.height*.1;
	      break;
	    default:
	      break;

	      }

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

	module.exports = Quadrant;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Tree = __webpack_require__(4);
	const Door = __webpack_require__(6);


	class Board {
	  constructor(obj) {

	    this.active = obj.active;
	    this.ctx = obj.ctx;
	    this.canvas = obj.canvas;
	    this.boardId = obj.boardId;
	    this.height = this.canvas.height;
	    this.width = this.canvas.width;
	    this.boardDimensions = [[0,0], [this.canvas.height, this.canvas.width]];
	    this.imageReady = false;
	    this.image = new Image();
	    this.image.src =
	    "./images/background.png";
	    this.image.onload = () => (this.imageReady = true);

	    this.IMMOVEABLES = {
	      1: this.loadBoard1(),
	      2: this.loadBoard2()
	    };
	    this.immoveables = this.IMMOVEABLES[this.boardId];
	    this.immoveables.forEach((el) => el.render() );
	  }

	  loadBoard1() {
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
	    results.push(new Door({newHeroPos: [null,350], board: this, pos: [206,0], width: 100, height: 35, ctx: this.ctx, next: 2, from: 1}));

	    return results;

	  }

	  loadBoard2() {
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
	    
	    results.push(new Door({newHeroPos: [null,20], board: this, pos: [206,430], width: 100, height: 43, ctx: this.ctx, next: 1, from: 2}));

	    return results;

	  }

	  posCenter() {
	    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
	    + 166 );
	    var yyy = Math.floor((this.height / 2) );
	    return [xxx,yyy];

	  }

	  checkCollisionImmoveables(who, newPos) {
	    var board = who.board;
	    var obj = {height: who.height, width: who.width, pos: newPos};
	    for (var i = 0; i < board.immoveables.length; i++) {
	      var immoveable = board.immoveables[i];

	      if (
	           obj.pos[0] <= (immoveable.pos[0] + (immoveable.width *.3))
	        && immoveable.pos[0] <= (obj.pos[0] + (obj.width * .6))
	        && obj.pos[1] <= (immoveable.pos[1] + immoveable.height *.4)
	        && immoveable.pos[1] <= (obj.pos[1] + obj.width)
	      ) {
	          if (immoveable.type === "door" && who.type === "hero") {
	          this.changeBoard = {next: immoveable.next, newHeroPos: immoveable.newHeroPos};
	        } else {board.changeBoard = false;}
	          return true;
	        }

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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Immoveable = __webpack_require__(5);


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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Immoveable = __webpack_require__(5);


	class Door extends Immoveable {
	  constructor (obj) {
	  super(obj);
	  this.pos = obj.pos;
	  this.newHeroPos = obj.newHeroPos;
	  this.width = obj.width;
	  this.height = obj.height;
	  this.next = obj.next;
	  this.from = obj.from;
	  this.ctx = obj.ctx;
	  this.type = "door";
	  }

	  render() {
	  	this.ctx.fillStyle = "rgb(0,0,0)";
	  	this.ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
	  }
	}//end class


	module.exports = Door;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(8);

	class Hero extends Moveable {
	  constructor(obj) {
	    super(obj);
	    this.attackSound = new Audio("./images/209121__lukesharples__sword-swipe11.wav");
	    this.gotHitSound = new Audio ("./images/242623__reitanna__grunt.wav");
	    this.dyingSound = new Audio ("./images/101120__robinhood76__01685-harp-groan.wav");
	    this.levelUpSound = new Audio ("./images/346425__soneproject__ecofuture3.wav");
	    this.twerkSound = new Audio ("./images/miley.mp3");
	    this.maxLife = 30;
	    this.life = 30;
	    this.coins = 0;
	    this.level = 1;
	    this.exp = 0;
	    this.endAttack();
	    this.lastAttack = Date.now();
	    this.justHit = false;
	    this.justHitTimer = 0;
	    this.newFireball = false;
	    this.lastFireball = 0;
	    this.fireballDelay = 1000;
	    this.fireballSpeed = 1000;
	    this.attackDelay = 200;
	    this.name = "HERO";
	    this.width = 64;
	    this.height = 64;
	    this.shakingAss = false;
	    this.twerkStartTime = 0;
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
	    this.type = "hero";
	  }

	  updateHero() {
	    this.updateLevel();
	  }

	  updateLevel() {
	    var oldLevel = this.level;
	    if (this.exp > 9000) {
	      this.level = 2;
	      this.maxLife = 40;
	      this.life = 40;}
	    if (this.exp > 20000) {
	      this.level = 3;
	      this.maxLife = 50;
	      this.life = 50;}
	    if (this.level > oldLevel) {this.levelUp();}
	  }

	  levelUp() {
	    this.levelUpSound.play();

	    if (this.level>3) {
	      this.fireballDelay = 0;
	      this.fireballSpeed = 500;
	    }
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
	    this.twerkSound.play();
	    this.shakingAss = true;
	    this.facing = "N";
	    this.updateAnimSet();
	    this.animDelay = 10;
	    this.movementOn = false;
	    this.animationOn = true;
	    this.twerkStartTime = Date.now();



	  }

	  shakeAssOff() {
	    this.twerkSound.pause();
	    this.shakingAss = false;
	    this.facing = "S";
	    this.updateAnimSet(); //DRY THIS UP LATER?  based on facing?
	    this.animDelay = 40;
	    this.movementOn = true;
	    this.automover = false;
	  }

	  getHit() {
	    this.life -= 10;
	    if (this.life <= 0) {
	        this.life =0;
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
	        this.life -= 10;
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
	        if (this.shakingAss) {
	          this.life += ((Date.now() - this.twerkStartTime));
	            this.life = Math.min(this.life, this.maxLife);
	          }
	        ++this.animFrame;
	        if (this.animFrame > 3 && this.attacking) {this.attackApex = true;}
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
/* 8 */
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
	    if (this.type === 'hero') {this.updateHero();}
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
	    if (!(this.board.checkCollisionImmoveables(this, newPos))) {
	      this.hitSomething = false;
	      this.pos = newPos;
	  } else {
	      this.hitSomething = true;
	      }
	  }//end move()

	  render() {
	    if (!(this.blinking) || (this.blinking && (this.blinking % 2 !== 0))) {
	      if (this.name === 'FIREBALL') {console.log(this);}
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(8);

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(11);

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(8);

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(11);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	const Moveable = __webpack_require__(8);

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
/* 14 */
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