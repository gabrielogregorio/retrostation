import { useUniqueGlobalConfigCronometer } from './hooks/useStateRunner';

export const GlobalConfig = () => {
  useUniqueGlobalConfigCronometer();

  return <div />;
};
