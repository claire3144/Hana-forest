import { showEndMessage } from "../minigames/robot.js";
import { Block } from "./block.js";

export const obstacles = [
  // Left Top Bed + Desk
  new Block(0, 220, 140, 180, "desk_top_left"),
  new Block(0, 60, 350, 165, "bed_top_left"),

  // Left Bottom Bed + Desk
  new Block(0, 550, 140, 180, "desk_bottom_left"),
  new Block(0, 390, 350, 165, "bed_bottom_left"),

  // Right Top Bed + Desk
  new Block(1140, 220, 140, 180, "desk_top_right"),
  new Block(950, 60, 350, 165, "bed_top_right"),

  // Right Bottom Bed + Desk
  new Block(1140, 550, 140, 180, "desk_bottom_right"),
  new Block(950, 390, 350, 165, "bed_bottom_right"),

  // Center Closets (2x2)
  new Block(480, 155, 145, 180, "closet_top_left"),
  new Block(480, 335, 145, 180, "closet_bottom_left"),
  new Block(615, 335, 145, 180, "closet_bottom_right"),
  new Block(615, 155, 145, 180,'closet_top_right'),

  // Window
  new Block(450, 0, 320, 50, "Window"),

  new Block(1020, 290, 20, 20, "roommateNPC"),

];

export const interaction = [
  new Block(650, 75, 145, 260, "closetGame",closetGame,"옷장에서 부품을 찾아보자!",null,8),
  new Block(980, 250, 100, 100, "roommateNPC",roommateNPC,"룸메이트와 대화하시겠습니까?"),
  new Block(540, 650, 160, 60, "dormHallway",dormHallway,"복도로 이동하시겠습니까?")
];

export function dormHallway(player){
  if(player.key ===0){
    player.key++
    console.log(`player key is changed to${player.key}`)
  }
  player.interaction = true
  player.state = 'dormHallway';
  player.x = 430
  player.y = 150
}

export function closetGame(player){
  if(player.key ===8){
    player.state = 'closetGame'
    player.interaction = true
  }

}

export function roommateNPC (player){
  if(player.key==0||player.key==1){
    showMessage("로봇 제작은 잘 돼가?<br>오늘 교교에서 마저 완성한다고 했었지?",4000,player)
  }
  else if(player.key==8){
        showMessage("로봇 부품 하나는 내 옷장 안에 있어!",1500,player)
  }
  else{
    showMessage("얼른 로봇 부품을 찾자!",1500,player)
  }
}

function showMessage(message, delay,player) {
    const canvasRect = canvas.getBoundingClientRect(); //canvas 외곽선 검출
    const messageBox = document.createElement('div'); //메시지 박스 DOM 생성
    
    messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`; //위치 지정
    messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    messageBox.style.padding = "10px";
    messageBox.style.border = "2px solid #333";
    messageBox.style.borderRadius = "5px";
    messageBox.style.textAlign = "center";
    messageBox.style.fontSize = "10px";  
    messageBox.style.color = "#000";     // 글씨 색 설정
    messageBox.style.zIndex = "1000"; 
    messageBox.className = 'messageBox';  // CSS 클래스 지정
    messageBox.innerHTML = `<p>${message}</p>`; //메시지는 인수로 전달
    document.body.appendChild(messageBox); //DOM 화면에 표시

    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거
    }, delay);
    setTimeout(() => {
    player.interaction = true
    }, delay+1500);
}