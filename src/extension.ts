import type * as vscode from 'vscode'
import { createCommand, logger } from '@/utils/a_VSCode'

import { uniapp_create_file } from '@/aixy_uniapp/create_file'
import { package_run_scripts } from '@/aixy_package/add_scripts_to_menu'
// 激活扩展程序时调用此方法
export function activate(context: vscode.ExtensionContext) {
  logger('warning', `拓展启动`)
  // 创建命令的订阅列表
  const aixy_uniapp = [
    // 创建一个名为 '页面' 的命令，命令标识符为 'aixy_template.createPage'
    createCommand({
      name: '页面',
      command: 'aixy_template.createPage',
      hookfun: uniapp_create_file,
    }),
    // 创建一个名为 '页面' 的命令，带有子包选项，命令标识符为 'aixy_template.createSubcontractPage'
    createCommand({
      name: '页面',
      options: { subcontract: true },
      command: 'aixy_template.createSubcontractPage',
      hookfun: uniapp_create_file,
    }),
    // 创建一个名为 '组件' 的命令，带有组件选项，命令标识符为 'aixy_template.createComponent'
    createCommand({
      name: '组件',
      options: { component: true },
      command: 'aixy_template.createComponent',
      hookfun: uniapp_create_file,
    }),
  ]
  const aixy_package = [
    // 创建一个名为 '页面' 的命令，命令标识符为 'aixy_template.createPage'
    createCommand({
      name: '运行package的script脚本',
      context: context,
      command: 'aixy.package.runScript',
      hookfun: package_run_scripts,
    })
  ]

  // 将所有命令订阅添加到上下文的订阅列表中
  context.subscriptions.push(...aixy_uniapp, ...aixy_package)
}

// 停用扩展程序时调用此方法
export function deactivate() { }