/*
 * @Author: 阿喜
 * @Date: 2023-08-05 00:41:48
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-05 00:42:59
 * @FilePath: \vue-mini\packages\shared\test\index.test.ts
 * @Description: 
 * 
 */
import { isArray, extend, hasChanged, isObject, isFunction, isString } from '../src/index'
import { describe, it, expect } from 'vitest'
describe('shared functions', () => {
    it('isArray function', () => {
        expect(isArray([])).toBeTruthy()
        expect(isArray({})).toBeFalsy()
    })

    it('extend function', () => {
        const a = { foo: 'bar' }
        const b = { bar: 'foo' }
        expect(extend(a, b)).toEqual({ foo: 'bar', bar: 'foo' })
    })

    it('hasChanged function', () => {
        expect(hasChanged('a', 'a')).toBeFalsy()
        expect(hasChanged('a', 'b')).toBeTruthy()
    })

    it('isObject function', () => {
        expect(isObject({})).toBeTruthy()
        expect(isObject('not an object')).toBeFalsy()
    })

    it('isFunction function', () => {
        expect(isFunction(() => { })).toBeTruthy()
        expect(isFunction('not a function')).toBeFalsy()
    })

    it('isString function', () => {
        expect(isString('this is a string')).toBeTruthy()
        expect(isString({})).toBeFalsy()
    })
})
