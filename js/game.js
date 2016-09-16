const Quadrant = require('./quadrant.js');
const Hero = require('./hero.js');

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
