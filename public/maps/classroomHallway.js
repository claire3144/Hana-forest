import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,1280,350,"wall"),
    new Block(990,440,20,20,'teacher npc',null,null,null,4)
]

export const interaction = [
    new Block(1100,350,200,400,'whereToGo',null,"어디로 가면 좋을까?"),
    new Block(230,580,170,200,'classroom',classroom,"교과교실로 들어가시겠습니까?"),
    new Block(950,450,100,100,'teacher npc',teacher_npc,'선생님과 대화를 시작하시겠습니까?',null,4)
]

export function classroom(player){
    if(player.key===2){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    else if(player.key ==9){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    player.state = 'classroom';
    player.interaction = true
    player.x = 260
    player.y = 200
}

export function teacher_npc(player){
    if(player.key===4){
        player.key++
        console.log(`player key is changed to${player.key}`)
        interaction[2].key=100
    }
    player.state = 'classroomHallway';
    player.x = 900;
    player.y = 400;
    player.interaction = true
}

export function whereToGo(player){
    if(player.key===5){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    player.state = 'studyRoom';
    player.interaction = true
}