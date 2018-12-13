const Glob = require('glob');
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    /**
     * 根据通配地址，生成Webpack入口配置
     * @param  {String} path          文件入口通配符
     * @param  {Array}  [packages=[]] 待打包列表，默认为空，即全部打包
     * @return {Object}               Webpack Entry对象
     */
    getEntries: (path, packages = []) => {
        let files = Glob.sync(path);
        let entries = {};
        files.forEach((filePath, idx) => {
            let srcPath = Path.resolve(__dirname, '../src/module');
            let name = 'modules/' + Path.dirname(filePath).replace(srcPath + '/', '') + '/view'
            entries[name] = filePath
        })
        return entries
    },
    /**
     * 根据入口生成HTML插件
     * @param  {Object} entries Webpack Entry对象
     * @return {Array}         Webpack Plugins列表
     */
    createEntriesHTMLPlugin: entries => {
        let plugins = [];
        Object.keys(entries).forEach((entryName, idx) => {
            let template = 'page';
            if (entryName === 'index') {
                template = 'index';
            }
            let plugin = new HtmlWebpackPlugin({
                filename: entryName + '.html',
                template: Path.resolve(__dirname, `../src/common/assets/template/${template}.html`),
                inject: true,
                chunks: [entryName, 'vendor']
            })
            plugins.push(plugin)
        })
        return plugins
    },
    /**
     * 获取样式Loader
     * @param  {String} mode 开发模式，development | production
     * @return {Object}      包含各样式loader的对象
     */
    getStyleLoaders: mode => {
        return {
            cssLoader: {
                loader: 'css-loader',
                options: {
                    sourceMap: mode === 'production'
                }
            },
            postcssLoader: {
                loader: 'postcss-loader',
                options: {
                    sourceMap: mode === 'production',
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
                }
            },
            stylusLoader: {
                loader: 'stylus-loader',
                options: {
                    sourceMap: mode === 'production'
                }
            }
        }
    }
}
