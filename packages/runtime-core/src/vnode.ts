import { isArray, isFunction, isString } from "@vue/shared";
import { ShapeFlags } from "packages/shared/src/shapeFlags";

export interface VNode {
    __is_isVNode: true;
    type: any;
    props: any;
    children: any;
    shapeFlag: number;
}

export function isVNode(value: any): value is VNode {
    return value ? value.__is_isVNode === true : false;
}

export function createVNode(type, props, children): VNode {
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    return createBaseVNode(type, props, children, shapeFlag);
}


export function createBaseVNode(type, props, children, shapeFlag: number): VNode {
    const vnode = {
        __is_isVNode: true,
        type,
        props,
        children,
        shapeFlag
    } as VNode;
    normalizeChildren(vnode, children);
    return vnode;
}

export function normalizeChildren(vnode: VNode, children: unknown) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children === null) {
        children = [];
        //数组
    } else if (isArray(children)) {
        //对象
    } else if (typeof children === 'object') {
        //函数
    } else if (isFunction(children)) {
        //字符串
    } else {
        children = String(children)
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.children = children;
    //按位或运算
    vnode.shapeFlag |= type;
}






