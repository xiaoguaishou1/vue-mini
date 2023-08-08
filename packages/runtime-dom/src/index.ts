/*
 * @Author: 阿喜
 * @Date: 2023-08-08 22:24:46
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 22:36:02
 * @FilePath: \vue-mini\packages\runtime-dom\src\index.ts
 * @Description: 
 * 
 */
import { createRenderer } from '../../runtime-core/src/index'
import { extend, isString } from '../../shared/src/index'
import { nodeOps } from '../src/nodeOps'
import { patchProp } from '../src/patchProps'
const rendererOptions = extend({ patchProp }, nodeOps)

let renderer

function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions))
}

export const render = (...args) => {
    ensureRenderer().render(...args)
}