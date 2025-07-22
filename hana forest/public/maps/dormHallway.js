import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,400,100,'upperWall(l)'),
    new Block(550,0,730,100,'upperWall(r)'),
    new Block(30,140,130,500,'bin')
]
export const interaction = [
    new Block(1200,100,100,600,'whereToGo'),
    new Block(400,0,150,100,'dorm'),
    new Block(200,380,80,80,'card')
]