const Moveable = require('./moveable.js');

class Hero extends Moveable {
  constructor(obj) {
    super(obj);

    this.newFireball = false;
    this.lastFireball = Date.now();
    this.fireballDelay = 1000;
    this.name = "HERO";
    this.width = 32;
    this.height = 32;
    this.shakingAss = false;

    this.speed = 0;
    this.Maxspeed = 200;

    this.pos = obj.pos;

    this.animSet = 4;
    this.spriteYoffset = 0;
    this.animFrame = 0;
    this.animNumFrames = 2;
    this.animDelay = 100;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/hero_sheet.png";
    this.image.onload = () => (this.imageReady = true);


  }



  shakeAssOn() {
    this.shakingAss = true;
    this.facing = "N";
    this.updateAnimSet();
    this.animDelay = 50;
    this.movementOn = false;
    this.animationOn = true;


  }

  shakeAssOff() {
    this.shakingAss = false;
    this.facing = "S";
    this.updateAnimSet(); //DRY THIS UP LATER?  based on facing?
    this.animDelay = 200;
    this.movementOn = true;
    this.automover = false;
  }


  updateAnimSet() {  //should refactor this with a const array
    let d = this.facing;
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




} //end class

module.exports = Hero;
