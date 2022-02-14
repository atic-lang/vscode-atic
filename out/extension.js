"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const factoryTaskProvider_1 = require("./factoryTaskProvider");
const factory_compiler_1 = require("./factory-compiler");
const vscode_languageclient_1 = require("vscode-languageclient");
const subscriptions = [];
let client;
function activate(context) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6002'] };
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'factory' }],
    };
    client = new vscode_languageclient_1.LanguageClient('factoryServer', 'Factory Language Server', serverOptions, clientOptions);
    client.start();
    const provider = new factoryTaskProvider_1.FactoryTaskProvider();
    const task = vscode.tasks.registerTaskProvider('Factory File Watcher', provider);
    const command = vscode.commands.registerCommand('factory.convertFile', () => {
        const file = vscode.window.activeTextEditor.document.uri.fsPath;
        if (file) {
            if ((0, factory_compiler_1.isFileFactoryFile)(file)) {
                (0, factory_compiler_1.convertFile)(file);
            }
            else {
                factory_compiler_1.terminal.appendLine(`${file} is not in .factory or .fty format (if its a vscode bug, try reloading the file)`);
            }
        }
    });
    subscriptions.push(provider, task, command, factory_compiler_1.terminal);
}
exports.activate = activate;
function deactivate() {
    subscriptions.forEach((ref) => {
        ref.dispose();
    });
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
