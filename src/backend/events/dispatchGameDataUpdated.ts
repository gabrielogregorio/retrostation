import { BrowserWindow } from 'electron';
import { EVENT_NAMES } from '@/config/eventNames';
import { GamesType } from '@/types/all';

export const dispatchGameDataUpdated = (updatedData: GamesType[]) => {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(EVENT_NAMES.gameDataUpdated, updatedData);
  });
};
