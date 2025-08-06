import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,200,175, "upper wall(l)"),
    new Block(350,0,1000,175, "upper wall(r)"), 
    new Block(0,330,50,500, "blackboard"),
    new Block(190, 375, 90, 150, "table_1"),
    new Block(430, 490, 210, 200, "table_group"),
    new Block(880, 500, 90, 160,"table_2"),
    new Block(1065, 400, 100, 200, "table_3"),
    new Block(600,270,130,130,"robot"),
    //new Block(960,200,65,160,"teacher npc"), 

]

export const interaction = [
    new Block(580,250,150,150,"robot",robot,"로봇을 조립하시겠습니까?",null,10),
    new Block(960,200,65,160,"teacher npc",teacher_npc,"선생님과 대화를 하시겠습니까?"), 
    new Block(200,0,150,175,"classroomHallway",null,'복도로 나가시겠습니까?'),
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
