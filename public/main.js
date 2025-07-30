import { player, Input, isColliding } from "./player.js";
import { maplist, drawMap, loadMap } from "./maps/maps.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 720;

const miniGames = ['card', 'closetGame', 'robot']; // 필요한 만큼 확장 가능
const playerStatic = ['robot','ending'] //대화 등 플레이어 이동 제한 상황

Input.init();
loadMap(player.state);

function frame() {
    requestAnimationFrame(frame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, canvas, player);

    if (miniGames.includes(player.state)) {
        const game = maplist[player.state];
        if (!game.isInitialized) {
            game.init(player);
        }
        game.gameLoop(player, isColliding, loadMap);
    }

    if(!playerStatic.includes(player.state)){
        player.move(canvas, maplist, loadMap);
        player.draw(ctx);
    }
    

}

frame();
