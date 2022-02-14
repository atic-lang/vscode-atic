import { IterableStream } from './iterable-stream';
import { Token, TokenType } from './tokenizer';

export class FactoryException<T> extends Error {
    constructor(public stream: IterableStream<T>, text: string) {
        super(text);
    }
}

export class FactoryCharacterException extends FactoryException<string> {
    constructor(stream: IterableStream<string>, error: string) {
        super(stream, error);
    }
}

export class FactoryTokenException extends FactoryException<Token> {
    constructor(stream: IterableStream<Token>, type: Token | string, expected?: TokenType) {
        if (typeof type === 'string') {
            super(stream, 'Failed to parse Token: ' + type);
            return;
        }
        super(stream, `Expected ${TokenType[expected]} but found ${type == null ? 'none' : TokenType[type.type]}`);
    }
}

export class FactorySyntaxException extends FactoryTokenException {
    constructor(stream: IterableStream<Token>, error: string) {
        super(stream, error);
    }
}

export class FactoryMismatchException extends FactoryTokenException {
    constructor(stream: IterableStream<Token>, error: string) {
        super(stream, error);
    }
}
