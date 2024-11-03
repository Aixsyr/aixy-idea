import * as vscode from 'vscode'; // 导入 VS Code 扩展 API
import * as fs from 'fs'; // 导入 Node.js 的文件系统模块，用于与文件系统进行交互

import { CreateCommandOptions } from '@/utils/a_VSCode'; // 导入自定义的 CreateCommandOptions 类型

/**
 * 将 package.json 中的 scripts 动态添加到 VS Code 的右键上下文菜单中
 * 
 * @param options - CreateCommandOptions 类型的选项，用于创建命令
 * @param uri - vscode.Uri 类型的 URI，表示 package.json 文件的路径
 */
export async function package_run_scripts(options: CreateCommandOptions, uri: vscode.Uri) {

    // 检查 package.json 文件是否存在
    if (fs.existsSync(uri.fsPath)) {
        // 读取并解析 package.json 文件
        const packageJson = JSON.parse(fs.readFileSync(uri.fsPath, 'utf-8'));
        const scripts = packageJson.scripts || {}; // 获取 scripts 对象，如果不存在则使用空对象

        // 获取 scripts 对象的键并显示选择菜单
        const scriptKeys = Object.keys(scripts);

        if (scriptKeys.length === 0) {
            vscode.window.showWarningMessage('脚本不存在');
            return;
        }

        const selectedScript = await vscode.window.showQuickPick(scriptKeys, {
            placeHolder: '选择要运行的脚本'
        });

        if (selectedScript) {
            // 运行选中的脚本
            const terminal = vscode.window.createTerminal('Run Script');
            terminal.sendText(`npm run ${selectedScript}`);
            terminal.show();
        } else {
            vscode.window.showInformationMessage('未选择任何脚本');
        }
    }
}