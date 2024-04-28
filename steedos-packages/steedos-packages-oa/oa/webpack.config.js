/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-27 12:51:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-27 14:56:51
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/oa/webpack.config.js
 * @Description: 
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// default WEBPACK_BUNDLE to development
const WEBPACK_BUNDLE = process.env.WEBPACK_BUNDLE || "development";

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',    
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    }),
  ],
  optimization: {
    minimize: true
  },
};