"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importGetCallerAddress = exports.addSupportsInterface = void 0;
const common_options_1 = require("./common-options");
const define_functions_1 = require("./utils/define-functions");
const define_modules_1 = require("./utils/define-modules");
function addSupportsInterface(c) {
    c.addModule(modules.ERC165, [], [], false);
    c.addFunction(functions.supportsInterface);
}
exports.addSupportsInterface = addSupportsInterface;
function importGetCallerAddress(c) {
    c.addModule(modules.syscalls, [], [], false);
    c.addModuleFunction(modules.syscalls, 'get_caller_address');
}
exports.importGetCallerAddress = importGetCallerAddress;
const modules = (0, define_modules_1.defineModules)({
    ERC165: {
        path: 'openzeppelin.introspection.erc165.library',
        useNamespace: true
    },
    syscalls: {
        path: 'starkware.starknet.common.syscalls',
        useNamespace: false
    },
});
const functions = (0, define_functions_1.defineFunctions)({
    // --- view functions ---
    supportsInterface: {
        module: modules.ERC165,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'interfaceId', type: 'felt' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'supports_interface',
    },
});
//# sourceMappingURL=common-functions.js.map