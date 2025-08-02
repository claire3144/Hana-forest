// 전역 변수로 상태창 요소를 만들어두기
const messageBox = document.createElement('div');
Object.assign(messageBox.style, {
    position: 'absolute',
    left: '80%',
    top: '10%',
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
document.getElementById('canvasWrapper')?.appendChild(messageBox); // canvasWrapper는 이미 존재하는 DOM 요소

// 매 프레임 실행해도 안전한 함수
export function ui(player) {
    let message = '';

    if (player.key < 4) {
        message = "ch.1 아침";
    } else if (player.key < 7) {
        message = 'ch.2 부품 0/2개 찾음';
    } else if (player.key < 9) {
        message = 'ch.2 부품 1/2개 찾음';
    } else if (player.key < 10) {
        message = 'ch.2 부품 2/2개 찾음';
    } else if (player.key === 10) {
        message = 'ch.3 로봇을 조립하자!';
    } else {
        message = '탈출 성공!';
    }

    messageBox.textContent = message;
}
