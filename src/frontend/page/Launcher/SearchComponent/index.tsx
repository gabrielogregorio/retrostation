import { useEffect, useMemo, useRef, useState } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { handleClickSound, handleKeyboardSound } from '@/components/organisms/ButtonSound/sound';
import { SyncFiles } from '@/components/organisms/SyncFiles';
import { callFilterWorker } from '@/frontend/workers/callFilterWorker';
import { useDebounce } from '@/hooks/useDebounce';
import { Icon } from '@/icons/index';
import { onlyLettersAndNumbers } from '@/scrapper/utilsv2';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';
import { useInLoadingContext } from '@/global/contexts/ContextInLoadingProvider';
import { usePaginationContext } from '@/global/contexts/ContextPaginationProvider';
import { GamesType } from '@/types/all';
import { PlataformList } from '@/page/Launcher/PlataformList';
import { Modal } from '@/components/molecules/Modal';
import { FILE_PATH_DESCRIPTIONS, FILE_PATH_GAMES, FILE_PATH_PLATFORMS, FILE_PATH_RUNNER_BY_FOLDER, FILE_PATH_USER, PATH_CONTENT_GAMES_FOLDER, PATH_CONTENT_RUNNERS_FOLDER, PATH_GAME_ASSETS_FOLDER, PATH_PLATFORM_ASSETS_FOLDER } from '@/config/index';


