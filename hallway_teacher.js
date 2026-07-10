// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js";

// const firebaseConfig = {
// apiKey: "AIzaSyBfY_44GOUnR56gnEXHQwh6OlUhwRV2zyE",
// authDomain: "suyeonhwa26-823aa.firebaseapp.com",
// projectId: "suyeonhwa26-823aa",
// storageBucket: "suyeonhwa26-823aa.appspot.com",
// messagingSenderId: "17045800604",
// appId: "1:17045800604:web:9951ad78ef8dc61d008f59",
// };

// const app = initializeApp(firebaseConfig);

// const functions = getFunctions(app); // 기본 프로젝트 함수 인스턴스
// const mainFunction = httpsCallable(functions, 'mainFunction'); // 함수명 맞춰서 지정
import { mainFunction } from "../llmClient.js";
export const obstacles = [];
export const interaction = [];

// 형식쌤 상황 프롬프트
const situationPrompt = `
너는 대한민국 고등학교 학년 부장 선생님인 '형식쌤'이다.

기본 성격:
- 학생이 규칙을 어기는 요청을 하면 짧고 단호하게 거절한다.
- 장난에는 유쾌하게 반응하고, 감정적인 상황엔 짧게 위로한다.
- AI처럼 과하게 친절하거나 길게 설명하지 않는다.
-상호간의 인사를 강조하지만, 인사후 불필요한 말은 하지 않는다.

말투:
- 존댓말80%, 반말/혼냄10% 유쾌함10%
- 뭐라고? 라는 말을 5번중 한두번 말할 정도로 사용한다.
- 같은 말을 반복할때가 많고, 규칙을 모르면 지적한다.

대화 규칙:
- 학생이 인사하면 물리실 상태가 왜 그러냐고 물어본다.
- 학생이 정당한 사유와 함께 죄송하다고 하면 허용하며, 사유가 정당하지 않을 시 허용하지 않는다.
- 허용 시: 상황에 맞는 허가하는 말과 함께 '수고하세요' 라는 말을 덧붙인다.
- 불가 시: 간결하고 단호하게 거절한다. 허용이 아닌 상황에서 '수고하세요'라는 말은 쓰지 않는다. 
- 일상 대화엔 유쾌하게 응답한다.


반응 예시:
- “오늘도 사용할거라서 정리 아직 안했습니다” → “그런거군요. 알겠습니다.”
- “저 말고 친구가 정리 안한건데요?” → “그래도 물리실 정리는 해야합니다.”
- "누구인가요?”  → “뭐라고? 자, 따라한다. 나는 정형식.”

대화 상황:
- 학생이 전날 물리실을 사용하고 제대로 정리를 안하고 가서 너가 혼내려고 불러 세웠다. 

지금부터 너는 형식쌤처럼 응답해야 한다.
`;

let summary = "이전 대화 없음.";
let history = [];
const name = "형식쌤"
let conCount = 0
let text = '대화 시작'
// -----------------------------------------------------------
//실패, 성공 시 메시지 띄우는 함수 정의
//------------------------------------------------------------
export function showEndMessage(message, delay = 1500, player,loadMap) {
  if(!document.getElementById('messageBox')){
  const canvasRect = canvas.getBoundingClientRect();
  const messageBox = document.createElement('div');
  messageBox.id = 'messageBox'
  messageBox.style.position = "absolute";
  messageBox.style.left = `${canvasRect.left + canvasRect.width / 2}px`;
  messageBox.style.top = `${canvasRect.top + canvasRect.height / 2}px`;
  messageBox.style.transform = 'translate(-50%, -50%)';
  messageBox.className = 'messageBox';
  messageBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  messageBox.style.padding = "20px";
  messageBox.style.border = "2px solid #333";
  messageBox.style.borderRadius = "5px";
  messageBox.style.fontSize = "20px";
  messageBox.style.color = "#000";
  messageBox.style.zIndex = "1000";
  messageBox.textContent = message;
  document.body.appendChild(messageBox);
  
    setTimeout(() => {
        messageBox.remove(); //잠깐 기다렸다가 메시지박스 제거

        if(message=='혼나지는 않았지만 앞으로는 물리실을 잘 정리하자!'){
            player.key = 5
            console.log(`player key is changed to${player.key}`)
            player.state = 'classroomHallway';
            player.interaction = true;
            player.x = 900;
            player.y = 400;
            loadMap('classroomHallway');
            return;
        }
        else if(message=='결국 혼나고 말았다...'){
            player.key = 4
            console.log(`player key is changed to${player.key}`)
            player.state = 'classroom';
            player.x = 300;
            player.y = 100;
            loadMap('classroom');
            return;
        }
    }, delay);
  }
}

