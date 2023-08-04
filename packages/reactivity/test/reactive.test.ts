/*
 * @Author: 阿喜
 * @Date: 2023-08-05 00:44:17
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-05 00:44:49
 * @FilePath: \vue-mini\packages\reactivity\test\reactive.test.ts
 * @Description: 
 * 
 */
import { describe, it, expect } from 'vitest'

import { reactive, toReactive } from '../src/reactive'

describe('reactive', () => {
    it('should make object reactive', () => {
        const original = { foo: 'bar' }
        const wrapped = reactive(original)

        // 检查是否为同一对象
        expect(wrapped).not.toBe(original)

        // 检查响应式对象的行为
        expect(wrapped.foo).toBe('bar')
        wrapped.foo = 'baz'
        expect(wrapped.foo).toBe('baz')
    })
})

describe('toReactive', () => {
    it('should not try to make non-objects reactive', () => {
        expect(toReactive(12)).toBe(12)
        expect(toReactive('hello')).toBe('hello')
    })

    it('should make objects reactive', () => {
        const original = { foo: 'bar' }
        const wrapped = toReactive(original)

        // 检查是否为同一对象
        expect(wrapped).not.toBe(original)

        // 检查响应式对象的行为
        expect(wrapped.foo).toBe('bar')
        wrapped.foo = 'baz'
        expect(wrapped.foo).toBe('baz')
    })
})
