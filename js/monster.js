const Moveable = require('./moveable.js');

class Monster extends Moveable {
  constructor(obj) {
    super(obj);
    this.width = 32;
    this.height = 32;
    this.shakingAss = false;
    this.pos = obj.pos;
    this.speed = 0;
    this.directionVector = [0,0];
    this.animSet = 0;
    this.animFrame = 0;
    this.animNumFrames = 1;
    this.animDelay = 0;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src = "/Users/Eihcir0/Desktop/my_little_rpg/images/monster.png";
    this.image.onload = () => (this.imageReady = true);

  }
}

module.exports = Monster;
