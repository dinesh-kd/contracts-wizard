"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildERC1155 = exports.isAccessControlRequired = exports.printERC1155 = exports.defaults = void 0;
const contract_1 = require("./contract");
const set_access_control_1 = require("./set-access-control");
const add_pausable_1 = require("./add-pausable");
const define_functions_1 = require("./utils/define-functions");
const common_options_1 = require("./common-options");
const set_upgradeable_1 = require("./set-upgradeable");
const set_info_1 = require("./set-info");
const define_modules_1 = require("./utils/define-modules");
const common_options_2 = require("./common-options");
const print_1 = require("./print");
const uint256_1 = require("./utils/uint256");
const common_functions_1 = require("./common-functions");
exports.defaults = {
    uri: '',
    burnable: false,
    pausable: false,
    mintable: false,
    updatableUri: true,
    access: common_options_2.defaults.access,
    upgradeable: common_options_2.defaults.upgradeable,
    info: common_options_2.defaults.info
};
function printERC1155(opts = exports.defaults) {
    return (0, print_1.printContract)(buildERC1155(opts));
}
exports.printERC1155 = printERC1155;
function withDefaults(opts) {
    var _a, _b, _c, _d;
    return {
        ...opts,
        ...(0, common_options_1.withCommonDefaults)(opts),
        burnable: (_a = opts.burnable) !== null && _a !== void 0 ? _a : exports.defaults.burnable,
        pausable: (_b = opts.pausable) !== null && _b !== void 0 ? _b : exports.defaults.pausable,
        mintable: (_c = opts.mintable) !== null && _c !== void 0 ? _c : exports.defaults.mintable,
        updatableUri: (_d = opts.updatableUri) !== null && _d !== void 0 ? _d : exports.defaults.updatableUri,
    };
}
function isAccessControlRequired(opts) {
    return opts.mintable || opts.pausable || opts.updatableUri !== false;
}
exports.isAccessControlRequired = isAccessControlRequired;
function buildERC1155(opts) {
    const c = new contract_1.ContractBuilder();
    const allOpts = withDefaults(opts);
    addBase(c, allOpts.uri);
    (0, common_functions_1.addSupportsInterface)(c);
    c.addFunction(functions.uri);
    c.addFunction(functions.balanceOf);
    c.addFunction(functions.balanceOfBatch);
    c.addFunction(functions.isApprovedForAll);
    c.addFunction(functions.setApprovalForAll);
    c.addFunction(functions.safeTransferFrom);
    c.addFunction(functions.safeBatchTransferFrom);
    (0, uint256_1.importUint256)(c);
    if (allOpts.pausable) {
        (0, add_pausable_1.addPausable)(c, allOpts.access, [
            functions.setApprovalForAll,
            functions.safeTransferFrom,
            functions.safeBatchTransferFrom,
        ]);
        if (allOpts.burnable) {
            (0, add_pausable_1.setPausable)(c, functions.burn);
            (0, add_pausable_1.setPausable)(c, functions.burnBatch);
        }
        if (allOpts.mintable) {
            (0, add_pausable_1.setPausable)(c, functions.mint);
            (0, add_pausable_1.setPausable)(c, functions.mintBatch);
        }
    }
    if (allOpts.burnable) {
        addBurnable(c);
    }
    if (allOpts.mintable) {
        addMintable(c, allOpts.access);
    }
    if (allOpts.updatableUri) {
        addSetUri(c, allOpts.access);
    }
    (0, set_access_control_1.setAccessControl)(c, allOpts.access);
    (0, set_upgradeable_1.setUpgradeable)(c, allOpts.upgradeable);
    (0, set_info_1.setInfo)(c, allOpts.info);
    return c;
}
exports.buildERC1155 = buildERC1155;
function addBase(c, uri) {
    c.addModule(modules.ERC1155, [uri], [
        functions.safeTransferFrom,
        functions.safeBatchTransferFrom,
    ], true);
}
function addBurnable(c) {
    c.addFunction(functions.burn);
    c.addLibraryCall(functions.assert_owner_or_approved, functions.burn, ['owner=from_']);
    c.addFunction(functions.burnBatch);
    c.addLibraryCall(functions.assert_owner_or_approved, functions.burnBatch, ['owner=from_']);
}
function addMintable(c, access) {
    c.addFunction(functions.mint);
    (0, set_access_control_1.requireAccessControl)(c, functions.mint, access, 'MINTER');
    c.addFunction(functions.mintBatch);
    (0, set_access_control_1.requireAccessControl)(c, functions.mintBatch, access, 'MINTER');
}
function addSetUri(c, access) {
    c.addFunction(functions.setURI);
    (0, set_access_control_1.requireAccessControl)(c, functions.setURI, access, 'URI_SETTER');
}
const modules = (0, define_modules_1.defineModules)({
    ERC1155: {
        path: 'openzeppelin.token.erc1155.library',
        useNamespace: true
    },
    math: {
        path: 'starkware.cairo.common.math',
        useNamespace: false
    }
});
const functions = (0, define_functions_1.defineFunctions)({
    // --- view functions ---
    uri: {
        module: modules.ERC1155,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'id', type: 'Uint256' },
        ],
        returns: [{ name: 'uri', type: 'felt' }],
        passthrough: true,
    },
    balanceOf: {
        module: modules.ERC1155,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'account', type: 'felt' },
            { name: 'id', type: 'Uint256' },
        ],
        returns: [{ name: 'balance', type: 'Uint256' }],
        passthrough: true,
        parentFunctionName: 'balance_of',
    },
    balanceOfBatch: {
        module: modules.ERC1155,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'accounts_len', type: 'felt' },
            { name: 'accounts', type: 'felt*' },
            { name: 'ids_len', type: 'felt' },
            { name: 'ids', type: 'Uint256*' },
        ],
        returns: [
            { name: 'balances_len', type: 'felt' },
            { name: 'balances', type: 'Uint256*' }
        ],
        passthrough: true,
        parentFunctionName: 'balance_of_batch',
    },
    isApprovedForAll: {
        module: modules.ERC1155,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'account', type: 'felt' },
            { name: 'operator', type: 'felt' },
        ],
        returns: [{ name: 'approved', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'is_approved_for_all',
    },
    // --- external functions ---
    setURI: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'uri', type: 'felt' },
        ],
        parentFunctionName: '_set_uri',
    },
    setApprovalForAll: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'operator', type: 'felt' },
            { name: 'approved', type: 'felt' },
        ],
        parentFunctionName: 'set_approval_for_all',
    },
    safeTransferFrom: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'to', type: 'felt' },
            { name: 'id', type: 'Uint256' },
            { name: 'value', type: 'Uint256' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
        ],
        parentFunctionName: 'safe_transfer_from',
    },
    safeBatchTransferFrom: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'to', type: 'felt' },
            { name: 'ids_len', type: 'felt' },
            { name: 'ids', type: 'Uint256*' },
            { name: 'values_len', type: 'felt' },
            { name: 'values', type: 'Uint256*' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
        ],
        parentFunctionName: 'safe_batch_transfer_from',
    },
    mint: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'to', type: 'felt' },
            { name: 'id', type: 'Uint256' },
            { name: 'value', type: 'Uint256' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
        ],
        parentFunctionName: '_mint',
    },
    mintBatch: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'to', type: 'felt' },
            { name: 'ids_len', type: 'felt' },
            { name: 'ids', type: 'Uint256*' },
            { name: 'values_len', type: 'felt' },
            { name: 'values', type: 'Uint256*' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
        ],
        parentFunctionName: '_mint_batch',
    },
    burn: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'id', type: 'Uint256' },
            { name: 'value', type: 'Uint256' },
        ],
        parentFunctionName: '_burn',
    },
    burnBatch: {
        module: modules.ERC1155,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'ids_len', type: 'felt' },
            { name: 'ids', type: 'Uint256*' },
            { name: 'values_len', type: 'felt' },
            { name: 'values', type: 'Uint256*' },
        ],
        parentFunctionName: '_burn_batch',
    },
    // --- library-only calls ---
    assert_owner_or_approved: {
        module: modules.ERC1155,
        args: [
            { name: 'owner', type: 'felt' },
        ],
    },
});
//# sourceMappingURL=erc1155.js.map