export type GameFileLoaderType =
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

export type GamesLoaderType = {
  name: string;
  folder: string;
  description: string;
  image: string;
  files: GameFileLoaderType[];
  searchNameOptimized: string;
  fullTextSarchNameOptimized: string;
};
