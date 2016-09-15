const Moveable = require('./moveable.js');

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
