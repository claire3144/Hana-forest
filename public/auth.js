const auth = firebase.auth();
const db = firebase.firestore();


function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // 새 사용자 생성 후 tutorialDone 초기화
      const user = userCredential.user;
      return db.collection('users').doc(user.uid).set({
        tutorialDone: false
      });
    })
    .catch((error) => {
      console.error("회원가입 에러:", error);
    });
}
// 로그인 처리
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password).catch(console.error);
}

// 튜토리얼 완료 처리
function completeTutorial() {
  const user = auth.currentUser;
  if (user) {
    db.collection('users').doc(user.uid).set({ tutorialDone: true }, { merge: true })
      .then(() => {
        console.log("1")
        showPage('canvas');
        loadGame();
      });
  }
}

// 로그인 상태 감지
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    console.log("login plz")
    showPage("loginPage");
    return;
  }

  try {
    const docRef = db.collection('users').doc(user.uid);
    const doc = await docRef.get();

    if (doc.exists && doc.data().tutorialDone === false) {
      // 유저가 존재하면서 tutorialDone이 false거나 undefined이면 튜토리얼로
        console.log("tutorial")

      showPage("tutorialPage");
    } else {
    console.log("game start")

      showPage("canvas");
      loadGame(); // 본 게임 실행
    }
  } catch (error) {
    console.error("Firestore 접근 에러:", error);
    showPage("loginPage");
  }
});


// 페이지 전환 함수
function showPage(id) {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("tutorialPage").style.display = "none";
  document.getElementById("canvas").style.display = "none";
  document.getElementById(id).style.display = "block";
}

// 본 게임 실행 (main.js 동적 로딩)
function loadGame() {
  const script = document.createElement("script");
  script.type = "module";
  script.src = "main.js";
  document.body.appendChild(script);
}
