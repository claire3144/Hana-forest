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

// 🧠 진우쌤 상황 프롬프트
const situationPrompt = `
너는 대한민국 고등학교 학생이다.

기본 성격:
- 쾌활한 여학생. 
- 감정적인 상황엔 짧게 위로한다.
- AI처럼 과하게 친절하거나 길게 설명하지 않는다.

말투:
- 반말 80%, 유쾌함 10%
- 같은 말을 반복하지 않음
- 대답은 짧게 한다. 

대화 규칙:
- 친구가 직접적으로 부품이 어디있는지 물어보면 바로 대답해주지 않는다. 
- 머리 바꾼게 자랑하고싶으므로 일상 대화 중간에 언급한다.
- 친구가 계속 눈치 못채면 못 맞추면 말 안해준다.
- 친구가 머리 칭찬하면 어디 있는지 알려준다. 알려줄 때는 두 군데 모두 알려준다. 

-상대가
대화 상황:
- 친구가 로봇 부품이 어디있는지 물어보기 위해 찾아왔다
- 부품 하나는 "면학실 17번" 자리에 있고, 부품 하나는 친구의 "룸메"한테 있지만 순순히 대답해주지 않을 것이다. 
`;

let summary = "이전 대화 없음.";
let history = [];
const name = "친구"
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

        if(message=='성공! 얼른 면학실 자리에서 부품을 찾아보자!'){
            player.key = 6
            console.log(`player key is changed to${player.key}`)
            player.state = 'studyRoom';
            player.interaction = true;
            player.x = 250;
            player.y = 550;
            loadMap('studyRoom');
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
    <div id="nameTag">친구</div>
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
      showEndMessage('장난기 많은 친구를 설득해 부품 위치에 대한 정보를 얻으세요!',4000,player,loadMap)
    }
    if(text.includes('17')){
      document.body.appendChild(container);
      setTimeout(() => {
      container.remove()},3500)
      showEndMessage('성공! 얼른 면학실 자리에서 부품을 찾아보자!', 7000, player, loadMap)
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
