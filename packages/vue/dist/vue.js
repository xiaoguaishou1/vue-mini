var Vue = (function (exports) {
    'use strict';

    /*
     * @Author: 阿喜
     * @Date: 2023-02-10 15:18:17
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-02-10 15:26:34
     * @FilePath: /vue3-mini-core/packages/reactivity/src/effect.ts
     * @Description:
     *
     */
    /**
     * @description: 收集依赖
     * @return {*}
     */
    function track(target, key) {
        console.log('收集依赖');
    }
    /**
     * @description: 依赖触发
     * @return {*}
     */
    function trigger(target, key, newValue) {
        console.log('依赖触发');
    }

    /*
     * @Author: 阿喜
     * @Date: 2023-02-10 14:16:04
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-02-10 15:21:08
     * @FilePath: /vue3-mini-core/packages/reactivity/src/baseHandlers.ts
     * @Description:
     *
     */
    var get = createGetter();
    var set = createSetter();
    var mutableHandlers = {
        get: get,
        set: set
    };
    function createGetter(isReadonly, shallow) {
        return function get(target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            track();
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, value, receiver) {
            var res = Reflect.set(target, key, value, receiver);
            trigger();
            return res;
        };
    }

    /*
     * @Author: 阿喜
     * @Date: 2023-02-10 14:10:08
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-02-10 14:43:58
     * @FilePath: /vue3-mini-core/packages/reactivity/src/reactive.ts
     * @Description:  构建响应式对象 reactive
     * Map和WeakMap的区别 来源csdn:https://blog.csdn.net/qq_26834399/article/details/105071907
     */
    /**
     * @description: 使用 WeakMap 保存响应式对象
     * @return {*}
     */
    var reactiveMap = new WeakMap();
    /**
     * @description:
     * @param {object} target
     * @param {*} mutableHandlers
     * @param {*} reactiveMap
     * @return {*}
     */
    function reactive(target) {
        //创建响应式对象 
        return createReactiveObject(target, mutableHandlers, reactiveMap);
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
    function createReactiveObject(target, baseHandler, proxyMap) {
        var existingProxy = proxyMap.get(target);
        // 如果已经是响应式对象，直接返回
        if (existingProxy) {
            return existingProxy;
        }
        // 如果不是响应式对象，创建一个响应式对象
        var proxy = new Proxy(target, baseHandler);
        // 将响应式对象保存到 WeakMap 中
        proxyMap.set(target, proxy);
        // 返回响应式对象
        return proxy;
    }

    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
