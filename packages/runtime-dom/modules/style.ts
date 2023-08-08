/*
 * @Author: 阿喜
 * @Date: 2023-08-08 22:29:35
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 22:34:53
 * @FilePath: \vue-mini\packages\runtime-dom\modules\style.ts
 * @Description: 
 * 
 */
/*
 * @Author: 阿喜
 * @Date: 2023-08-08 22:29:35
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 22:29:47
 * @FilePath: \vue-mini\packages\runtime-dom\modules\style.ts
 * @Description:
 * 
 */
import { isString } from '../../shared/src/index'

/**
 * 为 style 属性进行打补丁
 */
export function patchStyle(el: Element, prev, next) {
    // 获取 style 对象
    const style = (el as HTMLElement).style
    // 判断新的样式是否为纯字符串
    const isCssString = isString(next)
    if (next && !isCssString) {
        // 赋值新样式
        for (const key in next) {
            setStyle(style, key, next[key])
        }
        // 清理旧样式
        if (prev && !isString(prev)) {
            for (const key in prev) {
                if (next[key] == null) {
                    setStyle(style, key, '')
                }
            }
        }
    }
}

/**
 * 赋值样式
 */
function setStyle(
    style: CSSStyleDeclaration,
    name: string,
    val: string | string[]
) {
    style[name] = val
}
