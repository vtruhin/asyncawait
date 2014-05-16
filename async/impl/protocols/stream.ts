﻿import references = require('references');
import stream = require('stream');
import Promise = require('bluebird');
import Protocol = require('./base');
export = StreamProtocol;


class StreamProtocol extends Protocol {
    constructor() { super(); }

    invoke(func: Function, this_: any, args: any[]): stream.Readable {
        super.invoke(func, this_, args);
        var stream = this.stream = new Stream(() => setImmediate(() => this.resume()));
        return stream;
    }

    return(result) {
        this.stream.push(null);
    }

    throw(error) {
        this.stream.emit('error', error);
    }

    yield(value) {
        this.stream.push(value);
        this.suspend();
    }

    static SuspendableType: AsyncAwait.AsyncStream;

    private stream: Stream;
}


class Stream extends stream.Readable {
    constructor(private readImpl: () => void) {
        super({objectMode: true});
    }

    _read() {
        this.readImpl();
    }
}
