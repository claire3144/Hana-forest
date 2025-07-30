export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

const tutorialImages = [
  "/images/dorm.jpg",
  "/images/card.jpg",
  "/images/robot.jpg", // 마지막 이미지
];

let currentImageIndex = 0;

// 튜토리얼 이미지 표시용 DOM
const tutorialPage = document.getElementById("tutorialPage");
tutorialPage.style.position = "relative";  // 버튼 기준을 위한 설정

const tutorialImage = document.createElement("img");
tutorialImage.style.width = "110%";
tutorialImage.style.height = "auto";
tutorialImage.src = tutorialImages[currentImageIndex];
tutorialPage.innerHTML = "";  // 기존 내용 제거
tutorialPage.appendChild(tutorialImage);

// 다음 버튼 생성
const nextBtn = document.createElement("button");
nextBtn.id = "nextBtn";
nextBtn.innerText = "다음";

// 버튼 스타일 설정 (아래 중앙에 고정)
nextBtn.style.position = "absolute";
nextBtn.style.left = "50%";
nextBtn.style.bottom = "50px";
nextBtn.style.transform = "translateX(-50%)";
nextBtn.style.backgroundColor = "rgba(221, 131, 35, 0.87)";
nextBtn.style.padding = "10px";
nextBtn.style.border = "2px solid #333";
nextBtn.style.fontSize = "17px";
nextBtn.style.zIndex = "1000";

tutorialPage.appendChild(nextBtn);

// 버튼 클릭 이벤트
nextBtn.onclick = () => {
  if (currentImageIndex < tutorialImages.length - 1) {
    currentImageIndex++;
    tutorialImage.src = tutorialImages[currentImageIndex];
    console.log(1)

    // 마지막 이미지일 때 텍스트 변경
    if (currentImageIndex === tutorialImages.length - 1) {
      nextBtn.innerText = "튜토리얼 끄읏!";
    }
  } else {
    completeTutorial();
  }
};

