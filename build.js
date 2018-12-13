// 外部模块
const Chalk = require('chalk')
const Commander = require('commander')
const Path = require('path')
const Webpack = require('webpack')
const Merge = require('webpack-merge')
const Koa = require('koa')
const koaStatic = require('koa-static')
const Open = require('open')

// 编译配置模块
const Utils = require('./build/utils.js')
const welcome = require('./build/welcome.js')
const webpackCommonConfig = require('./build/webpack.common.js')
const getWebpackEnvConfig = require('./build/webpack.env.js')

// 通过参数生成打包编译配置
Commander.option('-e --env [type]', 'set NODE_ENV for application package config').parse(process.argv)
const NODE_ENV = Commander.env
const webpackConfig = Merge(webpackCommonConfig, getWebpackEnvConfig(NODE_ENV))

// 打包编译流程辅助
if (NODE_ENV === 'development') {
    // 显示开发模式欢迎界面
	welcome.dev()

	// 启动本地静态网站服务，端口号3000
	const app = new Koa()
	app.use(koaStatic(Path.resolve(__dirname, './dist')))
	app.listen(30003)
	console.log(Chalk.cyan.bold('--- Server has started at http://localhost:30003 ---'))
}
else if (NODE_ENV === 'production'){
	// 显示生产模式打包欢迎界面
	welcome.prod()
}

// Webpack打包编译
let compiledCount = 0
Webpack(webpackConfig, (err, stats) => {
	if (err) {
		console.log(err)
	}
	else {
		if (NODE_ENV === 'development') {
			// 第一次编译打开浏览器
			compiledCount === 0 && Open('http://localhost:30003/modules/login/view.html')
			console.log(Chalk.gray.bold(`--- Compiled: ${++compiledCount} ------------------------------------------------------------------------------------------`))
		}
		console.log(stats.toString({
			children: false,
			entrypoints: false,
			modules: false,
			version: false,
			colors: true,
		}))
	}
})
