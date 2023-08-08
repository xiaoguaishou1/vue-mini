/*
 * @Author: 阿喜
 * @Date: 2023-08-08 21:09:38
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 21:11:18
 * @FilePath: \vue-mini\packages\runtime-dom\modules\class.ts
 * @Description: 
 * 
 */
export function patchClass(el: Element, value: string) {
    if (value === null) {
        el.removeAttribute('class');
    } else {
        el.className = value;
    }
}