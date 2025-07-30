import { Block } from "../maps/block.js";

const canvas = document.getElementById('canvas');
const canvasRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

// 스코어 표시 DOM
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "scoreDisplay";
scoreDisplay.innerHTML = `<div id="score">Score: 0</div>`;
scoreDisplay.classList.add('scoreDisplay');
scoreDisplay.style.position = "absolute";
scoreDisplay.style.left = `${canvasRect.left + 20}px`;
scoreDisplay.style.top = `${canvasRect.top + 20}px`;
scoreDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
scoreDisplay.style.padding = "10px";
scoreDisplay.style.border = "2px solid #333";
scoreDisplay.style.borderRadius = "5px";
scoreDisplay.style.textAlign = "center";
scoreDisplay.style.fontSize = "20px";
scoreDisplay.style.color = "#000";
scoreDisplay.style.zIndex = "1000";

// 시작 안내창 DOM
const startContainer = document.createElement("div");
startContainer.id = "startContainer";
startContainer.innerHTML = `
  <p>게임을 시작하려면 버튼을 누르세요</p>
  <button id="startGameBtn">Start</button>`;
startContainer.classList.add("scoreDisplay");
startContainer.style.position = "absolute";
startContainer.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
startContainer.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
startContainer.style.transform = 'translate(-50%, -50%)';
startContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
startContainer.style.padding = "10px";
startContainer.style.border = "2px solid #333";
startContainer.style.borderRadius = "5px";
startContainer.style.textAlign = "center";
startContainer.style.fontSize = "16px";
startContainer.style.color = "#000";
startContainer.style.zIndex = "1000";

export let isInitialized = false;
export let frameCount = 0;
let hasKeyListener = false;

let startTime = null;
let gameOver = false;
let maxTime = 15000;
let goalScore = 10;
let score = 0;

let fallingItems = [];
export let obstacles = [];
export let interaction = [];

const cart = {
  x: 600,
  y: 640,
  width: 120,
  height: 50,
  speed: 8,
  movingLeft: false,
  movingRight: false
};

const imageAssets = {
  white: new Image(),
  black: new Image(),
  ramen: new Image(),
  perfume: new Image(),
  cart: new Image()
};

imageAssets.white.src = "/images/white.jpg";
imageAssets.black.src = "/images/black.jpg";
imageAssets.ramen.src = "/images/ramen.jpg";
imageAssets.perfume.src = "/images/perfume.jpg";
imageAssets.cart.src = "/images/cart.jpg";

const itemTypes = [
  { name: "white", score: 1 },
  { name: "black", score: -1 },
  { name: "ramen", score: -3 },
  { name: "perfume", score: 2 }
];

class FallingItem {
  constructor(x, y, type, score) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.type = type;
    this.score = score;
    this.speed = 5;
  }

  draw(ctx) {
    const img = imageAssets[this.type];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "gray";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    this.y += this.speed;
  }
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function spawnItem() {
  if (frameCount % 30 !== 0) return;
  const itemData = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const x = Math.random() * (canvas.width - 50);
  const item = new FallingItem(x, 0, itemData.name, itemData.score);
  fallingItems.push(item);
}

function drawCart(ctx) {
  const img = imageAssets.cart;
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, cart.x, cart.y, cart.width, cart.height);
  } else {
    ctx.fillStyle = "green";
    ctx.fillRect(cart.x, cart.y, cart.width, cart.height);
  }
}

