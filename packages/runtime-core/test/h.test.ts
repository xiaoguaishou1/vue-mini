/*
 * @Author: 阿喜
 * @Date: 2023-08-03 23:05:05
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-03 23:16:27
 * @FilePath: \vue-mini\packages\runtime-core\test\h.test.ts
 * @Description: 
 * 
 */
import { expect, test } from 'vitest'
import { h } from '../src/h'
import { createVNode } from '../src/vnode'

test('should handle 2 arguments where second argument is object but not Array or VNode', () => {
    const type = 'div';
    const props = { id: 'test' };
    const vnode = h(type, props);
    expect(vnode).toEqual(createVNode(type, props, []));
});

test('should handle 2 arguments where second argument is VNode', () => {
    const type = 'div';
    const childVNode = createVNode('span', null, 'Hello');
    const vnode = h(type, childVNode);
    expect(vnode).toEqual(createVNode(type, null, [childVNode]));
});

test('should handle 2 arguments where second argument is not object or VNode', () => {
    const type = 'div';
    const children = 'Hello';
    const vnode = h(type, children);
    expect(vnode).toEqual(createVNode(type, null, children));
});

test('should handle 3 arguments where third argument is VNode', () => {
    const type = 'div';
    const props = { id: 'test' };
    const childVNode = createVNode('span', null, 'Hello');
    const vnode = h(type, props, childVNode);
    expect(vnode).toEqual(createVNode(type, props, [childVNode]));
});

