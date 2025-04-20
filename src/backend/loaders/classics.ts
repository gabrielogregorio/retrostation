import { FILE_PATH_CLASSICS } from '@/config/index';
import { readFileUtil } from '@/loaders/readFile';
import { ClassicsType } from '@/types/all';

export const readClassicsData = () =>
  readFileUtil<ClassicsType>(FILE_PATH_CLASSICS, {
    SWF_FLASH: ['flashPlayerGameExample'],
  });
