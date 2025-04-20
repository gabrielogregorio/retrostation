import KeyBoardSound from '@/static/keyboard.mp3';
import HoverSound from '@/static/hoverSound.mp3';
import ClickSound from '@/static/clicksound.mp3';

import { getAudioInstance } from './useAudio';

const DEFAULT_VOLUME_HOVER = 0.4;
const TIME_TO_START_NEXT_SOUND_IN_MS = 250;

const clickSound = getAudioInstance(ClickSound);
const hoverSound = getAudioInstance(HoverSound, DEFAULT_VOLUME_HOVER);
const keyboarSound = getAudioInstance(KeyBoardSound);

let lastHoverTime = 0;
export const handleHoverSound = () => {
  if (!hoverSound) {
    return;
  }

  // para evitar hovers excessivos
  const now = Date.now();
  if (now - lastHoverTime < TIME_TO_START_NEXT_SOUND_IN_MS) return;
  lastHoverTime = now;

  // para manter o ultimo hover
  const soundInstance = hoverSound.cloneNode() as HTMLAudioElement;
  soundInstance.volume = hoverSound.volume;

  if (!soundInstance.paused) {
    soundInstance.currentTime = 0;
  }
  soundInstance.play().catch((err) => console.error('Erro ao tocar áudio:', err));
};

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
