import type * as vscode from "vscode";
import { createCommand, logger, CreateCommandOptions } from "@/utils/aVSCode";

import { aixy_test_activate } from "@/aixy_test";
import { aixy_package_activate } from "@/aixy_package";
import { aixy_file_activate } from "@/aixy_file";

// 激活扩展程序时调用此方法
export function activate(context: vscode.ExtensionContext) {
  logger("info", `aixy idea vscode 启动`);
  // 将所有命令订阅添加到上下文的订阅列表中
  context.subscriptions.push(
    ...aixy_package_activate(context),
    ...aixy_file_activate(context),
    ...aixy_test_activate(context)
  );
}

// 停用扩展程序时调用此方法
export function deactivate() {}
