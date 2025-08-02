import { Block } from "../maps/block.js";

const canvas = document.getElementById('canvas');
const canvasRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

// -----------------------------------------------------------
//게임 시작 버튼 html DOM으로 표시
//------------------------------------------------------------
const startContainer = document.createElement("div");
startContainer.id = "startContainer";
startContainer.innerHTML = `
    <p id ='title'>로봇 조립을 방해하는 방해꾼들을 찾아야합니다!</p>
    <p class = 'text'>로봇을 조립하려려던 당신.</p>
    <p class = 'text'>지금까지의 로봇 조립에서 오류가 있다는 것을 알아냈습니다. </p>
    <p class = 'text'>설계도와 로봇의 다른 점을 찾아 클릭하세요!</p>
    <button id="startGameBtn">Start</button>`;
startContainer.classList.add("scoreDisplay")
   Object.assign(startContainer.style, {
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
// -----------------------------------------------------------
//게임 실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500, player,loadMap) {
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
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거
        if(message=='성공!'){
            player.key = 11
            console.log(`player key is changed to${player.key}`)
            player.state = 'classroom';
            player.x = 650;
            player.y = 450;
            loadMap('classroom');
            return;
        }
    }, delay);
}


// -----------------------------------------------------------
//게임 기본 변수 설정
//------------------------------------------------------------

export let isInitialized = false; //초기와 여부 표시 변수
export let frameCount = 0; //시간 카운트용 프레임 카운트 변수

let gameOver = false; //게임 실패 여부 표시 변수

export let obstacles = [];
//found 요소를 새로 정의하기 위해 상속받아서
export class HiddenObject extends Block {
    constructor(x, y, width, height, name,action,message,imageSrc) {
        super(x, y, width, height, name,action,message,imageSrc);
        this.found = false;
    }
}


export let interaction = [
    new HiddenObject(940, 300, 100,100,'sahur',null, '로봇 조립을 방해하던 "퉁퉁퉁퉁퉁퉁 사후르"를 찾았습니다!',"/images/sahur.jpg"),
    new HiddenObject(860,500,50,100,'tralalelo',null,'로봇 조립을 방해하던 "트랄라레로 트랄랄라"를 찾았습니다!','/images/tralalelo.jpg'),
    new HiddenObject(1020, 450, 50, 100, 'hambook',null, '로봇 조립을 방해하던"햄부기햄북 햄북어 햄북스딱스 함부르크햄부가우가 햄비기햄부거 햄부가티햄부기온앤 온"을 차려왔습니다!','/images/hambook.jpg')
];

// -----------------------------------------------------------
//게임 설정 초기화 함수
//------------------------------------------------------------
export function init(player) {
      for (let obs of interaction){
      obs.loadObj()
    }
    if (!document.getElementById("startContainer")) { //시작 버튼 표시
        document.body.appendChild(startContainer);
        // 제목 스타일
        document.getElementById("title").style.fontSize = "20px";
        document.getElementById("title").style.fontWeight = "bold";

        // 설명 텍스트 스타일
        document.querySelectorAll(".text").forEach(el => {
        el.style.fontSize = "14px";
});
    }
    registerClickListener()
    frameCount = 0;
    player.x = -100;
    player.y = 300;
    obstacles = [];
    gameOver = false;



    const startBtn = document.getElementById("startGameBtn");
    startBtn.onclick = () => {
        isInitialized = true;
        startContainer.remove(); // 안내창 제거
    };
}


// -----------------------------------------------------------
//클릭 여부 판별
//------------------------------------------------------------

// 클릭 리스너를 한 번만 등록
let clickListenerRegistered = false;

function registerClickListener() {
  if (clickListenerRegistered) return; // 중복 방지
  clickListenerRegistered = true;
  console.log(`registered`)
  const canvas = document.getElementById("canvas");
  
  canvas.addEventListener("click", (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;    // x축 비율 보정
    const scaleY = canvas.height / canvasRect.height;  // y축 비율 보정

    const clickX = (e.clientX - canvasRect.left)*scaleX;
    const clickY =( e.clientY - canvasRect.top)*scaleY;
    console.log(`${clickX}${clickY}clicked`)
    checkHiddenObjects(clickX, clickY);
  });
}

// 클릭한 좌표와 숨은 그림들 비교
function checkHiddenObjects(x, y) {
  interaction.forEach((obj) => {
    if (!obj.found &&
        x >= obj.x && x <= obj.x + obj.width &&
        y >= obj.y && y <= obj.y + obj.height) {
      obj.found = true;
      showEndMessage(obj.message,1500,null,null)
      // 점수 증가, 효과음 재생 등 추가 가능
    }
  });
}
// -----------------------------------------------------------
//메인 루프
//------------------------------------------------------------
export function gameLoop(player,_,loadMap){ //이걸 main.js에서 불러서 분기해서 루프 사용
    if (!isInitialized) return;

    for (let obs of interaction){
        obs.drawObj(ctx)
    }

    if (!gameOver&&interaction.every(block => block.found === true)) {
        gameOver=true
        setTimeout(() => {
            showEndMessage("성공!",1500,player,loadMap);
        }, 1500); // 1초 후에 메시지 표시
    }


}