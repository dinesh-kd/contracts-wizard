import BN from "bn.js";
import type { ContractBuilder } from "../contract";
/**
 * Returns Uint256 components for low and high bits based on a given number in string format.
 * @param num Number in string format
 * @returns Object with lowBits and highBits
 * @throws {NumberTooLarge} if the provided number is larger than 256 bits
 */
export declare function toUint256(num: string): {
    lowBits: BN;
    highBits: BN;
};
export declare class NumberTooLarge extends Error {
}
export declare function importUint256(c: ContractBuilder): void;
//# sourceMappingURL=uint256.d.ts.map