const seedDay = Number(new Date().toLocaleString().split(',')[0].replace(/\//g, ''));

export const SearchComponent = ({ gamesByPlatform }: { gamesByPlatform: GamesType[] }) => {
  const { filters, setFilters } = useFiltersContext();
  const { globalData } = useGlobalDataContext();
  const { userData } = useUserData();
  const [input, setInput] = useState('');
  const { debouncedValue, isLoading: isLoadingDebouncing } = useDebounce(onlyLettersAndNumbers(input));
  const [gamesFiltered, setGamesFiltered] = useState<GamesType[]>([]);
  const workerRef = useRef<Worker>(null);
  const [isLoading, setIsLoading] = useState(false);


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

  const [devOptionsIsOpened, setDevOptionsIsOppened] = useState<boolean>(false)
  const gamesWithoutImages = useMemo(() => gamesFiltered.filter((game) => !game.image).map((game) => game.name), [gamesFiltered])
  
  return (

    <div>
      <Modal.Root isOpen={devOptionsIsOpened} onClose={() => setDevOptionsIsOppened(false)}>
        <Modal.Content>
          <Modal.DialogPanel className='flex flex-col  px-8 py-5'>
            <Modal.DialogTitle className='text-center text-2xl'>Opções Rápidas</Modal.DialogTitle>
            <hr />
            <ButtonWithSound onClick={() => window.electron.openFolder(PATH_GAME_ASSETS_FOLDER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Galery />    Abrir Game Assets
            </ButtonWithSound>


            <ButtonWithSound onClick={() => window.electron.openFolder(PATH_PLATFORM_ASSETS_FOLDER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Galery />     Abrir Plataforms Assets
            </ButtonWithSound>

            <hr />
            <ButtonWithSound onClick={() => window.electron.openFolder(FILE_PATH_PLATFORMS)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Json /> Abrir plataforms.json
            </ButtonWithSound>

            <ButtonWithSound onClick={() => window.electron.openFolder(FILE_PATH_DESCRIPTIONS)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Json />    Abrir descriptions.json
            </ButtonWithSound>

            <ButtonWithSound onClick={() => window.electron.openFolder(FILE_PATH_RUNNER_BY_FOLDER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Json />     Abrir runnersByFolder.json
            </ButtonWithSound>

            <ButtonWithSound onClick={() => window.electron.openFolder(FILE_PATH_USER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Json />      Abrir user.json
            </ButtonWithSound>



            <ButtonWithSound onClick={() => window.electron.openFolder(FILE_PATH_GAMES)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent' >
              <Icon.Json />     Abrir cache de games, games.json
            </ButtonWithSound>


            <hr />
            <ButtonWithSound onClick={() => window.electron.openFolder(PATH_CONTENT_GAMES_FOLDER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Game />      Abrir pasta de jogos
            </ButtonWithSound>

            <ButtonWithSound onClick={() => window.electron.openFolder(PATH_CONTENT_RUNNERS_FOLDER)} className='flex items-center justify-start gap-2 !mt-0 py-2 text-size3 border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 px-2 font-semibold border-transparent'>
              <Icon.Emulator />        Abrir pasta de emuladores
            </ButtonWithSound>

            <div className='flex flex-col'>
              <div>
                Games sem Imagem desse filtro {gamesWithoutImages.length}
              </div>

              <textarea name="" id="" rows={10} className='bg-transparent text-white border-2 border-white/25 rounded-lg vertical-scrollbar' value={gamesWithoutImages.join('\n')} />
            </div>
          </Modal.DialogPanel>
        </Modal.Content>
      </Modal.Root>

      <div
        className="fixed top-0 left-0 right-0 z-50 shadow-md border-b backdrop-blur-lg border-[#494e59] bg-black/20">

        <PlataformList />


        {/* search */}
        <div className="flex items-center justify-center mt-[12px] pl-[48px]">
          <div className="bg-none rounded-3xl w-full relative group">
            <input
              type="text"
              name="BARRA DE PESQUISA"
              id="BARRA DE PESQUISA"
              value={input}
              // onMouseEnter={handleHoverSound}
              onClick={handleClickSound}
              onChange={(event) => {
                setInput(event.target.value);
                handleKeyboardSound();
              }}
              placeholder="Pesquisar..."
              className="w-full px-4 py-2 select-none  bg-transparent text-size4 focus:outline-none placeholder:text-gray-500 text-gray-200"
            />

            {input ? (
              <div className="absolute right-0 top-0 bottom-0">
                <ButtonWithSound className="text-size5 h-full px-4" aria-label="fechar" onClick={() => setInput('')}>
                  <Icon.XCircle className="size-7" />
                </ButtonWithSound>
              </div>
            ) : undefined}
          </div>

          <div className="flex items-center justify-center pl-4 pr-8">
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
              className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2  w-[60px] flex items-center justify-center text-size5 font-semibold ${filters.screen === 'favorites' ? ' text-textHighlited border-textHighlited' : 'border-transparent'}`}>

              {filters.screen === 'favorites' ? (
                <Icon.Star className="fill-yellow-400 stroke-white/20" />
              ) : (
                <Icon.Star className="stroke-current" />
              )}

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
              className={`border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2  w-[60px] flex items-center justify-center text-size5 font-semibold ${filters.screen === 'time-game' ? ' text-textHighlited border-textHighlited' : 'border-transparent'}`}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="23px" width="23px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" /><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
            </ButtonWithSound>

            <ButtonWithSound
              onClick={() => setDevOptionsIsOppened(true)}
              name='dev'
              className="border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 py-2 w-[60px] flex items-center justify-center text-size5 font-semibold border-transparent">
              <Icon.Config className='group-hover:stroke-textHighlited transition-all text-size5' />
            </ButtonWithSound>
          </div>
        </div>



        {/* <div className="mt-4" /> */}
        <div className='flex items-center justify-center px-6 py-2 text-size4 select-none'>
          {filters.platform?.folder ? (
            <div className='flex items-center justify-center'>
              <div className='min-h-[38.5px]'>
                {gamesFiltered.length} resultados nas pastas
              </div>
              <div className='pl-4 flex'>
                {filters.platform?.folder?.map((folder) => <ButtonWithSound

                  className='flex gap-2 px-2 py-1 items-center justify-center border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 text-size3 font-semibold border-transparent'
                  onClick={() => window.electron.openFolder(`${PATH_CONTENT_GAMES_FOLDER}/${folder}`)} key={folder[0]}>
                  <div>
                    <Icon.Folder />
                  </div>
                  <div>
                    {folder}
                  </div>
                </ButtonWithSound>)}
              </div>
            </div>
          ) : <div className='px-2 py-1 min-h-[38.5px]'>Resultados {gamesFiltered.length}</div>}
        </div>
      </div>
    </div>
  );
};
