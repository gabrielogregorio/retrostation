import { generateUniqueId } from '@/backend/utils/generateUniqueId';
import { FILE_PATH_GAMES } from '@/config/index';
import { GamesLoaderType } from '@/loaders/games.types';
import { readFileUtil } from '@/loaders/readFile';
import { saveFile } from '@/loaders/saveFile';
import { GamesType } from '@/types/all';

export const readGamesData = (): GamesType[] =>
  readFileUtil<GamesLoaderType[]>(FILE_PATH_GAMES, [
    {
      name: 'Esse jogo se chama Nem ca vaca tussa',
      folder: 'SWF_FLASH',
      description: 'Uma descrição que você queira',
      image: '/SWF_FLASH/flashPlayerGameExample.webp',
      files: [
        {
          type: 'file',
          gameRelativePath: '/SWF_FLASH/flashPlayerGameExample.swf',
          gameRelativePathOrFolder: '/SWF_FLASH/flashPlayerGameExample.swf',
        },
      ],
      searchNameOptimized: 'essejogosechamanemcavacatussa',
      fullTextSarchNameOptimized:
        '\n          \n          essejogosechamanemcavacatussa\n\n          flashplayergameexample\n          \n            esse jogo se chama nem ca vaca tussa swf_flash [] uma descrição que você queira   []\n            ../content/games/swf_flash/flashplayergameexample.swf\n              ',
    },
    {
      name: 'examplemsdosgame',
      folder: 'EXE_MSDOS',
      description: '',

      image: '/EXE_MSDOS/exampleMsDosGame.webp',
      files: [
        {
          type: 'folder',
          gameRelativeFolder: '/EXE_MSDOS/exampleMsDosGame',
          gameRelativePathOrFolder: '/EXE_MSDOS/exampleMsDosGame',
        },
      ],
      searchNameOptimized: 'examplemsdosgame',
      fullTextSarchNameOptimized:
        '\n          \n          examplemsdosgame\n\n          examplemsdosgame\n          \n            undefined exe_msdos []    []\n            ../content/games/exe_msdos/examplemsdosgame\n              ',
    },
  ]).map((game, index) => ({
    // cd: Id before games, if games have id, the games id will be preserved in case the user is versioning, this will prevent any scrapper from generating a new id
    id: generateUniqueId(index),
    ...game,
    files: game.files.map((file, indexFiles) => ({
      id: generateUniqueId(indexFiles),
      ...file,
    })),
  }));

export const saveGamesData = (data: GamesLoaderType[]) => {
  saveFile(FILE_PATH_GAMES, data);
};
