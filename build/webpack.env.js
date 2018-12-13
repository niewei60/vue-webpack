const Path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const Utils = require('./utils.js')

/**
 * 根据开发模式生成Webpack配置
 * @param  {String} mode 开发模式，development | production
 * @return {Object}      Webpack配置
 */
module.exports = mode => {
    let styleLoaders = Utils.getStyleLoaders(mode)
    return {
        mode,
        devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
        watch: mode === 'production' ? false : true,
        watchOptions: {
            ignored: /node_modules/,
        },
        output: {
            path: Path.resolve(__dirname, '../dist'),
            filename: mode === 'production' ? '[name].[chunkhash:8].js' : '[name].js',
            publicPath: '../../'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: mode === 'production' ? [
                            styleLoaders.cssLoader,
                            styleLoaders.postcssLoader
                        ] : [
                            styleLoaders.cssLoader,
                        ]
                    })
                },
                {
                    test: /\.styl$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            styleLoaders.cssLoader,
                            styleLoaders.postcssLoader,
                            styleLoaders.stylusLoader,
                        ]
                    })
                },
                {
                    test: /\.vue/,
                    exclude: /node_modules/,
                    loader: 'vue-loader',
                    options: {
                        postcss: {
                            sourceMap: true,
                            plugins: () => [
                                require('postcss-px2rem')({
                                    remUnit: 32,
                                    baseDpr: 2
                                }),
                                require('autoprefixer')({
                                    browsers: ['> 1%', 'last 2 versions']
                                }),
                                require('cssnano')()
                            ]
                        },
                        loaders: {
                            js: 'babel-loader',
                            stylus: ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: [
                                    styleLoaders.cssLoader,
                                    styleLoaders.stylusLoader
                                ],
                                // publicPath: '../../'
                            }),
                        }
                    }
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: mode === 'production' ? '[name].[chunkhash:8].css' : '[name].css'
            }),
        ]
    }
}
