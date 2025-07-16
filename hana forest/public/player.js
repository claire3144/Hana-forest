import { maplist } from "../maps/maps.js";

const cartImg = new Image();
cartImg.src = "./images/cart.jpg";

export const Input = { //이동 input 블록
  keys: {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  },

  init() {
    document.addEventListener("keydown", (e) => {
      if (e.key in this.keys) this.keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      if (e.key in this.keys) this.keys[e.key] = false;
    });
  },

  isPressed(key) {
    return !!this.keys[key];
  },
};

function showDialog(obs, callback) {
  if (document.getElementById("dialogBox")) return;

  const dialog = document.createElement("div");
  dialog.id = "dialogBox";

  dialog.innerHTML = `
    <p>${obs.name}</p>
    <button id="yesBtn">예</button>
    <button id="noBtn">아니오</button>
  `;

  document.body.appendChild(dialog);

  document.getElementById("yesBtn").onclick = () => {
    player.state = String(obs.name);
    player.x = playerState[player.state].x;
    player.y = playerState[player.state].y;
    dialog.remove();
    callback(player.state);
  };

//------------------------------------------------
//player object
//------------------------------------------------

  document.getElementById("noBtn").onclick = () => {
    dialog.remove();
  };
}

const playerState = {
  dormitory: { x: 990, y: 590 },
  closetGame: { x: 100, y: 590 }, 
};

export function isColliding(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect1.x >= rect2.x + rect2.width ||
    rect1.y + rect1.height <= rect2.y ||
    rect1.y >= rect2.y + rect2.height
  );
}

export let player = {
  state: "dormitory",
  x: 990,
  y: 590,
  width: 100,
  height: 100,
  speed: 10,

  init() {
    this.x = playerState[this.state].x;
    this.y = playerState[this.state].y;
  },

  move(canvas, maplist, callback) {
    const prevX = this.x;
    const prevY = this.y;

  //맵 이름에 따라 이동 조건 분기
  if (this.state === "closetGame") {
    // 좌우 이동만 허용
    if (Input.isPressed("ArrowLeft")) this.x -= this.speed;
    if (Input.isPressed("ArrowRight")) this.x += this.speed;
  } else {
    // 모든 방향 이동 허용
    if (Input.isPressed("ArrowUp")) this.y -= this.speed;
    if (Input.isPressed("ArrowDown")) this.y += this.speed;
    if (Input.isPressed("ArrowLeft")) this.x -= this.speed;
    if (Input.isPressed("ArrowRight")) this.x += this.speed;
  }

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width)
      this.x = canvas.width - this.width;

    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height)
      this.y = canvas.height - this.height;

    for (let obs of maplist[this.state].obstacles) {
      if (isColliding(this, obs)) {
        this.x = prevX;
        this.y = prevY;
      }
    }

    for (let obs of maplist[this.state].interaction) {
      if (isColliding(this, obs)) {
        this.x = prevX;
        this.y = prevY;
        showDialog(obs, callback);
        break;
      }
    }
  },

  draw(ctx) {
    if (this.state === "closetGame") {
      // closetGame일 때만 cart 이미지 사용
      if (cartImg.complete) {
        ctx.drawImage(cartImg, this.x, this.y, this.width, this.height);
      } else {
        ctx.fillStyle = "gray"; // 로딩 중 대체용
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    } else {
      // 기본 초록 네모
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  },
};
