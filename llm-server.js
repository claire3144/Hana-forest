const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LLM 로컬 서버가 실행 중입니다.");
});

// -------------------------------
// 1. 텍스트 전처리
// -------------------------------
function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\wㄱ-ㅎ가-힣\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// -------------------------------
// 2. 발화 유형 정의
// -------------------------------
const queryTypes = [
  {
    type: "지시어 해소",
    weight: 3,
    patterns: [
      "그거",
      "그것",
      "그게",
      "그건",
      "그걸",
      "이거",
      "이게",
      "이건",
      "이걸",
      "저거",
      "저게",
      "저건",
      "저걸",
    ],
  },
  {
    type: "이전 대화 참조",
    weight: 3,
    patterns: ["아까", "전에", "방금", "좀 전", "말한", "다시"],
  },
  {
    type: "현재 목표 확인",
    weight: 2,
    patterns: ["뭐 해야", "지금 뭐", "다음", "목표", "어떻게 해야", "해야 돼", "해야해"],
  },
  {
    type: "장소·대상 탐색",
    weight: 2,
    patterns: ["어디", "찾", "가야", "위치", "장소"],
  },
  {
    type: "해명 의도",
    weight: 2,
    patterns: [
      "아니",
      "아닌데",
      "안 먹",
      "안먹",
      "먹은 거 아니",
      "먹은게 아니",
      "먹은 건 아니",
      "제가 먹은 거 아니",
      "제가 한 거 아니",
      "제 거 아니",
      "죄송",
      "실수",
      "몰랐",
      "억울",
    ],
  },
  {
    type: "허락 요청",
    weight: 2,
    patterns: ["가도", "보내", "허락", "통과", "갈게요", "가겠습니다"],
  },
  {
    type: "인사",
    weight: 1,
    patterns: ["안녕", "안녕하세요", "하이", "반갑"],
  },
];

// -------------------------------
// 3. 외부 메모리 저장소
// -------------------------------
const memories = [
  {
    id: "M1",
    npc: "진우쌤",
    stage: 1,
    type: "situation",
    importance: 5,
    text: "현재 상황은 학생이 기숙사에서 라면을 먹고 라면 껍데기를 들고 나오다가 사감 선생님에게 걸린 상황이다.",
    keywords: ["라면", "껍데기", "기숙사", "사감", "먹", "걸림", "그거", "그것", "이거"],
  },
  {
    id: "M2",
    npc: "진우쌤",
    stage: 1,
    type: "character",
    importance: 4,
    text: "진우쌤은 기숙사 규칙을 엄격하게 지키는 사감 선생님이며, 웬만하면 벌점을 부과한다.",
    keywords: ["진우쌤", "규칙", "벌점", "사감", "엄격", "용서", "위반"],
  },
  {
    id: "M3",
    npc: "진우쌤",
    stage: 1,
    type: "mission",
    importance: 5,
    text: "학생은 5번의 대화 안에 기숙사 내 라면 취식에 대해 해명해야 한다.",
    keywords: ["5번", "대화", "해명", "성공", "실패", "해야", "지금"],
  },
  {
    id: "M4",
    npc: "진우쌤",
    stage: 1,
    type: "success_condition",
    importance: 4,
    text: "NPC가 '다녀오세요'라고 말하면 사감 선생님 대화 미션이 성공한 것으로 처리된다.",
    keywords: ["다녀오세요", "성공", "통과", "미션", "허락", "가도"],
  },
  {
    id: "M5",
    npc: "공통",
    stage: 0,
    type: "ambiguous_expression",
    importance: 3,
    text: "사용자가 '그거', '그것', '이거', '아까', '전에'처럼 모호하게 말하면 현재 상황이나 이전 대화를 참고해 의미를 해석해야 한다.",
    keywords: ["그거", "그것", "이거", "아까", "전에", "말한", "의미", "다시"],
  },
  {
    id: "M6",
    npc: "공통",
    stage: 2,
    type: "goal",
    importance: 4,
    text: "ch.2에서는 사용자가 교교로 이동해 로봇 부품을 찾는 목표를 수행한다.",
    keywords: ["ch2", "부품", "로봇", "교교", "어디", "찾기", "다음"],
  },
];

