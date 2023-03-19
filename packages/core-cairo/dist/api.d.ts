import type { CommonOptions } from './common-options';
import { ERC20Options } from './erc20';
import { ERC721Options } from './erc721';
import { ERC1155Options } from './erc1155';
import { CustomOptions } from './custom';
import { toUint256 } from './utils/uint256';
export interface WizardContractAPI<Options extends CommonOptions> {
    /**
     * Returns a string representation of a contract generated using the provided options. If opts is not provided, uses `defaults`.
     */
    print: (opts?: Options) => string;
    /**
     * The default options that are used for `print`.
     */
    defaults: Required<Options>;
    /**
     * Whether any of the provided options require access control to be enabled. If this returns `true`, then calling `print` with the
     * same options would cause the `access` option to default to `'ownable'` if it was `undefined` or `false`.
     */
    isAccessControlRequired: (opts: Partial<Options>) => boolean;
}
export type ERC20 = WizardContractAPI<ERC20Options> & {
    /**
     * Calculates the initial supply that would be used in an ERC20 contract based on a given premint amount and number of decimals.
     */
    getInitialSupply: (premint: string, decimals: number) => string;
};
export type ERC721 = WizardContractAPI<ERC721Options>;
export type ERC1155 = WizardContractAPI<ERC1155Options>;
export type Custom = WizardContractAPI<CustomOptions>;
export declare const erc20: ERC20;
export declare const erc721: ERC721;
export declare const erc1155: ERC1155;
export declare const custom: Custom;
export declare const utils: {
    toUint256: typeof toUint256;
};
//# sourceMappingURL=api.d.ts.map