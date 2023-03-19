import { Contract } from './contract';
import { CommonOptions } from './common-options';
export declare const defaults: Required<CustomOptions>;
export declare function printCustom(opts?: CustomOptions): string;
export interface CustomOptions extends CommonOptions {
    pausable?: boolean;
}
export declare function isAccessControlRequired(opts: Partial<CustomOptions>): boolean;
export declare function buildCustom(opts: CustomOptions): Contract;
//# sourceMappingURL=custom.d.ts.map