// -------------------------------
// 4. 발화 유형 분류
// -------------------------------
function classifyQuery(inputText) {
  const normalized = normalizeText(inputText);

  const scoredTypes = queryTypes.map((queryType) => {
    let score = 0;
    const matchedPatterns = [];

    for (const pattern of queryType.patterns) {
      if (normalized.includes(normalizeText(pattern))) {
        score += queryType.weight;
        matchedPatterns.push(pattern);
      }
    }

    return {
      type: queryType.type,
      score,
      matchedPatterns,
    };
  });

  const filtered = scoredTypes
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (filtered.length === 0) {
    return {
      types: ["일반 발화"],
      typeLabel: "일반 발화",
      matchedPatterns: [],
      confidence: 0,
    };
  }

  const totalScore = filtered.reduce((sum, item) => sum + item.score, 0);
  const maxScore = filtered[0].score;

  const selectedTypes = filtered
    .filter((item) => item.score >= Math.max(2, maxScore - 1))
    .map((item) => item.type);

  return {
    types: selectedTypes,
    typeLabel: selectedTypes.join(" + "),
    matchedPatterns: filtered.flatMap((item) => item.matchedPatterns),
    confidence: Number((maxScore / totalScore).toFixed(2)),
  };
}

// -------------------------------
// 5. 질문 재작성
// -------------------------------
function rewriteQuestion(inputText, context) {
  const classification = classifyQuery(inputText);

  let searchQuery = inputText;

  if (classification.types.includes("지시어 해소")) {
    searchQuery += " 현재 상황 라면 껍데기 사건";
  }

  if (classification.types.includes("해명 의도")) {
    searchQuery += " 해명 부정 라면 취식 의심";
  }

  if (classification.types.includes("이전 대화 참조")) {
    searchQuery += " 이전 대화 요약 다시 설명";
  }

  if (classification.types.includes("현재 목표 확인")) {
    searchQuery += ` 현재 목표 playerState ${context.playerState} playerKey ${context.playerKey}`;
  }

  if (classification.types.includes("장소·대상 탐색")) {
    searchQuery += " 장소 대상 위치 찾기";
  }

  if (classification.types.includes("허락 요청")) {
    searchQuery += " 허락 통과 성공 조건";
  }

  return {
    original: inputText,
    searchQuery,
    types: classification.types,
    typeLabel: classification.typeLabel,
    matchedPatterns: classification.matchedPatterns,
    confidence: classification.confidence,
  };
}

