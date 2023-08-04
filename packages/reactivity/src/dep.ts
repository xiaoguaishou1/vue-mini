import { ReactiveEffect } from "./effect";

export type Dep = Set<ReactiveEffect>


export const createDep = (effects?: ReactiveEffect) => {
    const dep = new Set<ReactiveEffect>()
    if (effects) dep.add(effects)
    return dep
}