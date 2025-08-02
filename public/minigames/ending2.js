import { Block } from "../maps/block.js";
export const obstacles = [
    new Block(600,300,300,300,'oribae',null,null)
]
export const interaction = []


const messageBox = document.createElement('div');
messageBox.id = "message";
messageBox.innerHTML = `<p id ='title'>The End</p>`
Object.assign(messageBox.style, {
    position: 'absolute',
    left: '30%',
    top: '20%',
    transform: 'translate(-50%, -50%)',
    textAlign: "center",
    fontSize: "40px",
    color: "rgba(255, 255, 255, 0.9)",
    zIndex: "1000"
});

export function init(player){}

export function gameLoop(player, isColliding, loadMap){
    let ori = obstacles[0]
    ori.y--
    ori.x++
    ori.height--
    ori.width--
    if(ori.y<100){
        document.body.appendChild(messageBox);
    }
}
