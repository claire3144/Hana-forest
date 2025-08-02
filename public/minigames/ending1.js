import { Block } from "../maps/block.js";

export const interaction = []
export const obstacles = [
new Block(460,300,300,140,'oribae',null,null)
]
let frameCount = 0

export function init(player){}

export function gameLoop(player, isColliding, loadMap){
    let ori = obstacles[0]
    ori.y--
    ori.y--
    if(ori.y<-300){
        player.state = 'ending2'
        loadMap('ending2')
    }
}

