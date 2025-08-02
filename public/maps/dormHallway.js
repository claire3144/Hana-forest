import { Block } from "./block.js";

export const obstacles = [
    new Block(0, 0, 360, 130,'Wall_left'),
    new Block(490, 0, 800, 130, 'Wall_right'),
]

export const interaction = [
    new Block(1100, 130, 200, 600, 'whereToGo', null, "어디로 이동하면 좋을까?"),
    new Block(360, 0, 130, 130, 'dorm', dorm, "기숙사 호실로 들어갈까?"),
    new Block(100, 380, 100, 100, 'card', card, "생활관 선생님과 대화를 시도해볼까?", null, 1)
]

export function card(player){
    if(player.key===1){
          player.interaction = true
          player.state = 'card'
          player.x = 500
          player.y = 500
    }
}

export function dorm(player){
    if(player.key===7){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    
    player.state = 'dorm'
    player.x = 540
    player.y = 570
    player.interaction = true

}
