import { Block } from "./block.js";

export const obstacles = [
    new Block(0,250,1280,100,"wall"),
    new Block(0,600,950,120,'underWall(l,c)'),
    new Block(1100,600,180,120,'underWall(r)')
]

export const interaction = [
    new Block(670, 340, 200, 100, 'homebase' ),
    new Block(1200,350,100,250,'whereToGo'),
    new Block(950,600,150,120,'classroom')
]