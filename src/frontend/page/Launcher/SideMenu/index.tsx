import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { PATH_API_PLATFORMS_ASSETS_FOLDER } from '@/config/index';
import { SIZE_SIDEBAR_IN_PX } from '@/frontend/constants/sizes';
import { useFiltersContext } from '@/global/contexts/ContextFiltersProvider';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { tailwindMerge } from '@/libs/tailwindMerge';
import { resolveRelativePaths } from '@/utils/resolveRelativePaths';

export const SideMenu = () => {
  const { filters, setFilters } = useFiltersContext();
  const { globalData } = useGlobalDataContext();

  return (
    <div
      style={{
        maxWidth: SIZE_SIDEBAR_IN_PX,
        minWidth: SIZE_SIDEBAR_IN_PX,
      }}
      className="h-screen">
      <div className="flex flex-col mt-4">
        <ButtonWithSound
          key="all"
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              platform: null,
            }));
          }}
          className={tailwindMerge(
            'select-none hover:bg-backgroundButtonHover duration-75 text-base transition-all py-[6px] uppercase flex items-center gap-2  px-4 ',
            filters.platform === null ? 'bg-backgroundButtonHover text-textHighlited font-bold' : 'text-textNormal',
          )}>
          Todos
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
            className={`select-none hover:bg-backgroundButtonHover duration-75 transition-all py-[6px] uppercase flex items-center gap-2 px-4 ${filters.platform?.folder === platform.folder ? 'bg-backgroundButtonHover' : ''}`}>
            {platform.imageSrc ? (
              <img
                src={resolveRelativePaths(`${PATH_API_PLATFORMS_ASSETS_FOLDER}${platform.imageSrc}`)}
                alt=""
                draggable={false}
                className="w-[24px] object-container select-none"
              />
            ) : (
              <div className="text-textNormal flex items-center justify-center w-[24px] text-sm select-none">
                Sem imagens
              </div>
            )}
            <div
              className={`text-base whitespace-nowrap w-full overflow-hidden text-ellipsis text-left ${filters.platform?.folder === platform.folder ? 'text-textHighlited font-bold' : 'text-textNormal'}`}>
              {platform.name}
            </div>
          </ButtonWithSound>
        ))}
      </div>

      <div className="min-h-[100px]" />
    </div>
  );
};
