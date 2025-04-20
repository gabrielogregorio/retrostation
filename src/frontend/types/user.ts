export type UserType = {
  favoriteGamePaths: string[];
  searchHistory: string[];
  playHistory: {
    path: string;
    elapsedSeconds: number;
  }[];

  preferences: {
    preferredRunnersIds: string[];
  };
};
