"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    var type = "Factory";
    vscode.tasks.registerTaskProvider(type, {
        provideTasks(token) {
            var execution = new vscode.ShellExecution("java -jar $env:APPDATA/HTMLFactory/Factory.jar ${file}");
            var problemMatchers = ["$myProblemMatcher"];
            return [
                new vscode.Task({ type: type }, vscode.TaskScope.Workspace, "Convert to HTML", type, execution, problemMatchers),
            ];
        },
        resolveTask(task, token) {
            return task;
        },
    });
}
exports.activate = activate;
//# sourceMappingURL=customTaskProvider.js.map