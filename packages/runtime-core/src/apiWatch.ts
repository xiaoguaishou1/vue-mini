import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { isReactive } from 'packages/reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'


export interface WatchOptions<Immediate = boolean> {
	immediate?: Immediate
	deep?: boolean
}


export function watch(source, cb: Function, options?: WatchOptions) {
	return doWatch(source as any, cb, options)
}

function doWatch(
	source,
	cb: Function,
	{ immediate, deep }: WatchOptions = EMPTY_OBJ
) {

	let getter: () => any
	if (isReactive(source)) {
		getter = () => source
		deep = true
	} else {
		getter = () => { }
	}

	if (cb && deep) {
		const baseGetter = getter
		getter = () => traverse(baseGetter())
	}

	let oldValue = {}
	const job = () => {
		if (cb) {
 			const newValue = effect.run()
			if (deep || hasChanged(newValue, oldValue)) {
				cb(newValue, oldValue)
				oldValue = newValue
			}
		}
	}

 	let scheduler = () => queuePreFlushCb(job)

	const effect = new ReactiveEffect(getter, scheduler)

	if (cb) {
		if (immediate) {
			job()
		} else {
			oldValue = effect.run()
		}
	} else {
		effect.run()
	}

	return () => {
		effect.stop()
	}
}
 
export function traverse(value: unknown, seen?: Set<unknown>) {
	if (!isObject(value)) {
		return value
	}
	seen = seen || new Set()

	seen.add(value)

	for (const key in value as object) {
		traverse((value as any)[key], seen)
	}
	return value
}
