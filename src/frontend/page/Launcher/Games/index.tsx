import { useEffect, useRef, useState } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { GamePlayer } from '@/components/organisms/GamePlayer';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { GameList } from '@/page/Launcher/Games/GameList';
import { GameListPlayed } from '@/page/Launcher/Games/GameListPlayed';
import { GamesType, RunnersByFolderType } from '@/types/all';
import { useInfinitScrollObserver } from '@/hooks/useInfinitScrollObserver';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useInLoadingContext } from '@/global/contexts/ContextInLoadingProvider';
import { usePaginationContext } from '@/global/contexts/ContextPaginationProvider';

type LauncerItemProps = {
  runnersByFolderAvailableInThisPlatform: RunnersByFolderType[];
};

export const Games = ({ runnersByFolderAvailableInThisPlatform }: LauncerItemProps) => {
  const [gameSelected, setGameSelected] = useState<GamesType | null>(null);
  const { filters } = useFiltersContext();
  const windowSize = useWindowSize();
  const { paginatedData, hasMore, loadMore, remainItems, gameFilteredLocal } = usePaginationContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const targetRef = useInfinitScrollObserver({ callback: () => loadMore(), hasMoreItems: hasMore });
  const { inLoading } = useInLoadingContext()

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameFilteredLocal]);

  return (
    <div className="relative" ref={cardRef}>

      <GamePlayer
        isOpen={!!gameSelected}
        game={gameSelected}
        onClose={() => setGameSelected(null)}
        runnersByFolderAvailableInThisPlatform={runnersByFolderAvailableInThisPlatform}
      />

      <div
        className="fixed right-0 z-20 left-0  top-[209px] overflow-y-scroll px-4 vertical-scrollbar"
        style={{
          height: windowSize.height - 209,
          right: '0px',
        }}>
        <div>
          {!inLoading ? (
            <div key="data">
              <div>
                {filters.screen === 'favorites' || filters.screen === 'home' ? (
                  <GameList games={paginatedData} setGameSelected={setGameSelected} key={filters.screen} />
                ) : (
                  <GameListPlayed key="time-played" games={paginatedData} setGameSelected={setGameSelected} />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-x-4 xl:gap-x-8 2xl:gap-x-10 xl:grid-cols-5 2xl:grid-cols-6 gap-y-6 mt-6">
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px] animate-pulse bg-backgroundButtonHover rounded-lg" />
              <div className="min-h-[350px] min-w-[50px]  animate-pulse bg-backgroundButtonHover rounded-lg" />
            </div>
          )}

          <div className="mt-6" ref={targetRef}>
            {hasMore ? (
              <ButtonWithSound
                disabled={!hasMore}
                onClick={() => loadMore()}
                className="select-none w-full bg-backgroundButton mt-12 px-6 py-4 rounded-lg hover:bg-backgroundButtonHover transition-colors duration-75">
                Ver mais {remainItems} items
              </ButtonWithSound>
            ) : undefined}
          </div>
          <div className="min-h-[100px]" />
        </div>
      </div>
    </div >
  );
};
