"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importHashBuiltin = void 0;
const define_modules_1 = require("./define-modules");
const modules = (0, define_modules_1.defineModules)({
    cairo_builtins: {
        path: 'starkware.cairo.common.cairo_builtins',
        useNamespace: false
    },
});
function importHashBuiltin(c) {
    c.addModule(modules.cairo_builtins, [], [], false);
    c.addModuleFunction(modules.cairo_builtins, 'HashBuiltin');
}
exports.importHashBuiltin = importHashBuiltin;
//# sourceMappingURL=hash-builtin.js.map