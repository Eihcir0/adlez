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

const DIAGS = ["NE","NW","SE","SW"];

const Moveable = require('./moveable.js');

class Fireball extends Moveable {
  constructor(obj) {
    super(obj);

    this.name = "FIREBALL";
    this.pos = obj.pos;
    this.width = 64;
    this.height = 64;
    this.speed = 500;
    this.directionVector = obj.directionVector;
    this.animSet = 0;
    this.animFrame = 0;
    this.animNumFrames = 4;
    this.animDelay = 100;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/fireball_0.png";
    this.image.onload = () => (this.imageReady = true);
    this.done = false;

    this.updateDirection();
  }


  currentSprite() {
    return (
      (this.animSet * (this.width * this.animNumFrames)) +
      (this.animFrame * this.width)
    );
  }

  updateAnimSet() {  //should refactor this with a const array
    let d = this.direction;
    if (d === "N") {
      this.animSet = 0;
      this.spriteVertOffset = 2;
    } else if (d === "NE") {
      this.animSet = 0;
      this.spriteVertOffset = 3;
    } else if (d === "E") {
      this.animSet = 0;
      this.spriteVertOffset = 4;
    } else if (d==="SE") {
      this.animSet = 0;
      this.spriteVertOffset = 5;
    } else if (d==="S" || d==="STOP") {
      this.animSet = 0;
      this.spriteVertOffset = 6;
    } else if (d==="SW") {
      this.animSet = 0;
      this.spriteVertOffset = 7;
    } else if (d==="W") {
      this.animSet = 0;
      this.spriteVertOffset = 0;
    } else if (d==="NW") {
      this.animSet = 0;
      this.spriteVertOffset = 1;
    }
  }


  updateAnim(elapsed) {
    this.updateDirection();
    this.animTimer += elapsed;
    if (this.animTimer >= this.animDelay) {
      this.animTimer = 0;
      if (this.direction!=="STOP") {
          ++this.animFrame;
      if (this.animFrame >= this.animNumFrames) {
          this.animFrame = 0;
        }
      }
    }
  }

  move(elapsed) {
    let newPos = this.pos;
    var move = (this.speed * (elapsed / 1000));
    let speedFactor;

    if (DIAGS.includes(this.direction)) { //reduce diag velocity
      speedFactor = 0.75;
    } else {
      speedFactor=1;
    }


    newPos[0] += Math.round(move *  this.directionVector[0]);
    newPos[1] += Math.round(move * speedFactor * this.directionVector[1]);

    this.pos = newPos;
    this.preventOutOfBounds();
  }

  preventOutOfBounds() {
    let northern = this.boardDimensions[0][1];
    let western = this.boardDimensions[0][0];
    let southern = this.boardDimensions[1][1] - this.height;
    let eastern = this.boardDimensions[1][0] - this.width;
    if (this.pos[0] <= western || this.pos[0] >= eastern || this.pos[1] <= northern || this.pos[1] >= southern) {
      this.done = true;
    }
  }


}

module.exports = Fireball;
