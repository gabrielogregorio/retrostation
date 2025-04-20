import { FILE_PATH_PLATFORMS } from '@/config/index';
import { readFileUtil } from '@/loaders/readFile';
import { PlatformsType } from '@/types/all';

export const readPlatformsData = () =>
  readFileUtil<PlatformsType[]>(FILE_PATH_PLATFORMS, [
    {
      name: 'Adobe Flash',
      folder: ['SWF_FLASH'],
      imageSrc: 'flashPlayer.webp',
    },
    {
      name: 'MsDos',
      folder: ['EXE_MSDOS'],
      imageSrc: 'msdos.webp',
    },
  ]);
