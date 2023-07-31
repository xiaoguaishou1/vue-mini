
// 当前正在运行的响应式副作用函数
export let activeEffect: ReactiveEffect | undefined;

// 存储响应式对象的依赖项
type keyToDepMap = Map<any, ReactiveEffect>;
const targetMap = new WeakMap<object, keyToDepMap>();


/**
 * 创建一个响应式副作用函数
 * @param fn - 副作用函数
 * @param options - 副作用函数选项
 */
export function effect<T = any>(fn: () => T, options?: any): any {
    const _effect = new ReactiveEffect(fn, options);
    _effect.run();
}



/**
 * 响应式副作用函数类
 * @param fn - 副作用函数
 * @param options - 副作用函数选项
 */
export class ReactiveEffect<T = any> {
    constructor(public fn: () => T, public options?: any) {
        this.fn = fn;
        this.options = options;
    }

    /**
     * 运行响应式副作用函数
     */
    run() {
        activeEffect = this;
        this.fn();
    }
}



/**
 * 追踪响应式对象的依赖项
 * @param target - 响应式对象
 * @param key - 属性键
 */
export function track(target: object, key: unknown) {
    if (!activeEffect) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    depsMap.set(key, activeEffect);

    console.log(targetMap)
}

/**
 * 触发响应式对象的更新
 * @param target - 响应式对象
 * @param key - 属性键
 * @param value - 新值
 */
export function trigger(target: object, key: unknown, value: any) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const effects = depsMap.get(key);
    if (effects) {
        // effects.run();
        console.log(effects)
        effects.fn();
    }
}



