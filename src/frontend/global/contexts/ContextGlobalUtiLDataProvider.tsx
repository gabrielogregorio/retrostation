import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { GlobalDataType } from '@/types/all';

const ContextGlobalData = createContext<{
  globalData: GlobalDataType;
  setUpdateGlobalData: React.Dispatch<React.SetStateAction<GlobalDataType>>;
}>({
  setUpdateGlobalData: () => {},
  globalData: {
    descriptions: [],
    games: [],
    platforms: [],
    runnersByFolder: [],
  },
});

type contextGlobalData = {
  children: ReactNode;
};

export const ContextGlobalDataProvider = ({ children }: contextGlobalData) => {
  const [globalData, setUpdateGlobalData] = useState<GlobalDataType>({
    descriptions: [],
    games: [],
    platforms: [],
    runnersByFolder: [],
  });

  useEffect(() => {
    window.electron.getGlobalData().then((data: GlobalDataType) => setUpdateGlobalData(data));

    const unsubscribe = window.electron.whenGameDataUpdated((updatedData) => {
      setUpdateGlobalData((prev) => ({
        ...prev,
        games: updatedData,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ setUpdateGlobalData, globalData }), [globalData]);

  return <ContextGlobalData value={value}>{children}</ContextGlobalData>;
};

export const useGlobalDataContext = () => useContext(ContextGlobalData);
