import { useEffect, useState } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { Icon } from '@/icons/index';

const runScrapperAsync = async () => {
  console.log('FRONTEND: CALL SCRAPPER ');

  return new Promise((resolve) => {
    const value = window.electron.runScrapper();
    resolve(value);
  });
};

export const SyncFiles = () => {
  const [scrapperResult, setScrapperResult] = useState({
    inScrapping: false,
    scrapperFinished: false,
    errorOnScrapping: false,
  });

  const handleRunScrapper = () => {
    setScrapperResult(() => ({
      errorOnScrapping: false,
      scrapperFinished: false,
      inScrapping: true,
    }));

    runScrapperAsync()
      .then((res) => res)
      .catch();
  };

  useEffect(() => {
    const unsubscribe = window.electron.whenRunScrapperRespond((result) => {
      if (result.success) {
        setScrapperResult(() => ({
          errorOnScrapping: false,
          scrapperFinished: true,
          inScrapping: false,
        }));

        return;
      }

      setScrapperResult(() => ({
        errorOnScrapping: true,
        scrapperFinished: true,
        inScrapping: false,
      }));

    });

    return () => unsubscribe();
  }, []);

  return (

    <ButtonWithSound
      type="button"
      title='Atualizar biblioteca'
      onClick={() => handleRunScrapper()}
      className="group  hover:bg-backgroundButtonHover py-2  w-[60px] flex items-center justify-center">
      <Icon.Refresh
        className={`group-hover:stroke-textHighlited transition-all text-size5 ${scrapperResult.inScrapping ? 'animate-spin' : ''}`}
      />
    </ButtonWithSound>

  );
};
