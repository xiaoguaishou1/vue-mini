import { describe, it, expect } from 'vitest'
import { compile } from '../src/index'

describe('compiler-dom', () => {
  it('should return render function', () => {
    const render = compile('<div>Hello</div>')
    expect(typeof render).toBe('function')
    const vnode = render()
    expect(vnode.type).toBe('div')
    expect(vnode.children).toBe('Hello')
  })
})
