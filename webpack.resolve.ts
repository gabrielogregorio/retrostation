import type { Configuration } from 'webpack';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const resolve: Configuration['resolve'] = {
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  plugins: [
    new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname, 'tsconfig.json'),
    }),
  ],
};
