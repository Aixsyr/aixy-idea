import path from 'path'
import * as fs from 'fs-extra'

export type SearchFileResult = Promise<{ path: string; data: string } | null | undefined>

// 将路径中的反斜杠转换为正斜杠
export function slash(path: string): string {
    const isExtendedLengthPath = path.startsWith('\\\\?\\');

    if (isExtendedLengthPath) {
        return path;
    }

    return path.replace(/\\/g, '/');
}

// 判断文件是否可访问
export function isFileAccess(path: string) {
    return new Promise((resolve) => {
        fs.access(path, (error: any) => {
            if (error)
                resolve(false)
            else resolve(true)
        })
    })
}

// 向上递归搜索文件
export function upwardSearchFile(currentPath: string, fileName: string): SearchFileResult {
    const recursion = async (appPath: string): Promise<any> => {
        const recursPath = slash(path.resolve(appPath, fileName))
        // 递归出口: 路径是根路径, 停止递归
        if (recursPath.split('/').length < 1)
            return null

        if (await isFileAccess(recursPath || '/')) {
            const stat = fs.lstatSync(recursPath)
            const data = stat.isFile() ? fs.readFileSync(recursPath, 'utf-8') : ''
            return { path: recursPath, data }
        }
        else {
            return recursion(path.resolve(appPath, '../'))
        }
    }

    return recursion(currentPath)
}