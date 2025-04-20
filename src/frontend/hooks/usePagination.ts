import { useState, useMemo } from 'react';
import { GamesType } from '@/types/all';
import { PAGE_SIZE_GAMES_LIST } from '@/config/index';

const INITIAL_PAGE = 1;

export const usePagination = (data: GamesType[] = []) => {
  const [page, setPage] = useState(INITIAL_PAGE);
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE_GAMES_LIST);
  const hasMore = page < totalPages;
  const remainItems = totalItems - page * PAGE_SIZE_GAMES_LIST;

  const paginatedData = useMemo(() => data.slice(0, page * PAGE_SIZE_GAMES_LIST), [data, page, PAGE_SIZE_GAMES_LIST]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const resetPagination = () => {
    setPage(INITIAL_PAGE);
  };

  return {
    data: paginatedData,
    totalItems,
    currentPage: page,
    totalPages,
    hasMore,
    remainItems,
    loadMore,
    resetPagination,
  };
};
