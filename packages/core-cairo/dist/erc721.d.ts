import { Contract } from './contract';
import { CommonOptions } from './common-options';
export declare const defaults: Required<ERC721Options>;
export declare function printERC721(opts?: ERC721Options): string;
export interface ERC721Options extends CommonOptions {
    name: string;
    symbol: string;
    burnable?: boolean;
    pausable?: boolean;
    mintable?: boolean;
}
export declare function isAccessControlRequired(opts: Partial<ERC721Options>): boolean;
export declare function buildERC721(opts: ERC721Options): Contract;
//# sourceMappingURL=erc721.d.ts.map