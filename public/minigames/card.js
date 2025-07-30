import { Block } from "../maps/block.js";

const canvas = document.getElementById('canvas');
const canvasWrapper = canvas.parentElement;
canvasWrapper.style.position = 'relative'; // 성공, 실패 창 때문에 기춘 수정함

// -----------------------------------------------------------
// 스코어(게임 초) html DOM으로 표시
// -----------------------------------------------------------
const scoreDisplay = document.createElement("div");
scoreDisplay.id = "scoreDisplay";
scoreDisplay.innerHTML = `<div id="score">Score: 0.0s</div>`;
Object.assign(scoreDisplay.style, {
  position: "absolute",
  left: `20px`,
  top: `20px`,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "10px",
  border: "2px solid #333",
  borderRadius: "5px",
  textAlign: "center",
  fontSize: "20px",
  color: "#000",
  zIndex: "1000"
});

// -----------------------------------------------------------
// 게임 시작 버튼 html DOM으로 표시
// -----------------------------------------------------------
const startContainer = document.createElement("div");
startContainer.id = "startContainer";
startContainer.innerHTML = `
  <p>게임을 시작하려면 버튼을 누르세요</p>
  <button id="startGameBtn">Start</button>`;
Object.assign(startContainer.style, {
  position: "absolute",
  left: `50%`,
  top: `50%`,
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "10px",
  border: "2px solid #333",
  borderRadius: "5px",
  textAlign: "center",
  fontSize: "16px",
  color: "#000",
  zIndex: "1000"
});

// -----------------------------------------------------------
// 게임 실패, 성공 시 메시지 띄우는 함수 정의
// -----------------------------------------------------------
export function showEndMessage(message, delay = 500) {
  const messageBox = document.createElement('div');
  messageBox.textContent = message;
  Object.assign(messageBox.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
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
  canvasWrapper.appendChild(messageBox);
  setTimeout(() => messageBox.remove(), delay);
}

// -----------------------------------------------------------
// 게임 기본 변수 설정
// -----------------------------------------------------------
export let isInitialized = false;
export let frameCount = 0;
let startTime = null;
let gameOver = false;
let maxTime = 5000;
let gameFinished = false;

export let obstacles = [];
export let interaction = [];

// -----------------------------------------------------------
//게임 설정 초기화 함수
//------------------------------------------------------------

export function init(player) {
  if (!document.getElementById("scoreDisplay")) {
    canvasWrapper.appendChild(scoreDisplay);
  }

  if (!document.getElementById("startContainer")) {
    canvasWrapper.appendChild(startContainer);
  }

  frameCount = 0;
  player.x = 100;
  player.y = 300;
  obstacles = [];
  startTime = performance.now();
  gameOver = false;

  const startBtn = document.getElementById("startGameBtn");
  startBtn.onclick = () => {
    isInitialized = true;
    startTime = performance.now();
    startContainer.remove();
  };
}

// -----------------------------------------------------------
// 장애물 생성 함수
// -----------------------------------------------------------
function makeObs() {
  if (frameCount % 30 === 0) {
    let x = 1280;
    const width = 50;
    const height = 100;
    const amplitude = 50;
    let y = Math.random() * 650;
    const speed = 10 + Math.random() * 5;
    const freq = 0.05 + Math.random() * 0.03;

    const obs = new Block(x, y, width, height, 'obs');
    obs.speed = speed;
    obs.freq = freq;
    obs.baseY = obs.y;
    obs.amplitude = amplitude;

    obstacles.push(obs);
  }
}

// -----------------------------------------------------------
// 장애물 움직임 함수
// -----------------------------------------------------------
function move(player, callback) {
  obstacles.forEach((obs, i, obstacles) => {
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
    }
    if (!gameOver && !gameFinished && callback(player, obs)) {
      showEndMessage("실패 ㅠㅠ");
      setTimeout(() => {
        isInitialized = false;
        gameOver = true;
      }, 500);
    }
    obs.x -= obs.speed;
    obs.y = obs.baseY + Math.sin(frameCount * obs.freq) * obs.amplitude;
  });
}

// -----------------------------------------------------------
// 게임 실행 루프
// -----------------------------------------------------------
export function gameLoop(player, callback, loadMap) {
  if (!isInitialized) return;
  frameCount++;
  const now = performance.now();
  const elapsed = now - startTime;
  const seconds = (elapsed / 1000).toFixed(1);
  scoreDisplay.textContent = `Score: ${seconds}s`;

  makeObs();
  move(player, callback);

  if (!gameFinished && elapsed >= maxTime) {
    gameFinished = true;
    scoreDisplay.remove();
    player.key = 2;
    showEndMessage("성공!");
    setTimeout(() => {
      player.state = 'dormHallway';
      loadMap('dormHallway');
      player.x = 300;
      player.y = 380;
    }, 500);
  }
}
