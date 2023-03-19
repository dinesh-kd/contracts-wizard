import type { Module } from '../contract';
type ImplicitNameModule = Omit<Module, 'name'>;
export declare function defineModules<F extends string>(fns: Record<F, ImplicitNameModule>): Record<F, Module>;
export {};
//# sourceMappingURL=define-modules.d.ts.map