"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionName = exports.getImportName = void 0;
/**
 * If the function's module has a namespace, returns the namespace.
 * Otherwise returns the function name itself.
 */
function getImportName(fn) {
    var _a;
    if ((_a = fn.module) === null || _a === void 0 ? void 0 : _a.useNamespace) {
        return fn.module.name;
    }
    else {
        return getFunctionName(fn);
    }
}
exports.getImportName = getImportName;
/**
 * Returns the function name with either namespace or module prefix based on extensibility pattern.
 */
function getFunctionName(fn) {
    var _a;
    const suffix = (_a = fn.parentFunctionName) !== null && _a !== void 0 ? _a : fn.name;
    let prefix;
    if (fn.module !== undefined && fn.module.useNamespace) {
        prefix = `${fn.module.name}.`;
    }
    else {
        prefix = '';
    }
    return `${prefix}${suffix}`;
}
exports.getFunctionName = getFunctionName;
//# sourceMappingURL=module-prefix.js.map