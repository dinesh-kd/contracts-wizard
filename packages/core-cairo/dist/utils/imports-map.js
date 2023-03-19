"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportsMap = void 0;
const module_prefix_1 = require("./module-prefix");
function getImportsMap(contract) {
    const modulesToParentFunctions = getModulesToParentFunctions(contract);
    const modulesToLibraryFunctions = getModulesToLibraryFunctions(contract);
    mergeToLibraryFunctions(modulesToParentFunctions, modulesToLibraryFunctions);
    return modulesToLibraryFunctions;
}
exports.getImportsMap = getImportsMap;
function mergeToLibraryFunctions(modulesToParentFunctions, modulesToLibraryFunctions) {
    modulesToParentFunctions.forEach((value, key) => {
        const functionsToMerge = modulesToLibraryFunctions.get(key);
        if (functionsToMerge !== undefined) {
            functionsToMerge.forEach(fn => { value.add(fn); });
            modulesToLibraryFunctions.set(key, value);
        }
    });
}
function getModulesToLibraryFunctions(contract) {
    const modulesToLibraryFunctions = new Map();
    for (const parent of contract.libraries) {
        if (parent.functions !== undefined) {
            modulesToLibraryFunctions.set(convertPathToImport(parent.module.path), new Set(parent.functions));
        }
    }
    return modulesToLibraryFunctions;
}
function getModulesToParentFunctions(contract) {
    const functionsToModules = new Map();
    for (const fn of contract.functions) {
        if (fn.module !== undefined) {
            functionsToModules.set((0, module_prefix_1.getImportName)(fn), convertPathToImport(fn.module.path));
        }
    }
    const modulesToFunctions = invertMapToSet(functionsToModules);
    return modulesToFunctions;
}
function convertPathToImport(relativePath) {
    return relativePath.split('/').join('.');
}
function invertMapToSet(functionsToModules) {
    const modulesToFunctions = new Map();
    for (const [functionName, moduleName] of functionsToModules.entries()) {
        const moduleFunctions = modulesToFunctions.get(moduleName);
        if (moduleFunctions === undefined) {
            modulesToFunctions.set(moduleName, new Set().add(functionName));
        }
        else {
            moduleFunctions.add(functionName);
        }
    }
    return modulesToFunctions;
}
//# sourceMappingURL=imports-map.js.map