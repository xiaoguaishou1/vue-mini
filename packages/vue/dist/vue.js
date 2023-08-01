var Vue = (function (exports) {
    'use strict';

    /**
     * 判断是否为一个数组
     */
    var isArray = Array.isArray;
    var extend = Object.assign;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var createDep = function (effects) {
        var dep = new Set(effects);
        return dep;
    };

    var targetMap = new WeakMap();
    function track(target, key) {
        // 如果当前不存在执行函数，则直接 return
        if (!activeEffect)
            return;
        // 尝试从 targetMap 中，根据 target 获取 map
        var depsMap = targetMap.get(target);
        // 如果 map 不存在，则生成新的 map，并把该对象赋值给对应的 value
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        // 获取指定 key 的 dep
        var dep = depsMap.get(key);
        // 如果 dep 不存在，则生成新的 dep，并把该对象赋值给对应的 value
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        trackEffects(dep);
    }
    function trackEffects(dep) {
        // activeEffect
        dep.add(activeEffect);
    }
    function trigger(target, key) {
        // 获取 target 对应的 map
        var depsMap = targetMap.get(target);
        // 如果 map 不存在，则直接 return
        if (!depsMap) {
            return;
        }
        // 如果 key 不存在，则遍历 map，触发所有的 effect
        var dep = depsMap.get(key);
        if (!dep) {
            return;
        }
        triggerEffects(dep);
    }
    //以此触发依赖
    function triggerEffects(dep) {
        var e_1, _a, e_2, _b;
        var effects = isArray(dep) ? dep : __spreadArray([], __read(dep), false);
        try {
            for (var effects_1 = __values(effects), effects_1_1 = effects_1.next(); !effects_1_1.done; effects_1_1 = effects_1.next()) {
                var effect_1 = effects_1_1.value;
                if (effect_1.computed) {
                    triggerEffect(effect_1);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return)) _a.call(effects_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var effects_2 = __values(effects), effects_2_1 = effects_2.next(); !effects_2_1.done; effects_2_1 = effects_2.next()) {
                var effect_2 = effects_2_1.value;
                if (!effect_2.computed) {
                    triggerEffect(effect_2);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (effects_2_1 && !effects_2_1.done && (_b = effects_2.return)) _b.call(effects_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    //触发 effect
    function triggerEffect(effect) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
    //当前的 effect
    var activeEffect;
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn, scheduler) {
            if (scheduler === void 0) { scheduler = null; }
            this.fn = fn;
            this.scheduler = scheduler;
        }
        ReactiveEffect.prototype.run = function () {
            activeEffect = this;
            return this.fn();
        };
        ReactiveEffect.prototype.stop = function () { };
        return ReactiveEffect;
    }());
    function effect(fn, options) {
        // 生成 ReactiveEffect 
        var _effect = new ReactiveEffect(fn);
        if (options) {
            extend(_effect, options);
        }
        if (!options || !options.lazy) {
            _effect.run();
        }
    }

    /*
     * @Author: 阿喜
     * @Date: 2023-02-10 14:16:04
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-02-13 19:58:19
     * @FilePath: \vue3-core\packages\reactivity\src\baseHandlers.ts
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
    function createGetter() {
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
     * @LastEditTime: 2023-02-10 23:22:43
     * @FilePath: \vue3-core\packages\reactivity\src\reactive.ts
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
