import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,100,100, "upper wall(l)"),
    new Block(250,0,700,100, "upper wall(c)"),
    new Block(1100,0,200,100, "upper wall(r)"), 
    new Block(0,220,40,500, "blackboard"),
    new Block(180, 400, 60, 100, "lectern"),
    new Block(380, 600, 80, 80, "table"),
    new Block(1100, 420, 80, 80, "table"),
    new Block(830, 600, 80, 80,"table"),
    new Block(100,0,150,100,"doorShut"),
]

export const interaction = [
    new Block( 600,300,100,100,"robot"),
    new Block(1020,280,80,80,"teatcher npc"), 
    new Block(950,0,150,100,"classroomHallway")
]