const path = require('path')
module.exports = [
  
  // Add support for native node modules
  {
    test: /\.node$/,
    loader: 'awesome-node-loader',
    options: {
      rewritePath: path.resolve(__dirname, '.webpack/main/native_modules/build/release'),
      useDirname: false
    }
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.js$/,
    exclude: /(node_modules|.webpack)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [
          'transform-class-properties',
          ['wildcard', {
            'exts': ["json", "js", "es6", "es", "jsx", "javascript"]
          }]
        ]
      }
    }
  },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];
