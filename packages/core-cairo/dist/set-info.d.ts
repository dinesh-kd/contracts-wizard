import type { ContractBuilder } from "./contract";
export declare const infoOptions: readonly [{}, {
    readonly license: "WTFPL";
}];
export declare const defaults: Info;
export type Info = {
    license?: string;
};
export declare function setInfo(c: ContractBuilder, info: Info): void;
//# sourceMappingURL=set-info.d.ts.map