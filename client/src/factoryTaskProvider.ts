import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { convertFile, isFileFactoryFile, terminal } from './factory-compiler';

export class FactoryTaskProvider implements vscode.Disposable {
    filewatcher: vscode.FileSystemWatcher;

    constructor() {
        this.filewatcher = vscode.workspace.createFileSystemWatcher('**/*.{factory,fty}');
        this.filewatcher.onDidChange((ref: Uri) => this.onFileChange(ref));
    }

    public onFileChange(uri: Uri) {
        const debug = true;
        const file = uri.fsPath;
        terminal.clear();
        terminal.appendLine('[Factory] File change detected.');
        if (isFileFactoryFile(file)) {
            convertFile(file);
        }
    }

    public async provideTasks(): Promise<vscode.Task[]> {
        return [];
    }

    public resolveTask(_task: vscode.Task): vscode.Task | undefined {
        return _task;
    }

    dispose() {
        this.filewatcher.dispose();
    }
}
