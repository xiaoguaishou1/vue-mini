var Vue = (function (exports) {
    'use strict';

    /*
     * @Author: 阿喜
     * @Date: 2023-07-31 21:09:16
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-08-02 21:46:02
     * @FilePath: \vue-mini\packages\shared\src\index.ts
     * @Description:
     *
     */
    /**
     * 判断是否为一个数组
     */
    var isArray = Array.isArray;
    var hasChanged = function (value, oldValue) {
        return !Object.is(value, oldValue);
    };
    var isObject = function (val) {
        return val !== null && typeof val === 'object';
    };
    var isFunction = function (val) {
        return typeof val === 'function';
    };
    var isString = function (val) {
        return typeof val === 'string';
    };

    var createDep = function (effects) {
        var dep = new Set();
        dep.add(effects);
        return dep;
    };

    // 当前正在运行的响应式副作用函数
    var activeEffect;
    var targetMap = new WeakMap();
    /**
     * 创建一个响应式副作用函数
     * @param fn - 副作用函数
     * @param options - 副作用函数选项
     */
    function effect(fn, options) {
        var _effect = new ReactiveEffect(fn, options);
        _effect.run();
    }
    function trackEffects(dep) {
        if (activeEffect) {
            dep.add(activeEffect);
        }
    }
    /**
     * 响应式副作用函数类
     * @param fn - 副作用函数
     * @param options - 副作用函数选项
     */
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn, options) {
            this.fn = fn;
            this.options = options;
            this.fn = fn;
            this.options = options;
        }
        /**
         * 运行响应式副作用函数
         */
        ReactiveEffect.prototype.run = function () {
            activeEffect = this;
            this.fn();
        };
        return ReactiveEffect;
    }());
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
        // 依照源码实现闭包
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
    function triggerRefValue(ref) {
        if (ref.dep)
            trackEffects(ref.dep);
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
                if (hasChanged(newValue, this.oldRawValue)) {
                    this.oldRawValue = newValue;
                    this._value = toReactive(newValue);
                    triggerRefValue(this);
                }
            },
            enumerable: false,
            configurable: true
        });
        return RefImpl;
    }());

    /*
     * @Author: 阿喜
     * @Date: 2023-07-31 21:20:09
     * @LastEditors: 阿喜
     * @LastEditTime: 2023-08-02 22:10:49
     * @FilePath: \vue-mini\packages\reactivity\src\computed.ts
     * @Description:
     *
     */
    var ComputedRefImpl = /** @class */ (function () {
        function ComputedRefImpl(getter) {
            var _this = this;
            this.dep = undefined;
            this._dirty = true;
            this.__v_isRef = true;
            this.effect = new ReactiveEffect(getter, function () {
                if (!_this._dirty) {
                    _this._dirty = true;
                }
            });
            this.effect.computed = this;
        }
        Object.defineProperty(ComputedRefImpl.prototype, "value", {
            get: function () {
                trackRefValue(this);
                this._value = this.effect.fn();
                return this._value;
            },
            enumerable: false,
            configurable: true
        });
        return ComputedRefImpl;
    }());
    function computed(getterOrOption) {
        var getter;
        var onlyGetter = isFunction(getterOrOption);
        if (onlyGetter) {
            getter = getterOrOption;
        }
        var cRef = new ComputedRefImpl(getter);
        return cRef;
    }

    function isVNode(value) {
        return value ? value.__is_isVNode === true : false;
    }
    function createVNode(type, props, children) {
        var shapeFlag = isString(type) ? 1 /* ShapeFlags.ELEMENT */ : 0;
        return createBaseVNode(type, props, children, shapeFlag);
    }
    function createBaseVNode(type, props, children, shapeFlag) {
        var vnode = {
            __is_isVNode: true,
            type: type,
            props: props,
            children: children,
            shapeFlag: shapeFlag
        };
        normalizeChildren(vnode, children);
        return vnode;
    }
    function normalizeChildren(vnode, children) {
        var type = 0;
        vnode.shapeFlag;
        if (children === null) {
            children = [];
            //数组
        }
        else if (isArray(children)) ;
        else if (typeof children === 'object') ;
        else if (isFunction(children)) ;
        else {
            children = String(children);
            type = 8 /* ShapeFlags.TEXT_CHILDREN */;
        }
        vnode.children = children;
        //按位或运算
        vnode.shapeFlag |= type;
    }

    function h(type, propsOrChildren, children) {
        var l = arguments.length;
        if (l === 2) {
            if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
                if (isVNode(propsOrChildren)) {
                    return createVNode(type, null, [propsOrChildren]);
                }
                return createVNode(type, propsOrChildren, []);
            }
            else {
                return createVNode(type, null, propsOrChildren);
            }
        }
        else {
            if (l > 3) {
                children = Array.prototype.slice.call(arguments, 2);
            }
            else if (l === 3 && isVNode(children)) {
                children = [children];
            }
            return createVNode(type, propsOrChildren, children);
        }
    }

    exports.computed = computed;
    exports.effect = effect;
    exports.h = h;
    exports.reactive = reactive;
    exports.ref = ref;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
