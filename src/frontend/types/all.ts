export type ClassicsType = {
  [key: string]: string[];
};

export type DescriptionsType = {
  folder?: string;
  fileName?: string;
  realName?: string;
  description?: string;
  descrição?: string;
};

type GameFileType =
  | {
      type: 'file';
      gameRelativePath: string;
      gameRelativePathOrFolder: string;
    }
  | {
      type: 'folder';
      gameRelativeFolder: string;
      gameRelativePathOrFolder: string;
    };

export type GamesType = {
  name: string;
  folder: string;
  description: string;
  image: string;
  files: GameFileType[];
  searchNameOptimized: string;
  fullTextSarchNameOptimized: string;
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
  map: RunnersByFolderMapFileType | RunnersByFolderMapFolderType;
  runners: {
    platform: string;
    name: string;
    message: string;
    command: string;
  }[];
};

export type GlobalDataType = {
  classics: ClassicsType;
  descriptions: DescriptionsType[];
  games: GamesType[];
  platforms: PlatformsType[];
  runnersByFolder: RunnersByFolderType[];
};
