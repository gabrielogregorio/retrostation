/* eslint-disable @typescript-eslint/no-explicit-any */
import { GamesType, GlobalDataType } from './src/frontend/types/all';
import { UserType } from './src/frontend/types/user';
import { PlatformReturnOsVersionType } from './src/frontend/utils/utilts';

interface Navigator {
  webkitGetGamepads?: () => Gamepad[];
}

declare global {
  interface Window {
    electron: {
      runCliCommand: (props: { command: string; path: string }) => void;
      whenRunCliCommandRespond: (callback: (output: string) => void) => void;

      whenRunScrapperRespond: (callback: (output: { success: boolean; error?: any }) => void) => void;

      runScrapper: () => Promise<void>;

      getPlatformInfo: () => PlatformReturnOsVersionType;

      whenRunnerStop: (callback: (props: { path: string }) => void) => void;
      whenRunnerStart: (callback: () => void) => void;

      getUserData: () => Promise<UserType>;
      getGlobalData: () => Promise<GlobalDataType>;

      updateUserData: (data: UserType) => void;
      whenUserDataUpdate: (callback: (data: UserType) => void) => void;
      whenGameDataUpdated: (callback: (data: GamesType[]) => void) => void;
    };
  }
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
