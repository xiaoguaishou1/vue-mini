/*
 * @Author: panghu
 * @Date: 2023-08-03 17:10:15
 * @LastEditors: panghu 760695955@qq.com
 * @LastEditTime: 2023-08-04 22:02:09
 * @FilePath: /vue-mini/packages/reactivity/src/baseHandlers.ts
 * @Description: 
 * 
 */
import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();


export const mutableHanders: ProxyHandler<object> = {
    get,
    set
}

/**
 * Creates a getter function that implements closure based on the source code.
 *
 * @param {object} target - The target object to get the property from.
 * @param {string | symbol} key - The key of the property to get.
 * @param {object} receiver - The receiver object.
 * @return {any} The value of the property.
 */
function createGetter() {
    // 依照源码实现闭包
    return function get(target: object, key: string | symbol, receiver: object) {
        const res = Reflect.get(target, key, receiver);
        track(target, key);
        return res;
    }
}


/**
 * Creates a setter function that sets a value to a target object using the Reflect.set method.
 *
 * @param {object} target - The target object to set the value on.
 * @param {string | symbol} key - The key to set the value on.
 * @param {any} value - The value to set.
 * @param {object} receiver - The receiver object for the set operation.
 * @return {boolean} - Returns the result of the Reflect.set operation.
 */
function createSetter() {
    return function set(target: object, key: string | symbol, value: any, receiver: object) {
        const res = Reflect.set(target, key, value, receiver);
        trigger(target, key, value);
        return res;
    }
}

