import { getShowName } from './utilsv2';

type baseType = { folder: string; nameRaw: string };

export const mergeGamesByName = <T extends baseType>(games: T[]) => {
  const object: { [folder: string]: { [name: string]: T[] } } = {};

  games.forEach((game) => {
    const { folder } = game;

    if (!object[folder]) {
      object[folder] = {};
    }

    const name = getShowName(game.nameRaw);

    if (object[folder][name]) {
      object[folder][name].push({ ...game });
    } else {
      object[folder][name] = [{ ...game }];
    }
  });

  return object;
};
