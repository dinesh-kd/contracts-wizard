"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialSupply = exports.premintPattern = exports.buildERC20 = exports.isAccessControlRequired = exports.printERC20 = exports.defaults = void 0;
const contract_1 = require("./contract");
const set_access_control_1 = require("./set-access-control");
const add_pausable_1 = require("./add-pausable");
const define_functions_1 = require("./utils/define-functions");
const common_options_1 = require("./common-options");
const set_upgradeable_1 = require("./set-upgradeable");
const set_info_1 = require("./set-info");
const error_1 = require("./error");
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
    premint: '0',
    decimals: '18',
    mintable: false,
    access: common_options_2.defaults.access,
    upgradeable: common_options_2.defaults.upgradeable,
    info: common_options_2.defaults.info
};
function printERC20(opts = exports.defaults) {
    return (0, print_1.printContract)(buildERC20(opts));
}
exports.printERC20 = printERC20;
function checkDecimals(decimals) {
    if (!/^\d+$/.test(decimals)) {
        throw new error_1.OptionsError({
            decimals: 'Not a valid number',
        });
    }
    else if (parseInt(decimals) >= 256) { // 8 bits
        throw new error_1.OptionsError({
            decimals: 'Number too large',
        });
    }
}
function withDefaults(opts) {
    var _a, _b, _c;
    return {
        ...opts,
        ...(0, common_options_1.withCommonDefaults)(opts),
        burnable: (_a = opts.burnable) !== null && _a !== void 0 ? _a : exports.defaults.burnable,
        pausable: (_b = opts.pausable) !== null && _b !== void 0 ? _b : exports.defaults.pausable,
        premint: opts.premint || exports.defaults.premint,
        mintable: (_c = opts.mintable) !== null && _c !== void 0 ? _c : exports.defaults.mintable,
        decimals: opts.decimals || exports.defaults.decimals,
    };
}
function isAccessControlRequired(opts) {
    return opts.mintable === true || opts.pausable === true;
}
exports.isAccessControlRequired = isAccessControlRequired;
function buildERC20(opts) {
    const c = new contract_1.ContractBuilder();
    const allOpts = withDefaults(opts);
    checkDecimals(allOpts.decimals);
    addBase(c, allOpts.name, allOpts.symbol, allOpts.decimals);
    c.addFunction(functions.name);
    c.addFunction(functions.symbol);
    c.addFunction(functions.totalSupply);
    c.addFunction(functions.decimals);
    c.addFunction(functions.balanceOf);
    c.addFunction(functions.allowance);
    c.addFunction(functions.transfer);
    c.addFunction(functions.transferFrom);
    c.addFunction(functions.approve);
    c.addFunction(functions.increaseAllowance);
    c.addFunction(functions.decreaseAllowance);
    (0, uint256_1.importUint256)(c);
    if (allOpts.burnable) {
        addBurnable(c);
    }
    if (allOpts.pausable) {
        (0, add_pausable_1.addPausable)(c, allOpts.access, [functions.transfer, functions.transferFrom, functions.approve, functions.increaseAllowance, functions.decreaseAllowance]);
        if (allOpts.burnable) {
            (0, add_pausable_1.setPausable)(c, functions.burn);
        }
    }
    if (allOpts.premint) {
        addPremint(c, allOpts.premint, allOpts.decimals);
    }
    if (allOpts.mintable) {
        addMintable(c, allOpts.access);
    }
    (0, set_access_control_1.setAccessControl)(c, allOpts.access);
    (0, set_upgradeable_1.setUpgradeable)(c, allOpts.upgradeable);
    (0, set_info_1.setInfo)(c, allOpts.info);
    return c;
}
exports.buildERC20 = buildERC20;
function addBase(c, name, symbol, decimals) {
    c.addModule(modules.ERC20, [
        name, symbol, { lit: decimals }
    ], [
        functions.transfer, functions.transferFrom, functions.approve, functions.increaseAllowance, functions.decreaseAllowance
    ], true);
}
function addBurnable(c) {
    (0, common_functions_1.importGetCallerAddress)(c);
    c.addFunction(functions.burn);
    c.setFunctionBody([
        'let (owner) = get_caller_address()',
        'ERC20._burn(owner, amount)'
    ], functions.burn);
}
exports.premintPattern = /^(\d*\.?\d*)$/;
function addPremint(c, amount, decimals) {
    if (amount !== undefined && amount !== '0') {
        if (!exports.premintPattern.test(amount)) {
            throw new error_1.OptionsError({
                premint: 'Not a valid number',
            });
        }
        const premintAbsolute = getInitialSupply(amount, parseInt(decimals));
        try {
            const premintUint256 = (0, uint256_1.toUint256)(premintAbsolute);
            c.addConstructorArgument({ name: 'recipient', type: 'felt' });
            c.addConstructorCode(`ERC20._mint(recipient, Uint256(${premintUint256.lowBits}, ${premintUint256.highBits}))`);
        }
        catch (e) {
            if (e instanceof uint256_1.NumberTooLarge) {
                throw new error_1.OptionsError({
                    premint: 'Premint argument too large',
                    decimals: 'Premint argument too large',
                });
            }
        }
    }
}
/**
 * Calculates the initial supply that would be used in an ERC20 contract based on a given premint amount and number of decimals.
 *
 * @param premint Premint amount in token units, may be fractional
 * @param decimals The number of decimals in the token
 * @returns `premint` with zeros padded or removed based on `decimals`.
 * @throws OptionsError if `premint` has more than one decimal character or is more precise than allowed by the `decimals` argument.
 */
