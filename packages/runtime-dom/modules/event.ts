
/**
 * 为 event 事件进行打补丁
 */
export function patchEvent(
    el: Element & { _vei?: object },
    rawName: string,
    prevValue,
    nextValue
) {

    const invokers = el._vei || (el._vei = {})

    const existingInvoker = invokers[rawName]
    if (nextValue && existingInvoker) {
        existingInvoker.value = nextValue
    } else {
        const name = parseName(rawName)
        if (nextValue) {
            const invoker = (invokers[rawName] = createInvoker(nextValue))
            el.addEventListener(name, invoker)
        } else if (existingInvoker) {
            el.removeEventListener(name, existingInvoker)
            invokers[rawName] = undefined
        }
    }
}


function parseName(name: string) {
    return name.slice(2).toLowerCase()
}


function createInvoker(initialValue) {
    const invoker = (e: Event) => {
        invoker.value && invoker.value()
    }
    invoker.value = initialValue
    return invoker
}
