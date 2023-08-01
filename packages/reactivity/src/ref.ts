import { createDep, Dep } from "./dep";
import { activeEffect ,trackEffects } from "./effect";
import { toReactive } from "./reactive";

/*
 * @Author: 阿喜
 * @Date: 2023-07-31 21:20:09
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-02 00:01:11
 * @FilePath: \vue-mini\packages\reactivity\src\ref.ts
 * @Description: 
 * 
 */
export interface Ref<T = any> {
    value: T;
}


export function ref(value?: unknown) {
    return createRef(value);
}

function createRef(rawValue: unknown, shallow?: boolean) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    return new RefImpl(rawValue, shallow);
}

export function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(ref.dep || (ref.dep = createDep()));
    }
}


function isRef(r: any): r is Ref {
    return Boolean(r && r.__v_isRef === true);
}

class RefImpl<T = unknown> {
    private _value: T;
    public readonly __v_isRef = true;
    public dep?: Dep = undefined;
    constructor(value: T, public readonly _shallow = false) {
        this._value = _shallow ? value : toReactive(value);
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }

    set value(newValue) {
        this._value = newValue;
    }
}