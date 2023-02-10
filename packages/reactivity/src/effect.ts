import { Dep } from "./dep";

/*
 * @Author: 阿喜
 * @Date: 2023-02-10 15:18:17
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-10 17:57:23
 * @FilePath: /vue3-mini-core/packages/reactivity/src/effect.ts
 * @Description: 
 * 
 */
type KeyToDepMap = Map<any, Dep>
//绑定依赖与函数的关系
const targetMap = new WeakMap<any, KeyToDepMap>();

/**
 * @description: 收集依赖 当依赖被触发时 需要根据依赖的key来获取
 * @return {*}
 */
export function track(target: object, key: unknown): any {
    //如果当前没有正在执行的effect 则不需要收集依赖
    if (!activeEffect) return;
    //获取当前target的依赖集合
    let depsMap = targetMap.get(target);
    //如果当前target没有依赖集合 则创建一个
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key);
    //如果当前key没有依赖集合 则创建一个
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    //添加依赖
    dep.add(activeEffect)
}

/**
 * @description: 依赖触发
 * @param {*} target 代理对象的key 当依赖被触发时 需要根据依赖的key来获取
 * @param {*} newValue 指定key的最新值
 * @param {*} oldValue 指定key的旧值
 * @return {*}
 */
export function trigger(target: object, key: unknown, newValue: unknown): any {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    //获取当前key的依赖集合
    const dep: Dep | undefined = depsMap.get(key);
    if (!dep) return;
    //遍历依赖集合 执行依赖
    dep.forEach(effect => {
        effect.run()
    })
}


/**
 * @description: 以ReactEffect实例为单位执行fn
 * @param {function} fn
 * @return {*}
 */
export function effect<T = any>(fn: () => T): void {
    //生成ReactEffect实例
    const _effect = new ReactiveEffect(fn);
    //执行run方法
    _effect.run()
}

// 保存当前正在执行的effect
export let activeEffect: ReactiveEffect | undefined;

/**
 * @description: 响应性触发依赖时的执行类
 * @param {*} any
 * @return {*}
 */
export class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {
        this.fn = fn
    }
    run() {
        // 保存当前正在执行的effect
        activeEffect = this;
        // 执行fn
        return this.fn()
    }
}