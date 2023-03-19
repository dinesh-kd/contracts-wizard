"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineModules = void 0;
function defineModules(modules) {
    return Object.fromEntries(Object.entries(modules).map(([name, module]) => [
        name,
        Object.assign({ name }, module),
    ]));
}
exports.defineModules = defineModules;
//# sourceMappingURL=define-modules.js.map