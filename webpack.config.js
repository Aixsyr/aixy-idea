// 引入 Node.js 内置模块 'path'，用于处理和转换文件路径
const path = require('path');

// 引入 'webpack-node-externals' 插件，用于排除 Node.js 模块依赖
const nodeExternals = require('webpack-node-externals');

module.exports = {
    // 设置 Webpack 的模式为 'production'，以启用优化
    mode: 'production',

    // 设置 Webpack 的目标环境为 Node.js
    target: 'node',

    // 指定入口文件，Webpack 将从这个文件开始构建依赖图
    entry: './src/extension.ts',

    // 配置输出选项
    output: {
        // 输出文件的目录
        path: path.resolve(__dirname, 'out'),
        // 输出文件的文件名
        filename: 'extension.js',
        // 指定库的导出方式，这里使用 CommonJS2 规范
        libraryTarget: 'commonjs2'
    },

    // 配置模块解析选项
    resolve: {
        // 自动解析确定的扩展名，使导入模块时可以省略扩展名
        extensions: ['.ts', '.js'],
        // 配置路径别名，使导入模块时可以使用 '@' 代替 'src' 目录
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    // 配置模块处理规则
    module: {
        rules: [
            {
                // 匹配所有以 .ts 结尾的文件
                test: /\.ts$/,
                // 使用 'ts-loader' 处理 TypeScript 文件
                use: 'ts-loader',
                // 排除 node_modules 目录中的文件
                exclude: /node_modules/
            }
        ]
    },

    // 配置外部依赖，使用 'webpack-node-externals' 插件
    externals: [nodeExternals()] // 排除 Node.js 模块依赖
};