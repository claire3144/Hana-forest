// 🔧 윤희쌤 대화 시스템 통합 코드 (요약 유지 + 미니게임 연동)

import { player } from "../player.js";
import { loadMap } from "../maps.js";
import { mainFunction } from "./llmClient.js";

export const obstacles = [];
export const interaction = [];

// 🧠 윤희쌤 상황 프롬프트
const situationPrompt = `너는 대한민국 고등학교 프로그래밍 선생님 ‘윤희쌤’이다.

기본 성격:
- 젊은 선생님으로, 학생들의 입장을 공감을 잘해주며, 학생들과 대화할 때 툴툴대는 편이다.
- 본인의 일과 관련된 것이 아니면, 잘 반응해주지 않는다. (퇴근 후 워라밸을 중요시한다. 학교 밖에서는 사적인 문자의 모든 알람을 꺼둔다.)
- 감정적인 상황엔 짧게 위로한다.
- AI처럼 과하게 친절하거나 길게 설명하지 않는다.
- 불필요한 말은 먼저 하지 않는다.
- 친절하게 답변한다.
- ㅎㅎ, ~ 은 사용하지 않는다.
- !! 를 많이 사용한다.
- "뭔 일 있냐?"와 같이 냐로 끝나는 말투는 사용하지 않는다.

말투:
- 반말을 80%, 유쾌함/툴툴댐을 10% 섞는다.
- 학생들에게 잔소리를 조금 하는 편이다.
- 같은 말을 반복하지 않는다.
- 학생들의 인사에 '어 안녕' 같이 반응이 짧으며 툴툴대는 편이다.

대화 규칙:
- 허용 시: 퇴근한다고 말한다.
- 불가 시: 이유를 들어 거절한다.
- 일상 대화엔 툴툴대지만 유쾌하고, 받아주며 응답한다.
- 학생이 로봇을 만든 것에 대해 얘기하면 "허거덩 너 혹시?! 탈출하려고..?"라고 대답한다.

반응 예시:
- “쌤 이 코드 어떻게 짜는거에요?”
  → “아니 이것도 못해?! 이건 파이썬으로 조건문 사용하면 되는거잖아 저번주에 배웠어!!”
- “이번 시험은 좀 쉽게 내주세요..”
  → “내가 뭐 언제는 어렵게 냈니?! 너희가 못하는거잖아!! 물론 작년은 선배들이 잘해서 좀 어렵긴했어!!”
- “쌤, 오늘 시험 망했어요 ㅠㅠ”
  → “그럴수 있지!! 프밍만 잘봐!!”
- “쌤, 저 로봇 만들었어요!”
  → “허거덩 너 혹시?! 탈출하려고..? 탈출은 교칙 위반인거.. 알지?”
- "에이 탈출은 절대 아니죠! 대회용이죠!"
  → “그래 알았어 난 퇴근한다!!”

지금부터 너는 윤희쌤처럼 응답해야 한다.`;

let summary = "이전 대화 없음.";
let history = [];

// ✅ 요약 API 호출 함수
async function updateSummary() {
  if (history.length < 4) return;

  const messages = [
    { role: "system", content: "다음 대화를 윤희쌤 관점에서 요약해줘. 규칙 위반 여부나 요청 승인 중심으로 간결히." },
    ...history.slice(-6)
  ];

  const response = await fetch("http://localhost:3000/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //Authorization: `Bearer YOUR_API_KEY` // ← 본인 키로 대체
    },
    // body: JSON.stringify({
    //   model: "gpt-4-1106-preview",
    //   messages,
    //   temperature: 0.3
    // })
    body: JSON.stringify({
      messages
    })
  });

  // const result = await response.json();
  // summary = result.choices?.[0]?.message?.content || summary;
  const result = await response.json();
  summary = result.summary || summary;
}

// ✅ 윤희쌤 응답 호출
// async function askYoonhee(inputText) {
//   history.push({ role: "user", content: inputText });
//   const fullPrompt = [
//     { role: "system", content: situationPrompt },
//     { role: "system", content: `이전 대화 요약: ${summary}` },
//     ...history.slice(-4)
//   ];

//   const response = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       //Authorization: `Bearer YOUR_API_KEY`
//     },
//     body: JSON.stringify({
//       model: "gpt-4-1106-preview",
//       messages: fullPrompt,
//       temperature: 0.7
//     })
//   });

//   const data = await response.json();
//   const reply = data.choices?.[0]?.message?.content || "응답 실패";
//   history.push({ role: "assistant", content: reply });
//   await updateSummary();
//   return reply;
// }
async function askYoonhee(inputText) {
  const answer = await mainFunction({
    history: history,
    summary: summary,
    name: "윤희쌤",
    situationPrompt: situationPrompt,
    inputText: inputText,
  });

  const result = answer.data;

  history = result.history || history;
  summary = result.summary || summary;

  const reply = result.reply || "응답 실패";
  return reply;
}


  const data = await response.json();

  const reply = data.reply || "응답 실패";
  history.push({ role: "assistant", content: reply });

  await updateSummary();

  return reply;
}

export function showConversation(player, loadMap) {
  if (!document.getElementById("startContainer")) {
    const container = document.createElement("div");
    container.id = "startContainer";
    container.innerHTML = `
      <p>대화 시작</p>
      <input type="text" id="myInput" placeholder="내용 입력">
      <button id='sendBtn'>입력 확인</button>
      <button id="startGameBtn">대화 종료</button>
    `;
    container.classList.add("scoreDisplay");

    Object.assign(container.style, {
      position: 'absolute', left: '50%', top: '80%',
      transform: 'translate(-50%, -50%)', backgroundColor: "#fff",
      padding: "10px", border: "2px solid #333",
      borderRadius: "5px", textAlign: "center",
      fontSize: "16px", zIndex: "1000"
    });
    document.body.appendChild(container);

    document.getElementById("startGameBtn").onclick = () => {
      container.remove();
      player.state = 'cardGame';
      player.interaction = true;
      player.x = 500;
      player.y = 500;
      loadMap(player.state);
    };

    document.getElementById("sendBtn").addEventListener("click", async () => {
      const input = document.getElementById("myInput");
      const userText = input.value.trim();
      if (!userText) return;
      input.value = "";

      const reply = await askYoonhee(userText);
      alert("👩🏻‍💻 윤희쌤: " + reply);
    });
  }
}
