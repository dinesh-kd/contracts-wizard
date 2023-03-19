import type { ContractBuilder } from './contract';
export declare const upgradeableOptions: readonly [false, true];
export type Upgradeable = typeof upgradeableOptions[number];
export declare function setUpgradeable(c: ContractBuilder, upgradeable: Upgradeable): void;
//# sourceMappingURL=set-upgradeable.d.ts.map