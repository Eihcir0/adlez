const Moveable = require('./moveable.js');

class Hero extends Moveable {
  constructor(obj) {
    super(obj);
    this.name = obj.name;
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
    this.image.src = "/Users/Eihcir0/Desktop/my_little_rpg/images/hero_sheet.png";
    this.image.onload = () => (this.imageReady = true);

    this.posCenter();
    this.updateDirection();
  }
}

module.exports = Hero;