// -----------------------------------------------------------
//본 함수
//------------------------------------------------------------
export function showConversation(player, loadMap) {
  if (!document.getElementById("startContainer")) {

    const container = document.createElement("div");
    container.id = "startContainer";
container.innerHTML = `
  <div id="dialogueBox">
    <div id="nameTag">물리 선생님</div>
    <div id="dialogueText">${text}</div>
    <div id="inputArea">
      <input type="text" id="myInput" placeholder="내용을 입력하세요">
      <button id="sendBtn">▶</button>
    </div>
  </div>
`;
    console.log('stt')

Object.assign(container.style, {
  position: 'absolute',
  bottom: '15%', left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  width: '80%',
  padding: '20px',
  borderRadius: '10px',
  fontSize: '18px',
  zIndex: '1000',
  fontFamily: 'sans-serif',
});

// 이름 태그
const nameTag = container.querySelector('#nameTag');
Object.assign(nameTag.style, {
  fontWeight: 'bold',
  fontSize: '20px',
  marginBottom: '8px',
  color: '#ffd700',
});

// 대화 텍스트
const dialogueText = container.querySelector('#dialogueText');
Object.assign(dialogueText.style, {
  marginBottom: '12px',
  lineHeight: '1.5',
});

// 입력창 + 버튼
const inputArea = container.querySelector('#inputArea');
Object.assign(inputArea.style, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '10px',
});

const inputBox = container.querySelector('#myInput');
Object.assign(inputBox.style, {
  flex: '1',
  padding: '8px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
});

const sendBtn = container.querySelector('#sendBtn');
Object.assign(sendBtn.style, {
  padding: '8px 12px',
  backgroundColor: '#444',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
});

    document.body.appendChild(container);

        if(conCount==0){
      showEndMessage('어제 물리실을 쓰고 정리를 안해서 부르신 것 같다..!',4000,player,loadMap)
    }
    if(text.includes('수고하세요')){
      document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},2000)
      showEndMessage('혼나지는 않았지만 앞으로는 물리실을 잘 정리하자!', 2500, player, loadMap)
    }
    else if(conCount>=10){
     document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},2000)    
      showEndMessage('결국 혼나고 말았다...', 2500, player,loadMap)
    }

   //대화 입력 버튼 클릭시:
    document.getElementById("sendBtn").addEventListener("click", async () => {

      const input = document.getElementById("myInput");
      const userText = input.value;
      if (!userText) return;
      input.value = "";

      try {
        const answer = await mainFunction({
          history: history,
          summary: summary,
          name: name,
          situationPrompt: situationPrompt,
          inputText: userText,
          }
        );
        // Firebase callable 함수 응답은 .data에 담겨 있음
        const result = answer.data;
        history = result.history;
        summary = result.summary;
        text = result.reply;
        container.remove()
        conCount++
        console.log(conCount)

      } catch (error) {
        console.error("함수 호출 에러:", error);
        alert("서버 호출 중 오류가 발생했습니다.");
      }
    });
        document.getElementById("myInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            document.getElementById("sendBtn").click();
        }
        });
  }

}
