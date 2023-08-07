/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:09:16
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-07 20:02:54
 * @FilePath: \vue-mini\packages\reactivity\src\reactive.ts
 * @Description: 
 * 
 */
import { isObject } from "../../shared/src/index";
import { mutableHandlers } from "./baseHandlers";

// 响应式对象映射表
export const reactiveMap = new WeakMap<object, any>()


export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}


/**
 * 创建响应式对象
 * @param target 目标对象
 * @returns 响应式对象
 */
export function reactive(target: object) {
    return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * 创建响应式对象
 * @param target 目标对象
 * @param baseHandlers 基础代理处理器
 * @param proxyMap 代理映射表
 * @returns 响应式对象
 */
function createReactiveObject(
    target: object,
    baseHandlers: ProxyHandler<any>,
    proxyMap: WeakMap<object, any>
) {
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}


export function toReactive(value) {
    return isObject(value) ? reactive(value) : value
}


export function isReactive(value): boolean {
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
