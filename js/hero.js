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
    this.animDelay = 100;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/hero_sheet.png";
    this.image.onload = () => (this.imageReady = true);


    this.posCenter();
    this.updateDirection();
  }

  face(dir) {
    this.directionVector = MOVES[dir];
    this.updateDirection();
    this.updateAnimSet();
  }

  shakeAssOn() {
    this.shakingAss = true;
    this.directionVector = [0,0];
    this.animDelay = 50;

  }

  shakeAssOff() {
    this.shakingAss = false;
    this.directionVector = [0,0];
    this.animSet = 4;
    this.animDelay = 200;

  }


  updateAnim(elapsed) {
    this.updateDirection();
    this.animTimer += elapsed;
    if (this.animTimer >= this.animDelay) {
      this.animTimer = 0;
      if (this.direction!=="STOP" || this.shakingAss) {
          ++this.animFrame;
      if (this.animFrame >= this.animNumFrames) {
          this.animFrame = 0;
        }
      }
    }
  }

}

module.exports = Hero;
