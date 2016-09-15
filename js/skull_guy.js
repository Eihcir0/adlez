const Monster = require('./monster.js');

class skullGuy extends Monster {
  constructor(obj) {
    super(obj);

    this.width = 32;
    this.height = 32;
    this.maxHp = 10;
    this.hp = this.maxHp;
    this.Maxspeed = 150;
    this.speed = 150;
    this.facing = "N";

    this.animSet = 0;
    this.spriteYoffset = 1;
    this.animFrame = 0;
    this.animNumFrames = 3;
    this.animDelay = 100;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/monsters-32x32.png";
    this.image.onload = () => (this.imageReady = true);
    this.movements = ["E","E","E","E","E","E","N", "N", "W", "W", "W", "W", "W", "W", "S","S","S"];
    this.currentMovement = 0;
    this.numMovements = 17;
  }

  updateAnimSet() {  //should refactor this with a const array
    let d = this.facing;
    if (d === "N") {
      this.animSet = 2;
    } else if (d === "NE") {
      this.animSet = 2;
    } else if (d === "E") {
      this.animSet = 1;
    } else if (d==="SE") {
      this.animSet = 0;
    } else if (d==="S" || d==="STOP") {
      this.animSet = 0;
    } else if (d==="SW") {
      this.animSet = 0;
    } else if (d==="W") {
      this.animSet = 3;
    } else if (d==="NW") {
      this.animSet = 2;
    }
  }




} //end class

module.exports = skullGuy;
