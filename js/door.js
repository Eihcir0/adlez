const Immoveable = require('./immoveable.js');


class Tree extends Immoveable {
  constructor (obj) {
  super(obj);
  this.pos = obj.pos;
  this.width = 32;
  this.height = 32;
  this.image = new Image();
  this.image.src =
  "./images/background.png";
  this.image.onload = () => (this.imageReady = true);

  }

  render () {
    this.ctx.drawImage(
    this.image,
    0,
    32,
    this.width,
    this.height,
    this.pos[0],
    this.pos[1],
    this.width,
    this.height
    );
  }
}


module.exports = Tree;
