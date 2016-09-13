const Moveable = require('./moveable.js');

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


class Monster extends Moveable {
  constructor(obj) {
    super(obj);
    this.width = 32;
    this.height = 32;
    this.shakingAss = false;
    this.pos = obj.pos;
    this.speed = 100;
    this.directionVector = [1,0];
    this.animSet = 0;
    this.animFrame = 0;
    this.animNumFrames = 1;
    this.animDelay = 100;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src = "./images/monster.png";
    this.image.onload = () => (this.imageReady = true);
    this.movements = ["E","E","E","E","E","E","N", "N", "W", "W", "W", "W", "W", "W", "S","S","S"];
    this.sound =
    new Audio('./images/smb_bowserfire.wav');
    this.currentMovement = 0;
    this.numMovements = 17;

  }

  face(dir) {
    this.directionVector = MOVES[dir];
    this.updateDirection();
  }


  updateAnim(elapsed) {
    this.updateDirection();
    this.animTimer += elapsed;
    if (this.animTimer > this.animDelay) {
      this.animTimer = 0;
      if (this.direction!=="STOP") {
          ++this.animFrame;
          ++this.currentMovement;
          if (this.currentMovement >= this.numMovements - 1) {
            this.currentMovement = 0;
          }
          this.face(this.movements[this.currentMovement]);
      if (this.animFrame >= this.animNumFrames) {
          this.animFrame = 0;
        }
      }
    }
  }
}

module.exports = Monster;
