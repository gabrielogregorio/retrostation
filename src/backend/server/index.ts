import path from 'path';
import express from 'express';
import { PATH_ASSETS_FOLDER, DIR_STATIC_FILES } from '@/config/index';
import { getLocalRunNode } from '@/backend/utils';

export const startStaticFilesServer = ({ port, serverIsStarted }: { port: number; serverIsStarted: () => void }) => {
  const server = express();

  const publicPath = path.join(getLocalRunNode(), PATH_ASSETS_FOLDER);
  const staticPath = path.join(getLocalRunNode(), DIR_STATIC_FILES);
  console.log('SERVER: PUBLIC PATH', publicPath);
  console.log('SERVER: STATIC PATH', publicPath);

  server.use('/assets', express.static(publicPath));
  server.use('/static', express.static(staticPath));

  server.listen(port, () => {
    serverIsStarted();
    console.log(`SERVER: Running in http://localhost:${port}`);
  });
};
