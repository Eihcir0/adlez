const Moveable = require('./moveable.js');

class Hero extends Moveable {
  constructor(obj) {
    super(obj);
    this.attackSound = new Audio("./images/209121__lukesharples__sword-swipe11.wav");
    this.gotHitSound = new Audio ("./images/242623__reitanna__grunt.wav");
    this.dyingSound = new Audio ("./images/101120__robinhood76__01685-harp-groan.wav");
    this.life = 5;
    this.level = 5;
    this.exp = 0;
    this.endAttack();
    this.lastAttack = Date.now();
    this.justHit = false;
    this.justHitTimer = 0;
    this.newFireball = false;
    this.lastFireball = Date.now();
    this.fireballDelay = 2000;
    this.attackDelay = 200;
    this.name = "HERO";
    this.width = 64;
    this.height = 64;
    this.shakingAss = false;
    this.atkDamage = 1;
    this.directHit = true;
    this.speed = 0;
    this.Maxspeed = 200;

    this.pos = obj.pos;

    this.animSet = 3;
    this.spriteYoffset = 0;
    this.animFrame = 0;
    this.animNumFrames = 9;
    this.animDelay = 40;
    this.animTimer = 0;
    this.imageReady = false;
    this.image = new Image();
    this.image.src =
    "./images/new_mimi.png";
    this.image.onload = () => (this.imageReady = true);
    this.facing = "S";
    this.updateAnimSet();

  }

  stop() {
    if (!(this.attacking)) {
      if (this.facing !== "STOP") {
        this.lastDir = this.facing;}
        this.facing = "STOP";
        this.animationOn = false;
      }
  }


  shakeAssOn() {
    this.shakingAss = true;
    this.facing = "N";
    this.updateAnimSet();
    this.animDelay = 10;
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

  getHit() {
    if (this.life === 1) {
        this.gotHitSound.play();
        this.dyingSound.play();
        this.stop();
        this.endAttack();
        this.animationOn = true;
        this.justHit = false;
        this.justHitTimer = 0;
        this.life = 0;
        this.animFrame = 0;
        this.dying = true;
        this.spriteYoffset = 20;
        this.animNumFrames = 5;
        this.animDelay = 200;
        this.speed = 0;
      } else {
        this.gotHitSound.play();
        this.life -= 1;
        this.justHit = true;
      }

  }



  attack() {
    if (Date.now() - this.lastAttack  > this.attackDelay) {
        if (this.level > 1) {this.newFireball=true;}
        this.lastAttack = Date.now();
        this.attacking = true;
        this.animationOn = true;
        this.movementOn = false;
        this.animFrame = 0;
        this.animNumFrames = 6;
        this.facing = this.lastDir;
        this.directHit = false;
        this.updateAnimSet();
        this.attackSound.play();
      }
    }

    endAttack() {
      this.attacking = false;
      this.movementOn = true;
      this.height = 64;
      this.width = 64;
      this.attackXoffset = 0;
      this.attackYoffset = 0;
      this.attackApex = false;
      this.updateAnimSet();
      this.facing = "STOP";
    }


  updateAnimSet() {  //should refactor this with a const array
    let d = this.facing;
    if (d === "N") {
      this.animSet = 0;
      this.spriteYoffset = 8;
      if (this.attacking) {
        this.attackXoffset = -64;
        this.spriteYoffset = 22 / 3;
      }
    } else if (d === "NE") {
      this.animSet = 0;
      this.spriteYoffset = 11;
      if (this.attacking) {
        this.attackXoffset = -64;
        this.spriteYoffset = 31/3;
      }
    } else if (d === "E") {
      this.animSet = 0;
      this.spriteYoffset = 11;
      if (this.attacking) {
        this.attackXoffset = -64;
        this.spriteYoffset = 31/3;
      }
    } else if (d==="SE") {
      this.animSet = 0;
      this.spriteYoffset = 11;
      if (this.attacking) {
        this.attackXoffset = -64;
        this.spriteYoffset = 31/3;
      }
    } else if (d==="S" || d==="STOP") {
      this.animSet = 0;
      this.spriteYoffset = 10;
      if (this.attacking) {
        this.spriteYoffset = 28/ 3;
        this.attackXoffset = -64;
      }
    } else if (d==="SW") {
      this.animSet = 0;
      this.spriteYoffset = 9;
      if (this.attacking) {
        this.spriteYoffset = 23/ 3;
        this.attackXoffset = -64;
        this.attackYoffset = -128;
      }
    } else if (d==="W") {
      this.animSet = 0;
      this.spriteYoffset = 9;
      if (this.attacking) {
        this.spriteYoffset = 23/ 3;
        this.attackXoffset = -64;
        this.attackYoffset = -128;
      }
    } else if (d==="NW") {
      this.animSet = 0;
      this.spriteYoffset = 9;
      if (this.attacking) {
        this.spriteYoffset = 23/ 3;
        this.attackXoffset = -64;
        this.attackYoffset = -128;
      }
    }
  }

  updateAnim(elapsed) {
    if (this.animationOn) {
      this.animTimer += elapsed;

      if (this.animTimer >= this.animDelay) {
        this.animTimer = 0;
        ++this.animFrame;
        if (this.animFrame > 3 && this.attacking) {this.attackApex = true;console.log("APEX!");}
        if (this.animFrame >= this.animNumFrames) {
          if (this.dying) {
            this.animFrame = 5;
            this.done = true;
          } else if (this.attacking) {
            this.endAttack();
          } else {
            this.animFrame = 0;
          }
        }
      }
    }
  }
  render() {
    if (this.attacking) {
      this.ctx.drawImage(
  		this.image,
  		(this.animSet * (this.width * 3 * this.animNumFrames)) +
      (this.animFrame * this.width * 3),
      this.spriteYoffset*this.height*3,
      this.width*3,
      this.height*3,
  		this.pos[0] + this.attackXoffset,
      this.pos[1] + this.attackYoffset,
      this.width*3,
  		this.height*3
      );

    } else {
      this.ctx.drawImage(
  		this.image,
  		this.currentSprite(),
      this.spriteYoffset*this.height,
      this.width,
      this.height,
  		this.pos[0] + this.attackXoffset,
      this.pos[1] + this.attackYoffset,
      this.width,
  		this.height
      );}
    }

} //end class

module.exports = Hero;
