import * as closetGame from '../minigames/closetGame.js'
import * as dormitory from './dormitory.js'

export const maplist = {
    dormitory : dormitory,
    closetGame : closetGame
}

const img = new Image();
img.src = '';
let imgLoaded = false;


export function loadMap(state){
    imgLoaded = false;
    img.src = `/images/${state}.jpg`;
    img.onload = () =>{
        imgLoaded = true;
}
}

export function drawMap(ctx, canvas, player){
    if(imgLoaded)
        ctx.drawImage(img,0,0, canvas.width, canvas.height)
    for (let obs of maplist[player.state].obstacles){
        obs.drawObstacle(ctx, 'red')
    }
    for (let i of maplist[player.state].interaction){
        i.drawObstacle(ctx,'blue')
    }
}
