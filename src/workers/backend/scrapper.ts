import { parentPort } from 'worker_threads';
import { runScrapper } from '@/scrapper/index';

runScrapper()
  .then((games) => {
    parentPort.postMessage({ type: 'done', games });
  })
  .catch((err) => {
    parentPort.postMessage({ type: 'error', data: err.message });
  });
