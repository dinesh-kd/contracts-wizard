import type { ContractBuilder, BaseFunction } from './contract';
export declare const accessOptions: readonly [false, "ownable", "roles"];
export type Access = typeof accessOptions[number];
/**
 * Sets access control for the contract by adding inheritance.
 */
export declare function setAccessControl(c: ContractBuilder, access: Access): void;
/**
 * Enables access control for the contract and restricts the given function with access control.
 */
export declare function requireAccessControl(c: ContractBuilder, fn: BaseFunction, access: Access, role: string): void;
export declare function to251BitHash(label: string): string;
//# sourceMappingURL=set-access-control.d.ts.map