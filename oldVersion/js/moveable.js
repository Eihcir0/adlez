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
    if (this.direction !== "STOP") {
    this.lastDir = this.directionVector;}
    this.directionVector = [0,0];
    this.updateDirection();

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



  update(elapsed) {
    this.updateAnim(elapsed);
    this.move(elapsed);

  }


} //end class

module.exports = Moveable;
