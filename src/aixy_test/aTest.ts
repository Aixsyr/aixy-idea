import * as vscode from 'vscode'; // 导入 VS Code 扩展 API
import { CreateCommandOptions, logger } from '@/utils/aVSCode'; // 导入自定义的 CreateCommandOptions 类型
import { aAxios } from '@/utils/aAxios/aAxios'

import * as fs from 'fs';
import * as path from 'path';

async function aixy_test_fun(options: CreateCommandOptions, uri: vscode.Uri) {
}

export { aixy_test_fun }