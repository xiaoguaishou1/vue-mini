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
        /**
         * 运行响应式副作用函数
         */
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
     * 追踪响应式对象的依赖项
     * @param target - 响应式对象
     * @param key - 属性键
     */
    function track(target, key) {
        if (!activeEffect) {
            return;
        }
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        var dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        dep.add(activeEffect);
    }
    /**
     * 触发响应式对象的更新
     * @param target - 响应式对象
     * @param key - 属性键
     * @param value - 新值
     */
    function trigger(target, key, value) {
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            return;
        }
        var dep = depsMap.get(key);
        if (!dep) {
            return;
        }
        //触发依赖更新
        dep.forEach(function (effect) {
            if (effect) {
                effect.run();
            }
        });
    }

    var get = createGetter();
    var set = createSetter();
    var mutableHanders = {
        //实现set和get方法
        get: get,
        set: set
    };
    function createGetter() {
        return function get(target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            // console.log('拦截到了读取数据', target, key);
            //依赖收集
            track(target, key);
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, value, receiver) {
            var res = Reflect.set(target, key, value, receiver);
            // console.log('拦截到了设置数据', target, key, value);
            //触发更新
            trigger(target, key);
            return res;
        };
    }

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
    function toReactive(value) {
        return isObject(value) ? reactive(value) : value;
    }

    function ref(value) {
        return createRef(value);
    }
    function createRef(rawValue, shallow) {
        if (isRef(rawValue)) {
            return rawValue;
        }
        return new RefImpl(rawValue, shallow);
    }
    function trackRefValue(ref) {
        if (activeEffect) {
            trackEffects(ref.dep || (ref.dep = createDep()));
        }
    }
    function isRef(r) {
        return Boolean(r && r.__v_isRef === true);
    }
    var RefImpl = /** @class */ (function () {
        function RefImpl(value, _shallow) {
            if (_shallow === void 0) { _shallow = false; }
            this._shallow = _shallow;
            this.__v_isRef = true;
            this.dep = undefined;
            this._value = _shallow ? value : toReactive(value);
        }
        Object.defineProperty(RefImpl.prototype, "value", {
            get: function () {
                trackRefValue(this);
                return this._value;
            },
            set: function (newValue) {
                this._value = newValue;
            },
            enumerable: false,
            configurable: true
        });
        return RefImpl;
    }());

    exports.effect = effect;
    exports.reactive = reactive;
    exports.ref = ref;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
