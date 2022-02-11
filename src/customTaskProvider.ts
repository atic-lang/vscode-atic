import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  var type = "Factory";
  vscode.tasks.registerTaskProvider(type, {
    provideTasks(token?: vscode.CancellationToken) {
      var execution = new vscode.ShellExecution(
        "java -jar $env:APPDATA/HTMLFactory/Factory.jar ${file}"
      );
      var problemMatchers = ["$myProblemMatcher"];
      return [
        new vscode.Task(
          { type: type },
          vscode.TaskScope.Workspace,
          "Convert to HTML",
          type,
          execution,
          problemMatchers
        ),
      ];
    },
    resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
      return task;
    },
  });
}
