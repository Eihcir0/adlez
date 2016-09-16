const Board = require('./board.js');
const Hero = require('./hero.js');
const Fireball = require('./fireball.js');
const skullGuy = require('./skull_guy.js');
const Greeny = require('./greeny.js');
const Coin = require('./coin.js');


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
