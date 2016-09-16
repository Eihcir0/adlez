const Tree = require('./tree.js');
const Door = require('./door.js');


class Board {
  constructor(obj) {

    this.active = obj.active;
    this.ctx = obj.ctx;
    this.canvas = obj.canvas;
    this.boardId = obj.boardId;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.boardDimensions = [[0,0], [this.canvas.height, this.canvas.width]];
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/background.png";
    this.image.onload = () => (this.imageReady = true);

    this.IMMOVEABLES = {
      1: this.loadBoard1(),
      2: this.loadBoard2()
    };
    this.immoveables = this.IMMOVEABLES[this.boardId];
    this.immoveables.forEach((el) => el.render() );
  }

  loadBoard1() {
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
    results.push(new Door({newHeroPos: [null,350], board: this, pos: [206,0], width: 100, height: 35, ctx: this.ctx, next: 2, from: 1}));

    return results;

  }

  loadBoard2() {
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
    
    results.push(new Door({newHeroPos: [null,20], board: this, pos: [206,430], width: 100, height: 43, ctx: this.ctx, next: 1, from: 2}));

    return results;

  }

  posCenter() {
    var xxx = Math.floor((this.boardDimensions[1][0] / 2)
    + 166 );
    var yyy = Math.floor((this.height / 2) );
    return [xxx,yyy];

  }

  checkCollisionImmoveables(who, newPos) {
    var board = who.board;
    var obj = {height: who.height, width: who.width, pos: newPos};
    for (var i = 0; i < board.immoveables.length; i++) {
      var immoveable = board.immoveables[i];

      if (
           obj.pos[0] <= (immoveable.pos[0] + (immoveable.width *.3))
        && immoveable.pos[0] <= (obj.pos[0] + (obj.width * .6))
        && obj.pos[1] <= (immoveable.pos[1] + immoveable.height *.4)
        && immoveable.pos[1] <= (obj.pos[1] + obj.width)
      ) {
          if (immoveable.type === "door" && who.type === "hero") {
          this.changeBoard = {next: immoveable.next, newHeroPos: immoveable.newHeroPos};
        } else {board.changeBoard = false;}
          return true;
        }

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
