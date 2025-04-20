const DEFAULT_AUDIO_VOLUME = 0.4;

export const getAudioInstance = (src?: string, volume = DEFAULT_AUDIO_VOLUME) => {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.preload = 'auto';
  return audio;
};
