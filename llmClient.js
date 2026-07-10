// 기존 NPC 코드가 mainFunction을 부름
// llmClient.js가 localhost:3000/chat으로 보냄
// 응답을 answer.data 형태로 감싸서 돌려줌

export async function mainFunction(payload) {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("로컬 LLM 서버 오류:", errorText);
    throw new Error("로컬 LLM 서버 호출 실패");
  }

  const data = await response.json();

  // Firebase callable function 응답처럼 보이게 맞춤
  return {
    data: data,
  };
}