function getInitialSupply(premint, decimals) {
    var _a, _b;
    let result;
    const premintSegments = premint.split(".");
    if (premintSegments.length > 2) {
        throw new error_1.OptionsError({
            premint: 'Not a valid number',
        });
    }
    else {
        let firstSegment = (_a = premintSegments[0]) !== null && _a !== void 0 ? _a : '';
        let lastSegment = (_b = premintSegments[1]) !== null && _b !== void 0 ? _b : '';
        if (decimals > lastSegment.length) {
            try {
                lastSegment += "0".repeat(decimals - lastSegment.length);
            }
            catch (e) {
                // .repeat gives an error if number is too large, although this should not happen since decimals is limited to 256
                throw new error_1.OptionsError({
                    decimals: 'Number too large',
                });
            }
        }
        else if (decimals < lastSegment.length) {
            throw new error_1.OptionsError({
                premint: 'Too many decimals',
            });
        }
        // concat segments without leading zeros
        result = firstSegment.concat(lastSegment).replace(/^0+/, '');
    }
    if (result.length === 0) {
        result = '0';
    }
    return result;
}
exports.getInitialSupply = getInitialSupply;
function addMintable(c, access) {
    (0, set_access_control_1.requireAccessControl)(c, functions.mint, access, 'MINTER');
}
const modules = (0, define_modules_1.defineModules)({
    ERC20: {
        path: 'openzeppelin.token.erc20.library',
        useNamespace: true
    },
    bool: {
        path: 'starkware.cairo.common.bool',
        useNamespace: false
    }
});
const functions = (0, define_functions_1.defineFunctions)({
    // --- view functions ---
    name: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'name', type: 'felt' }],
        passthrough: true,
    },
    symbol: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'symbol', type: 'felt' }],
        passthrough: true,
    },
    totalSupply: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'totalSupply', type: 'Uint256' }],
        passthrough: 'strict',
        parentFunctionName: 'total_supply',
    },
    decimals: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [],
        returns: [{ name: 'decimals', type: 'felt' }],
        passthrough: true,
    },
    balanceOf: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'account', type: 'felt' },
        ],
        returns: [{ name: 'balance', type: 'Uint256' }],
        passthrough: true,
        parentFunctionName: 'balance_of',
    },
    allowance: {
        module: modules.ERC20,
        kind: 'view',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'owner', type: 'felt' },
            { name: 'spender', type: 'felt' },
        ],
        returns: [{ name: 'remaining', type: 'Uint256' }],
        passthrough: true,
    },
    // --- external functions ---
    transfer: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'recipient', type: 'felt' },
            { name: 'amount', type: 'Uint256' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
    },
    transferFrom: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'sender', type: 'felt' },
            { name: 'recipient', type: 'felt' },
            { name: 'amount', type: 'Uint256' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'transfer_from',
    },
    approve: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'spender', type: 'felt' },
            { name: 'amount', type: 'Uint256' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
    },
    increaseAllowance: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'spender', type: 'felt' },
            { name: 'added_value', type: 'Uint256' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'increase_allowance',
    },
    decreaseAllowance: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'spender', type: 'felt' },
            { name: 'subtracted_value', type: 'Uint256' },
        ],
        returns: [{ name: 'success', type: 'felt' }],
        passthrough: true,
        parentFunctionName: 'decrease_allowance',
    },
    mint: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'to', type: 'felt' },
            { name: 'amount', type: 'Uint256' },
        ],
        parentFunctionName: '_mint'
    },
    burn: {
        module: modules.ERC20,
        kind: 'external',
        implicitArgs: (0, common_options_1.withImplicitArgs)(),
        args: [
            { name: 'amount', type: 'Uint256' },
        ],
        parentFunctionName: '_burn'
    },
});
//# sourceMappingURL=erc20.js.map