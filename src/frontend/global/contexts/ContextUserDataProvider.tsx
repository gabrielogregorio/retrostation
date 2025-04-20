import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { UserType } from '@/types/user';

type ContextUserDataType = {
  userData: UserType | null;
  setUserData: (userData: UserType) => void;
};

const ContextUserData = createContext<ContextUserDataType>({
  setUserData: null,
  userData: null,
});

type contextRunnerIsUserData = {
  children: ReactNode;
};

export const ContextUserDataProvider = ({ children }: contextRunnerIsUserData) => {
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    window.electron.getUserData().then((data: UserType) => setUserData(data));

    const unsubscribe = window.electron.whenUserDataUpdate((updatedData) => {
      setUserData(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ setUserData, userData }), [userData]);
  return <ContextUserData value={value}>{children}</ContextUserData>;
};

const useUserDataContext = () => useContext(ContextUserData);

export const useUserData = () => {
  const { userData } = useUserDataContext();

  const updateUserData = (newData: UserType) => {
    window.electron.updateUserData(newData);
  };

  return { userData, updateUserData };
};
