import { track, trigger } from "./effect";

/*
 * @Author: 阿喜
 * @Date: 2023-02-10 14:16:04
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-13 19:58:19
 * @FilePath: \vue3-core\packages\reactivity\src\baseHandlers.ts
 * @Description: 实现框架中的createGetter  createSetter
 * 
 */
const get = createGetter(); // 回调函数
const set = createSetter(); // 回调函数



/**
 * @description: 监听代理对象
 * @return {*}
 */
export const mutableHandlers: ProxyHandler<object> = {
    get,
    set
}


function createGetter() {
    return function get(target: object, key: string | symbol, receiver: object) {
        //利用Reflect.get方法获取值
        const res = Reflect.get(target, key, receiver);
        //收集依赖
        track(target, key)
        return res;
    }
}

function createSetter() {
    return function set(target: object, key: string | symbol, value: unknown, receiver: object) {
        //使用Reflect.set方法设置值
        const res = Reflect.set(target, key, value, receiver);
        //触发依赖
        trigger(target, key)
        return res
    }
}



