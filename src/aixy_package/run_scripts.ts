import * as vscode from 'vscode'; // 导入 VS Code 扩展 API
import * as fs from 'fs-extra'; // 导入 Node.js 的文件系统模块，用于与文件系统进行交互

import { CreateCommandOptions, logger } from '@/utils/aVSCode'; // 导入自定义的 CreateCommandOptions 类型

// 运行选中的脚本
function run_scripts(Script: string, terminalName: string = Script) {
    let terminal = vscode.window.terminals.find(t => t.name === terminalName);
    if (!terminal) {
        terminal = vscode.window.createTerminal(terminalName);
    } else {
        terminal.sendText('\x03'); // 发送 Ctrl+C 停止当前命令
    }
    terminal.sendText(`npm run ${Script}`);
    terminal.show();
}

// 读取 package.json 文件中的 scripts 对象
function package_read_scripts(uri: vscode.Uri) {
    // 读取并解析 package.json 文件
    const packageJson = JSON.parse(fs.readFileSync(uri.fsPath, 'utf-8'));
    const scripts = packageJson.scripts || {}; // 获取 scripts 对象，如果不存在则使用空对象
    // 获取 scripts 对象的键和值并显示选择菜单
    const scriptItems = Object.keys(scripts).map(key => ({
        label: key,
        description: scripts[key]
    }));
    return scriptItems;
}

/**
 * 将 package.json 中的 scripts 动态添加到 VS Code 的右键上下文菜单中
 * 
 * @param options - CreateCommandOptions 类型的选项，用于创建命令
 * @param uri - vscode.Uri 类型的 URI，表示 package.json 文件的路径
 */
export async function package_run_scripts(options: CreateCommandOptions, uri: vscode.Uri) {
    if (fs.existsSync(uri.fsPath)) {

        const scriptItems = package_read_scripts(uri);

        if (scriptItems.length === 0) {
            logger('warning', `脚本不存在`);
            return;
        }

        const selectedScript = await vscode.window.showQuickPick(scriptItems, {
            placeHolder: '选择要运行的脚本'
        });

        if (selectedScript) {
            // 运行选中的脚本
            run_scripts(selectedScript.label, selectedScript.label);
        } else {
        }
    }
}

export async function package_run_scripts_firstScript(options: CreateCommandOptions, uri: vscode.Uri) {
    if (fs.existsSync(uri.fsPath)) {
        const scriptItems = package_read_scripts(uri);

        if (scriptItems.length === 0) {
            logger('warning', `脚本不存在`);
            return;
        }
        run_scripts(scriptItems[0].label, scriptItems[0].label);
    }
}