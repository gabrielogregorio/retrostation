import KeyBoardSound from '@/static/keyboard.mp3';
import ClickSound from '@/static/clicksound.mp3';

import { getAudioInstance } from './useAudio';

const clickSound = getAudioInstance(ClickSound);
const keyboarSound = getAudioInstance(KeyBoardSound);

export const handleClickSound = () => {
  if (!clickSound) {
    return;
  }
  if (!clickSound.paused) {
    clickSound.currentTime = 0;
  }
  clickSound.play().catch((err) => console.error('Erro ao tocar áudio:', err));
};

let lastKeyboardTime = 0;
export const handleKeyboardSound = () => {
  if (!keyboarSound) {
    return;
  }

  // para evitar hovers excessivos
  const now = Date.now();
  if (now - lastKeyboardTime < 50) return;
  lastKeyboardTime = now;

  // para manter o ultimo hover
  const soundInstance = keyboarSound.cloneNode() as HTMLAudioElement;
  soundInstance.volume = keyboarSound.volume;

  if (!soundInstance.paused) {
    soundInstance.currentTime = 0;
  }
  soundInstance.play().catch((err) => console.error('Erro ao tocar áudio:', err));
};
