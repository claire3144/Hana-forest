import { Block } from "./block.js";

export const obstacles = [
    new Block(130,100,230,350,'desk(l)'),
    new Block(520,100,230,350,'desk(c)'),
    new Block(920,100,230,350,'desk(r)'),
    new Block(0,650,200,100,'underWall(l)'),
    new Block(400,650,880,100,'underWall(r)')
]
export const interaction = [
    new Block(120,500,80,80,'friend'),
    new Block(870,100,50,100,'robotPart'),
    new Block(200,650,200,100,'whereToGo')
]