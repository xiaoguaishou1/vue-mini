/*
 * @Author: 阿喜
 * @Date: 2023-08-08 22:43:42
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 22:44:06
 * @FilePath: \vue-mini\packages\shared\test\fun.test.ts
 * @Description: 
 * 
 */
import { isArray, isObject, hasChanged, isFunction, isString, isOn, NO } from '../src/index';
import { describe, it, expect } from 'vitest'
describe('Utils', () => {

    it('isArray', () => {
        expect(isArray([])).toBe(true);
        expect(isArray({})).toBe(false);
    });

    it('isObject', () => {
        expect(isObject({})).toBe(true);
        expect(isObject(null)).toBe(false);
    });

    it('hasChanged', () => {
        expect(hasChanged(1, 1)).toBe(false);
        expect(hasChanged(1, '1')).toBe(true);
    });

    it('isFunction', () => {
        expect(isFunction(() => { })).toBe(true);
        expect(isFunction({})).toBe(false);
    });

    it('isString', () => {
        expect(isString('test')).toBe(true);
        expect(isString(123)).toBe(false);
    });

    it('isOn', () => {
        expect(isOn('onClick')).toBe(true);
        expect(isOn('on123')).toBe(true);
        expect(isOn('on')).toBe(false);
    });

    it('NO', () => {
        expect(NO()).toBe(false);
    });

});
