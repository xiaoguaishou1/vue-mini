/*
 * @Author: 阿喜
 * @Date: 2023-08-03 22:55:38
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-03 23:19:53
 * @FilePath: \vue-mini\packages\runtime-core\src\h.ts
 * @Description: 
 * 
 */
import { isArray, isObject } from "../../shared/src/index";
import { createVNode, isVNode } from "./vnode";

export function h(type: any, propsOrChildren?: any, children?: any) {
    const l = arguments.length;
    if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren]);
            }
            return createVNode(type, propsOrChildren, []);
        } else {
            return createVNode(type, null, propsOrChildren);
        }
    } else {
        if (l > 3) {
            children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
            children = [children];
        }
        return createVNode(type, propsOrChildren, children);
    }
}