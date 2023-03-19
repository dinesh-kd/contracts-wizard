"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractBuilder = void 0;
const common_options_1 = require("./common-options");
const hash_builtin_1 = require("./utils/hash-builtin");
const module_prefix_1 = require("./utils/module-prefix");
class ContractBuilder {
    constructor() {
        this.license = 'MIT';
        this.upgradeable = false;
        this.constructorArgs = [];
        this.constructorCode = [];
        this.variableSet = new Set();
        this.librariesMap = new Map();
        this.functionMap = new Map();
        this.constructorImplicitArgs = (0, common_options_1.withImplicitArgs)();
    }
    get libraries() {
        return [...this.librariesMap.values()];
    }
    get functions() {
        return [...this.functionMap.values()];
    }
    get variables() {
        return [...this.variableSet];
    }
    addModule(module, params = [], functions = [], initializable = true) {
        const key = module;
        const present = this.librariesMap.has(key);
        const initializer = initializable ? { params } : undefined;
        if (initializer !== undefined && initializer.params.length > 0) {
            // presence of initializer params implies initializer code will be written, so implicit args must be included
            (0, hash_builtin_1.importHashBuiltin)(this);
        }
        const functionStrings = [];
        functions.forEach(fn => {
            functionStrings.push((0, module_prefix_1.getImportName)(fn));
        });
        if (initializable) {
            functionStrings.push((0, module_prefix_1.getImportName)({
                module: module,
                name: 'initializer',
                args: []
            }));
        }
        this.librariesMap.set(module, { module, functions: functionStrings, initializer });
        return !present;
    }
    addModuleFunction(module, addFunction) {
        const existing = this.librariesMap.get(module);
        if (existing === undefined) {
            throw new Error(`Module ${module} has not been added yet`);
        }
        if (!existing.functions.includes(addFunction)) {
            existing.functions.push(addFunction);
        }
    }
    addLibraryCall(callFn, baseFn, args = []) {
        const fn = this.addFunction(baseFn);
        if (callFn.module !== undefined) {
            this.addModuleFunction(callFn.module, (0, module_prefix_1.getImportName)(callFn));
        }
        const libraryCall = { callFn, args };
        fn.libraryCalls.push(libraryCall);
    }
    addFunction(baseFn) {
        (0, hash_builtin_1.importHashBuiltin)(this);
        const signature = [baseFn.name, '(', ...baseFn.args.map(a => a.name), ')'].join('');
        const got = this.functionMap.get(signature);
        if (got !== undefined) {
            return got;
        }
        else {
            const fn = {
                libraryCalls: [],
                code: [],
                final: false,
                ...baseFn,
            };
            this.functionMap.set(signature, fn);
            return fn;
        }
    }
    addConstructorArgument(arg) {
        for (const existingArg of this.constructorArgs) {
            if (existingArg.name == arg.name) {
                return;
            }
        }
        this.constructorArgs.push(arg);
    }
    addConstructorCode(code) {
        (0, hash_builtin_1.importHashBuiltin)(this);
        this.constructorCode.push(code);
    }
    addFunctionCode(code, baseFn) {
        const fn = this.addFunction(baseFn);
        if (fn.final) {
            throw new Error(`Function ${baseFn.name} is already finalized`);
        }
        fn.code.push(code);
    }
    setFunctionBody(code, baseFn) {
        const fn = this.addFunction(baseFn);
        if (fn.code.length > 0) {
            throw new Error(`Function ${baseFn.name} has additional code`);
        }
        fn.code.push(...code);
        fn.final = true;
    }
    addVariable(code) {
        const present = this.variableSet.has(code);
        this.variableSet.add(code);
        return !present;
    }
}
exports.ContractBuilder = ContractBuilder;
//# sourceMappingURL=contract.js.map