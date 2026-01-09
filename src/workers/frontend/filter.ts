import { GamesType, PlatformsType } from '@/types/all';
import { UserType } from '@/types/user';
import { sortArrayUtil } from '@/utils/sort';

function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}

function shufflePseudoSeed(array: GamesType[], seed: number): GamesType[] {
  return [...array.map((value, index) => ({ value, sort: seed + index }))]
    .sort((a, b) => a.sort - b.sort)
    .map((value) => value.value);
}

function sortNoImagesToEnd(gamesFilteredLocal: GamesType[]): GamesType[] {
  return [...gamesFilteredLocal].sort((a, b) => {
    if (!a.image && b.image) {
      return sortArrayUtil.aToEnd;
    }

    if (a.image && !b.image) {
      return sortArrayUtil.bToEnd;
    }

    return sortArrayUtil.notSort;
  });
}

function sortflashGamesEnd(gamesFilteredLocal: GamesType[]): GamesType[] {
  return [...gamesFilteredLocal].sort((a, b) => {
    if (a.folder === 'SWF_FLASH' && b.folder !== 'SWF_FLASH') {
      return sortArrayUtil.aToEnd;
    }

    if (a.folder !== 'SWF_FLASH' && b.folder === 'SWF_FLASH') {
      return sortArrayUtil.bToEnd;
    }

    return sortArrayUtil.notSort;
  });
}

function filterByTextName(gamesFilteredLocal: GamesType[], searchTerm: string): GamesType[] {
  if (searchTerm && searchTerm?.trim()) {
    return gamesFilteredLocal.filter((game) => game.fullTextSarchNameOptimized.includes(searchTerm.trim()));
  }
  return gamesFilteredLocal;
}

export type filtersType = {
  screen: 'home' | 'favorites' | 'time-game';
  platform: PlatformsType;
  seedDay: number;
  searchTerm: string;
};

export type PayloadFilters = {
  gamesByPlatform: GamesType[];
  filters: filtersType;
  userData: UserType;
};

function filterByPlataform(gamesFilteredLocal: GamesType[], plataform: PlatformsType): GamesType[] {
  if (plataform !== null) {
    return gamesFilteredLocal.filter((game) => plataform.folder.includes(game.folder));
  }

  return gamesFilteredLocal;
}

function filterByScreen(
  gamesFilteredLocal: GamesType[],
  screen: filtersType['screen'],
  userData: UserType,
): GamesType[] {
  if (screen === 'time-game') {
    const allGamesInPlayHistoryMap = new Map(
      userData.playHistory.map((playItem) => [playItem.path, playItem.elapsedSeconds]),
    );

    const part1 = [...gamesFilteredLocal].filter((item) =>
      item.files.find((file) => allGamesInPlayHistoryMap.get(file.gameRelativePathOrFolder)),
    );

    return part1
      .map((game) => {
        const playFound = userData.playHistory.find((playItem) =>
          game.files.find((file) => playItem.path === file.gameRelativePathOrFolder),
        );
        return {
          ...game,
          elapsedSeconds: playFound.elapsedSeconds || 0,
        };
      })

      .sort((a, b) => b.elapsedSeconds - a.elapsedSeconds);
  }

  if (screen === 'favorites') {
    const allFavorites = new Set(userData.favoriteGamePaths);
    return gamesFilteredLocal.filter((game) =>
      game.files.find((file) => allFavorites.has(file.gameRelativePathOrFolder)),
    );
  }

  return gamesFilteredLocal;
}

try {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = (event) => {
    const {
      gamesByPlatform,
      filters: { searchTerm, seedDay, ...filters },
      userData,
    } = event.data as PayloadFilters;

    const gamesFilteredLocal = [...gamesByPlatform];

    // eslint-disable-next-line no-restricted-globals
    self.postMessage(
      pipe(
        gamesFilteredLocal,
        (value) => shufflePseudoSeed(value, seedDay),
        (value) => filterByTextName(value, searchTerm),
        (value) => filterByPlataform(value, filters.platform),
        (value) => filterByScreen(value, filters.screen, userData),
        sortflashGamesEnd,
        sortNoImagesToEnd,
      ),
    );
  };
} catch (err) {
  console.error(err);
}

export { shufflePseudoSeed, filterByTextName, sortNoImagesToEnd as noImagesToEnd };
