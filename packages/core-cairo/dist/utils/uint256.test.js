"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const bn_js_1 = __importDefault(require("bn.js"));
const uint256_1 = require("./uint256");
(0, ava_1.default)('basic', t => {
    t.deepEqual((0, uint256_1.toUint256)('1000'), { lowBits: new bn_js_1.default(1000), highBits: new bn_js_1.default(0) });
    t.deepEqual((0, uint256_1.toUint256)('0'), { lowBits: new bn_js_1.default(0), highBits: new bn_js_1.default(0) });
    t.deepEqual((0, uint256_1.toUint256)(''), { lowBits: new bn_js_1.default(0), highBits: new bn_js_1.default(0) });
});
(0, ava_1.default)('max values', t => {
    const twoE128minus1 = (0, uint256_1.toUint256)('340282366920938463463374607431768211455'); // 2^128-1
    t.is(twoE128minus1.highBits.toString(), '0');
    t.is(twoE128minus1.lowBits.toString(), '340282366920938463463374607431768211455');
    const twoE128 = (0, uint256_1.toUint256)('340282366920938463463374607431768211456'); // 2^128
    t.is(twoE128.highBits.toString(), '1');
    t.is(twoE128.lowBits.toString(), '0');
    const twoE128plus1 = (0, uint256_1.toUint256)('340282366920938463463374607431768211457'); // 2^128+1
    t.is(twoE128plus1.highBits.toString(), '1');
    t.is(twoE128plus1.lowBits.toString(), '1');
    const maxValue = (0, uint256_1.toUint256)('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // 2^256-1
    t.is(maxValue.highBits.toString(), '340282366920938463463374607431768211455'); // 2^128-1
    t.is(maxValue.lowBits.toString(), '340282366920938463463374607431768211455'); // 2^128-1
    const error = t.throws(() => (0, uint256_1.toUint256)('115792089237316195423570985008687907853269984665640564039457584007913129639936')); // 2^256
    t.assert(error instanceof uint256_1.NumberTooLarge);
});
//# sourceMappingURL=uint256.test.js.map