import fs from 'fs';
import path from 'path';
import { PATH_GAME_ASSETS_FOLDER, PATH_CONTENT_GAMES_FOLDER } from '@/config/index';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';
import { RunnersByFolderType } from '@/types/all';

const getAllFiles = (dir: string) => {
  let results: string[] = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(path.relative('./', fullPath));
    }
  });
  return results;
};

export const getNameFromFilename = (fullPath: string) => {
  const parts = fullPath.split(/\\|\//g);
  const lastPart = parts[parts.length - 1];
  return lastPart.substring(0, lastPart.lastIndexOf('.')) || lastPart;
};

export const getAllImagesResolved = (): {
  urlRelative: string;
  search: string;
}[] =>
  getAllFiles(path.resolve(PATH_GAME_ASSETS_FOLDER))
    .filter((urlRelative) => {
      const shouldBeIgnore =
        urlRelative.endsWith('.git') ||
        urlRelative.endsWith('.sh') ||
        urlRelative.endsWith('.md') ||
        urlRelative.endsWith('.gitignore');

      return !shouldBeIgnore;
    })
    .map((urlRelativeRaw) => {
      const urlRelative = urlRelativeRaw.replace(/\\/g, '/');

      const parts = urlRelative.split('/');
      const search = `${onlyLettersAndNumbers(parts[parts.length - 2])}/${onlyLettersAndNumbers(parts[parts.length - 1].replace(/\.([^.]*)$/, ''))}`;

      return {
        urlRelative,
        search,
      };
    });

type ReturnGameFile = { urlRelativeFile: string; folder: string; type: 'file' };
type ReturnGameFolder = { urlRelativeFolder: string; folder: string; type: 'folder' };

type ReturnGame = ReturnGameFile | ReturnGameFolder;

export const loadAllGamesWithPathResolvedAndFolder = ({
  runnersByFolder,
}: {
  runnersByFolder: RunnersByFolderType[];
}) => {
  const allGamesResolved: ReturnGame[] = [];

  runnersByFolder.forEach((runnerByFolder) => {
    const folderResolved = path.resolve(PATH_CONTENT_GAMES_FOLDER, runnerByFolder.folder);

    if (!fs.existsSync(folderResolved)) {
      fs.mkdirSync(folderResolved, { recursive: true });
    }

    const { map } = runnerByFolder;

    if (map.mode === 'file') {
      const allFilesRaw = getAllFiles(folderResolved);

      const allFiles = allFilesRaw.filter((gameFileUrlRelative) => {
        const shouldBeIgnore = map.ignoreFiles?.length
          ? map.ignoreFiles.find((ignPattern) => gameFileUrlRelative.toLowerCase().includes(ignPattern))
          : false;

        if (shouldBeIgnore) {
          return false;
        }

        return gameFileUrlRelative.toLowerCase().endsWith(map.extensionFile);
      });

      const games = allFiles.map((urlRelative) => ({
        urlRelativeFile: urlRelative.replace(/\\/g, '/'),
        folder: runnerByFolder.folder,
        type: 'file',
      })) as ReturnGameFile[];

      allGamesResolved.push(...games);
    } else if (map.mode === 'folder') {
      const subfolders = fs
        .readdirSync(folderResolved, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => `${PATH_CONTENT_GAMES_FOLDER}/${path.join(runnerByFolder.folder, entry.name)}`);

      const games = subfolders.map((relativeFolder) => ({
        urlRelativeFolder: relativeFolder.replace(/\\/g, '/'),
        folder: runnerByFolder.folder,
        type: 'folder',
      })) as ReturnGameFolder[];

      allGamesResolved.push(...games);
    }
  });

  return allGamesResolved;
};

export const findImageFromGameByNameOptimized = (
  allImagesResolvedLocal: {
    urlRelative: string;
    search: string;
  }[],
  searchNameOptimized: string,
) => allImagesResolvedLocal.find((item) => item.search === searchNameOptimized);
