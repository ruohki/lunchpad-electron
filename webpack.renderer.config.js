const webpack = require("webpack");
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
  loader: 'url-loader'
})

rules.push({
  test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  exclude: /images/,  /* dont want svg images from image folder to be included */
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'fonts/',
        name: '[name][hash].[ext]',
      },
    },
  ],
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  /* plugins: [
    new webpack.ExternalsPlugin('commonjs', [
        'electron'
    ])
  ] */
};