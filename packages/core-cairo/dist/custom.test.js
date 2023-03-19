"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const _1 = require(".");
const custom_1 = require("./custom");
const print_1 = require("./print");
function testCustom(title, opts) {
    (0, ava_1.default)(title, t => {
        const c = (0, custom_1.buildCustom)({
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
        t.is(_1.custom.print(opts), (0, print_1.printContract)((0, custom_1.buildCustom)({
            ...opts,
        })));
    });
}
testCustom('custom', {});
testCustom('pausable', {
    pausable: true,
});
testCustom('upgradeable', {
    upgradeable: true,
});
testCustom('access control disabled', {
    access: false,
});
testCustom('access control ownable', {
    access: 'ownable',
});
testCustom('access control roles', {
    access: 'roles',
});
testCustom('pausable with access control disabled', {
    // API should override access to true since it is required for pausable
    access: false,
    pausable: true,
});
testAPIEquivalence('custom API default');
testAPIEquivalence('custom API full upgradeable', {
    access: 'roles',
    pausable: true,
    upgradeable: true,
});
(0, ava_1.default)('custom API assert defaults', async (t) => {
    t.is(_1.custom.print(_1.custom.defaults), _1.custom.print());
});
(0, ava_1.default)('API isAccessControlRequired', async (t) => {
    t.is(_1.custom.isAccessControlRequired({ pausable: true }), true);
    t.is(_1.custom.isAccessControlRequired({ upgradeable: true }), false);
});
//# sourceMappingURL=custom.test.js.map