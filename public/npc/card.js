export const obstacles = []
export const interaction = []


export function showConversation(player,loadMap) {
      if (!document.getElementById("startContainer")) {
        const restartContainer = document.createElement("div");
        restartContainer.id = "startContainer";
        restartContainer.innerHTML = `
          <p>대화 시작</p>
          <input type="text" id="myInput" placeholder="내용 입력">
          <button id = 'sendBtn'>입력 확인</button>
          <button id="startGameBtn">대화 종료</button>`;
        restartContainer.classList.add("scoreDisplay");

        Object.assign(restartContainer.style, {
          position: 'absolute',
          left: '50%',
          top: '80%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          border: "2px solid #333",
          borderRadius: "5px",
          textAlign: "center",
          fontSize: "16px",
          color: "#000",
          zIndex: "1000"
        });
        document.body.appendChild(restartContainer);

        const startBtn = document.getElementById("startGameBtn");
        startBtn.onclick = () => {
          restartContainer.remove();
          player.state = 'cardGame';
          player.interaction = true;
          player.x = 500;
          player.y = 500;
          loadMap(player.state)
        }
        const sendBtn = document.getElementById("sendBtn");
        sendBtn.addEventListener("click", () => {
            const input = restartContainer.querySelector("#myInput");
            const inputValue = restartContainer.querySelector("#myInput").value;
            console.log(inputValue);
            input.value = ''
        });
    }}