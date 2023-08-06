/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:20:09
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-06 17:35:39
 * @FilePath: \vue-mini\packages\reactivity\src\computed.ts
 * @Description: 
 * 
 */
import { isFunction } from '@vue/shared'
import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

/**
 * 计算属性类
 */
export class ComputedRefImpl<T> {
    public dep?: Dep = undefined
    private _value!: T

    public readonly effect: ReactiveEffect<T>

    public readonly __v_isRef = true


    public _dirty = true

    constructor(getter) {
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
    }

    get value() {
        trackRefValue(this)
        if (this._dirty) {
            this._dirty = false
            this._value = this.effect.run()!
        }
        return this._value
    }
}


export function computed(getterOrOptions) {
    let getter

    const onlyGetter = isFunction(getterOrOptions)
    if (onlyGetter) {
        getter = getterOrOptions
    }

    const cRef = new ComputedRefImpl(getter)

    return cRef as any
}
