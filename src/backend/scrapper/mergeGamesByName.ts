import { getShowName } from './utilsv2';

type baseType = { folder: string; nameRaw: string };

export const mergeGamesByName = <T extends baseType>(games: T[]) => {
  const objectItem: { [folder: string]: { [name: string]: T[] } } = {};

  games.forEach((game) => {
    const { folder } = game;

    if (!objectItem[folder]) {
      objectItem[folder] = {};
    }

    const name = getShowName(game.nameRaw);

    if (objectItem[folder][name]) {
      objectItem[folder][name].push({ ...game });
    } else {
      objectItem[folder][name] = [{ ...game }];
    }
  });

  return objectItem;
};
