/* eslint-disable sonarjs/cognitive-complexity */
import { PATH_CONTENT_GAMES_FOLDER } from '@/config/index';
import { readDescriptionsData } from '@/loaders/descriptions';
import { saveGamesData } from '@/loaders/games';
import { readRunnersByFoldersData } from '@/loaders/runnerByFolder';
import { mergeGamesByName } from '@/scrapper/mergeGamesByName';
import {
  findImageFromGame,
  getAllImagesResolved,
  getOnlyName,
  loadAllGamesWithPathResolvedAndFolder,
} from '@/scrapper/utils';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';
import { GamesType } from '@/types/all';

export const runScrapper = async () => {
  const images = getAllImagesResolved();

  const descriptions = readDescriptionsData().map((item) => ({
    ...item,
    search: onlyLettersAndNumbers(item.fileName),
  }));

  const runnersByFolder = readRunnersByFoldersData();

  const allFiles = loadAllGamesWithPathResolvedAndFolder({ runnersByFolder });

  const dataMerged = mergeGamesByName(
    allFiles.map((file) => {
      const nameRaw = getOnlyName(file.type === 'file' ? file.urlRelativeFile : file.urlRelativeFolder);
      return {
        ...file,
        nameRaw,
      };
    }),
  );

  const games: GamesType[] = [];

  Object.keys(dataMerged).forEach((folder) => {
    const gamesByName = dataMerged[folder];

    Object.keys(gamesByName).forEach((gameName) => {
      const gameItem = gamesByName[gameName];

      const searchNameOptimized = onlyLettersAndNumbers(gameName);
      const findDescriptions = descriptions.find((item) => item.search === searchNameOptimized);

      const findImageRealName = findDescriptions?.realName
        ? findImageFromGame(images, onlyLettersAndNumbers(findDescriptions?.realName))
        : undefined;

      const findImageSearch = searchNameOptimized
        ? findImageFromGame(images, onlyLettersAndNumbers(searchNameOptimized))
        : undefined;

      const findImage = findImageSearch || findImageRealName;

      const description = findDescriptions?.description || '';

      const files: GamesType['files'] = gameItem.map((gameI) => {
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

      games.push({
        name: findDescriptions?.realName || gameName,
        folder,
        description,
        image: findImage?.urlRelative ? findImage?.urlRelative.split('/').slice(-1)[0] : undefined,
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