export function showEndMessage(message, delay = 3000, player = null, loadMap = null) {
  const canvasRect = canvas.getBoundingClientRect();
  const messageBox = document.createElement('div');
  messageBox.style.position = "absolute";
  messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  messageBox.style.transform = 'translate(-50%, -50%)';
  messageBox.className = 'messageBox';
  messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  messageBox.style.padding = "20px";
  messageBox.style.border = "2px solid #333";
  messageBox.style.borderRadius = "5px";
  messageBox.style.fontSize = "40px";
  messageBox.style.color = "#000";
  messageBox.style.zIndex = "1000";
  messageBox.textContent = message;
  document.body.appendChild(messageBox);

  setTimeout(() => {
    messageBox.remove();

    if (message === "성공!" && player && loadMap) {
      player.state = 'dorm';
      loadMap('dorm');
      player.x = 800;
      player.y = 150;
    } else {
      // 실패한 경우 게임 재시작 창 다시 표시
      if (!document.getElementById("startContainer")) {
        const restartContainer = document.createElement("div");
        restartContainer.id = "startContainer";
        restartContainer.innerHTML = `
          <p>게임을 다시 시작하려면 버튼을 누르세요</p>
          <button id="startGameBtn">Start</button>`;
        restartContainer.classList.add("scoreDisplay");
        restartContainer.style.position = "absolute";
        restartContainer.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
        restartContainer.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
        restartContainer.style.transform = 'translate(-50%, -50%)';
        restartContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        restartContainer.style.padding = "10px";
        restartContainer.style.border = "2px solid #333";
        restartContainer.style.borderRadius = "5px";
        restartContainer.style.textAlign = "center";
        restartContainer.style.fontSize = "16px";
        restartContainer.style.color = "#000";
        restartContainer.style.zIndex = "1000";
        document.body.appendChild(restartContainer);

        const startBtn = document.getElementById("startGameBtn");
        startBtn.onclick = () => {
          isInitialized = true;
          startTime = performance.now();
          restartContainer.remove();
          if (!document.getElementById("scoreDisplay")) {
            document.body.appendChild(scoreDisplay);
          }
          score = 0;
          fallingItems = [];
          gameOver = false;
          cart.x = 600;
        };
      }
    }
  }, delay);
}



export function init(player) {
  if (!document.getElementById("scoreDisplay")) {
    document.body.appendChild(scoreDisplay);
  }

  if (!document.getElementById("startContainer")) {
    document.body.appendChild(startContainer);
    const startBtn = document.getElementById("startGameBtn");
    startBtn.onclick = () => {
      isInitialized = true;
      startTime = performance.now();
      startContainer.remove();
    };
  }

  frameCount = 0;
  score = 0;
  fallingItems = [];
  gameOver = false;
  cart.x = 600;
  cart.movingLeft = false;
  cart.movingRight = false;

  if (!hasKeyListener) {
    document.addEventListener("keydown", (e) => {
      if (!isInitialized) return;
      const key = e.key.toLowerCase();
      if (key === "a") cart.movingLeft = true;
      if (key === "d") cart.movingRight = true;
    });

    document.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      if (key === "a") cart.movingLeft = false;
      if (key === "d") cart.movingRight = false;
    });

    hasKeyListener = true;
  }
}

export function gameLoop(player, _, loadMap) {
  if (!isInitialized || gameOver) return;

  frameCount++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (cart.movingLeft) cart.x -= cart.speed;
  if (cart.movingRight) cart.x += cart.speed;
  cart.x = Math.max(0, Math.min(canvas.width - cart.width, cart.x));

  scoreDisplay.textContent = `Score: ${score}`;
  spawnItem();

  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.update();
    item.draw(ctx);

    if (checkCollision(cart, item)) {
      score += item.score;
      fallingItems.splice(i, 1);
    } else if (item.y > canvas.height) {
      fallingItems.splice(i, 1);
    }
  }

  drawCart(ctx);

  if (score >= goalScore) {
  gameOver = true;
  scoreDisplay.remove();
  player.key = 9;
  showEndMessage("성공!", 3000, player, loadMap); // 그대로
  return;
}

if (score <= -10) {
  gameOver = true;
  scoreDisplay.remove();
  showEndMessage("실패 ㅠㅠ", 3000); // player, loadMap 전달 안 함
  return;
}

const elapsed = performance.now() - startTime;
if (elapsed >= maxTime) {
  gameOver = true;
  scoreDisplay.remove();
  const message = score >= goalScore ? "성공!" : "실패 ㅠㅠ";
  showEndMessage(message, 3000, message === "성공!" ? player : null, message === "성공!" ? loadMap : null);
}

}
