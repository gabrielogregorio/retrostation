import { useRef } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { tailwindMerge } from '@/libs/tailwindMerge';


const IconArrow = ({ className = '' }: { className?: string }) => <svg
  className={tailwindMerge(className)}
  stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>

export const PlataformList = () => {
  const { filters, setFilters } = useFiltersContext();
  const { globalData } = useGlobalDataContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: 'smooth' });
  };


  return (
    <div className='flex min-h-[80px]' key="parts">
      <ButtonWithSound onClick={scrollLeft} className='min-w-[64px] flex items-center justify-center '>
        <IconArrow className='text-size6 fill-white ' />
      </ButtonWithSound>

      <div ref={scrollRef} className='flex flex-row w-full items-center  overflow-x-scroll scroll-smooth horizontal-hidden-scrollbar'
        style={{ maxWidth: 'calc(100vw - 64px - 64px)' }}
      >


        {globalData.platforms.length ? (


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
        ) : undefined}

        {globalData.platforms.map((platform) => (
          <ButtonWithSound
            key={platform.name}
            title={platform.folder.join('  |  ')}
            // data-nodo={`data-nodo-${platform.name}`}

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



  );
};
