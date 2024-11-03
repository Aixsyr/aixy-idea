import { defineConfig } from 'vite'; // 引入 Vite 的配置定义函数
import { resolve } from 'path'; // 引入 Node.js 内置模块 'path'，用于处理和转换文件路径

export default defineConfig({
    build: {
        lib: {
            // 指定库的入口文件，Vite 将从这个文件开始构建依赖图
            entry: resolve(__dirname, 'src/extension.ts'),
            // 指定库的名称
            name: 'Extension',
            // 指定输出文件的文件名格式
            fileName: (format) => {
                if (format === 'umd') return `extension.js`;
                else return `extension.${format}.js`;
            }
        },
        rollupOptions: {
            // 指定要排除的模块，这些模块不会被打包进输出文件，而是在运行时从外部环境中获取
            external: [
                'vscode',
                'path',
                'fs',
                'util',
                'assert',
                'buffer',
                'constants',
                'stream',
                'fs-extra',
                'comment-json',
                'ejs'
            ],
            output: {
                // 为外部化的模块提供全局变量名，以便在 UMD 构建模式下使用
                globals: {
                    vscode: 'vscode',
                    path: 'path',
                    fs: 'fs',
                    util: 'util',
                    assert: 'assert',
                    buffer: 'buffer',
                    constants: 'constants',
                    stream: 'stream',
                    'fs-extra': 'fsExtra',
                    'comment-json': 'commentJson',
                    ejs: 'ejs'
                }
            }
        },
        // 指定输出目录
        outDir: 'out',
        // 生成 sourcemap 文件，便于调试
        sourcemap: true
    },
    resolve: {
        alias: {
            // 配置路径别名，使导入模块时可以使用 '@' 代替 'src' 目录
            '@': resolve(__dirname, 'src')
        }
    }
});