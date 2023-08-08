/*
 * @Author: 阿喜
 * @Date: 2023-08-07 19:55:33
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-08 22:21:45
 * @FilePath: \vue-mini\packages\runtime-core\src\normalizeProp.ts
 * @Description: 
 * 
 */
import { isArray, isObject, isString } from 'packages/shared/src/index'


export function normalizeClass(value: unknown): string {
	let res = ''
	if (isString(value)) {
		res = value
	}
	else if (isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			const normalized = normalizeClass(value[i])
			if (normalized) {
				res += normalized + ' '
			}
		}
	}
	else if (isObject(value)) {
		for (const name in value as object) {
			if ((value as object)[name]) {
				res += name + ' '
			}
		}
	}

	return res.trim()
}
