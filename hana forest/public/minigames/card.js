import {Block} from "../maps/block.js"
const canvas = document.getElementById('canvas'); //canvas에 맞춰 DOM 위치 조정 위해 불러옴
const canvasRect = canvas.getBoundingClientRect(); //DOM 표시 위해 외곽 좌표 계산

// -----------------------------------------------------------
//스코어(게임 초) html DOM으로 표시
//------------------------------------------------------------
const scoreDisplay = document.createElement("div"); 
scoreDisplay.id = "scoreDisplay";
scoreDisplay.innerHTML = `<div id="score">Score: 0.0s</div>`;
scoreDisplay.classList.add('scoreDisplay')
scoreDisplay.style.position = "absolute";
scoreDisplay.style.left = `${canvasRect.left + 20}px`;   // 캔버스 왼쪽에서 20px
scoreDisplay.style.top = `${canvasRect.top + 20}px`;      // 캔버스 위에서 20px
scoreDisplay.style.zIndex = 10;

// -----------------------------------------------------------
//게임 시작 버튼 html DOM으로 표시
//------------------------------------------------------------
const startContainer = document.createElement("div");
startContainer.id = "startContainer";
startContainer.innerHTML = `
  <p>게임을 시작하려면 버튼을 누르세요</p>
  <button id="startGameBtn">Start</button>`;
startContainer.classList.add("scoreDisplay")
startContainer.style.position = "absolute";
startContainer.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
startContainer.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
startContainer.style.transform = 'translate(-50%, -50%)';
startContainer.style.zIndex = 10;

// -----------------------------------------------------------
//게임 실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500) {
    const canvasRect = canvas.getBoundingClientRect(); //canvas 외곽선 검출
    const messageBox = document.createElement('div'); //메시지 박스 DOM 생성
    messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`; //위치 지정
    messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
    messageBox.style.transform = 'translate(-50%, -50%)';

    messageBox.className = 'messageBox';  // CSS 클래스 지정
    messageBox.textContent = message; //메시지는 인수로 전달
    document.body.appendChild(messageBox); //DOM 화면에 표시

    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거
    }, delay);
}


// -----------------------------------------------------------
//게임 기본 변수 설정
//------------------------------------------------------------
export let isInitialized = false; //초기와 여부 표시 변수
export let frameCount = 0; //시간 카운트용 프레임 카운트 변수

let startTime = null; 
let gameOver = false; //게임 실패 여부 표시 변수
let maxTime = 5000; // 5초

export let obstacles = [] //여기에 장애물 삽입할거임
export let interaction = [] //오류 방지용으로 넣어둔 interaction array


// -----------------------------------------------------------
//게임 설정 초기화 함수
//------------------------------------------------------------
export function init(player) {
    if (!document.getElementById("scoreDisplay")) { //시간 표시
        document.body.appendChild(scoreDisplay);
    } 

    if (!document.getElementById("startContainer")) { //시작 버튼 표시
        document.body.appendChild(startContainer);
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
        startContainer.remove(); // 안내창 제거
    };
}


// -----------------------------------------------------------
//장애물 생성 함수
//------------------------------------------------------------
function makeObs(){
    if (frameCount % 30 === 0) {
        let x = 1280;
        const width = 50;
        const height = 100;
        const amplitude = 50;
        let y = Math.random() * (650);
        const speed = 10 + Math.random() * 5;
        const freq = 0.05 + Math.random() * 0.03;

        const obs = new Block(x,y,width,height,'obs')
        obs.speed = speed;
        obs.freq = freq;
        obs.baseY = obs.y;
        obs.amplitude = amplitude;

        obstacles.push(obs);
    }
}


// -----------------------------------------------------------
//장애물 움직임 함수
//------------------------------------------------------------
function move(player,callback){

    obstacles.forEach((obs,i,obstacles)=>{
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
        }
        if (callback(player,obs)) {
            showEndMessage("실패 ㅠㅠ")
            setTimeout(()=>{
                isInitialized = false;
                gameOver = true;
                return},500)
        }
                obs.x -=obs.speed;
        obs.y = obs.baseY + Math.sin(frameCount * obs.freq) * obs.amplitude;
    })
}



// -----------------------------------------------------------
//게임 실행 루프
//------------------------------------------------------------
export function gameLoop(player,callback,loadMap){ //이걸 main.js에서 불러서 분기해서 루프 사용
    if (!isInitialized) return;

    frameCount++;
    const now = performance.now();
    const elapsed = now - startTime;
    const seconds = (elapsed / 1000).toFixed(1);
    scoreDisplay.textContent = `Score: ${seconds}s`;
    
    makeObs();
    move(player,callback);

    if (elapsed >= maxTime) {
        scoreDisplay.remove()
        showEndMessage("성공!")
        setTimeout(()=>{       
        player.state = 'dormHallway'
        loadMap('dormHallway')
        player.x = 300;
        player.y = 380;
        return;
        },500)

    }
}