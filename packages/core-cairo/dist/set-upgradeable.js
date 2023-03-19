"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpgradeable = exports.upgradeableOptions = void 0;
const common_options_1 = require("./common-options");
//import { Access, setAccessControl } from './set-access-control';
const define_functions_1 = require("./utils/define-functions");
const define_modules_1 = require("./utils/define-modules");
exports.upgradeableOptions = [false, true];
function setUpgradeable(c, upgradeable) {
    if (upgradeable === false) {
        return;
    }
    c.upgradeable = true;
    c.addModule(modules.Proxy, [{ lit: 'proxy_admin' }], [], true);
    c.addConstructorArgument({ name: 'proxy_admin', type: 'felt' });
    c.setFunctionBody([
        'Proxy.assert_only_admin()',
        'Proxy._set_implementation_hash(new_implementation)'
    ], functions.upgrade);
}
exports.setUpgradeable = setUpgradeable;
const modules = (0, define_modules_1.defineModules)({
    Proxy: {
        path: 'openzeppelin.upgrades.library',
        useNamespace: true
    },
});
const functions = (0, define_functions_1.defineFunctions)({
    upgrade: {
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'new_implementation', type: 'felt' },
        ],
        returns: [],
    },
});
//# sourceMappingURL=set-upgradeable.js.map