import { BrowserWindow } from 'electron';
import { EVENT_NAMES } from '@/config/eventNames';
import { GamesType } from '@/types/all';

/**
 * Notifies all windows that the game data has been updated with the
 * new data
 */
export const dispatchGameDataUpdated = (updatedData: GamesType[]) => {
  const screens = BrowserWindow.getAllWindows();

  screens.forEach((win) => {
    win.webContents.send(EVENT_NAMES.gameDataUpdated, updatedData);
  });
};
