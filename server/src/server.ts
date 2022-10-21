import * as fs from 'fs';
import * as vscode from 'vscode';
import * as Path from 'path';

import {
    CompletionList,
    Diagnostic,
    InitializeParams,
    createConnection,
    Logger,
    NullLogger,
    ProtocolConnection,
    TextDocuments,
    TextDocumentSyncKind,
    ProposedFeatures,
} from 'vscode-languageserver/node';

import {
    getLanguageService as getHTMLLanguageService,
    LanguageService as HtmlLanguageService,
    Position,
    Range,
} from 'vscode-html-languageservice';

import os = require('os');

import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem } from 'vscode-css-languageservice';

export const connection = createConnection(ProposedFeatures.all);

function e(): ProtocolConnection {
    let a: any;
    return a;
}

// Create a simple text document manager. The text document manager
// supports full document sync only
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
    documents.onDidClose((e) => {
        //  languageModes.onDocumentRemoved(e.document);
    });
    connection.onShutdown(() => {
        // languageModes.dispose();
    });

    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            // Tell the client that the server supports code completion
            completionProvider: {
                resolveProvider: false,
            },
        },
    };
});

connection.onDidChangeConfiguration((_change) => {
    // Revalidate all open text documents
    // documents.all().forEach(validateTextDocument);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    // validateTextDocument(change.document);
});

connection.onCompletion(async (textDocumentPosition, token) => {
    const items: CompletionItem[] = [];

    try {
        const document = documents.get(textDocumentPosition.textDocument.uri);
        if (!document) {
            return null;
        }

        const text = document.getText();

        /*
        const tokens: IterableStream<Token> = createNormalTokenStream(text);

        let lines = '';
        let line = '';
        let inAttributes = 0;

        while (tokens.hasEntriesLeft()) {
            const token = tokens.step();

            if (token.type === TokenType.EOL) {
                lines += line + os.EOL;
                line = '';
            }
            if (token.type === TokenType.TAG) {
                line += '<';
                for (let j = 0; j < token.data.length - 1; j++) {
                    line += ' ';
                }
            } else {
                if (token.type === TokenType.PARENTHESES_CLOSED) {
                    inAttributes -= 1;
                }

                if (inAttributes > 0) {
                    line += token.data;
                } else {
                    for (let j = 0; j < token.data.length; j++) {
                        line += ' ';
                    }
                }
                if (token.type === TokenType.PARENTHESES_OPEN) {
                    inAttributes += 1;
                }
            }
        }
        lines += connection.console.log(lines);
        connection.console.log('Lines')
        */

        const service: HtmlLanguageService = getHTMLLanguageService();

        const doc: TextDocument = TextDocument.create(document.uri, 'html', document.version, '<aaa    ');

        const list = service.doComplete(doc, Position.create(1, 4), service.parseHTMLDocument(doc));

        list.items.forEach((ref) => {
            //  connection.console.log(JSON.stringify(ref) + ",");
            const item = CompletionItem.create(ref.label);
            item.kind = ref.kind;
            item.documentation = ref.documentation;

            items.push(item);

            //items.push(ref);
        });
    } catch (e) {
        connection.console.error(String(e));
    }

    return CompletionList.create(items);
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
