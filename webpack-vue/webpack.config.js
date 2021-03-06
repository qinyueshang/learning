var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
   devtool: '#cheap-module-source-map',
   entry: { //配置入口文件，有几个写几个
       list: './src/js/list.js',
       about: './src/js/about.js',
    },
    output: {
       path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
       publicPath: '/dist/',                //模板、样式、脚本、图片等资源对应的server上的路径
       filename: 'js/[name].[hash].js',            //每个页面对应的主js的生成配置
       chunkFilename: 'js/[name].chunk.js'   //chunk生成的配置
    },
    resolve: {
       extensions: ['.js', '.vue', '.json'],
       alias: {
          vue: 'vue/dist/vue.esm.js'
        }
    },
    module: {
        // 加载器
        loaders: [
            {
               test: /\.vue$/,
               loader: 'vue-loader',
               options: {
                    loaders: [
                        {
                          test:/\.css$/,
                          loader: ExtractTextPlugin.extract({fallback: 'vue-style-loader', use: 'css-loader' }),
                        },
                        {
                          test:/\.scss$/,
                          loader: ExtractTextPlugin.extract({fallback: 'vue-style-loader', use:['css-loader','sass-loader']}),
                        },
                    ]
                }
            },
            {
              test: /\.js$/,
              loader: 'babel-loader',
              options: {presets: ['es2015']}
            },
            {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader' }),
            },
            {
              test: /\.(html|tpl)$/,
              loader: 'html-loader'
            },
            { test: /\.(png|jpg|jpeg|gif)$/,
              use: [
                     {
                       loader: 'url-loader',
                       options: {
                         limit: 8192,
                         name: 'img/[name].[ext]'
                       }
                     }
                   ]

              /*loader:'url-loader',
              options: {
                     limit: 8192,
                     name: 'img/[name].[ext]'
              }*/
            },
            {
               test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
               loader: 'url-loader',
               options: {
                 limit: 10000,
                 name: 'fonts/[name].[ext]'
               }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
             //favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
             filename: './view/about.html', //生成的html存放路径，相对于path
             template: './src/html/about.html', //html模板路径
             inject: true, //js插入的位置，true/'head'/'body'/false
             //hash: true, //为静态资源生成hash值
             chunks: ['about','vendors'],//需要引入的chunk，不配置就会引入所有页面的资源
             minify: { //压缩HTML文件
                 removeComments: true, //移除HTML中的注释
                 collapseWhitespace: false //删除空白符与换行符
             }
         }),
         new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
              //favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
              filename: './view/list.html', //生成的html存放路径，相对于path
              template: './src/html/list.html', //html模板路径
              inject: true, //js插入的位置，true/'head'/'body'/false
              //hash: true, //为静态资源生成hash值
              chunks: ['list','vendors'],//需要引入的chunk，不配置就会引入所有页面的资源
              minify: { //压缩HTML文件
                  removeComments: true, //移除HTML中的注释
                  collapseWhitespace: false //删除空白符与换行符
              }
          }),
          //new webpack.HotModuleReplacementPlugin(), //热加载
          new ExtractTextPlugin({ filename: 'css/[name].[hash].css', disable: false, allChunks: true }),
          new UglifyJSPlugin(),
          new webpack.optimize.CommonsChunkPlugin({
                names: ['vendors'], // 将公共模块提取，生成名为`vendors`的chunk
                chunks: ['list','about'], //提取哪些模块共有的部分
          }),
          new webpack.HashedModuleIdsPlugin(),

    ],
    //使用webpack-dev-server，提高开发效率
    devServer: {
        contentBase: '/',
        host: 'localhost',
        port: 9090, //默认8080
        inline: true, //可以监控js变化
        hot: true, //热启动
    }

};
