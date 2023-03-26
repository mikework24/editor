// Player Stand
var myPlayerRotate = 0;

var playerIdle = playerSprite({
  image: './img/player/idle.png',
  ticksPerFrame: 15,
  numberOfFrames: 6
});

//Player Walk
var playerWalkLeft = playerSprite({
  image: './img/player/walk.png',
  ticksPerFrame: 7,
  numberOfFrames: 6,
  mirror: true
});

var playerWalkRight = playerSprite({
  image: './img/player/walk.png',
  ticksPerFrame: 7,
  numberOfFrames: 6
});


// Player Run
var playerRunLeft = playerSprite({
  image: './img/player/run.png',
  ticksPerFrame: 4,
  numberOfFrames: 8,
  mirror: true
});

var playerRunRight = playerSprite({
  image: './img/player/run.png',
  ticksPerFrame: 4,
  numberOfFrames: 8
});

// Player Jump Up
var playerJumpUpLeft = playerSprite({
  image: './img/player/jump_up.png',
  ticksPerFrame: 6,
  numberOfFrames: 4,
  loop: false,
  mirror: true
});

var playerJumpUpRight = playerSprite({
  image: './img/player/jump_up.png',
  ticksPerFrame: 6,
  numberOfFrames: 4,
  loop: false
});

// Player Jump Down
var playerJumpDownLeft = playerSprite({
  image: './img/player/jump_down.png',
  ticksPerFrame: 6,
  numberOfFrames: 4,
  loop: false,
  mirror: true
});

var playerJumpDownRight = playerSprite({
  image: './img/player/jump_down.png',
  ticksPerFrame: 6,
  numberOfFrames: 4,
  loop: false
});

var playerAttackRight = playerSprite({
  image: './img/player/attack.png',
  ticksPerFrame: 2,
  numberOfFrames: 7,
  loop: false,
});

var playerAttackLeft = playerSprite({
  image: './img/player/attack.png',
  ticksPerFrame: 2,
  numberOfFrames: 7,
  loop: false,
  mirror: true
});

var playerDeathLeft = playerSprite({
  image: './img/player/death.png',
  ticksPerFrame: 4,
  numberOfFrames: 20,
  loop: false,
  mirror: true
});

var playerDeathRight = playerSprite({
  image: './img/player/death.png',
  ticksPerFrame: 4,
  numberOfFrames: 20,
  loop: false,
});


const playerJumpReset = () => {
  playerJumpUpLeft.reset();
  playerJumpUpRight.reset();
  playerJumpDownLeft.reset();
  playerJumpDownRight.reset();
}

const playerAttackReset = () => {
  playerAttackRight.reset();
  playerAttackLeft.reset();
}
