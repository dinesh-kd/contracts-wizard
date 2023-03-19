"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const erc721_1 = require("./erc721");
const print_1 = require("./print");
const _1 = require(".");
function testERC721(title, opts) {
    (0, ava_1.default)(title, t => {
        const c = (0, erc721_1.buildERC721)({
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
        t.is(_1.erc721.print(opts), (0, print_1.printContract)((0, erc721_1.buildERC721)({
            name: 'MyToken',
            symbol: 'MTK',
            ...opts,
        })));
    });
}
testERC721('basic', {});
testERC721('burnable', {
    burnable: true,
});
testERC721('pausable', {
    pausable: true,
});
testERC721('mintable', {
    mintable: true,
});
testERC721('mintable + roles', {
    mintable: true,
    access: 'roles',
});
testERC721('full upgradeable', {
    mintable: true,
    pausable: true,
    burnable: true,
    upgradeable: true,
});
testAPIEquivalence('API default');
testAPIEquivalence('API basic', { name: 'CustomToken', symbol: 'CTK' });
testAPIEquivalence('API full upgradeable', {
    name: 'CustomToken',
    symbol: 'CTK',
    burnable: true,
    mintable: true,
    pausable: true,
    upgradeable: true,
});
(0, ava_1.default)('API assert defaults', async (t) => {
    t.is(_1.erc721.print(_1.erc721.defaults), _1.erc721.print());
});
(0, ava_1.default)('API isAccessControlRequired', async (t) => {
    t.is(_1.erc721.isAccessControlRequired({ mintable: true }), true);
    t.is(_1.erc721.isAccessControlRequired({ pausable: true }), true);
    t.is(_1.erc721.isAccessControlRequired({ upgradeable: true }), false);
});
//# sourceMappingURL=erc721.test.js.map