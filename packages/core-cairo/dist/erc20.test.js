"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const erc20_1 = require("./erc20");
const print_1 = require("./print");
const _1 = require(".");
function testERC20(title, opts) {
    (0, ava_1.default)(title, t => {
        const c = (0, erc20_1.buildERC20)({
            name: 'MyToken',
            symbol: 'MTK',
            ...opts,
        });
        t.snapshot((0, print_1.printContract)(c));
    });
}
/**
 * Tests external API for equivalence with internal API
 */
function testAPIEquivalence(title, opts) {
    (0, ava_1.default)(title, t => {
        t.is(_1.erc20.print(opts), (0, print_1.printContract)((0, erc20_1.buildERC20)({
            name: 'MyToken',
            symbol: 'MTK',
            ...opts,
        })));
    });
}
testERC20('basic erc20', {});
testERC20('erc20 burnable', {
    burnable: true,
});
testERC20('erc20 pausable', {
    pausable: true,
    access: 'ownable',
});
testERC20('erc20 pausable with roles', {
    pausable: true,
    access: 'roles',
});
testERC20('erc20 burnable pausable', {
    burnable: true,
    pausable: true,
});
testERC20('erc20 preminted', {
    premint: '1000',
});
testERC20('erc20 premint of 0', {
    premint: '0',
});
testERC20('erc20 mintable', {
    mintable: true,
    access: 'ownable',
});
testERC20('erc20 mintable with roles', {
    mintable: true,
    access: 'roles',
});
testERC20('erc20 full upgradeable', {
    premint: '2000',
    decimals: '9',
    access: 'ownable',
    burnable: true,
    mintable: true,
    pausable: true,
    upgradeable: true,
});
testERC20('erc20 full upgradeable with roles', {
    premint: '2000',
    decimals: '9',
    access: 'roles',
    burnable: true,
    mintable: true,
    pausable: true,
    upgradeable: true,
});
testAPIEquivalence('erc20 API default');
testAPIEquivalence('erc20 API basic', { name: 'CustomToken', symbol: 'CTK' });
testAPIEquivalence('erc20 API full upgradeable', {
    name: 'CustomToken',
    symbol: 'CTK',
    premint: '2000',
    decimals: '9',
    access: 'roles',
    burnable: true,
    mintable: true,
    pausable: true,
    upgradeable: true,
});
(0, ava_1.default)('erc20 API assert defaults', async (t) => {
    t.is(_1.erc20.print(_1.erc20.defaults), _1.erc20.print());
});
(0, ava_1.default)('erc20 API isAccessControlRequired', async (t) => {
    t.is(_1.erc20.isAccessControlRequired({ mintable: true }), true);
    t.is(_1.erc20.isAccessControlRequired({ pausable: true }), true);
    t.is(_1.erc20.isAccessControlRequired({ upgradeable: true }), false);
});
(0, ava_1.default)('erc20 API getInitialSupply', async (t) => {
    t.is(_1.erc20.getInitialSupply('1000', 18), '1000000000000000000000');
    t.is(_1.erc20.getInitialSupply('1000.1', 18), '1000100000000000000000');
    t.is(_1.erc20.getInitialSupply('.1', 18), '100000000000000000');
    t.is(_1.erc20.getInitialSupply('.01', 2), '1');
    let error = t.throws(() => _1.erc20.getInitialSupply('.01', 1));
    t.not(error, undefined);
    t.is(error.messages.premint, 'Too many decimals');
    error = t.throws(() => _1.erc20.getInitialSupply('1.1.1', 18));
    t.not(error, undefined);
    t.is(error.messages.premint, 'Not a valid number');
});
//# sourceMappingURL=erc20.test.js.map