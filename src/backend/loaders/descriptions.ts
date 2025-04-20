import { FILE_PATH_DESCRIPTIONS } from '@/config/index';
import { readFileUtil } from '@/loaders/readFile';
import { DescriptionsType } from '@/types/all';

export const readDescriptionsData = () =>
  readFileUtil<DescriptionsType[]>(FILE_PATH_DESCRIPTIONS, [
    {
      fileName: 'flashPlayerGameExample',
      realName: 'Esse jogo se chama Nem ca vaca tussa',
      description: 'Uma descrição que você queira',
    },
  ]);
