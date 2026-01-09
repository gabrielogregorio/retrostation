import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';



type ContextInLoadingReturnType = {
  inLoading: boolean, updateLoadingState: (newValue: boolean) => void
};

const ContextInLoadingStatus = createContext<ContextInLoadingReturnType>({
  updateLoadingState: () => { },
  inLoading: true,
});

type ContextInLoadingProviderType = {
  children: ReactNode;
};


export const ContextInLoadingProvider = ({ children }: ContextInLoadingProviderType) => {
  const [inLoading, setInLoading] = useState<boolean>(true);


  const updateLoadingState = useCallback((newValue: boolean) => {
    setInLoading(newValue)
  }, [setInLoading])

  const value = useMemo(() => ({ inLoading, updateLoadingState }), [inLoading, updateLoadingState]);
  return <ContextInLoadingStatus.Provider value={value}>{children}</ContextInLoadingStatus.Provider>;
};

export const useInLoadingContext = () => useContext(ContextInLoadingStatus);
