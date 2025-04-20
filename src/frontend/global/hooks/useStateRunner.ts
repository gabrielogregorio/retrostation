import { useEffect, useRef } from 'react';
import { useStateRunnerContext } from '@/global/contexts/ContextStateRunnerProvider';
import { useStopwatch } from '@/hooks/useCronometer';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';

export const useUniqueGlobalConfigCronometer = () => {
  const { setRunnerStatus, runnerStatus } = useStateRunnerContext();
  const { userData, updateUserData } = useUserData();
  const userDataRef = useRef(userData);

  const timer = useStopwatch();
  const userTimerRef = useRef(timer);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  useEffect(() => {
    userTimerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    const unsubscribeStop = window.electron.whenRunnerStop(() => {
      const gameByIndex = userDataRef.current.playHistory.findIndex((game) => game.path === runnerStatus.path);
      if (gameByIndex === -1) {
        setRunnerStatus({
          isRunning: false,
          path: '',
        });

        return;
      }

      const gamesUpdated = [...userDataRef.current.playHistory];
      gamesUpdated[gameByIndex].elapsedSeconds += userTimerRef.current.elapsedSeconds;
      userTimerRef.current.reset();

      updateUserData({
        ...userDataRef.current,
        playHistory: gamesUpdated,
      });

      setRunnerStatus({
        isRunning: false,
        path: '',
      });
    });

    const unsubscribeStart = window.electron.whenRunnerStart(({ path }) => {
      userTimerRef.current.reset();
      userTimerRef.current.start();

      setRunnerStatus({
        isRunning: true,
        path,
      });
    });

    return () => {
      unsubscribeStop();
      unsubscribeStart();
    };
  }, []);
};

export const useGetStateRunner = () => {
  const { runnerStatus } = useStateRunnerContext();

  return {
    runnerStatus,
  };
};
