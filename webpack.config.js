const HTML_MINITY = true,
      DIST_DIR = './docs',
      SRC_DIR = './src',
      path = require('path'),
      glob = require('glob'),
      DIST_PATH = path.resolve(__dirname, DIST_DIR),
      SRC_PATH = path.resolve(__dirname, SRC_DIR),
      RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts'),
      BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
      ssi = require('./node_modules/browsersync-ssi'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      TerserPlugin = require('terser-webpack-plugin'),
      config = {
        entry: {},
        plugins: [],
      };
  
module.exports = (env, argv) => {
  
  const minify = 'production' === argv.mode;
  
  //JS
  glob.sync('**/*.js', {
    cwd: SRC_DIR,
    ignore: '**/_*.js'
  }).forEach(key => {
    console.log('JS : ', key);
    config.entry[key.replace('.js', '')] = path.resolve(SRC_DIR, key);
  });
  
  //EJS
  glob.sync('**/*.ejs', {
    cwd: SRC_DIR,
    ignore: '**/_*.ejs'
  }).forEach(key => {
    const baseName = path.basename(key, '.ejs'),
          htmlKey = key.replace('.ejs', '.html'),
          jsKey   = key.replace('.ejs', '.js'),
          srcPath  = path.resolve(SRC_DIR, key);
    console.log('EJS : ', key, htmlKey);
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: srcPath,
        filename: htmlKey,
        inject: false,
        minify: minify && HTML_MINITY,
      })
    );
  });
  
  //SCSS
  glob.sync('**/*.scss', {
    cwd: SRC_DIR,
    ignore: '**/_*.scss',
  }).forEach(key => {
    const cssKey = key.replace('.scss', '.css');
    console.log('CSS : ', key, cssKey);
    config.entry[cssKey] = path.resolve(SRC_DIR, key);
  });
  
  //pluginsを統合
  config.plugins.push(
    new BrowserSyncPlugin({
      //https: true,
      host: 'localhost',
      port: 3000,
      server: { baseDir: [DIST_DIR] },
      //startPath: '/hoge',
      files: [
        DIST_DIR + '/**/*.html',
        DIST_DIR + '/**/*.css',
        DIST_DIR + '/**/*.js',
        DIST_DIR + '/**/*.json'
      ],
      'middleware': ssi({
        baseDir: DIST_DIR,
        ext: '.html',
        version: '1.4.0'
      })
    }),
    new MiniCssExtractPlugin({
      filename: '[name]',
    }),
    new RemoveEmptyScriptsPlugin(),
  );
  
  //configを統合
  return Object.assign(config, {
    output: {
      path: DIST_PATH,
      filename: '[name].js',
      //clean: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.ejs$/i,
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: {
                  urlFilter: (attribute, value, resourcePath) => {
                    return false;
                  },
                },
                minimize: false,
              },
            },
            'template-ejs-loader',
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
                //sourceMap: false,
                importLoaders: 2,
              }
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                //sourceMap: true,
                implementation: require('sass'),
                sassOptions: {
                  includePaths: [
                    path.resolve(__dirname, 'node_modules')
                  ],
                  outputStyle: (minify)?'compressed':'expanded',
                }
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          type: 'asset/inline'
        },
        {
          test: /node_modules\/(.+)\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: { url: false },
            },
          ],
        },
      ]
    },
    watch: true,
    watchOptions: {
      ignored: ['/node_modules', '/gitignore']
    },
    target: ['web'],
    resolve: {
      extensions: ['.ts', '.js']
    }
  });
  
};