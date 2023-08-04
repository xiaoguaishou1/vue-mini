/*
 * @Author: 阿喜
 * @Date: 2023-08-05 00:45:51
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-05 00:47:30
 * @FilePath: \vue-mini\packages\reactivity\test\dep.test.ts
 * @Description: 
 * 
 */
import { describe, it, expect } from 'vitest'
import { createDep } from '../src/dep'
import { ReactiveEffect } from '../src/effect'

describe('createDep', () => {
    it('should create a Dep with given ReactiveEffect', () => {
        const effect = new ReactiveEffect(() => { })
        const dep = createDep(effect)

        expect(dep.has(effect)).toBeTruthy()
    })

    it('should create an empty Dep when no ReactiveEffect is provided', () => {
        const dep = createDep()
        console.log(dep)
        expect(dep.size).toBe(0)
    })
})
