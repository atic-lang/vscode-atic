export class IterableStream<T> {
    entries: T[];
    position = 0;
    currentToken?: T = undefined;

    constructor(list: T[]) {
        this.entries = list;
        this.position = 0;
    }

    public step(): T | undefined {
        if (this.position >= this.entries.length) {
            return undefined;
        }
        this.currentToken = this.entries[this.position];
        this.position += 1;
        return this.currentToken;
    }

    public stepBackwards() {
        this.position -= 1;
        this.currentToken = this.entries[this.position];
    }

    public reset() {
        this.position = 0;
        this.step();
    }

    public hasEntriesLeft() {
        return this.position < this.entries.length;
    }

    public index() {
        return this.position;
    }
    public getCurrentEntry(): T | undefined {
        return this.currentToken;
    }
}
