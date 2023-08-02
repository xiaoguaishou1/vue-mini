/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:20:09
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-02 22:10:49
 * @FilePath: \vue-mini\packages\reactivity\src\computed.ts
 * @Description: 
 * 
 */
import { isFunction } from '@vue/shared'
import { Dep } from './dep'
import { ReactiveEffect } from './effect';
import { trackRefValue } from './ref';


export class ComputedRefImpl<T> {
    public dep?: Dep = undefined;
    public _value!: T;
    public _dirty = true;
    public readonly effect: ReactiveEffect<T>
    public readonly __v_isRef = true
    constructor(getter) {
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
        this.effect.computed = this;
    }

    get value() {
        trackRefValue(this);
        this._value = this.effect.fn()
        return this._value
    }
}

export function computed(getterOrOption) {
    let getter

    const onlyGetter = isFunction(getterOrOption)

    if (onlyGetter) {
        getter = getterOrOption
    }

    const cRef = new ComputedRefImpl(getter)

    return cRef
}

