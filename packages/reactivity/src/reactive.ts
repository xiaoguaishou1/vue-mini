/*
 * @Author: 阿喜
 * @Date: 2023-02-10 14:10:08
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-10 14:43:58
 * @FilePath: /vue3-mini-core/packages/reactivity/src/reactive.ts
 * @Description:  构建响应式对象 reactive
 * Map和WeakMap的区别 来源csdn:https://blog.csdn.net/qq_26834399/article/details/105071907
 */
import { mutableHandlers } from './baseHandlers'
/**
 * @description: 使用 WeakMap 保存响应式对象
 * @return {*}
 */
export const reactiveMap = new WeakMap<object, any>();


/**
 * @description: 
 * @param {object} target  
 * @param {*} mutableHandlers
 * @param {*} reactiveMap
 * @return {*}
 */
export function reactive(target: object) {
    //创建响应式对象 
    return createReactiveObject(
        target,
        mutableHandlers,
        reactiveMap,
    )
}

/**
 * @description: 
 * @param {object} target
 * @param {ProxyHandler} baseHandler
 * @param {WeakMap} proxyMap
 * @param {*} any
 * @param {*} proxy
 * @return {*}
 */
function createReactiveObject(target: object, baseHandler: ProxyHandler<any>, proxyMap: WeakMap<object, any>) {
    const existingProxy = proxyMap.get(target);
    // 如果已经是响应式对象，直接返回
    if (existingProxy) {
        return existingProxy;
    }
    // 如果不是响应式对象，创建一个响应式对象
    const proxy = new Proxy(target, baseHandler);
    // 将响应式对象保存到 WeakMap 中
    proxyMap.set(target, proxy);
    // 返回响应式对象
    return proxy;
}

