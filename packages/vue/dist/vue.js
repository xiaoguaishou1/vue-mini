var Vue = (function (exports) {
    'use strict';

    //绑定依赖与函数的关系
    var targetMap = new WeakMap();
    /**
     * @description: 收集依赖 当依赖被触发时 需要根据依赖的key来获取
     * @return {*}
     */
    function track(target, key) {
        //如果当前没有正在执行的effect 则不需要收集依赖
        if (!activeEffect)
            return;
        //获取当前target的依赖集合
        var depsMap = targetMap.get(target);
        //如果当前target没有依赖集合 则创建一个
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        //为当前target的依赖集合添加依赖 设置回调函数
        depsMap.set(key, activeEffect);
        console.log('targetMap', targetMap);
    }
    /**
     * @description: 依赖触发
     * @param {*} target 代理对象的key 当依赖被触发时 需要根据依赖的key来获取
     * @param {*} newValue 指定key的最新值
     * @param {*} oldValue 指定key的旧值
     * @return {*}
     */
    function trigger(target, key, newValue) {
        var depsMap = targetMap.get(target);
        if (!depsMap)
            return;
        //获取当前key的依赖集合
        var effects = depsMap.get(key);
        if (effects) {
            //执行依赖集合中的所有依赖
            effects.run();
        }
    }
    /**
     * @description: 以ReactEffect实例为单位执行fn
     * @param {function} fn
     * @return {*}
     */
    function effect(fn) {
        //生成ReactEffect实例
        var _effect = new ReactiveEffect(fn);
        //执行run方法
        _effect.run();
    }
    // 保存当前正在执行的effect
    var activeEffect;
    /**
     * @description: 响应性触发依赖时的执行类
     * @param {*} any
     * @return {*}
     */
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn) {
            this.fn = fn;
            this.fn = fn;
        }
        ReactiveEffect.prototype.run = function () {
            // 保存当前正在执行的effect
            activeEffect = this;
            // 执行fn
            return this.fn();
        };
        return ReactiveEffect;
    }());

    /*
     * @Author: 阿喜
     * @Date: 2023-02-10 14:16:04
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-02-10 15:33:26
     * @FilePath: /vue3-mini-core/packages/reactivity/src/baseHandlers.ts
     * @Description: 实现框架中的createGetter  createSetter
     *
     */
    var get = createGetter(); // 回调函数
    var set = createSetter(); // 回调函数
    /**
     * @description: 监听代理对象
     * @return {*}
     */
    var mutableHandlers = {
        get: get,
        set: set
    };
    function createGetter(isReadonly, shallow) {
        return function get(target, key, receiver) {
            //利用Reflect.get方法获取值
            var res = Reflect.get(target, key, receiver);
            //收集依赖
            track(target, key);
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, value, receiver) {
            //使用Reflect.set方法设置值
            var res = Reflect.set(target, key, value, receiver);
            //触发依赖
            trigger(target, key);
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

    exports.effect = effect;
    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
