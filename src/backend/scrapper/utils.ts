/* eslint-disable no-restricted-syntax */
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

export const getOnlyName = (fullPath: string) => {
  const parts = fullPath.split(/\\|\//g);
  const lastPart = parts[parts.length - 1];
  return lastPart.substring(0, lastPart.lastIndexOf('.')) || lastPart;
};

export const getAllImagesResolved = (): {
  urlRelative: string;
  search: string;
}[] =>
  getAllFiles(path.resolve(PATH_GAME_ASSETS_FOLDER))
    .map((urlRelative) => {
      if (
        urlRelative.endsWith('.git') ||
        urlRelative.endsWith('.sh') ||
        urlRelative.endsWith('.md') ||
        urlRelative.endsWith('.gitignore')
      ) {
        return { urlRelative: '', search: '' };
      }

      const pathX = getOnlyName(urlRelative);

      return { urlRelative: urlRelative.replace(/\\/g, '/'), search: onlyLettersAndNumbers(pathX) };
    })
    .filter((item) => item.urlRelative);

type ReturnLoadFilesFile = { urlRelativeFile: string; folder: string; type: 'file' };
type ReturnLoadFilesFolder = { urlRelativeFolder: string; folder: string; type: 'folder' };

type ReturnLoadFiles = ReturnLoadFilesFile | ReturnLoadFilesFolder;

export const loadAllGamesWithPathResolvedAndFolder = ({
  runnersByFolder,
}: {
  runnersByFolder: RunnersByFolderType[];
}) => {
  const allGamesResolved: ReturnLoadFiles[] = [];

  for (const runnerByFolder of runnersByFolder) {
    const folderResolved = path.resolve(PATH_CONTENT_GAMES_FOLDER, runnerByFolder.folder);

    if (!fs.existsSync(folderResolved)) {
      fs.mkdirSync(folderResolved, { recursive: true });
    }

    const { map } = runnerByFolder;

    if (map.mode === 'file') {
      const allFiles = getAllFiles(folderResolved).filter((gameFileUrlRelative) => {
        const shouldBeIgnre = map.ignoreFiles?.length
          ? map.ignoreFiles.find((ignPattern) => gameFileUrlRelative.toLowerCase().includes(ignPattern))
          : false;

        if (shouldBeIgnre) {
          return false;
        }

        return gameFileUrlRelative.toLowerCase().endsWith(map.extensionFile);
      });

      const onlyInexistentMap: string[] = [];

      allFiles.forEach((itemFile) => {
        onlyInexistentMap.push(itemFile);
      });

      const games = onlyInexistentMap.map((urlRelative) => ({
        urlRelativeFile: urlRelative.replace(/\\/g, '/'),
        folder: runnerByFolder.folder,
        type: 'file',
      })) as ReturnLoadFilesFile[];

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
      })) as ReturnLoadFilesFolder[];

      allGamesResolved.push(...games);
    }
  }

  return allGamesResolved;
};

export const findImageFromGame = (
  allImagesResolvedLocal: {
    urlRelative: string;
    search: string;
  }[],
  searchNameOptimized: string,
) => allImagesResolvedLocal.find((item) => item.search === searchNameOptimized);
