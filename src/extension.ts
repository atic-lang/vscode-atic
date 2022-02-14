import * as vscode from 'vscode';
import * as path from 'path';
import { FactoryTaskProvider } from './factoryTaskProvider';
import { convertFile, isFileFactoryFile, terminal } from './factory-compiler';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';

const subscriptions: vscode.Disposable[] = [];
let client: LanguageClient;
export function activate(context: vscode.ExtensionContext): void {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6002'] };
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions,
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'factory' }],
    };

    client = new LanguageClient('factoryServer', 'Factory Language Server', serverOptions, clientOptions);

    client.start();

    const provider = new FactoryTaskProvider();
    const task = vscode.tasks.registerTaskProvider('Factory File Watcher', provider);

    const command = vscode.commands.registerCommand('factory.convertFile', () => {
        const file = vscode.window.activeTextEditor.document.uri.fsPath;
        if (file) {
            if (isFileFactoryFile(file)) {
                convertFile(file);
            } else {
                terminal.appendLine(
                    `${file} is not in .factory or .fty format (if its a vscode bug, try reloading the file)`
                );
            }
        }
    });

    subscriptions.push(provider, task, command, terminal);
}

export function deactivate(): Thenable<void> | undefined {
    subscriptions.forEach((ref) => {
        ref.dispose();
    });
    if (!client) {
        return undefined;
    }
    return client.stop();
}
