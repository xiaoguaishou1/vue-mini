/*
 * @Author: 阿喜
 * @Date: 2023-02-10 22:19:55
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-13 19:55:37
 * @FilePath: \vue3-core\packages\reactivity\src\effect.ts
 * @Description: 
 * 
 */
import { extend, isArray } from '@vue/shared'
import { ComputedRefImpl } from './computed'
import { createDep, Dep } from './dep'

export type EffectScheduler = (...args: any[]) => any

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function track(target: object, key: unknown) {
    // 如果当前不存在执行函数，则直接 return
    if (!activeEffect) return
    // 尝试从 targetMap 中，根据 target 获取 map
    let depsMap = targetMap.get(target)
    // 如果 map 不存在，则生成新的 map，并把该对象赋值给对应的 value
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    // 获取指定 key 的 dep
    let dep = depsMap.get(key)
    // 如果 dep 不存在，则生成新的 dep，并把该对象赋值给对应的 value
    if (!dep) {
        depsMap.set(key, (dep = createDep()))
    }

    trackEffects(dep)
}
export function trackEffects(dep: Dep) {
    // activeEffect
    dep.add(activeEffect!)
}


export function trigger(target: object, key?: unknown) {
    // 获取 target 对应的 map
    const depsMap = targetMap.get(target)
    // 如果 map 不存在，则直接 return
    if (!depsMap) {
        return
    }
    // 如果 key 不存在，则遍历 map，触发所有的 effect
    let dep: Dep | undefined = depsMap.get(key)
    if (!dep) {
        return
    }
    triggerEffects(dep)
}

//以此触发依赖
export function triggerEffects(dep: Dep) {
    const effects = isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        if (effect.computed) {
            triggerEffect(effect)
        }
    }
    for (const effect of effects) {
        if (!effect.computed) {
            triggerEffect(effect)
        }
    }
}

//触发 effect
export function triggerEffect(effect: ReactiveEffect) {
    if (effect.scheduler) {
        effect.scheduler()
    } else {
        effect.run()
    }
}

//当前的 effect

export let activeEffect: ReactiveEffect | undefined
export class ReactiveEffect<T = any> {
    computed?: ComputedRefImpl<T>
    constructor(
        public fn: () => T,
        public scheduler: EffectScheduler | null = null
    ) { }

    run() {
        activeEffect = this
        return this.fn()
    }

    stop() { }
}

export interface ReactiveEffectOptions {
    lazy?: boolean
    scheduler?: EffectScheduler
}


export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
    // 生成 ReactiveEffect 
    const _effect = new ReactiveEffect(fn)
    if (options) {
        extend(_effect, options)
    }

    if (!options || !options.lazy) {
        _effect.run()
    }
}
