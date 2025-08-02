import { Block } from "../maps/block.js";

const canvas = document.getElementById('canvas');
const canvasRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

const backgroundImg = new Image();
backgroundImg.src = "/images/background.jpg";
let isBackgroundLoaded = false;
backgroundImg.onload = () => {
  isBackgroundLoaded = true;
};

function drawBackground(ctx) {
  if (isBackgroundLoaded) {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  }
}

// 점수 표시 DOM
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "scoreDisplay";
scoreDisplay.innerHTML = `<div id="score">Score: 0</div>`;
scoreDisplay.classList.add('scoreDisplay');
scoreDisplay.style.position = "absolute";
scoreDisplay.style.left = `${canvasRect.left + 40}px`;
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
    <p id ='title'>룸메 옷장에 숨겨져있는 로봇 부품을 찾아야합니다!</p>
    <p class = 'text'>로봇 부품을 찾고 있던 당신.</p>
    <p class = 'text'>룸메의 옷장 어딘가에 그것이 있다는 것을 알아냈습니다. </p>
    <p class = 'text'>옷장에서 마구 떨어지는 로봇 부품 아이템을 찾아 담아보세요!</p>
    <p class = 'text'>찾아야 하는것: 볼트(+1), 렌치(+2), 로봇 얼굴(+3)</p>
    <p class = 'text'>찾으면 안되는 것: 티셔츠(-1), 재킷(-2), 라면(-3)</p>
    <button id="startGameBtn">Start</button>`;
startContainer.classList.add("scoreDisplay");
   Object.assign(startContainer.style, {
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "10px",
    border: "2px solid #333",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    color: "#000",
    zIndex: "1000"
  });

export let isInitialized = false;
export let frameCount = 0;
let hasKeyListener = false;

let startTime = null;
let gameOver = false;
let maxTime = 20000;
let goalScore = 15;
let score = 0;

let fallingItems = [];
export let obstacles = [];
export let interaction = [];

const cart = {
  x: 600,
  y: 600,
  width: 120,
  height: 85,
  speed: 20,
  movingLeft: false,
  movingRight: false
};

const imageAssets = {
  shirt: new Image(),
  jacket: new Image(),
  ramen: new Image(),
  bolt: new Image(),
  wrench: new Image(),
  robotHead: new Image(),
  cart: new Image()
};

imageAssets.shirt.src = "/images/shirt.png";
imageAssets.jacket.src = "/images/jacket.png";
imageAssets.ramen.src = "/images/ramen.png";
imageAssets.bolt.src = "/images/bolt.png";
imageAssets.wrench.src = "/images/wrench.png";
imageAssets.robotHead.src = "/images/robotHead.png";
imageAssets.cart.src = "/images/cart.png";

const itemTypes = [
  { name: "shirt", score: -1 },
  { name: "jacket", score: -2 },
  { name: "ramen", score: -3 },
  { name: "bolt", score: 1 },
  { name: "wrench", score: 2 },
  { name: "robotHead", score: 3 }
];

class FallingItem {
  constructor(x, y, type, score) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.type = type;
    this.score = score;
    this.speed = 12;
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
  if (frameCount % 15 !== 0) return;
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
   Object.assign(messageBox.style, {
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "10px",
    border: "2px solid #333",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "40px",
    color: "#000",
    zIndex: "1000"
  });
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

  // 배경 먼저 그리기
  drawBackground(ctx);

  // 이후 내용 그리기 (clearRect 제거)
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


  if (score >= 10) {
  gameOver = true;
  scoreDisplay.remove();
  player.key = 9;
  showEndMessage("성공!", 3000, player, loadMap);
  return;
}


  if (score <= -10) {
    gameOver = true;
    scoreDisplay.remove();
    showEndMessage("실패 ㅠㅠ", 3000);
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