// -------------------------------
// 6. 기억 검색
// -------------------------------
function retrieveMemories(rewriteInfo, context) {
  // 인사나 일반 발화는 기억 검색을 하지 않음
  if (
    rewriteInfo.types.includes("인사") ||
    rewriteInfo.types.includes("일반 발화")
  ) {
    return [];
  }

  const query = normalizeText(
    rewriteInfo.original + " " + rewriteInfo.searchQuery + " " + rewriteInfo.typeLabel
  );

  return memories
    .map((memory) => {
      let score = 0;
      const evidence = [];

      // 키워드 일치
      for (const keyword of memory.keywords) {
        if (query.includes(normalizeText(keyword))) {
          score += 1;
          evidence.push(`키워드:${keyword}`);
        }
      }

      // 키워드가 하나도 안 맞으면 NPC/단계 점수만으로 검색되지 않게 막음
      const hasKeywordMatch = evidence.some((e) => e.startsWith("키워드"));

      if (!hasKeywordMatch) {
        return {
          ...memory,
          score: 0,
          evidence,
        };
      }

      // NPC 일치
      if (memory.npc === context.npcName) {
        score += 3;
        evidence.push("NPC 일치");
      } else if (memory.npc === "공통") {
        score += 1;
        evidence.push("공통 기억");
      }

      // 진행 단계 일치
      if (memory.stage === context.stage) {
        score += 3;
        evidence.push("진행 단계 일치");
      } else if (memory.stage === 0) {
        score += 1;
        evidence.push("전체 단계 공통");
      }

      // 발화 유형과 기억 유형 연결
      if (rewriteInfo.types.includes("지시어 해소") && memory.type === "situation") {
        score += 3;
        evidence.push("지시어-상황 연결");
      }

      if (rewriteInfo.types.includes("해명 의도") && memory.type === "situation") {
        score += 3;
        evidence.push("해명-상황 연결");
      }

      if (rewriteInfo.types.includes("현재 목표 확인") && memory.type === "mission") {
        score += 3;
        evidence.push("목표-미션 연결");
      }

      if (rewriteInfo.types.includes("허락 요청") && memory.type === "success_condition") {
        score += 3;
        evidence.push("허락-성공조건 연결");
      }

      if (rewriteInfo.types.includes("이전 대화 참조") && memory.type === "ambiguous_expression") {
        score += 2;
        evidence.push("이전대화-모호표현 연결");
      }

      if (rewriteInfo.types.includes("장소·대상 탐색") && memory.type === "goal") {
        score += 3;
        evidence.push("탐색-목표 기억 연결");
      }

      score += memory.importance * 0.3;
      evidence.push(`중요도:${memory.importance}`);

      return {
        ...memory,
        score: Number(score.toFixed(2)),
        evidence,
      };
    })
    .filter((memory) => memory.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// -------------------------------
// 7. NPC 응답 생성
// -------------------------------
function makeNpcReply(name, inputText, rewriteInfo, selectedMemories) {
  if (name === "진우쌤") {
    if (rewriteInfo.types.includes("인사")) {
      return "안녕하세요. 손에 그거 라면 껍데기 뭡니까? 기숙사 안에서 라면 먹었습니까?";
    }

    if (
      rewriteInfo.types.includes("지시어 해소") &&
      rewriteInfo.types.includes("해명 의도")
    ) {
      return "그 라면 껍데기 말하는 겁니까? 먹은 게 아니라는 말은 알겠는데, 들고 나온 이상 설명은 해야 합니다.";
    }

    if (rewriteInfo.types.includes("지시어 해소")) {
      return "그 라면 껍데기 말하는 겁니까? 들고 나온 이상 그냥 넘어가긴 어렵습니다.";
    }

    if (rewriteInfo.types.includes("해명 의도")) {
      return "먹은 게 아니라고요? 그래도 기숙사에서 라면 껍데기가 나온 건 설명이 필요합니다.";
    }

    if (rewriteInfo.types.includes("현재 목표 확인")) {
      return "지금은 라면 껍데기 문제부터 해명해야 합니다. 딴소리하지 마세요.";
    }

    if (rewriteInfo.types.includes("이전 대화 참조")) {
      return "아까도 말했지만, 기숙사 안에서 라면 먹는 건 안 됩니다. 제대로 설명하세요.";
    }

    if (rewriteInfo.types.includes("허락 요청")) {
      return "그냥 보내줄 상황 아닙니다. 먼저 라면 껍데기부터 설명하세요.";
    }

    if (rewriteInfo.types.includes("장소·대상 탐색")) {
      return "지금은 어디 갈지 물을 때가 아니라, 라면 껍데기부터 설명할 때입니다.";
    }

    return "기숙사 규칙 위반 상황입니다. 짧게 설명하세요.";
  }

  return `${name}: 지금 상황을 다시 확인해 봐야겠네요.`;
}

// -------------------------------
// 8. 채팅 요청 처리
// -------------------------------
app.post("/chat", async (req, res) => {
  const {
    history = [],
    summary = "이전 대화 없음.",
    name = "NPC",
    situationPrompt = "",
    inputText = "",
    playerState = "unknown",
    playerKey = 0,
    conversationCount = 0,
  } = req.body;

  const stage = Number(playerKey) >= 2 ? 2 : 1;

  const context = {
    npcName: name,
    playerState,
    playerKey: Number(playerKey),
    stage,
    conversationCount,
    currentSituation:
      stage === 1
        ? "기숙사에서 라면 껍데기를 들고 나오다가 사감 선생님에게 걸린 상황"
        : "교교에서 로봇 부품을 찾아야 하는 상황",
  };

  const rewriteInfo = rewriteQuestion(inputText, context);
  const selectedMemories = retrieveMemories(rewriteInfo, context);

  const npcReply = makeNpcReply(name, inputText, rewriteInfo, selectedMemories);

  const debugInfo =
    selectedMemories.length > 0
      ? `\n\n분석 결과: ${rewriteInfo.typeLabel}\n활용 기억: ${selectedMemories
          .map((m) => m.id)
          .join(", ")}`
      : "";

  const reply = npcReply

  const newHistory = [
    ...history,
    { role: "user", content: inputText },
    { role: "assistant", content: reply },
  ];

  console.log("========== 채팅 요청 받음 ==========");
  console.log("NPC:", name);
  console.log("사용자 입력:", inputText);
  console.log("playerState:", playerState);
  console.log("playerKey:", playerKey);
  console.log("stage:", stage);
  console.log("분석 결과:", rewriteInfo.typeLabel);
  console.log("탐지된 표현:", rewriteInfo.matchedPatterns.join(", ") || "없음");
  console.log("내부 검색 질의:", rewriteInfo.searchQuery);
  console.log(
    "검색된 기억:",
    selectedMemories.map((m) => `${m.id}:${m.score}`).join(", ") || "없음"
  );
  console.log("====================================");

  res.json({
    reply,
    history: newHistory,
    summary,
    rewriteInfo,
    memories: selectedMemories,
  });
});

// -------------------------------
// 9. 서버 실행
// -------------------------------
app.listen(3000, "127.0.0.1", () => {
  console.log("LLM 로컬 서버 실행 중: http://127.0.0.1:3000");
});