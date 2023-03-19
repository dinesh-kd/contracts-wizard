"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sources_1 = require("./generate/sources");
const api_1 = require("./api");
function isAccessControlRequired(opts) {
    switch (opts.kind) {
        case 'ERC20':
            return api_1.erc20.isAccessControlRequired(opts);
        case 'ERC721':
            return api_1.erc721.isAccessControlRequired(opts);
        case 'Custom':
            return api_1.custom.isAccessControlRequired(opts);
        default:
            throw new Error("No such kind");
    }
}
(0, ava_1.default)('is access control required', async (t) => {
    for (const contract of (0, sources_1.generateSources)('all')) {
        const regexOwnable = /(from openzeppelin.access.ownable.library import Ownable)/gm;
        if (!contract.options.access) {
            if (isAccessControlRequired(contract.options)) {
                t.regex(contract.source, regexOwnable, JSON.stringify(contract.options));
            }
            else {
                t.notRegex(contract.source, regexOwnable, JSON.stringify(contract.options));
            }
        }
    }
});
//# sourceMappingURL=test.js.map