import { createElementVNode } from '@vue/runtime-core'
import { parserOptions } from './parserOptions'

export function compile(template: string) {
  template = template.trim()
  const match = template.match(/^<(\w+)>([^]*)<\/\1>$/)
  if (match) {
    const [, tag, text] = match
    return function render() {
      return createElementVNode(tag, null, text.trim())
    }
  }
  return function render() {
    return createElementVNode('div', null, template)
  }
}

export { parserOptions }
export * from './runtimeHelpers'
export * from './htmlNesting'
