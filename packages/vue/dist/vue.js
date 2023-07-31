var Vue = (function (exports) {
    'use strict';

    var mutableHanders = {};

    // 响应式对象映射表
    var reactiveMap = new WeakMap();
    /**
     * 创建响应式对象
     * @param target 目标对象
     * @returns 响应式对象
     */
    function reactive(target) {
        return createReactiveObject(target, mutableHanders, reactiveMap);
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
    function createReactiveObject(target, baseHandlers, proxyMap) {
        var existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        var proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
