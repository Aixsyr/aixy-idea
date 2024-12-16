import type * as vscode from "vscode";
import { createCommand } from "@/utils/aVSCode";

import {
  package_run_scripts,
  package_run_scripts_firstScript,
} from "@/aixy_package/run_scripts";

// 激活扩展程序时调用此方法
export function aixy_package_activate(
  context: vscode.ExtensionContext
): Array<vscode.Disposable> {
  return [
    createCommand({
      name: "运行package的首个script脚本",
      context: context,
      command: "aixy.package.runScript.firstScript",
      hookfun: package_run_scripts_firstScript,
    }),
    createCommand({
      name: "运行package的script脚本",
      context: context,
      command: "aixy.package.runScript",
      hookfun: package_run_scripts,
    }),
  ];
}

// 停用扩展程序时调用此方法
export function aixy_package_deactivate() {}
