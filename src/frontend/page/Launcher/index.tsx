import { useEffect, useMemo, useState } from 'react';
import { PlatformReturnOsVersionType } from '@/backend/getVBersion';
import { useGlobalDataContext } from '@/global/contexts/ContextGlobalUtiLDataProvider';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Games } from '@/page/Launcher/Games';
import { SideMenu } from '@/page/Launcher/SideMenu';

export const Launcher = ({ isLoaded }: { isLoaded: () => void }) => {
  const [myPlatform, setMyPlatform] = useState<PlatformReturnOsVersionType | null>(null);

  const { globalData } = useGlobalDataContext();
  const size = useWindowSize();

  useEffect(() => {
    const handleGetOs = () => {
      window.electron.getPlatformInfo().then((data: PlatformReturnOsVersionType) => setMyPlatform(data));
    };

    handleGetOs();
  }, []);

  const runnersByFolderAvailableInThisPlatform = useMemo(
    () =>
      globalData.runnersByFolder.filter(
        (runnerFolder) => myPlatform && runnerFolder.runners.find((runner) => runner.platform === myPlatform.platform),
      ),
    [myPlatform],
  );

  const gamesByPlatform = useMemo(() => {
    if (!myPlatform?.platform || runnersByFolderAvailableInThisPlatform.length === 0) {
      return [];
    }

    isLoaded();

    return globalData.games.filter((game) =>
      runnersByFolderAvailableInThisPlatform.find((runnerByFolder) => game.folder === runnerByFolder.folder),
    );
  }, [runnersByFolderAvailableInThisPlatform, myPlatform]);

  return (
    <div className="min-w-screen min-h-screen min-w-[100vw] max-w-[100vw] flex items-center justify-center font-sans scroll-smooth overflow-hidden">
      <div className="overflow-y-scroll scroll-smooth vertical-scrollbar" style={{ maxHeight: size.height }}>
        <SideMenu />
      </div>

      <div
        className="w-full flex-1 px-4 overflow-y-scroll scroll-smooth vertical-scrollbar"
        style={{ maxHeight: size.height }}>
        <Games
          gamesByPlatform={gamesByPlatform}
          runnersByFolderAvailableInThisPlatform={runnersByFolderAvailableInThisPlatform}
        />
      </div>
    </div>
  );
};
