import { useEffect, useRef, useState } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { handleClickSound, handleHoverSound, handleKeyboardSound } from '@/components/organisms/ButtonSound/sound';
import { GamePlayer } from '@/components/organisms/GamePlayer';
import { SyncFiles } from '@/components/organisms/SyncFiles';
import { callFilterWorker } from '@/frontend/workers/callFilterWorker';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { Icon } from '@/icons/index';
import { GameList } from '@/page/Launcher/Games/GameList';
import { GameListPlayed } from '@/page/Launcher/Games/GameListPlayed';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';
import { GamesType, RunnersByFolderType } from '@/types/all';
import { SIZE_SIDEBAR_IN_PX } from '@/frontend/constants/sizes';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useInfinitScrollObserver } from '@/hooks/useInfinitScrollObserver';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';

type LauncerItemProps = {
  gamesByPlatform: GamesType[];
  runnersByFolderAvailableInThisPlatform: RunnersByFolderType[];
};

const seedDay = Number(new Date().toLocaleString().split(',')[0].replace(/\//g, ''));

const SIZE_WIDTH_SIDEBAR = 12;

export const Games = ({ runnersByFolderAvailableInThisPlatform, gamesByPlatform }: LauncerItemProps) => {
  const [gameSelected, setGameSelected] = useState<GamesType | null>(null);
  const { userData } = useUserData();
  const { globalData } = useGlobalDataContext();
  const { filters, setFilters } = useFiltersContext();
  const [input, setInput] = useState('');
  const { debouncedValue, isLoading: isLoadingDebouncing } = useDebounce(onlyLettersAndNumbers(input));
  const [gamesFiltered, setGamesFiltered] = useState<GamesType[]>([]);
  const workerRef = useRef<Worker>(null);
  const [isLoading, setIsLoading] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const handler = async () => {
      setIsLoading(true);
      workerRef.current = callFilterWorker(
        gamesByPlatform,
        { ...filters, seedDay, searchTerm: debouncedValue },
        userData,
        (gameFiltered) => {
          setGamesFiltered(gameFiltered);
          setIsLoading(false);
          workerRef.current = null;
        },
        globalData.classics,
      );
    };

    handler();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [gamesByPlatform, filters, debouncedValue, globalData.games]);

  const { data:gamePaginated, hasMore, loadMore, resetPagination, remainItems } = usePagination(gamesFiltered);
  useEffect(() => {
    resetPagination();
  }, [debouncedValue]);

  const inLoading = isLoadingDebouncing || isLoading;

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gamesFiltered]);

  const targetRef = useInfinitScrollObserver({ callback: () => loadMore(), hasMoreItems: hasMore });

  return (
    <div className="relative" ref={cardRef}>
      <GamePlayer
        isOpen={!!gameSelected}
        game={gameSelected}
        onClose={() => setGameSelected(null)}
        runnersByFolderAvailableInThisPlatform={runnersByFolderAvailableInThisPlatform}
      />

      <div
        className="fixed top-0 right-0 z-20 bg-[#1a8594] shadow-lg border-b-2 border-black/20"
        style={{
          left: SIZE_SIDEBAR_IN_PX + SIZE_WIDTH_SIDEBAR,
        }}>
        <div className="flex items-center justify-center mt-4 mx-20 ">
          <div className="bg-backgroundButton rounded-3xl w-full relative group hover:bg-backgroundButtonHover">
            <input
              type="text"
              name="BARRA DE PESQUISA"
              id="BARRA DE PESQUISA"
              value={input}
              onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
              onChange={(event) => {
                setInput(event.target.value);
                handleKeyboardSound();
              }}
              placeholder="pinguins..."
              className="w-full px-6 py-2 select-none  bg-transparent text-xl focus:outline-none text-textNormal placeholder:text-gray-300"
            />

            {input ? (
              <div className="absolute right-0 top-0 bottom-0">
                <ButtonWithSound className="text-2xl h-full px-4" aria-label="fechar" onClick={() => setInput('')}>
                  <Icon.XCircle className="size-7" />
                </ButtonWithSound>
              </div>
            ) : undefined}
          </div>

          <div className="flex items-center justify-center pl-4">
            <SyncFiles />
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 select-none">
          <ButtonWithSound
            onClick={() => {
              resetPagination();
              setFilters((prev) => ({ ...prev, screen: 'home' }));
            }}
            className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 px-6 font-normal ${filters.screen === 'home' ? ' text-textHighlited font-bold border-textHighlited' : 'text-textNormal border-transparent'}`}>
            Inicio
          </ButtonWithSound>
          <ButtonWithSound
            onClick={() => {
              resetPagination();
              setFilters((prev) => ({ ...prev, screen: 'favorites' }));
            }}
            className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 px-6 font-normal ${filters.screen === 'favorites' ? ' text-textHighlited font-bold border-textHighlited' : 'text-textNormal border-transparent'}`}>
            Meus favoritos
          </ButtonWithSound>

          <ButtonWithSound
            onClick={() => {
              resetPagination();
              setFilters((prev) => ({ ...prev, screen: 'time-game' }));
            }}
            className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 px-6 font-normal ${filters.screen === 'time-game' ? ' text-textHighlited font-bold border-textHighlited' : 'text-textNormal border-transparent'}`}>
            Por Tempo de jogo
          </ButtonWithSound>
        </div>

        <div className="mt-4" />
      </div>

      <div
        className="fixed right-0 z-20  top-[126px] overflow-y-scroll px-4 vertical-scrollbar"
        style={{
          height: windowSize.height - 126,
          left: SIZE_SIDEBAR_IN_PX + SIZE_WIDTH_SIDEBAR,
          right: '0px',
        }}>
        <div>
          {!inLoading ? (
            <div key="data">
              <div>
                {filters.screen === 'favorites' || filters.screen === 'home' ? (
                  <GameList games={gamePaginated} setGameSelected={setGameSelected} key={filters.screen} />
                ) : (
                  <GameListPlayed key="time-played" games={gamePaginated} setGameSelected={setGameSelected} />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 lg:gap-x-4 xl:gap-x-8 2xl:gap-x-12 xl:grid-cols-5 2xl:grid-cols-6 gap-y-6 mt-6">
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] animate-pulse bg-backgroundButtonHover rounded-lg" />
            </div>
          )}

          <div className="mt-6" ref={targetRef}>
            {hasMore ? (
              <ButtonWithSound
                disabled={!hasMore}
                onClick={() => loadMore()}
                className="select-none w-full bg-backgroundButton text-textNormal mt-12 px-6 py-4 rounded-lg hover:bg-backgroundButtonHover transition-colors duration-75">
                Ver mais {remainItems} items
              </ButtonWithSound>
            ) : undefined}
          </div>
          <div className="min-h-[100px]" />
        </div>
      </div>
    </div>
  );
};
