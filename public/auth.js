const DOMAIN = "@hanaforest.com";

window.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // 회원가입
  window.signup = function () {
    const id = document.getElementById("signupId").value.trim();
    const password = document.getElementById("signupPassword").value;
    const email = `${id}${DOMAIN}`;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("회원가입 완료. 로그인해주세요")
        return db.collection("users").doc(userCredential.user.uid).set({
          tutorialDone: false,
        });
      })
      .catch((error) => {
        alert("회원가입 실패: " + error.message);
        console.error("회원가입 에러:", error);
      });
  };

  // 로그인
  window.login = function () {
    const id = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value;
    const email = `${id}${DOMAIN}`;

    auth
      .setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(() => {
        return auth.signInWithEmailAndPassword(email, password);
      })
      .then((userCredential) => {
        console.log("로그인 성공:", userCredential.user.email);
        // 로그인 성공 후 아무것도 하지 않아도 됨 (onAuthStateChanged가 처리)
      })
      .catch((error) => {
        alert("로그인 실패: " + error.message);
        console.error("로그인 에러:", error);
      });
  };

  // 튜토리얼 완료
  window.completeTutorial = function () {
    const user = auth.currentUser;
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set({ tutorialDone: true }, { merge: true })
        .then(() => {
          showPage("canvas");
          loadGame();
        });
    }
  };

  // 로그인 상태 감지
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.log('loginPage')
      showPage("loginPage");
      return;
    }

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      console.log('tutorial')
      showPage("tutorialPage");
      document.getElementById("loginContainer").style.display = "none"; //  로그인 화면 숨김
    } catch (err) {
      console.error("Firestore 접근 에러:", err);
      showPage("loginPage");
    }
  });

  // 페이지 전환
  function showPage(id) {
    ["loginPage", "tutorialPage", "canvas"].forEach((pid) => {
      document.getElementById(pid).style.display = "none";
    });
    document.getElementById(id).style.display = "block";

    if(id==="tutorialPage"){
    loadTutorialScript();
    }
  }

  // 게임 로딩
  function loadGame() {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "main.js";
    document.body.appendChild(script);
  }
});


function loadTutorialScript() {
  const scriptId = "tutorialScript";

  // 이미 로드한 경우 중복 방지
  if (document.getElementById(scriptId)) return;

  const script = document.createElement("script");
  script.type = "module"; // 필요에 따라 "text/javascript"로 변경
  script.id = scriptId;
  script.src = "tutorial.js"; // 원하는 JS 파일 경로
  document.body.appendChild(script);
}
