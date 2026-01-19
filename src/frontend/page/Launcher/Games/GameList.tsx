import React from 'react';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { GamesType } from '@/types/all';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { Icon } from '@/icons/index';
import { resolveRelativePaths } from '@/utils/resolveRelativePaths';
import { PATH_API_GAME_ASSETS_FOLDER, PATH_API_PLATFORMS_ASSETS_FOLDER } from '@/config/index';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';

type LauncerItemProps = {
  setGameSelected: React.Dispatch<React.SetStateAction<GamesType>>;
  games: GamesType[];
};

export const GameList = ({ games, setGameSelected }: LauncerItemProps) => {
  const { userData } = useUserData();
  const { globalData } = useGlobalDataContext();

  return (
    <div
      className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-x-4 xl:gap-x-6 2xl:gap-x-8 xl:grid-cols-5 2xl:grid-cols-6 gap-y-6 mt-6"
      key="default-cards">
      {games.map((game) => {
        const isFavorite = game.files.find((file) => {
          if (!userData) {
            return false;
          }

          return userData.favoriteGamePaths.includes(file.gameRelativePathOrFolder);
        });

        const findPlatform = globalData.platforms.find((item) => item.folder.includes(game.folder));
        const pathResolved = game.files[0];

        return (
          <ButtonWithSound
            key={`default-cards-${game.name}-${pathResolved.gameRelativePathOrFolder}`}
            onClick={() => {
              setGameSelected(game);
            }}
            data-nodo={`data-nodo-${game.name}-${pathResolved.gameRelativePathOrFolder}`}
            className="hover:scale-[102%] hover:bg-backgroundButtonHover hover:ring-[#6a707b] hover:ring-[3px] transition-transform duration-75 select-none rounded-lg relative bg-none shadow-none">
            {isFavorite && <Icon.Star className="fill-yellow-400 stroke-white/40 absolute right-0 size-[36px] p-[4px] z-10 bg-black/80  flex items-center justify-center rounded-full" />}

            <div className="relative">
              {game.image ? (
                <img
                  src={resolveRelativePaths(`${PATH_API_GAME_ASSETS_FOLDER}${game.image}`)}
                  width={160}
                  height={120}
                  draggable={false}
                  alt=""
                  className="object-cover w-full h-full min-h-[350px] max-h-[350px] rounded-lg hover:contrast-125 transition-all duration-200"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[350px] max-h-[350px] text-size1 select-none">
                  Sem imagens
                </div>
              )}

              <div className="absolute right-2 bottom-2 backdrop-blur-lg rounded-full select-none bg-white/20 border-2 border-black/20">
                {findPlatform ? (
                  <img
                    src={resolveRelativePaths(`${PATH_API_PLATFORMS_ASSETS_FOLDER}${findPlatform.imageSrc}`)}
                    width={250}
                    height={250}
                    draggable={false}
                    alt=""
                    className="object-contain w-[60px] h-[60px] p-2"
                  />
                ) : undefined}
              </div>
            </div>
            <div className='text-[18px] font-bold whitespace-nowrap text-ellipsis overflow-hidden'>
              {game.name}
            </div>
          </ButtonWithSound>
        );
      })}
    </div>
  );
};
