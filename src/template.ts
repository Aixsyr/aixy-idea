import * as ejs from 'ejs'
import cv2 from './templates/component-vue2'
import cv3 from './templates/component-vue3'
import pv2 from './templates/page-vue2'
import pv3 from './templates/page-vue3'
import pv2c from './templates/page-composition'
import cv2c from './templates/component-composition'

// 定义所有模板的映射
const ALL_TEMPLATES = {
  ['vue2' as string]: { page: pv2, component: cv2 },
  ['vue3' as string]: { page: pv3, component: cv3 },
  ['composition-api(vue2)' as string]: { page: pv2c, component: cv2c },
}

// 定义创建视图模板的选项接口
export interface CreateViewTemplateOptions {
  template?: string
  name?: string
  typescript?: boolean
  styleType?: string
  component?: boolean
  setup?: string
  scoped?: boolean
}

// 创建视图模板的函数
export function createViewTemplate(options: CreateViewTemplateOptions) {
  // 根据选项选择对应的模板
  const templates = ALL_TEMPLATES[options.template || 'vue2']
  const template = templates[options.component ? 'component' : 'page']

  // 处理属性字符串
  const handle = (attrs: (string | boolean | undefined)[]) => {
    const _v = attrs.filter(Boolean).join(' ').trim()
    return _v ? ` ${_v}` : ''
  }

  // 生成 script 标签的属性
  const scriptAttrs = handle([
    options.typescript && 'lang="ts"',
    options.template === 'vue3' && options.setup && 'setup',
  ])

  // 生成 style 标签的属性
  const styleAttrs = handle([
    options.styleType !== 'css' && `lang="${options.styleType}"`,
    options.scoped && 'scoped',
  ])

  // 准备模板数据
  const data = {
    name: options.name,
    setup: options.setup,
    typescript: options.typescript,
    scriptAttrs,
    styleAttrs,
  }

  // 使用 ejs 渲染模板并返回结果
  return ejs.render(template, { options: data })
}