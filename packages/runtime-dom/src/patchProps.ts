/*
 * @Author: 阿喜
 * @Date: 2023-08-08 21:07:18
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 21:11:43
 * @FilePath: \vue-mini\packages\runtime-dom\src\patchProps.ts
 * @Description: 
 * 
 */
import { isOn } from "@vue/shared";
import { patchClass } from './modules/class'
export const patchProp = (el: Element, key, prevValue, nextValue) => {
    // console.log(el, key, prevValue, nextValue)
    if (key === 'textContent') {
        el.textContent = nextValue;
    } else if (key === 'style') {
        patchClass(el, nextValue);
    } else if (isOn(key)) {

    } else {

    }
}