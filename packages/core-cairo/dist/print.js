"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printValue = exports.printContract = void 0;
require("array.prototype.flatmap/auto");
const options_1 = require("./options");
const format_lines_1 = require("./utils/format-lines");
const imports_map_1 = require("./utils/imports-map");
const map_values_1 = require("./utils/map-values");
const module_prefix_1 = require("./utils/module-prefix");
function printContract(contract) {
    const helpers = (0, options_1.withHelpers)(contract);
    const fns = (0, map_values_1.mapValues)(sortedFunctions(contract), fns => fns.map(fn => printFunction(fn)));
    const hasViews = fns.views.some(l => l.length > 0);
    const hasExternals = fns.externals.some(l => l.length > 0);
    const { starkwareImports, ozImports } = printImports(contract);
    return (0, format_lines_1.formatLines)(...(0, format_lines_1.spaceBetween)([
        `// SPDX-License-Identifier: ${contract.license}`,
    ], [
        `%lang starknet`
    ], [
        ...starkwareImports,
    ], ozImports, (0, format_lines_1.spaceBetween)(contract.variables, printConstructor(contract, helpers), ...fns.code, ...fns.modifiers, hasViews ?
        [
            `//`,
            `// Getters`,
            `//`
        ] : [], ...fns.views, hasExternals ?
        [
            `//`,
            `// Externals`,
            `//`
        ] : [], ...fns.externals)));
}
exports.printContract = printContract;
function withSemicolons(lines) {
    return lines.map(line => line.endsWith(';') ? line : line + ';');
}
function printImports(contract) {
    const modulesToLibraryFunctions = (0, imports_map_1.getImportsMap)(contract);
    const { starkwareImportsMap, ozImportsMap } = getVendoredImports(modulesToLibraryFunctions);
    const starkwareImports = printImportLines(starkwareImportsMap);
    const ozImports = printImportLines(ozImportsMap);
    return { starkwareImports, ozImports };
}
function getVendoredImports(parentImportsMap) {
    const starkwareImportsMap = new Map();
    const ozImportsMap = new Map();
    for (let [key, value] of parentImportsMap) {
        if (key.startsWith('starkware')) {
            starkwareImportsMap.set(key, value);
        }
        else {
            ozImportsMap.set(key, value);
        }
    }
    return { starkwareImportsMap, ozImportsMap };
}
function printImportLines(importStatements) {
    const lines = [];
    for (const [module, fns] of importStatements.entries()) {
        if (fns.size > 1) {
            lines.push(`from ${module} import (`);
            lines.push(Array.from(fns).map(p => `${p},`));
            lines.push(`)`);
        }
        else if (fns.size === 1) {
            lines.push(`from ${module} import ${Array.from(fns)[0]}`);
        }
    }
    return lines;
}
function printConstructor(contract, helpers) {
    var _a;
    const hasParentParams = contract.libraries.some(p => p.initializer !== undefined && p.initializer.params.length > 0);
    const hasConstructorCode = contract.constructorCode.length > 0;
    if (hasParentParams || hasConstructorCode) {
        const parents = contract.libraries
            .filter(hasInitializer)
            .flatMap(p => printParentConstructor(p));
        const modifier = helpers.upgradeable ? 'external' : 'constructor';
        const head = helpers.upgradeable ? 'func initializer' : 'func constructor';
        const args = contract.constructorArgs.map(a => printArgument(a));
        const implicitArgs = (_a = contract.constructorImplicitArgs) === null || _a === void 0 ? void 0 : _a.map(a => printArgument(a));
        const body = (0, format_lines_1.spaceBetween)(withSemicolons(parents), withSemicolons(contract.constructorCode));
        const constructor = printFunction2(head, implicitArgs !== null && implicitArgs !== void 0 ? implicitArgs : [], args, modifier, undefined, 'return ();', body);
        return constructor;
    }
    else {
        return [];
    }
}
function hasInitializer(parent) {
    return parent.initializer !== undefined && parent.module.name !== undefined;
}
function sortedFunctions(contract) {
    const fns = { code: [], modifiers: [], views: [], externals: [] };
    for (const fn of contract.functions) {
        if (fn.kind === undefined && fn.code.length > 0) { // fallback case, not sure if anything fits in this category
            fns.code.push(fn);
        }
        else if (fn.kind === 'view') {
            fns.views.push(fn);
        }
        else {
            fns.externals.push(fn);
        }
    }
    return fns;
}
function printParentConstructor({ module, initializer }) {
    if (initializer === undefined || module.name === undefined || !module.useNamespace) {
        return [];
    }
    const fn = `${module.name}.initializer`;
    return [
        fn + '(' + initializer.params.map(printValue).join(', ') + ')',
    ];
}
function printValue(value) {
    if (typeof value === 'object') {
        if ('lit' in value) {
            return value.lit;
        }
        else if ('note' in value) {
            return `${printValue(value.value)} /* ${value.note} */`;
        }
        else {
            throw Error('Unknown value type');
        }
    }
    else if (typeof value === 'number') {
        if (Number.isSafeInteger(value)) {
            return value.toFixed(0);
        }
        else {
            throw new Error(`Number not representable (${value})`);
        }
    }
    else {
        return `'${value}'`;
    }
}
exports.printValue = printValue;
function printFunction(fn) {
    var _a, _b, _c, _d;
    const code = [];
    const returnArgs = (_a = fn.returns) === null || _a === void 0 ? void 0 : _a.map(a => typeof a === 'string' ? a : a.name);
    fn.libraryCalls.forEach(libraryCall => {
        const libraryCallString = `${(0, module_prefix_1.getFunctionName)(libraryCall.callFn)}(${libraryCall.args.join(', ')})`;
        code.push(libraryCallString);
    });
    let returnLine = 'return ();';
    if (!fn.final && fn.module !== undefined) {
        const fnName = (0, module_prefix_1.getFunctionName)(fn);
        const parentFunctionCall = fn.read ?
            `${fnName}.read()` :
            `${fnName}(${fn.args.map(a => a.name).join(', ')})`;
        if (!fn.passthrough || returnArgs === undefined || returnArgs.length === 0) {
            code.push(parentFunctionCall);
        }
        else if (fn.passthrough === 'strict') {
            code.push(`let (${returnArgs}) = ${parentFunctionCall}`);
            const namedReturnVars = returnArgs.map(v => `${v}=${v}`).join(', ');
            returnLine = `return (${namedReturnVars});`;
        }
        else if (fn.passthrough === true) {
            returnLine = `return ${parentFunctionCall};`;
        }
    }
    code.push(...fn.code);
    return printFunction2('func ' + fn.name, (_c = (_b = fn.implicitArgs) === null || _b === void 0 ? void 0 : _b.map(a => printArgument(a))) !== null && _c !== void 0 ? _c : [], fn.args.map(a => printArgument(a)), fn.kind, (_d = fn.returns) === null || _d === void 0 ? void 0 : _d.map(a => typeof a === 'string' ? a : printArgument(a)), returnLine, withSemicolons(code));
}
// generic for functions and constructors
// kindedName = 'func foo'
function printFunction2(kindedName, implicitArgs, args, kind, returns, returnLine, code) {
    const fn = [];
    if (kind !== undefined) {
        fn.push(`@${kind}`);
    }
    let accum = kindedName;
    if (implicitArgs.length > 0) {
        accum += '{' + implicitArgs.join(', ') + '}';
    }
    if (args.length > 0) {
        fn.push(`${accum}(`);
        let formattedArgs = args.join(', ');
        if (formattedArgs.length > 80) {
            // print each arg in a separate line
            fn.push(args.map(arg => `${arg},`));
        }
        else {
            fn.push([formattedArgs]);
        }
        accum = ')';
    }
    else {
        accum += '()';
    }
    if (returns === undefined) {
        accum += ' {';
    }
    else {
        accum += ` -> (${returns.join(', ')}) {`;
    }
    fn.push(accum);
    fn.push(code);
    if (returnLine !== undefined) {
        fn.push([returnLine]);
    }
    fn.push('}');
    return fn;
}
function printArgument(arg) {
    if (arg.type !== undefined) {
        const type = arg.type;
        return `${arg.name}: ${type}`;
    }
    else {
        return `${arg.name}`;
    }
}
//# sourceMappingURL=print.js.map