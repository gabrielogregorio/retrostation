import { filtersType } from '../../workers/frontend/filter';
import { ClassicsType, GamesType } from '@/types/all';
import { UserType } from '@/types/user';

export function callFilterWorker(
  gamesByPlatform: GamesType[],
  filters: filtersType,
  userData: UserType,
  callback: (data: GamesType[]) => void,
  classics: ClassicsType,
) {
  if (typeof Worker !== 'undefined') {
    // @ts-ignore
    const worker = new Worker(new URL('/static/workers/frontend/filter.js', import.meta.url), {
      type: 'classic',
    });

    worker.postMessage({
      gamesByPlatform,
      filters,
      userData,
      classicsNames: classics,
    });

    worker.onmessage = (event) => {
      callback(event.data);
      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error('Erro no Worker:', err);
      worker.terminate();
    };

    return worker;
  }

  console.error('Web Workers não são suportados neste ambiente.');
  return null;
}
