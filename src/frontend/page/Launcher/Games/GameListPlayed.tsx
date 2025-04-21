import React from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { Icon } from '@/icons/index';
import { GamesType } from '@/types/all';
import { formatDuration } from '@/utils/date/formatHour';
import { resolveRelativePaths } from '@/utils/resolveRelativePaths';
import { PATH_API_GAME_ASSETS_FOLDER } from '@/config/index';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';

type LauncerItemProps = {
  setGameSelected: React.Dispatch<React.SetStateAction<GamesType>>;
  games: GamesType[];
};

export const GameListPlayed = ({ games, setGameSelected }: LauncerItemProps) => {
  const { userData } = useUserData();

  return (
    <div className="grid grid-cols-1 gap-6 flex-col mt-6" key="custom-cards">
      {games.map((game) => {
        const isFavorite = game.files.find((file) =>
          userData.favoriteGamePaths.includes(file.gameRelativePathOrFolder),
        );
        const playHistoric = userData.playHistory.find((filePlayed) =>
          game.files.find((file) => file.gameRelativePathOrFolder === filePlayed.path),
        );

        const pathResolved = game.files?.[0];

        return (
          <ButtonWithSound
            key={`time-game-cards-${game.name}-${pathResolved.gameRelativePathOrFolder}`}
            onClick={() => {
              setGameSelected(game);
            }}
            className="hover:bg-backgroundButtonHover transition-transform duration-75 select-none rounded-lg relative flex gap-2">
            {isFavorite && <Icon.Star className="fill-yellow-400 stroke-white/20 absolute right-0" />}
            <div>
              {game.image ? (
                <img
                  src={resolveRelativePaths(`${PATH_API_GAME_ASSETS_FOLDER}${game.image}`)}
                  width={160}
                  height={90}
                  draggable={false}
                  alt=""
                  className="object-cover h-[90px] rounded-lg"
                />
              ) : (
                <div className="text-textNormal flex items-center justify-center h-[90px] text-sm select-none">
                  Sem imagens
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between h-full">
              <h3 className="text-textNormal text-left text-base font-bold  capitalize">{game.name}</h3>
              {playHistoric ? (
                <div className="flex justify-start items-center gap-2">
                  <div>
                    <Icon.Clock />
                  </div>

                  <div>
                    <h4 className="uppercase text-left">Tempo jogado</h4>
                    <p className="text-textDarkDs text-left">
                      {' '}
                      {formatDuration(
                        userData.playHistory.find((playItem) =>
                          game.files.find((file) => file.gameRelativePathOrFolder === playItem.path),
                        )?.elapsedSeconds || 0,
                      )}
                    </p>
                  </div>
                </div>
              ) : undefined}
            </div>
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
