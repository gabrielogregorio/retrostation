import { FILE_PATH_USER } from '@/config/index';
import { dispatchUserDataUpdated } from '@/events/dispatchUserDataUpdated';
import { readFileUtil } from '@/loaders/readFile';
import { saveFile } from '@/loaders/saveFile';
import { UserType } from '@/types/user';

const DEFAULT_USER_TEMPLATE = {
  favoriteGamePaths: [],
  searchHistory: [],
  playHistory: [],
  preferences: { preferredRunnersIds: [] },
};

export function readUserData(): UserType {
  return readFileUtil<UserType>(FILE_PATH_USER, DEFAULT_USER_TEMPLATE);
}

export function saveUserData(updatedData: UserType) {
  saveFile(FILE_PATH_USER, updatedData);

  dispatchUserDataUpdated(updatedData);
}
