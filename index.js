const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  imageSrc: "./img/player/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./img/player/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/player/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/player/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/player/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/player/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/player/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/player/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 80,
      y: 50,
    },
    width: 170,
    height: 40,
  },
});

const enemy = new Fighter({
  position: {
    x: 820,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/enemy/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./img/enemy/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/enemy/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/enemy/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/enemy/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/enemy/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/enemy/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/enemy/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 40,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  Enter: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -10;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 10;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // Player jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -10;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 10;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // Enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detect for collision & enemy gets hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // If player misses
  if (player.isAttacking && player.framesCurrent == 4) {
    player.isAttacking = false;
  }

  // Detect for collision & player gets hit
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // If enemy misses
  if (enemy.isAttacking && enemy.framesCurrent == 2) {
    enemy.isAttacking = false;
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

playerScore = 0;
enemyScore = 0;

window.addEventListener("keydown", (event) => {
  // Player movements
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case "s":
        player.attack();
        break;
    }
  }

  // Enemy movements
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
