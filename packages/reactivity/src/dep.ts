/*
 * @Author: 阿喜
 * @Date: 2023-02-10 22:46:54
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-02-10 22:48:38
 * @FilePath: \vue3-core\packages\reactivity\src\dep.ts
 * @Description: 
 * 
 */
import { ReactiveEffect } from "./effect";

export type Dep = Set<ReactiveEffect>;

export const createDep = (effects?: ReactiveEffect[]) => {
    const dep = new Set<ReactiveEffect>(effects) as Dep
    return dep
}