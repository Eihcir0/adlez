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

class Moveable {
  constructor(obj = {boardDimensions: [[332,0],[812,512]]}) {
    this.boardDimensions = obj.boardDimensions;
    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];

  }


  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 - (this.width / 2));
    var yyy = Math.floor((this.boardHeight / 2) - (this.width / 2));
    this.pos = [xxx,yyy];
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

} //end class

module.exports = Moveable;
