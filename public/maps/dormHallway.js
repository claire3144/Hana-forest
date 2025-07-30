import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,400,100,'upperWall(l)'),
    new Block(550,0,730,100,'upperWall(r)'),
    new Block(30,140,130,500,'bin'),
    new Block(230,410,20,20,'card',null,null,null,1)

]
export const interaction = [
    new Block(1200,100,100,600,'whereToGo',null,"어디로 이동하면 좋을까?"),
    new Block(400,50,150,100,'dorm',dorm,"기숙사 호실로 들어가시겠습니까?"),
    new Block(200,380,80,80,'card',card,"선생님과 대화를 시작하시겠습니까?",null,1)
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
