/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:09:16
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-02 21:46:02
 * @FilePath: \vue-mini\packages\shared\src\index.ts
 * @Description: 
 * 
 */
/**
 * 判断是否为一个数组
 */
export const isArray = Array.isArray
export const extend = Object.assign;
export const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)
export const isObject = (val: unknown) =>
    val !== null && typeof val === 'object'



export const isFunction = (val: unknown): val is Function => {
    return typeof val === 'function'
}