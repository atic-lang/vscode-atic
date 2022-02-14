"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryTaskProvider = void 0;
const vscode = require("vscode");
const factory_compiler_1 = require("./factory-compiler");
class FactoryTaskProvider {
    constructor() {
        this.filewatcher = vscode.workspace.createFileSystemWatcher('**/*.{factory,fty}');
        this.filewatcher.onDidChange((ref) => this.onFileChange(ref));
    }
    onFileChange(uri) {
        const debug = true;
        const file = uri.fsPath;
        factory_compiler_1.terminal.clear();
        factory_compiler_1.terminal.appendLine('[Factory] File change detected.');
        if ((0, factory_compiler_1.isFileFactoryFile)(file))
            (0, factory_compiler_1.convertFile)(file);
    }
    provideTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
        let execution = new vscode.ShellExecution(
          "java -jar $env:APPDATA/HTMLFactory/Factory.jar ${file}"
        );
        let problemMatchers = ["$myProblemMatcher"];
          */
            return [];
            // return [
            //   new vscode.Task(
            //     { type: FactoryTaskProvider.type },
            //     vscode.TaskScope.Workspace,
            //     "Conversion Task",
            //     FactoryTaskProvider.type,
            //     execution,
            //     problemMatchers
            //   ),
            // ];
        });
    }
    resolveTask(_task) {
        return _task;
    }
    dispose() {
        this.filewatcher.dispose();
    }
}
exports.FactoryTaskProvider = FactoryTaskProvider;
