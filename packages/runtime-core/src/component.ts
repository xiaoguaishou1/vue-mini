import { reactive } from '@vue/reactivity'
import { isFunction, isObject } from '@vue/shared'
import { onBeforeMount, onMounted } from './apiLifecycle'

let uid = 0


export const enum LifecycleHooks {
	BEFORE_CREATE = 'bc',
	CREATED = 'c',
	BEFORE_MOUNT = 'bm',
	MOUNTED = 'm'
}


export function createComponentInstance(vnode) {
	const type = vnode.type

	const instance = {
		uid: uid++, // 唯一标记
		vnode, // 虚拟节点
		type, // 组件类型
		subTree: null!, // render 函数的返回值
		effect: null!, // ReactiveEffect 实例
		update: null!, // update 函数，触发 effect.run
		render: null, // 组件内的 render 函数
		// 生命周期相关
		isMounted: false, // 是否挂载
		bc: null, // beforeCreate
		c: null, // created
		bm: null, // beforeMount
		m: null // mounted
	}

	return instance
}


export function setupComponent(instance) {
	const setupResult = setupStatefulComponent(instance)
	return setupResult
}

function setupStatefulComponent(instance) {
	const Component = instance.type
	const { setup } = Component
	if (setup) {
		const setupResult = setup()
		handleSetupResult(instance, setupResult)
	} else {
		finishComponentSetup(instance)
	}
}

export function handleSetupResult(instance, setupResult) {
	if (isFunction(setupResult)) {
		instance.render = setupResult
	}
	finishComponentSetup(instance)
}

export function finishComponentSetup(instance) {
	const Component = instance.type

	if (!instance.render) {
		if (compile && !Component.render) {
			if (Component.template) {
				const template = Component.template
				Component.render = compile(template)
			}
		}

		instance.render = Component.render
	}

	applyOptions(instance)
}
function applyOptions(instance: any) {
	const {
		data: dataOptions,
		beforeCreate,
		created,
		beforeMount,
		mounted
	} = instance.type


	if (beforeCreate) {
		callHook(beforeCreate, instance.data)
	}

	if (dataOptions) {
		const data = dataOptions()
		if (isObject(data)) {
			instance.data = reactive(data)
		}
	}


	if (created) {
		callHook(created, instance.data)
	}

	function registerLifecycleHook(register: Function, hook?: Function) {
		register(hook?.bind(instance.data), instance)
	}


	registerLifecycleHook(onBeforeMount, beforeMount)
	registerLifecycleHook(onMounted, mounted)
}


function callHook(hook: Function, proxy) {
	hook.bind(proxy)()
}


let compile


export function registerRuntimeCompiler(_compile: any) {
	compile = _compile
}
