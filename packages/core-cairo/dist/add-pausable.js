"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPausable = exports.addPausable = void 0;
const common_options_1 = require("./common-options");
const set_access_control_1 = require("./set-access-control");
const define_functions_1 = require("./utils/define-functions");
const define_modules_1 = require("./utils/define-modules");
function addPausable(c, access, pausableFns) {
    c.addModule(modules.Pausable, [], [functions.pause, functions.unpause], false);
    for (const fn of pausableFns) {
        setPausable(c, fn);
    }
    c.addFunction(functions.paused);
    (0, set_access_control_1.requireAccessControl)(c, functions.pause, access, 'PAUSER');
    (0, set_access_control_1.requireAccessControl)(c, functions.unpause, access, 'PAUSER');
}
exports.addPausable = addPausable;
const modules = (0, define_modules_1.defineModules)({
    Pausable: {
        path: 'openzeppelin.security.pausable.library',
        useNamespace: true
    },
});
const functions = (0, define_functions_1.defineFunctions)({
    paused: {
        module: modules.Pausable,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'paused', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'is_paused',
    },
    pause: {
        module: modules.Pausable,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        parentFunctionName: '_pause',
    },
    unpause: {
        module: modules.Pausable,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        parentFunctionName: '_unpause',
    },
    // --- library-only calls ---
    assert_not_paused: {
        module: modules.Pausable,
        args: [],
    },
});
function setPausable(c, fn) {
    c.addLibraryCall(functions.assert_not_paused, fn);
}
exports.setPausable = setPausable;
//# sourceMappingURL=add-pausable.js.map