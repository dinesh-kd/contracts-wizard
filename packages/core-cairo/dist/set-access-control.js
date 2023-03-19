"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to251BitHash = exports.requireAccessControl = exports.setAccessControl = exports.accessOptions = void 0;
const common_options_1 = require("./common-options");
const define_functions_1 = require("./utils/define-functions");
const define_modules_1 = require("./utils/define-modules");
const keccak_1 = require("ethereum-cryptography/keccak");
const utils_1 = require("ethereum-cryptography/utils");
exports.accessOptions = [false, 'ownable', 'roles'];
/**
 * Sets access control for the contract by adding inheritance.
 */
function setAccessControl(c, access) {
    switch (access) {
        case 'ownable': {
            c.addModule(modules.Ownable, [{ lit: 'owner' }], [], true);
            c.addConstructorArgument({ name: 'owner', type: 'felt' });
            c.addFunction(functions.owner);
            c.addFunction(functions.transferOwnership);
            c.addFunction(functions.renounceOwnership);
            break;
        }
        case 'roles': {
            if (c.addModule(modules.AccessControl)) {
                importDefaultAdminRole(c);
                c.addConstructorArgument({ name: 'admin', type: 'felt' });
                c.addConstructorCode('AccessControl._grant_role(DEFAULT_ADMIN_ROLE, admin)');
                c.addFunction(functions.hasRole);
                c.addFunction(functions.getRoleAdmin);
                c.addFunction(functions.grantRole);
                c.addFunction(functions.revokeRole);
                c.addFunction(functions.renounceRole);
            }
            break;
        }
    }
}
exports.setAccessControl = setAccessControl;
/**
 * Enables access control for the contract and restricts the given function with access control.
 */
function requireAccessControl(c, fn, access, role) {
    if (access === false) {
        access = 'ownable';
    }
    setAccessControl(c, access);
    switch (access) {
        case 'ownable': {
            c.addLibraryCall(functions.assert_only_owner, fn);
            break;
        }
        case 'roles': {
            const roleId = role + '_ROLE';
            if (c.addVariable(`const ${roleId} = ${to251BitHash(roleId)}; // keccak256('${roleId}')[0:251 bits]`)) {
                c.addConstructorCode(`AccessControl._grant_role(${roleId}, admin)`);
            }
            c.addLibraryCall(functions.assert_only_role, fn, [roleId]);
            break;
        }
    }
}
exports.requireAccessControl = requireAccessControl;
function to251BitHash(label) {
    const hash = (0, utils_1.bytesToHex)((0, keccak_1.keccak256)((0, utils_1.utf8ToBytes)(label)));
    const bin = BigInt('0x' + hash).toString(2).substring(0, 251);
    const hex = BigInt('0b' + bin).toString(16);
    return '0x' + hex;
}
exports.to251BitHash = to251BitHash;
function importDefaultAdminRole(c) {
    c.addModule(modules.constants, [], [], false);
    c.addModuleFunction(modules.constants, 'DEFAULT_ADMIN_ROLE');
}
const modules = (0, define_modules_1.defineModules)({
    Ownable: {
        path: 'openzeppelin.access.ownable.library',
        useNamespace: true
    },
    AccessControl: {
        path: 'openzeppelin.access.accesscontrol.library',
        useNamespace: true
    },
    constants: {
        path: 'openzeppelin.utils.constants.library',
        useNamespace: false
    }
});
const functions = (0, define_functions_1.defineFunctions)({
    // --- library-only calls ---
    assert_only_owner: {
        module: modules.Ownable,
        args: [],
    },
    assert_only_role: {
        module: modules.AccessControl,
        args: []
    },
    // --- view functions ---
    owner: {
        module: modules.Ownable,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'owner', type: 'felt' }],
        passthrough: true,
    },
    // --- external functions ---
    transferOwnership: {
        module: modules.Ownable,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'newOwner', type: 'felt' },
        ],
        parentFunctionName: 'transfer_ownership',
    },
    renounceOwnership: {
        module: modules.Ownable,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        parentFunctionName: 'renounce_ownership',
    },
    hasRole: {
        module: modules.AccessControl,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'role', type: 'felt' },
            { name: 'user', type: 'felt' },
        ],
        parentFunctionName: 'has_role',
        returns: [{ name: 'has_role', type: 'felt' }],
        passthrough: true,
    },
    getRoleAdmin: {
        module: modules.AccessControl,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'role', type: 'felt' },
        ],
        parentFunctionName: 'get_role_admin',
        returns: [{ name: 'admin', type: 'felt' }],
        passthrough: true,
    },
    grantRole: {
        module: modules.AccessControl,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'role', type: 'felt' },
            { name: 'user', type: 'felt' },
        ],
        parentFunctionName: 'grant_role',
    },
    revokeRole: {
        module: modules.AccessControl,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'role', type: 'felt' },
            { name: 'user', type: 'felt' },
        ],
        parentFunctionName: 'revoke_role',
    },
    renounceRole: {
        module: modules.AccessControl,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'role', type: 'felt' },
            { name: 'user', type: 'felt' },
        ],
        parentFunctionName: 'renounce_role',
    },
});
//# sourceMappingURL=set-access-control.js.map