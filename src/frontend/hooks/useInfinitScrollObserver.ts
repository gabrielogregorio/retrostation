import { useEffect, useRef } from 'react';

type Props = {
  callback: () => void;
  hasMoreItems: boolean;
};

export function useInfinitScrollObserver({ callback, hasMoreItems }: Props) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMoreItems) {
      return () => {};
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callback, hasMoreItems]);

  return targetRef;
}
