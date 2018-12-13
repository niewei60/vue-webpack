const Path = require('path');
const Utils = require('./utils.js');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
let entries = Utils.getEntries(Path.resolve(__dirname, '../src/module/*/main.js'));
let HTMLPlugins = Utils.createEntriesHTMLPlugin(entries);

module.exports = {
    entry: entries,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'static/img/[name].[ext]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000,
                    name: 'static/fonts/[name].[ext]',
                }
            },
            {
                // 配置正则表达式，查找后缀为.css文件
                test:/\.css$/,
                // 配置加载器,用！符号级联
                loader:'style-loader!css-loader'
            }
        ]
    },
    resolve: {
        alias: {
            '@common': Path.resolve(__dirname, '../src/common')
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'vendor'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: Path.resolve(__dirname, '../'),
        }),
        new Webpack.HashedModuleIdsPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        ...HTMLPlugins,
        new CopyWebpackPlugin([]),
        new FriendlyErrorsPlugin(),
    ],
}
