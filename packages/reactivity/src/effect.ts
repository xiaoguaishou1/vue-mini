/*
 * @Author: 阿喜
 * @Date: 2023-02-10 15:18:17
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-10 16:35:51
 * @FilePath: /vue3-mini-core/packages/reactivity/src/effect.ts
 * @Description: 
 * 
 */

/**
 * @description: 收集依赖 当依赖被触发时 需要根据依赖的key来获取
 * @return {*}
 */
export function track(target: object, key: unknown): any {
    console.log('收集依赖')
}

/**
 * @description: 依赖触发
 * @param {*} target 代理对象的key 当依赖被触发时 需要根据依赖的key来获取
 * @param {*} newValue 指定key的最新值
 * @param {*} oldValue 指定key的旧值
 * @return {*}
 */
export function trigger(target: object, key: unknown, newValue: unknown): any {
    console.log('依赖触发')
}



export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn);
    _effect.run()
}


export let activeEffect: ReactiveEffect | undefined;



export class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {
        this.fn = fn
    }

    run() {
        activeEffect = this;
        return this.fn()
    }

}