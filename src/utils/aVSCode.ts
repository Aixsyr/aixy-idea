import * as vscode from 'vscode'

// 日志记录函数，根据类型显示不同的消息
export function logger(type: string, message = '') {
  switch (type) {
    case 'info':
      return vscode.window.showInformationMessage(`Success: ${message}`)
    case 'warning':
      return vscode.window.showWarningMessage(`Warning: ${message}`)
    case 'error':
      return vscode.window.showErrorMessage(`Failed: ${message}`)
    default:
      return vscode.window.showInformationMessage(`Failed: logger 使用错误\n${message}`)
  }
}

// 获取配置函数，从 VS Code 的配置中获取指定部分的配置
export function getConfiguration(section: string) {
  return vscode.workspace.getConfiguration().get<any>(section)
}

// 定义创建命令的选项接口
export interface CreateCommandOptions {
  /** 命令 */
  command: string;
  /** 命令名称 */
  name?: string;
  /** 上下文 */
  context?: vscode.ExtensionContext;
  /** 配置 */
  options?: Record<string, any>;
  /** 钩子函数 */
  hookfun?: (options: CreateCommandOptions, uri: vscode.Uri) => any;
}

export function createCommand(options: CreateCommandOptions) {
  // 注册命令并返回命令的可销毁对象
  return vscode.commands.registerCommand(options.command, async (uri: vscode.Uri) => {
    if (options.hookfun) {
      return options.hookfun(options, uri);
    }
  });
}