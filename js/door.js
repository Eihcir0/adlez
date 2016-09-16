const Immoveable = require('./immoveable.js');


class Door extends Immoveable {
  constructor (obj) {
  super(obj);
  this.pos = obj.pos;
  this.newHeroPos = obj.newHeroPos;
  this.width = obj.width;
  this.height = obj.height;
  this.next = obj.next;
  this.from = obj.from;
  this.ctx = obj.ctx;
  this.type = "door";
  }

  render() {
  	this.ctx.fillStyle = "rgb(0,0,0)";
  	this.ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  }
}//end class


module.exports = Door;
