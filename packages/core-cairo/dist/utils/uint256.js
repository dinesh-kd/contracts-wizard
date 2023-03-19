"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUint256 = exports.NumberTooLarge = exports.toUint256 = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const define_modules_1 = require("./define-modules");
/**
 * Returns Uint256 components for low and high bits based on a given number in string format.
 * @param num Number in string format
 * @returns Object with lowBits and highBits
 * @throws {NumberTooLarge} if the provided number is larger than 256 bits
 */
function toUint256(num) {
    const bignum = new bn_js_1.default(num, 10);
    if (bignum.bitLength() > 256) { // 256 bits
        throw new NumberTooLarge();
    }
    else {
        const highBits = bignum.shrn(128);
        const lowBits = bignum.maskn(128);
        return {
            lowBits, highBits
        };
    }
}
exports.toUint256 = toUint256;
class NumberTooLarge extends Error {
}
exports.NumberTooLarge = NumberTooLarge;
const modules = (0, define_modules_1.defineModules)({
    uint256: {
        path: 'starkware.cairo.common.uint256',
        useNamespace: false
    },
});
function importUint256(c) {
    c.addModule(modules.uint256, [], [], false);
    c.addModuleFunction(modules.uint256, 'Uint256');
}
exports.importUint256 = importUint256;
//# sourceMappingURL=uint256.js.map