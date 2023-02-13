/*
 * @Author: 阿喜
 * @Date: 2023-02-13 19:48:03
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-13 19:48:11
 * @FilePath: \vue3-core\packages\reactivity\src\ref.ts
 * @Description: 
 * 
 */
import { hasChanged } from '@vue/shared'
import { createDep, Dep } from './dep'
import { activeEffect, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'

export interface Ref<T = any> {
    value: T
}

export function ref(value?: unknown) {
    return createRef(value, false)
}


function createRef(rawValue: unknown, shallow: boolean) {
    if (isRef(rawValue)) {
        return rawValue
    }
    return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
    private _value: T
    private _rawValue: T

    public dep?: Dep = undefined

    // 是否为 ref 类型数据的标记
    public readonly __v_isRef = true

    constructor(value: T, public readonly __v_isShallow: boolean) {
        this._value = __v_isShallow ? value : toReactive(value)

        // 原始数据
        this._rawValue = value
    }


    get value() {
        // 收集依赖
        trackRefValue(this)
        return this._value
    }

    set value(newVal) {
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal
            this._value = toReactive(newVal)
            triggerRefValue(this)
        }
    }
}


export function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}


export function triggerRefValue(ref) {
    if (ref.dep) {
        triggerEffects(ref.dep)
    }
}


export function isRef(r: any): r is Ref {
    return !!(r && r.__v_isRef === true)
}
