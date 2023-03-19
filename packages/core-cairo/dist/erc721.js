"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildERC721 = exports.isAccessControlRequired = exports.printERC721 = exports.defaults = void 0;
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
    name: 'MyToken',
    symbol: 'MTK',
    burnable: false,
    pausable: false,
    mintable: false,
    access: common_options_2.defaults.access,
    upgradeable: common_options_2.defaults.upgradeable,
    info: common_options_2.defaults.info
};
function printERC721(opts = exports.defaults) {
    return (0, print_1.printContract)(buildERC721(opts));
}
exports.printERC721 = printERC721;
function withDefaults(opts) {
    var _a, _b, _c;
    return {
        ...opts,
        ...(0, common_options_1.withCommonDefaults)(opts),
        burnable: (_a = opts.burnable) !== null && _a !== void 0 ? _a : exports.defaults.burnable,
        pausable: (_b = opts.pausable) !== null && _b !== void 0 ? _b : exports.defaults.pausable,
        mintable: (_c = opts.mintable) !== null && _c !== void 0 ? _c : exports.defaults.mintable,
    };
}
function isAccessControlRequired(opts) {
    return opts.mintable === true || opts.pausable === true;
}
exports.isAccessControlRequired = isAccessControlRequired;
function buildERC721(opts) {
    const c = new contract_1.ContractBuilder();
    const allOpts = withDefaults(opts);
    addBase(c, allOpts.name, allOpts.symbol);
    (0, common_functions_1.addSupportsInterface)(c);
    c.addFunction(functions.name);
    c.addFunction(functions.symbol);
    c.addFunction(functions.balanceOf);
    c.addFunction(functions.ownerOf);
    c.addFunction(functions.getApproved);
    c.addFunction(functions.isApprovedForAll);
    c.addFunction(functions.tokenURI);
    c.addFunction(functions.approve);
    c.addFunction(functions.setApprovalForAll);
    c.addFunction(functions.transferFrom);
    c.addFunction(functions.safeTransferFrom);
    (0, uint256_1.importUint256)(c);
    if (allOpts.pausable) {
        (0, add_pausable_1.addPausable)(c, allOpts.access, [functions.approve, functions.setApprovalForAll, functions.transferFrom, functions.safeTransferFrom]);
        if (allOpts.burnable) {
            (0, add_pausable_1.setPausable)(c, functions.burn);
        }
        if (allOpts.mintable) {
            (0, add_pausable_1.setPausable)(c, functions.safeMint);
        }
    }
    if (allOpts.burnable) {
        addBurnable(c);
    }
    if (allOpts.mintable) {
        addMintable(c, allOpts.access);
    }
    (0, set_access_control_1.setAccessControl)(c, allOpts.access);
    (0, set_upgradeable_1.setUpgradeable)(c, allOpts.upgradeable);
    (0, set_info_1.setInfo)(c, allOpts.info);
    return c;
}
exports.buildERC721 = buildERC721;
function addBase(c, name, symbol) {
    c.addModule(modules.ERC721, [name, symbol], [functions.approve, functions.setApprovalForAll, functions.transferFrom, functions.safeTransferFrom], true);
}
function addBurnable(c) {
    c.addFunction(functions.burn);
    c.setFunctionBody([
        'ERC721.assert_only_token_owner(tokenId)',
        'ERC721._burn(tokenId)'
    ], functions.burn);
}
function addMintable(c, access) {
    (0, set_access_control_1.requireAccessControl)(c, functions.safeMint, access, 'MINTER');
    c.setFunctionBody([
        'ERC721._safe_mint(to, tokenId, data_len, data)',
        'ERC721._set_token_uri(tokenId, tokenURI)'
    ], functions.safeMint);
}
const modules = (0, define_modules_1.defineModules)({
    ERC721: {
        path: 'openzeppelin.token.erc721.library',
        useNamespace: true
    },
});
const functions = (0, define_functions_1.defineFunctions)({
    // --- view functions ---
    name: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'name', type: 'felt' }],
        passthrough: true,
    },
    symbol: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'symbol', type: 'felt' }],
        passthrough: true,
    },
    balanceOf: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'owner', type: 'felt' },
        ],
        returns: [{ name: 'balance', type: 'Uint256' }],
        passthrough: true,
        parentFunctionName: 'balance_of',
    },
    ownerOf: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'token_id', type: 'Uint256' },
        ],
        returns: [{ name: 'owner', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'owner_of',
    },
    getApproved: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'token_id', type: 'Uint256' },
        ],
        returns: [{ name: 'approved', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'get_approved',
    },
    isApprovedForAll: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'owner', type: 'felt' },
            { name: 'operator', type: 'felt' },
        ],
        returns: [{ name: 'approved', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'is_approved_for_all',
    },
    tokenURI: {
        module: modules.ERC721,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'tokenId', type: 'Uint256' },
        ],
        returns: [{ name: 'tokenURI', type: 'felt' }],
        passthrough: 'strict',
        parentFunctionName: 'token_uri',
    },
    // --- external functions ---
    approve: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'to', type: 'felt' },
            { name: 'tokenId', type: 'Uint256' },
        ],
    },
    setApprovalForAll: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'operator', type: 'felt' },
            { name: 'approved', type: 'felt' },
        ],
        parentFunctionName: 'set_approval_for_all',
    },
    transferFrom: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'to', type: 'felt' },
            { name: 'tokenId', type: 'Uint256' },
        ],
        parentFunctionName: 'transfer_from',
    },
    safeTransferFrom: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'from_', type: 'felt' },
            { name: 'to', type: 'felt' },
            { name: 'tokenId', type: 'Uint256' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
        ],
        parentFunctionName: 'safe_transfer_from',
    },
    safeMint: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'to', type: 'felt' },
            { name: 'tokenId', type: 'Uint256' },
            { name: 'data_len', type: 'felt' },
            { name: 'data', type: 'felt*' },
            { name: 'tokenURI', type: 'felt' },
        ],
        parentFunctionName: '_safe_mint',
    },
    burn: {
        module: modules.ERC721,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'tokenId', type: 'Uint256' },
        ],
    },
});
//# sourceMappingURL=erc721.js.map