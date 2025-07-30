import { Block } from "./block.js";

export const obstacles = [
    new Block(130,100,230,350,'desk(l)'),
    new Block(520,100,230,350,'desk(c)'),
    new Block(920,100,230,350,'desk(r)'),
    new Block(0,650,200,100,'underWall(l)'),
    new Block(400,650,880,100,'underWall(r)'),
    new Block(150,530,20,20,'friend'),

]
export const interaction = [
    new Block(120,500,80,80,'friend',friend,"친구를 찾았다! 말을 걸어볼까?"),
    new Block(870,100,50,100,'robotPart',robotPart,"로봇 부품을 가져가시겠습니까?",null,6),
    new Block(200,650,200,100,'whereToGo',null,"어디로 가면 좋을까?")
]

export function friend(player){
    if(player.key===5){
        player.key++
        console.log(`player key is changed to${player.key}`)
        player.interaction = true

    }
    else if(player.key ==6){
        showMessage("부품을 찾아봐!",500,player)
    }
    else{
        showMessage('다 완성하면 나도 한번 태워줘~',500,player)
    }

    player.state = 'studyRoom';
    player.x = 220
    player.y = 500

}

export function robotPart(player){
    if(player.key===6){
        player.key++
        console.log(`player key is changed to${player.key}`)
        interaction[1].key = 100
        player.interaction = true
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