import * as classroom from './classroom.js';
import * as robot from '../minigames/robot.js';
import * as classroomHallway from './classroomHallway.js';
import * as studyRoom from './studyRoom.js';
import * as dormHallway from './dormHallway.js';
import * as closetGame from '../minigames/closetGame.js';
import * as dorm from './dorm.js';
import * as cardGame from '../minigames/cardGame.js';
import * as ending1 from '../minigames/ending1.js';
import * as ending2 from '../minigames/ending2.js';
import * as card from '../npc/card.js';
import { playBgm } from '../bgmManager.js'; // 배경음악 자동 전환

export const maplist = {
    classroom: classroom,
    robot: robot,
    classroomHallway: classroomHallway,
    studyRoom: studyRoom,
    dormHallway: dormHallway,
    dorm: dorm,
    closetGame: closetGame,
    cardGame: cardGame,
    ending1: ending1,
    ending2: ending2,
    card: card
};

const img = new Image();
img.src = '';
let imgLoaded = false;

export function loadMap(state) {
    imgLoaded = false;
    img.src = `../images/${state}.jpg`;

    // 상태에 따라 자동으로 BGM 전환
    playBgm(state);

    img.onload = () => {
        imgLoaded = true;
    };
}

export function drawMap(ctx, canvas, player) {
    if (imgLoaded)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (let obs of maplist[player.state].obstacles) {
        if (player.key == obs.key || obs.key == -1) {
            obs.drawObstacle(ctx, 'red');
        }
    }
    for (let i of maplist[player.state].interaction) {
        if (player.key == i.key || i.key == -1) {
            i.drawObstacle(ctx, 'blue');
        }
    }
}
