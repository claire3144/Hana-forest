import { player, Input, isColliding } from "./player.js";
import { maplist, drawMap, loadMap } from "./maps/maps.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 720;

const miniGames = ['closetGame', 'robot','ending1','ending2','cardGame']; // 필요한 만큼 확장 가능
const playerStatic = ['robot','ending1','ending2','card'] //대화 등 플레이어 이동 제한 상황
const npc = ['card']

Input.init();
loadMap(player.state);
// 전역 변수로 상태창 요소를 만들어두기
const messageBox = document.createElement('div');
Object.assign(messageBox.style, {
    position: 'absolute',
    left: '75%',
    top: '7%',
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
document.body.appendChild(messageBox); // canvasWrapper는 이미 존재하는 DOM 요소

function ui(player) {
    let message = '';

    if (player.key < 4) {
        message = "ch.1 아침";
        // console.log('ch1')
    } else if (player.key < 7) {
        message = 'ch.2 부품 0/2개 찾음';
        // console.log('ch2')
    } else if (player.key < 9) {
        message = 'ch.2 부품 1/2개 찾음';
        // console.log('ch2')
    } else if (player.key < 10) {
        message = 'ch.2 부품 2/2개 찾음';
        // console.log('ch2')
    } else if (player.key === 10) {
        message = 'ch.3 로봇을 조립하자!';
        // console.log('ch3')
    } else {
        message = '탈출 성공!';
        // console.log('end')
    }

    messageBox.textContent = message;
}


function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, canvas, player);
    ui(player)

    if (miniGames.includes(player.state)) {
        const game = maplist[player.state];
        if (!game.isInitialized) {
            game.init(player);
        }
        game.gameLoop(player, isColliding, loadMap);
    }
    if(npc.includes(player.state)){
        const npc = maplist[player.state]
        npc.showConversation(player,loadMap)
    }

    if(!playerStatic.includes(player.state)){
        player.move(canvas, maplist, loadMap);
        player.draw(ctx);
    }

    if(player.key ==11){
        player.state = 'ending1'
        loadMap('ending1')
        player.key = 100
        messageBox.remove(); 
    }

    

}

frame();
