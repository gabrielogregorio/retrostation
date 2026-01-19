import { useEffect, useRef, useState } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { tailwindMerge } from '@/libs/tailwindMerge';
import { handleClickSound, handleHoverSound, handleKeyboardSound } from '@/components/organisms/ButtonSound/sound';
import { SyncFiles } from '@/components/organisms/SyncFiles';
import { callFilterWorker } from '@/frontend/workers/callFilterWorker';
import { useDebounce } from '@/hooks/useDebounce';
import { Icon } from '@/icons/index';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';
import { useInLoadingContext } from '@/global/contexts/ContextInLoadingProvider';
import { usePaginationContext } from '@/global/contexts/ContextPaginationProvider';
import { GamesType } from '@/types/all';

const IconArrow = ({ className = '' }: { className?: string }) => <svg
  className={tailwindMerge(className)}
  stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>

const seedDay = Number(new Date().toLocaleString().split(',')[0].replace(/\//g, ''));

export const SearchComponent = ({ gamesByPlatform }: { gamesByPlatform: GamesType[] }) => {
  const { filters, setFilters } = useFiltersContext();
  const { globalData } = useGlobalDataContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { userData } = useUserData();
  const [input, setInput] = useState('');
  const { debouncedValue, isLoading: isLoadingDebouncing } = useDebounce(onlyLettersAndNumbers(input));
  const [gamesFiltered, setGamesFiltered] = useState<GamesType[]>([]);
  const workerRef = useRef<Worker>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' });
  };

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
        }
      );
    };

    handler();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [gamesByPlatform, filters, debouncedValue, globalData.games]);


  const { resetPagination, updateGameFilteredLocal } = usePaginationContext();
  useEffect(() => {
    updateGameFilteredLocal(gamesFiltered)
  }, [gamesFiltered])



  useEffect(() => {
    resetPagination();
  }, [debouncedValue]);


  const { updateLoadingState } = useInLoadingContext();

  useEffect(() => {
    updateLoadingState(isLoadingDebouncing || isLoading)
  }, [isLoadingDebouncing, isLoading])


  return (

    <div>

      <div
        className="fixed top-0 left-0 right-0 z-20 shadow-lg border-b-2 border-black/20">
        <div className='flex min-h-[80px]' >
          <ButtonWithSound onClick={scrollLeft} className='min-w-[64px] flex items-center justify-center '>
            <IconArrow className='text-size6 fill-white ' />
          </ButtonWithSound>

          <div ref={scrollRef} className='flex flex-row w-full items-center  overflow-x-scroll scroll-smooth horizontal-hidden-scrollbar'
            style={{ maxWidth: 'calc(100vw - 64px - 64px)' }}
          >
            <ButtonWithSound
              key="all"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  platform: null,
                }));
              }}
              className={`select-none hover:bg-backgroundButtonHover  h-[80px] inline-block w-full duration-75 transition-all py-[8px] uppercase px-4 ${filters.platform === null ? 'bg-backgroundButtonHover' : ''}`}>
              <div
                className={`text-size4 whitespace-nowrap w-full text-ellipsis text-left ${filters.platform === null ? 'text-textHighlited' : ''}`}>
                TODOS
              </div>

            </ButtonWithSound>

            {globalData.platforms.map((platform) => (
              <ButtonWithSound
                key={platform.name}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    platform,
                  }));
                }}
                className={`select-none hover:bg-backgroundButtonHover  h-[80px] inline-block w-full duration-75 transition-all py-[8px] uppercase px-4 ${filters.platform?.folder === platform.folder ? 'bg-backgroundButtonHover' : ''}`}>
                <div
                  className={`text-size4 whitespace-nowrap w-full text-ellipsis text-left ${filters.platform?.folder === platform.folder ? 'text-textHighlited' : ''}`}>
                  {platform.name}
                </div>

              </ButtonWithSound>
            ))}
          </div>

          <ButtonWithSound onClick={scrollRight} className='min-w-[64px] flex items-center justify-center '>
            <IconArrow className='text-size6 fill-white rotate-180' />
          </ButtonWithSound>
        </div>

        {/* search */}
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
              className="w-full px-6 py-2 select-none  bg-transparent text-size4 focus:outline-none placeholder:text-gray-300"
            />

            {input ? (
              <div className="absolute right-0 top-0 bottom-0">
                <ButtonWithSound className="text-size5 h-full px-4" aria-label="fechar" onClick={() => setInput('')}>
                  <Icon.XCircle className="size-7" />
                </ButtonWithSound>
              </div>
            ) : undefined}
          </div>

          <div className="flex items-center justify-center pl-4">
            <SyncFiles />

            <ButtonWithSound
              onClick={() => {
                if (filters.screen === 'favorites') {
                  resetPagination();
                  setFilters((prev) => ({ ...prev, screen: 'home' }));
                } else {

                  resetPagination();
                  setFilters((prev) => ({ ...prev, screen: 'favorites' }));
                }
              }}
              name='favoritos'
              className={`cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 px-6  text-size5 font-semibold ${filters.screen === 'favorites' ? ' text-textHighlited border-textHighlited' : 'border-transparent'}`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" /><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" /></svg>


            </ButtonWithSound>

            <ButtonWithSound
              onClick={() => {
                if (filters.screen === 'time-game') {
                  resetPagination();
                  setFilters((prev) => ({ ...prev, screen: 'home' }));
                } else {

                  resetPagination();
                  setFilters((prev) => ({ ...prev, screen: 'time-game' }));
                }
              }}
              name='por-tempo-de-jogo'
              className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 px-6  text-size5 font-semibold ${filters.screen === 'time-game' ? ' text-textHighlited border-textHighlited' : 'border-transparent'}`}>

              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" /><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            </ButtonWithSound>
          </div>
        </div>

        <div className="mt-4" />
        <div className='flex items-center justify-center mt-2 px-6 py-2 text-size4'>
          Resultados {gamesFiltered.length}
        </div>
      </div>
    </div>
  );
};
