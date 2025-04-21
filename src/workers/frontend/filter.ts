import { ClassicsType, GamesType, PlatformsType } from '@/types/all';
import { UserType } from '@/types/user';
import { sortArrayUtil } from '@/utils/sort';

// cd: 102 package chance dropper beause this code expand from 112 line to 12k lines and cause slow

const shufflePseudoSeed = (array: GamesType[], seed: number) =>
  array
    .map((value, index) => ({ value, sort: seed + index }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const classicsToTop = (games: GamesType[], classicsNames: ClassicsType) => {
  const keysClassicsNames = Object.keys(classicsNames);

  return games.sort((left, right) => {
    const relativePathLeft = left.files.map((item) => item.gameRelativePathOrFolder).join('');
    const relativePathRight = right.files.map((item) => item.gameRelativePathOrFolder).join('');

    const aIsClassic = keysClassicsNames.some((key) => {
      const listClassics = classicsNames[key];
      return left.folder === key && listClassics.find((item) => relativePathLeft.includes(item));
    });

    const bIsClassic = keysClassicsNames.some((key) => {
      const listClassics = classicsNames[key];
      return right.folder === key && listClassics.find((item) => relativePathRight.includes(item));
    });

    if (aIsClassic && !bIsClassic) return sortArrayUtil.bToEnd;

    if (!aIsClassic && bIsClassic) return sortArrayUtil.aToEnd;

    return sortArrayUtil.notSort;
  });
};

const noImagesToEnd = (gamesFilteredLocal: GamesType[]) =>
  gamesFilteredLocal.sort((a, b) => {
    if (!a.image && b.image) {
      return sortArrayUtil.aToEnd;
    }

    if (a.image && !b.image) {
      return sortArrayUtil.bToEnd;
    }

    return sortArrayUtil.notSort;
  });

function flashEnd(gamesFilteredLocal: GamesType[]) {
  return gamesFilteredLocal.sort((a, b) => {
    if (a.folder === 'SWF_FLASH' && b.folder !== 'SWF_FLASH') {
      return sortArrayUtil.aToEnd;
    }

    if (a.folder !== 'SWF_FLASH' && b.folder === 'SWF_FLASH') {
      return sortArrayUtil.bToEnd;
    }

    return sortArrayUtil.notSort;
  });
}

function filterByTextName(gamesFilteredLocal: GamesType[], searchTerm: string) {
  return gamesFilteredLocal.filter((game) => game.fullTextSarchNameOptimized.includes(searchTerm));
}

export type filtersType = {
  screen: 'home' | 'favorites' | 'time-game';
  platform: PlatformsType;
  seedDay: number;
  classicsToTop: boolean;
  searchTerm: string;
};

export type PayloadFilters = {
  gamesByPlatform: GamesType[];
  filters: filtersType;
  userData: UserType;
  classicsNames: ClassicsType;
};

try {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = (event) => {
    const {
      gamesByPlatform,
      filters: { searchTerm, seedDay, ...filters },
      userData,
      classicsNames,
    } = event.data as PayloadFilters;

    let gamesFilteredLocal = [...gamesByPlatform];

    gamesFilteredLocal = shufflePseudoSeed(gamesFilteredLocal, seedDay);

    gamesFilteredLocal = filterByTextName(gamesFilteredLocal, searchTerm);

    if (filters.platform !== null) {
      gamesFilteredLocal = gamesFilteredLocal.filter((game) =>
        filters.platform.folder.find((folder) => game.folder === folder),
      );
    }

    if (filters.screen === 'time-game') {
      gamesFilteredLocal = gamesFilteredLocal.filter((item) =>
        userData.playHistory.find((playItem) =>
          item.files.find((file) => playItem.path === file.gameRelativePathOrFolder),
        ),
      );

      const gamesFilteredLocalWithTime = gamesFilteredLocal.map((game) => {
        const playFound = userData.playHistory.find((playItem) =>
          game.files.find((file) => playItem.path === file.gameRelativePathOrFolder),
        );
        return {
          ...game,
          elapsedSeconds: playFound.elapsedSeconds || 0,
        };
      });

      // eslint-disable-next-line no-restricted-globals
      self.postMessage(
        flashEnd(noImagesToEnd(gamesFilteredLocalWithTime.sort((a, b) => b.elapsedSeconds - a.elapsedSeconds))),
      );
      return;
    }

    if (filters.screen === 'favorites') {
      gamesFilteredLocal = gamesFilteredLocal.filter((game) =>
        game.files.find((file) => userData.favoriteGamePaths.includes(file.gameRelativePathOrFolder)),
      );
    }

    if (filters.classicsToTop) {
      gamesFilteredLocal = classicsToTop(gamesFilteredLocal, classicsNames);
    }

    gamesFilteredLocal = flashEnd(noImagesToEnd(gamesFilteredLocal));

    // eslint-disable-next-line no-restricted-globals
    self.postMessage(gamesFilteredLocal);
  };
} catch (err) {
  console.error(err);
}

export { shufflePseudoSeed, filterByTextName, classicsToTop, noImagesToEnd };
