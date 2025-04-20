import { BrowserWindow } from 'electron';
import { EVENT_NAMES } from '@/config/eventNames';
import { UserType } from '@/types/user';

export const dispatchUserDataUpdated = (updatedData: UserType) => {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(EVENT_NAMES.userDataUpdated, updatedData);
  });
};
