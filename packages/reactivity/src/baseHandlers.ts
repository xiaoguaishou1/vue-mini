import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();


export const mutableHanders: ProxyHandler<object> = {
    //实现set和get方法
    get,
    set
}

function createGetter() {
    // 依照源码实现闭包
    return function get(target: object, key: string | symbol, receiver: object) {
        const res = Reflect.get(target, key, receiver);
        // console.log('拦截到了读取数据', target, key);
        //依赖收集
        track(target, key);
        return res;
    }
}


function createSetter() {
    return function set(target: object, key: string | symbol, value: any, receiver: object) {
        const res = Reflect.set(target, key, value, receiver);
        // console.log('拦截到了设置数据', target, key, value);
        //触发更新
        trigger(target, key, value);
        return res;
    }
}

