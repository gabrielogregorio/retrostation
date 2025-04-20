import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

const initialStaterunnerStatus = {
  isRunning: false,
  path: '',
};

type ContextRunningType = {
  runnerStatus: {
    isRunning: boolean;
    path: string;
  };
  setRunnerStatus: (newTheme: { isRunning: boolean; path: string }) => void;
};

const ContextrunnerStatus = createContext<ContextRunningType>({
  setRunnerStatus: () => {},
  runnerStatus: initialStaterunnerStatus,
});

type ContextStateRunnerProviderType = {
  children: ReactNode;
};

export const ContextStateRunnerProvider = ({ children }: ContextStateRunnerProviderType) => {
  const [runnerStatus, setRunnerStatus] = useState<ContextRunningType['runnerStatus']>(initialStaterunnerStatus);

  const value = useMemo(() => ({ setRunnerStatus, runnerStatus }), [runnerStatus]);
  return <ContextrunnerStatus.Provider value={value}>{children}</ContextrunnerStatus.Provider>;
};

export const useStateRunnerContext = () => useContext(ContextrunnerStatus);
