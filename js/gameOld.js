// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Hero image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

//Game objects

var hero = {
  speed: 256,
  x: 0,
  y: 0
};

var monster = {
  x: 0,
  y: 0
};

var monstersCaught = 0;

//hnadle input
var keysDown = {};

addEventListener("keydown", (e) => (keysDown[e.keyCode] = true)
, false);

addEventListener("keyup", (e) => delete keysDown[e.keyCode], false);


// Reset game after monster caught

var reset = () => {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.width - 64));
};


//update objects
let modifier;
var update = () => {
  if (38 in keysDown) { //UP
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) { //DOWN
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { //left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) { //right
    hero.x -= hero.speed * modifier;
  }

  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }

};


//draw everything

var render = () => {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  //Score

  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);

};

//main game loop

var main = () => {
  var now = Date.now();
  var delta = now - then;
  update(delta / 1000);
  render();

  then = now;

  requestAnimationFrame(main);

};

// Cross-browser support
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


//play game

var then = Date.now();
reset();
main();
