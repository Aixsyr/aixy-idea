import * as vscode from 'vscode'; // 导入 VS Code 扩展 API
import { CreateCommandOptions, logger } from '@/utils/aVSCode'; // 导入自定义的 CreateCommandOptions 类型
import { aAxios } from '@/utils/aAxios/aAxios'

import * as fs from 'fs';
import * as path from 'path';

interface NameListData {
    nameList: string[];
    timestamp: number;
}

const NAME_LIST_KEY = 'aixy.file.add.gitignore.NameList';
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

async function file_add_gitignore(options: CreateCommandOptions, uri: vscode.Uri) {
    if (!options.context) {
        throw new Error('Extension context is undefined');
    }
    let gitignorePath: string;
    if (fs.statSync(uri.fsPath).isDirectory()) {
        gitignorePath = path.join(uri.fsPath, '.gitignore');
    } else {
        gitignorePath = uri.fsPath;
    }

    if (fs.existsSync(gitignorePath)) {
        const overwrite = await vscode.window.showWarningMessage(
            '.gitignore 文件已存在，是否覆盖？',
            { modal: true },
            '是',
            '否'
        );

        if (overwrite !== '是') {
            logger('warning', '取消覆盖 .gitignore 文件');
            return;
        }
    }
    const globalState = options.context.globalState;
    let { nameList, timestamp } = globalState.get<NameListData>(NAME_LIST_KEY) || { nameList: [], timestamp: 0 };

    if (!nameList.length || !timestamp || (Date.now() - timestamp > ONE_MONTH_IN_MS)) {
        logger('success', '正在获取 .gitignore 模板列表');
        nameList = await aAxios.get('https://api.github.com/gitignore/templates');
        globalState.update(NAME_LIST_KEY, { nameList: nameList, timestamp: Date.now() });
    }

    const selectedName = await vscode.window.showQuickPick(
        nameList.map((item: string) => ({ label: item })), // 映射到 QuickPickItem 格式
        {
            placeHolder: '选择类型'
        }
    );

    if (selectedName) {
        const text: { [key: string]: string } = await aAxios.get('https://api.github.com/gitignore/templates/' + selectedName.label);
        fs.writeFileSync(gitignorePath, text.source, 'utf8');
        logger('success', '.gitignore 文件已创建');
    } else {
        logger('warning', '未选择类型');
    }
}

export { file_add_gitignore }