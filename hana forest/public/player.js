export const Input = { //이동 input 블록
    keys : {
    w: false,
    a: false,
    s: false,
    d: false
    },

    init() {
        document.addEventListener('keydown', (e) => {
          const key = e.key.toLocaleLowerCase();
          if (key in this.keys) this.keys[key] = true;
        });
        document.addEventListener('keyup', (e) => {
          const key = e.key.toLocaleLowerCase();
            if (key in this.keys) this.keys[key] = false;
        });
    },
    isPressed(key) {
        return !!this.keys[key];
    }
};

function button(state,callback,dialog){
    player.state =String(state);
    player.x = playerState[state].xin;
    player.y = playerState[state].yin;
    dialog.remove();
    callback(state)
}

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
    player.state = obs.name;
    player.x = playerState[obs.name].x;
    player.y = playerState[obs.name].y;
    dialog.remove();
    callback(player.state)
  };

  document.getElementById("noBtn").onclick = () => {
    dialog.remove();
  };
}

function showWhereToGo(obs,callback){
    if (document.getElementById("dialogBox")) return;

  const dialog = document.createElement("div");
  dialog.id = "dialogBox";

  dialog.innerHTML = `
    <p>${obs.name}</p>
    <button id="studyRoom">면학실</button>
    <button id="dormHallway">기숙사</button>
    <button id= "classroomHallway">교과교실</button>
  `;

  document.body.appendChild(dialog);
["studyRoom", "dormHallway", "classroomHallway"].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.onclick = () => button(id, callback,dialog);
});
}

export function isColliding(rect1, rect2) {
  return !(
    rect1.x + rect1.width <= rect2.x ||   // rect1이 rect2 왼쪽에 있음
    rect1.x >= rect2.x + rect2.width ||   // rect1이 rect2 오른쪽에 있음
    rect1.y + rect1.height <= rect2.y ||  // rect1이 rect2 위에 있음
    rect1.y >= rect2.y + rect2.height     // rect1이 rect2 아래에 있음
  );
}

//------------------------------------------------
//player object
//------------------------------------------------
const playerState = {//맵 별로 초기 시작 위치 다르게 설정 가능
    classroom:{x: 1010, y: 60},
    robot:{x: -100, y: -100},
    classroomHallway:{x:1000,y:600,xin:1100,yin:450},
    studyRoom:{xin:250,yin:550},
    dormHallway:{x:430,y:130,xin:1100,yin:360},
    dorm: { x: 580, y : 570},
    closetGame: { x: 100, y: 590 }, 
    card :{x:500,y:500}
}

export let player = {
    state : "dorm",
    mode: "",
    x : 990,
    y: 590,
    width : 80,
    height: 80,
    speed : 10,

    init(){
        this.x = playerState[this.state].x;
        this.y = playerState[this.state].y;

    },
    move(canvas, maplist,callback) {
        const prevX = this.x;
      const prevY = this.y;

    if (this.state === 'closetGame') {
    // closetGame에서는 좌우 이동만 허용
    if (Input.isPressed('a')) this.x -= this.speed;
    if (Input.isPressed('d')) this.x += this.speed;
    } else {
    // 나머지 맵에서는 모든 방향 허용
    if (Input.isPressed('w')) this.y -= this.speed;
    if (Input.isPressed('s')) this.y += this.speed;
    if (Input.isPressed('a')) this.x -= this.speed;
    if (Input.isPressed('d')) this.x += this.speed;
  }

        //캔버스 밖으로 못 나가게 처리(x)
        if (this.x < 0) this.x = 0; 
        if (this.x + this.width > canvas.width)
        this.x = canvas.width - this.width;
        //캔버스 밖으로 못 나가게 처리(y)
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height)
        this.y = canvas.height - this.height;

        //obstacles와 출돌 처리 함수 호출
        for (let obs of maplist[this.state].obstacles){
            if (isColliding(this, obs)) {
            this.x = prevX;
            this.y = prevY;
            }
        }

        //interaction 객체와 충돌시 충돌 처리는 안하고 idalog 함수 호출
        let isCollidingAny = false;
        for (let obs of maplist[this.state].interaction){
          if(isColliding(this, obs)&&obs.name=='whereToGo'){
            showWhereToGo(obs,callback)
            isCollidingAny = true;
            break;
          }
          else if (isColliding(this, obs)) {
            showDialog(obs,callback);
            isCollidingAny = true;
            break;
          }
        }
        if (!isCollidingAny) {
          const dialog = document.getElementById("dialogBox");
          if (dialog) dialog.remove();
        }

    },

    draw(ctx){
    if (this.state === 'closetGame') {
        const img = imageAssets.cart;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            // 이미지 로드 실패 시 fallback
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    } else {
        // 기본 그리기 방식
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
,

}


