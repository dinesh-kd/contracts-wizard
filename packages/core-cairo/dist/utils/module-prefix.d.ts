import type { BaseFunction } from "../contract";
/**
 * If the function's module has a namespace, returns the namespace.
 * Otherwise returns the function name itself.
 */
export declare function getImportName(fn: BaseFunction): string;
/**
 * Returns the function name with either namespace or module prefix based on extensibility pattern.
 */
export declare function getFunctionName(fn: BaseFunction): string;
//# sourceMappingURL=module-prefix.d.ts.map