export function track(target: object, key: unknown) {
    console.log('依赖收集')
}

export function trigger(target: object, key: unknown, value: any) {
    console.log('触发更新')
}