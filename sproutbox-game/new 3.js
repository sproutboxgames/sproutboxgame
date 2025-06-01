const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dino = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  velocityY: 0,
  gravity: 1,
  jumpPower: -15,
  grounded: true,
  jump() {
    if (this.grounded) {
      this.velocityY = this.jumpPower;
      this.grounded = false;
    }
  },
  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y > 150) {
      this.y = 150;
      this.velocityY = 0;
      this.grounded = true;
    }
  },
  draw() {
    ctx.fillStyle = "#444";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

let obstacles = [];
let score = 0;
let speed = 6;
let lastObstacleTime = 0;

function createObstacle() {
  return {
    x: canvas.width,
    y: 160,
    width: 20,
    height: 40,
    speed: speed
  };
}

function updateObstacles(timestamp) {
  if (timestamp - lastObstacleTime > 1500) {
    obstacles.push(createObstacle());
    lastObstacleTime = timestamp;
  }

  obstacles.forEach((ob, index) => {
    ob.x -= ob.speed;

    if (ob.x + ob.width < 0) {
      obstacles.splice(index, 1);
      score++;
      document.getElementById("score").textContent = `Score: ${score}`;
      speed += 0.05; // gradually increase difficulty
    }

    // Collision detection
    if (
      dino.x < ob.x + ob.width &&
      dino.x + dino.width > ob.x &&
      dino.y < ob.y + ob.height &&
      dino.y + dino.height > ob.y
    ) {
      alert("Game Over! Final score: " + score);
      document.location.reload();
    }
  });
}

function drawObstacles() {
  ctx.fillStyle = "green";
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dino.update();
  dino.draw();

  updateObstacles(timestamp);
  drawObstacles();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    dino.jump();
  }
});

requestAnimationFrame(gameLoop);
