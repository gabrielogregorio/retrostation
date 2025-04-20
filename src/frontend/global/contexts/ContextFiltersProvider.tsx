import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { PlatformsType } from '@/types/all';

type FilterType = {
  screen: 'home' | 'favorites' | 'time-game';
  platform: PlatformsType | null;
  classicsToTop: boolean;
};

type ContextType = {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
};

const initialStateFilters: ContextType = {
  setFilters: () => {},
  filters: {
    platform: null,
    classicsToTop: true,
    screen: 'home',
  },
};

const ContextFilters = createContext<ContextType>(initialStateFilters);

type ContextFiltersProviderType = {
  children: ReactNode;
};

export const ContextFiltersProvider = ({ children }: ContextFiltersProviderType) => {
  const [filters, setFilters] = useState<FilterType>({
    screen: 'home',
    platform: null,
    classicsToTop: true,
  });

  const value = useMemo(() => ({ setFilters, filters }), [setFilters, filters]);

  return <ContextFilters.Provider value={value}>{children}</ContextFilters.Provider>;
};

export const useFiltersContext = () => useContext(ContextFilters);
