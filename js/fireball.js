const Moveable = require('./moveable.js');

class Fireball extends Moveable {
  constructor(obj) {
    super(obj);
    this.facing = obj.facing;
    this.pos = obj.pos;
    this.automover = false;

    this.name = "FIREBALL";
    this.width = 64;
    this.height = 64;

    this.speed = 500;
    this.Maxspeed = 500;
    this.animSet = 0;
    this.spriteYoffset = 0;
    this.animFrame = 0;
    this.animNumFrames = 4;
    this.animDelay = 1;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/fireball_0.png";
    this.image.onload = () => (this.imageReady = true);
    this.updateAnimSet();
  }



  updateAnimSet() {  //should refactor this with a const array
    let d = this.facing;
    if (d === "N") {
        this.animSet = 0;
        this.spriteYoffset = 2;
      } else if (d === "NE") {
        this.animSet = 0;
        this.spriteYoffset = 3;
      } else if (d === "E") {
        this.animSet = 0;
        this.spriteYoffset = 4;
      } else if (d==="SE") {
        this.animSet = 0;
        this.spriteYoffset = 5;
      } else if (d==="S" || d==="STOP") {
        this.animSet = 0;
        this.spriteYoffset = 6;
      } else if (d==="SW") {
        this.animSet = 0;
        this.spriteYoffset = 7;
      } else if (d==="W") {
        this.animSet = 0;
        this.spriteYoffset = 0;
      } else if (d==="NW") {
        this.animSet = 0;
        this.spriteYoffset = 1;
      }
    }




} //end class

module.exports = Fireball;
