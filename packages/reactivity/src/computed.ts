/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:20:09
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-06 17:28:38
 * @FilePath: \vue-mini\packages\reactivity\src\computed.ts
 * @Description: 
 * 
 */
import { isFunction } from "../../shared/src/index";
import { Dep } from './dep'
import { ReactiveEffect } from './effect';
import { trackRefValue, triggerRefValue } from './ref';


// 声明一个泛型类 ComputedRefImpl，用于创建计算属性的引用对象
export class ComputedRefImpl<T> {
    // 计算属性的依赖对象，可选值，初始化为 undefined
    public dep?: Dep = undefined;

    // 存储计算属性的计算结果
    public _value!: T;

    // 表示计算属性的计算结果是否过期，初始值为 true
    public _dirty = true;

    // 计算属性的响应式效果，用于依赖收集和派发更新
    public readonly effect: ReactiveEffect<T>

    // 标记此对象为计算属性的引用对象
    public readonly __v_isRef = true;

    // 构造函数，接收一个 getter 函数用于计算属性的计算
    constructor(getter) {
        // 创建一个新的响应式效果 ReactiveEffect 对象
        this.effect = new ReactiveEffect(getter, () => {
            // 当计算属性的依赖发生变化时，设置 _dirty 为 true，标记计算结果过期
            if (!this._dirty) {
                this._dirty = true;
                triggerRefValue(this);
            }
        });

        // 将当前计算属性对象设置为响应式效果的 computed 属性
        this.effect.computed = this;
    }

    // 计算属性的 getter 方法，用于获取计算属性的值
    get value() {
        // 收集计算属性的依赖
        trackRefValue(this);

        if (this._dirty) {
            this._dirty = false;
            // 如果计算结果过期（_dirty 为 true），重新计算计算属性的值
            this._value = this.effect.fn();
        }


        // 返回计算属性的计算结果
        return this._value;
    }
}

// 定义一个工厂函数 computed，用于创建计算属性的引用对象
export function computed(getterOrOption) {
    let getter

    // 判断传入的参数是否为函数，如果是，则直接赋值给 getter
    const onlyGetter = isFunction(getterOrOption)
    if (onlyGetter) {
        getter = getterOrOption
    }

    // 创建并返回计算属性的引用对象 ComputedRefImpl
    const cRef = new ComputedRefImpl(getter)
    return cRef
}
