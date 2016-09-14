const Board = require('./board.js');
const Hero = require('./hero.js');
const Fireball = require('./fireball.js');
const skullGuy = require('./skull_guy.js');
const Greeny = require('./greeny.js');
const Coin = require('./coin.js');

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
