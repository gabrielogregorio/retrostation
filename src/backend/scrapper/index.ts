/* eslint-disable indent */
/* eslint-disable sonarjs/cognitive-complexity */
import { PATH_CONTENT_GAMES_FOLDER } from '@/config/index';
import { readDescriptionsData } from '@/loaders/descriptions';
import { saveGamesData } from '@/loaders/games';
import { GamesLoaderType } from '@/loaders/games.types';
import { readRunnersByFoldersData } from '@/loaders/runnerByFolder';
import { mergeGamesByName } from '@/scrapper/mergeGamesByName';
import {
  findImageFromGameByNameOptimized,
  getAllImagesResolved,
  getNameFromFilename,
  loadAllGamesWithPathResolvedAndFolder,
} from '@/scrapper/utils';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';

export const runScrapper = () => {
  const images = getAllImagesResolved();

  const descriptions = readDescriptionsData().map((item) => ({
    ...item,
    search: onlyLettersAndNumbers(item.fileName),
  }));

  const runnersByFolder = readRunnersByFoldersData();

  const allFiles = loadAllGamesWithPathResolvedAndFolder({ runnersByFolder });

  const dataMerged = mergeGamesByName(
    allFiles.map((file) => {
      const nameRaw = getNameFromFilename(file.type === 'file' ? file.urlRelativeFile : file.urlRelativeFolder);
      return {
        ...file,
        nameRaw,
      };
    }),
  );

  const games: GamesLoaderType[] = [];

  Object.keys(dataMerged).forEach((folder) => {
    const gamesByName = dataMerged[folder];

    Object.keys(gamesByName).forEach((gameName) => {
      const gameItem = gamesByName[gameName];

      const searchNameOptimized = onlyLettersAndNumbers(gameName);
      const findDescriptions = descriptions.find((item) => item.search === searchNameOptimized);

      const findImageRealName = findDescriptions?.realName
        ? findImageFromGameByNameOptimized(
            images,
            `${onlyLettersAndNumbers(folder)}/${onlyLettersAndNumbers(findDescriptions?.realName)}`,
          )
        : undefined;

      const findImageSearch = searchNameOptimized
        ? findImageFromGameByNameOptimized(
            images,
            `${onlyLettersAndNumbers(folder)}/${onlyLettersAndNumbers(gameName)}`,
          )
        : undefined;
      const findImage = findImageSearch || findImageRealName;

      const description = findDescriptions?.description || '';

      const files: GamesLoaderType['files'] = gameItem.map((gameI) => {
        if (gameI.type === 'file') {
          return {
            type: 'file',
            gameRelativePath: gameI.urlRelativeFile?.replace(PATH_CONTENT_GAMES_FOLDER, ''),
            gameRelativePathOrFolder: gameI.urlRelativeFile?.replace(PATH_CONTENT_GAMES_FOLDER, ''),
          };
        }
        return {
          type: 'folder',
          gameRelativeFolder: gameI.urlRelativeFolder?.replace(PATH_CONTENT_GAMES_FOLDER, ''),
          gameRelativePathOrFolder: gameI.urlRelativeFolder?.replace(PATH_CONTENT_GAMES_FOLDER, ''),
        };
      });

      let image;

      if (findImage?.urlRelative) {
        const parts = findImage?.urlRelative.split('/');
        image = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      }
      games.push({
        name: findDescriptions?.realName || gameName,
        folder,
        description,
        image,
        files,
        searchNameOptimized: onlyLettersAndNumbers(findDescriptions?.realName || searchNameOptimized),
        fullTextSarchNameOptimized: `
          ${onlyLettersAndNumbers(findDescriptions?.realName || searchNameOptimized)}
          ${searchNameOptimized}
          ${findDescriptions?.realName}
          ${folder}
          ${description}
          ${gameItem.map((game) => (game.type === 'file' ? game.urlRelativeFile : game.urlRelativeFolder))}`.toLowerCase(),
      });
    });
  });

  saveGamesData(games);

  return games;
};
