export type DescriptionsType = {
  folder?: string;
  fileName?: string;
  realName?: string;
  description?: string;
  descrição?: string;
  // tags?: []; // future
};

type GameFileType =
  | {
      type: 'file';
      id: string;
      gameRelativePath: string;
      gameRelativePathOrFolder: string;
    }
  | {
      type: 'folder';
      gameRelativeFolder: string;
      id: string;
      gameRelativePathOrFolder: string;
    };

export type PlatformsType = {
  name: string;
  folder: string[];
  imageSrc: string;
};

type RunnersByFolderMapFileType = {
  mode: 'file';
  extensionFile: string;
  ignoreFiles: string[];
};

type RunnersByFolderMapFolderType = {
  mode: 'folder';
};

export type RunnersByFolderType = {
  folder: string;
  id: string;
  map: RunnersByFolderMapFileType | RunnersByFolderMapFolderType;
  runners: {
    platform: string;
    name: string;
    id: string;
    message: string;
    command: string;
  }[];
};

export type GamesType = {
  name: string;
  id: string;
  folder: string;
  description: string;
  image: string;
  files: GameFileType[];
  searchNameOptimized: string;
  fullTextSarchNameOptimized: string;
};

export type GlobalDataType = {
  descriptions: DescriptionsType[];
  games: GamesType[];
  platforms: PlatformsType[];
  runnersByFolder: RunnersByFolderType[];
};
