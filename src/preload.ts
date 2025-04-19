// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { UserType } from './frontend/types/user';
import { GamesType } from './frontend/types/all';
import { EVENT_NAMES } from '@/config/eventNames';

contextBridge.exposeInMainWorld('electron', {
  runCliCommand: (props: { command: string; path: string }) => ipcRenderer.send(EVENT_NAMES.runCliCommands, props),
  whenRunCliCommandRespond: (callback: (output: string) => void) => {
    ipcRenderer.on(EVENT_NAMES.commandOutputResponse, (_event, output) => callback(output));
  },

  runScrapper: async () => ipcRenderer.send(EVENT_NAMES.runScrapper),
  whenRunScrapperRespond: (callback: (output: string) => void) => {
    ipcRenderer.on(EVENT_NAMES.outputRunScrapper, (_event, output) => callback(output));
  },

  whenRunnerStop: (callback: (props: { path: string }) => void) => {
    ipcRenderer.on(EVENT_NAMES.runnerHasStopped, (_event, result) => callback(result));
  },
  whenRunnerStart: (callback: () => void) => {
    ipcRenderer.on(EVENT_NAMES.runnerWasStarted, () => callback());
  },

  getPlatformInfo: () => ipcRenderer.invoke(EVENT_NAMES.getPlatformInfo),

  getUserData: () => ipcRenderer.invoke(EVENT_NAMES.getUserData),

  getGlobalData: () => ipcRenderer.invoke(EVENT_NAMES.getGlobalData),

  updateUserData: (updatedData: UserType) => ipcRenderer.send(EVENT_NAMES.updateUserData, updatedData),
  whenUserDataUpdate: (callback: (data: UserType) => void) => {
    ipcRenderer.on(EVENT_NAMES.userDataUpdated, (_event, data) => callback(data));
  },
  whenGameDataUpdated: (callback: (data: GamesType[]) => void) => {
    ipcRenderer.on(EVENT_NAMES.gameDataUpdated, (_event, data) => callback(data));
  },
});
