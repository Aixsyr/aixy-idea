import type * as vscode from 'vscode'
import { createCommand, logger, CreateCommandOptions } from '@/utils/aVSCode'

import { aixy_test_fun } from '@/aixy_test/aTest'
import { uniapp_create_file } from '@/aixy_uniapp/create_file'
import { package_run_scripts, package_run_scripts_firstScript } from '@/aixy_package/run_scripts'
import { file_add_gitignore } from '@/aixy_file/add_gitignore'
// 激活扩展程序时调用此方法
export function activate(context: vscode.ExtensionContext) {
  logger('info', `Aixy 启动`)
  // 创建命令的订阅列表
  const aixy_uniapp = [
    createCommand({
      name: '页面',
      command: 'aixy_template.createPage',
      hookfun: uniapp_create_file,
    }),
    createCommand({
      name: '页面',
      options: { subcontract: true },
      command: 'aixy_template.createSubcontractPage',
      hookfun: uniapp_create_file,
    }),
    createCommand({
      name: '组件',
      options: { component: true },
      command: 'aixy_template.createComponent',
      hookfun: uniapp_create_file,
    }),
  ]
  const aixy_package = [
    createCommand({
      name: '运行package的script脚本',
      context: context,
      command: 'aixy.package.runScript',
      hookfun: package_run_scripts,
    }),
    createCommand({
      name: '运行package的首个script脚本',
      context: context,
      command: 'aixy.package.runScript.firstScript',
      hookfun: package_run_scripts_firstScript,
    })
  ]

  const aixy_file = [
    createCommand({
      name: '添加gitignore文件',
      context: context,
      command: 'aixy.file.add.gitignore',
      hookfun: file_add_gitignore,
    }),
  ]
  const aixy_test = [
    createCommand({
      name: 'aixy 测试启动',
      context: context,
      command: 'aixy.test.run',
      hookfun: aixy_test_fun,
    })
  ]


  // 将所有命令订阅添加到上下文的订阅列表中
  context.subscriptions.push(...aixy_uniapp, ...aixy_package, ...aixy_file, ...aixy_test)
}

// 停用扩展程序时调用此方法
export function deactivate() { }