var path = require('path');
var webpack = require('webpack');

const targetPath = path.resolve(__dirname, 'public/');
const Plugins = {
  raw: require(path.join(__dirname, 'plugins', 'extract-raw-output.js')),
  spritesmith: require('webpack-spritesmith'),
  minifier: require(path.join(__dirname, 'plugins/ajax-minifier.js')),
  optipng: require(path.join(__dirname, 'plugins/opti-png.js')),
};

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = [
  {
    entry: {
      'index.js': path.resolve(__dirname, 'src/ts/index.ts')
    },
    mode: mode,
    output: {
      path: targetPath,
      filename: '[name]'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'ts-loader' },
            {
              loader: 'tslint-loader',
              options: {
                emitErrors: true,
                // failOnHint: true,
                formatter: 'verbose',
                configFile: '.tslint.json',
              }
            },
          ],
          exclude: /node_modules/,
        },
        { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: { name: '[name].[ext]?[hash]' } }
      ],
    },
    resolve: { extensions: ['.ts', '.js', '.tsx', '.json'] },
    externals: {
    },
    // performance: { hints: false },
    // devServer: { historyApiFallback: true, noInfo: true },
    // devtool: '#eval-source-map'
    plugins: [
      new Plugins.minifier({ map: true }),
    ]
  },
  {
    entry: {
      'index.css': path.resolve(__dirname, 'src/scss/index.scss')
    },
    mode: mode,
    output: {
      path: targetPath,
      filename: '[name]',
    },
    module: {
      rules: [{
        test: /\.s[ca]ss$/,
        use: [
          { loader: 'extract-raw-output-loader' },
          { loader: 'sass-loader' },
        ],
      }]
    },
    resolveLoader: { alias: { 'extract-raw-output-loader': path.join(__dirname, 'plugins/extract-raw-output-loader.js') } },
    plugins: [
      new Plugins.raw(),
      new Plugins.minifier(),
    ]
  },
  // {
  //   entry: {
  //     '.images': path.resolve(__dirname, 'src/icons/images')
  //   },
  //   output: {
  //     path: path.resolve(targetPath, '.ignore'),
  //     filename: '[name]'
  //   },
  //   mode, mode,
  //   plugins: [
  //     new Plugins.spritesmith({
  //       src: {
  //         cwd: path.resolve(__dirname, 'src/icons'),
  //         glob: '*.png'
  //       },
  //       target: {
  //         image: path.resolve(targetPath, 'icons.png'),
  //         css: path.resolve(__dirname, 'src/scss/_sprites.scss')
  //       },
  //       apiOptions: {
  //         cssImageRef: 'icons.png'
  //       },
  //       spritesmithOptions: {
  //         padding: 2
  //       }
  //     }),
  //     new Plugins.optipng()
  //   ]
  // },
];

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true, compress: { warnings: false } }),
    new webpack.LoaderOptionsPlugin({ minimize: true })
  ])
}
