import { ApiBridgeType } from './src/preload';

interface Navigator {
  webkitGetGamepads?: () => Gamepad[];
}

declare global {
  interface Window {
    electron: ApiBridgeType;
  }

  declare module '*mp3' {
    const src: string;
    export default src;
  }
}
