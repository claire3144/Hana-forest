import { showEndMessage } from "../minigames/robot.js";
import { Block } from "./block.js";

export const obstacles = [
  // Left Top Bed + Desk
  new Block(0, 165, 250, 180, "desk_top_left"),
  new Block(0, 0, 350, 165, "bed_top_left"),

  // Left Bottom Bed + Desk
  new Block(0, 500, 250, 250, "desk_bottom_left"),
  new Block(0, 345, 350, 180, "bed_bottom_left"),

  // Right Top Bed + Desk
  new Block(1030, 165, 250, 200, "desk_top_right"),
  new Block(950, 0, 350, 200, "bed_top_right"),

  // Right Bottom Bed + Desk
  new Block(1030, 500, 250, 250, "desk_bottom_right"),
  new Block(950, 345, 350, 200, "bed_bottom_right"),

  // Center Closets
  new Block(575, 40, 130, 510, "closet_top"),
];

export const interaction = [
  new Block(575, 170, 150, 160, "closetGame",closetGame,"옷장에서 로봇 부품을 찾아보자!",null,8),
  new Block(900, 220, 80, 80, "roommateNPC",roommateNPC,"룸메이트와 대화해볼까?"),
  new Block(560, 600, 160, 200, "dormHallway",dormHallway,"복도로 나가볼까?")
];

export function dormHallway(player){
  if(player.key ===0){
    player.key++
    console.log(`player key is changed to${player.key}`)
  }
  player.interaction = true
  player.state = 'dormHallway';
  player.x = 390
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
    showMessage("대회용 로봇 제작은 잘 돼가?<br>오늘 교교에서 마저 완성한다고 했었지?",4000,player)
  }
  else if(player.key==8){
        showMessage("로봇 부품 하나는 내 옷장 어딘가에 있을꺼야!",1500,player)
  }
  else{
    showMessage("얼른 로봇 부품을 찾아보자!",1500,player)
  }
}

function showMessage(message, delay, player) {
    const canvas = document.getElementById('canvas');
    const canvasWrapper = canvas.parentElement;
    canvasWrapper.style.position = 'relative'; // 위치 기준 설정

    const messageBox = document.createElement('div');
    messageBox.style.position = 'absolute'; // 상대 위치 기준
    messageBox.style.left = '50%';
    messageBox.style.top = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    messageBox.style.padding = "10px";
    messageBox.style.border = "2px solid #333";
    messageBox.style.borderRadius = "5px";
    messageBox.style.textAlign = "center";
    messageBox.style.fontSize = "14px";  
    messageBox.style.color = "#000"; // 글씨 색 설정
    messageBox.style.zIndex = "1000";
    messageBox.className = 'messageBox'; // CSS 클래스 지정
    messageBox.innerHTML = `<p>${message}</p>`; //메시지는 인수로 전달

    canvasWrapper.appendChild(messageBox); // 부모 요소에 붙이기

    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거
    }, delay);

    setTimeout(() => {
        player.interaction = true;
    }, delay + 1500);
}
