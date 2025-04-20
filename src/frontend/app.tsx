import { useState } from 'react';
import { GlobalConfig } from './global/GlobalConfig';
import { Launcher } from './page/Launcher';

export const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="top-0 left-0 right-0 bottom-0">
      <div className="z-[20] !backdrop-blur-3xl shadow-lg rounded-lg overflow-hidden scroll-smooth relative flex items-center justify-center h-screen">
        <GlobalConfig />

        {!isLoaded ? <div className="justify-center text-3xl select-none" key="loading" /> : undefined}

        <Launcher
          isLoaded={() => {
            setIsLoaded(true);
          }}
        />
      </div>
    </div>
  );
};
