import fs from 'fs';
import path from 'path';

import { app } from 'electron';
import {
  PATH_ASSETS_FOLDER,
  PATH_GAME_ASSETS_FOLDER,
  PATH_CONTENT_GAMES_FOLDER,
  PATH_PLATFORM_ASSETS_FOLDER,
  PATH_CONTENT_RUNNERS_FOLDER,
} from '@/config/index';
import { getLocalRunNode } from '@/backend/utils';

export function createConfigFolders(folder: string): { needCreate: boolean } {
  const pathResolved = path.join(getLocalRunNode(), folder);

  console.log(pathResolved);

  if (!fs.existsSync(pathResolved)) {
    fs.mkdirSync(pathResolved, { recursive: true });
    return { needCreate: true };
  }
  return { needCreate: false };
}

const getResourcePath = (...paths: string[]) => {
  const basePath = app.isPackaged ? path.join(getLocalRunNode(), 'static') : path.join(__dirname, '../../static');
  // FIXME: HERE

  return path.join(basePath, ...paths);
};

const getLocalPath = () => (app.isPackaged ? '' : '../'); // FIXME: HERE

export function copyIfNotExistsAndDirEmpty(fromPath: string, toRelativePath: string) {
  const toFullPath = path.resolve(getLocalRunNode(), toRelativePath);

  const toDir = path.dirname(toFullPath);

  if (!fs.existsSync(toDir)) {
    fs.mkdirSync(toDir, { recursive: true });
  }

  fs.copyFileSync(fromPath, toFullPath);
}

export const createConfig = () => {
  console.log('createConfig: START');
  createConfigFolders(PATH_ASSETS_FOLDER);
  const { needCreate } = createConfigFolders(PATH_GAME_ASSETS_FOLDER);
  createConfigFolders(PATH_PLATFORM_ASSETS_FOLDER);
  createConfigFolders(PATH_CONTENT_GAMES_FOLDER);
  createConfigFolders(PATH_CONTENT_RUNNERS_FOLDER);

  if (!needCreate) {
    console.log('createConfig: NOT_NEED_CREATE_CONFIG');
    return;
  }

  console.log('createConfig: MOVING_FILES');

  console.log('FROM::', getResourcePath('initialSetup', 'flashPlayer.webp'));
  console.log(
    'TO::',
    path.resolve(getLocalRunNode(), `${getLocalPath()}${PATH_PLATFORM_ASSETS_FOLDER}/flashPlayer.webp`),
  );

  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'flashPlayer.webp'),
    `${getLocalPath()}${PATH_PLATFORM_ASSETS_FOLDER}/flashPlayer.webp`,
  );
  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'flashPlayerGameExample.swf'),
    `${getLocalPath()}${PATH_CONTENT_GAMES_FOLDER}/SWF_FLASH/flashPlayerGameExample.swf`,
  );

  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'msdos.webp'),
    `${getLocalPath()}${PATH_PLATFORM_ASSETS_FOLDER}/msdos.webp`,
  );
  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'exampleMsDosGame.exe'),
    `${getLocalPath()}${PATH_CONTENT_GAMES_FOLDER}/EXE_MSDOS/exampleMsDosGame/anyName.exe`,
  );

  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'flashPlayerGameExample.webp'),
    `${getLocalPath()}${PATH_GAME_ASSETS_FOLDER}/flashPlayerGameExample.webp`,
  );

  copyIfNotExistsAndDirEmpty(
    getResourcePath('initialSetup', 'exampleMsDosGame.webp'),
    `${getLocalPath()}${PATH_GAME_ASSETS_FOLDER}/exampleMsDosGame.webp`,
  );
};
