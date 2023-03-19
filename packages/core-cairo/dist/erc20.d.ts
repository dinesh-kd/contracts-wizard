import { Contract } from './contract';
import { CommonOptions } from './common-options';
export declare const defaults: Required<ERC20Options>;
export declare function printERC20(opts?: ERC20Options): string;
export interface ERC20Options extends CommonOptions {
    name: string;
    symbol: string;
    burnable?: boolean;
    pausable?: boolean;
    premint?: string;
    mintable?: boolean;
    decimals?: string;
}
export declare function isAccessControlRequired(opts: Partial<ERC20Options>): boolean;
export declare function buildERC20(opts: ERC20Options): Contract;
export declare const premintPattern: RegExp;
/**
 * Calculates the initial supply that would be used in an ERC20 contract based on a given premint amount and number of decimals.
 *
 * @param premint Premint amount in token units, may be fractional
 * @param decimals The number of decimals in the token
 * @returns `premint` with zeros padded or removed based on `decimals`.
 * @throws OptionsError if `premint` has more than one decimal character or is more precise than allowed by the `decimals` argument.
 */
export declare function getInitialSupply(premint: string, decimals: number): string;
//# sourceMappingURL=erc20.d.ts.map