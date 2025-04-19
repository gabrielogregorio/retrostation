import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { resolve } from './webpack.resolve';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  mode: 'production',
  devtool: false,
  plugins,
  resolve,
};
