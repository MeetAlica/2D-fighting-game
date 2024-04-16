function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie!";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins!!";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins!!";
  }
}

let timer = 21;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}

// Restart game
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    keys.Enter.pressed = true;

    clearTimeout(timerId);
    timer = 21;
    decreaseTimer();

    player.health = 100;
    gsap.to("#playerHealth", {
      width: "100%",
    });
    player.switchSprite("idle");
    player.dead = false;

    enemy.health = 100;
    gsap.to("#enemyHealth", {
      width: "100%",
    });
    enemy.switchSprite("idle");
    enemy.dead = false;

    keys.Enter.pressed = false;
  }
});
