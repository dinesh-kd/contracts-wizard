export interface Contract {
    license: string;
    libraries: Library[];
    functions: ContractFunction[];
    constructorCode: string[];
    constructorImplicitArgs?: Argument[];
    constructorArgs: Argument[];
    variables: string[];
    upgradeable: boolean;
}
export type Value = string | number | {
    lit: string;
} | {
    note: string;
    value: Value;
};
export interface Library {
    module: Module;
    functions: string[];
    initializer?: Initializer;
}
export interface Module {
    name: string;
    path: string;
    useNamespace: boolean;
}
export interface Initializer {
    params: Value[];
}
/**
 * Whether the function should directly return the parent function's return value.
 * If false, call the parent function without returning its value.
 * If true, return directly from the call to the parent function.
 * If 'strict', treat as `true` but uses the return arguments' names.
 */
export type PassthroughOption = true | false | 'strict';
export interface BaseFunction {
    module?: Module;
    name: string;
    implicitArgs?: Argument[];
    args: Argument[];
    returns?: Argument[];
    kind?: FunctionKind;
    passthrough?: PassthroughOption;
    read?: boolean;
    parentFunctionName?: string;
}
export interface ContractFunction extends BaseFunction {
    libraryCalls: LibraryCall[];
    code: string[];
    final: boolean;
}
export interface LibraryCall {
    callFn: BaseFunction;
    args: string[];
}
export type FunctionKind = 'view' | 'external';
export interface Argument {
    name: string;
    type?: string;
}
export interface NatspecTag {
    key: string;
    value: string;
}
export declare class ContractBuilder implements Contract {
    license: string;
    upgradeable: boolean;
    readonly constructorArgs: Argument[];
    readonly constructorCode: string[];
    readonly variableSet: Set<string>;
    private librariesMap;
    private functionMap;
    readonly constructorImplicitArgs: Argument[];
    get libraries(): Library[];
    get functions(): ContractFunction[];
    get variables(): string[];
    addModule(module: Module, params?: Value[], functions?: BaseFunction[], initializable?: boolean): boolean;
    addModuleFunction(module: Module, addFunction: string): void;
    addLibraryCall(callFn: BaseFunction, baseFn: BaseFunction, args?: string[]): void;
    addFunction(baseFn: BaseFunction): ContractFunction;
    addConstructorArgument(arg: Argument): void;
    addConstructorCode(code: string): void;
    addFunctionCode(code: string, baseFn: BaseFunction): void;
    setFunctionBody(code: string[], baseFn: BaseFunction): void;
    addVariable(code: string): boolean;
}
//# sourceMappingURL=contract.d.ts.map