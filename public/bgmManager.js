const specialBgmPaths = {
  closetGame: "/bgm/cart_rider.mp3",
  cardGame: "/bgm/sans.mp3",
};

const defaultBgmPath = "/bgm/animal_forest.mp3";

let currentAudio = null;
let currentBgmPath = null;
let isPlaying = false;

export async function playBgm(state) {
  const path = specialBgmPaths[state] || defaultBgmPath;
  console.log(`🔊 playBgm called with state: ${state}, path: ${path}`);

  // 현재 재생 중인 BGM과 같고 이미 재생 중이면 무시
  if (path === currentBgmPath && isPlaying) {
    console.log(`🎵 이미 ${path} 재생 중 → 무시`);
    return;
  }

  // 이전 BGM 완전히 정지한 후 새 BGM 재생
  await stopBgm();

  const audio = new Audio(path);
  audio.loop = true;
  audio.volume = 1.0;

  try {
    await audio.play();
    currentAudio = audio;
    currentBgmPath = path;
    isPlaying = true;
    console.log(`▶️ ${path} 재생 시작`);
  } catch (err) {
    console.warn(`🔇 BGM 재생 실패 (${state}):`, err);
    isPlaying = false;
  }
}

export function stopBgm() {
  return new Promise(resolve => {
    if (currentAudio) {
      console.log(`⏹️ BGM 정지: ${currentBgmPath}`);
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    currentBgmPath = null;
    isPlaying = false;
    resolve();
  });
}
