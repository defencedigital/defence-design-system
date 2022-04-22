const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')

const commonConfig = require('./common')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // This option is really slow, and the benefit is negligible
            collapse_vars: false,
          },
        },
      }),
    ],
  },
})
