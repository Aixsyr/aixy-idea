import type * as vscode from "vscode";
import { createCommand } from "@/utils/aVSCode";

// import { aixy_test_fun } from "@/aixy_test/aTest";

// 激活扩展程序时调用此方法
export function aixy_test_activate(
  context: vscode.ExtensionContext
): Array<vscode.Disposable> {
  return [
    createCommand({
      name: "aixy 测试启动",
      context: context,
      command: "aixy.test.run",
    }),
  ];
}

// 停用扩展程序时调用此方法
export function aixy_test_deactivate() {}
