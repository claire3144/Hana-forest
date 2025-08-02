export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

const tutorialImages = [
  "/images/tutorial_1.jpg",
  "/images/tutorial_2.jpg",
  "/images/tutorial_3.jpg",
  "/images/tutorial_4.jpg",
  "/images/tutorial_5.jpg",
];

let currentImageIndex = 0;

// 튜토리얼 이미지 표시용 DOM
const tutorialPage = document.getElementById("tutorialPage");

// 16:9 비율을 tutorialPage에 적용
tutorialPage.style.position = "relative";
tutorialPage.style.width = "100%";
tutorialPage.style.maxWidth = "960px";  // 원하는 최대 폭
tutorialPage.style.aspectRatio = "16/9";
tutorialPage.style.margin = "0 auto";  // 중앙 정렬
tutorialPage.style.overflow = "hidden"; // 잘림 방지

// 이미지 태그
const tutorialImage = document.createElement("img");
tutorialImage.src = tutorialImages[currentImageIndex];
tutorialImage.style.width = "100%";
tutorialImage.style.height = "100%";
tutorialImage.style.objectFit = "cover";
tutorialImage.style.position = "absolute";
tutorialImage.style.top = "0";
tutorialImage.style.left = "0";

tutorialPage.innerHTML = ""; // 기존 내용 제거
tutorialPage.appendChild(tutorialImage);

// 다음 버튼 생성
const nextBtn = document.createElement("button");
nextBtn.id = "nextBtn";
nextBtn.innerText = "다음";

// 버튼 스타일
nextBtn.style.position = "absolute";
nextBtn.style.left = "8%";
nextBtn.style.bottom = "25px";
nextBtn.style.transform = "translateX(-50%)";
nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
nextBtn.style.padding = "8px 12px";
nextBtn.style.border = "2px solid #333";
nextBtn.style.fontSize = "20px";
nextBtn.style.zIndex = "1000";

tutorialPage.appendChild(nextBtn);

// 버튼 클릭 이벤트
nextBtn.onclick = () => {
  if (currentImageIndex < tutorialImages.length - 1) {
    currentImageIndex++;
    tutorialImage.src = tutorialImages[currentImageIndex];

    // 마지막 이미지일 때 텍스트 변경
    if (currentImageIndex === tutorialImages.length - 1) {
      nextBtn.innerText = "튜토리얼 완료";
    }
  } else {
    completeTutorial();
  }
};
