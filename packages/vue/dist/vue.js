var Vue = (function (exports) {
    'use strict';

    var mutableHandlers = {};

    var reactiveMap = new WeakMap();
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    function createReactiveObject(target, baseHandler, proxyMap) {
        var existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        var proxy = new Proxy(target, baseHandler);
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
