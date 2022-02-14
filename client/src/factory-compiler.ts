import * as fs from 'fs';
import * as vscode from 'vscode';
import * as Path from 'path';
import { FactoryBuilderResult, getBuilderResult } from 'factory-transpiler/out/factory-transpiler';

const exportType: string = 'html';
const importTypes: string[] = ['factory', 'fty'];
const debug = true;

export let terminal: vscode.OutputChannel;
terminal = vscode.window.createOutputChannel('Factory Transpiler');
terminal.show();

export function convertFile(file: string) {
    if (fs.existsSync(file)) {
        let data: string = '';
        try {
            data = fs.readFileSync(file).toString();
        } catch (err) {
            terminal.appendLine(String(err));
            return;
        }
        const result: FactoryBuilderResult = getBuilderResult(data, debug);
        if (result.error != null) {
            terminal.appendLine('ERROR');
            terminal.appendLine(result.error.errorString);
            terminal.appendLine('Ln ' + result.error.line + ', Col ' + result.error.column);
            return;
        }
        try {
            let name = Path.basename(file);
            const matches = name.match(/[^\.]*(?=\.)/gm)?.filter((ref) => ref.length > 0);
            if (matches) {
                name = '';
                for (let i = 0; i < matches.length; i++) {
                    name += matches[i] + (i == matches.length - 1 ? '' : '.');
                }
            }
            fs.writeFileSync(`${Path.dirname(file)}/${name}.${exportType}`, result.domElements);
        } catch (err) {
            terminal.appendLine(String(err));
            return;
        }
        terminal.appendLine('Compiled... Found 0 Errors');
    }
}
export function isFileFactoryFile(file: string) {
    return importTypes.find((text) => file.endsWith('.' + text)) != undefined;
}
