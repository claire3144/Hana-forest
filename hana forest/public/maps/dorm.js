import { Block } from "./block.js";

export const obstacles = [
  // Left Top Bed + Desk
  new Block(0, 220, 140, 180, "desk_top_left"),
  new Block(0, 60, 350, 165, "bed_top_left"),

  // Left Bottom Bed + Desk
  new Block(0, 550, 140, 180, "desk_bottom_left"),
  new Block(0, 390, 350, 165, "bed_bottom_left"),

  // Right Top Bed + Desk
  new Block(1140, 220, 140, 180, "desk_top_right"),
  new Block(950, 60, 350, 165, "bed_top_right"),

  // Right Bottom Bed + Desk
  new Block(1140, 550, 140, 180, "desk_bottom_right"),
  new Block(950, 390, 350, 165, "bed_bottom_right"),

  // Center Closets (2x2)
  new Block(480, 155, 145, 180, "closet_top_left"),
  new Block(480, 335, 145, 180, "closet_bottom_left"),
  new Block(615, 335, 145, 180, "closet_bottom_right"),

  // Window
  new Block(450, 0, 320, 50, "Window")
];

export const interaction = [
  new Block(615, 75, 145, 260, "closetGame"),
  new Block(980, 250, 100, 100, "roommateNPC"),
  new Block(540, 650, 160, 60, "dormHallway")
];
