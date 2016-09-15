const Tree = require('./tree.js');


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
    let temp = this.outerTrees1();

    this.IMMOVEABLES = {
      1: temp
    };
    this.immoveables = this.IMMOVEABLES[this.boardId];
    this.immoveables.forEach((el) => el.render() );
  }

  outerTrees1() {
    var results = [];
    for (var i = 0; i < 16; i++) {
      results.push(new Tree({board: this, pos: [i*32, 0]}));
    }
    for (i = 0; i < 16; i++) {
      results.push(new Tree({board: this, pos: [i*32, 448]}));
    }

    for (i = 0; i < 15; i++) {
      results.push(new Tree({board: this, pos: [0, i*32]}));
    }
    for (i = 0; i < 15; i++) {
      results.push(new Tree({board: this, pos: [480, i*32]}));
    }
    return results;

  }

  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 );
    var yyy = Math.floor((this.height / 2) );
    return [xxx,yyy];

  }

  checkCollisionImmoveables(obj) {
    //chxeck for DOORS!!!
    for (var i = 0; i < this.immoveables.length; i++) {
      var immoveable = this.immoveables[i];


      if (
           obj.pos[0] <= (immoveable.pos[0] + (immoveable.width *.3))
        && immoveable.pos[0] <= (obj.pos[0] + (obj.width * .6))
        && obj.pos[1] <= (immoveable.pos[1] + immoveable.height *.4)
        && immoveable.pos[1] <= (obj.pos[1] + obj.width)
      ) {return true;}

    }//end for
    return false;
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
  this.IMMOVEABLES[this.boardId].forEach((el) => el.render() );
  }


} //end class

module.exports = Board;
