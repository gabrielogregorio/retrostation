import { parentPort } from 'worker_threads';
import { runScrapper } from '@/scrapper/index';

try {
  const games = runScrapper();
  parentPort?.postMessage({ type: 'done', games });
} catch (err) {
  parentPort?.postMessage({ type: 'error', error: err.message });
}
