import { mutableHanders } from "./baseHandlers";

// 响应式对象映射表
export const reactiveMap = new WeakMap<object, any>()

/**
 * 创建响应式对象
 * @param target 目标对象
 * @returns 响应式对象
 */
export function reactive(target: object) {
    return createReactiveObject(target, mutableHanders, reactiveMap)
}

/**
 * 创建响应式对象
 * @param target 目标对象
 * @param baseHandlers 基础代理处理器
 * @param proxyMap 代理映射表
 */

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
