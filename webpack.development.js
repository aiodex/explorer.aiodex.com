var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

var { VueLoaderPlugin } = require('vue-loader')
var nodeExternals = require('webpack-node-externals');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

// var VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
// // entry server
// var VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

module.exports = function (env) {
  return [

    // client 

    {
      mode: 'none',

      entry: {
        'www': './src/www/app.js',
        //'admin': './src/admin/app.js',          

      },
      output: {
        path: path.join(__dirname, './dist'),
        //filename: '[name].[hash:8].js',
        filename: '[name]/js/app.js',
        publicPath: '/',
        //chunkFilename: '[name]-chunk.js',
        //sourceMapFilename: '[name].map'
      },
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                //presets: ['es2015', "stage-2"],
                // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                // the "scss" and "sass" values for the lang attribute to the right configs here.
                // other preprocessors should work out of the box, no loader config like this nessessary.
                'scss': 'vue-style-loader!css-loader!sass-loader',
                'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
              },
              // other vue-loader options go here
            }
          },

          // {
          //   test: /\.js$/,
          //   exclude: /(node_modules|bower_components)/,
          //   loader: 'babel-loader',
          // },

          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: file => (
              /node_modules/.test(file) &&
              !/\.vue\.js/.test(file)
            )
          },

          {
            test: /\.s?[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')]
                }
              }
            ],
          },

          {
            test: /\.less$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'less-loader'
            ]
          },

          {
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },

      // externals: [/^(?!\.|\/).+/i,],
      //externals:/^(jquery|\$|bootstrap|vue)$/i,
      devtool: '#source-map',
      // externals: {
      //   // lodash : {
      //   //   commonjs: "lodash",
      //   //   amd: "lodash",
      //   //   root: "_" // indicates global variable
      //   // }

      //   jquery: 'jQuery',
      //   vue: 'Vue',
      //   vuex: 'Vuex',
      //   'vue-router': 'VueRouter',
      //   axios: 'axios'

      // },

      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify(
            process.env.NODE_ENV || "development"
          ),
          "process.env.VUE_ENV": '"client"'
        }),



        //   new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"

        // }),



        new HtmlWebpackPlugin({
          filename: 'www/index.html',
          template: 'src/www/index.html',
          hash: true,
          chunks: ['www'],
          minify: {
            collapseWhitespace: true,
            //preserveLineBreaks: true,                    
            //removeComments: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true
          }

        }),


        new HtmlWebpackExternalsPlugin({
          externals: [
            {
              module: 'jquery',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
              global: 'jQuery'
            },
            {
              module: 'Popper',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.1/umd/popper.min.js'
            },
            {
              module: 'boostrap',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js'
            },
            {
              module: 'vue',
              global: 'Vue',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js'
            },
            {
              module: 'vue-router',
              global: 'VueRouter',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js'
            },

            {
              module: 'vuex',
              global: 'Vuex',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js'
            },
            {
              module: 'axios',
              global: 'axios',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js'
            },
            {
              module: 'lodash',
              global: '_',
              entry: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js'
            },


            {
              module: 'highcharts',
              entry: [
                'https://code.highcharts.com/highcharts.js',
              ]

            },
            // {
            //   module: 'highcharts/highstock',
            //   entry: [
            //     '//code.highcharts.com/stock/highstock.js',
            //     '//code.highcharts.com/highcharts-more.js'
            //   ]
            // },



            // {
            //   module: 'highcharts/highmaps',
            //   entry: 'https://code.highcharts.com/maps/highmaps.js'
            // },



            {

              module: 'remark',
              entry: [
                '//l.allcdn.org/remark/v4.1/bootstrap.min.css',
                '//l.allcdn.org/remark/v4.1/bootstrap-extend.min.css',
                '//l.allcdn.org/remark/v4.1/iconbar/site.min.css',
                '//l.allcdn.org/remark/v4.1/skins/green.min.css'
              ],

            },
            {
              module: 'fonts',
              entry: [
                '//l.allcdn.org/fa/v5.3.1/css/all.min.css'
              ],
            },

          ]
        }),

        new MiniCssExtractPlugin({
          filename: '[name]/css/app.css',
          allChunks: true
        }),

        // new ExtractTextPlugin({
        //   filename: '[name]/css/app.css',
        //   allChunks: true

        // }),

        new VueLoaderPlugin(),

        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
        new CopyWebpackPlugin([
          {
            context: 'src/www/favicon',
            from: '**/*',
            to: './www/favicon'
          },

        ]),

      ]
    },

    ///----------------------------
    {

      mode: 'none',
      target: 'node',
      devtool: '#source-map',
      node: {
        __dirname: true,
        __filename: true,
      },
      entry: {

        'app': './src/server/app.js',
        'sync': './src/server/sync.js',
        'scan': './src/server/scan.js',

      },
      output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',

      },
      module: {
        rules: [


          {
            test: /\.js$/,
            loader: 'babel-loader',
            //exclude: /node_modules/
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            query: {
              minimize: true
            }
          },


        ]
      },
      //externals: [/^(?!\.|\/).+/i,],
      externals: [nodeExternals()],
      plugins: [
        new webpack.DefinePlugin({
          'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development") }
        }),
      ]
    },


  ]
}
