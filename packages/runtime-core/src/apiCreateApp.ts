import { createVNode } from './vnode'


export function createAppAPI<HostElement>(render) {
	return function createApp(rootComponent, rootProps = null) {
		const app = {
			_component: rootComponent,
			_container: null,
			mount(rootContainer: HostElement): any {
				const vnode = createVNode(rootComponent, rootProps)
				render(vnode, rootContainer)
			}
		}

		return app
	}
}
