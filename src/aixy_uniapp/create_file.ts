import * as vscode from 'vscode'
import { generate } from '@/aixy_uniapp/generate'
import { getConfiguration, logger, CreateCommandOptions } from '@/utils/aVSCode'


// 创建命令的函数
export async function uniapp_create_file(options: CreateCommandOptions, uri: vscode.Uri) {
  logger('warning', `${options.command} 执行!`)
  // 根据命令名称设置输入提示文本
  const componentText = `输入${options.name}名称`
  const pageText = `${componentText}，空格分隔字段（navigationBarTitleText）`
  const input = await vscode.window.showInputBox({ prompt: options.name === '页面' ? pageText : componentText })

  // 如果用户没有输入内容，记录错误并抛出异常
  if (!input) {
    logger('error', `${options.name}名称不能为空!`)
    throw new Error(`${options.name}名称不能为空!`)
  }

  // 调用 generate 函数生成文件，并获取生成结果
  const { message, status } = await generate({
    names: { view: input.split(' ')[0], page: input.split(' ')[1] || '' },
    nameType: getConfiguration('aixy_template.name'),
    path: uri.fsPath,
    component: options.options?.component,
    subcontract: options.options?.subcontract,
    typescript: getConfiguration('aixy_template.typescript'),
    styleType: getConfiguration('aixy_template.style'),
    directory: getConfiguration('aixy_template.directory'),
    template: getConfiguration('aixy_template.template'),
    setup: getConfiguration('aixy_template.setup'),
    scoped: getConfiguration('aixy_template.scoped'),
  })

  // 记录生成结果的状态和消息
  logger(status, message)
}