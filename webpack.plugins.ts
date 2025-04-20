import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  //   new BundleAnalyzerPlugin(),
];
