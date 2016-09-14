class Board {
  constructor(obj) {
    this.ctx = obj.ctx;
    this.canvas = obj.canvas;
    this.boardId = obj.id;
    this.height = 512;
    this.width = 512;
    this.boardDimensions = obj.boardDimensions;
    this.boardWidth = this.boardDimensions[1][0] - this.boardDimensions[0][0];
    this.boardHeight = this.boardDimensions[1][1] - this.boardDimensions[0][1];
  }

  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 );
    var yyy = Math.floor((this.boardHeight / 2) );
    return [xxx,yyy];

  }

  render() {
  // Draw a green background. Pretend it's grass
  	this.ctx.fillStyle = "rgb(51, 118, 36)";
  	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  }

} //end class

module.exports = Board;
