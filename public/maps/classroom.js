import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,100,100, "upper wall(l)"),
    new Block(250,0,860,100, "upper wall(c)"),
    new Block(1100,0,200,100, "upper wall(r)"), 
    new Block(0,220,40,500, "blackboard"),
    new Block(180, 400, 60, 100, "lectern"),
    new Block(380, 600, 80, 80, "table"),
    new Block(1100, 420, 80, 80, "table"),
    new Block(830, 600, 80, 80,"table"),
    new Block(100,0,150,100,"doorShut"),
    new Block( 600,270,100,100,"robot"),
    new Block(1050,310,20,20,"teatcher npc"), 

]

export const interaction = [
    new Block( 575,350,150,50,"robot",robot,"로봇을 조립하시겠습니까?",null,10),
    new Block(1020,280,80,80,"teatcher npc",teacher_npc,"선생님과 대화를 하시겠습니까?"), 
    new Block(250,50,150,100,"classroomHallway",null,'복도로 나가시겠습니까?')
]

export function teacher_npc(player){
        if(player.key===3){
        player.key++
        console.log(`player key is changed to${player.key}`)
        player.interaction = true

    }
    else if(player.key ==10){
      showMessage("부품을 찾았으면 조립해봐!",1500,player)
    }
    else if(player.key===11){
      player.key++
      console.log(`player key is changed to${player.key}`)
      player.interaction = true
    }
    else{
      showMessage("로봇 부품을 찾아서 로봇을 조립해보자!",1500,player)
    }

}

export function robot(player){
    
  if(player.key ===10){
    player.state = 'robot'
    player.interaction = true
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
