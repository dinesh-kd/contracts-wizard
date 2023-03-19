"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInfo = exports.defaults = exports.infoOptions = void 0;
exports.infoOptions = [{}, { license: 'WTFPL' }];
exports.defaults = { license: 'MIT' };
function setInfo(c, info) {
    const { license } = info;
    if (license) {
        c.license = license;
    }
}
exports.setInfo = setInfo;
//# sourceMappingURL=set-info.js.map