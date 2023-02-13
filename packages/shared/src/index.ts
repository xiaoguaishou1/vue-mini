/**
 * 判断是否为一个数组
 */
export const isArray = Array.isArray
export const extend = Object.assign;
export const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)
export const isObject = (val: unknown) =>
    val !== null && typeof val === 'object'