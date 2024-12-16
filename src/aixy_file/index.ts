import type * as vscode from "vscode";
import { createCommand } from "@/utils/aVSCode";

import { file_add_gitignore } from "@/aixy_file/add_gitignore";

// 激活扩展程序时调用此方法
export function aixy_file_activate(
  context: vscode.ExtensionContext
): Array<vscode.Disposable> {
  return [
    createCommand({
      name: "添加gitignore文件",
      context: context,
      command: "aixy.file.add.gitignore",
      hookfun: file_add_gitignore,
    }),
  ];
}

// 停用扩展程序时调用此方法
export function aixy_file_deactivate() {}
