import { player, Input, isColliding } from "./player.js";
import { maplist, drawMap, loadMap } from "./maps/maps.js";
import { playBgm, stopBgm } from "./bgmManager.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

// -----------------------------------------------------------
//BGM button
//------------------------------------------------------------

let isBgmPlaying = false;
// const bgmBtn = document.getElementById("bgmToggleBtn");

// const updateButtonText = () => {
//   bgmBtn.innerText = isBgmPlaying ? "🔇 음악 끄기" : "🎵 음악 켜기";
// };

// function positionButton() {
//   const rect = canvas.getBoundingClientRect();
//   bgmBtn.style.position = "absolute";
//   bgmBtn.style.left = `${rect.left + 20}px`;
//   bgmBtn.style.top = `${rect.top + 20}px`;
//   bgmBtn.style.zIndex = "1000";
// }
// positionButton();
// window.addEventListener("resize", positionButton);

// bgmBtn.addEventListener("click", () => {
//   if (!isBgmPlaying) {
//     stopBgm();  // 중복 방지용
//     playBgm(player.state || "dorm");
//     isBgmPlaying = true;
//   } else {
//     stopBgm();
//     isBgmPlaying = false;
//   }
//   updateButtonText();
// });
// updateButtonText();


// -----------------------------------------------------------
//진행 상황 상태창
//------------------------------------------------------------

Input.init();
loadMap(player.state);
// 전역 변수로 상태창 요소를 만들어두기
const messageBox = document.createElement('div');
Object.assign(messageBox.style, {
    position: 'absolute',
    left: '80%',
    top: '11%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "10px",
    border: "2px solid #333",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "15px",
    color: "#000",
    zIndex: "1000"
});
document.body.appendChild(messageBox); 

function ui(player) {
    let message = '';

    if (player.key < 4) { message = "ch.1 아침";} 
    if (player.key < 7) {message = 'ch.2 부품 0/2개 찾음';} 
    else if (player.key < 9) {message = 'ch.2 부품 1/2개 찾음';} 
    else if (player.key < 10) {message = 'ch.2 부품 2/2개 찾음';} 
    else if (player.key === 10) {message = 'ch.3 로봇을 조립하자!';} 
    else {message = '학교 탈출 성공!';}

    messageBox.textContent = message;
}

const miniGames = ['closetGame', 'robot','ending1','ending2','cardGame']; // 미니게임 분기를 위한 리스트
const playerStatic = ['robot','ending1','ending2','card','room_teacher','hallway_teacher','friend'] //대화 등 플레이어 이동 제한 상황
const npc = ['card','room_teacher','hallway_teacher','friend'] //npc 대화를 위한 분기 리스트

// -----------------------------------------------------------
//반복 본 함수
// ------------------------------------------------------------
let previousState = null;

async function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, canvas, player);
    ui(player)

    // BGM 상태 감지 및 변경
    if (isBgmPlaying && player.state !== previousState) { 
        console.log(`🎧 BGM 상태 변경 감지: ${previousState} → ${player.state}`);
        await playBgm(player.state);  // stopBgm() 기다린 뒤 play
        previousState = player.state;
    }
    //미니게임 분기
    if (miniGames.includes(player.state)) {
        const game = maplist[player.state];
        if (!game.isInitialized) game.init(player);
        game.gameLoop(player, isColliding, loadMap);
    }

    //npc 대화 분기
    if(npc.includes(player.state)){ 
        const n = maplist[player.state]
        n.showConversation(player,loadMap)
    }

    //조작 금지 분기
    if(!playerStatic.includes(player.state)){ 
        player.move(canvas, maplist, loadMap);
        player.draw(ctx);
    }

    //엔딩 페이지로 이동
    if(player.key === 11){ 
        player.state = 'ending1';
        loadMap('ending1');
        player.key = 100;
        messageBox.remove(); 
    }

    

}

frame();
