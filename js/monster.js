const Moveable = require('./moveable.js');

class Monster extends Moveable {
  constructor(obj) {
    super(obj);
    this.pos = obj.pos;
    this.automover = true;


  }



} //end class

module.exports = Monster;
