class Board {
  constructor(obj) {
    this.ctx = obj.ctx;
    this.canvas = obj.canvas;
    this.boardId = obj.id;
    this.height = this.canvas.height;  ///temporary fix ??
    this.width = this.canvas.width;
    this.boardDimensions = obj.boardDimensions;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/background.png";
    this.image.onload = () => (this.imageReady = true);
  }

  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 );
    var yyy = Math.floor((this.height / 2) );
    return [xxx,yyy];

  }

  render() {
  // Draw a green background. Pretend it's grass
  	this.ctx.fillStyle = "rgb(51, 118, 36)";
  	this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.drawImage(
		this.image,
		0,
    0,
    512,
    512,
		0,
    0,
    512,
		512
	);
  }


} //end class

module.exports = Board;
