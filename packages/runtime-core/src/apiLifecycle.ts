/*
 * @Author: 阿喜
 * @Date: 2023-08-07 19:54:42
 * @LastEditors: 阿喜
 * @LastEditTime: 2023-08-07 20:03:54
 * @FilePath: \vue-mini\packages\runtime-core\src\apiLifecycle.ts
 * @Description: 
 * 
 */
import { LifecycleHooks } from './component'


export function injectHook(
	type: LifecycleHooks,
	hook: Function,
	target
): Function | undefined {
	if (target) {
		target[type] = hook
		return hook
	}
}


export const createHook = (lifecycle: LifecycleHooks) => {
	return (hook, target) => injectHook(lifecycle, hook, target)
}

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
export const onMounted = createHook(LifecycleHooks.MOUNTED)
