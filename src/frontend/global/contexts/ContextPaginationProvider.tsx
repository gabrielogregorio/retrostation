import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { GamesType } from '@/types/all';
import { PAGE_SIZE_GAMES_LIST } from '@/config/index';

const INITIAL_PAGE = 1;


type ContextPaginationReturnType = {
  paginatedData: GamesType[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  remainItems: number;
  gameFilteredLocal: GamesType[],
  updateGameFilteredLocal: (newGames: GamesType[]) => void;
  loadMore: () => void;
  resetPagination: () => void;
};

const ContextPaginationStatus = createContext<ContextPaginationReturnType>({
  updateGameFilteredLocal: () => { },
  loadMore: () => { },
  resetPagination: () => { },
  gameFilteredLocal: [],
  paginatedData: [],
  totalItems: 0,
  currentPage: 0,
  totalPages: 0,
  hasMore: false,
  remainItems: 0
});

export const ContextPaginationProvider = ({ children }: { children: ReactNode }) => {
  const [gameFilteredLocal, setGameFilteredLocal] = useState<GamesType[]>([]);
  const [currentPage, setPage] = useState(INITIAL_PAGE);
  const totalItems = gameFilteredLocal.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE_GAMES_LIST);
  const hasMore = currentPage < totalPages;
  const remainItems = totalItems - currentPage * PAGE_SIZE_GAMES_LIST;

  const paginatedData = useMemo(
    () => gameFilteredLocal.slice(0, currentPage * PAGE_SIZE_GAMES_LIST),
    [gameFilteredLocal, currentPage, PAGE_SIZE_GAMES_LIST],
  );

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, setPage])

  const resetPagination = useCallback(() => {
    setPage(INITIAL_PAGE);
  }, [setPage])

  const updateGameFilteredLocal = useCallback((newGames: GamesType[]) => {
    setGameFilteredLocal(newGames);
  }, [setGameFilteredLocal])


  const value = useMemo(() => ({
    paginatedData,
    totalItems,
    currentPage,
    totalPages,
    gameFilteredLocal,
    hasMore,
    updateGameFilteredLocal,
    remainItems,
    loadMore,
    resetPagination,


  }), [paginatedData,
    totalItems,
    currentPage,
    totalPages,
    hasMore,
    gameFilteredLocal,
    updateGameFilteredLocal,
    remainItems,
    loadMore,
    resetPagination,]);
  return <ContextPaginationStatus.Provider value={value}>{children}</ContextPaginationStatus.Provider>;
};

export const usePaginationContext = () => useContext(ContextPaginationStatus);












