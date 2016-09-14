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

class Hero extends Moveable {
  constructor(obj) {
    super(obj);
    this.newFireball = false;
    this.lastFireball = Date.now();x
    this.lastDir = [0,-1];
    this.name = "HERO";
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

    this.spriteVertOffset = 0;
    this.posCenter();
    this.updateDirection();
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
    this.pos[0] = Math.max(this.pos[0], western);
    this.pos[0] = Math.min(this.pos[0], eastern);
    this.pos[1] = Math.max(this.pos[1], northern);
    this.pos[1] = Math.min(this.pos[1], southern);
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
    } else if (d === "NE") {
      this.animSet = 1;
    } else if (d === "E") {
      this.animSet = 2;
    } else if (d==="SE") {
      this.animSet = 3;
    } else if (d==="S" || d==="STOP") {
      this.animSet = 4;
    } else if (d==="SW") {
      this.animSet = 5;
    } else if (d==="W") {
      this.animSet = 6;
    } else if (d==="NW") {
      this.animSet = 7;
    }
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
