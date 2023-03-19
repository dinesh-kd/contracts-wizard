"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const contract_1 = require("./contract");
const print_1 = require("./print");
(0, ava_1.default)('contract basics', t => {
    const Foo = new contract_1.ContractBuilder();
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with constructor code', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addConstructorCode('someFunction()');
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with constructor code with semicolon', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addConstructorCode('someFunction();');
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with function code', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addFunctionCode('someFunction()', _otherFunction);
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with function code with semicolon', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addFunctionCode('someFunction();', _otherFunction);
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with initializer params', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addModule(someModule, ['param1'], [], true);
    t.snapshot((0, print_1.printContract)(Foo));
});
(0, ava_1.default)('contract with library call', t => {
    const Foo = new contract_1.ContractBuilder();
    Foo.addModule(someModule, [], [], false);
    Foo.addFunction(_libraryFunction);
    t.snapshot((0, print_1.printContract)(Foo));
});
const someModule = {
    name: 'SomeLibrary',
    path: 'contracts/some/library',
    useNamespace: true
};
const _otherFunction = {
    name: 'otherFunction',
    kind: 'external',
    args: [],
};
const _libraryFunction = {
    module: someModule,
    name: 'libraryFunction',
    kind: 'external',
    args: [],
};
//# sourceMappingURL=contract.test.js.map