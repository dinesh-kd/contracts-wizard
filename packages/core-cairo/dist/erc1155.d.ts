import { Contract } from './contract';
import { CommonOptions } from './common-options';
export declare const defaults: Required<ERC1155Options>;
export declare function printERC1155(opts?: ERC1155Options): string;
export interface ERC1155Options extends CommonOptions {
    uri: string;
    burnable?: boolean;
    pausable?: boolean;
    mintable?: boolean;
    updatableUri?: boolean;
}
export declare function isAccessControlRequired(opts: Partial<ERC1155Options>): boolean;
export declare function buildERC1155(opts: ERC1155Options): Contract;
//# sourceMappingURL=erc1155.d.ts.map