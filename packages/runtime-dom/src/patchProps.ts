/*
 * @Author: 阿喜
 * @Date: 2023-08-08 21:07:18
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 21:11:43
 * @FilePath: \vue-mini\packages\runtime-dom\src\patchProps.ts
 * @Description: 
 * 
 */
import { isOn } from "@vue/shared"
import { patchAttr } from '../modules/attrs'
import { patchClass } from '../modules/class'
import { patchDOMProp } from '../modules/props'
import { patchStyle } from '../modules/style'
import { patchEvent } from '../modules/event'

export const patchProp = (
    el: Element,
    key: string,
    prevValue: any,
    nextValue: any
) => {
    if (key === 'class') {
        patchClass(el, nextValue)
    } else if (key === 'style') {
        patchStyle(el, prevValue, nextValue)
    } else if (isOn(key)) {
        patchEvent(el, key, prevValue, nextValue)
    } else if (key in el) {
        patchDOMProp(el, key, nextValue)
    } else {
        patchAttr(el, key, nextValue)
    }
}
