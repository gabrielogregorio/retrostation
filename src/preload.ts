// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { UserType } from './frontend/types/user';
import { GamesType } from './frontend/types/all';
import { EVENT_NAMES } from '@/config/eventNames';

const ApiBridge = {
  runCliCommand: (props: { command: string; path: string }) => ipcRenderer.send(EVENT_NAMES.runCliCommands, props),
  whenRunCliCommandRespond: (callback: (output: string) => void) => {
    const listener = (_event, output) => callback(output);

    ipcRenderer.on(EVENT_NAMES.commandOutputResponse, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.commandOutputResponse, listener);
    };
  },

  runScrapper: async () => ipcRenderer.send(EVENT_NAMES.runScrapper),
  whenRunScrapperRespond: (callback: (output: { success: boolean; error: unknown }) => void) => {
    const listener = (_event, output) => callback(output);
    ipcRenderer.on(EVENT_NAMES.outputRunScrapper, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.outputRunScrapper, listener);
    };
  },

  whenRunnerStop: (callback: (props: { path: string }) => void) => {
    const listener = (_event, result) => callback(result);
    ipcRenderer.on(EVENT_NAMES.runnerHasStopped, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.runnerHasStopped, listener);
    };
  },
  whenRunnerStart: (callback: (props: { path: string }) => void) => {
    const listener = (_event, result) => callback(result);
    ipcRenderer.on(EVENT_NAMES.runnerWasStarted, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.runnerWasStarted, listener);
    };
  },

  getPlatformInfo: () => ipcRenderer.invoke(EVENT_NAMES.getPlatformInfo),

  getUserData: () => ipcRenderer.invoke(EVENT_NAMES.getUserData),

  getGlobalData: () => ipcRenderer.invoke(EVENT_NAMES.getGlobalData),

  updateUserData: (updatedData: UserType) => ipcRenderer.send(EVENT_NAMES.updateUserData, updatedData),
  whenUserDataUpdate: (callback: (data: UserType) => void) => {
    const listener = (_event, data) => callback(data);

    ipcRenderer.on(EVENT_NAMES.userDataUpdated, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.userDataUpdated, listener);
    };
  },
  whenGameDataUpdated: (callback: (data: GamesType[]) => void) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on(EVENT_NAMES.gameDataUpdated, listener);

    return () => {
      ipcRenderer.removeListener(EVENT_NAMES.gameDataUpdated, listener);
    };
  },
};

contextBridge.exposeInMainWorld('electron', ApiBridge);

export type ApiBridgeType = typeof ApiBridge;
