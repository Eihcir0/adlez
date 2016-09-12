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

class Hero {
  constructor(boardDimensions = [[332,0],[812,512]]) {
    this.boardDimensions = boardDimensions;
    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];
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
    this.image.src = "/Users/Eihcir0/Desktop/sprite_game/images/hero_sheet.png";
    this.image.onload = () => (this.imageReady = true);

    // this.stop = this.stop.bind(this);
    // this.face = this.face.bind(this);
    // this.shakeAssOn = this.shakeAssOn.bind(this);
    // this.shakeAssOff = this.shakeAssOff.bind(this);
    // this.updateDirection = this.updateDirection.bind(this);
    // this.updateAnimSet = this.updateAnimSet.bind(this);
    // this.update = this.update.bind(this);
    // this.updateAnim = this.updateAnim.bind(this);
    // this.move = this.move.bind(this);
    // this.preventOutOfBounds = this.preventOutOfBounds.bind(this);
    // this.posCenter = this.posCenter.bind(this);
    // this.currentSprite = this.currentSprite.bind(this);
    this.posCenter();
    this.updateDirection();
  }


  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 - (this.width / 2));
    var yyy = Math.floor((this.boardHeight / 2) - (this.width / 2));
    this.pos = [xxx,yyy];
  }

  shakeAssOn() {
    this.shakingAss = true;
    this.directionVector = [0,0];
  }

  shakeAssOff() {
    this.shakingAss = false;
    this.directionVector = [0,0];
    this.animSet = 4;
  }


  stop() {
    this.directionVector = [0,0];
  }

  updateDirection() {
    let x = this.directionVector[0];
    let y = this.directionVector[1];
    Object.keys(MOVES).forEach((key) => {
	    if (MOVES[key][0]===x && MOVES[key][1]===y) {
		    this.direction = key;
	    }
    });

  }

  face(dir) {
    this.directionVector = MOVES[dir];
    this.updateDirection();
    this.updateAnimSet();
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

  update(elapsed) {
    this.updateAnim(elapsed);
    this.move(elapsed);

  }

  updateAnim(elapsed) {
    this.updateDirection();
    this.animTimer += elapsed;
    if (this.animTimer >= this.animDelay) {
      this.animTimer = 0;}
    if (this.direction!=="STOP" || this.shakingAss) {
          ++this.animFrame;

        if (this.animFrame >= this.animNumFrames) {
          this.animFrame = 0;
        }
      }
    }



  move(elapsed) {
    var move = (this.speed * (elapsed / 1000));
    let speedFactor;

    if (DIAGS.includes(this.direction)) { //reduce diag velocity
      speedFactor = 0.75;
    } else {
      speedFactor=1;
    }
  	this.pos[0] += Math.round(move *  this.directionVector[0]);
  	this.pos[1] += Math.round(move * speedFactor * this.directionVector[1]);

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

} //end class

module.exports = Hero;
