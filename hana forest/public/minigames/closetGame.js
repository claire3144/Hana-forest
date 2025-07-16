import { Block } from "../maps/block.js";

// 장애물
export const obstacles = [
  new Block(300, 300, 200, 100, "closet_obstacle1"),
  new Block(600, 200, 150, 150, "closet_obstacle2"),
];

// 상호작용
export const interaction = [
  new Block(990, 590, 180, 80, "dormitory")
];
