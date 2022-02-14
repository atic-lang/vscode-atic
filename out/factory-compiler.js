"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFileFactoryFile = exports.convertFile = exports.terminal = void 0;
const fs = require("fs");
const vscode = require("vscode");
const Path = require("path");
const factory_transpiler_1 = require("factory-transpiler/out/factory-transpiler");
const exportType = 'html';
const importTypes = ['factory', 'fty'];
const debug = true;
exports.terminal = vscode.window.createOutputChannel('Factory Transpiler');
exports.terminal.show();
function convertFile(file) {
    var _a;
    if (fs.existsSync(file)) {
        let data = '';
        try {
            data = fs.readFileSync(file).toString();
        }
        catch (err) {
            exports.terminal.appendLine(String(err));
            return;
        }
        const result = (0, factory_transpiler_1.getBuilderResult)(data, debug);
        if (result.error != null) {
            exports.terminal.appendLine('ERROR');
            exports.terminal.appendLine(result.error.errorString);
            exports.terminal.appendLine('Ln ' + result.error.line + ', Col ' + result.error.column);
            return;
        }
        try {
            let name = Path.basename(file);
            const matches = (_a = name.match(/[^\.]*(?=\.)/gm)) === null || _a === void 0 ? void 0 : _a.filter((ref) => ref.length > 0);
            if (matches) {
                name = '';
                for (let i = 0; i < matches.length; i++) {
                    name += matches[i] + (i == matches.length - 1 ? '' : '.');
                }
            }
            fs.writeFileSync(`${Path.dirname(file)}/${name}.${exportType}`, result.domElements);
        }
        catch (err) {
            exports.terminal.appendLine(String(err));
            return;
        }
        exports.terminal.appendLine('Compiled... Found 0 Errors');
    }
}
exports.convertFile = convertFile;
function isFileFactoryFile(file) {
    return importTypes.find((text) => file.endsWith('.' + text)) != undefined;
}
exports.isFileFactoryFile = isFileFactoryFile;
