/*
 * @Author: 阿喜
 * @Date: 2023-08-03 22:18:09
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-03 22:23:25
 * @FilePath: \vue-mini\packages\shared\src\shapeFlags.ts
 * @Description: ShapeFlags 枚举
 * 
 */
export const enum ShapeFlags {
  ELEMENT = 1, // 表示一个普通的 HTML 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 表示一个函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 表示一个有状态的组件
  TEXT_CHILDREN = 1 << 3, // 表示有文本类型的子节点
  ARRAY_CHILDREN = 1 << 4, // 表示有数组类型的子节点
  SLOTS_CHILDREN = 1 << 5, // 表示有插槽类型的子节点
  TELEPORT = 1 << 6, // 表示 Teleport 组件，可以在其它的DOM元素里面渲染内容
  SUSPENSE = 1 << 7, // 表示 Suspense 组件，可以进行异步操作并提供 fallback 渲染
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 表示该组件应该被保持活跃（如在<keep-alive>内）
  COMPONENT_KEPT_ALIVE = 1 << 9, // 表示该组件目前正在被保持活跃
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 表示组件，既可以是函数式组件也可以是有状态组件
}
