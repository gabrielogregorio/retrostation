import { BrowserWindow } from 'electron';
import { EVENT_NAMES } from '@/config/eventNames';
import { UserType } from '@/types/user';

/**
 * Notifies all windows that user data has been updated with the new data
 */
export const dispatchUserDataUpdated = (updatedData: UserType) => {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(EVENT_NAMES.userDataUpdated, updatedData);
  });
};
