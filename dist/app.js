// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

var LogLevels;
(function(LogLevels1) {
    LogLevels1[LogLevels1["NOTSET"] = 0] = "NOTSET";
    LogLevels1[LogLevels1["DEBUG"] = 10] = "DEBUG";
    LogLevels1[LogLevels1["INFO"] = 20] = "INFO";
    LogLevels1[LogLevels1["WARNING"] = 30] = "WARNING";
    LogLevels1[LogLevels1["ERROR"] = 40] = "ERROR";
    LogLevels1[LogLevels1["CRITICAL"] = 50] = "CRITICAL";
})(LogLevels || (LogLevels = {}));
Object.keys(LogLevels).filter((key1)=>isNaN(Number(key1)));
const byLevel = {
    [String(LogLevels.NOTSET)]: "NOTSET",
    [String(LogLevels.DEBUG)]: "DEBUG",
    [String(LogLevels.INFO)]: "INFO",
    [String(LogLevels.WARNING)]: "WARNING",
    [String(LogLevels.ERROR)]: "ERROR",
    [String(LogLevels.CRITICAL)]: "CRITICAL"
};
function getLevelByName(name) {
    switch(name){
        case "NOTSET":
            return LogLevels.NOTSET;
        case "DEBUG":
            return LogLevels.DEBUG;
        case "INFO":
            return LogLevels.INFO;
        case "WARNING":
            return LogLevels.WARNING;
        case "ERROR":
            return LogLevels.ERROR;
        case "CRITICAL":
            return LogLevels.CRITICAL;
        default:
            throw new Error(`no log level found for "${name}"`);
    }
}
function getLevelName(level) {
    const levelName = byLevel[level];
    if (levelName) {
        return levelName;
    }
    throw new Error(`no level name found for level: ${level}`);
}
class LogRecord {
    msg;
    #args;
    #datetime;
    level;
    levelName;
    loggerName;
    constructor(options){
        this.msg = options.msg;
        this.#args = [
            ...options.args
        ];
        this.level = options.level;
        this.loggerName = options.loggerName;
        this.#datetime = new Date();
        this.levelName = getLevelName(options.level);
    }
    get args() {
        return [
            ...this.#args
        ];
    }
    get datetime() {
        return new Date(this.#datetime.getTime());
    }
}
class Logger {
    #level;
    #handlers;
    #loggerName;
    constructor(loggerName, levelName, options = {}){
        this.#loggerName = loggerName;
        this.#level = getLevelByName(levelName);
        this.#handlers = options.handlers || [];
    }
    get level() {
        return this.#level;
    }
    set level(level) {
        this.#level = level;
    }
    get levelName() {
        return getLevelName(this.#level);
    }
    set levelName(levelName) {
        this.#level = getLevelByName(levelName);
    }
    get loggerName() {
        return this.#loggerName;
    }
    set handlers(hndls) {
        this.#handlers = hndls;
    }
    get handlers() {
        return this.#handlers;
    }
     #_log(level, msg, ...args1) {
        if (this.level > level) {
            return msg instanceof Function ? undefined : msg;
        }
        let fnResult;
        let logMessage;
        if (msg instanceof Function) {
            fnResult = msg();
            logMessage = this.asString(fnResult);
        } else {
            logMessage = this.asString(msg);
        }
        const record = new LogRecord({
            msg: logMessage,
            args: args1,
            level: level,
            loggerName: this.loggerName
        });
        this.#handlers.forEach((handler)=>{
            handler.handle(record);
        });
        return msg instanceof Function ? fnResult : msg;
    }
    asString(data1) {
        if (typeof data1 === "string") {
            return data1;
        } else if (data1 === null || typeof data1 === "number" || typeof data1 === "bigint" || typeof data1 === "boolean" || typeof data1 === "undefined" || typeof data1 === "symbol") {
            return String(data1);
        } else if (data1 instanceof Error) {
            return data1.stack;
        } else if (typeof data1 === "object") {
            return JSON.stringify(data1);
        }
        return "undefined";
    }
    debug(msg1, ...args1) {
        return this.#_log(LogLevels.DEBUG, msg1, ...args1);
    }
    info(msg2, ...args2) {
        return this.#_log(LogLevels.INFO, msg2, ...args2);
    }
    warning(msg3, ...args3) {
        return this.#_log(LogLevels.WARNING, msg3, ...args3);
    }
    error(msg4, ...args4) {
        return this.#_log(LogLevels.ERROR, msg4, ...args4);
    }
    critical(msg5, ...args5) {
        return this.#_log(LogLevels.CRITICAL, msg5, ...args5);
    }
}
const { Deno: Deno1  } = globalThis;
const noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str1, code1) {
    return enabled ? `${code1.open}${str1.replace(code1.regexp, code1.open)}${code1.close}` : str1;
}
function bold(str2) {
    return run(str2, code([
        1
    ], 22));
}
function red(str3) {
    return run(str3, code([
        31
    ], 39));
}
function yellow(str4) {
    return run(str4, code([
        33
    ], 39));
}
function blue(str5) {
    return run(str5, code([
        34
    ], 39));
}
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))", 
].join("|"), "g");
async function exists(filePath) {
    try {
        await Deno.lstat(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
function existsSync(filePath) {
    try {
        Deno.lstatSync(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg6 = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg6);
    }
}
function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const MIN_BUF_SIZE = 16;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    name;
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
        this.name = "BufferFullError";
    }
    partial;
}
class PartialReadError extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader {
    #buf;
    #rd;
    #r = 0;
    #w = 0;
    #eof = false;
    static create(r1, size = 4096) {
        return r1 instanceof BufReader ? r1 : new BufReader(r1, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    size() {
        return this.#buf.byteLength;
    }
    buffered() {
        return this.#w - this.#r;
    }
    #fill = async ()=>{
        if (this.#r > 0) {
            this.#buf.copyWithin(0, this.#r, this.#w);
            this.#w -= this.#r;
            this.#r = 0;
        }
        if (this.#w >= this.#buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i1 = 100; i1 > 0; i1--){
            const rr = await this.#rd.read(this.#buf.subarray(this.#w));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert(rr >= 0, "negative read");
            this.#w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    };
    reset(r2) {
        this.#reset(this.#buf, r2);
    }
    #reset = (buf, rd)=>{
        this.#buf = buf;
        this.#rd = rd;
        this.#eof = false;
    };
    async read(p1) {
        let rr = p1.byteLength;
        if (p1.byteLength === 0) return rr;
        if (this.#r === this.#w) {
            if (p1.byteLength >= this.#buf.byteLength) {
                const rr = await this.#rd.read(p1);
                const nread = rr ?? 0;
                assert(nread >= 0, "negative read");
                return rr;
            }
            this.#r = 0;
            this.#w = 0;
            rr = await this.#rd.read(this.#buf);
            if (rr === 0 || rr === null) return rr;
            assert(rr >= 0, "negative read");
            this.#w += rr;
        }
        const copied = copy(this.#buf.subarray(this.#r, this.#w), p1, 0);
        this.#r += copied;
        return copied;
    }
    async readFull(p2) {
        let bytesRead = 0;
        while(bytesRead < p2.length){
            try {
                const rr = await this.read(p2.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = p2.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e1 = new PartialReadError();
                    e1.partial = p2.subarray(0, bytesRead);
                    e1.stack = err.stack;
                    e1.message = err.message;
                    e1.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p2;
    }
    async readByte() {
        while(this.#r === this.#w){
            if (this.#eof) return null;
            await this.#fill();
        }
        const c1 = this.#buf[this.#r];
        this.#r++;
        return c1;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError) {
                partial = err.partial;
                assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError)) {
                throw err;
            }
            partial = err.partial;
            if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
                assert(this.#r > 0, "bufio: tried to rewind past start of buffer");
                this.#r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.#eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s1 = 0;
        let slice;
        while(true){
            let i2 = this.#buf.subarray(this.#r + s1, this.#w).indexOf(delim);
            if (i2 >= 0) {
                i2 += s1;
                slice = this.#buf.subarray(this.#r, this.#r + i2 + 1);
                this.#r += i2 + 1;
                break;
            }
            if (this.#eof) {
                if (this.#r === this.#w) {
                    return null;
                }
                slice = this.#buf.subarray(this.#r, this.#w);
                this.#r = this.#w;
                break;
            }
            if (this.buffered() >= this.#buf.byteLength) {
                this.#r = this.#w;
                const oldbuf = this.#buf;
                const newbuf = this.#buf.slice(0);
                this.#buf = newbuf;
                throw new BufferFullError(oldbuf);
            }
            s1 = this.#w - this.#r;
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e2 = new PartialReadError();
                    e2.partial = slice;
                    e2.stack = err.stack;
                    e2.message = err.message;
                    e2.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.#w - this.#r;
        while(avail < n6 && avail < this.#buf.byteLength && !this.#eof){
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = this.#buf.subarray(this.#r, this.#w);
                } else if (err instanceof Error) {
                    const e3 = new PartialReadError();
                    e3.partial = this.#buf.subarray(this.#r, this.#w);
                    e3.stack = err.stack;
                    e3.message = err.message;
                    e3.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.#w - this.#r;
        }
        if (avail === 0 && this.#eof) {
            return null;
        } else if (avail < n6 && this.#eof) {
            return this.#buf.subarray(this.#r, this.#r + avail);
        } else if (avail < n6) {
            throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
        }
        return this.#buf.subarray(this.#r, this.#r + n6);
    }
}
class AbstractBufBase {
    buf;
    usedBufferBytes = 0;
    err = null;
    constructor(buf){
        this.buf = buf;
    }
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w1) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w1;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p3 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p3.length){
                nwritten += await this.#writer.write(p3.subarray(nwritten));
            }
        } catch (e4) {
            if (e4 instanceof Error) {
                this.err = e4;
            }
            throw e4;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data2) {
        if (this.err !== null) throw this.err;
        if (data2.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data2.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.#writer.write(data2);
                } catch (e5) {
                    if (e5 instanceof Error) {
                        this.err = e5;
                    }
                    throw e5;
                }
            } else {
                numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data2 = data2.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w2) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w2;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p4 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p4.length){
                nwritten += this.#writer.writeSync(p4.subarray(nwritten));
            }
        } catch (e6) {
            if (e6 instanceof Error) {
                this.err = e6;
            }
            throw e6;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data3) {
        if (this.err !== null) throw this.err;
        if (data3.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data3.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.#writer.writeSync(data3);
                } catch (e7) {
                    if (e7 instanceof Error) {
                        this.err = e7;
                    }
                    throw e7;
                }
            } else {
                numBytesWritten = copy(data3, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data3 = data3.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data3, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
const DEFAULT_FORMATTER = "{levelName} {msg}";
class BaseHandler {
    level;
    levelName;
    formatter;
    constructor(levelName, options = {}){
        this.level = getLevelByName(levelName);
        this.levelName = levelName;
        this.formatter = options.formatter || DEFAULT_FORMATTER;
    }
    handle(logRecord) {
        if (this.level > logRecord.level) return;
        const msg7 = this.format(logRecord);
        return this.log(msg7);
    }
    format(logRecord) {
        if (this.formatter instanceof Function) {
            return this.formatter(logRecord);
        }
        return this.formatter.replace(/{([^\s}]+)}/g, (match, p1)=>{
            const value1 = logRecord[p1];
            if (value1 == null) {
                return match;
            }
            return String(value1);
        });
    }
    log(_msg) {}
    async setup() {}
    async destroy() {}
}
class ConsoleHandler extends BaseHandler {
    format(logRecord) {
        let msg8 = super.format(logRecord);
        switch(logRecord.level){
            case LogLevels.INFO:
                msg8 = blue(msg8);
                break;
            case LogLevels.WARNING:
                msg8 = yellow(msg8);
                break;
            case LogLevels.ERROR:
                msg8 = red(msg8);
                break;
            case LogLevels.CRITICAL:
                msg8 = bold(red(msg8));
                break;
            default:
                break;
        }
        return msg8;
    }
    log(msg9) {
        console.log(msg9);
    }
}
class WriterHandler extends BaseHandler {
    _writer;
    #encoder = new TextEncoder();
}
class FileHandler extends WriterHandler {
    _file;
    _buf;
    _filename;
    _mode;
    _openOptions;
    _encoder = new TextEncoder();
    #unloadCallback = (()=>{
        this.destroy();
    }).bind(this);
    constructor(levelName, options){
        super(levelName, options);
        this._filename = options.filename;
        this._mode = options.mode ? options.mode : "a";
        this._openOptions = {
            createNew: this._mode === "x",
            create: this._mode !== "x",
            append: this._mode === "a",
            truncate: this._mode !== "a",
            write: true
        };
    }
    async setup() {
        this._file = await Deno.open(this._filename, this._openOptions);
        this._writer = this._file;
        this._buf = new BufWriterSync(this._file);
        addEventListener("unload", this.#unloadCallback);
    }
    handle(logRecord) {
        super.handle(logRecord);
        if (logRecord.level > LogLevels.ERROR) {
            this.flush();
        }
    }
    log(msg10) {
        if (this._encoder.encode(msg10).byteLength + 1 > this._buf.available()) {
            this.flush();
        }
        this._buf.writeSync(this._encoder.encode(msg10 + "\n"));
    }
    flush() {
        if (this._buf?.buffered() > 0) {
            this._buf.flush();
        }
    }
    destroy() {
        this.flush();
        this._file?.close();
        this._file = undefined;
        removeEventListener("unload", this.#unloadCallback);
        return Promise.resolve();
    }
}
class RotatingFileHandler extends FileHandler {
    #maxBytes;
    #maxBackupCount;
    #currentFileSize = 0;
    constructor(levelName, options){
        super(levelName, options);
        this.#maxBytes = options.maxBytes;
        this.#maxBackupCount = options.maxBackupCount;
    }
    async setup() {
        if (this.#maxBytes < 1) {
            this.destroy();
            throw new Error("maxBytes cannot be less than 1");
        }
        if (this.#maxBackupCount < 1) {
            this.destroy();
            throw new Error("maxBackupCount cannot be less than 1");
        }
        await super.setup();
        if (this._mode === "w") {
            for(let i3 = 1; i3 <= this.#maxBackupCount; i3++){
                if (await exists(this._filename + "." + i3)) {
                    await Deno.remove(this._filename + "." + i3);
                }
            }
        } else if (this._mode === "x") {
            for(let i4 = 1; i4 <= this.#maxBackupCount; i4++){
                if (await exists(this._filename + "." + i4)) {
                    this.destroy();
                    throw new Deno.errors.AlreadyExists("Backup log file " + this._filename + "." + i4 + " already exists");
                }
            }
        } else {
            this.#currentFileSize = (await Deno.stat(this._filename)).size;
        }
    }
    log(msg11) {
        const msgByteLength = this._encoder.encode(msg11).byteLength + 1;
        if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
            this.rotateLogFiles();
            this.#currentFileSize = 0;
        }
        super.log(msg11);
        this.#currentFileSize += msgByteLength;
    }
    rotateLogFiles() {
        this._buf.flush();
        Deno.close(this._file.rid);
        for(let i5 = this.#maxBackupCount - 1; i5 >= 0; i5--){
            const source = this._filename + (i5 === 0 ? "" : "." + i5);
            const dest = this._filename + "." + (i5 + 1);
            if (existsSync(source)) {
                Deno.renameSync(source, dest);
            }
        }
        this._file = Deno.openSync(this._filename, this._openOptions);
        this._writer = this._file;
        this._buf = new BufWriterSync(this._file);
    }
}
class LoggerConfig {
    level;
    handlers;
}
const DEFAULT_LEVEL = "INFO";
const DEFAULT_CONFIG = {
    handlers: {
        default: new ConsoleHandler(DEFAULT_LEVEL)
    },
    loggers: {
        default: {
            level: DEFAULT_LEVEL,
            handlers: [
                "default"
            ]
        }
    }
};
const state = {
    handlers: new Map(),
    loggers: new Map(),
    config: DEFAULT_CONFIG
};
const handlers = {
    BaseHandler,
    ConsoleHandler,
    WriterHandler,
    FileHandler,
    RotatingFileHandler
};
function getLogger(name) {
    if (!name) {
        const d1 = state.loggers.get("default");
        assert(d1 != null, `"default" logger must be set for getting logger without name`);
        return d1;
    }
    const result = state.loggers.get(name);
    if (!result) {
        const logger = new Logger(name, "NOTSET", {
            handlers: []
        });
        state.loggers.set(name, logger);
        return logger;
    }
    return result;
}
function debug(msg12, ...args6) {
    if (msg12 instanceof Function) {
        return getLogger("default").debug(msg12, ...args6);
    }
    return getLogger("default").debug(msg12, ...args6);
}
function info(msg13, ...args7) {
    if (msg13 instanceof Function) {
        return getLogger("default").info(msg13, ...args7);
    }
    return getLogger("default").info(msg13, ...args7);
}
function warning(msg14, ...args8) {
    if (msg14 instanceof Function) {
        return getLogger("default").warning(msg14, ...args8);
    }
    return getLogger("default").warning(msg14, ...args8);
}
function error(msg15, ...args9) {
    if (msg15 instanceof Function) {
        return getLogger("default").error(msg15, ...args9);
    }
    return getLogger("default").error(msg15, ...args9);
}
function critical(msg16, ...args10) {
    if (msg16 instanceof Function) {
        return getLogger("default").critical(msg16, ...args10);
    }
    return getLogger("default").critical(msg16, ...args10);
}
async function setup(config) {
    state.config = {
        handlers: {
            ...DEFAULT_CONFIG.handlers,
            ...config.handlers
        },
        loggers: {
            ...DEFAULT_CONFIG.loggers,
            ...config.loggers
        }
    };
    state.handlers.forEach((handler)=>{
        handler.destroy();
    });
    state.handlers.clear();
    const handlers1 = state.config.handlers || {};
    for(const handlerName1 in handlers1){
        const handler = handlers1[handlerName1];
        await handler.setup();
        state.handlers.set(handlerName1, handler);
    }
    state.loggers.clear();
    const loggers = state.config.loggers || {};
    for(const loggerName in loggers){
        const loggerConfig = loggers[loggerName];
        const handlerNames = loggerConfig.handlers || [];
        const handlers2 = [];
        handlerNames.forEach((handlerName)=>{
            const handler = state.handlers.get(handlerName);
            if (handler) {
                handlers2.push(handler);
            }
        });
        const levelName = loggerConfig.level || DEFAULT_LEVEL;
        const logger = new Logger(loggerName, levelName, {
            handlers: handlers2
        });
        state.loggers.set(loggerName, logger);
    }
}
await setup(DEFAULT_CONFIG);
const mod = await async function() {
    return {
        LogLevels: LogLevels,
        Logger: Logger,
        LoggerConfig: LoggerConfig,
        handlers: handlers,
        getLogger: getLogger,
        debug: debug,
        info: info,
        warning: warning,
        error: error,
        critical: critical,
        setup: setup
    };
}();
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/", 
];
function encode(data4) {
    const uint8 = typeof data4 === "string" ? new TextEncoder().encode(data4) : data4 instanceof Uint8Array ? data4 : new Uint8Array(data4);
    let result = "", i6;
    const l1 = uint8.length;
    for(i6 = 2; i6 < l1; i6 += 3){
        result += base64abc[uint8[i6 - 2] >> 2];
        result += base64abc[(uint8[i6 - 2] & 0x03) << 4 | uint8[i6 - 1] >> 4];
        result += base64abc[(uint8[i6 - 1] & 0x0f) << 2 | uint8[i6] >> 6];
        result += base64abc[uint8[i6] & 0x3f];
    }
    if (i6 === l1 + 1) {
        result += base64abc[uint8[i6 - 2] >> 2];
        result += base64abc[(uint8[i6 - 2] & 0x03) << 4];
        result += "==";
    }
    if (i6 === l1) {
        result += base64abc[uint8[i6 - 2] >> 2];
        result += base64abc[(uint8[i6 - 2] & 0x03) << 4 | uint8[i6 - 1] >> 4];
        result += base64abc[(uint8[i6 - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
function decode(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i7 = 0; i7 < size; i7++){
        bytes[i7] = binString.charCodeAt(i7);
    }
    return bytes;
}
const mod1 = {
    encode: encode,
    decode: decode
};
const data = decode("\
AGFzbQEAAAABo4GAgAAYYAAAYAABf2ABfwBgAX8Bf2ABfwF+YAJ/fwBgAn9/AX9gA39/fwBgA39/fw\
F/YAR/f39/AGAEf39/fwF/YAV/f39/fwBgBX9/f39/AX9gBn9/f39/fwBgBn9/f39/fwF/YAV/f39+\
fwBgB39/f35/f38Bf2ADf39+AGAFf399f38AYAV/f3x/fwBgAn9+AGAEf31/fwBgBH98f38AYAJ+fw\
F/AtKFgIAADRhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18aX193YmdfbmV3X2E0YjYxYTBmNTQ4MjRj\
ZmQABhhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18aX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYAAh\
hfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18hX193YmdfYnl0ZUxlbmd0aF8zZTI1MGI0MWE4OTE1NzU3\
AAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fIV9fd2JnX2J5dGVPZmZzZXRfNDIwNGVjYjI0YTZlNW\
RmOQADGF9fd2JpbmRnZW5fcGxhY2Vob2xkZXJfXx1fX3diZ19idWZmZXJfZmFjZjAzOThhMjgxYzg1\
YgADGF9fd2JpbmRnZW5fcGxhY2Vob2xkZXJfXzFfX3diZ19uZXd3aXRoYnl0ZW9mZnNldGFuZGxlbm\
d0aF80YjliOGM0ZTNmNWFkYmZmAAgYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fHV9fd2JnX2xlbmd0\
aF8xZWI4ZmM2MDhhMGQ0Y2RiAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fEV9fd2JpbmRnZW5fbW\
Vtb3J5AAEYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fHV9fd2JnX2J1ZmZlcl8zOTdlYWE0ZDcyZWU5\
NGRkAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fGl9fd2JnX25ld19hN2NlNDQ3ZjE1ZmY0OTZmAA\
MYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fGl9fd2JnX3NldF85NjlhZDBhNjBlNTFkMzIwAAcYX193\
YmluZGdlbl9wbGFjZWhvbGRlcl9fEF9fd2JpbmRnZW5fdGhyb3cABRhfX3diaW5kZ2VuX3BsYWNlaG\
9sZGVyX18SX193YmluZGdlbl9yZXRocm93AAID7YCAgABsCQcJBwcRBQcHBQMHBw8DBwUQAgUFAgcF\
AggGBwcUDAgOBwcHBwYHBwgXDQUFCAkIDQkFCQYJBgYFBQUFBQUHBwcHBwAFAggKBwUDAgUODAsMCw\
sSEwkFCAgDBgYCBQAABgMGAAAFBQIEAAUCBIWAgIAAAXABFRUFg4CAgAABABEGiYCAgAABfwFBgIDA\
AAsHtoKAgAAOBm1lbW9yeQIABmRpZ2VzdAA3GF9fd2JnX2RpZ2VzdGNvbnRleHRfZnJlZQBSEWRpZ2\
VzdGNvbnRleHRfbmV3AEEUZGlnZXN0Y29udGV4dF91cGRhdGUAVhRkaWdlc3Rjb250ZXh0X2RpZ2Vz\
dAA+HGRpZ2VzdGNvbnRleHRfZGlnZXN0QW5kUmVzZXQAQBtkaWdlc3Rjb250ZXh0X2RpZ2VzdEFuZE\
Ryb3AAOxNkaWdlc3Rjb250ZXh0X3Jlc2V0ACITZGlnZXN0Y29udGV4dF9jbG9uZQAbH19fd2JpbmRn\
ZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIAbhFfX3diaW5kZ2VuX21hbGxvYwBXEl9fd2JpbmRnZW5fcm\
VhbGxvYwBkD19fd2JpbmRnZW5fZnJlZQBqCZqAgIAAAQBBAQsUZ2hvd21bPVxdWmViXl9gYXhDRHUK\
g8yIgABsoH4CEn8CfiMAQbAlayIEJAACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAk\
ACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgASgCAA4YAAECAwQcGxoZGBcWFRQTEhEQDw4N\
DAsKAAsgASgCBCEBQdABEBciBUUNBCAEQZASakE4aiABQThqKQMANwMAIARBkBJqQTBqIAFBMGopAw\
A3AwAgBEGQEmpBKGogAUEoaikDADcDACAEQZASakEgaiABQSBqKQMANwMAIARBkBJqQRhqIAFBGGop\
AwA3AwAgBEGQEmpBEGogAUEQaikDADcDACAEQZASakEIaiABQQhqKQMANwMAIAQgASkDADcDkBIgAS\
kDQCEWIARBkBJqQcgAaiABQcgAahBFIAQgFjcD0BIgBSAEQZASakHQARA6GkEAIQZBACEBDB8LIAEo\
AgQhAUHQARAXIgVFDQQgBEGQEmpBOGogAUE4aikDADcDACAEQZASakEwaiABQTBqKQMANwMAIARBkB\
JqQShqIAFBKGopAwA3AwAgBEGQEmpBIGogAUEgaikDADcDACAEQZASakEYaiABQRhqKQMANwMAIARB\
kBJqQRBqIAFBEGopAwA3AwAgBEGQEmpBCGogAUEIaikDADcDACAEIAEpAwA3A5ASIAEpA0AhFiAEQZ\
ASakHIAGogAUHIAGoQRSAEIBY3A9ASIAUgBEGQEmpB0AEQOhpBASEBDBsLIAEoAgQhAUHQARAXIgVF\
DQQgBEGQEmpBOGogAUE4aikDADcDACAEQZASakEwaiABQTBqKQMANwMAIARBkBJqQShqIAFBKGopAw\
A3AwAgBEGQEmpBIGogAUEgaikDADcDACAEQZASakEYaiABQRhqKQMANwMAIARBkBJqQRBqIAFBEGop\
AwA3AwAgBEGQEmpBCGogAUEIaikDADcDACAEIAEpAwA3A5ASIAEpA0AhFiAEQZASakHIAGogAUHIAG\
oQRSAEIBY3A9ASIAUgBEGQEmpB0AEQOhpBAiEBDBoLIAEoAgQhAUHwABAXIgVFDQQgBEGQEmpBIGog\
AUEgaikDADcDACAEQZASakEYaiABQRhqKQMANwMAIARBkBJqQRBqIAFBEGopAwA3AwAgBCABKQMINw\
OYEiABKQMAIRYgBEGQEmpBKGogAUEoahA5IAQgFjcDkBIgBSAEQZASakHwABA6GkEDIQEMGQsgASgC\
BCEBQfgOEBciBUUNBCAEQZASakGIAWogAUGIAWopAwA3AwAgBEGQEmpBgAFqIAFBgAFqKQMANwMAIA\
RBkBJqQfgAaiABQfgAaikDADcDACAEQZASakEQaiABQRBqKQMANwMAIARBkBJqQRhqIAFBGGopAwA3\
AwAgBEGQEmpBIGogAUEgaikDADcDACAEQZASakEwaiABQTBqKQMANwMAIARBkBJqQThqIAFBOGopAw\
A3AwAgBEGQEmpBwABqIAFBwABqKQMANwMAIARBkBJqQcgAaiABQcgAaikDADcDACAEQZASakHQAGog\
AUHQAGopAwA3AwAgBEGQEmpB2ABqIAFB2ABqKQMANwMAIARBkBJqQeAAaiABQeAAaikDADcDACAEIA\
EpA3A3A4ATIAQgASkDCDcDmBIgBCABKQMoNwO4EiABKQMAIRYgAS0AaiEHIAEtAGkhCCABLQBoIQkC\
QCABKAKQAUEFdCIKDQBBACEKDBsLIARBGGoiCyABQZQBaiIGQRhqKQAANwMAIARBEGoiDCAGQRBqKQ\
AANwMAIARBCGoiDSAGQQhqKQAANwMAIAQgBikAADcDACABQdQBaiEGQQAgCkFgakEFdmshDiAEQcQT\
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\
GkEGIQEMAgtB2AJBCEEAKAL41EAiBEEEIAQbEQUAAAsgASgCBCEBQeACEBciBUUNASAEQZASaiABQc\
gBEDoaIARBkBJqQcgBaiABQcgBahBKIAUgBEGQEmpB4AIQOhpBBSEBC0EAIQYMAgtB4AJBCEEAKAL4\
1EAiBEEEIAQbEQUAAAsgBCAKNgKgEyAEIAc6APoSIAQgCDoA+RIgBCAJOgD4EiAEIBY3A5ASIAUgBE\
GQEmpB+A4QOhpBBCEBQQEhBgsCQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJA\
AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCACDgIBABELQSAhAi\
ABDhgBDwIPEAMPBAUGBgcHCA8JCgsPDA0QEA4BCyABQQJ0QZTUwABqKAIAIQMMDwtBwAAhAgwNC0Ew\
IQIMDAtBHCECDAsLQTAhAgwKC0HAACECDAkLQRAhAgwIC0EUIQIMBwtBHCECDAYLQTAhAgwFC0HAAC\
ECDAQLQRwhAgwDC0EwIQIMAgtBwAAhAgwBC0EYIQILIAIgA0YNACAAQa2BwAA2AgQgAEEBNgIAIABB\
CGpBOTYCAAJAIAZFDQAgBSgCkAFFDQAgBUEANgKQAQsgBRAfDAELAkACQAJAAkACQAJAAkACQAJAAk\
ACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAQ4YAAECAwQFBgcICQoLDA0ODxAR\
EhMUFRYaAAsgBCAFQdABEDoiAUH4DmpBDGpCADcCACABQfgOakEUakIANwIAIAFB+A5qQRxqQgA3Ag\
AgAUH4DmpBJGpCADcCACABQfgOakEsakIANwIAIAFB+A5qQTRqQgA3AgAgAUH4DmpBPGpCADcCACAB\
QgA3AvwOIAFBwAA2AvgOIAFBkBJqIAFB+A5qQcQAEDoaIAFBuCJqQThqIgogAUGQEmpBPGopAgA3Aw\
AgAUG4ImpBMGoiAyABQZASakE0aikCADcDACABQbgiakEoaiIPIAFBkBJqQSxqKQIANwMAIAFBuCJq\
QSBqIgsgAUGQEmpBJGopAgA3AwAgAUG4ImpBGGoiDCABQZASakEcaikCADcDACABQbgiakEQaiINIA\
FBkBJqQRRqKQIANwMAIAFBuCJqQQhqIhAgAUGQEmpBDGopAgA3AwAgASABKQKUEjcDuCIgAUGQEmog\
AUHQARA6GiABIAEpA9ASIAFB2BNqLQAAIgatfDcD0BIgAUHYEmohAgJAIAZBgAFGDQAgAiAGakEAQY\
ABIAZrEDwaCyABQQA6ANgTIAFBkBJqIAJCfxASIAFB+A5qQQhqIgYgAUGQEmpBCGopAwA3AwAgAUH4\
DmpBEGoiAiABQZASakEQaikDADcDACABQfgOakEYaiIOIAFBkBJqQRhqKQMANwMAIAFB+A5qQSBqIg\
cgASkDsBI3AwAgAUH4DmpBKGoiCCABQZASakEoaikDADcDACABQfgOakEwaiIJIAFBkBJqQTBqKQMA\
NwMAIAFB+A5qQThqIhEgAUGQEmpBOGopAwA3AwAgASABKQOQEjcD+A4gECAGKQMANwMAIA0gAikDAD\
cDACAMIA4pAwA3AwAgCyAHKQMANwMAIA8gCCkDADcDACADIAkpAwA3AwAgCiARKQMANwMAIAEgASkD\
+A43A7giQcAAEBciBkUNHCAGIAEpA7giNwAAIAZBOGogAUG4ImpBOGopAwA3AAAgBkEwaiABQbgiak\
EwaikDADcAACAGQShqIAFBuCJqQShqKQMANwAAIAZBIGogAUG4ImpBIGopAwA3AAAgBkEYaiABQbgi\
akEYaikDADcAACAGQRBqIAFBuCJqQRBqKQMANwAAIAZBCGogAUG4ImpBCGopAwA3AABBwAAhAwwaCy\
AEIAVB0AEQOiIBQfgOakEcakIANwIAIAFB+A5qQRRqQgA3AgAgAUH4DmpBDGpCADcCACABQgA3AvwO\
IAFBIDYC+A4gAUGQEmpBGGoiCyABQfgOakEYaiICKQMANwMAIAFBkBJqQRBqIgwgAUH4DmpBEGoiCi\
kDADcDACABQZASakEIaiINIAFB+A5qQQhqIgMpAwA3AwAgAUGQEmpBIGogAUH4DmpBIGoiECgCADYC\
ACABIAEpA/gONwOQEiABQbgiakEQaiIOIAFBkBJqQRRqKQIANwMAIAFBuCJqQQhqIgcgAUGQEmpBDG\
opAgA3AwAgAUG4ImpBGGoiCCABQZASakEcaikCADcDACABIAEpApQSNwO4IiABQZASaiABQdABEDoa\
IAEgASkD0BIgAUHYE2otAAAiBq18NwPQEiABQdgSaiEPAkAgBkGAAUYNACAPIAZqQQBBgAEgBmsQPB\
oLIAFBADoA2BMgAUGQEmogD0J/EBIgAyANKQMANwMAIAogDCkDADcDACACIAspAwA3AwAgECABKQOw\
EjcDACABQfgOakEoaiABQZASakEoaikDADcDACABQfgOakEwaiABQZASakEwaikDADcDACABQfgOak\
E4aiABQZASakE4aikDADcDACABIAEpA5ASNwP4DiAHIAMpAwA3AwAgDiAKKQMANwMAIAggAikDADcD\
ACABIAEpA/gONwO4IkEgEBciBkUNHCAGIAEpA7giNwAAIAZBGGogAUG4ImpBGGopAwA3AAAgBkEQai\
ABQbgiakEQaikDADcAACAGQQhqIAFBuCJqQQhqKQMANwAAQSAhAwwZCyAEIAVB0AEQOiIBQfgOakEs\
akIANwIAIAFB+A5qQSRqQgA3AgAgAUH4DmpBHGpCADcCACABQfgOakEUakIANwIAIAFB+A5qQQxqQg\
A3AgAgAUIANwL8DiABQTA2AvgOIAFBkBJqQShqIg0gAUH4DmpBKGoiAikDADcDACABQZASakEgaiAB\
QfgOakEgaiIKKQMANwMAIAFBkBJqQRhqIhAgAUH4DmpBGGoiAykDADcDACABQZASakEQaiIOIAFB+A\
5qQRBqIg8pAwA3AwAgAUGQEmpBCGoiByABQfgOakEIaiILKQMANwMAIAFBkBJqQTBqIgggAUH4DmpB\
MGoiCSgCADYCACABIAEpA/gONwOQEiABQbgiakEgaiIRIAFBkBJqQSRqKQIANwMAIAFBuCJqQRhqIh\
IgAUGQEmpBHGopAgA3AwAgAUG4ImpBEGoiEyABQZASakEUaikCADcDACABQbgiakEIaiIUIAFBkBJq\
QQxqKQIANwMAIAFBuCJqQShqIhUgAUGQEmpBLGopAgA3AwAgASABKQKUEjcDuCIgAUGQEmogAUHQAR\
A6GiABIAEpA9ASIAFB2BNqLQAAIgatfDcD0BIgAUHYEmohDAJAIAZBgAFGDQAgDCAGakEAQYABIAZr\
EDwaCyABQQA6ANgTIAFBkBJqIAxCfxASIAsgBykDADcDACAPIA4pAwA3AwAgAyAQKQMANwMAIAogAS\
kDsBI3AwAgAiANKQMANwMAIAkgCCkDADcDACABQfgOakE4aiABQZASakE4aikDADcDACABIAEpA5AS\
NwP4DiAUIAspAwA3AwAgEyAPKQMANwMAIBIgAykDADcDACARIAopAwA3AwAgFSACKQMANwMAIAEgAS\
kD+A43A7giQTAQFyIGRQ0cIAYgASkDuCI3AAAgBkEoaiABQbgiakEoaikDADcAACAGQSBqIAFBuCJq\
QSBqKQMANwAAIAZBGGogAUG4ImpBGGopAwA3AAAgBkEQaiABQbgiakEQaikDADcAACAGQQhqIAFBuC\
JqQQhqKQMANwAAQTAhAwwYCyAEIAVB8AAQOiIBQfgOakEcakIANwIAIAFB+A5qQRRqQgA3AgAgAUH4\
DmpBDGpCADcCACABQgA3AvwOIAFBIDYC+A4gAUGQEmpBGGoiCiABQfgOakEYaikDADcDACABQZASak\
EQaiIDIAFB+A5qQRBqKQMANwMAIAFBkBJqQQhqIAFB+A5qQQhqIg8pAwA3AwAgAUGQEmpBIGoiCyAB\
QfgOakEgaigCADYCACABIAEpA/gONwOQEiABQegjakEQaiIMIAFBkBJqQRRqKQIANwMAIAFB6CNqQQ\
hqIg0gAUGQEmpBDGopAgA3AwAgAUHoI2pBGGoiECABQZASakEcaikCADcDACABIAEpApQSNwPoIyAB\
QZASaiABQfAAEDoaIAEgASkDkBIgAUH4EmotAAAiBq18NwOQEiABQbgSaiECAkAgBkHAAEYNACACIA\
ZqQQBBwAAgBmsQPBoLIAFBADoA+BIgAUGQEmogAkF/EBQgDyADKQMAIhY3AwAgDSAWNwMAIAwgCikD\
ADcDACAQIAspAwA3AwAgASABKQOYEiIWNwP4DiABIBY3A+gjQSAQFyIGRQ0cIAYgASkD6CM3AAAgBk\
EYaiABQegjakEYaikDADcAACAGQRBqIAFB6CNqQRBqKQMANwAAIAZBCGogAUHoI2pBCGopAwA3AABB\
ICEDDBcLIAQgBUH4DhA6IQEgA0EASA0SAkACQCADDQBBASEGDAELIAMQFyIGRQ0dIAZBfGotAABBA3\
FFDQAgBkEAIAMQPBoLIAFBkBJqIAFB+A4QOhogAUH4DmogAUGQEmoQJCABQfgOaiAGIAMQGQwWCyAE\
IAVB4AIQOiIKQZASaiAKQeACEDoaIApBkBJqIApB6BRqLQAAIgFqQcgBaiECAkAgAUGQAUYNACACQQ\
BBkAEgAWsQPBoLQQAhBiAKQQA6AOgUIAJBAToAACAKQecUaiIBIAEtAABBgAFyOgAAA0AgCkGQEmog\
BmoiASABLQAAIAFByAFqLQAAczoAACABQQFqIgIgAi0AACABQckBai0AAHM6AAAgAUECaiICIAItAA\
AgAUHKAWotAABzOgAAIAFBA2oiAiACLQAAIAFBywFqLQAAczoAACAGQQRqIgZBkAFHDQALIApBkBJq\
ECUgCkH4DmpBGGoiASAKQZASakEYaigCADYCACAKQfgOakEQaiICIApBkBJqQRBqKQMANwMAIApB+A\
5qQQhqIg8gCkGQEmpBCGopAwA3AwAgCiAKKQOQEjcD+A5BHCEDQRwQFyIGRQ0cIAYgCikD+A43AAAg\
BkEYaiABKAIANgAAIAZBEGogAikDADcAACAGQQhqIA8pAwA3AAAMFQsgBCAFQdgCEDoiCkGQEmogCk\
HYAhA6GiAKQZASaiAKQeAUai0AACIBakHIAWohAgJAIAFBiAFGDQAgAkEAQYgBIAFrEDwaC0EAIQYg\
CkEAOgDgFCACQQE6AAAgCkHfFGoiASABLQAAQYABcjoAAANAIApBkBJqIAZqIgEgAS0AACABQcgBai\
0AAHM6AAAgAUEBaiICIAItAAAgAUHJAWotAABzOgAAIAFBAmoiAiACLQAAIAFBygFqLQAAczoAACAB\
QQNqIgIgAi0AACABQcsBai0AAHM6AAAgBkEEaiIGQYgBRw0ACyAKQZASahAlIApB+A5qQRhqIgEgCk\
GQEmpBGGopAwA3AwAgCkH4DmpBEGoiAiAKQZASakEQaikDADcDACAKQfgOakEIaiIPIApBkBJqQQhq\
KQMANwMAIAogCikDkBI3A/gOQSAhA0EgEBciBkUNHCAGIAopA/gONwAAIAZBGGogASkDADcAACAGQR\
BqIAIpAwA3AAAgBkEIaiAPKQMANwAADBQLIAQgBUG4AhA6IgpBkBJqIApBuAIQOhogCkGQEmogCkHA\
FGotAAAiAWpByAFqIQICQCABQegARg0AIAJBAEHoACABaxA8GgtBACEGIApBADoAwBQgAkEBOgAAIA\
pBvxRqIgEgAS0AAEGAAXI6AAADQCAKQZASaiAGaiIBIAEtAAAgAUHIAWotAABzOgAAIAFBAWoiAiAC\
LQAAIAFByQFqLQAAczoAACABQQJqIgIgAi0AACABQcoBai0AAHM6AAAgAUEDaiICIAItAAAgAUHLAW\
otAABzOgAAIAZBBGoiBkHoAEcNAAsgCkGQEmoQJSAKQfgOakEoaiIBIApBkBJqQShqKQMANwMAIApB\
+A5qQSBqIgIgCkGQEmpBIGopAwA3AwAgCkH4DmpBGGoiDyAKQZASakEYaikDADcDACAKQfgOakEQai\
ILIApBkBJqQRBqKQMANwMAIApB+A5qQQhqIgwgCkGQEmpBCGopAwA3AwAgCiAKKQOQEjcD+A5BMCED\
QTAQFyIGRQ0cIAYgCikD+A43AAAgBkEoaiABKQMANwAAIAZBIGogAikDADcAACAGQRhqIA8pAwA3AA\
AgBkEQaiALKQMANwAAIAZBCGogDCkDADcAAAwTCyAEIAVBmAIQOiIKQZASaiAKQZgCEDoaIApBkBJq\
IApBoBRqLQAAIgFqQcgBaiECAkAgAUHIAEYNACACQQBByAAgAWsQPBoLQQAhBiAKQQA6AKAUIAJBAT\
oAACAKQZ8UaiIBIAEtAABBgAFyOgAAA0AgCkGQEmogBmoiASABLQAAIAFByAFqLQAAczoAACABQQFq\
IgIgAi0AACABQckBai0AAHM6AAAgAUECaiICIAItAAAgAUHKAWotAABzOgAAIAFBA2oiAiACLQAAIA\
FBywFqLQAAczoAACAGQQRqIgZByABHDQALIApBkBJqECUgCkH4DmpBOGoiASAKQZASakE4aikDADcD\
ACAKQfgOakEwaiICIApBkBJqQTBqKQMANwMAIApB+A5qQShqIg8gCkGQEmpBKGopAwA3AwAgCkH4Dm\
pBIGoiCyAKQZASakEgaikDADcDACAKQfgOakEYaiIMIApBkBJqQRhqKQMANwMAIApB+A5qQRBqIg0g\
CkGQEmpBEGopAwA3AwAgCkH4DmpBCGoiECAKQZASakEIaikDADcDACAKIAopA5ASNwP4DkHAACEDQc\
AAEBciBkUNHCAGIAopA/gONwAAIAZBOGogASkDADcAACAGQTBqIAIpAwA3AAAgBkEoaiAPKQMANwAA\
IAZBIGogCykDADcAACAGQRhqIAwpAwA3AAAgBkEQaiANKQMANwAAIAZBCGogECkDADcAAAwSCyAEIA\
VB4AAQOiIBQfgOakEMakIANwIAIAFCADcC/A5BECEDIAFBEDYC+A4gAUGQEmpBEGogAUH4DmpBEGoo\
AgA2AgAgAUGQEmpBCGogAUH4DmpBCGopAwA3AwAgAUHoI2pBCGoiAiABQZASakEMaikCADcDACABIA\
EpA/gONwOQEiABIAEpApQSNwPoIyABQZASaiABQeAAEDoaIAFBkBJqIAFBqBJqIAFB6CNqEDBBEBAX\
IgZFDRwgBiABKQPoIzcAACAGQQhqIAIpAwA3AAAMEQsgBCAFQeAAEDoiAUH4DmpBDGpCADcCACABQg\
A3AvwOQRAhAyABQRA2AvgOIAFBkBJqQRBqIAFB+A5qQRBqKAIANgIAIAFBkBJqQQhqIAFB+A5qQQhq\
KQMANwMAIAFB6CNqQQhqIgIgAUGQEmpBDGopAgA3AwAgASABKQP4DjcDkBIgASABKQKUEjcD6CMgAU\
GQEmogAUHgABA6GiABQZASaiABQagSaiABQegjahAvQRAQFyIGRQ0cIAYgASkD6CM3AAAgBkEIaiAC\
KQMANwAADBALQRQhAyAEIAVB6AAQOiIBQfgOakEUakEANgIAIAFB+A5qQQxqQgA3AgAgAUEANgL4Di\
ABQgA3AvwOIAFBFDYC+A4gAUGQEmpBEGogAUH4DmpBEGopAwA3AwAgAUGQEmpBCGogAUH4DmpBCGop\
AwA3AwAgAUHoI2pBCGoiAiABQZASakEMaikCADcDACABQegjakEQaiIKIAFBkBJqQRRqKAIANgIAIA\
EgASkD+A43A5ASIAEgASkClBI3A+gjIAFBkBJqIAFB6AAQOhogAUGQEmogAUGwEmogAUHoI2oQLkEU\
EBciBkUNHCAGIAEpA+gjNwAAIAZBEGogCigCADYAACAGQQhqIAIpAwA3AAAMDwtBFCEDIAQgBUHoAB\
A6IgFB+A5qQRRqQQA2AgAgAUH4DmpBDGpCADcCACABQQA2AvgOIAFCADcC/A4gAUEUNgL4DiABQZAS\
akEQaiABQfgOakEQaikDADcDACABQZASakEIaiABQfgOakEIaikDADcDACABQegjakEIaiICIAFBkB\
JqQQxqKQIANwMAIAFB6CNqQRBqIgogAUGQEmpBFGooAgA2AgAgASABKQP4DjcDkBIgASABKQKUEjcD\
6CMgAUGQEmogAUHoABA6GiABQZASaiABQbASaiABQegjahApQRQQFyIGRQ0cIAYgASkD6CM3AAAgBk\
EQaiAKKAIANgAAIAZBCGogAikDADcAAAwOCyAEIAVB4AIQOiIKQZASaiAKQeACEDoaIApBkBJqIApB\
6BRqLQAAIgFqQcgBaiECAkAgAUGQAUYNACACQQBBkAEgAWsQPBoLQQAhBiAKQQA6AOgUIAJBBjoAAC\
AKQecUaiIBIAEtAABBgAFyOgAAA0AgCkGQEmogBmoiASABLQAAIAFByAFqLQAAczoAACABQQFqIgIg\
Ai0AACABQckBai0AAHM6AAAgAUECaiICIAItAAAgAUHKAWotAABzOgAAIAFBA2oiAiACLQAAIAFByw\
FqLQAAczoAACAGQQRqIgZBkAFHDQALIApBkBJqECUgCkH4DmpBGGoiASAKQZASakEYaigCADYCACAK\
QfgOakEQaiICIApBkBJqQRBqKQMANwMAIApB+A5qQQhqIg8gCkGQEmpBCGopAwA3AwAgCiAKKQOQEj\
cD+A5BHCEDQRwQFyIGRQ0cIAYgCikD+A43AAAgBkEYaiABKAIANgAAIAZBEGogAikDADcAACAGQQhq\
IA8pAwA3AAAMDQsgBCAFQdgCEDoiCkGQEmogCkHYAhA6GiAKQZASaiAKQeAUai0AACIBakHIAWohAg\
JAIAFBiAFGDQAgAkEAQYgBIAFrEDwaC0EAIQYgCkEAOgDgFCACQQY6AAAgCkHfFGoiASABLQAAQYAB\
cjoAAANAIApBkBJqIAZqIgEgAS0AACABQcgBai0AAHM6AAAgAUEBaiICIAItAAAgAUHJAWotAABzOg\
AAIAFBAmoiAiACLQAAIAFBygFqLQAAczoAACABQQNqIgIgAi0AACABQcsBai0AAHM6AAAgBkEEaiIG\
QYgBRw0ACyAKQZASahAlIApB+A5qQRhqIgEgCkGQEmpBGGopAwA3AwAgCkH4DmpBEGoiAiAKQZASak\
EQaikDADcDACAKQfgOakEIaiIPIApBkBJqQQhqKQMANwMAIAogCikDkBI3A/gOQSAhA0EgEBciBkUN\
HCAGIAopA/gONwAAIAZBGGogASkDADcAACAGQRBqIAIpAwA3AAAgBkEIaiAPKQMANwAADAwLIAQgBU\
G4AhA6IgpBkBJqIApBuAIQOhogCkGQEmogCkHAFGotAAAiAWpByAFqIQICQCABQegARg0AIAJBAEHo\
ACABaxA8GgtBACEGIApBADoAwBQgAkEGOgAAIApBvxRqIgEgAS0AAEGAAXI6AAADQCAKQZASaiAGai\
IBIAEtAAAgAUHIAWotAABzOgAAIAFBAWoiAiACLQAAIAFByQFqLQAAczoAACABQQJqIgIgAi0AACAB\
QcoBai0AAHM6AAAgAUEDaiICIAItAAAgAUHLAWotAABzOgAAIAZBBGoiBkHoAEcNAAsgCkGQEmoQJS\
AKQfgOakEoaiIBIApBkBJqQShqKQMANwMAIApB+A5qQSBqIgIgCkGQEmpBIGopAwA3AwAgCkH4DmpB\
GGoiDyAKQZASakEYaikDADcDACAKQfgOakEQaiILIApBkBJqQRBqKQMANwMAIApB+A5qQQhqIgwgCk\
GQEmpBCGopAwA3AwAgCiAKKQOQEjcD+A5BMCEDQTAQFyIGRQ0cIAYgCikD+A43AAAgBkEoaiABKQMA\
NwAAIAZBIGogAikDADcAACAGQRhqIA8pAwA3AAAgBkEQaiALKQMANwAAIAZBCGogDCkDADcAAAwLCy\
AEIAVBmAIQOiIKQZASaiAKQZgCEDoaIApBkBJqIApBoBRqLQAAIgFqQcgBaiECAkAgAUHIAEYNACAC\
QQBByAAgAWsQPBoLQQAhBiAKQQA6AKAUIAJBBjoAACAKQZ8UaiIBIAEtAABBgAFyOgAAA0AgCkGQEm\
ogBmoiASABLQAAIAFByAFqLQAAczoAACABQQFqIgIgAi0AACABQckBai0AAHM6AAAgAUECaiICIAIt\
AAAgAUHKAWotAABzOgAAIAFBA2oiAiACLQAAIAFBywFqLQAAczoAACAGQQRqIgZByABHDQALIApBkB\
JqECUgCkH4DmpBOGoiASAKQZASakE4aikDADcDACAKQfgOakEwaiICIApBkBJqQTBqKQMANwMAIApB\
+A5qQShqIg8gCkGQEmpBKGopAwA3AwAgCkH4DmpBIGoiCyAKQZASakEgaikDADcDACAKQfgOakEYai\
IMIApBkBJqQRhqKQMANwMAIApB+A5qQRBqIg0gCkGQEmpBEGopAwA3AwAgCkH4DmpBCGoiECAKQZAS\
akEIaikDADcDACAKIAopA5ASNwP4DkHAACEDQcAAEBciBkUNHCAGIAopA/gONwAAIAZBOGogASkDAD\
cAACAGQTBqIAIpAwA3AAAgBkEoaiAPKQMANwAAIAZBIGogCykDADcAACAGQRhqIAwpAwA3AAAgBkEQ\
aiANKQMANwAAIAZBCGogECkDADcAAAwKCyAEIAVB8AAQOiIBQZASaiABQfAAEDoaQRwhAyABQegjak\
EcakIANwIAIAFB6CNqQRRqQgA3AgAgAUHoI2pBDGpCADcCACABQgA3AuwjIAFBIDYC6CMgAUH4DmpB\
GGoiAiABQegjakEYaikDADcDACABQfgOakEQaiIKIAFB6CNqQRBqKQMANwMAIAFB+A5qQQhqIg8gAU\
HoI2pBCGopAwA3AwAgAUH4DmpBIGogAUHoI2pBIGooAgA2AgAgASABKQPoIzcD+A4gAUG4ImpBEGoi\
BiABQfgOakEUaikCADcDACABQbgiakEIaiILIAFB+A5qQQxqKQIANwMAIAFBuCJqQRhqIgwgAUH4Dm\
pBHGopAgA3AwAgASABKQL8DjcDuCIgAUGQEmogAUG4EmogAUG4ImoQKCACIAwoAgA2AgAgCiAGKQMA\
NwMAIA8gCykDADcDACABIAEpA7giNwP4DkEcEBciBkUNHCAGIAEpA/gONwAAIAZBGGogAigCADYAAC\
AGQRBqIAopAwA3AAAgBkEIaiAPKQMANwAADAkLIAQgBUHwABA6IgFBkBJqIAFB8AAQOhogAUHoI2pB\
HGpCADcCACABQegjakEUakIANwIAIAFB6CNqQQxqQgA3AgAgAUIANwLsI0EgIQMgAUEgNgLoIyABQf\
gOakEgaiABQegjakEgaigCADYCACABQfgOakEYaiICIAFB6CNqQRhqKQMANwMAIAFB+A5qQRBqIgog\
AUHoI2pBEGopAwA3AwAgAUH4DmpBCGoiDyABQegjakEIaikDADcDACABIAEpA+gjNwP4DiABQbgiak\
EYaiIGIAFB+A5qQRxqKQIANwMAIAFBuCJqQRBqIgsgAUH4DmpBFGopAgA3AwAgAUG4ImpBCGoiDCAB\
QfgOakEMaikCADcDACABIAEpAvwONwO4IiABQZASaiABQbgSaiABQbgiahAoIAIgBikDADcDACAKIA\
spAwA3AwAgDyAMKQMANwMAIAEgASkDuCI3A/gOQSAQFyIGRQ0cIAYgASkD+A43AAAgBkEYaiACKQMA\
NwAAIAZBEGogCikDADcAACAGQQhqIA8pAwA3AAAMCAsgBCAFQdgBEDoiAUGQEmogAUHYARA6GiABQe\
gjakEMakIANwIAIAFB6CNqQRRqQgA3AgAgAUHoI2pBHGpCADcCACABQegjakEkakIANwIAIAFB6CNq\
QSxqQgA3AgAgAUHoI2pBNGpCADcCACABQegjakE8akIANwIAIAFCADcC7CMgAUHAADYC6CMgAUH4Dm\
ogAUHoI2pBxAAQOhogAUHwImogAUH4DmpBPGopAgA3AwBBMCEDIAFBuCJqQTBqIAFB+A5qQTRqKQIA\
NwMAIAFBuCJqQShqIgYgAUH4DmpBLGopAgA3AwAgAUG4ImpBIGoiAiABQfgOakEkaikCADcDACABQb\
giakEYaiIKIAFB+A5qQRxqKQIANwMAIAFBuCJqQRBqIg8gAUH4DmpBFGopAgA3AwAgAUG4ImpBCGoi\
CyABQfgOakEMaikCADcDACABIAEpAvwONwO4IiABQZASaiABQeASaiABQbgiahAjIAFB+A5qQShqIg\
wgBikDADcDACABQfgOakEgaiINIAIpAwA3AwAgAUH4DmpBGGoiAiAKKQMANwMAIAFB+A5qQRBqIgog\
DykDADcDACABQfgOakEIaiIPIAspAwA3AwAgASABKQO4IjcD+A5BMBAXIgZFDRwgBiABKQP4DjcAAC\
AGQShqIAwpAwA3AAAgBkEgaiANKQMANwAAIAZBGGogAikDADcAACAGQRBqIAopAwA3AAAgBkEIaiAP\
KQMANwAADAcLIAQgBUHYARA6IgFBkBJqIAFB2AEQOhogAUHoI2pBDGpCADcCACABQegjakEUakIANw\
IAIAFB6CNqQRxqQgA3AgAgAUHoI2pBJGpCADcCACABQegjakEsakIANwIAIAFB6CNqQTRqQgA3AgAg\
AUHoI2pBPGpCADcCACABQgA3AuwjQcAAIQMgAUHAADYC6CMgAUH4DmogAUHoI2pBxAAQOhogAUG4Im\
pBOGoiBiABQfgOakE8aikCADcDACABQbgiakEwaiICIAFB+A5qQTRqKQIANwMAIAFBuCJqQShqIgog\
AUH4DmpBLGopAgA3AwAgAUG4ImpBIGoiDyABQfgOakEkaikCADcDACABQbgiakEYaiILIAFB+A5qQR\
xqKQIANwMAIAFBuCJqQRBqIgwgAUH4DmpBFGopAgA3AwAgAUG4ImpBCGoiDSABQfgOakEMaikCADcD\
ACABIAEpAvwONwO4IiABQZASaiABQeASaiABQbgiahAjIAFB+A5qQThqIhAgBikDADcDACABQfgOak\
EwaiIOIAIpAwA3AwAgAUH4DmpBKGoiAiAKKQMANwMAIAFB+A5qQSBqIgogDykDADcDACABQfgOakEY\
aiIPIAspAwA3AwAgAUH4DmpBEGoiCyAMKQMANwMAIAFB+A5qQQhqIgwgDSkDADcDACABIAEpA7giNw\
P4DkHAABAXIgZFDRwgBiABKQP4DjcAACAGQThqIBApAwA3AAAgBkEwaiAOKQMANwAAIAZBKGogAikD\
ADcAACAGQSBqIAopAwA3AAAgBkEYaiAPKQMANwAAIAZBEGogCykDADcAACAGQQhqIAwpAwA3AAAMBg\
sgBEH4DmogBUH4AhA6GiADQQBIDQECQAJAIAMNAEEBIQYMAQsgAxAXIgZFDR0gBkF8ai0AAEEDcUUN\
ACAGQQAgAxA8GgsgBEGQEmogBEH4DmpB+AIQOhogBCAEQfgOakHIARA6Ig9ByAFqIA9BkBJqQcgBak\
GpARA6IQEgD0HoI2ogD0H4DmpByAEQOhogD0GIIWogAUGpARA6GiAPQYghaiAPLQCwIiIBaiEKAkAg\
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\
IQggDCAFfCEFIB8gBHwhBCABQYABaiIBIAJHDQALCyAAIAQ3AzggACAFNwMwIAAgBjcDKCAAIAc3Ay\
AgACAINwMYIAAgCTcDECAAIAo3AwggACALNwMAIANBgAFqJAAL+FsCDH8FfiMAQYAGayIEJAACQAJA\
AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAIOAgABAgsgASgCACICQQJ0QbTTwA\
BqKAIAIQMMEQtBICEFIAEoAgAiAg4YAQ8CDxADDwQFBgYHBwgPCQoLDwwNEBAOAQsgASgCACECDA8L\
QcAAIQUMDQtBMCEFDAwLQRwhBQwLC0EwIQUMCgtBwAAhBQwJC0EQIQUMCAtBFCEFDAcLQRwhBQwGC0\
EwIQUMBQtBwAAhBQwEC0EcIQUMAwtBMCEFDAILQcAAIQUMAQtBGCEFCyAFIANGDQBBASEBQTkhA0Gt\
gcAAIQIMAQsCQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQA\
JAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAg4YAAEC\
AwQFBgcICQoLDA0ODxAREhMUFRYaAAsgASgCBCECIARB0ARqQQxqQgA3AgAgBEHQBGpBFGpCADcCAC\
AEQdAEakEcakIANwIAIARB0ARqQSRqQgA3AgAgBEHQBGpBLGpCADcCACAEQdAEakE0akIANwIAIARB\
0ARqQTxqQgA3AgAgBEIANwLUBCAEQcAANgLQBCAEQShqIARB0ARqQcQAEDoaIARBoANqQThqIgYgBE\
EoakE8aikCADcDACAEQaADakEwaiIHIARBKGpBNGopAgA3AwAgBEGgA2pBKGoiCCAEQShqQSxqKQIA\
NwMAIARBoANqQSBqIgkgBEEoakEkaikCADcDACAEQaADakEYaiIKIARBKGpBHGopAgA3AwAgBEGgA2\
pBEGoiCyAEQShqQRRqKQIANwMAIARBoANqQQhqIgwgBEEoakEMaikCADcDACAEIAQpAiw3A6ADIAIg\
AikDQCACQcgBaiIDLQAAIgGtfDcDQCACQcgAaiEFAkAgAUGAAUYNACAFIAFqQQBBgAEgAWsQPBoLQQ\
AhASADQQA6AAAgAiAFQn8QEiAEQShqQQhqIgUgAkEIaikDACIQNwMAIARBKGpBEGogAkEQaikDACIR\
NwMAIARBKGpBGGogAkEYaikDACISNwMAIARBKGpBIGogAikDICITNwMAIARBKGpBKGogAkEoaikDAC\
IUNwMAIAwgEDcDACALIBE3AwAgCiASNwMAIAkgEzcDACAIIBQ3AwAgByACQTBqKQMANwMAIAYgAkE4\
aikDADcDACAEIAIpAwAiEDcDKCAEIBA3A6ADIAVBwAAQUSACIAVByAAQOhogA0EAOgAAQcAAEBciAk\
UNGiACIAQpA6ADNwAAIAJBOGogBEGgA2pBOGopAwA3AAAgAkEwaiAEQaADakEwaikDADcAACACQShq\
IARBoANqQShqKQMANwAAIAJBIGogBEGgA2pBIGopAwA3AAAgAkEYaiAEQaADakEYaikDADcAACACQR\
BqIARBoANqQRBqKQMANwAAIAJBCGogBEGgA2pBCGopAwA3AABBwAAhAwwyCyABKAIEIQIgBEHQBGpB\
HGpCADcCACAEQdAEakEUakIANwIAIARB0ARqQQxqQgA3AgAgBEIANwLUBCAEQSA2AtAEIARBKGpBGG\
oiByAEQdAEakEYaikDADcDACAEQShqQRBqIgggBEHQBGpBEGopAwA3AwAgBEEoakEIaiIDIARB0ARq\
QQhqKQMANwMAIARBKGpBIGoiCSAEQdAEakEgaigCADYCACAEIAQpA9AENwMoIARBoANqQRBqIgogBE\
EoakEUaikCADcDACAEQaADakEIaiILIARBKGpBDGopAgA3AwAgBEGgA2pBGGoiDCAEQShqQRxqKQIA\
NwMAIAQgBCkCLDcDoAMgAiACKQNAIAJByAFqIgUtAAAiAa18NwNAIAJByABqIQYCQCABQYABRg0AIA\
YgAWpBAEGAASABaxA8GgtBACEBIAVBADoAACACIAZCfxASIAMgAkEIaikDACIQNwMAIAggAkEQaikD\
ACIRNwMAIAcgAkEYaikDACISNwMAIAkgAikDIDcDACAEQShqQShqIAJBKGopAwA3AwAgCyAQNwMAIA\
ogETcDACAMIBI3AwAgBCACKQMAIhA3AyggBCAQNwOgAyADQSAQUSACIANByAAQOhogBUEAOgAAQSAQ\
FyICRQ0aIAIgBCkDoAM3AAAgAkEYaiAEQaADakEYaikDADcAACACQRBqIARBoANqQRBqKQMANwAAIA\
JBCGogBEGgA2pBCGopAwA3AABBICEDDDELIAEoAgQhAiAEQdAEakEsakIANwIAIARB0ARqQSRqQgA3\
AgAgBEHQBGpBHGpCADcCACAEQdAEakEUakIANwIAIARB0ARqQQxqQgA3AgAgBEIANwLUBCAEQTA2At\
AEIARBKGpBKGoiByAEQdAEakEoaikDADcDACAEQShqQSBqIgggBEHQBGpBIGopAwA3AwAgBEEoakEY\
aiIJIARB0ARqQRhqKQMANwMAIARBKGpBEGoiCiAEQdAEakEQaikDADcDACAEQShqQQhqIgMgBEHQBG\
pBCGopAwA3AwAgBEEoakEwaiAEQdAEakEwaigCADYCACAEIAQpA9AENwMoIARBoANqQSBqIgsgBEEo\
akEkaikCADcDACAEQaADakEYaiIMIARBKGpBHGopAgA3AwAgBEGgA2pBEGoiDSAEQShqQRRqKQIANw\
MAIARBoANqQQhqIg4gBEEoakEMaikCADcDACAEQaADakEoaiIPIARBKGpBLGopAgA3AwAgBCAEKQIs\
NwOgAyACIAIpA0AgAkHIAWoiBS0AACIBrXw3A0AgAkHIAGohBgJAIAFBgAFGDQAgBiABakEAQYABIA\
FrEDwaC0EAIQEgBUEAOgAAIAIgBkJ/EBIgAyACQQhqKQMAIhA3AwAgCiACQRBqKQMAIhE3AwAgCSAC\
QRhqKQMAIhI3AwAgCCACKQMgIhM3AwAgByACQShqKQMAIhQ3AwAgDiAQNwMAIA0gETcDACAMIBI3Aw\
AgCyATNwMAIA8gFDcDACAEIAIpAwAiEDcDKCAEIBA3A6ADIANBMBBRIAIgA0HIABA6GiAFQQA6AABB\
MBAXIgJFDRogAiAEKQOgAzcAACACQShqIARBoANqQShqKQMANwAAIAJBIGogBEGgA2pBIGopAwA3AA\
AgAkEYaiAEQaADakEYaikDADcAACACQRBqIARBoANqQRBqKQMANwAAIAJBCGogBEGgA2pBCGopAwA3\
AABBMCEDDDALIAEoAgQhAiAEQdAEakEcakIANwIAIARB0ARqQRRqQgA3AgAgBEHQBGpBDGpCADcCAC\
AEQgA3AtQEIARBIDYC0AQgBEEoakEYaiIHIARB0ARqQRhqKQMANwMAIARBKGpBEGoiCCAEQdAEakEQ\
aikDADcDACAEQShqQQhqIgMgBEHQBGpBCGopAwA3AwAgBEEoakEgaiIJIARB0ARqQSBqKAIANgIAIA\
QgBCkD0AQ3AyggBEGgA2pBEGoiCiAEQShqQRRqKQIANwMAIARBoANqQQhqIgsgBEEoakEMaikCADcD\
ACAEQaADakEYaiIMIARBKGpBHGopAgA3AwAgBCAEKQIsNwOgAyACIAIpAwAgAkHoAGoiBS0AACIBrX\
w3AwAgAkEoaiEGAkAgAUHAAEYNACAGIAFqQQBBwAAgAWsQPBoLQQAhASAFQQA6AAAgAiAGQX8QFCAD\
IAJBEGoiBikCACIQNwMAIAsgEDcDACAKIAJBGGoiCykCADcDACAMIAJBIGoiCikCADcDACAEIAJBCG\
oiDCkCACIQNwMoIAQgEDcDoAMgAxBYIAogBEEoakEoaikDADcDACALIAkpAwA3AwAgBiAHKQMANwMA\
IAwgCCkDADcDACACIAQpAzA3AwAgBUEAOgAAQSAQFyICRQ0aIAIgBCkDoAM3AAAgAkEYaiAEQaADak\
EYaikDADcAACACQRBqIARBoANqQRBqKQMANwAAIAJBCGogBEGgA2pBCGopAwA3AABBICEDDC8LIANB\
AEgNEiABKAIEIQUCQAJAIAMNAEEBIQIMAQsgAxAXIgJFDRsgAkF8ai0AAEEDcUUNACACQQAgAxA8Gg\
sgBEEoaiAFECQgBUIANwMAIAVBIGogBUGIAWopAwA3AwAgBUEYaiAFQYABaikDADcDACAFQRBqIAVB\
+ABqKQMANwMAIAUgBSkDcDcDCEEAIQEgBUEoakEAQcIAEDwaAkAgBSgCkAFFDQAgBUEANgKQAQsgBE\
EoaiACIAMQGQwuCyABKAIEIgUgBUHYAmoiBi0AACIBakHIAWohAwJAIAFBkAFGDQAgA0EAQZABIAFr\
EDwaC0EAIQIgBkEAOgAAIANBAToAACAFQdcCaiIBIAEtAABBgAFyOgAAA0AgBSACaiIBIAEtAAAgAU\
HIAWotAABzOgAAIAFBAWoiAyADLQAAIAFByQFqLQAAczoAACABQQJqIgMgAy0AACABQcoBai0AAHM6\
AAAgAUEDaiIDIAMtAAAgAUHLAWotAABzOgAAIAJBBGoiAkGQAUcNAAsgBRAlIARBKGpBGGoiBiAFQR\
hqKAAANgIAIARBKGpBEGoiByAFQRBqKQAANwMAIARBKGpBCGoiCCAFQQhqKQAANwMAIAQgBSkAADcD\
KEEAIQEgBUEAQcgBEDxB2AJqQQA6AABBHCEDQRwQFyICRQ0aIAIgBCkDKDcAACACQRhqIAYoAgA2AA\
AgAkEQaiAHKQMANwAAIAJBCGogCCkDADcAAAwtCyABKAIEIgUgBUHQAmoiBi0AACIBakHIAWohAwJA\
IAFBiAFGDQAgA0EAQYgBIAFrEDwaC0EAIQIgBkEAOgAAIANBAToAACAFQc8CaiIBIAEtAABBgAFyOg\
AAA0AgBSACaiIBIAEtAAAgAUHIAWotAABzOgAAIAFBAWoiAyADLQAAIAFByQFqLQAAczoAACABQQJq\
IgMgAy0AACABQcoBai0AAHM6AAAgAUEDaiIDIAMtAAAgAUHLAWotAABzOgAAIAJBBGoiAkGIAUcNAA\
sgBRAlIARBKGpBGGoiBiAFQRhqKQAANwMAIARBKGpBEGoiByAFQRBqKQAANwMAIARBKGpBCGoiCCAF\
QQhqKQAANwMAIAQgBSkAADcDKEEAIQEgBUEAQcgBEDxB0AJqQQA6AABBICEDQSAQFyICRQ0aIAIgBC\
kDKDcAACACQRhqIAYpAwA3AAAgAkEQaiAHKQMANwAAIAJBCGogCCkDADcAAAwsCyABKAIEIgUgBUGw\
AmoiBi0AACIBakHIAWohAwJAIAFB6ABGDQAgA0EAQegAIAFrEDwaC0EAIQIgBkEAOgAAIANBAToAAC\
AFQa8CaiIBIAEtAABBgAFyOgAAA0AgBSACaiIBIAEtAAAgAUHIAWotAABzOgAAIAFBAWoiAyADLQAA\
IAFByQFqLQAAczoAACABQQJqIgMgAy0AACABQcoBai0AAHM6AAAgAUEDaiIDIAMtAAAgAUHLAWotAA\
BzOgAAIAJBBGoiAkHoAEcNAAsgBRAlIARBKGpBKGoiBiAFQShqKQAANwMAIARBKGpBIGoiByAFQSBq\
KQAANwMAIARBKGpBGGoiCCAFQRhqKQAANwMAIARBKGpBEGoiCSAFQRBqKQAANwMAIARBKGpBCGoiCi\
AFQQhqKQAANwMAIAQgBSkAADcDKEEAIQEgBUEAQcgBEDxBsAJqQQA6AABBMCEDQTAQFyICRQ0aIAIg\
BCkDKDcAACACQShqIAYpAwA3AAAgAkEgaiAHKQMANwAAIAJBGGogCCkDADcAACACQRBqIAkpAwA3AA\
AgAkEIaiAKKQMANwAADCsLIAEoAgQiBSAFQZACaiIGLQAAIgFqQcgBaiEDAkAgAUHIAEYNACADQQBB\
yAAgAWsQPBoLQQAhAiAGQQA6AAAgA0EBOgAAIAVBjwJqIgEgAS0AAEGAAXI6AAADQCAFIAJqIgEgAS\
0AACABQcgBai0AAHM6AAAgAUEBaiIDIAMtAAAgAUHJAWotAABzOgAAIAFBAmoiAyADLQAAIAFBygFq\
LQAAczoAACABQQNqIgMgAy0AACABQcsBai0AAHM6AAAgAkEEaiICQcgARw0ACyAFECUgBEEoakE4ai\
IGIAVBOGopAAA3AwAgBEEoakEwaiIHIAVBMGopAAA3AwAgBEEoakEoaiIIIAVBKGopAAA3AwAgBEEo\
akEgaiIJIAVBIGopAAA3AwAgBEEoakEYaiIKIAVBGGopAAA3AwAgBEEoakEQaiILIAVBEGopAAA3Aw\
AgBEEoakEIaiIMIAVBCGopAAA3AwAgBCAFKQAANwMoQQAhASAFQQBByAEQPEGQAmpBADoAAEHAACED\
QcAAEBciAkUNGiACIAQpAyg3AAAgAkE4aiAGKQMANwAAIAJBMGogBykDADcAACACQShqIAgpAwA3AA\
AgAkEgaiAJKQMANwAAIAJBGGogCikDADcAACACQRBqIAspAwA3AAAgAkEIaiAMKQMANwAADCoLIAEo\
AgQhAiAEQdAEakEMakIANwIAIARCADcC1ARBECEDIARBEDYC0AQgBEEoakEQaiAEQdAEakEQaigCAD\
YCACAEQShqQQhqIARB0ARqQQhqKQMANwMAIARBoANqQQhqIgUgBEEoakEMaikCADcDACAEIAQpA9AE\
NwMoIAQgBCkCLDcDoAMgAiACQRhqIARBoANqEDBBACEBIAJB2ABqQQA6AAAgAkEQakL+uevF6Y6VmR\
A3AwAgAkKBxpS6lvHq5m83AwggAkIANwMAQRAQFyICRQ0aIAIgBCkDoAM3AAAgAkEIaiAFKQMANwAA\
DCkLIAEoAgQhAiAEQdAEakEMakIANwIAIARCADcC1ARBECEDIARBEDYC0AQgBEEoakEQaiAEQdAEak\
EQaigCADYCACAEQShqQQhqIARB0ARqQQhqKQMANwMAIARBoANqQQhqIgUgBEEoakEMaikCADcDACAE\
IAQpA9AENwMoIAQgBCkCLDcDoAMgAiACQRhqIARBoANqEC9BACEBIAJB2ABqQQA6AAAgAkEQakL+ue\
vF6Y6VmRA3AwAgAkKBxpS6lvHq5m83AwggAkIANwMAQRAQFyICRQ0aIAIgBCkDoAM3AAAgAkEIaiAF\
KQMANwAADCgLIAEoAgQhAkEUIQNBACEBIARB0ARqQRRqQQA2AgAgBEHQBGpBDGpCADcCACAEQgA3At\
QEIARBFDYC0AQgBEEoakEQaiAEQdAEakEQaikDADcDACAEQShqQQhqIARB0ARqQQhqKQMANwMAIARB\
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\
IAQgBCkD0AQ3AyggBEGgA2pBGGoiASAEQShqQRxqKQIANwMAIARBoANqQRBqIgggBEEoakEUaikCAD\
cDACAEQaADakEIaiIJIARBKGpBDGopAgA3AwAgBCAEKQIsNwOgAyACIAJBKGogBEGgA2oQKCAFIAEp\
AwA3AwAgBiAIKQMANwMAIAcgCSkDADcDACAEIAQpA6ADNwMoIAJCADcDAEEAIQEgAkHoAGpBADoAAC\
ACQQApA/CNQDcDCCACQRBqQQApA/iNQDcDACACQRhqQQApA4COQDcDACACQSBqQQApA4iOQDcDAEEg\
EBciAkUNGiACIAQpAyg3AAAgAkEYaiAFKQMANwAAIAJBEGogBikDADcAACACQQhqIAcpAwA3AAAMIA\
sgASgCBCECIARB0ARqQQxqQgA3AgAgBEHQBGpBFGpCADcCACAEQdAEakEcakIANwIAIARB0ARqQSRq\
QgA3AgAgBEHQBGpBLGpCADcCACAEQdAEakE0akIANwIAIARB0ARqQTxqQgA3AgAgBEIANwLUBCAEQc\
AANgLQBCAEQShqIARB0ARqQcQAEDoaIARBoANqQThqIARBKGpBPGopAgA3AwBBMCEDIARBoANqQTBq\
IARBKGpBNGopAgA3AwAgBEGgA2pBKGoiASAEQShqQSxqKQIANwMAIARBoANqQSBqIgUgBEEoakEkai\
kCADcDACAEQaADakEYaiIGIARBKGpBHGopAgA3AwAgBEGgA2pBEGoiByAEQShqQRRqKQIANwMAIARB\
oANqQQhqIgggBEEoakEMaikCADcDACAEIAQpAiw3A6ADIAIgAkHQAGogBEGgA2oQIyAEQShqQShqIg\
kgASkDADcDACAEQShqQSBqIgogBSkDADcDACAEQShqQRhqIgUgBikDADcDACAEQShqQRBqIgYgBykD\
ADcDACAEQShqQQhqIgcgCCkDADcDACAEIAQpA6ADNwMoIAJByABqQgA3AwAgAkIANwNAQQAhASACQT\
hqQQApA6iPQDcDACACQTBqQQApA6CPQDcDACACQShqQQApA5iPQDcDACACQSBqQQApA5CPQDcDACAC\
QRhqQQApA4iPQDcDACACQRBqQQApA4CPQDcDACACQQhqQQApA/iOQDcDACACQQApA/COQDcDACACQd\
ABakEAOgAAQTAQFyICRQ0aIAIgBCkDKDcAACACQShqIAkpAwA3AAAgAkEgaiAKKQMANwAAIAJBGGog\
BSkDADcAACACQRBqIAYpAwA3AAAgAkEIaiAHKQMANwAADB8LIAEoAgQhAiAEQdAEakEMakIANwIAIA\
RB0ARqQRRqQgA3AgAgBEHQBGpBHGpCADcCACAEQdAEakEkakIANwIAIARB0ARqQSxqQgA3AgAgBEHQ\
BGpBNGpCADcCACAEQdAEakE8akIANwIAIARCADcC1ARBwAAhAyAEQcAANgLQBCAEQShqIARB0ARqQc\
QAEDoaIARBoANqQThqIgEgBEEoakE8aikCADcDACAEQaADakEwaiIFIARBKGpBNGopAgA3AwAgBEGg\
A2pBKGoiBiAEQShqQSxqKQIANwMAIARBoANqQSBqIgcgBEEoakEkaikCADcDACAEQaADakEYaiIIIA\
RBKGpBHGopAgA3AwAgBEGgA2pBEGoiCSAEQShqQRRqKQIANwMAIARBoANqQQhqIgogBEEoakEMaikC\
ADcDACAEIAQpAiw3A6ADIAIgAkHQAGogBEGgA2oQIyAEQShqQThqIgsgASkDADcDACAEQShqQTBqIg\
wgBSkDADcDACAEQShqQShqIgUgBikDADcDACAEQShqQSBqIgYgBykDADcDACAEQShqQRhqIgcgCCkD\
ADcDACAEQShqQRBqIgggCSkDADcDACAEQShqQQhqIgkgCikDADcDACAEIAQpA6ADNwMoIAJByABqQg\
A3AwAgAkIANwNAQQAhASACQThqQQApA+iOQDcDACACQTBqQQApA+COQDcDACACQShqQQApA9iOQDcD\
ACACQSBqQQApA9COQDcDACACQRhqQQApA8iOQDcDACACQRBqQQApA8COQDcDACACQQhqQQApA7iOQD\
cDACACQQApA7COQDcDACACQdABakEAOgAAQcAAEBciAkUNGiACIAQpAyg3AAAgAkE4aiALKQMANwAA\
IAJBMGogDCkDADcAACACQShqIAUpAwA3AAAgAkEgaiAGKQMANwAAIAJBGGogBykDADcAACACQRBqIA\
gpAwA3AAAgAkEIaiAJKQMANwAADB4LIANBAEgNASABKAIEIQcCQAJAIAMNAEEBIQIMAQsgAxAXIgJF\
DRsgAkF8ai0AAEEDcUUNACACQQAgAxA8GgsgByAHQfACaiIILQAAIgFqQcgBaiEGAkAgAUGoAUYNAC\
AGQQBBqAEgAWsQPBoLQQAhBSAIQQA6AAAgBkEfOgAAIAdB7wJqIgEgAS0AAEGAAXI6AAADQCAHIAVq\
IgEgAS0AACABQcgBai0AAHM6AAAgAUEBaiIGIAYtAAAgAUHJAWotAABzOgAAIAFBAmoiBiAGLQAAIA\
FBygFqLQAAczoAACABQQNqIgYgBi0AACABQcsBai0AAHM6AAAgBUEEaiIFQagBRw0ACyAHECUgBEEo\
aiAHQcgBEDoaQQAhASAHQQBByAEQPEHwAmpBADoAACAEQQA2AqADIARBoANqQQRyQQBBqAEQPBogBE\
GoATYCoAMgBEHQBGogBEGgA2pBrAEQOhogBEEoakHIAWogBEHQBGpBBHJBqAEQOhogBEEoakHwAmpB\
ADoAACAEQShqIAIgAxAzDB0LIANBAEgNACABKAIEIQcgAw0BQQEhAgwCCxBrAAsgAxAXIgJFDRggAk\
F8ai0AAEEDcUUNACACQQAgAxA8GgsgByAHQdACaiIILQAAIgFqQcgBaiEGAkAgAUGIAUYNACAGQQBB\
iAEgAWsQPBoLQQAhBSAIQQA6AAAgBkEfOgAAIAdBzwJqIgEgAS0AAEGAAXI6AAADQCAHIAVqIgEgAS\
0AACABQcgBai0AAHM6AAAgAUEBaiIGIAYtAAAgAUHJAWotAABzOgAAIAFBAmoiBiAGLQAAIAFBygFq\
LQAAczoAACABQQNqIgYgBi0AACABQcsBai0AAHM6AAAgBUEEaiIFQYgBRw0ACyAHECUgBEEoaiAHQc\
gBEDoaQQAhASAHQQBByAEQPEHQAmpBADoAACAEQQA2AqADIARBoANqQQRyQQBBiAEQPBogBEGIATYC\
oAMgBEHQBGogBEGgA2pBjAEQOhogBEEoakHIAWogBEHQBGpBBHJBiAEQOhogBEEoakHQAmpBADoAAC\
AEQShqIAIgAxA0DBkLIAEoAgQhAiAEQdAEakEUakIANwIAIARB0ARqQQxqQgA3AgAgBEIANwLUBEEY\
IQMgBEEYNgLQBCAEQShqQRBqIARB0ARqQRBqKQMANwMAIARBKGpBCGogBEHQBGpBCGopAwA3AwAgBE\
EoakEYaiAEQdAEakEYaigCADYCACAEQaADakEIaiIFIARBKGpBDGopAgA3AwAgBEGgA2pBEGoiBiAE\
QShqQRRqKQIANwMAIAQgBCkD0AQ3AyggBCAEKQIsNwOgAyACIAJBIGogBEGgA2oQMSACQgA3AwBBAC\
EBIAJB4ABqQQA6AAAgAkEAKQP4kUA3AwggAkEQakEAKQOAkkA3AwAgAkEYakEAKQOIkkA3AwBBGBAX\
IgJFDRcgAiAEKQOgAzcAACACQRBqIAYpAwA3AAAgAkEIaiAFKQMANwAADBgLQcAAQQFBACgC+NRAIg\
RBBCAEGxEFAAALQSBBAUEAKAL41EAiBEEEIAQbEQUAAAtBMEEBQQAoAvjUQCIEQQQgBBsRBQAAC0Eg\
QQFBACgC+NRAIgRBBCAEGxEFAAALIANBAUEAKAL41EAiBEEEIAQbEQUAAAtBHEEBQQAoAvjUQCIEQQ\
QgBBsRBQAAC0EgQQFBACgC+NRAIgRBBCAEGxEFAAALQTBBAUEAKAL41EAiBEEEIAQbEQUAAAtBwABB\
AUEAKAL41EAiBEEEIAQbEQUAAAtBEEEBQQAoAvjUQCIEQQQgBBsRBQAAC0EQQQFBACgC+NRAIgRBBC\
AEGxEFAAALQRRBAUEAKAL41EAiBEEEIAQbEQUAAAtBFEEBQQAoAvjUQCIEQQQgBBsRBQAAC0EcQQFB\
ACgC+NRAIgRBBCAEGxEFAAALQSBBAUEAKAL41EAiBEEEIAQbEQUAAAtBMEEBQQAoAvjUQCIEQQQgBB\
sRBQAAC0HAAEEBQQAoAvjUQCIEQQQgBBsRBQAAC0EcQQFBACgC+NRAIgRBBCAEGxEFAAALQSBBAUEA\
KAL41EAiBEEEIAQbEQUAAAtBMEEBQQAoAvjUQCIEQQQgBBsRBQAAC0HAAEEBQQAoAvjUQCIEQQQgBB\
sRBQAACyADQQFBACgC+NRAIgRBBCAEGxEFAAALIANBAUEAKAL41EAiBEEEIAQbEQUAAAtBGEEBQQAo\
AvjUQCIEQQQgBBsRBQAACyAAIAI2AgQgACABNgIAIABBCGogAzYCACAEQYAGaiQAC5xWAhp/An4jAE\
GwAmsiAyQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC\
QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAk\
ACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACgCAA4YAAECAwQFBgcICQoLDA0O\
DxAREhMUFRYXAAsgACgCBCIAQcgAaiEEAkBBgAEgAEHIAWotAAAiBWsiBiACTw0AAkAgBUUNACAEIA\
VqIAEgBhA6GiAAIAApA0BCgAF8NwNAIAAgBEIAEBIgASAGaiEBIAIgBmshAgsgAiACQQd2IgYgAkEA\
RyACQf8AcUVxIgdrIgVBB3QiCGshAiAFRQ1FIAhFDUUgBkEAIAdrakEHdCEGIAEhBQNAIAAgACkDQE\
KAAXw3A0AgACAFQgAQEiAFQYABaiEFIAZBgH9qIgYNAAxGCwsgBCAFaiABIAIQOhogBSACaiECDEUL\
IAAoAgQiAEHIAGohBAJAQYABIABByAFqLQAAIgVrIgYgAk8NAAJAIAVFDQAgBCAFaiABIAYQOhogAC\
AAKQNAQoABfDcDQCAAIARCABASIAEgBmohASACIAZrIQILIAIgAkEHdiIGIAJBAEcgAkH/AHFFcSIH\
ayIFQQd0IghrIQIgBUUNQSAIRQ1BIAZBACAHa2pBB3QhBiABIQUDQCAAIAApA0BCgAF8NwNAIAAgBU\
IAEBIgBUGAAWohBSAGQYB/aiIGDQAMQgsLIAQgBWogASACEDoaIAUgAmohAgxBCyAAKAIEIgBByABq\
IQQCQEGAASAAQcgBai0AACIFayIGIAJPDQACQCAFRQ0AIAQgBWogASAGEDoaIAAgACkDQEKAAXw3A0\
AgACAEQgAQEiABIAZqIQEgAiAGayECCyACIAJBB3YiBiACQQBHIAJB/wBxRXEiB2siBUEHdCIIayEC\
IAVFDT0gCEUNPSAGQQAgB2tqQQd0IQYgASEFA0AgACAAKQNAQoABfDcDQCAAIAVCABASIAVBgAFqIQ\
UgBkGAf2oiBg0ADD4LCyAEIAVqIAEgAhA6GiAFIAJqIQIMPQsgACgCBCIAQShqIQQCQEHAACAAQegA\
ai0AACIFayIGIAJPDQACQCAFRQ0AIAQgBWogASAGEDoaIAAgACkDAELAAHw3AwAgACAEQQAQFCABIA\
ZqIQEgAiAGayECCyACIAJBBnYiBiACQQBHIAJBP3FFcSIHayIFQQZ0IghrIQIgBUUNOSAIRQ05IAZB\
ACAHa2pBBnQhBiABIQUDQCAAIAApAwBCwAB8NwMAIAAgBUEAEBQgBUHAAGohBSAGQUBqIgYNAAw6Cw\
sgBCAFaiABIAIQOhogBSACaiECDDkLIAAoAgQiCEHpAGotAABBBnQgCC0AaGoiAEUNNiAIIAEgAkGA\
CCAAayIAIAAgAksbIgUQNRogAiAFayICRQ1CIANB+ABqQRBqIAhBEGoiACkDADcDACADQfgAakEYai\
AIQRhqIgYpAwA3AwAgA0H4AGpBIGogCEEgaiIEKQMANwMAIANB+ABqQTBqIAhBMGopAwA3AwAgA0H4\
AGpBOGogCEE4aikDADcDACADQfgAakHAAGogCEHAAGopAwA3AwAgA0H4AGpByABqIAhByABqKQMANw\
MAIANB+ABqQdAAaiAIQdAAaikDADcDACADQfgAakHYAGogCEHYAGopAwA3AwAgA0H4AGpB4ABqIAhB\
4ABqKQMANwMAIAMgCCkDCDcDgAEgAyAIKQMoNwOgASAIQekAai0AACEHIAgtAGohCSADIAgtAGgiCj\
oA4AEgAyAIKQMAIh03A3ggAyAJIAdFckECciIHOgDhASADQegBakEYaiIJIAQpAgA3AwAgA0HoAWpB\
EGoiBCAGKQIANwMAIANB6AFqQQhqIgYgACkCADcDACADIAgpAgg3A+gBIANB6AFqIANB+ABqQShqIA\
ogHSAHEBogCSgCACEHIAQoAgAhBCAGKAIAIQkgAygChAIhCiADKAL8ASELIAMoAvQBIQwgAygC7AEh\
DSADKALoASEOIAggCCkDABAqIAgoApABIgZBN08NEyAIQZABaiAGQQV0aiIAQSBqIAo2AgAgAEEcai\
AHNgIAIABBGGogCzYCACAAQRRqIAQ2AgAgAEEQaiAMNgIAIABBDGogCTYCACAAQQhqIA02AgAgAEEE\
aiAONgIAIAggBkEBajYCkAEgCEEoaiIAQgA3AwAgAEEIakIANwMAIABBEGpCADcDACAAQRhqQgA3Aw\
AgAEEgakIANwMAIABBKGpCADcDACAAQTBqQgA3AwAgAEE4akIANwMAIAhBADsBaCAIQQhqIgAgCCkD\
cDcDACAAQQhqIAhB+ABqKQMANwMAIABBEGogCEGAAWopAwA3AwAgAEEYaiAIQYgBaikDADcDACAIIA\
gpAwBCAXw3AwAgASAFaiEBDDYLIAAoAgQiBEHIAWohCgJAQZABIARB2AJqLQAAIgBrIgggAksNAAJA\
IABFDQAgCiAAaiABIAgQOhogAiAIayECQQAhBQNAIAQgBWoiACAALQAAIABByAFqLQAAczoAACAAQQ\
FqIgYgBi0AACAAQckBai0AAHM6AAAgAEECaiIGIAYtAAAgAEHKAWotAABzOgAAIABBA2oiBiAGLQAA\
IABBywFqLQAAczoAACAFQQRqIgVBkAFHDQALIAQQJSABIAhqIQELIAEgAkGQAW5BkAFsIgBqIQcgAi\
AAayEJIAJBjwFNDTMgAEUNMwNAIAFBkAFqIQhBACEFA0AgBCAFaiIAIAAtAAAgASAFaiIGLQAAczoA\
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\
KQMANwMAIApBGGogGCkDADcDACAKQSBqIBkpAwA3AwAgCkEoaiAaKQMANwMAIApBMGogGykDADcDAC\
AKQThqIBwpAwA3AwAgAy0A4gEhDiADLQDhASEXIAMgAy0A4AEiGDoAcCADIAMpA3giHjcDCCADIA4g\
F0VyQQJyIg46AHEgA0HoAWpBGGoiFyAHKQIANwMAIANB6AFqQRBqIgcgBikCADcDACADQegBakEIai\
IGIAUpAgA3AwAgAyALKQIANwPoASADQegBaiAKIBggHiAOEBogFygCACEOIAcoAgAhByAGKAIAIRcg\
AygChAIhGCADKAL8ASEZIAMoAvQBIRogAygC7AEhGyADKALoASEcIAggCCkDABAqIAgoApABIgZBN0\
8NCSANIAZBBXRqIgUgGDYCHCAFIA42AhggBSAZNgIUIAUgBzYCECAFIBo2AgwgBSAXNgIIIAUgGzYC\
BCAFIBw2AgAgCCAGQQFqNgKQAQsgCCAIKQMAIB18Ih43AwAgAiAASQ0JIAEgAGohASACIABrIgJBgA\
hLDQALCyACRQ0TIAggASACEDUaIAggCCkDABAqDBMLIAAgAkGghcAAEEsACyAFQcAAQeCEwAAQSwAL\
IAZBwABB8ITAABBLAAsgBkEgQYCFwAAQSwALIANBkAJqQQhqIgEgGjYCACADQZACakEQaiIAIBg2Ag\
AgA0GQAmpBGGoiBSAONgIAIAMgGTYCnAIgA0GBAWoiBiABKQMANwAAIAMgFzYCpAIgA0GJAWoiASAA\
KQMANwAAIAMgBzYCrAIgA0GRAWoiACAFKQMANwAAIAMgGzYClAIgAyAcNgKQAiADIAMpA5ACNwB5IA\
NBCGpBGGogACkAADcDACADQQhqQRBqIAEpAAA3AwAgA0EIakEIaiAGKQAANwMAIAMgAykAeTcDCEGQ\
ksAAIANBCGpBgIbAAEH4hsAAEEIACyADQZACakEIaiIBIBQ2AgAgA0GQAmpBEGoiACASNgIAIANBkA\
JqQRhqIgUgEDYCACADIBM2ApwCIANBgQFqIgYgASkDADcAACADIBE2AqQCIANBiQFqIgEgACkDADcA\
ACADIA82AqwCIANBkQFqIgAgBSkDADcAACADIBU2ApQCIAMgFjYCkAIgAyADKQOQAjcAeSADQQhqQR\
hqIAApAAA3AwAgA0EIakEQaiABKQAANwMAIANBCGpBCGogBikAADcDACADIAMpAHk3AwhBkJLAACAD\
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\
QRh3Ii4gL2oiLyAac0EZdyIaIAggMCAiIBlzQRl3IhlqIBRqIiIgJiAoc0EYdyImc0EQdyIoICEgJ2\
oiIWoiJyAZc0EUdyIZICJqaiIiamoiMCANIAsgHiAhIBhzQRl3IhhqaiIeICpzQRB3IiEgJiApaiIm\
aiIpIBhzQRR3IhggHmpqIh4gIXNBGHciIXNBEHciKiAOICYgF3NBGXciFyAfaiAJaiIfICBzQRB3Ii\
AgMmoiJiAXc0EUdyIXIB9qaiIfICBzQRh3IiAgJmoiJmoiMiAac0EUdyIaIDBqaiIwICpzQRh3Iiog\
MmoiMiAac0EZdyIaIAwgMSAmIBdzQRl3IhdqIANqIiYgIiAoc0EYdyIic0EQdyIoICEgKWoiIWoiKS\
AXc0EUdyIXICZqaiImaiAGaiIxIAcgISAYc0EZdyIYIB9qIAZqIh8gLnNBEHciISAiICdqIiJqIicg\
GHNBFHciGCAfamoiHyAhc0EYdyIhc0EQdyIuIAUgIiAZc0EZdyIZIB5qaiIeICBzQRB3IiAgL2oiIi\
AZc0EUdyIZIB5qIAJqIh4gIHNBGHciICAiaiIiaiIvIBpzQRR3IhogMWpqIjEgLnNBGHciLiAvaiIv\
IBpzQRl3IhogByAPIDAgIiAZc0EZdyIZamoiIiAmIChzQRh3IiZzQRB3IiggISAnaiIhaiInIBlzQR\
R3IhkgImpqIiJqaiIwIAEgHiAhIBhzQRl3IhhqIANqIh4gKnNBEHciISAmIClqIiZqIikgGHNBFHci\
GCAeamoiHiAhc0EYdyIhc0EQdyIqIA4gJiAXc0EZdyIXIB9qaiIfICBzQRB3IiAgMmoiJiAXc0EUdy\
IXIB9qIAJqIh8gIHNBGHciICAmaiImaiIyIBpzQRR3IhogMGogCWoiMCAqc0EYdyIqIDJqIjIgGnNB\
GXciGiAIIAQgMSAmIBdzQRl3IhdqaiImICIgKHNBGHciInNBEHciKCAhIClqIiFqIikgF3NBFHciFy\
AmamoiJmogCmoiMSAFICEgGHNBGXciGCAfaiAUaiIfIC5zQRB3IiEgIiAnaiIiaiInIBhzQRR3Ihgg\
H2pqIh8gIXNBGHciIXNBEHciLiALICIgGXNBGXciGSAeamoiHiAgc0EQdyIgIC9qIiIgGXNBFHciGS\
AeaiAKaiIeICBzQRh3IiAgImoiImoiLyAac0EUdyIaIDFqaiIxIC5zQRh3Ii4gL2oiLyAac0EZdyIa\
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\
AhQgAyABQRxqKAAAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZyciIKNgIcIAMgAUEgai\
gAACICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnIiCzYCICADIAFBGGooAAAiAkEYdCAC\
QQh0QYCA/AdxciACQQh2QYD+A3EgAkEYdnJyIgw2AhggAygCACENIAMoAgQhDiADKAIIIQ8gAygCEC\
EQIAMoAgwhESADKAIUIRIgAyABQSRqKAAAIgJBGHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZy\
ciITNgIkIAMgAUEoaigAACICQRh0IAJBCHRBgID8B3FyIAJBCHZBgP4DcSACQRh2cnIiFDYCKCADIA\
FBMGooAAAiAkEYdCACQQh0QYCA/AdxciACQQh2QYD+A3EgAkEYdnJyIhU2AjAgAyABQSxqKAAAIgJB\
GHQgAkEIdEGAgPwHcXIgAkEIdkGA/gNxIAJBGHZyciIWNgIsIAMgAUE0aigAACICQRh0IAJBCHRBgI\
D8B3FyIAJBCHZBgP4DcSACQRh2cnIiAjYCNCADIAFBOGooAAAiF0EYdCAXQQh0QYCA/AdxciAXQQh2\
QYD+A3EgF0EYdnJyIhc2AjggAyABQTxqKAAAIhhBGHQgGEEIdEGAgPwHcXIgGEEIdkGA/gNxIBhBGH\
ZyciIYNgI8IAggEyAKcyAYcyAMIBBzIBVzIBEgDnMgE3MgF3NBAXciGXNBAXciGnNBAXciGyAKIBJz\
IAJzIBAgD3MgFHMgGHNBAXciHHNBAXciHXMgGCACcyAdcyAVIBRzIBxzIBtzQQF3Ih5zQQF3Ih9zIB\
ogHHMgHnMgGSAYcyAbcyAXIBVzIBpzIBYgE3MgGXMgCyAMcyAXcyASIBFzIBZzIA8gDXMgC3MgAnNB\
AXciIHNBAXciIXNBAXciInNBAXciI3NBAXciJHNBAXciJXNBAXciJnNBAXciJyAdICFzIAIgFnMgIX\
MgFCALcyAgcyAdc0EBdyIoc0EBdyIpcyAcICBzIChzIB9zQQF3IipzQQF3IitzIB8gKXMgK3MgHiAo\
cyAqcyAnc0EBdyIsc0EBdyItcyAmICpzICxzICUgH3MgJ3MgJCAecyAmcyAjIBtzICVzICIgGnMgJH\
MgISAZcyAjcyAgIBdzICJzIClzQQF3Ii5zQQF3Ii9zQQF3IjBzQQF3IjFzQQF3IjJzQQF3IjNzQQF3\
IjRzQQF3IjUgKyAvcyApICNzIC9zICggInMgLnMgK3NBAXciNnNBAXciN3MgKiAucyA2cyAtc0EBdy\
I4c0EBdyI5cyAtIDdzIDlzICwgNnMgOHMgNXNBAXciOnNBAXciO3MgNCA4cyA6cyAzIC1zIDVzIDIg\
LHMgNHMgMSAncyAzcyAwICZzIDJzIC8gJXMgMXMgLiAkcyAwcyA3c0EBdyI8c0EBdyI9c0EBdyI+c0\
EBdyI/c0EBdyJAc0EBdyJBc0EBdyJCc0EBdyJDIDkgPXMgNyAxcyA9cyA2IDBzIDxzIDlzQQF3IkRz\
QQF3IkVzIDggPHMgRHMgO3NBAXciRnNBAXciR3MgOyBFcyBHcyA6IERzIEZzIENzQQF3IkhzQQF3Ik\
lzIEIgRnMgSHMgQSA7cyBDcyBAIDpzIEJzID8gNXMgQXMgPiA0cyBAcyA9IDNzID9zIDwgMnMgPnMg\
RXNBAXciSnNBAXciS3NBAXciTHNBAXciTXNBAXciTnNBAXciT3NBAXciUHNBAXdqIEYgSnMgRCA+cy\
BKcyBHc0EBdyJRcyBJc0EBdyJSIEUgP3MgS3MgUXNBAXciUyBMIEEgOiA5IDwgMSAmIB8gKCAhIBcg\
EyAQIAhBHnciVGogDiAFIAdBHnciECAGcyAIcSAGc2pqIA0gBCAIQQV3aiAGIAVzIAdxIAVzampBmf\
OJ1AVqIg5BBXdqQZnzidQFaiJVQR53IgggDkEedyINcyAGIA9qIA4gVCAQc3EgEHNqIFVBBXdqQZnz\
idQFaiIOcSANc2ogECARaiBVIA0gVHNxIFRzaiAOQQV3akGZ84nUBWoiEEEFd2pBmfOJ1AVqIhFBHn\
ciD2ogDCAIaiARIBBBHnciEyAOQR53IgxzcSAMc2ogEiANaiAMIAhzIBBxIAhzaiARQQV3akGZ84nU\
BWoiEUEFd2pBmfOJ1AVqIhJBHnciCCARQR53IhBzIAogDGogESAPIBNzcSATc2ogEkEFd2pBmfOJ1A\
VqIgpxIBBzaiALIBNqIBAgD3MgEnEgD3NqIApBBXdqQZnzidQFaiIMQQV3akGZ84nUBWoiD0EedyIL\
aiAVIApBHnciF2ogCyAMQR53IhNzIBQgEGogDCAXIAhzcSAIc2ogD0EFd2pBmfOJ1AVqIhRxIBNzai\
AWIAhqIA8gEyAXc3EgF3NqIBRBBXdqQZnzidQFaiIVQQV3akGZ84nUBWoiFiAVQR53IhcgFEEedyII\
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\
IANBhYHAACAEEFNFDQYgA0GMgcAAIAQQUw0KQdgBEBciBEUNHCACQQA2AgAgAkEEckEAQYABEDwaIA\
JBgAE2AgAgAkGwAWogAkGEARA6GiAEQdAAaiACQbABakEEckGAARA6GiAEQcgAakIANwMAIARCADcD\
QCAEQQA6ANABIARBACkDsI5ANwMAIARBCGpBACkDuI5ANwMAIARBEGpBACkDwI5ANwMAIARBGGpBAC\
kDyI5ANwMAIARBIGpBACkD0I5ANwMAIARBKGpBACkD2I5ANwMAIARBMGpBACkD4I5ANwMAIARBOGpB\
ACkD6I5ANwMAQRQhBQwjC0HwABAXIgRFDQwgAkGwAWpBCGoQWCAEQSBqIAJB2AFqKQMANwMAIARBGG\
ogAkGwAWpBIGopAwA3AwAgBEEQaiACQbABakEYaikDADcDACAEQQhqIAJBsAFqQRBqKQMANwMAIAQg\
AikDuAE3AwAgAkEMakIANwIAIAJBFGpCADcCACACQRxqQgA3AgAgAkEkakIANwIAIAJBLGpCADcCAC\
ACQTRqQgA3AgAgAkE8akIANwIAIAJCADcCBCACQcAANgIAIAJBsAFqIAJBxAAQOhogBEHgAGogAkGw\
AWpBPGopAgA3AAAgBEHYAGogAkGwAWpBNGopAgA3AAAgBEHQAGogAkGwAWpBLGopAgA3AAAgBEHIAG\
ogAkGwAWpBJGopAgA3AAAgBEHAAGogAkGwAWpBHGopAgA3AAAgBEE4aiACQbABakEUaikCADcAACAE\
QTBqIAJBsAFqQQxqKQIANwAAIAQgAikCtAE3ACggBEEAOgBoQQMhBQwiCwJAAkACQAJAIANBuoDAAE\
EKEFNFDQAgA0HEgMAAQQoQU0UNASADQc6AwABBChBTRQ0CIANB2IDAAEEKEFNFDQMgA0HogMAAQQoQ\
Uw0MQegAEBciBEUNFiACQQxqQgA3AgAgAkEUakIANwIAIAJBHGpCADcCACACQSRqQgA3AgAgAkEsak\
IANwIAIAJBNGpCADcCACACQTxqQgA3AgAgAkIANwIEIAJBwAA2AgAgAkGwAWogAkHEABA6GiAEQdgA\
aiACQbABakE8aikCADcAACAEQdAAaiACQbABakE0aikCADcAACAEQcgAaiACQbABakEsaikCADcAAC\
AEQcAAaiACQbABakEkaikCADcAACAEQThqIAJBsAFqQRxqKQIANwAAIARBMGogAkGwAWpBFGopAgA3\
AAAgBEEoaiACQbABakEMaikCADcAACAEIAIpArQBNwAgIARCADcDACAEQQA6AGAgBEEAKQPYjUA3Aw\
ggBEEQakEAKQPgjUA3AwAgBEEYakEAKALojUA2AgBBCyEFDCULQeACEBciBEUNDyAEQQBByAEQPCEF\
IAJBADYCACACQQRyQQBBkAEQPBogAkGQATYCACACQbABaiACQZQBEDoaIAVByAFqIAJBsAFqQQRyQZ\
ABEDoaIAVBADoA2AJBBSEFDCQLQdgCEBciBEUNDyAEQQBByAEQPCEFIAJBADYCACACQQRyQQBBiAEQ\
PBogAkGIATYCACACQbABaiACQYwBEDoaIAVByAFqIAJBsAFqQQRyQYgBEDoaIAVBADoA0AJBBiEFDC\
MLQbgCEBciBEUNDyAEQQBByAEQPCEFIAJBADYCACACQQRyQQBB6AAQPBogAkHoADYCACACQbABaiAC\
QewAEDoaIAVByAFqIAJBsAFqQQRyQegAEDoaIAVBADoAsAJBByEFDCILQZgCEBciBEUNDyAEQQBByA\
EQPCEFIAJBADYCACACQQRyQQBByAAQPBogAkHIADYCACACQbABaiACQcwAEDoaIAVByAFqIAJBsAFq\
QQRyQcgAEDoaIAVBADoAkAJBCCEFDCELAkAgA0HigMAAQQMQU0UNACADQeWAwABBAxBTDQhB4AAQFy\
IERQ0RIAJBDGpCADcCACACQRRqQgA3AgAgAkEcakIANwIAIAJBJGpCADcCACACQSxqQgA3AgAgAkE0\
akIANwIAIAJBPGpCADcCACACQgA3AgQgAkHAADYCACACQbABaiACQcQAEDoaIARB0ABqIAJBsAFqQT\
xqKQIANwAAIARByABqIAJBsAFqQTRqKQIANwAAIARBwABqIAJBsAFqQSxqKQIANwAAIARBOGogAkGw\
AWpBJGopAgA3AAAgBEEwaiACQbABakEcaikCADcAACAEQShqIAJBsAFqQRRqKQIANwAAIARBIGogAk\
GwAWpBDGopAgA3AAAgBCACKQK0ATcAGCAEQv6568XpjpWZEDcDECAEQoHGlLqW8ermbzcDCCAEQgA3\
AwAgBEEAOgBYQQohBQwhC0HgABAXIgRFDQ8gAkEMakIANwIAIAJBFGpCADcCACACQRxqQgA3AgAgAk\
EkakIANwIAIAJBLGpCADcCACACQTRqQgA3AgAgAkE8akIANwIAIAJCADcCBCACQcAANgIAIAJBsAFq\
IAJBxAAQOhogBEHQAGogAkGwAWpBPGopAgA3AAAgBEHIAGogAkGwAWpBNGopAgA3AAAgBEHAAGogAk\
GwAWpBLGopAgA3AAAgBEE4aiACQbABakEkaikCADcAACAEQTBqIAJBsAFqQRxqKQIANwAAIARBKGog\
AkGwAWpBFGopAgA3AAAgBEEgaiACQbABakEMaikCADcAACAEIAIpArQBNwAYIARC/rnrxemOlZkQNw\
MQIARCgcaUupbx6uZvNwMIIARCADcDACAEQQA6AFhBCSEFDCALAkACQAJAAkAgAykAAELTkIWa08WM\
mTRRDQAgAykAAELTkIWa08XMmjZRDQEgAykAAELTkIWa0+WMnDRRDQIgAykAAELTkIWa06XNmDJRDQ\
MgAykAAELTkIXa1KiMmThRDQcgAykAAELTkIXa1MjMmjZSDQpB2AIQFyIERQ0eIARBAEHIARA8IQUg\
AkEANgIAIAJBBHJBAEGIARA8GiACQYgBNgIAIAJBsAFqIAJBjAEQOhogBUHIAWogAkGwAWpBBHJBiA\
EQOhogBUEAOgDQAkEWIQUMIwtB4AIQFyIERQ0UIARBAEHIARA8IQUgAkEANgIAIAJBBHJBAEGQARA8\
GiACQZABNgIAIAJBsAFqIAJBlAEQOhogBUHIAWogAkGwAWpBBHJBkAEQOhogBUEAOgDYAkENIQUMIg\
tB2AIQFyIERQ0UIARBAEHIARA8IQUgAkEANgIAIAJBBHJBAEGIARA8GiACQYgBNgIAIAJBsAFqIAJB\
jAEQOhogBUHIAWogAkGwAWpBBHJBiAEQOhogBUEAOgDQAkEOIQUMIQtBuAIQFyIERQ0UIARBAEHIAR\
A8IQUgAkEANgIAIAJBBHJBAEHoABA8GiACQegANgIAIAJBsAFqIAJB7AAQOhogBUHIAWogAkGwAWpB\
BHJB6AAQOhogBUEAOgCwAkEPIQUMIAtBmAIQFyIERQ0UIARBAEHIARA8IQUgAkEANgIAIAJBBHJBAE\
HIABA8GiACQcgANgIAIAJBsAFqIAJBzAAQOhogBUHIAWogAkGwAWpBBHJByAAQOhogBUEAOgCQAkEQ\
IQUMHwtB8AAQFyIERQ0UIAJBDGpCADcCACACQRRqQgA3AgAgAkEcakIANwIAIAJBJGpCADcCACACQS\
xqQgA3AgAgAkE0akIANwIAIAJBPGpCADcCACACQgA3AgQgAkHAADYCACACQbABaiACQcQAEDoaIARB\
4ABqIAJBsAFqQTxqKQIANwAAIARB2ABqIAJBsAFqQTRqKQIANwAAIARB0ABqIAJBsAFqQSxqKQIANw\
AAIARByABqIAJBsAFqQSRqKQIANwAAIARBwABqIAJBsAFqQRxqKQIANwAAIARBOGogAkGwAWpBFGop\
AgA3AAAgBEEwaiACQbABakEMaikCADcAACAEIAIpArQBNwAoIARCADcDACAEQQA6AGggBEEAKQOQjk\
A3AwggBEEQakEAKQOYjkA3AwAgBEEYakEAKQOgjkA3AwAgBEEgakEAKQOojkA3AwBBESEFDB4LQfAA\
EBciBEUNFCACQQxqQgA3AgAgAkEUakIANwIAIAJBHGpCADcCACACQSRqQgA3AgAgAkEsakIANwIAIA\
JBNGpCADcCACACQTxqQgA3AgAgAkIANwIEIAJBwAA2AgAgAkGwAWogAkHEABA6GiAEQeAAaiACQbAB\
akE8aikCADcAACAEQdgAaiACQbABakE0aikCADcAACAEQdAAaiACQbABakEsaikCADcAACAEQcgAai\
ACQbABakEkaikCADcAACAEQcAAaiACQbABakEcaikCADcAACAEQThqIAJBsAFqQRRqKQIANwAAIARB\
MGogAkGwAWpBDGopAgA3AAAgBCACKQK0ATcAKCAEQgA3AwAgBEEAOgBoIARBACkD8I1ANwMIIARBEG\
pBACkD+I1ANwMAIARBGGpBACkDgI5ANwMAIARBIGpBACkDiI5ANwMAQRIhBQwdC0HYARAXIgRFDRQg\
AkEANgIAIAJBBHJBAEGAARA8GiACQYABNgIAIAJBsAFqIAJBhAEQOhogBEHQAGogAkGwAWpBBHJBgA\
EQOhogBEHIAGpCADcDACAEQgA3A0AgBEEAOgDQASAEQQApA/COQDcDACAEQQhqQQApA/iOQDcDACAE\
QRBqQQApA4CPQDcDACAEQRhqQQApA4iPQDcDACAEQSBqQQApA5CPQDcDACAEQShqQQApA5iPQDcDAC\
AEQTBqQQApA6CPQDcDACAEQThqQQApA6iPQDcDAEETIQUMHAtB+AIQFyIERQ0VIARBAEHIARA8IQUg\
AkEANgIAIAJBBHJBAEGoARA8GiACQagBNgIAIAJBsAFqIAJBrAEQOhogBUHIAWogAkGwAWpBBHJBqA\
EQOhogBUEAOgDwAkEVIQUMGwsgA0HygMAAQQUQU0UNFyADQZOBwABBBRBTDQFB6AAQFyIERQ0WIARC\
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\
QEEAQaTVwAA2AqzVQEEAQbTVwAA2AsDVQEEAQazVwAA2ArTVQEEAQbzVwAA2AsjVQEEAQbTVwAA2Ar\
zVQEEAQcTVwAA2AtDVQEEAQbzVwAA2AsTVQEEAQQA2ArjYQEEAQczVwAA2AtjVQEEAQcTVwAA2AszV\
QEEAQczVwAA2AtTVQEEAQdTVwAA2AuDVQEEAQdTVwAA2AtzVQEEAQdzVwAA2AujVQEEAQdzVwAA2Au\
TVQEEAQeTVwAA2AvDVQEEAQeTVwAA2AuzVQEEAQezVwAA2AvjVQEEAQezVwAA2AvTVQEEAQfTVwAA2\
AoDWQEEAQfTVwAA2AvzVQEEAQfzVwAA2AojWQEEAQfzVwAA2AoTWQEEAQYTWwAA2ApDWQEEAQYTWwA\
A2AozWQEEAQYzWwAA2ApjWQEEAQZTWwAA2AqDWQEEAQYzWwAA2ApTWQEEAQZzWwAA2AqjWQEEAQZTW\
wAA2ApzWQEEAQaTWwAA2ArDWQEEAQZzWwAA2AqTWQEEAQazWwAA2ArjWQEEAQaTWwAA2AqzWQEEAQb\
TWwAA2AsDWQEEAQazWwAA2ArTWQEEAQbzWwAA2AsjWQEEAQbTWwAA2ArzWQEEAQcTWwAA2AtDWQEEA\
QbzWwAA2AsTWQEEAQczWwAA2AtjWQEEAQcTWwAA2AszWQEEAQdTWwAA2AuDWQEEAQczWwAA2AtTWQE\
EAQdzWwAA2AujWQEEAQdTWwAA2AtzWQEEAQeTWwAA2AvDWQEEAQdzWwAA2AuTWQEEAQezWwAA2AvjW\
QEEAQeTWwAA2AuzWQEEAQfTWwAA2AoDXQEEAQezWwAA2AvTWQEEAQfzWwAA2AojXQEEAQfTWwAA2Av\
zWQEEAQYTXwAA2ApDXQEEAQfzWwAA2AoTXQEEAIAY2AqDYQEEAQYTXwAA2AozXQEEAIAhBWGoiADYC\
mNhAIAYgAEEBcjYCBCAIIAZqQVxqQSg2AgBBAEGAgIABNgK82EALQQAhAUEAKAKY2EAiACACTQ0AQQ\
AgACACayIBNgKY2EBBAEEAKAKg2EAiACACaiIFNgKg2EAgBSABQQFyNgIEIAAgAkEDcjYCBCAAQQhq\
DwsgAQu5JQIDfx5+IwBBwABrIgNBOGpCADcDACADQTBqQgA3AwAgA0EoakIANwMAIANBIGpCADcDAC\
ADQRhqQgA3AwAgA0EQakIANwMAIANBCGpCADcDACADQgA3AwACQCACRQ0AIAEgAkEGdGohBCAAKQMQ\
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\
OGogA0E4aikDADcDACABQQhqQTBqIANBMGopAwA3AwAgAUEIakEoaiADQShqKQMANwMAIAFBCGpBIG\
ogA0EgaikDADcDACABQQhqQRhqIANBGGopAwA3AwAgAUEIakEQaiADQRBqKQMANwMAIAFBCGpBCGog\
A0EIaikDADcDACABIAMpAwA3AwggAykDQCEPIAFBCGpByABqIANByABqEEUgASAPNwNIIAIgAUEIak\
HQARA6GkEAIQMMHwsgAigCBCEDQdABEBciAkUNBiABQQhqQThqIANBOGopAwA3AwAgAUEIakEwaiAD\
QTBqKQMANwMAIAFBCGpBKGogA0EoaikDADcDACABQQhqQSBqIANBIGopAwA3AwAgAUEIakEYaiADQR\
hqKQMANwMAIAFBCGpBEGogA0EQaikDADcDACABQQhqQQhqIANBCGopAwA3AwAgASADKQMANwMIIAMp\
A0AhDyABQQhqQcgAaiADQcgAahBFIAEgDzcDSCACIAFBCGpB0AEQOhpBASEDDB4LIAIoAgQhA0HQAR\
AXIgJFDQYgAUEIakE4aiADQThqKQMANwMAIAFBCGpBMGogA0EwaikDADcDACABQQhqQShqIANBKGop\
AwA3AwAgAUEIakEgaiADQSBqKQMANwMAIAFBCGpBGGogA0EYaikDADcDACABQQhqQRBqIANBEGopAw\
A3AwAgAUEIakEIaiADQQhqKQMANwMAIAEgAykDADcDCCADKQNAIQ8gAUEIakHIAGogA0HIAGoQRSAB\
IA83A0ggAiABQQhqQdABEDoaQQIhAwwdCyACKAIEIQNB8AAQFyICRQ0GIAFBCGpBIGogA0EgaikDAD\
cDACABQQhqQRhqIANBGGopAwA3AwAgAUEIakEQaiADQRBqKQMANwMAIAEgAykDCDcDECADKQMAIQ8g\
AUEIakEoaiADQShqEDkgASAPNwMIIAIgAUEIakHwABA6GkEDIQMMHAsgAigCBCEDQfgOEBciAkUNBi\
ABQQhqQYgBaiADQYgBaikDADcDACABQQhqQYABaiADQYABaikDADcDACABQQhqQfgAaiADQfgAaikD\
ADcDACABQQhqQRBqIANBEGopAwA3AwAgAUEIakEYaiADQRhqKQMANwMAIAFBCGpBIGogA0EgaikDAD\
cDACABQQhqQTBqIANBMGopAwA3AwAgAUEIakE4aiADQThqKQMANwMAIAFBCGpBwABqIANBwABqKQMA\
NwMAIAFBCGpByABqIANByABqKQMANwMAIAFBCGpB0ABqIANB0ABqKQMANwMAIAFBCGpB2ABqIANB2A\
BqKQMANwMAIAFBCGpB4ABqIANB4ABqKQMANwMAIAEgAykDcDcDeCABIAMpAwg3AxAgASADKQMoNwMw\
IAMpAwAhDyADLQBqIQQgAy0AaSEFIAMtAGghBgJAIAMoApABQQV0IgcNAEEAIQcMGwsgAUGAD2pBGG\
oiCCADQZQBaiIJQRhqKQAANwMAIAFBgA9qQRBqIgogCUEQaikAADcDACABQYAPakEIaiILIAlBCGop\
AAA3AwAgASAJKQAANwOADyADQdQBaiEJQQAgB0FgakEFdmshDCABQbwBaiEDQQIhBwNAIANBYGoiDS\
ABKQOADzcAACANQRhqIAgpAwA3AAAgDUEQaiAKKQMANwAAIA1BCGogCykDADcAAAJAAkAgDCAHaiIO\
QQJGDQAgCCAJQWBqIg1BGGopAAA3AwAgCiANQRBqKQAANwMAIAsgDUEIaikAADcDACABIA0pAAA3A4\
APIAdBOEcNARBsAAsgB0F/aiEHDBwLIAMgASkDgA83AAAgA0EYaiAIKQMANwAAIANBEGogCikDADcA\
ACADQQhqIAspAwA3AAAgDkEBRg0bIAggCUEYaikAADcDACAKIAlBEGopAAA3AwAgCyAJQQhqKQAANw\
MAIAEgCSkAADcDgA8gA0HAAGohAyAHQQJqIQcgCUHAAGohCQwACwsQcAALEHEAC0HQAUEIQQAoAvjU\
QCIBQQQgARsRBQAAC0HQAUEIQQAoAvjUQCIBQQQgARsRBQAAC0HQAUEIQQAoAvjUQCIBQQQgARsRBQ\
AAC0HwAEEIQQAoAvjUQCIBQQQgARsRBQAAC0H4DkEIQQAoAvjUQCIBQQQgARsRBQAACyACKAIEIQMC\
QEHoABAXIgJFDQAgAUEIakEQaiADQRBqKQMANwMAIAFBCGpBGGogA0EYaikDADcDACABIAMpAwg3Ax\
AgAykDACEPIAFBCGpBIGogA0EgahA5IAEgDzcDCCACIAFBCGpB6AAQOhpBFyEDDBQLQegAQQhBACgC\
+NRAIgFBBCABGxEFAAALIAIoAgQhAwJAQdgCEBciAkUNACABQQhqIANByAEQOhogAUEIakHIAWogA0\
HIAWoQRiACIAFBCGpB2AIQOhpBFiEDDBMLQdgCQQhBACgC+NRAIgFBBCABGxEFAAALIAIoAgQhAwJA\
QfgCEBciAkUNACABQQhqIANByAEQOhogAUEIakHIAWogA0HIAWoQRyACIAFBCGpB+AIQOhpBFSEDDB\
ILQfgCQQhBACgC+NRAIgFBBCABGxEFAAALIAIoAgQhAwJAQdgBEBciAkUNACABQQhqQThqIANBOGop\
AwA3AwAgAUEIakEwaiADQTBqKQMANwMAIAFBCGpBKGogA0EoaikDADcDACABQQhqQSBqIANBIGopAw\
A3AwAgAUEIakEYaiADQRhqKQMANwMAIAFBCGpBEGogA0EQaikDADcDACABQQhqQQhqIANBCGopAwA3\
AwAgASADKQMANwMIIANByABqKQMAIQ8gAykDQCEQIAFBCGpB0ABqIANB0ABqEEUgAUEIakHIAGogDz\
cDACABIBA3A0ggAiABQQhqQdgBEDoaQRQhAwwRC0HYAUEIQQAoAvjUQCIBQQQgARsRBQAACyACKAIE\
IQMCQEHYARAXIgJFDQAgAUEIakE4aiADQThqKQMANwMAIAFBCGpBMGogA0EwaikDADcDACABQQhqQS\
hqIANBKGopAwA3AwAgAUEIakEgaiADQSBqKQMANwMAIAFBCGpBGGogA0EYaikDADcDACABQQhqQRBq\
IANBEGopAwA3AwAgAUEIakEIaiADQQhqKQMANwMAIAEgAykDADcDCCADQcgAaikDACEPIAMpA0AhEC\
ABQQhqQdAAaiADQdAAahBFIAFBCGpByABqIA83AwAgASAQNwNIIAIgAUEIakHYARA6GkETIQMMEAtB\
2AFBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBB8AAQFyICRQ0AIAFBCGpBIGogA0EgaikDAD\
cDACABQQhqQRhqIANBGGopAwA3AwAgAUEIakEQaiADQRBqKQMANwMAIAEgAykDCDcDECADKQMAIQ8g\
AUEIakEoaiADQShqEDkgASAPNwMIIAIgAUEIakHwABA6GkESIQMMDwtB8ABBCEEAKAL41EAiAUEEIA\
EbEQUAAAsgAigCBCEDAkBB8AAQFyICRQ0AIAFBCGpBIGogA0EgaikDADcDACABQQhqQRhqIANBGGop\
AwA3AwAgAUEIakEQaiADQRBqKQMANwMAIAEgAykDCDcDECADKQMAIQ8gAUEIakEoaiADQShqEDkgAS\
APNwMIIAIgAUEIakHwABA6GkERIQMMDgtB8ABBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBB\
mAIQFyICRQ0AIAFBCGogA0HIARA6GiABQQhqQcgBaiADQcgBahBIIAIgAUEIakGYAhA6GkEQIQMMDQ\
tBmAJBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBBuAIQFyICRQ0AIAFBCGogA0HIARA6GiAB\
QQhqQcgBaiADQcgBahBJIAIgAUEIakG4AhA6GkEPIQMMDAtBuAJBCEEAKAL41EAiAUEEIAEbEQUAAA\
sgAigCBCEDAkBB2AIQFyICRQ0AIAFBCGogA0HIARA6GiABQQhqQcgBaiADQcgBahBGIAIgAUEIakHY\
AhA6GkEOIQMMCwtB2AJBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBB4AIQFyICRQ0AIAFBCG\
ogA0HIARA6GiABQQhqQcgBaiADQcgBahBKIAIgAUEIakHgAhA6GkENIQMMCgtB4AJBCEEAKAL41EAi\
AUEEIAEbEQUAAAsgAigCBCEDAkBB6AAQFyICRQ0AIAFBCGpBGGogA0EYaigCADYCACABQQhqQRBqIA\
NBEGopAwA3AwAgASADKQMINwMQIAMpAwAhDyABQQhqQSBqIANBIGoQOSABIA83AwggAiABQQhqQegA\
EDoaQQwhAwwJC0HoAEEIQQAoAvjUQCIBQQQgARsRBQAACyACKAIEIQMCQEHoABAXIgJFDQAgAUEIak\
EYaiADQRhqKAIANgIAIAFBCGpBEGogA0EQaikDADcDACABIAMpAwg3AxAgAykDACEPIAFBCGpBIGog\
A0EgahA5IAEgDzcDCCACIAFBCGpB6AAQOhpBCyEDDAgLQegAQQhBACgC+NRAIgFBBCABGxEFAAALIA\
IoAgQhAwJAQeAAEBciAkUNACABQQhqQRBqIANBEGopAwA3AwAgASADKQMINwMQIAMpAwAhDyABQQhq\
QRhqIANBGGoQOSABIA83AwggAiABQQhqQeAAEDoaQQohAwwHC0HgAEEIQQAoAvjUQCIBQQQgARsRBQ\
AACyACKAIEIQMCQEHgABAXIgJFDQAgAUEIakEQaiADQRBqKQMANwMAIAEgAykDCDcDECADKQMAIQ8g\
AUEIakEYaiADQRhqEDkgASAPNwMIIAIgAUEIakHgABA6GkEJIQMMBgtB4ABBCEEAKAL41EAiAUEEIA\
EbEQUAAAsgAigCBCEDAkBBmAIQFyICRQ0AIAFBCGogA0HIARA6GiABQQhqQcgBaiADQcgBahBIIAIg\
AUEIakGYAhA6GkEIIQMMBQtBmAJBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBBuAIQFyICRQ\
0AIAFBCGogA0HIARA6GiABQQhqQcgBaiADQcgBahBJIAIgAUEIakG4AhA6GkEHIQMMBAtBuAJBCEEA\
KAL41EAiAUEEIAEbEQUAAAsgAigCBCEDAkBB2AIQFyICRQ0AIAFBCGogA0HIARA6GiABQQhqQcgBai\
ADQcgBahBGIAIgAUEIakHYAhA6GkEGIQMMAwtB2AJBCEEAKAL41EAiAUEEIAEbEQUAAAsgAigCBCED\
AkBB4AIQFyICRQ0AIAFBCGogA0HIARA6GiABQQhqQcgBaiADQcgBahBKIAIgAUEIakHgAhA6GkEFIQ\
MMAgtB4AJBCEEAKAL41EAiAUEEIAEbEQUAAAsgASAHNgKYASABIAQ6AHIgASAFOgBxIAEgBjoAcCAB\
IA83AwggAiABQQhqQfgOEDoaQQQhAwsgACAAKAIAQX9qNgIAAkBBDBAXIgBFDQAgACACNgIIIAAgAz\
YCBCAAQQA2AgAgAUGgD2okACAADwtBDEEEQQAoAvjUQCIBQQQgARsRBQAAC6MSARp/IwBBwABrIQMg\
ACgCACgCACIEIAQpAwAgAq18NwMAAkAgAkEGdCICRQ0AIAEgAmohBSAEKAIUIQYgBCgCECEHIAQoAg\
whAiAEKAIIIQgDQCADQRhqIgBCADcDACADQSBqIglCADcDACADQThqQgA3AwAgA0EwakIANwMAIANB\
KGpCADcDACADQQhqIgogAUEIaikAADcDACADQRBqIgsgAUEQaikAADcDACAAIAFBGGooAAAiDDYCAC\
AJIAFBIGooAAAiDTYCACADIAEpAAA3AwAgAyABQRxqKAAAIg42AhwgAyABQSRqKAAAIg82AiQgCigC\
ACIQIAwgAUEoaigAACIRIAFBOGooAAAiEiABQTxqKAAAIhMgAygCDCIUIA4gAUEsaigAACIVIA4gFC\
ATIBUgEiARIAwgByAQaiAGIAMoAgQiFmogCCACIAdxaiAGIAJBf3NxaiADKAIAIhdqQfjIqrt9akEH\
dyACaiIAIAJxaiAHIABBf3NxakHW7p7GfmpBDHcgAGoiCSAAcWogAiAJQX9zcWpB2+GBoQJqQRF3IA\
lqIgpqIAMoAhQiGCAJaiAAIAsoAgAiGWogAiAUaiAKIAlxaiAAIApBf3NxakHunfeNfGpBFncgCmoi\
ACAKcWogCSAAQX9zcWpBr5/wq39qQQd3IABqIgkgAHFqIAogCUF/c3FqQaqMn7wEakEMdyAJaiIKIA\
lxaiAAIApBf3NxakGTjMHBempBEXcgCmoiC2ogDyAKaiANIAlqIA4gAGogCyAKcWogCSALQX9zcWpB\
gaqaampBFncgC2oiACALcWogCiAAQX9zcWpB2LGCzAZqQQd3IABqIgkgAHFqIAsgCUF/c3FqQa/vk9\
p4akEMdyAJaiIKIAlxaiAAIApBf3NxakGxt31qQRF3IApqIgtqIAFBNGooAAAiGiAKaiABQTBqKAAA\
IhsgCWogFSAAaiALIApxaiAJIAtBf3NxakG+r/PKeGpBFncgC2oiACALcWogCiAAQX9zcWpBoqLA3A\
ZqQQd3IABqIgkgAHFqIAsgCUF/c3FqQZPj4WxqQQx3IAlqIgogCXFqIAAgCkF/cyIccWpBjofls3pq\
QRF3IApqIgtqIBYgCWogCyAccWogEyAAaiALIApxaiAJIAtBf3MiHHFqQaGQ0M0EakEWdyALaiIAIA\
pxakHiyviwf2pBBXcgAGoiCSAAQX9zcWogDCAKaiAAIBxxaiAJIAtxakHA5oKCfGpBCXcgCWoiCiAA\
cWpB0bT5sgJqQQ53IApqIgtqIBggCWogCyAKQX9zcWogFyAAaiAKIAlBf3NxaiALIAlxakGqj9vNfm\
pBFHcgC2oiACAKcWpB3aC8sX1qQQV3IABqIgkgAEF/c3FqIBEgCmogACALQX9zcWogCSALcWpB06iQ\
EmpBCXcgCWoiCiAAcWpBgc2HxX1qQQ53IApqIgtqIA8gCWogCyAKQX9zcWogGSAAaiAKIAlBf3Nxai\
ALIAlxakHI98++fmpBFHcgC2oiACAKcWpB5puHjwJqQQV3IABqIgkgAEF/c3FqIBIgCmogACALQX9z\
cWogCSALcWpB1o/cmXxqQQl3IAlqIgogAHFqQYeb1KZ/akEOdyAKaiILaiAaIAlqIAsgCkF/c3FqIA\
0gAGogCiAJQX9zcWogCyAJcWpB7anoqgRqQRR3IAtqIgAgCnFqQYXSj896akEFdyAAaiIJIABBf3Nx\
aiAQIApqIAAgC0F/c3FqIAkgC3FqQfjHvmdqQQl3IAlqIgogAHFqQdmFvLsGakEOdyAKaiILaiANIA\
pqIBggCWogGyAAaiAKIAlBf3NxaiALIAlxakGKmanpeGpBFHcgC2oiACALcyILIApzakHC8mhqQQR3\
IABqIgkgC3NqQYHtx7t4akELdyAJaiIKIAlzIhwgAHNqQaLC9ewGakEQdyAKaiILaiAZIApqIBYgCW\
ogEiAAaiALIBxzakGM8JRvakEXdyALaiIJIAtzIgAgCnNqQcTU+6V6akEEdyAJaiIKIABzakGpn/ve\
BGpBC3cgCmoiCyAKcyISIAlzakHglu21f2pBEHcgC2oiAGogGiAKaiAAIAtzIBEgCWogEiAAc2pB8P\
j+9XtqQRd3IABqIglzakHG/e3EAmpBBHcgCWoiCiAJcyAXIAtqIAkgAHMgCnNqQfrPhNV+akELdyAK\
aiIAc2pBheG8p31qQRB3IABqIgtqIA8gCmogCyAAcyAMIAlqIAAgCnMgC3NqQYW6oCRqQRd3IAtqIg\
lzakG5oNPOfWpBBHcgCWoiCiAJcyAbIABqIAkgC3MgCnNqQeWz7rZ+akELdyAKaiIAc2pB+PmJ/QFq\
QRB3IABqIgtqIA4gAGogFyAKaiAQIAlqIAAgCnMgC3NqQeWssaV8akEXdyALaiIJIABBf3NyIAtzak\
HExKShf2pBBncgCWoiACALQX9zciAJc2pBl/+rmQRqQQp3IABqIgogCUF/c3IgAHNqQafH0Nx6akEP\
dyAKaiILaiAUIApqIBsgAGogGCAJaiALIABBf3NyIApzakG5wM5kakEVdyALaiIAIApBf3NyIAtzak\
HDs+2qBmpBBncgAGoiCSALQX9zciAAc2pBkpmz+HhqQQp3IAlqIgogAEF/c3IgCXNqQf3ov39qQQ93\
IApqIgtqIBMgCmogDSAJaiAWIABqIAsgCUF/c3IgCnNqQdG7kax4akEVdyALaiIAIApBf3NyIAtzak\
HP/KH9BmpBBncgAGoiCSALQX9zciAAc2pB4M2zcWpBCncgCWoiCiAAQX9zciAJc2pBlIaFmHpqQQ93\
IApqIgtqIBUgCmogGSAJaiAaIABqIAsgCUF/c3IgCnNqQaGjoPAEakEVdyALaiIAIApBf3NyIAtzak\
GC/c26f2pBBncgAGoiCSALQX9zciAAc2pBteTr6XtqQQp3IAlqIgogAEF/c3IgCXNqQbul39YCakEP\
dyAKaiILIAJqIA8gAGogCyAJQX9zciAKc2pBkaeb3H5qQRV3aiECIAsgB2ohByAKIAZqIQYgCSAIai\
EIIAFBwABqIgEgBUcNAAsgBCAGNgIUIAQgBzYCECAEIAI2AgwgBCAINgIICwvtEQEYfyMAIQIgACgC\
ACIDKAIAIQQgAygCCCEFIAMoAgwhBiADKAIEIQcgAkHAAGsiAEEYaiICQgA3AwAgAEEgaiIIQgA3Aw\
AgAEE4aiIJQgA3AwAgAEEwaiIKQgA3AwAgAEEoaiILQgA3AwAgAEEIaiIMIAEpAAg3AwAgAEEQaiIN\
IAEpABA3AwAgAiABKAAYIg42AgAgCCABKAAgIg82AgAgACABKQAANwMAIAAgASgAHCIQNgIcIAAgAS\
gAJCIRNgIkIAsgASgAKCISNgIAIAAgASgALCILNgIsIAogASgAMCITNgIAIAAgASgANCIKNgI0IAkg\
ASgAOCIUNgIAIAAgASgAPCIJNgI8IAMgBCANKAIAIg0gDyATIAAoAgAiFSARIAogACgCBCIWIAAoAh\
QiFyAKIBEgFyAWIBMgDyANIAcgFSAEIAcgBXFqIAYgB0F/c3FqakH4yKq7fWpBB3dqIgFqIAcgACgC\
DCIYaiAFIAwoAgAiDGogBiAWaiABIAdxaiAFIAFBf3NxakHW7p7GfmpBDHcgAWoiACABcWogByAAQX\
9zcWpB2+GBoQJqQRF3IABqIgIgAHFqIAEgAkF/c3FqQe6d9418akEWdyACaiIBIAJxaiAAIAFBf3Nx\
akGvn/Crf2pBB3cgAWoiCGogECABaiAOIAJqIBcgAGogCCABcWogAiAIQX9zcWpBqoyfvARqQQx3IA\
hqIgAgCHFqIAEgAEF/c3FqQZOMwcF6akERdyAAaiIBIABxaiAIIAFBf3NxakGBqppqakEWdyABaiIC\
IAFxaiAAIAJBf3NxakHYsYLMBmpBB3cgAmoiCGogCyACaiASIAFqIBEgAGogCCACcWogASAIQX9zcW\
pBr++T2nhqQQx3IAhqIgAgCHFqIAIgAEF/c3FqQbG3fWpBEXcgAGoiASAAcWogCCABQX9zcWpBvq/z\
ynhqQRZ3IAFqIgIgAXFqIAAgAkF/c3FqQaKiwNwGakEHdyACaiIIaiAUIAFqIAogAGogCCACcWogAS\
AIQX9zcWpBk+PhbGpBDHcgCGoiACAIcWogAiAAQX9zIhlxakGOh+WzempBEXcgAGoiASAZcWogCSAC\
aiABIABxaiAIIAFBf3MiGXFqQaGQ0M0EakEWdyABaiICIABxakHiyviwf2pBBXcgAmoiCGogCyABai\
AIIAJBf3NxaiAOIABqIAIgGXFqIAggAXFqQcDmgoJ8akEJdyAIaiIAIAJxakHRtPmyAmpBDncgAGoi\
ASAAQX9zcWogFSACaiAAIAhBf3NxaiABIAhxakGqj9vNfmpBFHcgAWoiAiAAcWpB3aC8sX1qQQV3IA\
JqIghqIAkgAWogCCACQX9zcWogEiAAaiACIAFBf3NxaiAIIAFxakHTqJASakEJdyAIaiIAIAJxakGB\
zYfFfWpBDncgAGoiASAAQX9zcWogDSACaiAAIAhBf3NxaiABIAhxakHI98++fmpBFHcgAWoiAiAAcW\
pB5puHjwJqQQV3IAJqIghqIBggAWogCCACQX9zcWogFCAAaiACIAFBf3NxaiAIIAFxakHWj9yZfGpB\
CXcgCGoiACACcWpBh5vUpn9qQQ53IABqIgEgAEF/c3FqIA8gAmogACAIQX9zcWogASAIcWpB7anoqg\
RqQRR3IAFqIgIgAHFqQYXSj896akEFdyACaiIIaiATIAJqIAwgAGogAiABQX9zcWogCCABcWpB+Me+\
Z2pBCXcgCGoiACAIQX9zcWogECABaiAIIAJBf3NxaiAAIAJxakHZhby7BmpBDncgAGoiASAIcWpBip\
mp6XhqQRR3IAFqIgIgAXMiGSAAc2pBwvJoakEEdyACaiIIaiAUIAJqIAsgAWogDyAAaiAIIBlzakGB\
7ce7eGpBC3cgCGoiASAIcyIAIAJzakGiwvXsBmpBEHcgAWoiAiAAc2pBjPCUb2pBF3cgAmoiCCACcy\
IZIAFzakHE1PulempBBHcgCGoiAGogECACaiAAIAhzIA0gAWogGSAAc2pBqZ/73gRqQQt3IABqIgFz\
akHglu21f2pBEHcgAWoiAiABcyASIAhqIAEgAHMgAnNqQfD4/vV7akEXdyACaiIAc2pBxv3txAJqQQ\
R3IABqIghqIBggAmogCCAAcyAVIAFqIAAgAnMgCHNqQfrPhNV+akELdyAIaiIBc2pBheG8p31qQRB3\
IAFqIgIgAXMgDiAAaiABIAhzIAJzakGFuqAkakEXdyACaiIAc2pBuaDTzn1qQQR3IABqIghqIAwgAG\
ogEyABaiAAIAJzIAhzakHls+62fmpBC3cgCGoiASAIcyAJIAJqIAggAHMgAXNqQfj5if0BakEQdyAB\
aiIAc2pB5ayxpXxqQRd3IABqIgIgAUF/c3IgAHNqQcTEpKF/akEGdyACaiIIaiAXIAJqIBQgAGogEC\
ABaiAIIABBf3NyIAJzakGX/6uZBGpBCncgCGoiACACQX9zciAIc2pBp8fQ3HpqQQ93IABqIgEgCEF/\
c3IgAHNqQbnAzmRqQRV3IAFqIgIgAEF/c3IgAXNqQcOz7aoGakEGdyACaiIIaiAWIAJqIBIgAWogGC\
AAaiAIIAFBf3NyIAJzakGSmbP4eGpBCncgCGoiACACQX9zciAIc2pB/ei/f2pBD3cgAGoiASAIQX9z\
ciAAc2pB0buRrHhqQRV3IAFqIgIgAEF/c3IgAXNqQc/8of0GakEGdyACaiIIaiAKIAJqIA4gAWogCS\
AAaiAIIAFBf3NyIAJzakHgzbNxakEKdyAIaiIAIAJBf3NyIAhzakGUhoWYempBD3cgAGoiASAIQX9z\
ciAAc2pBoaOg8ARqQRV3IAFqIgIgAEF/c3IgAXNqQYL9zbp/akEGdyACaiIIajYCACADIAYgCyAAai\
AIIAFBf3NyIAJzakG15Ovpe2pBCncgCGoiAGo2AgwgAyAFIAwgAWogACACQX9zciAIc2pBu6Xf1gJq\
QQ93IABqIgFqNgIIIAMgASAHaiARIAJqIAEgCEF/c3IgAHNqQZGnm9x+akEVd2o2AgQLnA4CDX8Bfi\
MAQaACayIHJAACQAJAAkACQAJAAkACQAJAAkACQCABQYEISQ0AQX8gAUF/aiIIQQt2Z3ZBCnRBgAhq\
QYAIIAhB/w9LGyIIIAFLDQQgB0EIakEAQYABEDwaIAEgCGshCSAAIAhqIQEgCEEKdq0gA3whFCAIQY\
AIRw0BIAdBCGpBIGohCkHgACELIABBgAggAiADIAQgB0EIakEgEB4hCAwCCyAHQgA3A4gBAkACQCAB\
QYB4cSIKDQBBACEIQQAhCQwBCyAKQYAIRw0DIAcgADYCiAFBASEJIAdBATYCjAEgACEICyABQf8HcS\
EBAkAgBkEFdiILIAkgCSALSxtFDQAgB0EIakEYaiIJIAJBGGopAgA3AwAgB0EIakEQaiILIAJBEGop\
AgA3AwAgB0EIakEIaiIMIAJBCGopAgA3AwAgByACKQIANwMIIAdBCGogCEHAACADIARBAXIQGiAHQQ\
hqIAhBwABqQcAAIAMgBBAaIAdBCGogCEGAAWpBwAAgAyAEEBogB0EIaiAIQcABakHAACADIAQQGiAH\
QQhqIAhBgAJqQcAAIAMgBBAaIAdBCGogCEHAAmpBwAAgAyAEEBogB0EIaiAIQYADakHAACADIAQQGi\
AHQQhqIAhBwANqQcAAIAMgBBAaIAdBCGogCEGABGpBwAAgAyAEEBogB0EIaiAIQcAEakHAACADIAQQ\
GiAHQQhqIAhBgAVqQcAAIAMgBBAaIAdBCGogCEHABWpBwAAgAyAEEBogB0EIaiAIQYAGakHAACADIA\
QQGiAHQQhqIAhBwAZqQcAAIAMgBBAaIAdBCGogCEGAB2pBwAAgAyAEEBogB0EIaiAIQcAHakHAACAD\
IARBAnIQGiAFIAkpAwA3ABggBSALKQMANwAQIAUgDCkDADcACCAFIAcpAwg3AAAgBygCjAEhCQsgAU\
UNCCAHQZABakEwaiINQgA3AwAgB0GQAWpBOGoiDkIANwMAIAdBkAFqQcAAaiIPQgA3AwAgB0GQAWpB\
yABqIhBCADcDACAHQZABakHQAGoiEUIANwMAIAdBkAFqQdgAaiISQgA3AwAgB0GQAWpB4ABqIhNCAD\
cDACAHQZABakEgaiIIIAJBGGopAgA3AwAgB0GQAWpBGGoiCyACQRBqKQIANwMAIAdBkAFqQRBqIgwg\
AkEIaikCADcDACAHQgA3A7gBIAcgBDoA+gEgB0EAOwH4ASAHIAIpAgA3A5gBIAcgCa0gA3w3A5ABIA\
dBkAFqIAAgCmogARA1GiAHQQhqQRBqIAwpAwA3AwAgB0EIakEYaiALKQMANwMAIAdBCGpBIGogCCkD\
ADcDACAHQQhqQTBqIA0pAwA3AwAgB0EIakE4aiAOKQMANwMAIAdBCGpBwABqIA8pAwA3AwAgB0EIak\
HIAGogECkDADcDACAHQQhqQdAAaiARKQMANwMAIAdBCGpB2ABqIBIpAwA3AwAgB0EIakHgAGogEykD\
ADcDACAHIAcpA5gBNwMQIAcgBykDuAE3AzAgBy0A+gEhBCAHLQD5ASECIAcgBy0A+AEiAToAcCAHIA\
cpA5ABIgM3AwggByAEIAJFckECciIEOgBxIAdBgAJqQRhqIgIgCCkDADcDACAHQYACakEQaiIAIAsp\
AwA3AwAgB0GAAmpBCGoiCiAMKQMANwMAIAcgBykDmAE3A4ACIAdBgAJqIAdBMGogASADIAQQGiAJQQ\
V0IgRBIGohCCAEQWBGDQQgCCAGSw0FIAIoAgAhCCAAKAIAIQIgCigCACEBIAcoApQCIQAgBygCjAIh\
BiAHKAKEAiEKIAcoAoACIQsgBSAEaiIEIAcoApwCNgAcIAQgCDYAGCAEIAA2ABQgBCACNgAQIAQgBj\
YADCAEIAE2AAggBCAKNgAEIAQgCzYAACAJQQFqIQkMCAtBwAAhCyAHQQhqQcAAaiEKIAAgCCACIAMg\
BCAHQQhqQcAAEB4hCAsgASAJIAIgFCAEIAogCxAeIQkCQCAIQQFHDQAgBkE/TQ0FIAUgBykACDcAAC\
AFQThqIAdBCGpBOGopAAA3AAAgBUEwaiAHQQhqQTBqKQAANwAAIAVBKGogB0EIakEoaikAADcAACAF\
QSBqIAdBCGpBIGopAAA3AAAgBUEYaiAHQQhqQRhqKQAANwAAIAVBEGogB0EIakEQaikAADcAACAFQQ\
hqIAdBCGpBCGopAAA3AABBAiEJDAcLIAkgCGpBBXQiCEGBAU8NBSAHQQhqIAggAiAEIAUgBhAtIQkM\
BgsgByAAQYAIajYCCEGQksAAIAdBCGpB8IXAAEH4hsAAEEIAC0GhjcAAQSNBtIPAABBVAAtBYCAIQa\
CEwAAQTQALIAggBkGghMAAEEsAC0HAACAGQdCEwAAQSwALIAhBgAFBwITAABBLAAsgB0GgAmokACAJ\
C80OAQd/IABBeGoiASAAQXxqKAIAIgJBeHEiAGohAwJAAkAgAkEBcQ0AIAJBA3FFDQEgASgCACICIA\
BqIQACQEEAKAKc2EAgASACayIBRw0AIAMoAgRBA3FBA0cNAUEAIAA2ApTYQCADIAMoAgRBfnE2AgQg\
ASAAQQFyNgIEIAEgAGogADYCAA8LAkACQCACQYACSQ0AIAEoAhghBAJAAkAgASgCDCIFIAFHDQAgAU\
EUQRAgASgCFCIFG2ooAgAiAg0BQQAhBQwDCyABKAIIIgIgBTYCDCAFIAI2AggMAgsgAUEUaiABQRBq\
IAUbIQYDQCAGIQcCQCACIgVBFGoiBigCACICDQAgBUEQaiEGIAUoAhAhAgsgAg0ACyAHQQA2AgAMAQ\
sCQCABQQxqKAIAIgUgAUEIaigCACIGRg0AIAYgBTYCDCAFIAY2AggMAgtBAEEAKAKE1UBBfiACQQN2\
d3E2AoTVQAwBCyAERQ0AAkACQCABKAIcQQJ0QZTXwABqIgIoAgAgAUYNACAEQRBBFCAEKAIQIAFGG2\
ogBTYCACAFRQ0CDAELIAIgBTYCACAFDQBBAEEAKAKI1UBBfiABKAIcd3E2AojVQAwBCyAFIAQ2AhgC\
QCABKAIQIgJFDQAgBSACNgIQIAIgBTYCGAsgASgCFCICRQ0AIAVBFGogAjYCACACIAU2AhgLAkACQC\
ADKAIEIgJBAnFFDQAgAyACQX5xNgIEIAEgAEEBcjYCBCABIABqIAA2AgAMAQsCQAJAAkACQAJAAkAC\
QEEAKAKg2EAgA0YNAEEAKAKc2EAgA0cNAUEAIAE2ApzYQEEAQQAoApTYQCAAaiIANgKU2EAgASAAQQ\
FyNgIEIAEgAGogADYCAA8LQQAgATYCoNhAQQBBACgCmNhAIABqIgA2ApjYQCABIABBAXI2AgQgAUEA\
KAKc2EBGDQEMBQsgAkF4cSIFIABqIQAgBUGAAkkNASADKAIYIQQCQAJAIAMoAgwiBSADRw0AIANBFE\
EQIAMoAhQiBRtqKAIAIgINAUEAIQUMBAsgAygCCCICIAU2AgwgBSACNgIIDAMLIANBFGogA0EQaiAF\
GyEGA0AgBiEHAkAgAiIFQRRqIgYoAgAiAg0AIAVBEGohBiAFKAIQIQILIAINAAsgB0EANgIADAILQQ\
BBADYClNhAQQBBADYCnNhADAMLAkAgA0EMaigCACIFIANBCGooAgAiA0YNACADIAU2AgwgBSADNgII\
DAILQQBBACgChNVAQX4gAkEDdndxNgKE1UAMAQsgBEUNAAJAAkAgAygCHEECdEGU18AAaiICKAIAIA\
NGDQAgBEEQQRQgBCgCECADRhtqIAU2AgAgBUUNAgwBCyACIAU2AgAgBQ0AQQBBACgCiNVAQX4gAygC\
HHdxNgKI1UAMAQsgBSAENgIYAkAgAygCECICRQ0AIAUgAjYCECACIAU2AhgLIAMoAhQiA0UNACAFQR\
RqIAM2AgAgAyAFNgIYCyABIABBAXI2AgQgASAAaiAANgIAIAFBACgCnNhARw0BQQAgADYClNhADAIL\
QQAoArzYQCICIABPDQFBACgCoNhAIgBFDQECQEEAKAKY2EAiBUEpSQ0AQazYwAAhAQNAAkAgASgCAC\
IDIABLDQAgAyABKAIEaiAASw0CCyABKAIIIgENAAsLAkACQEEAKAK02EAiAA0AQf8fIQEMAQtBACEB\
A0AgAUEBaiEBIAAoAggiAA0ACyABQf8fIAFB/x9LGyEBC0EAIAE2AsTYQCAFIAJNDQFBAEF/NgK82E\
APCwJAAkACQCAAQYACSQ0AQR8hAwJAIABB////B0sNACAAQQYgAEEIdmciA2t2QQFxIANBAXRrQT5q\
IQMLIAFCADcCECABQRxqIAM2AgAgA0ECdEGU18AAaiECAkACQAJAAkACQAJAQQAoAojVQCIFQQEgA3\
QiBnFFDQAgAigCACIFKAIEQXhxIABHDQEgBSEDDAILQQAgBSAGcjYCiNVAIAIgATYCACABQRhqIAI2\
AgAMAwsgAEEAQRkgA0EBdmtBH3EgA0EfRht0IQIDQCAFIAJBHXZBBHFqQRBqIgYoAgAiA0UNAiACQQ\
F0IQIgAyEFIAMoAgRBeHEgAEcNAAsLIAMoAggiACABNgIMIAMgATYCCCABQRhqQQA2AgAgASADNgIM\
IAEgADYCCAwCCyAGIAE2AgAgAUEYaiAFNgIACyABIAE2AgwgASABNgIIC0EAQQAoAsTYQEF/aiIBNg\
LE2EAgAQ0DQQAoArTYQCIADQFB/x8hAQwCCyAAQQN2IgNBA3RBjNXAAGohAAJAAkBBACgChNVAIgJB\
ASADdCIDcUUNACAAKAIIIQMMAQtBACACIANyNgKE1UAgACEDCyAAIAE2AgggAyABNgIMIAEgADYCDC\
ABIAM2AggPC0EAIQEDQCABQQFqIQEgACgCCCIADQALIAFB/x8gAUH/H0sbIQELQQAgATYCxNhADwsL\
lQwBGH8jACECIAAoAgAhAyAAKAIIIQQgACgCDCEFIAAoAgQhBiACQcAAayICQRhqIgdCADcDACACQS\
BqIghCADcDACACQThqIglCADcDACACQTBqIgpCADcDACACQShqIgtCADcDACACQQhqIgwgASkACDcD\
ACACQRBqIg0gASkAEDcDACAHIAEoABgiDjYCACAIIAEoACAiDzYCACACIAEpAAA3AwAgAiABKAAcIh\
A2AhwgAiABKAAkIhE2AiQgCyABKAAoIhI2AgAgAiABKAAsIgs2AiwgCiABKAAwIhM2AgAgAiABKAA0\
Igo2AjQgCSABKAA4IhQ2AgAgAiABKAA8IhU2AjwgACADIBMgCyASIBEgDyAQIA4gBiAEIAUgBiADIA\
YgBHFqIAUgBkF/c3FqIAIoAgAiFmpBA3ciAXFqIAQgAUF/c3FqIAIoAgQiF2pBB3ciByABcWogBiAH\
QX9zcWogDCgCACIMakELdyIIIAdxaiABIAhBf3NxaiACKAIMIhhqQRN3IgkgCHEgAWogByAJQX9zcW\
ogDSgCACINakEDdyIBIAlxIAdqIAggAUF/c3FqIAIoAhQiGWpBB3ciAiABcSAIaiAJIAJBf3NxampB\
C3ciByACcSAJaiABIAdBf3NxampBE3ciCCAHcSABaiACIAhBf3NxampBA3ciASAIcSACaiAHIAFBf3\
NxampBB3ciAiABcSAHaiAIIAJBf3NxampBC3ciByACcSAIaiABIAdBf3NxampBE3ciCCAHcSABaiAC\
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\
IRQgAS0AaiEIIAJB4ABqIAQpAhg3AwAgAkHYAGogFDcDACACQdAAaiATNwMAIAJByABqIBI3AwBCAC\
ESIAJCADcDACAIQQRyIQkgAkEIaiEEDAELIAJBEGogAUEQaikDADcDACACQRhqIAFBGGopAwA3AwAg\
AkEgaiABQSBqKQMANwMAIAJBMGogAUEwaikDADcDACACQThqIAFBOGopAwA3AwAgAkHAAGogAUHAAG\
opAwA3AwAgAkHIAGogAUHIAGopAwA3AwAgAkHQAGogAUHQAGopAwA3AwAgAkHYAGogAUHYAGopAwA3\
AwAgAkHgAGogAUHgAGopAwA3AwAgAiABKQMINwMIIAIgASkDKDcDKCABLQBqIQggAiABKQMAIhI3Aw\
AgCCAERXJBAnIhCSACQQhqIQQgAyEGCyACIAk6AGkgAiAFOgBoAkACQCAGRQ0AIAFB8ABqIQogAkEo\
aiEHQQEgBmshCyAIQQRyIQggBkEFdCABakH0AGohASAGQX9qIANPIQwDQCAMDQIgAkHwAGpBGGoiBi\
AEQRhqIg0pAgA3AwAgAkHwAGpBEGoiDiAEQRBqIg8pAgA3AwAgAkHwAGpBCGoiECAEQQhqIhEpAgA3\
AwAgAiAEKQIANwNwIAJB8ABqIAcgBSASIAkQGiAQKQMAIRMgDikDACEUIAYpAwAhFSACKQNwIRYgB0\
EYaiABQRhqKQIANwIAIAdBEGogAUEQaikCADcCACAHQQhqIAFBCGopAgA3AgAgByABKQIANwIAIAQg\
CikDADcDACARIApBCGopAwA3AwAgDyAKQRBqKQMANwMAIA0gCkEYaikDADcDAEIAIRIgAkIANwMAIA\
IgFTcDYCACIBQ3A1ggAiATNwNQIAIgFjcDSCACIAg6AGlBwAAhBSACQcAAOgBoIAFBYGohASAIIQkg\
C0EBaiILQQFHDQALCyAAIAJB8AAQOhoMAgtBACALayADQdCFwAAQTwALIAAgASkDCDcDCCAAIAEpAy\
g3AyggAEEQaiABQRBqKQMANwMAIABBGGogAUEYaikDADcDACAAQSBqIAFBIGopAwA3AwAgAEEwaiAB\
QTBqKQMANwMAIABBOGogAUE4aikDADcDACAAQcAAaiABQcAAaikDADcDACAAQcgAaiABQcgAaikDAD\
cDACAAQdAAaiABQdAAaikDADcDACAAQdgAaiABQdgAaikDADcDACAAQeAAaiABQeAAaikDADcDACAB\
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\
AwAgA0HIAGogA0GoAWpBLGopAgA3AwAgA0HAAGogA0GoAWpBJGopAgA3AwAgA0E4aiADQagBakEcai\
kCADcDACADQTBqIANBqAFqQRRqKQIANwMAIANBKGogA0GoAWpBDGopAgA3AwAgAyADKQKsATcDICAD\
IAY3A1ggA0EIaiADQSBqQQEQFQsgAUHAAGpBADoAACACIAMoAggiAUEYdCABQQh0QYCA/AdxciABQQ\
h2QYD+A3EgAUEYdnJyNgAAIAIgAygCDCIBQRh0IAFBCHRBgID8B3FyIAFBCHZBgP4DcSABQRh2cnI2\
AAQgAiADKAIQIgFBGHQgAUEIdEGAgPwHcXIgAUEIdkGA/gNxIAFBGHZycjYACCACIAMoAhQiAUEYdC\
ABQQh0QYCA/AdxciABQQh2QYD+A3EgAUEYdnJyNgAMIAIgAygCGCIBQRh0IAFBCHRBgID8B3FyIAFB\
CHZBgP4DcSABQRh2cnI2ABAgA0HwAWokAAuyBgEVfyMAQbABayICJAACQAJAAkAgACgCkAEiAyABe6\
ciBE0NACAAQfAAaiEFIAJBKGohBiACQQhqIQcgAkHwAGpBIGohCCADQX9qIQkgA0EFdCAAakHUAGoh\
CiADQX5qQTdJIQsDQCAAIAk2ApABIAlFDQIgACAJQX9qIgw2ApABIAAtAGohDSACQfAAakEYaiIDIA\
pBGGoiDikAADcDACACQfAAakEQaiIPIApBEGoiECkAADcDACACQfAAakEIaiIRIApBCGoiEikAADcD\
ACAIIApBIGopAAA3AAAgCEEIaiAKQShqKQAANwAAIAhBEGogCkEwaikAADcAACAIQRhqIApBOGopAA\
A3AAAgByAFKQMANwMAIAdBCGogBUEIaiITKQMANwMAIAdBEGogBUEQaiIUKQMANwMAIAdBGGogBUEY\
aiIVKQMANwMAIAIgCikAADcDcCAGQThqIAJB8ABqQThqKQMANwAAIAZBMGogAkHwAGpBMGopAwA3AA\
AgBkEoaiACQfAAakEoaikDADcAACAGQSBqIAgpAwA3AAAgBkEYaiADKQMANwAAIAZBEGogDykDADcA\
ACAGQQhqIBEpAwA3AAAgBiACKQNwNwAAIAJBwAA6AGggAiANQQRyIg06AGkgAkIANwMAIAMgFSkCAD\
cDACAPIBQpAgA3AwAgESATKQIANwMAIAIgBSkCADcDcCACQfAAaiAGQcAAQgAgDRAaIAMoAgAhAyAP\
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\
QQhqIA4pAwA3AAAgByAGKQMQNwAAIANBBGohAyALIAFBIGoiAUcNAAsgBigCCCEHCwJAAkACQAJAIA\
lFDQAgB0EFdCICIAVLDQEgBSACayIBQR9NDQIgCUEgRw0DIAQgAmoiAiAAIAhqIgEpAAA3AAAgAkEY\
aiABQRhqKQAANwAAIAJBEGogAUEQaikAADcAACACQQhqIAFBCGopAAA3AAAgB0EBaiEHCyAGQTBqJA\
AgBw8LIAIgBUGwhMAAEEwAC0EgIAFBsITAABBLAAtBICAJQeSLwAAQTgALgQQCA38CfiMAQfABayID\
JAAgACkDACEGIAEgAUHAAGotAAAiBGoiBUGAAToAACADQQhqQRBqIABBGGooAgA2AgAgA0EQaiAAQR\
BqKQIANwMAIAMgACkCCDcDCCAGQgmGIQYgBK1CA4YhBwJAIARBP3MiAEUNACAFQQFqQQAgABA8Ggsg\
BiAHhCEGAkACQCAEQThxQThGDQAgAUE4aiAGNwAAIANBCGogARATDAELIANBCGogARATIANB4ABqQQ\
xqQgA3AgAgA0HgAGpBFGpCADcCACADQeAAakEcakIANwIAIANB4ABqQSRqQgA3AgAgA0HgAGpBLGpC\
ADcCACADQeAAakE0akIANwIAIANBnAFqQgA3AgAgA0IANwJkIANBwAA2AmAgA0GoAWogA0HgAGpBxA\
AQOhogA0HQAGogA0GoAWpBNGopAgA3AwAgA0HIAGogA0GoAWpBLGopAgA3AwAgA0HAAGogA0GoAWpB\
JGopAgA3AwAgA0E4aiADQagBakEcaikCADcDACADQTBqIANBqAFqQRRqKQIANwMAIANBKGogA0GoAW\
pBDGopAgA3AwAgAyADKQKsATcDICADIAY3A1ggA0EIaiADQSBqEBMLIAIgAygCCDYAACACIAMpAgw3\
AAQgAiADKQIUNwAMIAFBwABqQQA6AAAgA0HwAWokAAvwAwIDfwJ+IwBB8AFrIgMkACABQcAAai0AAC\
EEIAApAwAhBiADQRBqIABBEGopAgA3AwAgAyAAKQIINwMIIAEgBGoiAEGAAToAACAGQgmGIQYgBK1C\
A4YhByADIANBCGo2AhwCQCAEQT9zIgVFDQAgAEEBakEAIAUQPBoLIAcgBoQhBgJAAkAgBEE4cUE4Rg\
0AIAFBOGogBjcAACADQRxqIAEQHQwBCyADQRxqIAEQHSADQeAAakEMakIANwIAIANB4ABqQRRqQgA3\
AgAgA0HgAGpBHGpCADcCACADQeAAakEkakIANwIAIANB4ABqQSxqQgA3AgAgA0HgAGpBNGpCADcCAC\
ADQZwBakIANwIAIANCADcCZCADQcAANgJgIANBqAFqIANB4ABqQcQAEDoaIANB0ABqIANBqAFqQTRq\
KQIANwMAIANByABqIANBqAFqQSxqKQIANwMAIANBwABqIANBqAFqQSRqKQIANwMAIANBOGogA0GoAW\
pBHGopAgA3AwAgA0EwaiADQagBakEUaikCADcDACADQShqIANBqAFqQQxqKQIANwMAIAMgAykCrAE3\
AyAgAyAGNwNYIANBHGogA0EgahAdCyABQcAAakEAOgAAIAIgAykDCDcAACACIAMpAxA3AAggA0HwAW\
okAAvZAwIDfwJ+IwBB4AFrIgMkACAAKQMAIQYgASABQcAAai0AACIEaiIFQYABOgAAIANBCGogAEEQ\
aikCADcDACADIAApAgg3AwAgBkIJhiEGIAStQgOGIQcCQCAEQT9zIgBFDQAgBUEBakEAIAAQPBoLIA\
cgBoQhBgJAAkAgBEE4cUE4Rg0AIAFBOGogBjcAACADIAEQIAwBCyADIAEQICADQdAAakEMakIANwIA\
IANB0ABqQRRqQgA3AgAgA0HQAGpBHGpCADcCACADQdAAakEkakIANwIAIANB0ABqQSxqQgA3AgAgA0\
HQAGpBNGpCADcCACADQYwBakIANwIAIANCADcCVCADQcAANgJQIANBmAFqIANB0ABqQcQAEDoaIANB\
wABqIANBmAFqQTRqKQIANwMAIANBOGogA0GYAWpBLGopAgA3AwAgA0EwaiADQZgBakEkaikCADcDAC\
ADQShqIANBmAFqQRxqKQIANwMAIANBIGogA0GYAWpBFGopAgA3AwAgA0EYaiADQZgBakEMaikCADcD\
ACADIAMpApwBNwMQIAMgBjcDSCADIANBEGoQIAsgAiADKQMANwAAIAIgAykDCDcACCABQcAAakEAOg\
AAIANB4AFqJAAL1AMCBH8CfiMAQdABayIDJAAgASABQcAAai0AACIEaiIFQQE6AAAgACkDAEIJhiEH\
IAStQgOGIQgCQCAEQT9zIgZFDQAgBUEBakEAIAYQPBoLIAcgCIQhBwJAAkAgBEE4cUE4Rg0AIAFBOG\
ogBzcAACAAQQhqIAFBARAYDAELIABBCGoiBCABQQEQGCADQcAAakEMakIANwIAIANBwABqQRRqQgA3\
AgAgA0HAAGpBHGpCADcCACADQcAAakEkakIANwIAIANBwABqQSxqQgA3AgAgA0HAAGpBNGpCADcCAC\
ADQfwAakIANwIAIANCADcCRCADQcAANgJAIANBiAFqIANBwABqQcQAEDoaIANBMGogA0GIAWpBNGop\
AgA3AwAgA0EoaiADQYgBakEsaikCADcDACADQSBqIANBiAFqQSRqKQIANwMAIANBGGogA0GIAWpBHG\
opAgA3AwAgA0EQaiADQYgBakEUaikCADcDACADQQhqIANBiAFqQQxqKQIANwMAIAMgAykCjAE3AwAg\
AyAHNwM4IAQgA0EBEBgLIAFBwABqQQA6AAAgAiAAKQMINwAAIAIgAEEQaikDADcACCACIABBGGopAw\
A3ABAgA0HQAWokAAuJAwEFfwJAAkACQCABQQlJDQBBACECQc3/eyABQRAgAUEQSxsiAWsgAE0NASAB\
QRAgAEELakF4cSAAQQtJGyIDakEMahAXIgBFDQEgAEF4aiECAkACQCABQX9qIgQgAHENACACIQEMAQ\
sgAEF8aiIFKAIAIgZBeHEgBCAAakEAIAFrcUF4aiIAQQAgASAAIAJrQRBLG2oiASACayIAayEEAkAg\
BkEDcUUNACABIAEoAgRBAXEgBHJBAnI2AgQgBCABakEEaiIEIAQoAgBBAXI2AgAgBSAFKAIAQQFxIA\
ByQQJyNgIAIAAgAmpBBGoiBCAEKAIAQQFyNgIAIAIgABAhDAELIAIoAgAhAiABIAQ2AgQgASACIABq\
NgIACyABKAIEIgBBA3FFDQIgAEF4cSICIANBEGpNDQIgASAAQQFxIANyQQJyNgIEIAEgA2oiACACIA\
NrIgJBA3I2AgQgACACQQRyaiIDIAMoAgBBAXI2AgAgACACECEMAgsgABAXIQILIAIPCyABQQhqC5cD\
AQV/IwBBkARrIgMkACAAQcgBaiEEAkACQAJAAkACQCAAQfACai0AACIFRQ0AQagBIAVrIgYgAksNAS\
ABIAQgBWogBhA6IAZqIQEgAiAGayECCyACIAJBqAFuIgVBqAFsIgdJDQEgAiAHayEGAkAgBUGoAWwi\
AkUNACABIQUDQCADQeACaiAAQagBEDoaIAAQJSAFIANB4AJqQagBEDpBqAFqIQUgAkHYfmoiAg0ACw\
sCQCAGDQBBACEGDAQLIANBADYCsAEgA0GwAWpBBHJBAEGoARA8GiADQagBNgKwASADQeACaiADQbAB\
akGsARA6GiADQQhqIANB4AJqQQRyQagBEDoaIANB4AJqIABBqAEQOhogABAlIANBCGogA0HgAmpBqA\
EQOhogBkGpAU8NAiABIAdqIANBCGogBhA6GiAEIANBCGpBqAEQOhoMAwsgASAEIAVqIAIQOhogBSAC\
aiEGDAILQaGNwABBI0HEjcAAEFUACyAGQagBQcSMwAAQSwALIABB8AJqIAY6AAAgA0GQBGokAAuXAw\
EFfyMAQbADayIDJAAgAEHIAWohBAJAAkACQAJAAkAgAEHQAmotAAAiBUUNAEGIASAFayIGIAJLDQEg\
ASAEIAVqIAYQOiAGaiEBIAIgBmshAgsgAiACQYgBbiIFQYgBbCIHSQ0BIAIgB2shBgJAIAVBiAFsIg\
JFDQAgASEFA0AgA0GgAmogAEGIARA6GiAAECUgBSADQaACakGIARA6QYgBaiEFIAJB+H5qIgINAAsL\
AkAgBg0AQQAhBgwECyADQQA2ApABIANBkAFqQQRyQQBBiAEQPBogA0GIATYCkAEgA0GgAmogA0GQAW\
pBjAEQOhogA0EIaiADQaACakEEckGIARA6GiADQaACaiAAQYgBEDoaIAAQJSADQQhqIANBoAJqQYgB\
EDoaIAZBiQFPDQIgASAHaiADQQhqIAYQOhogBCADQQhqQYgBEDoaDAMLIAEgBCAFaiACEDoaIAUgAm\
ohBgwCC0GhjcAAQSNBxI3AABBVAAsgBkGIAUHEjMAAEEsACyAAQdACaiAGOgAAIANBsANqJAALggMB\
A38CQAJAAkACQCAALQBoIgNFDQACQCADQcEATw0AIAAgA2pBKGogASACQcAAIANrIgMgAyACSxsiAx\
A6GiAAIAAtAGggA2oiBDoAaCABIANqIQECQCACIANrIgINAEEAIQIMAwsgAEEIaiAAQShqIgRBwAAg\
ACkDACAALQBqIABB6QBqIgMtAABFchAaIARBAEHBABA8GiADIAMtAABBAWo6AAAMAQsgA0HAAEGQhM\
AAEEwACwJAIAJBwABLDQAgAkHAACACQcAASRshAkEAIQMMAgsgAEEIaiEFIABB6QBqIgMtAAAhBANA\
IAUgAUHAACAAKQMAIAAtAGogBEH/AXFFchAaIAMgAy0AAEEBaiIEOgAAIAFBwABqIQEgAkFAaiICQc\
AASw0ACyAALQBoIQQLIARB/wFxIgNBwQBPDQEgAkHAACADayIEIAQgAksbIQILIAAgA2pBKGogASAC\
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\
IAJBGGoQLCEBIAJBMGokACABC3QBAn8jAEGQAmsiAiQAQQAhAyACQQA2AgADQCACIANqQQRqIAEgA2\
ooAAA2AgAgA0EEaiIDQYABRw0ACyACQYABNgIAIAJBiAFqIAJBhAEQOhogACACQYgBakEEckGAARA6\
IAEtAIABOgCAASACQZACaiQAC3QBAn8jAEGgAmsiAiQAQQAhAyACQQA2AgADQCACIANqQQRqIAEgA2\
ooAAA2AgAgA0EEaiIDQYgBRw0ACyACQYgBNgIAIAJBkAFqIAJBjAEQOhogACACQZABakEEckGIARA6\
IAEtAIgBOgCIASACQaACaiQAC3QBAn8jAEHgAmsiAiQAQQAhAyACQQA2AgADQCACIANqQQRqIAEgA2\
ooAAA2AgAgA0EEaiIDQagBRw0ACyACQagBNgIAIAJBsAFqIAJBrAEQOhogACACQbABakEEckGoARA6\
IAEtAKgBOgCoASACQeACaiQAC3IBAn8jAEGgAWsiAiQAQQAhAyACQQA2AgADQCACIANqQQRqIAEgA2\
ooAAA2AgAgA0EEaiIDQcgARw0ACyACQcgANgIAIAJB0ABqIAJBzAAQOhogACACQdAAakEEckHIABA6\
IAEtAEg6AEggAkGgAWokAAtyAQJ/IwBB4AFrIgIkAEEAIQMgAkEANgIAA0AgAiADakEEaiABIANqKA\
AANgIAIANBBGoiA0HoAEcNAAsgAkHoADYCACACQfAAaiACQewAEDoaIAAgAkHwAGpBBHJB6AAQOiAB\
LQBoOgBoIAJB4AFqJAALdAECfyMAQbACayICJABBACEDIAJBADYCAANAIAIgA2pBBGogASADaigAAD\
YCACADQQRqIgNBkAFHDQALIAJBkAE2AgAgAkGYAWogAkGUARA6GiAAIAJBmAFqQQRyQZABEDogAS0A\
kAE6AJABIAJBsAJqJAALbAEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQ\
M2AgAgA0ICNwIMIANByIrAADYCCCADQQM2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EI\
aiACEFkAC2wBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEDNgIAIANCAj\
cCDCADQaiKwAA2AgggA0EDNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhBZAAts\
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\
NEJMQUtFMlNCTEFLRTNLRUNDQUstMjI0S0VDQ0FLLTI1NktFQ0NBSy0zODRLRUNDQUstNTEyTUQ0TU\
Q1UklQRU1ELTE2MFNIQS0xU0hBLTIyNFNIQS0yNTZTSEEtMzg0U0hBLTUxMlRJR0VSdW5zdXBwb3J0\
ZWQgYWxnb3JpdGhtbm9uLWRlZmF1bHQgbGVuZ3RoIHNwZWNpZmllZCBmb3Igbm9uLWV4dGVuZGFibG\
UgYWxnb3JpdGhtbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc2NhcGFjaXR5IG92ZXJmbG93AOYA\
EAAcAAAAMgIAAAUAAABBcnJheVZlYzogY2FwYWNpdHkgZXhjZWVkZWQgaW4gZXh0ZW5kL2Zyb21faX\
Rlcn4vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYXJyYXl2\
ZWMtMC43LjIvc3JjL2FycmF5dmVjLnJzAFMBEABQAAAAAQQAAAUAAABUBhAATQAAAAEGAAAJAAAAfi\
8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9ibGFrZTMtMS4z\
LjAvc3JjL2xpYi5ycwAAAMQBEABJAAAAuQEAAAkAAADEARAASQAAAF8CAAAKAAAAxAEQAEkAAACNAg\
AACQAAAMQBEABJAAAA3QIAAAoAAADEARAASQAAANYCAAAJAAAAxAEQAEkAAAABAwAAGQAAAMQBEABJ\
AAAAAwMAAAkAAADEARAASQAAAAMDAAA4AAAAxAEQAEkAAAD4AwAAMgAAAMQBEABJAAAAqgQAABYAAA\
DEARAASQAAALwEAAAWAAAAxAEQAEkAAADtBAAAEgAAAMQBEABJAAAA9wQAABIAAADEARAASQAAAGkF\
AAAhAAAAEQAAAAQAAAAEAAAAEgAAABEAAAAgAAAAAQAAABMAAAARAAAABAAAAAQAAAASAAAAfi8uY2\
FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9hcnJheXZlYy0wLjcu\
Mi9zcmMvYXJyYXl2ZWNfaW1wbC5ycwAAACADEABVAAAAJwAAACAAAABDYXBhY2l0eUVycm9yAAAAiA\
MQAA0AAABpbnN1ZmZpY2llbnQgY2FwYWNpdHkAAACgAxAAFQAAABEAAAAAAAAAAQAAABQAAABpbmRl\
eCBvdXQgb2YgYm91bmRzOiB0aGUgbGVuIGlzICBidXQgdGhlIGluZGV4IGlzIAAA0AMQACAAAADwAx\
AAEgAAADogAACgCBAAAAAAABQEEAACAAAAKTAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1\
MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0ND\
Q1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3\
NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5cmFuZ2Ugc3\
RhcnQgaW5kZXggIG91dCBvZiByYW5nZSBmb3Igc2xpY2Ugb2YgbGVuZ3RoIAAAAPEEEAASAAAAAwUQ\
ACIAAAByYW5nZSBlbmQgaW5kZXggOAUQABAAAAADBRAAIgAAAHNsaWNlIGluZGV4IHN0YXJ0cyBhdC\
AgYnV0IGVuZHMgYXQgAFgFEAAWAAAAbgUQAA0AAABzb3VyY2Ugc2xpY2UgbGVuZ3RoICgpIGRvZXMg\
bm90IG1hdGNoIGRlc3RpbmF0aW9uIHNsaWNlIGxlbmd0aCAojAUQABUAAAChBRAAKwAAACgEEAABAA\
AAVAYQAE0AAAAQDAAADQAAAH4vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5\
ZGI5ZWM4MjMvYmxvY2stYnVmZmVyLTAuMTAuMC9zcmMvbGliLnJz9AUQAFAAAAD8AAAAJwAAAC9ydX\
N0Yy9mMWVkZDA0Mjk1ODJkZDI5Y2NjYWNhZjUwZmQxMzRiMDU1OTNiZDljL2xpYnJhcnkvY29yZS9z\
cmMvc2xpY2UvbW9kLnJzYXNzZXJ0aW9uIGZhaWxlZDogbWlkIDw9IHNlbGYubGVuKClUBhAATQAAAB\
8GAAAJAAAAAAAAAAEjRWeJq83v/ty6mHZUMhDw4dLDAAAAAGfmCWqFrme7cvNuPDr1T6V/Ug5RjGgF\
m6vZgx8ZzeBb2J4FwQfVfDYX3XAwOVkO9zELwP8RFVhop4/5ZKRP+r4IybzzZ+YJajunyoSFrme7K/\
iU/nLzbjzxNh1fOvVPpdGC5q1/Ug5RH2w+K4xoBZtrvUH7q9mDH3khfhMZzeBb2J4FwV2du8sH1Xw2\
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\
7K2QVDo6BtknPCsAv6IwgISjrn7AAyDtbTICxoZAqWl9KKeDinr1MMtfesV55+t55ERotem83AUPtH\
Oj4g5XiG54Gteg9ui9zbqchy+jZMG80WqXi9dmll7iIas8w+XlqmMQkJCNaUhEsxiYu4oePq6HZOO0\
3DuJMfm9rxnVu1/coEVjymWUmyb+KIbsUZw/YAFdHrdJUKEGQORNsct29+VwbL/tK1Xv8hgSQaM2Wn\
AIBwzLRGCYT3UUTecOKKgOQ9lWzWVQX1PXkSXBlu8KcvEjMsgfpWNzbzmgw251bGwgcG9pbnRlciBw\
YXNzZWQgdG8gcnVzdHJlY3Vyc2l2ZSB1c2Ugb2YgYW4gb2JqZWN0IGRldGVjdGVkIHdoaWNoIHdvdW\
xkIGxlYWQgdG8gdW5zYWZlIGFsaWFzaW5nIGluIHJ1c3QAAAQAAAAAAAAAQAAAACAAAAAwAAAAIAAA\
ACAAAAAcAAAAIAAAADAAAABAAAAAEAAAABAAAAAUAAAAFAAAABwAAAAgAAAAMAAAAEAAAAAcAAAAIA\
AAADAAAABAAAAAIAAAAEAAAAAYAAAAQAAAACAAAAAwAAAAIAAAACAAAAAcAAAAIAAAADAAAABAAAAA\
EAAAABAAAAAUAAAAFAAAABwAAAAgAAAAMAAAAEAAAAAcAAAAIAAAADAAAABAAAAAIAAAAEAAAAAYAA\
AAALq4gIAABG5hbWUBr7iAgAB5AEVqc19zeXM6OlR5cGVFcnJvcjo6bmV3OjpfX3diZ19uZXdfYTRi\
NjFhMGY1NDgyNGNmZDo6aGQwZmM0NjMyMGI3ZGQ5OWEBO3dhc21fYmluZGdlbjo6X193YmluZGdlbl\
9vYmplY3RfZHJvcF9yZWY6OmhkZGYxZjhlODllMjczZjBkAlVqc19zeXM6OlVpbnQ4QXJyYXk6OmJ5\
dGVfbGVuZ3RoOjpfX3diZ19ieXRlTGVuZ3RoXzNlMjUwYjQxYTg5MTU3NTc6Omg1ZGQ4ZjQyMDFmYT\
A0NGU2A1Vqc19zeXM6OlVpbnQ4QXJyYXk6OmJ5dGVfb2Zmc2V0OjpfX3diZ19ieXRlT2Zmc2V0XzQy\
MDRlY2IyNGE2ZTVkZjk6Omg2MDEyMWZmY2ViMDUyYjQ4BExqc19zeXM6OlVpbnQ4QXJyYXk6OmJ1Zm\
Zlcjo6X193YmdfYnVmZmVyX2ZhY2YwMzk4YTI4MWM4NWI6OmhiMDZhZjNlYzc5OTA3ZWY2BXlqc19z\
eXM6OlVpbnQ4QXJyYXk6Om5ld193aXRoX2J5dGVfb2Zmc2V0X2FuZF9sZW5ndGg6Ol9fd2JnX25ld3\
dpdGhieXRlb2Zmc2V0YW5kbGVuZ3RoXzRiOWI4YzRlM2Y1YWRiZmY6OmgwNzFlZmZhMTYwOTM5NjJj\
Bkxqc19zeXM6OlVpbnQ4QXJyYXk6Omxlbmd0aDo6X193YmdfbGVuZ3RoXzFlYjhmYzYwOGEwZDRjZG\
I6Omg4NjE2OGQxNDEzMTJkOWQ3BzJ3YXNtX2JpbmRnZW46Ol9fd2JpbmRnZW5fbWVtb3J5OjpoNzA2\
NmYxYTQ1YzJkNzg4YQhVanNfc3lzOjpXZWJBc3NlbWJseTo6TWVtb3J5OjpidWZmZXI6Ol9fd2JnX2\
J1ZmZlcl8zOTdlYWE0ZDcyZWU5NGRkOjpoOGVjMDRmOWE1ZDgzYjZhMwlGanNfc3lzOjpVaW50OEFy\
cmF5OjpuZXc6Ol9fd2JnX25ld19hN2NlNDQ3ZjE1ZmY0OTZmOjpoYjNiYTQwNGE1ZDgzYjNkMgpGan\
Nfc3lzOjpVaW50OEFycmF5OjpzZXQ6Ol9fd2JnX3NldF85NjlhZDBhNjBlNTFkMzIwOjpoODQyYjZh\
YjRkODFiN2ZkYwsxd2FzbV9iaW5kZ2VuOjpfX3diaW5kZ2VuX3Rocm93OjpoYjNjZDc3YTExYWFhMD\
UwMgwzd2FzbV9iaW5kZ2VuOjpfX3diaW5kZ2VuX3JldGhyb3c6OmgxYjVhNzgwMjNiZTU0MzExDUBk\
ZW5vX3N0ZF93YXNtX2NyeXB0bzo6ZGlnZXN0OjpDb250ZXh0OjpkaWdlc3Q6OmgyYmNjMTg3MGQ5YW\
IzODNjDixzaGEyOjpzaGE1MTI6OmNvbXByZXNzNTEyOjpoNmIxMGMzM2FkMDVjMzVmNg9KZGVub19z\
dGRfd2FzbV9jcnlwdG86OmRpZ2VzdDo6Q29udGV4dDo6ZGlnZXN0X2FuZF9yZXNldDo6aDQ0ZjRiNj\
M5NjUyZDdlMTcQQGRlbm9fc3RkX3dhc21fY3J5cHRvOjpkaWdlc3Q6OkNvbnRleHQ6OnVwZGF0ZTo6\
aGUwZjdjN2YyMmZjYjkzYTIRLHNoYTI6OnNoYTI1Njo6Y29tcHJlc3MyNTY6OmhlODc4MDI5Y2NmZG\
QzZGY0EjNibGFrZTI6OkJsYWtlMmJWYXJDb3JlOjpjb21wcmVzczo6aDlmODdhNzZhOGZiZWUyMmIT\
KXJpcGVtZDo6YzE2MDo6Y29tcHJlc3M6OmgxODljNDc5ZmJkNjdhZmFkFDNibGFrZTI6OkJsYWtlMn\
NWYXJDb3JlOjpjb21wcmVzczo6aDlkZGE5YzJhMmI2MTc2ODkVK3NoYTE6OmNvbXByZXNzOjpjb21w\
cmVzczo6aDUwZTVkODNlOTFkNjU0YWEWO2Rlbm9fc3RkX3dhc21fY3J5cHRvOjpEaWdlc3RDb250ZX\
h0OjpuZXc6Omg4NTJmMGUyNTRkYTI0NDJhFzpkbG1hbGxvYzo6ZGxtYWxsb2M6OkRsbWFsbG9jPEE+\
OjptYWxsb2M6OmgyYTI3MjA3ZWU5YWY3ZmU5GCx0aWdlcjo6Y29tcHJlc3M6OmNvbXByZXNzOjpoNm\
QyNThmYmY3NTQ4YmZlMRktYmxha2UzOjpPdXRwdXRSZWFkZXI6OmZpbGw6OmhhOWMyNzBjOWI3ZmY0\
MWVlGjZibGFrZTM6OnBvcnRhYmxlOjpjb21wcmVzc19pbl9wbGFjZTo6aGM0YWQ3NDc3Y2JmNTJmMG\
UbE2RpZ2VzdGNvbnRleHRfY2xvbmUcZTxkaWdlc3Q6OmNvcmVfYXBpOjp3cmFwcGVyOjpDb3JlV3Jh\
cHBlcjxUPiBhcyBkaWdlc3Q6OlVwZGF0ZT46OnVwZGF0ZTo6e3tjbG9zdXJlfX06OmhlMWZhYWExOW\
M5MTM0ODllHWg8bWQ1OjpNZDVDb3JlIGFzIGRpZ2VzdDo6Y29yZV9hcGk6OkZpeGVkT3V0cHV0Q29y\
ZT46OmZpbmFsaXplX2ZpeGVkX2NvcmU6Ont7Y2xvc3VyZX19OjpoNTZjODcxYTc1MGM1MTgwZB4wYm\
xha2UzOjpjb21wcmVzc19zdWJ0cmVlX3dpZGU6Omg5OTVmOTJhMDk5ZDk4NjM0HzhkbG1hbGxvYzo6\
ZGxtYWxsb2M6OkRsbWFsbG9jPEE+OjpmcmVlOjpoY2I3OTQ3YTlhN2UyODJjYSAgbWQ0Ojpjb21wcm\
Vzczo6aDkwZDU0MDM2Y2E2MzNlM2MhQWRsbWFsbG9jOjpkbG1hbGxvYzo6RGxtYWxsb2M8QT46OmRp\
c3Bvc2VfY2h1bms6OmgyZjkwYmRkZmFiOWZkYWY5IhNkaWdlc3Rjb250ZXh0X3Jlc2V0I3I8c2hhMj\
o6Y29yZV9hcGk6OlNoYTUxMlZhckNvcmUgYXMgZGlnZXN0Ojpjb3JlX2FwaTo6VmFyaWFibGVPdXRw\
dXRDb3JlPjo6ZmluYWxpemVfdmFyaWFibGVfY29yZTo6aDllYTRhMjE1OGUwNzAzM2IkL2JsYWtlMz\
o6SGFzaGVyOjpmaW5hbGl6ZV94b2Y6OmhiODgzZTZjNWM0ZTVkNDBiJSBrZWNjYWs6OmYxNjAwOjpo\
YTgyNTc5MGNmMjVhNWY1ZSYsY29yZTo6Zm10OjpGb3JtYXR0ZXI6OnBhZDo6aDQ5ZDJjZmNjYWZiYm\
RlNGQnDl9fcnVzdF9yZWFsbG9jKHI8c2hhMjo6Y29yZV9hcGk6OlNoYTI1NlZhckNvcmUgYXMgZGln\
ZXN0Ojpjb3JlX2FwaTo6VmFyaWFibGVPdXRwdXRDb3JlPjo6ZmluYWxpemVfdmFyaWFibGVfY29yZT\
o6aDAzYTkzMGI4Yzc0YzllZDUpXTxzaGExOjpTaGExQ29yZSBhcyBkaWdlc3Q6OmNvcmVfYXBpOjpG\
aXhlZE91dHB1dENvcmU+OjpmaW5hbGl6ZV9maXhlZF9jb3JlOjpoYjVkOWVjNzAyNDhlMTgyMCoxYm\
xha2UzOjpIYXNoZXI6Om1lcmdlX2N2X3N0YWNrOjpoNDdiNmUyNGU2N2UyMTY1Yis1Y29yZTo6Zm10\
OjpGb3JtYXR0ZXI6OnBhZF9pbnRlZ3JhbDo6aGM2Njk0N2IxZGVkNTc4YWEsI2NvcmU6OmZtdDo6d3\
JpdGU6OmhiYmFmMzlmMDliZjQ5ZWZiLTRibGFrZTM6OmNvbXByZXNzX3BhcmVudHNfcGFyYWxsZWw6\
OmhhMDczMmZhY2IxMjc2OWJiLmQ8cmlwZW1kOjpSaXBlbWQxNjBDb3JlIGFzIGRpZ2VzdDo6Y29yZV\
9hcGk6OkZpeGVkT3V0cHV0Q29yZT46OmZpbmFsaXplX2ZpeGVkX2NvcmU6OmhkZThmYzJhZjcxMWYx\
ODVmL1s8bWQ1OjpNZDVDb3JlIGFzIGRpZ2VzdDo6Y29yZV9hcGk6OkZpeGVkT3V0cHV0Q29yZT46Om\
ZpbmFsaXplX2ZpeGVkX2NvcmU6OmgwYjMwMDNlNDg0MjlhYzNkMFs8bWQ0OjpNZDRDb3JlIGFzIGRp\
Z2VzdDo6Y29yZV9hcGk6OkZpeGVkT3V0cHV0Q29yZT46OmZpbmFsaXplX2ZpeGVkX2NvcmU6OmgzZT\
JiMzAwNzMwYWE4YWYwMV88dGlnZXI6OlRpZ2VyQ29yZSBhcyBkaWdlc3Q6OmNvcmVfYXBpOjpGaXhl\
ZE91dHB1dENvcmU+OjpmaW5hbGl6ZV9maXhlZF9jb3JlOjpoNDU3M2E0MGViYzU0Y2E1MzIwZGxtYW\
xsb2M6OkRsbWFsbG9jPEE+OjptYWxsb2M6OmgxODlmYmNhMDM3M2FiODI4M2U8ZGlnZXN0Ojpjb3Jl\
X2FwaTo6eG9mX3JlYWRlcjo6WG9mUmVhZGVyQ29yZVdyYXBwZXI8VD4gYXMgZGlnZXN0OjpYb2ZSZW\
FkZXI+OjpyZWFkOjpoOGE2ZDliYzFkOGM4YTc0NTRlPGRpZ2VzdDo6Y29yZV9hcGk6OnhvZl9yZWFk\
ZXI6OlhvZlJlYWRlckNvcmVXcmFwcGVyPFQ+IGFzIGRpZ2VzdDo6WG9mUmVhZGVyPjo6cmVhZDo6aD\
c0YzJhMGFkMGJjOGFmODU1LWJsYWtlMzo6Q2h1bmtTdGF0ZTo6dXBkYXRlOjpoYzU4OGE4Y2Q3YzI2\
Y2VmNTYvY29yZTo6Zm10OjpudW06OmltcDo6Zm10X3U2NDo6aDY2MjhhM2U3MjI3ZTg1NTM3BmRpZ2\
VzdDg+ZGVub19zdGRfd2FzbV9jcnlwdG86OkRpZ2VzdENvbnRleHQ6OnVwZGF0ZTo6aGJkOTQ0YWQ2\
M2Y2MjlkYTE5WzxibG9ja19idWZmZXI6OkJsb2NrQnVmZmVyPEJsb2NrU2l6ZSxLaW5kPiBhcyBjb3\
JlOjpjbG9uZTo6Q2xvbmU+OjpjbG9uZTo6aDFlNjc5OGM0NDQwOWIxM2M6Bm1lbWNweTsbZGlnZXN0\
Y29udGV4dF9kaWdlc3RBbmREcm9wPAZtZW1zZXQ9P3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3\
VyZXM6Omludm9rZTNfbXV0OjpoNGE4M2FkMzFhZDllYjlkOT4UZGlnZXN0Y29udGV4dF9kaWdlc3Q/\
LWpzX3N5czo6VWludDhBcnJheTo6dG9fdmVjOjpoNmVhOWI5MWQ1MjIzZGJiZEAcZGlnZXN0Y29udG\
V4dF9kaWdlc3RBbmRSZXNldEERZGlnZXN0Y29udGV4dF9uZXdCLmNvcmU6OnJlc3VsdDo6dW53cmFw\
X2ZhaWxlZDo6aGQ1ODRlZmI3Yjg0YmYzMjZDUDxhcnJheXZlYzo6ZXJyb3JzOjpDYXBhY2l0eUVycm\
9yPFQ+IGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg4Y2EzNjljOTgxMGMyMjI5RFA8YXJyYXl2\
ZWM6OmVycm9yczo6Q2FwYWNpdHlFcnJvcjxUPiBhcyBjb3JlOjpmbXQ6OkRlYnVnPjo6Zm10OjpoYW\
JkMmI2NDNkZDBlY2QyY0VbPGJsb2NrX2J1ZmZlcjo6QmxvY2tCdWZmZXI8QmxvY2tTaXplLEtpbmQ+\
IGFzIGNvcmU6OmNsb25lOjpDbG9uZT46OmNsb25lOjpoMzFiOWEwZGUxMGRmODY4OUZbPGJsb2NrX2\
J1ZmZlcjo6QmxvY2tCdWZmZXI8QmxvY2tTaXplLEtpbmQ+IGFzIGNvcmU6OmNsb25lOjpDbG9uZT46\
OmNsb25lOjpoNmQ1ZmZjMTIxNjVhNDVlZkdbPGJsb2NrX2J1ZmZlcjo6QmxvY2tCdWZmZXI8QmxvY2\
tTaXplLEtpbmQ+IGFzIGNvcmU6OmNsb25lOjpDbG9uZT46OmNsb25lOjpoZTQ1NzhiZDExMWQ2NDYw\
N0hbPGJsb2NrX2J1ZmZlcjo6QmxvY2tCdWZmZXI8QmxvY2tTaXplLEtpbmQ+IGFzIGNvcmU6OmNsb2\
5lOjpDbG9uZT46OmNsb25lOjpoNzY2ZWMwMWYwODU4YjU3OElbPGJsb2NrX2J1ZmZlcjo6QmxvY2tC\
dWZmZXI8QmxvY2tTaXplLEtpbmQ+IGFzIGNvcmU6OmNsb25lOjpDbG9uZT46OmNsb25lOjpoMzg2Nz\
U4YmUyNWRiYzlmYUpbPGJsb2NrX2J1ZmZlcjo6QmxvY2tCdWZmZXI8QmxvY2tTaXplLEtpbmQ+IGFz\
IGNvcmU6OmNsb25lOjpDbG9uZT46OmNsb25lOjpoMzhlMzdmZDQxYjU4ZTJmNks/Y29yZTo6c2xpY2\
U6OmluZGV4OjpzbGljZV9lbmRfaW5kZXhfbGVuX2ZhaWw6OmhjM2UwZGNmNmQ4NjZlMWJlTEFjb3Jl\
OjpzbGljZTo6aW5kZXg6OnNsaWNlX3N0YXJ0X2luZGV4X2xlbl9mYWlsOjpoNmMxMDlhYzg1ODdmMj\
kxMU09Y29yZTo6c2xpY2U6OmluZGV4OjpzbGljZV9pbmRleF9vcmRlcl9mYWlsOjpoZDI3ZGMzODVh\
N2VjMTNjMU5OY29yZTo6c2xpY2U6OjxpbXBsIFtUXT46OmNvcHlfZnJvbV9zbGljZTo6bGVuX21pc2\
1hdGNoX2ZhaWw6OmhlZGQxMGM1YmNjMDI2MTBjTzZjb3JlOjpwYW5pY2tpbmc6OnBhbmljX2JvdW5k\
c19jaGVjazo6aGNlMDUwMmY2MzcxMWZhZDhQN3N0ZDo6cGFuaWNraW5nOjpydXN0X3BhbmljX3dpdG\
hfaG9vazo6aDYwNmQ3YzdmN2E0MjNiOThROmJsYWtlMjo6Qmxha2UyYlZhckNvcmU6Om5ld193aXRo\
X3BhcmFtczo6aDU4N2Y5YTcyNzlmMzcxNmRSGF9fd2JnX2RpZ2VzdGNvbnRleHRfZnJlZVMGbWVtY2\
1wVENjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkX2ludGVncmFsOjp3cml0ZV9wcmVmaXg6OmhhYTBh\
ZGYwMGNiNjdkZWQ3VSljb3JlOjpwYW5pY2tpbmc6OnBhbmljOjpoZWMxZmMwNTdiZDBiYWYwYlYUZG\
lnZXN0Y29udGV4dF91cGRhdGVXEV9fd2JpbmRnZW5fbWFsbG9jWDpibGFrZTI6OkJsYWtlMnNWYXJD\
b3JlOjpuZXdfd2l0aF9wYXJhbXM6Omg1ZmY0NTlmMjMxYWI4ZDY4WS1jb3JlOjpwYW5pY2tpbmc6On\
BhbmljX2ZtdDo6aDYzMTRiNWM5MWFiZTczNDlaP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3Vy\
ZXM6Omludm9rZTRfbXV0OjpoMGRhMGY0NDM1YWYyZTNlYVs/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0Oj\
pjbG9zdXJlczo6aW52b2tlM19tdXQ6OmgwMDg1MjE2YzlhMTJhZWRmXD93YXNtX2JpbmRnZW46OmNv\
bnZlcnQ6OmNsb3N1cmVzOjppbnZva2UzX211dDo6aDNmMGUyMmI1ODczODUwMDZdP3dhc21fYmluZG\
dlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMzJlNGU5MGYwYzA4MjM5MF4/d2Fz\
bV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlM19tdXQ6OmhiNWQ0MWNhNmRjZDZiMz\
Q4Xz93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbnZva2UzX211dDo6aDczZGIzMGMw\
OGZiNWJjZDBgP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoOT\
k0MDdiYzUzNzNkMzBmOWE/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlM19t\
dXQ6OmhmODAzN2M3ZmFjMTc4MDllYj93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbn\
Zva2UyX211dDo6aDkxMTRjMzZhYmJlNDBmNzljQ3N0ZDo6cGFuaWNraW5nOjpiZWdpbl9wYW5pY19o\
YW5kbGVyOjp7e2Nsb3N1cmV9fTo6aDliOTg1YTI5M2FhYzRjZTFkEl9fd2JpbmRnZW5fcmVhbGxvY2\
U/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlMV9tdXQ6OmhkMWIyODM5MTNl\
Y2RiMGQxZjJjb3JlOjpvcHRpb246Ok9wdGlvbjxUPjo6dW53cmFwOjpoNWE3ZGY5MWI1ZDYwOTBjYm\
cwPCZUIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6OmgwZDljZDYyNmRhYmFhMWVmaDI8JlQgYXMg\
Y29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoZDMwM2JjMTZhZWU1NTkxMGkRcnVzdF9iZWdpbl91bn\
dpbmRqD19fd2JpbmRnZW5fZnJlZWs0YWxsb2M6OnJhd192ZWM6OmNhcGFjaXR5X292ZXJmbG93Ojpo\
NGI0OTAxNDgzMGNhZmU2M2wzYXJyYXl2ZWM6OmFycmF5dmVjOjpleHRlbmRfcGFuaWM6OmgzN2Q1OT\
hkNzVkMGQyZTZmbTljb3JlOjpvcHM6OmZ1bmN0aW9uOjpGbk9uY2U6OmNhbGxfb25jZTo6aDJhYjg2\
NzY3ZWMxN2M1MGRuH19fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXJvTmNvcmU6OmZtdDo6bn\
VtOjppbXA6OjxpbXBsIGNvcmU6OmZtdDo6RGlzcGxheSBmb3IgdTMyPjo6Zm10OjpoMDQ2ZWNjNWVh\
YWIzNGNkNXAxd2FzbV9iaW5kZ2VuOjpfX3J0Ojp0aHJvd19udWxsOjpoZGE3OGMxMGZhOTdiYTRjOH\
Eyd2FzbV9iaW5kZ2VuOjpfX3J0Ojpib3Jyb3dfZmFpbDo6aDU0MzNjYzM4Zjk0MTk1ZmZyKndhc21f\
YmluZGdlbjo6dGhyb3dfc3RyOjpoYTdhZjVhZTY3MjEyZjIxYXNJc3RkOjpzeXNfY29tbW9uOjpiYW\
NrdHJhY2U6Ol9fcnVzdF9lbmRfc2hvcnRfYmFja3RyYWNlOjpoYTAzYWJlZjAyYThiNzBmZHQqd2Fz\
bV9iaW5kZ2VuOjp0aHJvd192YWw6OmgwNWYxN2ZkOTc3Nzc3YjlkdTE8VCBhcyBjb3JlOjphbnk6Ok\
FueT46OnR5cGVfaWQ6OmhhMGM0NDkyMjE2ZDRkMmU3dgpydXN0X3BhbmljdzdzdGQ6OmFsbG9jOjpk\
ZWZhdWx0X2FsbG9jX2Vycm9yX2hvb2s6OmhmOWMzOTNiYTNjZDI4N2UxeG9jb3JlOjpwdHI6OmRyb3\
BfaW5fcGxhY2U8JmNvcmU6Oml0ZXI6OmFkYXB0ZXJzOjpjb3BpZWQ6OkNvcGllZDxjb3JlOjpzbGlj\
ZTo6aXRlcjo6SXRlcjx1OD4+Pjo6aDYzYzJlMTQ5N2I1MmYzZDcA74CAgAAJcHJvZHVjZXJzAghsYW\
5ndWFnZQEEUnVzdAAMcHJvY2Vzc2VkLWJ5AwVydXN0Yx0xLjU3LjAgKGYxZWRkMDQyOSAyMDIxLTEx\
LTI5KQZ3YWxydXMGMC4xOS4wDHdhc20tYmluZGdlbgYwLjIuNzg=\
");
const heap = new Array(32).fill(undefined);
heap.push(undefined, null, true, false);
function getObject(idx) {
    return heap[idx];
}
let heap_next = heap.length;
function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
let cachedTextDecoder = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
});
cachedTextDecoder.decode();
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
let WASM_VECTOR_LEN = 0;
let cachedTextEncoder = new TextEncoder("utf-8");
const encodeString = function(arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len);
    const mem = getUint8Memory0();
    let offset = 0;
    for(; offset < len; offset++){
        const code2 = arg.charCodeAt(offset);
        if (code2 > 0x7F) break;
        mem[ptr + offset] = code2;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
function isLikeNone(x1) {
    return x1 === undefined || x1 === null;
}
let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function digest(algorithm, data5, length) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(algorithm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.digest(retptr, ptr0, len0, addHeapObject(data5), !isLikeNone(length), isLikeNone(length) ? 0 : length);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally{
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
const DigestContextFinalization = new FinalizationRegistry((ptr)=>wasm.__wbg_digestcontext_free(ptr));
class DigestContext {
    static __wrap(ptr) {
        const obj = Object.create(DigestContext.prototype);
        obj.ptr = ptr;
        DigestContextFinalization.register(obj, obj.ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;
        DigestContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_digestcontext_free(ptr);
    }
    constructor(algorithm){
        var ptr0 = passStringToWasm0(algorithm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.digestcontext_new(ptr0, len0);
        return DigestContext.__wrap(ret);
    }
    update(data6) {
        wasm.digestcontext_update(this.ptr, addHeapObject(data6));
    }
    digest(length) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.digestcontext_digest(retptr, this.ptr, !isLikeNone(length), isLikeNone(length) ? 0 : length);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally{
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    digestAndReset(length) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.digestcontext_digestAndReset(retptr, this.ptr, !isLikeNone(length), isLikeNone(length) ? 0 : length);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally{
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    digestAndDrop(length) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.digestcontext_digestAndDrop(retptr, ptr, !isLikeNone(length), isLikeNone(length) ? 0 : length);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally{
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    reset() {
        wasm.digestcontext_reset(this.ptr);
    }
    clone() {
        var ret = wasm.digestcontext_clone(this.ptr);
        return DigestContext.__wrap(ret);
    }
}
const imports = {
    __wbindgen_placeholder__: {
        __wbg_new_a4b61a0f54824cfd: function(arg0, arg1) {
            var ret = new TypeError(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbg_byteLength_3e250b41a8915757: function(arg0) {
            var ret = getObject(arg0).byteLength;
            return ret;
        },
        __wbg_byteOffset_4204ecb24a6e5df9: function(arg0) {
            var ret = getObject(arg0).byteOffset;
            return ret;
        },
        __wbg_buffer_facf0398a281c85b: function(arg0) {
            var ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        },
        __wbg_newwithbyteoffsetandlength_4b9b8c4e3f5adbff: function(arg0, arg1, arg2) {
            var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_length_1eb8fc608a0d4cdb: function(arg0) {
            var ret = getObject(arg0).length;
            return ret;
        },
        __wbindgen_memory: function() {
            var ret = wasm.memory;
            return addHeapObject(ret);
        },
        __wbg_buffer_397eaa4d72ee94dd: function(arg0) {
            var ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        },
        __wbg_new_a7ce447f15ff496f: function(arg0) {
            var ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_set_969ad0a60e51d320: function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_rethrow: function(arg0) {
            throw takeObject(arg0);
        }
    }
};
const wasmModule = new WebAssembly.Module(data);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
const wasm = wasmInstance.exports;
const _wasm = wasm;
const _wasmModule = wasmModule;
const _wasmInstance = wasmInstance;
const mod2 = {
    digest: digest,
    DigestContext: DigestContext,
    _wasm: _wasm,
    _wasmModule: _wasmModule,
    _wasmInstance: _wasmInstance,
    _wasmBytes: data
};
const digestAlgorithms = [
    "BLAKE2B-256",
    "BLAKE2B-384",
    "BLAKE2B",
    "BLAKE2S",
    "BLAKE3",
    "KECCAK-224",
    "KECCAK-256",
    "KECCAK-384",
    "KECCAK-512",
    "SHA-384",
    "SHA3-224",
    "SHA3-256",
    "SHA3-384",
    "SHA3-512",
    "SHAKE128",
    "SHAKE256",
    "TIGER",
    "RIPEMD-160",
    "SHA-224",
    "SHA-256",
    "SHA-512",
    "MD4",
    "MD5",
    "SHA-1", 
];
function swap32(val) {
    return (val & 0xff) << 24 | (val & 0xff00) << 8 | val >> 8 & 0xff00 | val >> 24 & 0xff;
}
function n16(n1) {
    return n1 & 0xffff;
}
function n32(n2) {
    return n2 >>> 0;
}
function add32WithCarry(a1, b1) {
    const added = n32(a1) + n32(b1);
    return [
        n32(added),
        added > 0xffffffff ? 1 : 0
    ];
}
function mul32WithCarry(a2, b2) {
    const al = n16(a2);
    const ah = n16(a2 >>> 16);
    const bl = n16(b2);
    const bh = n16(b2 >>> 16);
    const [t1, tc] = add32WithCarry(al * bh, ah * bl);
    const [n3, nc] = add32WithCarry(al * bl, n32(t1 << 16));
    const carry = nc + (tc << 16) + n16(t1 >>> 16) + ah * bh;
    return [
        n3,
        carry
    ];
}
function mul32(a3, b3) {
    const al = n16(a3);
    const ah = a3 - al;
    return n32(n32(ah * b3) + al * b3);
}
function mul64([ah, al], [bh, bl]) {
    const [n4, c2] = mul32WithCarry(al, bl);
    return [
        n32(mul32(al, bh) + mul32(ah, bl) + c2),
        n4
    ];
}
const prime32 = 16777619;
const fnv32 = (data7)=>{
    let hash = 2166136261;
    data7.forEach((c3)=>{
        hash = mul32(hash, prime32);
        hash ^= c3;
    });
    return Uint32Array.from([
        swap32(hash)
    ]).buffer;
};
const fnv32a = (data8)=>{
    let hash = 2166136261;
    data8.forEach((c4)=>{
        hash ^= c4;
        hash = mul32(hash, prime32);
    });
    return Uint32Array.from([
        swap32(hash)
    ]).buffer;
};
const prime64Lo = 435;
const prime64Hi = 256;
const fnv64 = (data9)=>{
    let hashLo = 2216829733;
    let hashHi = 3421674724;
    data9.forEach((c5)=>{
        [hashHi, hashLo] = mul64([
            hashHi,
            hashLo
        ], [
            prime64Hi,
            prime64Lo
        ]);
        hashLo ^= c5;
    });
    return new Uint32Array([
        swap32(hashHi >>> 0),
        swap32(hashLo >>> 0)
    ]).buffer;
};
const fnv64a = (data10)=>{
    let hashLo = 2216829733;
    let hashHi = 3421674724;
    data10.forEach((c6)=>{
        hashLo ^= c6;
        [hashHi, hashLo] = mul64([
            hashHi,
            hashLo
        ], [
            prime64Hi,
            prime64Lo
        ]);
    });
    return new Uint32Array([
        swap32(hashHi >>> 0),
        swap32(hashLo >>> 0)
    ]).buffer;
};
const fnv = (name, buf)=>{
    if (!buf) {
        throw new TypeError("no data provided for hashing");
    }
    switch(name){
        case "FNV32":
            return fnv32(buf);
        case "FNV64":
            return fnv64(buf);
        case "FNV32A":
            return fnv32a(buf);
        case "FNV64A":
            return fnv64a(buf);
        default:
            throw new TypeError(`unsupported fnv digest: ${name}`);
    }
};
const webCrypto = ((crypto)=>({
        getRandomValues: crypto.getRandomValues?.bind(crypto),
        randomUUID: crypto.randomUUID?.bind(crypto),
        subtle: {
            decrypt: crypto.subtle?.decrypt?.bind(crypto.subtle),
            deriveBits: crypto.subtle?.deriveBits?.bind(crypto.subtle),
            deriveKey: crypto.subtle?.deriveKey?.bind(crypto.subtle),
            digest: crypto.subtle?.digest?.bind(crypto.subtle),
            encrypt: crypto.subtle?.encrypt?.bind(crypto.subtle),
            exportKey: crypto.subtle?.exportKey?.bind(crypto.subtle),
            generateKey: crypto.subtle?.generateKey?.bind(crypto.subtle),
            importKey: crypto.subtle?.importKey?.bind(crypto.subtle),
            sign: crypto.subtle?.sign?.bind(crypto.subtle),
            unwrapKey: crypto.subtle?.unwrapKey?.bind(crypto.subtle),
            verify: crypto.subtle?.verify?.bind(crypto.subtle),
            wrapKey: crypto.subtle?.wrapKey?.bind(crypto.subtle)
        }
    }))(globalThis.crypto);
const bufferSourceBytes = (data11)=>{
    let bytes;
    if (data11 instanceof Uint8Array) {
        bytes = data11;
    } else if (ArrayBuffer.isView(data11)) {
        bytes = new Uint8Array(data11.buffer, data11.byteOffset, data11.byteLength);
    } else if (data11 instanceof ArrayBuffer) {
        bytes = new Uint8Array(data11);
    }
    return bytes;
};
const stdCrypto = ((x2)=>x2)({
    ...webCrypto,
    subtle: {
        ...webCrypto.subtle,
        async digest (algorithm, data12) {
            const { name , length  } = normalizeAlgorithm(algorithm);
            const bytes = bufferSourceBytes(data12);
            if (FNVAlgorithms.includes(name)) {
                return fnv(name, bytes);
            }
            if (webCryptoDigestAlgorithms.includes(name) && bytes) {
                return webCrypto.subtle.digest(algorithm, bytes);
            } else if (digestAlgorithms.includes(name)) {
                if (bytes) {
                    return stdCrypto.subtle.digestSync(algorithm, bytes);
                } else if (data12[Symbol.iterator]) {
                    return stdCrypto.subtle.digestSync(algorithm, data12);
                } else if (data12[Symbol.asyncIterator]) {
                    const context = new mod2.DigestContext(name);
                    for await (const chunk of data12){
                        const chunkBytes = bufferSourceBytes(chunk);
                        if (!chunkBytes) {
                            throw new TypeError("data contained chunk of the wrong type");
                        }
                        context.update(chunkBytes);
                    }
                    return context.digestAndDrop(length).buffer;
                } else {
                    throw new TypeError("data must be a BufferSource or [Async]Iterable<BufferSource>");
                }
            } else if (webCrypto.subtle?.digest) {
                return webCrypto.subtle.digest(algorithm, data12);
            } else {
                throw new TypeError(`unsupported digest algorithm: ${algorithm}`);
            }
        },
        digestSync (algorithm, data13) {
            algorithm = normalizeAlgorithm(algorithm);
            const bytes = bufferSourceBytes(data13);
            if (FNVAlgorithms.includes(algorithm.name)) {
                return fnv(algorithm.name, bytes);
            }
            if (bytes) {
                return mod2.digest(algorithm.name, bytes, algorithm.length).buffer;
            } else if (data13[Symbol.iterator]) {
                const context = new mod2.DigestContext(algorithm.name);
                for (const chunk of data13){
                    const chunkBytes = bufferSourceBytes(chunk);
                    if (!chunkBytes) {
                        throw new TypeError("data contained chunk of the wrong type");
                    }
                    context.update(chunkBytes);
                }
                return context.digestAndDrop(algorithm.length).buffer;
            } else {
                throw new TypeError("data must be a BufferSource or Iterable<BufferSource>");
            }
        }
    }
});
const FNVAlgorithms = [
    "FNV32",
    "FNV32A",
    "FNV64",
    "FNV64A"
];
const webCryptoDigestAlgorithms = [
    "SHA-384",
    "SHA-256",
    "SHA-512",
    "SHA-1", 
];
const normalizeAlgorithm = (algorithm)=>typeof algorithm === "string" ? {
        name: algorithm.toUpperCase()
    } : {
        ...algorithm,
        name: algorithm.name.toUpperCase()
    };
const osType = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator  } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows = osType === "windows";
const CHAR_FORWARD_SLASH = 47;
function assertPath(path4) {
    if (typeof path4 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path4)}`);
    }
}
function isPosixPathSeparator(code3) {
    return code3 === 47;
}
function isPathSeparator(code4) {
    return isPosixPathSeparator(code4) || code4 === 92;
}
function isWindowsDeviceRoot(code5) {
    return code5 >= 97 && code5 <= 122 || code5 >= 65 && code5 <= 90;
}
function normalizeString(path5, allowAboveRoot, separator, isPathSeparator1) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code6;
    for(let i8 = 0, len = path5.length; i8 <= len; ++i8){
        if (i8 < len) code6 = path5.charCodeAt(i8);
        else if (isPathSeparator1(code6)) break;
        else code6 = CHAR_FORWARD_SLASH;
        if (isPathSeparator1(code6)) {
            if (lastSlash === i8 - 1 || dots === 1) {} else if (lastSlash !== i8 - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i8;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i8;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path5.slice(lastSlash + 1, i8);
                else res = path5.slice(lastSlash + 1, i8);
                lastSegmentLength = i8 - lastSlash - 1;
            }
            lastSlash = i8;
            dots = 0;
        } else if (code6 === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep6, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep6 + base;
}
const WHITESPACE_ENCODINGS = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace(string) {
    return string.replaceAll(/[\s]/g, (c7)=>{
        return WHITESPACE_ENCODINGS[c7] ?? c7;
    });
}
const sep = "\\";
const delimiter = ";";
function resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i9 = pathSegments.length - 1; i9 >= -1; i9--){
        let path6;
        const { Deno  } = globalThis;
        if (i9 >= 0) {
            path6 = pathSegments[i9];
        } else if (!resolvedDevice) {
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path6 = Deno.cwd();
        } else {
            if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path6 = Deno.cwd();
            if (path6 === undefined || path6.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path6 = `${resolvedDevice}\\`;
            }
        }
        assertPath(path6);
        const len = path6.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute1 = false;
        const code7 = path6.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code7)) {
                isAbsolute1 = true;
                if (isPathSeparator(path6.charCodeAt(1))) {
                    let j1 = 2;
                    let last = j1;
                    for(; j1 < len; ++j1){
                        if (isPathSeparator(path6.charCodeAt(j1))) break;
                    }
                    if (j1 < len && j1 !== last) {
                        const firstPart = path6.slice(last, j1);
                        last = j1;
                        for(; j1 < len; ++j1){
                            if (!isPathSeparator(path6.charCodeAt(j1))) break;
                        }
                        if (j1 < len && j1 !== last) {
                            last = j1;
                            for(; j1 < len; ++j1){
                                if (isPathSeparator(path6.charCodeAt(j1))) break;
                            }
                            if (j1 === len) {
                                device = `\\\\${firstPart}\\${path6.slice(last)}`;
                                rootEnd = j1;
                            } else if (j1 !== last) {
                                device = `\\\\${firstPart}\\${path6.slice(last, j1)}`;
                                rootEnd = j1;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot(code7)) {
                if (path6.charCodeAt(1) === 58) {
                    device = path6.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path6.charCodeAt(2))) {
                            isAbsolute1 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator(code7)) {
            rootEnd = 1;
            isAbsolute1 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path6.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute1;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path7) {
    assertPath(path7);
    const len = path7.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute2 = false;
    const code8 = path7.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code8)) {
            isAbsolute2 = true;
            if (isPathSeparator(path7.charCodeAt(1))) {
                let j2 = 2;
                let last = j2;
                for(; j2 < len; ++j2){
                    if (isPathSeparator(path7.charCodeAt(j2))) break;
                }
                if (j2 < len && j2 !== last) {
                    const firstPart = path7.slice(last, j2);
                    last = j2;
                    for(; j2 < len; ++j2){
                        if (!isPathSeparator(path7.charCodeAt(j2))) break;
                    }
                    if (j2 < len && j2 !== last) {
                        last = j2;
                        for(; j2 < len; ++j2){
                            if (isPathSeparator(path7.charCodeAt(j2))) break;
                        }
                        if (j2 === len) {
                            return `\\\\${firstPart}\\${path7.slice(last)}\\`;
                        } else if (j2 !== last) {
                            device = `\\\\${firstPart}\\${path7.slice(last, j2)}`;
                            rootEnd = j2;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot(code8)) {
            if (path7.charCodeAt(1) === 58) {
                device = path7.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path7.charCodeAt(2))) {
                        isAbsolute2 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator(code8)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString(path7.slice(rootEnd), !isAbsolute2, "\\", isPathSeparator);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute2) tail = ".";
    if (tail.length > 0 && isPathSeparator(path7.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute2) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute2) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute(path8) {
    assertPath(path8);
    const len = path8.length;
    if (len === 0) return false;
    const code9 = path8.charCodeAt(0);
    if (isPathSeparator(code9)) {
        return true;
    } else if (isWindowsDeviceRoot(code9)) {
        if (len > 2 && path8.charCodeAt(1) === 58) {
            if (isPathSeparator(path8.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i10 = 0; i10 < pathsCount; ++i10){
        const path9 = paths[i10];
        assertPath(path9);
        if (path9.length > 0) {
            if (joined === undefined) joined = firstPart = path9;
            else joined += `\\${path9}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert(firstPart != null);
    if (isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize(joined);
}
function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    const fromOrig = resolve(from);
    const toOrig = resolve(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i11 = 0;
    for(; i11 <= length; ++i11){
        if (i11 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i11) === 92) {
                    return toOrig.slice(toStart + i11 + 1);
                } else if (i11 === 2) {
                    return toOrig.slice(toStart + i11);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i11) === 92) {
                    lastCommonSep = i11;
                } else if (i11 === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i11);
        const toCode = to.charCodeAt(toStart + i11);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i11;
    }
    if (i11 !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i11 = fromStart + lastCommonSep + 1; i11 <= fromEnd; ++i11){
        if (i11 === fromEnd || from.charCodeAt(i11) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath(path10) {
    if (typeof path10 !== "string") return path10;
    if (path10.length === 0) return "";
    const resolvedPath = resolve(path10);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code10 = resolvedPath.charCodeAt(2);
                if (code10 !== 63 && code10 !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path10;
}
function dirname(path11) {
    assertPath(path11);
    const len = path11.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code11 = path11.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code11)) {
            rootEnd = offset = 1;
            if (isPathSeparator(path11.charCodeAt(1))) {
                let j3 = 2;
                let last = j3;
                for(; j3 < len; ++j3){
                    if (isPathSeparator(path11.charCodeAt(j3))) break;
                }
                if (j3 < len && j3 !== last) {
                    last = j3;
                    for(; j3 < len; ++j3){
                        if (!isPathSeparator(path11.charCodeAt(j3))) break;
                    }
                    if (j3 < len && j3 !== last) {
                        last = j3;
                        for(; j3 < len; ++j3){
                            if (isPathSeparator(path11.charCodeAt(j3))) break;
                        }
                        if (j3 === len) {
                            return path11;
                        }
                        if (j3 !== last) {
                            rootEnd = offset = j3 + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code11)) {
            if (path11.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator(path11.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator(code11)) {
        return path11;
    }
    for(let i12 = len - 1; i12 >= offset; --i12){
        if (isPathSeparator(path11.charCodeAt(i12))) {
            if (!matchedSlash) {
                end = i12;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path11.slice(0, end);
}
function basename(path12, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path12);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i13;
    if (path12.length >= 2) {
        const drive = path12.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path12.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path12.length) {
        if (ext.length === path12.length && ext === path12) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i13 = path12.length - 1; i13 >= start; --i13){
            const code12 = path12.charCodeAt(i13);
            if (isPathSeparator(code12)) {
                if (!matchedSlash) {
                    start = i13 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i13 + 1;
                }
                if (extIdx >= 0) {
                    if (code12 === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i13;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path12.length;
        return path12.slice(start, end);
    } else {
        for(i13 = path12.length - 1; i13 >= start; --i13){
            if (isPathSeparator(path12.charCodeAt(i13))) {
                if (!matchedSlash) {
                    start = i13 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i13 + 1;
            }
        }
        if (end === -1) return "";
        return path12.slice(start, end);
    }
}
function extname(path13) {
    assertPath(path13);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path13.length >= 2 && path13.charCodeAt(1) === 58 && isWindowsDeviceRoot(path13.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i14 = path13.length - 1; i14 >= start; --i14){
        const code13 = path13.charCodeAt(i14);
        if (isPathSeparator(code13)) {
            if (!matchedSlash) {
                startPart = i14 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i14 + 1;
        }
        if (code13 === 46) {
            if (startDot === -1) startDot = i14;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path13.slice(startDot, end);
}
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse(path14) {
    assertPath(path14);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path14.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code14 = path14.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code14)) {
            rootEnd = 1;
            if (isPathSeparator(path14.charCodeAt(1))) {
                let j4 = 2;
                let last = j4;
                for(; j4 < len; ++j4){
                    if (isPathSeparator(path14.charCodeAt(j4))) break;
                }
                if (j4 < len && j4 !== last) {
                    last = j4;
                    for(; j4 < len; ++j4){
                        if (!isPathSeparator(path14.charCodeAt(j4))) break;
                    }
                    if (j4 < len && j4 !== last) {
                        last = j4;
                        for(; j4 < len; ++j4){
                            if (isPathSeparator(path14.charCodeAt(j4))) break;
                        }
                        if (j4 === len) {
                            rootEnd = j4;
                        } else if (j4 !== last) {
                            rootEnd = j4 + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code14)) {
            if (path14.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path14.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path14;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path14;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator(code14)) {
        ret.root = ret.dir = path14;
        return ret;
    }
    if (rootEnd > 0) ret.root = path14.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i15 = path14.length - 1;
    let preDotState = 0;
    for(; i15 >= rootEnd; --i15){
        code14 = path14.charCodeAt(i15);
        if (isPathSeparator(code14)) {
            if (!matchedSlash) {
                startPart = i15 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i15 + 1;
        }
        if (code14 === 46) {
            if (startDot === -1) startDot = i15;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path14.slice(startPart, end);
        }
    } else {
        ret.name = path14.slice(startPart, startDot);
        ret.base = path14.slice(startPart, end);
        ret.ext = path14.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path14.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path15 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path15 = `\\\\${url.hostname}${path15}`;
    }
    return path15;
}
function toFileUrl(path16) {
    if (!isAbsolute(path16)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname1, pathname] = path16.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
    if (hostname1 != null && hostname1 != "localhost") {
        url.hostname = hostname1;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod3 = {
    sep: sep,
    delimiter: delimiter,
    resolve: resolve,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    toNamespacedPath: toNamespacedPath,
    dirname: dirname,
    basename: basename,
    extname: extname,
    format: format,
    parse: parse,
    fromFileUrl: fromFileUrl,
    toFileUrl: toFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i16 = pathSegments.length - 1; i16 >= -1 && !resolvedAbsolute; i16--){
        let path17;
        if (i16 >= 0) path17 = pathSegments[i16];
        else {
            const { Deno  } = globalThis;
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path17 = Deno.cwd();
        }
        assertPath(path17);
        if (path17.length === 0) {
            continue;
        }
        resolvedPath = `${path17}/${resolvedPath}`;
        resolvedAbsolute = path17.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path18) {
    assertPath(path18);
    if (path18.length === 0) return ".";
    const isAbsolute1 = path18.charCodeAt(0) === 47;
    const trailingSeparator = path18.charCodeAt(path18.length - 1) === 47;
    path18 = normalizeString(path18, !isAbsolute1, "/", isPosixPathSeparator);
    if (path18.length === 0 && !isAbsolute1) path18 = ".";
    if (path18.length > 0 && trailingSeparator) path18 += "/";
    if (isAbsolute1) return `/${path18}`;
    return path18;
}
function isAbsolute1(path19) {
    assertPath(path19);
    return path19.length > 0 && path19.charCodeAt(0) === 47;
}
function join1(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i17 = 0, len = paths.length; i17 < len; ++i17){
        const path20 = paths[i17];
        assertPath(path20);
        if (path20.length > 0) {
            if (!joined) joined = path20;
            else joined += `/${path20}`;
        }
    }
    if (!joined) return ".";
    return normalize1(joined);
}
function relative1(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    from = resolve1(from);
    to = resolve1(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i18 = 0;
    for(; i18 <= length; ++i18){
        if (i18 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i18) === 47) {
                    return to.slice(toStart + i18 + 1);
                } else if (i18 === 0) {
                    return to.slice(toStart + i18);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i18) === 47) {
                    lastCommonSep = i18;
                } else if (i18 === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i18);
        const toCode = to.charCodeAt(toStart + i18);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i18;
    }
    let out = "";
    for(i18 = fromStart + lastCommonSep + 1; i18 <= fromEnd; ++i18){
        if (i18 === fromEnd || from.charCodeAt(i18) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath1(path21) {
    return path21;
}
function dirname1(path22) {
    assertPath(path22);
    if (path22.length === 0) return ".";
    const hasRoot = path22.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i19 = path22.length - 1; i19 >= 1; --i19){
        if (path22.charCodeAt(i19) === 47) {
            if (!matchedSlash) {
                end = i19;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path22.slice(0, end);
}
function basename1(path23, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path23);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i20;
    if (ext !== undefined && ext.length > 0 && ext.length <= path23.length) {
        if (ext.length === path23.length && ext === path23) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i20 = path23.length - 1; i20 >= 0; --i20){
            const code15 = path23.charCodeAt(i20);
            if (code15 === 47) {
                if (!matchedSlash) {
                    start = i20 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i20 + 1;
                }
                if (extIdx >= 0) {
                    if (code15 === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i20;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path23.length;
        return path23.slice(start, end);
    } else {
        for(i20 = path23.length - 1; i20 >= 0; --i20){
            if (path23.charCodeAt(i20) === 47) {
                if (!matchedSlash) {
                    start = i20 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i20 + 1;
            }
        }
        if (end === -1) return "";
        return path23.slice(start, end);
    }
}
function extname1(path24) {
    assertPath(path24);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i21 = path24.length - 1; i21 >= 0; --i21){
        const code16 = path24.charCodeAt(i21);
        if (code16 === 47) {
            if (!matchedSlash) {
                startPart = i21 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i21 + 1;
        }
        if (code16 === 46) {
            if (startDot === -1) startDot = i21;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path24.slice(startDot, end);
}
function format1(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
function parse1(path25) {
    assertPath(path25);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path25.length === 0) return ret;
    const isAbsolute2 = path25.charCodeAt(0) === 47;
    let start;
    if (isAbsolute2) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i22 = path25.length - 1;
    let preDotState = 0;
    for(; i22 >= start; --i22){
        const code17 = path25.charCodeAt(i22);
        if (code17 === 47) {
            if (!matchedSlash) {
                startPart = i22 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i22 + 1;
        }
        if (code17 === 46) {
            if (startDot === -1) startDot = i22;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute2) {
                ret.base = ret.name = path25.slice(1, end);
            } else {
                ret.base = ret.name = path25.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute2) {
            ret.name = path25.slice(1, startDot);
            ret.base = path25.slice(1, end);
        } else {
            ret.name = path25.slice(startPart, startDot);
            ret.base = path25.slice(startPart, end);
        }
        ret.ext = path25.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path25.slice(0, startPart - 1);
    else if (isAbsolute2) ret.dir = "/";
    return ret;
}
function fromFileUrl1(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl1(path26) {
    if (!isAbsolute1(path26)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(path26.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod4 = {
    sep: sep1,
    delimiter: delimiter1,
    resolve: resolve1,
    normalize: normalize1,
    isAbsolute: isAbsolute1,
    join: join1,
    relative: relative1,
    toNamespacedPath: toNamespacedPath1,
    dirname: dirname1,
    basename: basename1,
    extname: extname1,
    format: format1,
    parse: parse1,
    fromFileUrl: fromFileUrl1,
    toFileUrl: toFileUrl1
};
const SEP = isWindows ? "\\" : "/";
const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
const path = isWindows ? mod3 : mod4;
const { join: join2 , normalize: normalize2  } = path;
const regExpEscapeChars = [
    "!",
    "$",
    "(",
    ")",
    "*",
    "+",
    ".",
    "=",
    "?",
    "[",
    "\\",
    "^",
    "{",
    "|", 
];
const rangeEscapeChars = [
    "-",
    "\\",
    "]"
];
function globToRegExp(glob, { extended =true , globstar: globstarOption = true , os =osType , caseInsensitive =false  } = {}) {
    if (glob == "") {
        return /(?!)/;
    }
    const sep7 = os == "windows" ? "(?:\\\\|/)+" : "/+";
    const sepMaybe = os == "windows" ? "(?:\\\\|/)*" : "/*";
    const seps = os == "windows" ? [
        "\\",
        "/"
    ] : [
        "/"
    ];
    const globstar = os == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
    const wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
    const escapePrefix = os == "windows" ? "`" : "\\";
    let newLength = glob.length;
    for(; newLength > 1 && seps.includes(glob[newLength - 1]); newLength--);
    glob = glob.slice(0, newLength);
    let regExpString = "";
    for(let j5 = 0; j5 < glob.length;){
        let segment = "";
        const groupStack = [];
        let inRange = false;
        let inEscape = false;
        let endsWithSep = false;
        let i23 = j5;
        for(; i23 < glob.length && !seps.includes(glob[i23]); i23++){
            if (inEscape) {
                inEscape = false;
                const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
                segment += escapeChars.includes(glob[i23]) ? `\\${glob[i23]}` : glob[i23];
                continue;
            }
            if (glob[i23] == escapePrefix) {
                inEscape = true;
                continue;
            }
            if (glob[i23] == "[") {
                if (!inRange) {
                    inRange = true;
                    segment += "[";
                    if (glob[i23 + 1] == "!") {
                        i23++;
                        segment += "^";
                    } else if (glob[i23 + 1] == "^") {
                        i23++;
                        segment += "\\^";
                    }
                    continue;
                } else if (glob[i23 + 1] == ":") {
                    let k1 = i23 + 1;
                    let value2 = "";
                    while(glob[k1 + 1] != null && glob[k1 + 1] != ":"){
                        value2 += glob[k1 + 1];
                        k1++;
                    }
                    if (glob[k1 + 1] == ":" && glob[k1 + 2] == "]") {
                        i23 = k1 + 2;
                        if (value2 == "alnum") segment += "\\dA-Za-z";
                        else if (value2 == "alpha") segment += "A-Za-z";
                        else if (value2 == "ascii") segment += "\x00-\x7F";
                        else if (value2 == "blank") segment += "\t ";
                        else if (value2 == "cntrl") segment += "\x00-\x1F\x7F";
                        else if (value2 == "digit") segment += "\\d";
                        else if (value2 == "graph") segment += "\x21-\x7E";
                        else if (value2 == "lower") segment += "a-z";
                        else if (value2 == "print") segment += "\x20-\x7E";
                        else if (value2 == "punct") {
                            segment += "!\"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~";
                        } else if (value2 == "space") segment += "\\s\v";
                        else if (value2 == "upper") segment += "A-Z";
                        else if (value2 == "word") segment += "\\w";
                        else if (value2 == "xdigit") segment += "\\dA-Fa-f";
                        continue;
                    }
                }
            }
            if (glob[i23] == "]" && inRange) {
                inRange = false;
                segment += "]";
                continue;
            }
            if (inRange) {
                if (glob[i23] == "\\") {
                    segment += `\\\\`;
                } else {
                    segment += glob[i23];
                }
                continue;
            }
            if (glob[i23] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += ")";
                const type = groupStack.pop();
                if (type == "!") {
                    segment += wildcard;
                } else if (type != "@") {
                    segment += type;
                }
                continue;
            }
            if (glob[i23] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i23] == "+" && extended && glob[i23 + 1] == "(") {
                i23++;
                groupStack.push("+");
                segment += "(?:";
                continue;
            }
            if (glob[i23] == "@" && extended && glob[i23 + 1] == "(") {
                i23++;
                groupStack.push("@");
                segment += "(?:";
                continue;
            }
            if (glob[i23] == "?") {
                if (extended && glob[i23 + 1] == "(") {
                    i23++;
                    groupStack.push("?");
                    segment += "(?:";
                } else {
                    segment += ".";
                }
                continue;
            }
            if (glob[i23] == "!" && extended && glob[i23 + 1] == "(") {
                i23++;
                groupStack.push("!");
                segment += "(?!";
                continue;
            }
            if (glob[i23] == "{") {
                groupStack.push("BRACE");
                segment += "(?:";
                continue;
            }
            if (glob[i23] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
                groupStack.pop();
                segment += ")";
                continue;
            }
            if (glob[i23] == "," && groupStack[groupStack.length - 1] == "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i23] == "*") {
                if (extended && glob[i23 + 1] == "(") {
                    i23++;
                    groupStack.push("*");
                    segment += "(?:";
                } else {
                    const prevChar = glob[i23 - 1];
                    let numStars = 1;
                    while(glob[i23 + 1] == "*"){
                        i23++;
                        numStars++;
                    }
                    const nextChar = glob[i23 + 1];
                    if (globstarOption && numStars == 2 && [
                        ...seps,
                        undefined
                    ].includes(prevChar) && [
                        ...seps,
                        undefined
                    ].includes(nextChar)) {
                        segment += globstar;
                        endsWithSep = true;
                    } else {
                        segment += wildcard;
                    }
                }
                continue;
            }
            segment += regExpEscapeChars.includes(glob[i23]) ? `\\${glob[i23]}` : glob[i23];
        }
        if (groupStack.length > 0 || inRange || inEscape) {
            segment = "";
            for (const c8 of glob.slice(j5, i23)){
                segment += regExpEscapeChars.includes(c8) ? `\\${c8}` : c8;
                endsWithSep = false;
            }
        }
        regExpString += segment;
        if (!endsWithSep) {
            regExpString += i23 < glob.length ? sep7 : sepMaybe;
            endsWithSep = true;
        }
        while(seps.includes(glob[i23]))i23++;
        if (!(i23 > j5)) {
            throw new Error("Assertion failure: i > j (potential infinite loop)");
        }
        j5 = i23;
    }
    regExpString = `^${regExpString}$`;
    return new RegExp(regExpString, caseInsensitive ? "i" : "");
}
function isGlob(str6) {
    const chars = {
        "{": "}",
        "(": ")",
        "[": "]"
    };
    const regex = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str6 === "") {
        return false;
    }
    let match;
    while(match = regex.exec(str6)){
        if (match[2]) return true;
        let idx = match.index + match[0].length;
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
            const n5 = str6.indexOf(close, idx);
            if (n5 !== -1) {
                idx = n5 + 1;
            }
        }
        str6 = str6.slice(idx);
    }
    return false;
}
function normalizeGlob(glob, { globstar =false  } = {}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize2(glob);
    }
    const s2 = SEP_PATTERN.source;
    const badParentPattern = new RegExp(`(?<=(${s2}|^)\\*\\*${s2})\\.\\.(?=${s2}|$)`, "g");
    return normalize2(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended =true , globstar =false  } = {}) {
    if (!globstar || globs.length == 0) {
        return join2(...globs);
    }
    if (globs.length === 0) return ".";
    let joined;
    for (const glob of globs){
        const path1 = glob;
        if (path1.length > 0) {
            if (!joined) joined = path1;
            else joined += `${SEP}${path1}`;
        }
    }
    if (!joined) return ".";
    return normalizeGlob(joined, {
        extended,
        globstar
    });
}
const path1 = isWindows ? mod3 : mod4;
const { basename: basename2 , delimiter: delimiter2 , dirname: dirname2 , extname: extname2 , format: format2 , fromFileUrl: fromFileUrl2 , isAbsolute: isAbsolute2 , join: join3 , normalize: normalize3 , parse: parse2 , relative: relative2 , resolve: resolve2 , sep: sep2 , toFileUrl: toFileUrl2 , toNamespacedPath: toNamespacedPath2 ,  } = path1;
async function emptyDir(dir) {
    try {
        const items = [];
        for await (const dirEntry of Deno.readDir(dir)){
            items.push(dirEntry);
        }
        while(items.length){
            const item = items.shift();
            if (item && item.name) {
                const filepath = join3(dir, item.name);
                await Deno.remove(filepath, {
                    recursive: true
                });
            }
        }
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        await Deno.mkdir(dir, {
            recursive: true
        });
    }
}
function emptyDirSync(dir) {
    try {
        const items = [
            ...Deno.readDirSync(dir)
        ];
        while(items.length){
            const item = items.shift();
            if (item && item.name) {
                const filepath = join3(dir, item.name);
                Deno.removeSync(filepath, {
                    recursive: true
                });
            }
        }
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        Deno.mkdirSync(dir, {
            recursive: true
        });
        return;
    }
}
function isSubdir(src, dest, sep8 = sep2) {
    if (src === dest) {
        return false;
    }
    const srcArray = src.split(sep8);
    const destArray = dest.split(sep8);
    return srcArray.every((current, i24)=>destArray[i24] === current);
}
function getFileInfoType(fileInfo) {
    return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : undefined;
}
async function ensureDir(dir) {
    try {
        const fileInfo = await Deno.lstat(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            await Deno.mkdir(dir, {
                recursive: true
            });
            return;
        }
        throw err;
    }
}
function ensureDirSync(dir) {
    try {
        const fileInfo = Deno.lstatSync(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            Deno.mkdirSync(dir, {
                recursive: true
            });
            return;
        }
        throw err;
    }
}
async function ensureFile(filePath) {
    try {
        const stat = await Deno.lstat(filePath);
        if (!stat.isFile) {
            throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            await ensureDir(dirname2(filePath));
            await Deno.writeFile(filePath, new Uint8Array());
            return;
        }
        throw err;
    }
}
function ensureFileSync(filePath) {
    try {
        const stat = Deno.lstatSync(filePath);
        if (!stat.isFile) {
            throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            ensureDirSync(dirname2(filePath));
            Deno.writeFileSync(filePath, new Uint8Array());
            return;
        }
        throw err;
    }
}
async function ensureLink(src, dest) {
    if (await exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
            throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
        }
        return;
    }
    await ensureDir(dirname2(dest));
    await Deno.link(src, dest);
}
function ensureLinkSync(src, dest) {
    if (existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
            throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
        }
        return;
    }
    ensureDirSync(dirname2(dest));
    Deno.linkSync(src, dest);
}
async function ensureSymlink(src, dest) {
    const srcStatInfo = await Deno.lstat(src);
    const srcFilePathType = getFileInfoType(srcStatInfo);
    if (await exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
            throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
        }
        return;
    }
    await ensureDir(dirname2(dest));
    const options = isWindows ? {
        type: srcFilePathType === "dir" ? "dir" : "file"
    } : undefined;
    await Deno.symlink(src, dest, options);
}
function ensureSymlinkSync(src, dest) {
    const srcStatInfo = Deno.lstatSync(src);
    const srcFilePathType = getFileInfoType(srcStatInfo);
    if (existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "symlink") {
            throw new Error(`Ensure path exists, expected 'symlink', got '${destFilePathType}'`);
        }
        return;
    }
    ensureDirSync(dirname2(dest));
    const options = isWindows ? {
        type: srcFilePathType === "dir" ? "dir" : "file"
    } : undefined;
    Deno.symlinkSync(src, dest, options);
}
function _createWalkEntrySync(path27) {
    path27 = normalize3(path27);
    const name = basename2(path27);
    const info1 = Deno.statSync(path27);
    return {
        path: path27,
        name,
        isFile: info1.isFile,
        isDirectory: info1.isDirectory,
        isSymlink: info1.isSymlink
    };
}
async function _createWalkEntry(path28) {
    path28 = normalize3(path28);
    const name = basename2(path28);
    const info2 = await Deno.stat(path28);
    return {
        path: path28,
        name,
        isFile: info2.isFile,
        isDirectory: info2.isDirectory,
        isSymlink: info2.isSymlink
    };
}
function include(path29, exts, match, skip) {
    if (exts && !exts.some((ext)=>path29.endsWith(ext))) {
        return false;
    }
    if (match && !match.some((pattern)=>!!path29.match(pattern))) {
        return false;
    }
    if (skip && skip.some((pattern)=>!!path29.match(pattern))) {
        return false;
    }
    return true;
}
function wrapErrorWithRootPath(err, root) {
    if (err instanceof Error && "root" in err) return err;
    const e8 = new Error();
    e8.root = root;
    e8.message = err instanceof Error ? `${err.message} for path "${root}"` : `[non-error thrown] for path "${root}"`;
    e8.stack = err instanceof Error ? err.stack : undefined;
    e8.cause = err instanceof Error ? err.cause : undefined;
    return e8;
}
async function* walk(root, { maxDepth =Infinity , includeFiles =true , includeDirs =true , followSymlinks =false , exts =undefined , match =undefined , skip =undefined  } = {}) {
    if (maxDepth < 0) {
        return;
    }
    if (includeDirs && include(root, exts, match, skip)) {
        yield await _createWalkEntry(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    try {
        for await (const entry of Deno.readDir(root)){
            assert(entry.name != null);
            let path30 = join3(root, entry.name);
            let { isSymlink , isDirectory  } = entry;
            if (isSymlink) {
                if (!followSymlinks) continue;
                path30 = await Deno.realPath(path30);
                ({ isSymlink , isDirectory  } = await Deno.lstat(path30));
            }
            if (isSymlink || isDirectory) {
                yield* walk(path30, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    followSymlinks,
                    exts,
                    match,
                    skip
                });
            } else if (includeFiles && include(path30, exts, match, skip)) {
                yield {
                    path: path30,
                    ...entry
                };
            }
        }
    } catch (err) {
        throw wrapErrorWithRootPath(err, normalize3(root));
    }
}
function* walkSync(root, { maxDepth =Infinity , includeFiles =true , includeDirs =true , followSymlinks =false , exts =undefined , match =undefined , skip =undefined  } = {}) {
    if (maxDepth < 0) {
        return;
    }
    if (includeDirs && include(root, exts, match, skip)) {
        yield _createWalkEntrySync(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    let entries;
    try {
        entries = Deno.readDirSync(root);
    } catch (err) {
        throw wrapErrorWithRootPath(err, normalize3(root));
    }
    for (const entry of entries){
        assert(entry.name != null);
        let path31 = join3(root, entry.name);
        let { isSymlink , isDirectory  } = entry;
        if (isSymlink) {
            if (!followSymlinks) continue;
            path31 = Deno.realPathSync(path31);
            ({ isSymlink , isDirectory  } = Deno.lstatSync(path31));
        }
        if (isSymlink || isDirectory) {
            yield* walkSync(path31, {
                maxDepth: maxDepth - 1,
                includeFiles,
                includeDirs,
                followSymlinks,
                exts,
                match,
                skip
            });
        } else if (includeFiles && include(path31, exts, match, skip)) {
            yield {
                path: path31,
                ...entry
            };
        }
    }
}
function split(path32) {
    const s3 = SEP_PATTERN.source;
    const segments = path32.replace(new RegExp(`^${s3}|${s3}$`, "g"), "").split(SEP_PATTERN);
    const isAbsolute_ = isAbsolute2(path32);
    return {
        segments,
        isAbsolute: isAbsolute_,
        hasTrailingSep: !!path32.match(new RegExp(`${s3}$`)),
        winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined
    };
}
function throwUnlessNotFound(error1) {
    if (!(error1 instanceof Deno.errors.NotFound)) {
        throw error1;
    }
}
function comparePath(a4, b4) {
    if (a4.path < b4.path) return -1;
    if (a4.path > b4.path) return 1;
    return 0;
}
async function* expandGlob(glob, { root =Deno.cwd() , exclude =[] , includeDirs =true , extended =true , globstar =false , caseInsensitive  } = {}) {
    const globOptions = {
        extended,
        globstar,
        caseInsensitive
    };
    const absRoot = resolve2(root);
    const resolveFromRoot = (path33)=>resolve2(absRoot, path33);
    const excludePatterns = exclude.map(resolveFromRoot).map((s4)=>globToRegExp(s4, globOptions));
    const shouldInclude = (path34)=>!excludePatterns.some((p5)=>!!path34.match(p5));
    const { segments , isAbsolute: isGlobAbsolute , hasTrailingSep , winRoot  } = split(glob);
    let fixedRoot = isGlobAbsolute ? winRoot != undefined ? winRoot : "/" : absRoot;
    while(segments.length > 0 && !isGlob(segments[0])){
        const seg = segments.shift();
        assert(seg != null);
        fixedRoot = joinGlobs([
            fixedRoot,
            seg
        ], globOptions);
    }
    let fixedRootInfo;
    try {
        fixedRootInfo = await _createWalkEntry(fixedRoot);
    } catch (error1) {
        return throwUnlessNotFound(error1);
    }
    async function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
            return;
        } else if (globSegment == "..") {
            const parentPath = joinGlobs([
                walkInfo.path,
                ".."
            ], globOptions);
            try {
                if (shouldInclude(parentPath)) {
                    return yield await _createWalkEntry(parentPath);
                }
            } catch (error2) {
                throwUnlessNotFound(error2);
            }
            return;
        } else if (globSegment == "**") {
            return yield* walk(walkInfo.path, {
                skip: excludePatterns
            });
        }
        const globPattern = globToRegExp(globSegment, globOptions);
        for await (const walkEntry of walk(walkInfo.path, {
            maxDepth: 1,
            skip: excludePatterns
        })){
            if (walkEntry.path != walkInfo.path && walkEntry.name.match(globPattern)) {
                yield walkEntry;
            }
        }
    }
    let currentMatches = [
        fixedRootInfo
    ];
    for (const segment of segments){
        const nextMatchMap = new Map();
        await Promise.all(currentMatches.map(async (currentMatch)=>{
            for await (const nextMatch of advanceMatch(currentMatch, segment)){
                nextMatchMap.set(nextMatch.path, nextMatch);
            }
        }));
        currentMatches = [
            ...nextMatchMap.values()
        ].sort(comparePath);
    }
    if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry)=>entry.isDirectory);
    }
    if (!includeDirs) {
        currentMatches = currentMatches.filter((entry)=>!entry.isDirectory);
    }
    yield* currentMatches;
}
function* expandGlobSync(glob, { root =Deno.cwd() , exclude =[] , includeDirs =true , extended =true , globstar =false , caseInsensitive  } = {}) {
    const globOptions = {
        extended,
        globstar,
        caseInsensitive
    };
    const absRoot = resolve2(root);
    const resolveFromRoot = (path35)=>resolve2(absRoot, path35);
    const excludePatterns = exclude.map(resolveFromRoot).map((s5)=>globToRegExp(s5, globOptions));
    const shouldInclude = (path36)=>!excludePatterns.some((p6)=>!!path36.match(p6));
    const { segments , isAbsolute: isGlobAbsolute , hasTrailingSep , winRoot  } = split(glob);
    let fixedRoot = isGlobAbsolute ? winRoot != undefined ? winRoot : "/" : absRoot;
    while(segments.length > 0 && !isGlob(segments[0])){
        const seg = segments.shift();
        assert(seg != null);
        fixedRoot = joinGlobs([
            fixedRoot,
            seg
        ], globOptions);
    }
    let fixedRootInfo;
    try {
        fixedRootInfo = _createWalkEntrySync(fixedRoot);
    } catch (error2) {
        return throwUnlessNotFound(error2);
    }
    function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
            return;
        } else if (globSegment == "..") {
            const parentPath = joinGlobs([
                walkInfo.path,
                ".."
            ], globOptions);
            try {
                if (shouldInclude(parentPath)) {
                    return yield _createWalkEntrySync(parentPath);
                }
            } catch (error3) {
                throwUnlessNotFound(error3);
            }
            return;
        } else if (globSegment == "**") {
            return yield* walkSync(walkInfo.path, {
                skip: excludePatterns
            });
        }
        const globPattern = globToRegExp(globSegment, globOptions);
        for (const walkEntry of walkSync(walkInfo.path, {
            maxDepth: 1,
            skip: excludePatterns
        })){
            if (walkEntry.path != walkInfo.path && walkEntry.name.match(globPattern)) {
                yield walkEntry;
            }
        }
    }
    let currentMatches = [
        fixedRootInfo
    ];
    for (const segment of segments){
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches){
            for (const nextMatch of advanceMatch(currentMatch, segment)){
                nextMatchMap.set(nextMatch.path, nextMatch);
            }
        }
        currentMatches = [
            ...nextMatchMap.values()
        ].sort(comparePath);
    }
    if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry)=>entry.isDirectory);
    }
    if (!includeDirs) {
        currentMatches = currentMatches.filter((entry)=>!entry.isDirectory);
    }
    yield* currentMatches;
}
async function move(src, dest, { overwrite =false  } = {}) {
    const srcStat = await Deno.stat(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (overwrite) {
        if (await exists(dest)) {
            await Deno.remove(dest, {
                recursive: true
            });
        }
    } else {
        if (await exists(dest)) {
            throw new Error("dest already exists.");
        }
    }
    await Deno.rename(src, dest);
    return;
}
function moveSync(src, dest, { overwrite =false  } = {}) {
    const srcStat = Deno.statSync(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (overwrite) {
        if (existsSync(dest)) {
            Deno.removeSync(dest, {
                recursive: true
            });
        }
    } else {
        if (existsSync(dest)) {
            throw new Error("dest already exists.");
        }
    }
    Deno.renameSync(src, dest);
}
function utime(...args11) {
    if (typeof Deno.utime == "function") {
        return Deno.utime(...args11);
    } else {
        return Promise.reject(new TypeError("Requires --unstable"));
    }
}
function utimeSync(...args12) {
    if (typeof Deno.utimeSync == "function") {
        return Deno.utimeSync(...args12);
    } else {
        throw new TypeError("Requires --unstable");
    }
}
async function ensureValidCopy(src, dest, options) {
    let destStat;
    try {
        destStat = await Deno.lstat(dest);
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return;
        }
        throw err;
    }
    if (options.isFolder && !destStat.isDirectory) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
    }
    return destStat;
}
function ensureValidCopySync(src, dest, options) {
    let destStat;
    try {
        destStat = Deno.lstatSync(dest);
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return;
        }
        throw err;
    }
    if (options.isFolder && !destStat.isDirectory) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!options.overwrite) {
        throw new Error(`'${dest}' already exists.`);
    }
    return destStat;
}
async function copyFile(src, dest, options) {
    await ensureValidCopy(src, dest, options);
    await Deno.copyFile(src, dest);
    if (options.preserveTimestamps) {
        const statInfo = await Deno.stat(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await utime(dest, statInfo.atime, statInfo.mtime);
    }
}
function copyFileSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    Deno.copyFileSync(src, dest);
    if (options.preserveTimestamps) {
        const statInfo = Deno.statSync(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        utimeSync(dest, statInfo.atime, statInfo.mtime);
    }
}
async function copySymLink(src, dest, options) {
    await ensureValidCopy(src, dest, options);
    const originSrcFilePath = await Deno.readLink(src);
    const type = getFileInfoType(await Deno.lstat(src));
    if (isWindows) {
        await Deno.symlink(originSrcFilePath, dest, {
            type: type === "dir" ? "dir" : "file"
        });
    } else {
        await Deno.symlink(originSrcFilePath, dest);
    }
    if (options.preserveTimestamps) {
        const statInfo = await Deno.lstat(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await utime(dest, statInfo.atime, statInfo.mtime);
    }
}
function copySymlinkSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    const originSrcFilePath = Deno.readLinkSync(src);
    const type = getFileInfoType(Deno.lstatSync(src));
    if (isWindows) {
        Deno.symlinkSync(originSrcFilePath, dest, {
            type: type === "dir" ? "dir" : "file"
        });
    } else {
        Deno.symlinkSync(originSrcFilePath, dest);
    }
    if (options.preserveTimestamps) {
        const statInfo = Deno.lstatSync(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        utimeSync(dest, statInfo.atime, statInfo.mtime);
    }
}
async function copyDir(src, dest, options) {
    const destStat = await ensureValidCopy(src, dest, {
        ...options,
        isFolder: true
    });
    if (!destStat) {
        await ensureDir(dest);
    }
    if (options.preserveTimestamps) {
        const srcStatInfo = await Deno.stat(src);
        assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
    for await (const entry of Deno.readDir(src)){
        const srcPath = join3(src, entry.name);
        const destPath = join3(dest, basename2(srcPath));
        if (entry.isSymlink) {
            await copySymLink(srcPath, destPath, options);
        } else if (entry.isDirectory) {
            await copyDir(srcPath, destPath, options);
        } else if (entry.isFile) {
            await copyFile(srcPath, destPath, options);
        }
    }
}
function copyDirSync(src, dest, options) {
    const destStat = ensureValidCopySync(src, dest, {
        ...options,
        isFolder: true
    });
    if (!destStat) {
        ensureDirSync(dest);
    }
    if (options.preserveTimestamps) {
        const srcStatInfo = Deno.statSync(src);
        assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
    for (const entry of Deno.readDirSync(src)){
        assert(entry.name != null, "file.name must be set");
        const srcPath = join3(src, entry.name);
        const destPath = join3(dest, basename2(srcPath));
        if (entry.isSymlink) {
            copySymlinkSync(srcPath, destPath, options);
        } else if (entry.isDirectory) {
            copyDirSync(srcPath, destPath, options);
        } else if (entry.isFile) {
            copyFileSync(srcPath, destPath, options);
        }
    }
}
async function copy1(src, dest, options = {}) {
    src = resolve2(src);
    dest = resolve2(dest);
    if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
    }
    const srcStat = await Deno.lstat(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (srcStat.isSymlink) {
        await copySymLink(src, dest, options);
    } else if (srcStat.isDirectory) {
        await copyDir(src, dest, options);
    } else if (srcStat.isFile) {
        await copyFile(src, dest, options);
    }
}
function copySync(src, dest, options = {}) {
    src = resolve2(src);
    dest = resolve2(dest);
    if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
    }
    const srcStat = Deno.lstatSync(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (srcStat.isSymlink) {
        copySymlinkSync(src, dest, options);
    } else if (srcStat.isDirectory) {
        copyDirSync(src, dest, options);
    } else if (srcStat.isFile) {
        copyFileSync(src, dest, options);
    }
}
var EOL;
(function(EOL1) {
    EOL1["LF"] = "\n";
    EOL1["CRLF"] = "\r\n";
})(EOL || (EOL = {}));
const regDetect = /(?:\r?\n)/g;
function detect(content) {
    const d2 = content.match(regDetect);
    if (!d2 || d2.length === 0) {
        return null;
    }
    const hasCRLF = d2.some((x3)=>x3 === EOL.CRLF);
    return hasCRLF ? EOL.CRLF : EOL.LF;
}
function format3(content, eol) {
    return content.replace(regDetect, eol);
}
const mod5 = {
    exists,
    existsSync,
    emptyDir,
    emptyDirSync,
    ensureDir,
    ensureDirSync,
    ensureFile,
    ensureFileSync,
    ensureLink,
    ensureLinkSync,
    ensureSymlink,
    ensureSymlinkSync,
    expandGlob,
    expandGlobSync,
    _createWalkEntrySync,
    _createWalkEntry,
    walk,
    walkSync,
    move,
    moveSync,
    copy: copy1,
    copySync,
    EOL,
    detect,
    format: format3
};
const { hasOwn  } = Object;
function get(obj, key2) {
    if (hasOwn(obj, key2)) {
        return obj[key2];
    }
}
function getForce(obj, key3) {
    const v2 = get(obj, key3);
    assert(v2 != null);
    return v2;
}
function isNumber(x4) {
    if (typeof x4 === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x4))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x4));
}
function hasKey(obj, keys) {
    let o1 = obj;
    keys.slice(0, -1).forEach((key4)=>{
        o1 = get(o1, key4) ?? {};
    });
    const key1 = keys[keys.length - 1];
    return key1 in o1;
}
function parse3(args13, { "--": doubleDash = false , alias: alias3 = {} , boolean: __boolean = false , default: defaults = {} , stopEarly =false , string =[] , collect: collect1 = [] , unknown =(i25)=>i25  } = {}) {
    const flags1 = {
        bools: {},
        strings: {},
        unknownFn: unknown,
        allBools: false,
        collect: {}
    };
    if (__boolean !== undefined) {
        if (typeof __boolean === "boolean") {
            flags1.allBools = !!__boolean;
        } else {
            const booleanArgs = typeof __boolean === "string" ? [
                __boolean
            ] : __boolean;
            for (const key5 of booleanArgs.filter(Boolean)){
                flags1.bools[key5] = true;
            }
        }
    }
    const aliases = {};
    if (alias3 !== undefined) {
        for(const key6 in alias3){
            const val = getForce(alias3, key6);
            if (typeof val === "string") {
                aliases[key6] = [
                    val
                ];
            } else {
                aliases[key6] = val;
            }
            for (const alias1 of getForce(aliases, key6)){
                aliases[alias1] = [
                    key6
                ].concat(aliases[key6].filter((y1)=>alias1 !== y1));
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key7 of stringArgs.filter(Boolean)){
            flags1.strings[key7] = true;
            const alias = get(aliases, key7);
            if (alias) {
                for (const al of alias){
                    flags1.strings[al] = true;
                }
            }
        }
    }
    if (collect1 !== undefined) {
        const collectArgs = typeof collect1 === "string" ? [
            collect1
        ] : collect1;
        for (const key8 of collectArgs.filter(Boolean)){
            flags1.collect[key8] = true;
            const alias = get(aliases, key8);
            if (alias) {
                for (const al of alias){
                    flags1.collect[al] = true;
                }
            }
        }
    }
    const argv = {
        _: []
    };
    function argDefined(key9, arg) {
        return flags1.allBools && /^--[^=]+$/.test(arg) || get(flags1.bools, key9) || !!get(flags1.strings, key9) || !!get(aliases, key9);
    }
    function setKey(obj, name, value3, collect = true) {
        let o2 = obj;
        const keys = name.split(".");
        keys.slice(0, -1).forEach(function(key10) {
            if (get(o2, key10) === undefined) {
                o2[key10] = {};
            }
            o2 = get(o2, key10);
        });
        const key5 = keys[keys.length - 1];
        const collectable = collect && !!get(flags1.collect, name);
        if (!collectable) {
            o2[key5] = value3;
        } else if (get(o2, key5) === undefined) {
            o2[key5] = [
                value3
            ];
        } else if (Array.isArray(get(o2, key5))) {
            o2[key5].push(value3);
        } else {
            o2[key5] = [
                get(o2, key5),
                value3
            ];
        }
    }
    function setArg(key11, val, arg = undefined, collect) {
        if (arg && flags1.unknownFn && !argDefined(key11, arg)) {
            if (flags1.unknownFn(arg, key11, val) === false) return;
        }
        const value4 = !get(flags1.strings, key11) && isNumber(val) ? Number(val) : val;
        setKey(argv, key11, value4, collect);
        const alias = get(aliases, key11);
        if (alias) {
            for (const x5 of alias){
                setKey(argv, x5, value4, collect);
            }
        }
    }
    function aliasIsBoolean(key12) {
        return getForce(aliases, key12).some((x6)=>typeof get(flags1.bools, x6) === "boolean");
    }
    let notFlags = [];
    if (args13.includes("--")) {
        notFlags = args13.slice(args13.indexOf("--") + 1);
        args13 = args13.slice(0, args13.indexOf("--"));
    }
    for(let i26 = 0; i26 < args13.length; i26++){
        const arg = args13[i26];
        if (/^--.+=/.test(arg)) {
            const m1 = arg.match(/^--([^=]+)=(.*)$/s);
            assert(m1 != null);
            const [, key13, value5] = m1;
            if (flags1.bools[key13]) {
                const booleanValue = value5 !== "false";
                setArg(key13, booleanValue, arg);
            } else {
                setArg(key13, value5, arg);
            }
        } else if (/^--no-.+/.test(arg)) {
            const m2 = arg.match(/^--no-(.+)/);
            assert(m2 != null);
            setArg(m2[1], false, arg, false);
        } else if (/^--.+/.test(arg)) {
            const m3 = arg.match(/^--(.+)/);
            assert(m3 != null);
            const [, key14] = m3;
            const next = args13[i26 + 1];
            if (next !== undefined && !/^-/.test(next) && !get(flags1.bools, key14) && !flags1.allBools && (get(aliases, key14) ? !aliasIsBoolean(key14) : true)) {
                setArg(key14, next, arg);
                i26++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key14, next === "true", arg);
                i26++;
            } else {
                setArg(key14, get(flags1.strings, key14) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j6 = 0; j6 < letters.length; j6++){
                const next = arg.slice(j6 + 2);
                if (next === "-") {
                    setArg(letters[j6], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j6]) && /=/.test(next)) {
                    setArg(letters[j6], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j6]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j6], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j6 + 1] && letters[j6 + 1].match(/\W/)) {
                    setArg(letters[j6], arg.slice(j6 + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j6], get(flags1.strings, letters[j6]) ? "" : true, arg);
                }
            }
            const [key15] = arg.slice(-1);
            if (!broken && key15 !== "-") {
                if (args13[i26 + 1] && !/^(-|--)[^-]/.test(args13[i26 + 1]) && !get(flags1.bools, key15) && (get(aliases, key15) ? !aliasIsBoolean(key15) : true)) {
                    setArg(key15, args13[i26 + 1], arg);
                    i26++;
                } else if (args13[i26 + 1] && /^(true|false)$/.test(args13[i26 + 1])) {
                    setArg(key15, args13[i26 + 1] === "true", arg);
                    i26++;
                } else {
                    setArg(key15, get(flags1.strings, key15) ? "" : true, arg);
                }
            }
        } else {
            if (!flags1.unknownFn || flags1.unknownFn(arg) !== false) {
                argv._.push(flags1.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv._.push(...args13.slice(i26 + 1));
                break;
            }
        }
    }
    for (const [key4, value1] of Object.entries(defaults)){
        if (!hasKey(argv, key4.split("."))) {
            setKey(argv, key4, value1);
            if (aliases[key4]) {
                for (const x7 of aliases[key4]){
                    setKey(argv, x7, value1);
                }
            }
        }
    }
    for (const key2 of Object.keys(flags1.bools)){
        if (!hasKey(argv, key2.split("."))) {
            const value6 = get(flags1.collect, key2) ? [] : false;
            setKey(argv, key2, value6, false);
        }
    }
    for (const key3 of Object.keys(flags1.strings)){
        if (!hasKey(argv, key3.split(".")) && get(flags1.collect, key3)) {
            setKey(argv, key3, [], false);
        }
    }
    if (doubleDash) {
        argv["--"] = [];
        for (const key16 of notFlags){
            argv["--"].push(key16);
        }
    } else {
        for (const key17 of notFlags){
            argv._.push(key17);
        }
    }
    return argv;
}
const mod6 = {
    parse: parse3
};
const matchCache = {};
const FIELD_CONTENT_REGEXP = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const KEY_REGEXP = /(?:^|;) *([^=]*)=[^;]*/g;
const SAME_SITE_REGEXP = /^(?:lax|none|strict)$/i;
function getPattern(name) {
    if (name in matchCache) {
        return matchCache[name];
    }
    return matchCache[name] = new RegExp(`(?:^|;) *${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`);
}
function pushCookie(headers, cookie) {
    if (cookie.overwrite) {
        for(let i27 = headers.length - 1; i27 >= 0; i27--){
            if (headers[i27].indexOf(`${cookie.name}=`) === 0) {
                headers.splice(i27, 1);
            }
        }
    }
    headers.push(cookie.toHeader());
}
function validateCookieProperty(key18, value7) {
    if (value7 && !FIELD_CONTENT_REGEXP.test(value7)) {
        throw new TypeError(`The ${key18} of the cookie (${value7}) is invalid.`);
    }
}
class Cookie {
    domain;
    expires;
    httpOnly = true;
    maxAge;
    name;
    overwrite = false;
    path = "/";
    sameSite = false;
    secure = false;
    signed;
    value;
    constructor(name, value8, attributes){
        validateCookieProperty("name", name);
        validateCookieProperty("value", value8);
        this.name = name;
        this.value = value8 ?? "";
        Object.assign(this, attributes);
        if (!this.value) {
            this.expires = new Date(0);
            this.maxAge = undefined;
        }
        validateCookieProperty("path", this.path);
        validateCookieProperty("domain", this.domain);
        if (this.sameSite && typeof this.sameSite === "string" && !SAME_SITE_REGEXP.test(this.sameSite)) {
            throw new TypeError(`The sameSite of the cookie ("${this.sameSite}") is invalid.`);
        }
    }
    toHeader() {
        let header = this.toString();
        if (this.maxAge) {
            this.expires = new Date(Date.now() + this.maxAge * 1000);
        }
        if (this.path) {
            header += `; path=${this.path}`;
        }
        if (this.expires) {
            header += `; expires=${this.expires.toUTCString()}`;
        }
        if (this.domain) {
            header += `; domain=${this.domain}`;
        }
        if (this.sameSite) {
            header += `; samesite=${this.sameSite === true ? "strict" : this.sameSite.toLowerCase()}`;
        }
        if (this.secure) {
            header += "; secure";
        }
        if (this.httpOnly) {
            header += "; httponly";
        }
        return header;
    }
    toString() {
        return `${this.name}=${this.value}`;
    }
}
class Cookies {
    #cookieKeys;
    #keys;
    #request;
    #response;
    #secure;
     #requestKeys() {
        if (this.#cookieKeys) {
            return this.#cookieKeys;
        }
        const result = this.#cookieKeys = [];
        const header = this.#request.headers.get("cookie");
        if (!header) {
            return result;
        }
        let matches;
        while(matches = KEY_REGEXP.exec(header)){
            const [, key] = matches;
            result.push(key);
        }
        return result;
    }
    constructor(request, response, options = {}){
        const { keys , secure  } = options;
        this.#keys = keys;
        this.#request = request;
        this.#response = response;
        this.#secure = secure;
    }
    delete(name, options = {}) {
        this.set(name, null, options);
        return true;
    }
    async *entries() {
        const keys = this.#requestKeys();
        for (const key19 of keys){
            const value9 = await this.get(key19);
            if (value9) {
                yield [
                    key19,
                    value9
                ];
            }
        }
    }
    async forEach(callback, thisArg = null) {
        const keys = this.#requestKeys();
        for (const key20 of keys){
            const value10 = await this.get(key20);
            if (value10) {
                callback.call(thisArg, key20, value10, this);
            }
        }
    }
    async get(name, options = {}) {
        const signed = options.signed ?? !!this.#keys;
        const nameSig = `${name}.sig`;
        const header = this.#request.headers.get("cookie");
        if (!header) {
            return;
        }
        const match = header.match(getPattern(name));
        if (!match) {
            return;
        }
        const [, value11] = match;
        if (!signed) {
            return value11;
        }
        const digest1 = await this.get(nameSig, {
            signed: false
        });
        if (!digest1) {
            return;
        }
        const data14 = `${name}=${value11}`;
        if (!this.#keys) {
            throw new TypeError("keys required for signed cookies");
        }
        const index = await this.#keys.indexOf(data14, digest1);
        if (index < 0) {
            this.delete(nameSig, {
                path: "/",
                signed: false
            });
        } else {
            if (index) {
                this.set(nameSig, await this.#keys.sign(data14), {
                    signed: false
                });
            }
            return value11;
        }
    }
    async *keys() {
        const keys = this.#requestKeys();
        for (const key21 of keys){
            const value12 = await this.get(key21);
            if (value12) {
                yield key21;
            }
        }
    }
    async set(name, value13, options = {}) {
        const request = this.#request;
        const response = this.#response;
        const headers = [];
        for (const [key22, value1] of response.headers.entries()){
            if (key22 === "set-cookie") {
                headers.push(value1);
            }
        }
        const secure = this.#secure !== undefined ? this.#secure : request.secure;
        const signed = options.signed ?? !!this.#keys;
        if (!secure && options.secure && !options.ignoreInsecure) {
            throw new TypeError("Cannot send secure cookie over unencrypted connection.");
        }
        const cookie = new Cookie(name, value13, options);
        cookie.secure = options.secure ?? secure;
        pushCookie(headers, cookie);
        if (signed) {
            if (!this.#keys) {
                throw new TypeError(".keys required for signed cookies.");
            }
            cookie.value = await this.#keys.sign(cookie.toString());
            cookie.name += ".sig";
            pushCookie(headers, cookie);
        }
        response.headers.delete("Set-Cookie");
        for (const header of headers){
            response.headers.append("Set-Cookie", header);
        }
        return this;
    }
    async *values() {
        const keys = this.#requestKeys();
        for (const key23 of keys){
            const value14 = await this.get(key23);
            if (value14) {
                yield value14;
            }
        }
    }
    async *[Symbol.asyncIterator]() {
        const keys = this.#requestKeys();
        for (const key24 of keys){
            const value15 = await this.get(key24);
            if (value15) {
                yield [
                    key24,
                    value15
                ];
            }
        }
    }
    [Symbol.for("Deno.customInspect")]() {
        return `${this.constructor.name} []`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        return `${options.stylize(this.constructor.name, "special")} ${inspect([], newOptions)}`;
    }
}
function equalsNaive(a5, b5) {
    if (a5.length !== b5.length) return false;
    for(let i28 = 0; i28 < b5.length; i28++){
        if (a5[i28] !== b5[i28]) return false;
    }
    return true;
}
function equalsSimd(a6, b6) {
    if (a6.length !== b6.length) return false;
    const len = a6.length;
    const compressable = Math.floor(len / 4);
    const compressedA = new Uint32Array(a6.buffer, 0, compressable);
    const compressedB = new Uint32Array(b6.buffer, 0, compressable);
    for(let i29 = compressable * 4; i29 < len; i29++){
        if (a6[i29] !== b6[i29]) return false;
    }
    for(let i1 = 0; i1 < compressedA.length; i1++){
        if (compressedA[i1] !== compressedB[i1]) return false;
    }
    return true;
}
function equals(a7, b7) {
    if (a7.length < 1000) return equalsNaive(a7, b7);
    return equalsSimd(a7, b7);
}
function concat(...buf) {
    let length = 0;
    for (const b8 of buf){
        length += b8.length;
    }
    const output = new Uint8Array(length);
    let index = 0;
    for (const b1 of buf){
        output.set(b1, index);
        index += b1.length;
    }
    return output;
}
function copy2(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const base64abc1 = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/", 
];
function encode1(data15) {
    const uint8 = typeof data15 === "string" ? new TextEncoder().encode(data15) : data15 instanceof Uint8Array ? data15 : new Uint8Array(data15);
    let result = "", i30;
    const l2 = uint8.length;
    for(i30 = 2; i30 < l2; i30 += 3){
        result += base64abc1[uint8[i30 - 2] >> 2];
        result += base64abc1[(uint8[i30 - 2] & 0x03) << 4 | uint8[i30 - 1] >> 4];
        result += base64abc1[(uint8[i30 - 1] & 0x0f) << 2 | uint8[i30] >> 6];
        result += base64abc1[uint8[i30] & 0x3f];
    }
    if (i30 === l2 + 1) {
        result += base64abc1[uint8[i30 - 2] >> 2];
        result += base64abc1[(uint8[i30 - 2] & 0x03) << 4];
        result += "==";
    }
    if (i30 === l2) {
        result += base64abc1[uint8[i30 - 2] >> 2];
        result += base64abc1[(uint8[i30 - 2] & 0x03) << 4 | uint8[i30 - 1] >> 4];
        result += base64abc1[(uint8[i30 - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
function decode1(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i31 = 0; i31 < size; i31++){
        bytes[i31] = binString.charCodeAt(i31);
    }
    return bytes;
}
const mod7 = {
    encode: encode1,
    decode: decode1
};
var Status;
(function(Status1) {
    Status1[Status1["Continue"] = 100] = "Continue";
    Status1[Status1["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    Status1[Status1["Processing"] = 102] = "Processing";
    Status1[Status1["EarlyHints"] = 103] = "EarlyHints";
    Status1[Status1["OK"] = 200] = "OK";
    Status1[Status1["Created"] = 201] = "Created";
    Status1[Status1["Accepted"] = 202] = "Accepted";
    Status1[Status1["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
    Status1[Status1["NoContent"] = 204] = "NoContent";
    Status1[Status1["ResetContent"] = 205] = "ResetContent";
    Status1[Status1["PartialContent"] = 206] = "PartialContent";
    Status1[Status1["MultiStatus"] = 207] = "MultiStatus";
    Status1[Status1["AlreadyReported"] = 208] = "AlreadyReported";
    Status1[Status1["IMUsed"] = 226] = "IMUsed";
    Status1[Status1["MultipleChoices"] = 300] = "MultipleChoices";
    Status1[Status1["MovedPermanently"] = 301] = "MovedPermanently";
    Status1[Status1["Found"] = 302] = "Found";
    Status1[Status1["SeeOther"] = 303] = "SeeOther";
    Status1[Status1["NotModified"] = 304] = "NotModified";
    Status1[Status1["UseProxy"] = 305] = "UseProxy";
    Status1[Status1["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    Status1[Status1["PermanentRedirect"] = 308] = "PermanentRedirect";
    Status1[Status1["BadRequest"] = 400] = "BadRequest";
    Status1[Status1["Unauthorized"] = 401] = "Unauthorized";
    Status1[Status1["PaymentRequired"] = 402] = "PaymentRequired";
    Status1[Status1["Forbidden"] = 403] = "Forbidden";
    Status1[Status1["NotFound"] = 404] = "NotFound";
    Status1[Status1["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    Status1[Status1["NotAcceptable"] = 406] = "NotAcceptable";
    Status1[Status1["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
    Status1[Status1["RequestTimeout"] = 408] = "RequestTimeout";
    Status1[Status1["Conflict"] = 409] = "Conflict";
    Status1[Status1["Gone"] = 410] = "Gone";
    Status1[Status1["LengthRequired"] = 411] = "LengthRequired";
    Status1[Status1["PreconditionFailed"] = 412] = "PreconditionFailed";
    Status1[Status1["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    Status1[Status1["RequestURITooLong"] = 414] = "RequestURITooLong";
    Status1[Status1["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    Status1[Status1["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    Status1[Status1["ExpectationFailed"] = 417] = "ExpectationFailed";
    Status1[Status1["Teapot"] = 418] = "Teapot";
    Status1[Status1["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    Status1[Status1["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    Status1[Status1["Locked"] = 423] = "Locked";
    Status1[Status1["FailedDependency"] = 424] = "FailedDependency";
    Status1[Status1["TooEarly"] = 425] = "TooEarly";
    Status1[Status1["UpgradeRequired"] = 426] = "UpgradeRequired";
    Status1[Status1["PreconditionRequired"] = 428] = "PreconditionRequired";
    Status1[Status1["TooManyRequests"] = 429] = "TooManyRequests";
    Status1[Status1["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    Status1[Status1["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    Status1[Status1["InternalServerError"] = 500] = "InternalServerError";
    Status1[Status1["NotImplemented"] = 501] = "NotImplemented";
    Status1[Status1["BadGateway"] = 502] = "BadGateway";
    Status1[Status1["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    Status1[Status1["GatewayTimeout"] = 504] = "GatewayTimeout";
    Status1[Status1["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    Status1[Status1["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    Status1[Status1["InsufficientStorage"] = 507] = "InsufficientStorage";
    Status1[Status1["LoopDetected"] = 508] = "LoopDetected";
    Status1[Status1["NotExtended"] = 510] = "NotExtended";
    Status1[Status1["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {}));
const STATUS_TEXT = new Map([
    [
        Status.Continue,
        "Continue"
    ],
    [
        Status.SwitchingProtocols,
        "Switching Protocols"
    ],
    [
        Status.Processing,
        "Processing"
    ],
    [
        Status.EarlyHints,
        "Early Hints"
    ],
    [
        Status.OK,
        "OK"
    ],
    [
        Status.Created,
        "Created"
    ],
    [
        Status.Accepted,
        "Accepted"
    ],
    [
        Status.NonAuthoritativeInfo,
        "Non-Authoritative Information"
    ],
    [
        Status.NoContent,
        "No Content"
    ],
    [
        Status.ResetContent,
        "Reset Content"
    ],
    [
        Status.PartialContent,
        "Partial Content"
    ],
    [
        Status.MultiStatus,
        "Multi-Status"
    ],
    [
        Status.AlreadyReported,
        "Already Reported"
    ],
    [
        Status.IMUsed,
        "IM Used"
    ],
    [
        Status.MultipleChoices,
        "Multiple Choices"
    ],
    [
        Status.MovedPermanently,
        "Moved Permanently"
    ],
    [
        Status.Found,
        "Found"
    ],
    [
        Status.SeeOther,
        "See Other"
    ],
    [
        Status.NotModified,
        "Not Modified"
    ],
    [
        Status.UseProxy,
        "Use Proxy"
    ],
    [
        Status.TemporaryRedirect,
        "Temporary Redirect"
    ],
    [
        Status.PermanentRedirect,
        "Permanent Redirect"
    ],
    [
        Status.BadRequest,
        "Bad Request"
    ],
    [
        Status.Unauthorized,
        "Unauthorized"
    ],
    [
        Status.PaymentRequired,
        "Payment Required"
    ],
    [
        Status.Forbidden,
        "Forbidden"
    ],
    [
        Status.NotFound,
        "Not Found"
    ],
    [
        Status.MethodNotAllowed,
        "Method Not Allowed"
    ],
    [
        Status.NotAcceptable,
        "Not Acceptable"
    ],
    [
        Status.ProxyAuthRequired,
        "Proxy Authentication Required"
    ],
    [
        Status.RequestTimeout,
        "Request Timeout"
    ],
    [
        Status.Conflict,
        "Conflict"
    ],
    [
        Status.Gone,
        "Gone"
    ],
    [
        Status.LengthRequired,
        "Length Required"
    ],
    [
        Status.PreconditionFailed,
        "Precondition Failed"
    ],
    [
        Status.RequestEntityTooLarge,
        "Request Entity Too Large"
    ],
    [
        Status.RequestURITooLong,
        "Request URI Too Long"
    ],
    [
        Status.UnsupportedMediaType,
        "Unsupported Media Type"
    ],
    [
        Status.RequestedRangeNotSatisfiable,
        "Requested Range Not Satisfiable"
    ],
    [
        Status.ExpectationFailed,
        "Expectation Failed"
    ],
    [
        Status.Teapot,
        "I'm a teapot"
    ],
    [
        Status.MisdirectedRequest,
        "Misdirected Request"
    ],
    [
        Status.UnprocessableEntity,
        "Unprocessable Entity"
    ],
    [
        Status.Locked,
        "Locked"
    ],
    [
        Status.FailedDependency,
        "Failed Dependency"
    ],
    [
        Status.TooEarly,
        "Too Early"
    ],
    [
        Status.UpgradeRequired,
        "Upgrade Required"
    ],
    [
        Status.PreconditionRequired,
        "Precondition Required"
    ],
    [
        Status.TooManyRequests,
        "Too Many Requests"
    ],
    [
        Status.RequestHeaderFieldsTooLarge,
        "Request Header Fields Too Large"
    ],
    [
        Status.UnavailableForLegalReasons,
        "Unavailable For Legal Reasons"
    ],
    [
        Status.InternalServerError,
        "Internal Server Error"
    ],
    [
        Status.NotImplemented,
        "Not Implemented"
    ],
    [
        Status.BadGateway,
        "Bad Gateway"
    ],
    [
        Status.ServiceUnavailable,
        "Service Unavailable"
    ],
    [
        Status.GatewayTimeout,
        "Gateway Timeout"
    ],
    [
        Status.HTTPVersionNotSupported,
        "HTTP Version Not Supported"
    ],
    [
        Status.VariantAlsoNegotiates,
        "Variant Also Negotiates"
    ],
    [
        Status.InsufficientStorage,
        "Insufficient Storage"
    ],
    [
        Status.LoopDetected,
        "Loop Detected"
    ],
    [
        Status.NotExtended,
        "Not Extended"
    ],
    [
        Status.NetworkAuthenticationRequired,
        "Network Authentication Required"
    ], 
]);
class DenoStdInternalError1 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert1(expr, msg17 = "") {
    if (!expr) {
        throw new DenoStdInternalError1(msg17);
    }
}
const MIN_READ = 32 * 1024;
const MAX_SIZE = 2 ** 32 - 2;
class Buffer {
    #buf;
    #off = 0;
    constructor(ab){
        this.#buf = ab === undefined ? new Uint8Array(0) : new Uint8Array(ab);
    }
    bytes(options = {
        copy: true
    }) {
        if (options.copy === false) return this.#buf.subarray(this.#off);
        return this.#buf.slice(this.#off);
    }
    empty() {
        return this.#buf.byteLength <= this.#off;
    }
    get length() {
        return this.#buf.byteLength - this.#off;
    }
    get capacity() {
        return this.#buf.buffer.byteLength;
    }
    truncate(n7) {
        if (n7 === 0) {
            this.reset();
            return;
        }
        if (n7 < 0 || n7 > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        this.#reslice(this.#off + n7);
    }
    reset() {
        this.#reslice(0);
        this.#off = 0;
    }
     #tryGrowByReslice(n8) {
        const l = this.#buf.byteLength;
        if (n8 <= this.capacity - l) {
            this.#reslice(l + n8);
            return l;
        }
        return -1;
    }
     #reslice(len) {
        assert1(len <= this.#buf.buffer.byteLength);
        this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    }
    readSync(p7) {
        if (this.empty()) {
            this.reset();
            if (p7.byteLength === 0) {
                return 0;
            }
            return null;
        }
        const nread = copy2(this.#buf.subarray(this.#off), p7);
        this.#off += nread;
        return nread;
    }
    read(p8) {
        const rr = this.readSync(p8);
        return Promise.resolve(rr);
    }
    writeSync(p9) {
        const m4 = this.#grow(p9.byteLength);
        return copy2(p9, this.#buf, m4);
    }
    write(p10) {
        const n1 = this.writeSync(p10);
        return Promise.resolve(n1);
    }
     #grow(n2) {
        const m = this.length;
        if (m === 0 && this.#off !== 0) {
            this.reset();
        }
        const i = this.#tryGrowByReslice(n2);
        if (i >= 0) {
            return i;
        }
        const c = this.capacity;
        if (n2 <= Math.floor(c / 2) - m) {
            copy2(this.#buf.subarray(this.#off), this.#buf);
        } else if (c + n2 > MAX_SIZE) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
        } else {
            const buf = new Uint8Array(Math.min(2 * c + n2, MAX_SIZE));
            copy2(this.#buf.subarray(this.#off), buf);
            this.#buf = buf;
        }
        this.#off = 0;
        this.#reslice(Math.min(m + n2, MAX_SIZE));
        return m;
    }
    grow(n3) {
        if (n3 < 0) {
            throw Error("Buffer.grow: negative count");
        }
        const m5 = this.#grow(n3);
        this.#reslice(m5);
    }
    async readFrom(r3) {
        let n4 = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = await r3.read(buf);
            if (nread === null) {
                return n4;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n4 += nread;
        }
    }
    readFromSync(r4) {
        let n5 = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = r4.readSync(buf);
            if (nread === null) {
                return n5;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n5 += nread;
        }
    }
}
const MIN_BUF_SIZE1 = 16;
const CR1 = "\r".charCodeAt(0);
const LF1 = "\n".charCodeAt(0);
class BufferFullError1 extends Error {
    name;
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
        this.name = "BufferFullError";
    }
    partial;
}
class PartialReadError1 extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader1 {
    #buf;
    #rd;
    #r = 0;
    #w = 0;
    #eof = false;
    static create(r5, size = 4096) {
        return r5 instanceof BufReader1 ? r5 : new BufReader1(r5, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE1;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    size() {
        return this.#buf.byteLength;
    }
    buffered() {
        return this.#w - this.#r;
    }
    #fill = async ()=>{
        if (this.#r > 0) {
            this.#buf.copyWithin(0, this.#r, this.#w);
            this.#w -= this.#r;
            this.#r = 0;
        }
        if (this.#w >= this.#buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i32 = 100; i32 > 0; i32--){
            const rr = await this.#rd.read(this.#buf.subarray(this.#w));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert1(rr >= 0, "negative read");
            this.#w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    };
    reset(r6) {
        this.#reset(this.#buf, r6);
    }
    #reset = (buf, rd)=>{
        this.#buf = buf;
        this.#rd = rd;
        this.#eof = false;
    };
    async read(p11) {
        let rr = p11.byteLength;
        if (p11.byteLength === 0) return rr;
        if (this.#r === this.#w) {
            if (p11.byteLength >= this.#buf.byteLength) {
                const rr = await this.#rd.read(p11);
                const nread = rr ?? 0;
                assert1(nread >= 0, "negative read");
                return rr;
            }
            this.#r = 0;
            this.#w = 0;
            rr = await this.#rd.read(this.#buf);
            if (rr === 0 || rr === null) return rr;
            assert1(rr >= 0, "negative read");
            this.#w += rr;
        }
        const copied = copy2(this.#buf.subarray(this.#r, this.#w), p11, 0);
        this.#r += copied;
        return copied;
    }
    async readFull(p12) {
        let bytesRead = 0;
        while(bytesRead < p12.length){
            try {
                const rr = await this.read(p12.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError1();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError1) {
                    err.partial = p12.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e9 = new PartialReadError1();
                    e9.partial = p12.subarray(0, bytesRead);
                    e9.stack = err.stack;
                    e9.message = err.message;
                    e9.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p12;
    }
    async readByte() {
        while(this.#r === this.#w){
            if (this.#eof) return null;
            await this.#fill();
        }
        const c9 = this.#buf[this.#r];
        this.#r++;
        return c9;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF1);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError1) {
                partial = err.partial;
                assert1(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError1)) {
                throw err;
            }
            partial = err.partial;
            if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR1) {
                assert1(this.#r > 0, "bufio: tried to rewind past start of buffer");
                this.#r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.#eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF1) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR1) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s6 = 0;
        let slice;
        while(true){
            let i33 = this.#buf.subarray(this.#r + s6, this.#w).indexOf(delim);
            if (i33 >= 0) {
                i33 += s6;
                slice = this.#buf.subarray(this.#r, this.#r + i33 + 1);
                this.#r += i33 + 1;
                break;
            }
            if (this.#eof) {
                if (this.#r === this.#w) {
                    return null;
                }
                slice = this.#buf.subarray(this.#r, this.#w);
                this.#r = this.#w;
                break;
            }
            if (this.buffered() >= this.#buf.byteLength) {
                this.#r = this.#w;
                const oldbuf = this.#buf;
                const newbuf = this.#buf.slice(0);
                this.#buf = newbuf;
                throw new BufferFullError1(oldbuf);
            }
            s6 = this.#w - this.#r;
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError1) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e10 = new PartialReadError1();
                    e10.partial = slice;
                    e10.stack = err.stack;
                    e10.message = err.message;
                    e10.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.#w - this.#r;
        while(avail < n6 && avail < this.#buf.byteLength && !this.#eof){
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError1) {
                    err.partial = this.#buf.subarray(this.#r, this.#w);
                } else if (err instanceof Error) {
                    const e11 = new PartialReadError1();
                    e11.partial = this.#buf.subarray(this.#r, this.#w);
                    e11.stack = err.stack;
                    e11.message = err.message;
                    e11.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.#w - this.#r;
        }
        if (avail === 0 && this.#eof) {
            return null;
        } else if (avail < n6 && this.#eof) {
            return this.#buf.subarray(this.#r, this.#r + avail);
        } else if (avail < n6) {
            throw new BufferFullError1(this.#buf.subarray(this.#r, this.#w));
        }
        return this.#buf.subarray(this.#r, this.#r + n6);
    }
}
class AbstractBufBase1 {
    buf;
    usedBufferBytes = 0;
    err = null;
    constructor(buf){
        this.buf = buf;
    }
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter1 extends AbstractBufBase1 {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriter1 ? writer : new BufWriter1(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w3) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w3;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p13 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p13.length){
                nwritten += await this.#writer.write(p13.subarray(nwritten));
            }
        } catch (e12) {
            if (e12 instanceof Error) {
                this.err = e12;
            }
            throw e12;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data16) {
        if (this.err !== null) throw this.err;
        if (data16.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data16.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.#writer.write(data16);
                } catch (e13) {
                    if (e13 instanceof Error) {
                        this.err = e13;
                    }
                    throw e13;
                }
            } else {
                numBytesWritten = copy2(data16, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data16 = data16.subarray(numBytesWritten);
        }
        numBytesWritten = copy2(data16, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync1 extends AbstractBufBase1 {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync1 ? writer : new BufWriterSync1(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w4) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w4;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p14 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p14.length){
                nwritten += this.#writer.writeSync(p14.subarray(nwritten));
            }
        } catch (e14) {
            if (e14 instanceof Error) {
                this.err = e14;
            }
            throw e14;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data17) {
        if (this.err !== null) throw this.err;
        if (data17.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data17.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.#writer.writeSync(data17);
                } catch (e15) {
                    if (e15 instanceof Error) {
                        this.err = e15;
                    }
                    throw e15;
                }
            } else {
                numBytesWritten = copy2(data17, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data17 = data17.subarray(numBytesWritten);
        }
        numBytesWritten = copy2(data17, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class LimitedReader {
    constructor(reader, limit){
        this.reader = reader;
        this.limit = limit;
    }
    async read(p15) {
        if (this.limit <= 0) {
            return null;
        }
        if (p15.length > this.limit) {
            p15 = p15.subarray(0, this.limit);
        }
        const n9 = await this.reader.read(p15);
        if (n9 == null) {
            return null;
        }
        this.limit -= n9;
        return n9;
    }
    reader;
    limit;
}
function readerFromStreamReader(streamReader) {
    const buffer = new Buffer();
    return {
        async read (p16) {
            if (buffer.empty()) {
                const res = await streamReader.read();
                if (res.done) {
                    return null;
                }
                await writeAll(buffer, res.value);
            }
            return buffer.read(p16);
        }
    };
}
async function readAll(r7) {
    const buf = new Buffer();
    await buf.readFrom(r7);
    return buf.bytes();
}
async function writeAll(w5, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += await w5.write(arr.subarray(nwritten));
    }
}
const osType1 = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator  } = globalThis;
    if (navigator?.appVersion?.includes?.("Win")) {
        return "windows";
    }
    return "linux";
})();
const isWindows1 = osType1 === "windows";
const CHAR_FORWARD_SLASH1 = 47;
function assertPath1(path37) {
    if (typeof path37 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path37)}`);
    }
}
function isPosixPathSeparator1(code18) {
    return code18 === 47;
}
function isPathSeparator1(code19) {
    return isPosixPathSeparator1(code19) || code19 === 92;
}
function isWindowsDeviceRoot1(code20) {
    return code20 >= 97 && code20 <= 122 || code20 >= 65 && code20 <= 90;
}
function normalizeString1(path38, allowAboveRoot, separator, isPathSeparator11) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code21;
    for(let i34 = 0, len1 = path38.length; i34 <= len1; ++i34){
        if (i34 < len1) code21 = path38.charCodeAt(i34);
        else if (isPathSeparator11(code21)) break;
        else code21 = CHAR_FORWARD_SLASH1;
        if (isPathSeparator11(code21)) {
            if (lastSlash === i34 - 1 || dots === 1) {} else if (lastSlash !== i34 - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i34;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i34;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path38.slice(lastSlash + 1, i34);
                else res = path38.slice(lastSlash + 1, i34);
                lastSegmentLength = i34 - lastSlash - 1;
            }
            lastSlash = i34;
            dots = 0;
        } else if (code21 === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep9, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep9 + base;
}
const WHITESPACE_ENCODINGS1 = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace1(string) {
    return string.replaceAll(/[\s]/g, (c10)=>{
        return WHITESPACE_ENCODINGS1[c10] ?? c10;
    });
}
const sep3 = "\\";
const delimiter3 = ";";
function resolve3(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i35 = pathSegments.length - 1; i35 >= -1; i35--){
        let path39;
        const { Deno  } = globalThis;
        if (i35 >= 0) {
            path39 = pathSegments[i35];
        } else if (!resolvedDevice) {
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path39 = Deno.cwd();
        } else {
            if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path39 = Deno.cwd();
            if (path39 === undefined || path39.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path39 = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path39);
        const len2 = path39.length;
        if (len2 === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute11 = false;
        const code22 = path39.charCodeAt(0);
        if (len2 > 1) {
            if (isPathSeparator1(code22)) {
                isAbsolute11 = true;
                if (isPathSeparator1(path39.charCodeAt(1))) {
                    let j7 = 2;
                    let last = j7;
                    for(; j7 < len2; ++j7){
                        if (isPathSeparator1(path39.charCodeAt(j7))) break;
                    }
                    if (j7 < len2 && j7 !== last) {
                        const firstPart = path39.slice(last, j7);
                        last = j7;
                        for(; j7 < len2; ++j7){
                            if (!isPathSeparator1(path39.charCodeAt(j7))) break;
                        }
                        if (j7 < len2 && j7 !== last) {
                            last = j7;
                            for(; j7 < len2; ++j7){
                                if (isPathSeparator1(path39.charCodeAt(j7))) break;
                            }
                            if (j7 === len2) {
                                device = `\\\\${firstPart}\\${path39.slice(last)}`;
                                rootEnd = j7;
                            } else if (j7 !== last) {
                                device = `\\\\${firstPart}\\${path39.slice(last, j7)}`;
                                rootEnd = j7;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code22)) {
                if (path39.charCodeAt(1) === 58) {
                    device = path39.slice(0, 2);
                    rootEnd = 2;
                    if (len2 > 2) {
                        if (isPathSeparator1(path39.charCodeAt(2))) {
                            isAbsolute11 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator1(code22)) {
            rootEnd = 1;
            isAbsolute11 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path39.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute11;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize4(path40) {
    assertPath1(path40);
    const len3 = path40.length;
    if (len3 === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute21 = false;
    const code23 = path40.charCodeAt(0);
    if (len3 > 1) {
        if (isPathSeparator1(code23)) {
            isAbsolute21 = true;
            if (isPathSeparator1(path40.charCodeAt(1))) {
                let j8 = 2;
                let last = j8;
                for(; j8 < len3; ++j8){
                    if (isPathSeparator1(path40.charCodeAt(j8))) break;
                }
                if (j8 < len3 && j8 !== last) {
                    const firstPart = path40.slice(last, j8);
                    last = j8;
                    for(; j8 < len3; ++j8){
                        if (!isPathSeparator1(path40.charCodeAt(j8))) break;
                    }
                    if (j8 < len3 && j8 !== last) {
                        last = j8;
                        for(; j8 < len3; ++j8){
                            if (isPathSeparator1(path40.charCodeAt(j8))) break;
                        }
                        if (j8 === len3) {
                            return `\\\\${firstPart}\\${path40.slice(last)}\\`;
                        } else if (j8 !== last) {
                            device = `\\\\${firstPart}\\${path40.slice(last, j8)}`;
                            rootEnd = j8;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code23)) {
            if (path40.charCodeAt(1) === 58) {
                device = path40.slice(0, 2);
                rootEnd = 2;
                if (len3 > 2) {
                    if (isPathSeparator1(path40.charCodeAt(2))) {
                        isAbsolute21 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator1(code23)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len3) {
        tail = normalizeString1(path40.slice(rootEnd), !isAbsolute21, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute21) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path40.charCodeAt(len3 - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute21) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute21) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute3(path41) {
    assertPath1(path41);
    const len4 = path41.length;
    if (len4 === 0) return false;
    const code24 = path41.charCodeAt(0);
    if (isPathSeparator1(code24)) {
        return true;
    } else if (isWindowsDeviceRoot1(code24)) {
        if (len4 > 2 && path41.charCodeAt(1) === 58) {
            if (isPathSeparator1(path41.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join4(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i36 = 0; i36 < pathsCount; ++i36){
        const path42 = paths[i36];
        assertPath1(path42);
        if (path42.length > 0) {
            if (joined === undefined) joined = firstPart = path42;
            else joined += `\\${path42}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert1(firstPart != null);
    if (isPathSeparator1(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator1(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator1(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator1(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize4(joined);
}
function relative3(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    const fromOrig = resolve3(from);
    const toOrig = resolve3(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i37 = 0;
    for(; i37 <= length; ++i37){
        if (i37 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i37) === 92) {
                    return toOrig.slice(toStart + i37 + 1);
                } else if (i37 === 2) {
                    return toOrig.slice(toStart + i37);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i37) === 92) {
                    lastCommonSep = i37;
                } else if (i37 === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i37);
        const toCode = to.charCodeAt(toStart + i37);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i37;
    }
    if (i37 !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i37 = fromStart + lastCommonSep + 1; i37 <= fromEnd; ++i37){
        if (i37 === fromEnd || from.charCodeAt(i37) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath3(path43) {
    if (typeof path43 !== "string") return path43;
    if (path43.length === 0) return "";
    const resolvedPath = resolve3(path43);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code25 = resolvedPath.charCodeAt(2);
                if (code25 !== 63 && code25 !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot1(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path43;
}
function dirname3(path44) {
    assertPath1(path44);
    const len5 = path44.length;
    if (len5 === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code26 = path44.charCodeAt(0);
    if (len5 > 1) {
        if (isPathSeparator1(code26)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path44.charCodeAt(1))) {
                let j9 = 2;
                let last = j9;
                for(; j9 < len5; ++j9){
                    if (isPathSeparator1(path44.charCodeAt(j9))) break;
                }
                if (j9 < len5 && j9 !== last) {
                    last = j9;
                    for(; j9 < len5; ++j9){
                        if (!isPathSeparator1(path44.charCodeAt(j9))) break;
                    }
                    if (j9 < len5 && j9 !== last) {
                        last = j9;
                        for(; j9 < len5; ++j9){
                            if (isPathSeparator1(path44.charCodeAt(j9))) break;
                        }
                        if (j9 === len5) {
                            return path44;
                        }
                        if (j9 !== last) {
                            rootEnd = offset = j9 + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code26)) {
            if (path44.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len5 > 2) {
                    if (isPathSeparator1(path44.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code26)) {
        return path44;
    }
    for(let i38 = len5 - 1; i38 >= offset; --i38){
        if (isPathSeparator1(path44.charCodeAt(i38))) {
            if (!matchedSlash) {
                end = i38;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path44.slice(0, end);
}
function basename3(path45, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path45);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i39;
    if (path45.length >= 2) {
        const drive = path45.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path45.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path45.length) {
        if (ext.length === path45.length && ext === path45) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i39 = path45.length - 1; i39 >= start; --i39){
            const code27 = path45.charCodeAt(i39);
            if (isPathSeparator1(code27)) {
                if (!matchedSlash) {
                    start = i39 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i39 + 1;
                }
                if (extIdx >= 0) {
                    if (code27 === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i39;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path45.length;
        return path45.slice(start, end);
    } else {
        for(i39 = path45.length - 1; i39 >= start; --i39){
            if (isPathSeparator1(path45.charCodeAt(i39))) {
                if (!matchedSlash) {
                    start = i39 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i39 + 1;
            }
        }
        if (end === -1) return "";
        return path45.slice(start, end);
    }
}
function extname3(path46) {
    assertPath1(path46);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path46.length >= 2 && path46.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path46.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i40 = path46.length - 1; i40 >= start; --i40){
        const code28 = path46.charCodeAt(i40);
        if (isPathSeparator1(code28)) {
            if (!matchedSlash) {
                startPart = i40 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i40 + 1;
        }
        if (code28 === 46) {
            if (startDot === -1) startDot = i40;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path46.slice(startDot, end);
}
function format4(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("\\", pathObject);
}
function parse4(path47) {
    assertPath1(path47);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len6 = path47.length;
    if (len6 === 0) return ret;
    let rootEnd = 0;
    let code29 = path47.charCodeAt(0);
    if (len6 > 1) {
        if (isPathSeparator1(code29)) {
            rootEnd = 1;
            if (isPathSeparator1(path47.charCodeAt(1))) {
                let j10 = 2;
                let last = j10;
                for(; j10 < len6; ++j10){
                    if (isPathSeparator1(path47.charCodeAt(j10))) break;
                }
                if (j10 < len6 && j10 !== last) {
                    last = j10;
                    for(; j10 < len6; ++j10){
                        if (!isPathSeparator1(path47.charCodeAt(j10))) break;
                    }
                    if (j10 < len6 && j10 !== last) {
                        last = j10;
                        for(; j10 < len6; ++j10){
                            if (isPathSeparator1(path47.charCodeAt(j10))) break;
                        }
                        if (j10 === len6) {
                            rootEnd = j10;
                        } else if (j10 !== last) {
                            rootEnd = j10 + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code29)) {
            if (path47.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len6 > 2) {
                    if (isPathSeparator1(path47.charCodeAt(2))) {
                        if (len6 === 3) {
                            ret.root = ret.dir = path47;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path47;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code29)) {
        ret.root = ret.dir = path47;
        return ret;
    }
    if (rootEnd > 0) ret.root = path47.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i41 = path47.length - 1;
    let preDotState = 0;
    for(; i41 >= rootEnd; --i41){
        code29 = path47.charCodeAt(i41);
        if (isPathSeparator1(code29)) {
            if (!matchedSlash) {
                startPart = i41 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i41 + 1;
        }
        if (code29 === 46) {
            if (startDot === -1) startDot = i41;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path47.slice(startPart, end);
        }
    } else {
        ret.name = path47.slice(startPart, startDot);
        ret.base = path47.slice(startPart, end);
        ret.ext = path47.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path47.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl3(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path48 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path48 = `\\\\${url.hostname}${path48}`;
    }
    return path48;
}
function toFileUrl3(path49) {
    if (!isAbsolute3(path49)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname2, pathname] = path49.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(pathname.replace(/%/g, "%25"));
    if (hostname2 != null && hostname2 != "localhost") {
        url.hostname = hostname2;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod8 = {
    sep: sep3,
    delimiter: delimiter3,
    resolve: resolve3,
    normalize: normalize4,
    isAbsolute: isAbsolute3,
    join: join4,
    relative: relative3,
    toNamespacedPath: toNamespacedPath3,
    dirname: dirname3,
    basename: basename3,
    extname: extname3,
    format: format4,
    parse: parse4,
    fromFileUrl: fromFileUrl3,
    toFileUrl: toFileUrl3
};
const sep4 = "/";
const delimiter4 = ":";
function resolve4(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i42 = pathSegments.length - 1; i42 >= -1 && !resolvedAbsolute; i42--){
        let path50;
        if (i42 >= 0) path50 = pathSegments[i42];
        else {
            const { Deno  } = globalThis;
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path50 = Deno.cwd();
        }
        assertPath1(path50);
        if (path50.length === 0) {
            continue;
        }
        resolvedPath = `${path50}/${resolvedPath}`;
        resolvedAbsolute = path50.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize5(path51) {
    assertPath1(path51);
    if (path51.length === 0) return ".";
    const isAbsolute12 = path51.charCodeAt(0) === 47;
    const trailingSeparator = path51.charCodeAt(path51.length - 1) === 47;
    path51 = normalizeString1(path51, !isAbsolute12, "/", isPosixPathSeparator1);
    if (path51.length === 0 && !isAbsolute12) path51 = ".";
    if (path51.length > 0 && trailingSeparator) path51 += "/";
    if (isAbsolute12) return `/${path51}`;
    return path51;
}
function isAbsolute4(path52) {
    assertPath1(path52);
    return path52.length > 0 && path52.charCodeAt(0) === 47;
}
function join5(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i43 = 0, len7 = paths.length; i43 < len7; ++i43){
        const path53 = paths[i43];
        assertPath1(path53);
        if (path53.length > 0) {
            if (!joined) joined = path53;
            else joined += `/${path53}`;
        }
    }
    if (!joined) return ".";
    return normalize5(joined);
}
function relative4(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve4(from);
    to = resolve4(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i44 = 0;
    for(; i44 <= length; ++i44){
        if (i44 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i44) === 47) {
                    return to.slice(toStart + i44 + 1);
                } else if (i44 === 0) {
                    return to.slice(toStart + i44);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i44) === 47) {
                    lastCommonSep = i44;
                } else if (i44 === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i44);
        const toCode = to.charCodeAt(toStart + i44);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i44;
    }
    let out = "";
    for(i44 = fromStart + lastCommonSep + 1; i44 <= fromEnd; ++i44){
        if (i44 === fromEnd || from.charCodeAt(i44) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath4(path54) {
    return path54;
}
function dirname4(path55) {
    assertPath1(path55);
    if (path55.length === 0) return ".";
    const hasRoot = path55.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i45 = path55.length - 1; i45 >= 1; --i45){
        if (path55.charCodeAt(i45) === 47) {
            if (!matchedSlash) {
                end = i45;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path55.slice(0, end);
}
function basename4(path56, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path56);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i46;
    if (ext !== undefined && ext.length > 0 && ext.length <= path56.length) {
        if (ext.length === path56.length && ext === path56) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i46 = path56.length - 1; i46 >= 0; --i46){
            const code30 = path56.charCodeAt(i46);
            if (code30 === 47) {
                if (!matchedSlash) {
                    start = i46 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i46 + 1;
                }
                if (extIdx >= 0) {
                    if (code30 === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i46;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path56.length;
        return path56.slice(start, end);
    } else {
        for(i46 = path56.length - 1; i46 >= 0; --i46){
            if (path56.charCodeAt(i46) === 47) {
                if (!matchedSlash) {
                    start = i46 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i46 + 1;
            }
        }
        if (end === -1) return "";
        return path56.slice(start, end);
    }
}
function extname4(path57) {
    assertPath1(path57);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i47 = path57.length - 1; i47 >= 0; --i47){
        const code31 = path57.charCodeAt(i47);
        if (code31 === 47) {
            if (!matchedSlash) {
                startPart = i47 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i47 + 1;
        }
        if (code31 === 46) {
            if (startDot === -1) startDot = i47;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path57.slice(startDot, end);
}
function format5(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("/", pathObject);
}
function parse5(path58) {
    assertPath1(path58);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path58.length === 0) return ret;
    const isAbsolute22 = path58.charCodeAt(0) === 47;
    let start;
    if (isAbsolute22) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i48 = path58.length - 1;
    let preDotState = 0;
    for(; i48 >= start; --i48){
        const code32 = path58.charCodeAt(i48);
        if (code32 === 47) {
            if (!matchedSlash) {
                startPart = i48 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i48 + 1;
        }
        if (code32 === 46) {
            if (startDot === -1) startDot = i48;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute22) {
                ret.base = ret.name = path58.slice(1, end);
            } else {
                ret.base = ret.name = path58.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute22) {
            ret.name = path58.slice(1, startDot);
            ret.base = path58.slice(1, end);
        } else {
            ret.name = path58.slice(startPart, startDot);
            ret.base = path58.slice(startPart, end);
        }
        ret.ext = path58.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path58.slice(0, startPart - 1);
    else if (isAbsolute22) ret.dir = "/";
    return ret;
}
function fromFileUrl4(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl4(path59) {
    if (!isAbsolute4(path59)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(path59.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod9 = {
    sep: sep4,
    delimiter: delimiter4,
    resolve: resolve4,
    normalize: normalize5,
    isAbsolute: isAbsolute4,
    join: join5,
    relative: relative4,
    toNamespacedPath: toNamespacedPath4,
    dirname: dirname4,
    basename: basename4,
    extname: extname4,
    format: format5,
    parse: parse5,
    fromFileUrl: fromFileUrl4,
    toFileUrl: toFileUrl4
};
const path2 = isWindows1 ? mod8 : mod9;
const { join: join6 , normalize: normalize6  } = path2;
const path3 = isWindows1 ? mod8 : mod9;
const { basename: basename5 , delimiter: delimiter5 , dirname: dirname5 , extname: extname5 , format: format6 , fromFileUrl: fromFileUrl5 , isAbsolute: isAbsolute5 , join: join7 , normalize: normalize7 , parse: parse6 , relative: relative5 , resolve: resolve5 , sep: sep5 , toFileUrl: toFileUrl5 , toNamespacedPath: toNamespacedPath5 ,  } = path3;
const __default = JSON.parse(`{
  "application/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "application/3gpdash-qoe-report+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/3gpp-ims+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/3gpphal+json": {
    "source": "iana",
    "compressible": true
  },
  "application/3gpphalforms+json": {
    "source": "iana",
    "compressible": true
  },
  "application/a2l": {
    "source": "iana"
  },
  "application/ace+cbor": {
    "source": "iana"
  },
  "application/activemessage": {
    "source": "iana"
  },
  "application/activity+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-costmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-costmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-directory+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcost+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointcostparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointprop+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-endpointpropparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-error+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-networkmapfilter+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-updatestreamcontrol+json": {
    "source": "iana",
    "compressible": true
  },
  "application/alto-updatestreamparams+json": {
    "source": "iana",
    "compressible": true
  },
  "application/aml": {
    "source": "iana"
  },
  "application/andrew-inset": {
    "source": "iana",
    "extensions": ["ez"]
  },
  "application/applefile": {
    "source": "iana"
  },
  "application/applixware": {
    "source": "apache",
    "extensions": ["aw"]
  },
  "application/at+jwt": {
    "source": "iana"
  },
  "application/atf": {
    "source": "iana"
  },
  "application/atfx": {
    "source": "iana"
  },
  "application/atom+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atom"]
  },
  "application/atomcat+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomcat"]
  },
  "application/atomdeleted+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomdeleted"]
  },
  "application/atomicmail": {
    "source": "iana"
  },
  "application/atomsvc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["atomsvc"]
  },
  "application/atsc-dwd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dwd"]
  },
  "application/atsc-dynamic-event-message": {
    "source": "iana"
  },
  "application/atsc-held+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["held"]
  },
  "application/atsc-rdt+json": {
    "source": "iana",
    "compressible": true
  },
  "application/atsc-rsat+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rsat"]
  },
  "application/atxml": {
    "source": "iana"
  },
  "application/auth-policy+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/bacnet-xdd+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/batch-smtp": {
    "source": "iana"
  },
  "application/bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/beep+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/calendar+json": {
    "source": "iana",
    "compressible": true
  },
  "application/calendar+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xcs"]
  },
  "application/call-completion": {
    "source": "iana"
  },
  "application/cals-1840": {
    "source": "iana"
  },
  "application/captive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/cbor": {
    "source": "iana"
  },
  "application/cbor-seq": {
    "source": "iana"
  },
  "application/cccex": {
    "source": "iana"
  },
  "application/ccmp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ccxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ccxml"]
  },
  "application/cdfx+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["cdfx"]
  },
  "application/cdmi-capability": {
    "source": "iana",
    "extensions": ["cdmia"]
  },
  "application/cdmi-container": {
    "source": "iana",
    "extensions": ["cdmic"]
  },
  "application/cdmi-domain": {
    "source": "iana",
    "extensions": ["cdmid"]
  },
  "application/cdmi-object": {
    "source": "iana",
    "extensions": ["cdmio"]
  },
  "application/cdmi-queue": {
    "source": "iana",
    "extensions": ["cdmiq"]
  },
  "application/cdni": {
    "source": "iana"
  },
  "application/cea": {
    "source": "iana"
  },
  "application/cea-2018+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cellml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cfw": {
    "source": "iana"
  },
  "application/city+json": {
    "source": "iana",
    "compressible": true
  },
  "application/clr": {
    "source": "iana"
  },
  "application/clue+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/clue_info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cms": {
    "source": "iana"
  },
  "application/cnrp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/coap-group+json": {
    "source": "iana",
    "compressible": true
  },
  "application/coap-payload": {
    "source": "iana"
  },
  "application/commonground": {
    "source": "iana"
  },
  "application/conference-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cose": {
    "source": "iana"
  },
  "application/cose-key": {
    "source": "iana"
  },
  "application/cose-key-set": {
    "source": "iana"
  },
  "application/cpl+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["cpl"]
  },
  "application/csrattrs": {
    "source": "iana"
  },
  "application/csta+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/cstadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/csvm+json": {
    "source": "iana",
    "compressible": true
  },
  "application/cu-seeme": {
    "source": "apache",
    "extensions": ["cu"]
  },
  "application/cwt": {
    "source": "iana"
  },
  "application/cybercash": {
    "source": "iana"
  },
  "application/dart": {
    "compressible": true
  },
  "application/dash+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpd"]
  },
  "application/dash-patch+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpp"]
  },
  "application/dashdelta": {
    "source": "iana"
  },
  "application/davmount+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["davmount"]
  },
  "application/dca-rft": {
    "source": "iana"
  },
  "application/dcd": {
    "source": "iana"
  },
  "application/dec-dx": {
    "source": "iana"
  },
  "application/dialog-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dicom": {
    "source": "iana"
  },
  "application/dicom+json": {
    "source": "iana",
    "compressible": true
  },
  "application/dicom+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dii": {
    "source": "iana"
  },
  "application/dit": {
    "source": "iana"
  },
  "application/dns": {
    "source": "iana"
  },
  "application/dns+json": {
    "source": "iana",
    "compressible": true
  },
  "application/dns-message": {
    "source": "iana"
  },
  "application/docbook+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["dbk"]
  },
  "application/dots+cbor": {
    "source": "iana"
  },
  "application/dskpp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/dssc+der": {
    "source": "iana",
    "extensions": ["dssc"]
  },
  "application/dssc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdssc"]
  },
  "application/dvcs": {
    "source": "iana"
  },
  "application/ecmascript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["es","ecma"]
  },
  "application/edi-consent": {
    "source": "iana"
  },
  "application/edi-x12": {
    "source": "iana",
    "compressible": false
  },
  "application/edifact": {
    "source": "iana",
    "compressible": false
  },
  "application/efi": {
    "source": "iana"
  },
  "application/elm+json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/elm+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.cap+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/emergencycalldata.comment+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.deviceinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.ecall.msd": {
    "source": "iana"
  },
  "application/emergencycalldata.providerinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.serviceinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.subscriberinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emergencycalldata.veds+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/emma+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["emma"]
  },
  "application/emotionml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["emotionml"]
  },
  "application/encaprtp": {
    "source": "iana"
  },
  "application/epp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/epub+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["epub"]
  },
  "application/eshop": {
    "source": "iana"
  },
  "application/exi": {
    "source": "iana",
    "extensions": ["exi"]
  },
  "application/expect-ct-report+json": {
    "source": "iana",
    "compressible": true
  },
  "application/express": {
    "source": "iana",
    "extensions": ["exp"]
  },
  "application/fastinfoset": {
    "source": "iana"
  },
  "application/fastsoap": {
    "source": "iana"
  },
  "application/fdt+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["fdt"]
  },
  "application/fhir+json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/fhir+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/fido.trusted-apps+json": {
    "compressible": true
  },
  "application/fits": {
    "source": "iana"
  },
  "application/flexfec": {
    "source": "iana"
  },
  "application/font-sfnt": {
    "source": "iana"
  },
  "application/font-tdpfr": {
    "source": "iana",
    "extensions": ["pfr"]
  },
  "application/font-woff": {
    "source": "iana",
    "compressible": false
  },
  "application/framework-attributes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/geo+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["geojson"]
  },
  "application/geo+json-seq": {
    "source": "iana"
  },
  "application/geopackage+sqlite3": {
    "source": "iana"
  },
  "application/geoxacml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/gltf-buffer": {
    "source": "iana"
  },
  "application/gml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["gml"]
  },
  "application/gpx+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["gpx"]
  },
  "application/gxf": {
    "source": "apache",
    "extensions": ["gxf"]
  },
  "application/gzip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["gz"]
  },
  "application/h224": {
    "source": "iana"
  },
  "application/held+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/hjson": {
    "extensions": ["hjson"]
  },
  "application/http": {
    "source": "iana"
  },
  "application/hyperstudio": {
    "source": "iana",
    "extensions": ["stk"]
  },
  "application/ibe-key-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ibe-pkg-reply+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ibe-pp-data": {
    "source": "iana"
  },
  "application/iges": {
    "source": "iana"
  },
  "application/im-iscomposing+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/index": {
    "source": "iana"
  },
  "application/index.cmd": {
    "source": "iana"
  },
  "application/index.obj": {
    "source": "iana"
  },
  "application/index.response": {
    "source": "iana"
  },
  "application/index.vnd": {
    "source": "iana"
  },
  "application/inkml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ink","inkml"]
  },
  "application/iotp": {
    "source": "iana"
  },
  "application/ipfix": {
    "source": "iana",
    "extensions": ["ipfix"]
  },
  "application/ipp": {
    "source": "iana"
  },
  "application/isup": {
    "source": "iana"
  },
  "application/its+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["its"]
  },
  "application/java-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jar","war","ear"]
  },
  "application/java-serialized-object": {
    "source": "apache",
    "compressible": false,
    "extensions": ["ser"]
  },
  "application/java-vm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["class"]
  },
  "application/javascript": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["js","mjs"]
  },
  "application/jf2feed+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jose": {
    "source": "iana"
  },
  "application/jose+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jrd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jscalendar+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["json","map"]
  },
  "application/json-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/json-seq": {
    "source": "iana"
  },
  "application/json5": {
    "extensions": ["json5"]
  },
  "application/jsonml+json": {
    "source": "apache",
    "compressible": true,
    "extensions": ["jsonml"]
  },
  "application/jwk+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwk-set+json": {
    "source": "iana",
    "compressible": true
  },
  "application/jwt": {
    "source": "iana"
  },
  "application/kpml-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/kpml-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/ld+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["jsonld"]
  },
  "application/lgr+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lgr"]
  },
  "application/link-format": {
    "source": "iana"
  },
  "application/load-control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/lost+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lostxml"]
  },
  "application/lostsync+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/lpf+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/lxf": {
    "source": "iana"
  },
  "application/mac-binhex40": {
    "source": "iana",
    "extensions": ["hqx"]
  },
  "application/mac-compactpro": {
    "source": "apache",
    "extensions": ["cpt"]
  },
  "application/macwriteii": {
    "source": "iana"
  },
  "application/mads+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mads"]
  },
  "application/manifest+json": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["webmanifest"]
  },
  "application/marc": {
    "source": "iana",
    "extensions": ["mrc"]
  },
  "application/marcxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mrcx"]
  },
  "application/mathematica": {
    "source": "iana",
    "extensions": ["ma","nb","mb"]
  },
  "application/mathml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mathml"]
  },
  "application/mathml-content+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mathml-presentation+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-associated-procedure-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-deregister+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-envelope+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-msk+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-msk-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-protection-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-reception-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-register+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-register-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-schedule+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbms-user-service-description+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mbox": {
    "source": "iana",
    "extensions": ["mbox"]
  },
  "application/media-policy-dataset+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpf"]
  },
  "application/media_control+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mediaservercontrol+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mscml"]
  },
  "application/merge-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/metalink+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["metalink"]
  },
  "application/metalink4+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["meta4"]
  },
  "application/mets+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mets"]
  },
  "application/mf4": {
    "source": "iana"
  },
  "application/mikey": {
    "source": "iana"
  },
  "application/mipc": {
    "source": "iana"
  },
  "application/missing-blocks+cbor-seq": {
    "source": "iana"
  },
  "application/mmt-aei+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["maei"]
  },
  "application/mmt-usd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["musd"]
  },
  "application/mods+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mods"]
  },
  "application/moss-keys": {
    "source": "iana"
  },
  "application/moss-signature": {
    "source": "iana"
  },
  "application/mosskey-data": {
    "source": "iana"
  },
  "application/mosskey-request": {
    "source": "iana"
  },
  "application/mp21": {
    "source": "iana",
    "extensions": ["m21","mp21"]
  },
  "application/mp4": {
    "source": "iana",
    "extensions": ["mp4s","m4p"]
  },
  "application/mpeg4-generic": {
    "source": "iana"
  },
  "application/mpeg4-iod": {
    "source": "iana"
  },
  "application/mpeg4-iod-xmt": {
    "source": "iana"
  },
  "application/mrb-consumer+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/mrb-publish+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/msc-ivr+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/msc-mixer+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/msword": {
    "source": "iana",
    "compressible": false,
    "extensions": ["doc","dot"]
  },
  "application/mud+json": {
    "source": "iana",
    "compressible": true
  },
  "application/multipart-core": {
    "source": "iana"
  },
  "application/mxf": {
    "source": "iana",
    "extensions": ["mxf"]
  },
  "application/n-quads": {
    "source": "iana",
    "extensions": ["nq"]
  },
  "application/n-triples": {
    "source": "iana",
    "extensions": ["nt"]
  },
  "application/nasdata": {
    "source": "iana"
  },
  "application/news-checkgroups": {
    "source": "iana",
    "charset": "US-ASCII"
  },
  "application/news-groupinfo": {
    "source": "iana",
    "charset": "US-ASCII"
  },
  "application/news-transmission": {
    "source": "iana"
  },
  "application/nlsml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/node": {
    "source": "iana",
    "extensions": ["cjs"]
  },
  "application/nss": {
    "source": "iana"
  },
  "application/oauth-authz-req+jwt": {
    "source": "iana"
  },
  "application/oblivious-dns-message": {
    "source": "iana"
  },
  "application/ocsp-request": {
    "source": "iana"
  },
  "application/ocsp-response": {
    "source": "iana"
  },
  "application/octet-stream": {
    "source": "iana",
    "compressible": false,
    "extensions": ["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]
  },
  "application/oda": {
    "source": "iana",
    "extensions": ["oda"]
  },
  "application/odm+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/odx": {
    "source": "iana"
  },
  "application/oebps-package+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["opf"]
  },
  "application/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ogx"]
  },
  "application/omdoc+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["omdoc"]
  },
  "application/onenote": {
    "source": "apache",
    "extensions": ["onetoc","onetoc2","onetmp","onepkg"]
  },
  "application/opc-nodeset+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/oscore": {
    "source": "iana"
  },
  "application/oxps": {
    "source": "iana",
    "extensions": ["oxps"]
  },
  "application/p21": {
    "source": "iana"
  },
  "application/p21+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/p2p-overlay+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["relo"]
  },
  "application/parityfec": {
    "source": "iana"
  },
  "application/passport": {
    "source": "iana"
  },
  "application/patch-ops-error+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xer"]
  },
  "application/pdf": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pdf"]
  },
  "application/pdx": {
    "source": "iana"
  },
  "application/pem-certificate-chain": {
    "source": "iana"
  },
  "application/pgp-encrypted": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pgp"]
  },
  "application/pgp-keys": {
    "source": "iana",
    "extensions": ["asc"]
  },
  "application/pgp-signature": {
    "source": "iana",
    "extensions": ["asc","sig"]
  },
  "application/pics-rules": {
    "source": "apache",
    "extensions": ["prf"]
  },
  "application/pidf+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/pidf-diff+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/pkcs10": {
    "source": "iana",
    "extensions": ["p10"]
  },
  "application/pkcs12": {
    "source": "iana"
  },
  "application/pkcs7-mime": {
    "source": "iana",
    "extensions": ["p7m","p7c"]
  },
  "application/pkcs7-signature": {
    "source": "iana",
    "extensions": ["p7s"]
  },
  "application/pkcs8": {
    "source": "iana",
    "extensions": ["p8"]
  },
  "application/pkcs8-encrypted": {
    "source": "iana"
  },
  "application/pkix-attr-cert": {
    "source": "iana",
    "extensions": ["ac"]
  },
  "application/pkix-cert": {
    "source": "iana",
    "extensions": ["cer"]
  },
  "application/pkix-crl": {
    "source": "iana",
    "extensions": ["crl"]
  },
  "application/pkix-pkipath": {
    "source": "iana",
    "extensions": ["pkipath"]
  },
  "application/pkixcmp": {
    "source": "iana",
    "extensions": ["pki"]
  },
  "application/pls+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["pls"]
  },
  "application/poc-settings+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/postscript": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ai","eps","ps"]
  },
  "application/ppsp-tracker+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+json": {
    "source": "iana",
    "compressible": true
  },
  "application/problem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/provenance+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["provx"]
  },
  "application/prs.alvestrand.titrax-sheet": {
    "source": "iana"
  },
  "application/prs.cww": {
    "source": "iana",
    "extensions": ["cww"]
  },
  "application/prs.cyn": {
    "source": "iana",
    "charset": "7-BIT"
  },
  "application/prs.hpub+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/prs.nprend": {
    "source": "iana"
  },
  "application/prs.plucker": {
    "source": "iana"
  },
  "application/prs.rdf-xml-crypt": {
    "source": "iana"
  },
  "application/prs.xsf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/pskc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["pskcxml"]
  },
  "application/pvd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/qsig": {
    "source": "iana"
  },
  "application/raml+yaml": {
    "compressible": true,
    "extensions": ["raml"]
  },
  "application/raptorfec": {
    "source": "iana"
  },
  "application/rdap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/rdf+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rdf","owl"]
  },
  "application/reginfo+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rif"]
  },
  "application/relax-ng-compact-syntax": {
    "source": "iana",
    "extensions": ["rnc"]
  },
  "application/remote-printing": {
    "source": "iana"
  },
  "application/reputon+json": {
    "source": "iana",
    "compressible": true
  },
  "application/resource-lists+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rl"]
  },
  "application/resource-lists-diff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rld"]
  },
  "application/rfc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/riscos": {
    "source": "iana"
  },
  "application/rlmi+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/rls-services+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rs"]
  },
  "application/route-apd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rapd"]
  },
  "application/route-s-tsid+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sls"]
  },
  "application/route-usd+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rusd"]
  },
  "application/rpki-ghostbusters": {
    "source": "iana",
    "extensions": ["gbr"]
  },
  "application/rpki-manifest": {
    "source": "iana",
    "extensions": ["mft"]
  },
  "application/rpki-publication": {
    "source": "iana"
  },
  "application/rpki-roa": {
    "source": "iana",
    "extensions": ["roa"]
  },
  "application/rpki-updown": {
    "source": "iana"
  },
  "application/rsd+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["rsd"]
  },
  "application/rss+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["rss"]
  },
  "application/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "application/rtploopback": {
    "source": "iana"
  },
  "application/rtx": {
    "source": "iana"
  },
  "application/samlassertion+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/samlmetadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sarif+json": {
    "source": "iana",
    "compressible": true
  },
  "application/sarif-external-properties+json": {
    "source": "iana",
    "compressible": true
  },
  "application/sbe": {
    "source": "iana"
  },
  "application/sbml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sbml"]
  },
  "application/scaip+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/scim+json": {
    "source": "iana",
    "compressible": true
  },
  "application/scvp-cv-request": {
    "source": "iana",
    "extensions": ["scq"]
  },
  "application/scvp-cv-response": {
    "source": "iana",
    "extensions": ["scs"]
  },
  "application/scvp-vp-request": {
    "source": "iana",
    "extensions": ["spq"]
  },
  "application/scvp-vp-response": {
    "source": "iana",
    "extensions": ["spp"]
  },
  "application/sdp": {
    "source": "iana",
    "extensions": ["sdp"]
  },
  "application/secevent+jwt": {
    "source": "iana"
  },
  "application/senml+cbor": {
    "source": "iana"
  },
  "application/senml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/senml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["senmlx"]
  },
  "application/senml-etch+cbor": {
    "source": "iana"
  },
  "application/senml-etch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/senml-exi": {
    "source": "iana"
  },
  "application/sensml+cbor": {
    "source": "iana"
  },
  "application/sensml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/sensml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sensmlx"]
  },
  "application/sensml-exi": {
    "source": "iana"
  },
  "application/sep+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sep-exi": {
    "source": "iana"
  },
  "application/session-info": {
    "source": "iana"
  },
  "application/set-payment": {
    "source": "iana"
  },
  "application/set-payment-initiation": {
    "source": "iana",
    "extensions": ["setpay"]
  },
  "application/set-registration": {
    "source": "iana"
  },
  "application/set-registration-initiation": {
    "source": "iana",
    "extensions": ["setreg"]
  },
  "application/sgml": {
    "source": "iana"
  },
  "application/sgml-open-catalog": {
    "source": "iana"
  },
  "application/shf+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["shf"]
  },
  "application/sieve": {
    "source": "iana",
    "extensions": ["siv","sieve"]
  },
  "application/simple-filter+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/simple-message-summary": {
    "source": "iana"
  },
  "application/simplesymbolcontainer": {
    "source": "iana"
  },
  "application/sipc": {
    "source": "iana"
  },
  "application/slate": {
    "source": "iana"
  },
  "application/smil": {
    "source": "iana"
  },
  "application/smil+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["smi","smil"]
  },
  "application/smpte336m": {
    "source": "iana"
  },
  "application/soap+fastinfoset": {
    "source": "iana"
  },
  "application/soap+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sparql-query": {
    "source": "iana",
    "extensions": ["rq"]
  },
  "application/sparql-results+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["srx"]
  },
  "application/spdx+json": {
    "source": "iana",
    "compressible": true
  },
  "application/spirits-event+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/sql": {
    "source": "iana"
  },
  "application/srgs": {
    "source": "iana",
    "extensions": ["gram"]
  },
  "application/srgs+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["grxml"]
  },
  "application/sru+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sru"]
  },
  "application/ssdl+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ssdl"]
  },
  "application/ssml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ssml"]
  },
  "application/stix+json": {
    "source": "iana",
    "compressible": true
  },
  "application/swid+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["swidtag"]
  },
  "application/tamp-apex-update": {
    "source": "iana"
  },
  "application/tamp-apex-update-confirm": {
    "source": "iana"
  },
  "application/tamp-community-update": {
    "source": "iana"
  },
  "application/tamp-community-update-confirm": {
    "source": "iana"
  },
  "application/tamp-error": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust": {
    "source": "iana"
  },
  "application/tamp-sequence-adjust-confirm": {
    "source": "iana"
  },
  "application/tamp-status-query": {
    "source": "iana"
  },
  "application/tamp-status-response": {
    "source": "iana"
  },
  "application/tamp-update": {
    "source": "iana"
  },
  "application/tamp-update-confirm": {
    "source": "iana"
  },
  "application/tar": {
    "compressible": true
  },
  "application/taxii+json": {
    "source": "iana",
    "compressible": true
  },
  "application/td+json": {
    "source": "iana",
    "compressible": true
  },
  "application/tei+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tei","teicorpus"]
  },
  "application/tetra_isi": {
    "source": "iana"
  },
  "application/thraud+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tfi"]
  },
  "application/timestamp-query": {
    "source": "iana"
  },
  "application/timestamp-reply": {
    "source": "iana"
  },
  "application/timestamped-data": {
    "source": "iana",
    "extensions": ["tsd"]
  },
  "application/tlsrpt+gzip": {
    "source": "iana"
  },
  "application/tlsrpt+json": {
    "source": "iana",
    "compressible": true
  },
  "application/tnauthlist": {
    "source": "iana"
  },
  "application/token-introspection+jwt": {
    "source": "iana"
  },
  "application/toml": {
    "compressible": true,
    "extensions": ["toml"]
  },
  "application/trickle-ice-sdpfrag": {
    "source": "iana"
  },
  "application/trig": {
    "source": "iana",
    "extensions": ["trig"]
  },
  "application/ttml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ttml"]
  },
  "application/tve-trigger": {
    "source": "iana"
  },
  "application/tzif": {
    "source": "iana"
  },
  "application/tzif-leap": {
    "source": "iana"
  },
  "application/ubjson": {
    "compressible": false,
    "extensions": ["ubj"]
  },
  "application/ulpfec": {
    "source": "iana"
  },
  "application/urc-grpsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/urc-ressheet+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rsheet"]
  },
  "application/urc-targetdesc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["td"]
  },
  "application/urc-uisocketdesc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vcard+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vcard+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vemmi": {
    "source": "iana"
  },
  "application/vividence.scriptfile": {
    "source": "apache"
  },
  "application/vnd.1000minds.decision-model+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["1km"]
  },
  "application/vnd.3gpp-prose+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp-prose-pc3ch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp-v2x-local-service-information": {
    "source": "iana"
  },
  "application/vnd.3gpp.5gnas": {
    "source": "iana"
  },
  "application/vnd.3gpp.access-transfer-events+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.bsf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.gmop+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.gtpc": {
    "source": "iana"
  },
  "application/vnd.3gpp.interworking-data": {
    "source": "iana"
  },
  "application/vnd.3gpp.lpp": {
    "source": "iana"
  },
  "application/vnd.3gpp.mc-signalling-ear": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-payload": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-signalling": {
    "source": "iana"
  },
  "application/vnd.3gpp.mcdata-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcdata-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-floor-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-location-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-signed+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcptt-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-location-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-service-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-ue-config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mcvideo-user-profile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.mid-call+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.ngap": {
    "source": "iana"
  },
  "application/vnd.3gpp.pfcp": {
    "source": "iana"
  },
  "application/vnd.3gpp.pic-bw-large": {
    "source": "iana",
    "extensions": ["plb"]
  },
  "application/vnd.3gpp.pic-bw-small": {
    "source": "iana",
    "extensions": ["psb"]
  },
  "application/vnd.3gpp.pic-bw-var": {
    "source": "iana",
    "extensions": ["pvb"]
  },
  "application/vnd.3gpp.s1ap": {
    "source": "iana"
  },
  "application/vnd.3gpp.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp.sms+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.srvcc-ext+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.srvcc-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.state-and-event-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp.ussd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp2.bcmcsinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.3gpp2.sms": {
    "source": "iana"
  },
  "application/vnd.3gpp2.tcap": {
    "source": "iana",
    "extensions": ["tcap"]
  },
  "application/vnd.3lightssoftware.imagescal": {
    "source": "iana"
  },
  "application/vnd.3m.post-it-notes": {
    "source": "iana",
    "extensions": ["pwn"]
  },
  "application/vnd.accpac.simply.aso": {
    "source": "iana",
    "extensions": ["aso"]
  },
  "application/vnd.accpac.simply.imp": {
    "source": "iana",
    "extensions": ["imp"]
  },
  "application/vnd.acucobol": {
    "source": "iana",
    "extensions": ["acu"]
  },
  "application/vnd.acucorp": {
    "source": "iana",
    "extensions": ["atc","acutc"]
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    "source": "apache",
    "compressible": false,
    "extensions": ["air"]
  },
  "application/vnd.adobe.flash.movie": {
    "source": "iana"
  },
  "application/vnd.adobe.formscentral.fcdt": {
    "source": "iana",
    "extensions": ["fcdt"]
  },
  "application/vnd.adobe.fxp": {
    "source": "iana",
    "extensions": ["fxp","fxpl"]
  },
  "application/vnd.adobe.partial-upload": {
    "source": "iana"
  },
  "application/vnd.adobe.xdp+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdp"]
  },
  "application/vnd.adobe.xfdf": {
    "source": "iana",
    "extensions": ["xfdf"]
  },
  "application/vnd.aether.imp": {
    "source": "iana"
  },
  "application/vnd.afpc.afplinedata": {
    "source": "iana"
  },
  "application/vnd.afpc.afplinedata-pagedef": {
    "source": "iana"
  },
  "application/vnd.afpc.cmoca-cmresource": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-charset": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-codedfont": {
    "source": "iana"
  },
  "application/vnd.afpc.foca-codepage": {
    "source": "iana"
  },
  "application/vnd.afpc.modca": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-cmtable": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-formdef": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-mediummap": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-objectcontainer": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-overlay": {
    "source": "iana"
  },
  "application/vnd.afpc.modca-pagesegment": {
    "source": "iana"
  },
  "application/vnd.age": {
    "source": "iana",
    "extensions": ["age"]
  },
  "application/vnd.ah-barcode": {
    "source": "iana"
  },
  "application/vnd.ahead.space": {
    "source": "iana",
    "extensions": ["ahead"]
  },
  "application/vnd.airzip.filesecure.azf": {
    "source": "iana",
    "extensions": ["azf"]
  },
  "application/vnd.airzip.filesecure.azs": {
    "source": "iana",
    "extensions": ["azs"]
  },
  "application/vnd.amadeus+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.amazon.ebook": {
    "source": "apache",
    "extensions": ["azw"]
  },
  "application/vnd.amazon.mobi8-ebook": {
    "source": "iana"
  },
  "application/vnd.americandynamics.acc": {
    "source": "iana",
    "extensions": ["acc"]
  },
  "application/vnd.amiga.ami": {
    "source": "iana",
    "extensions": ["ami"]
  },
  "application/vnd.amundsen.maze+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.android.ota": {
    "source": "iana"
  },
  "application/vnd.android.package-archive": {
    "source": "apache",
    "compressible": false,
    "extensions": ["apk"]
  },
  "application/vnd.anki": {
    "source": "iana"
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    "source": "iana",
    "extensions": ["cii"]
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    "source": "apache",
    "extensions": ["fti"]
  },
  "application/vnd.antix.game-component": {
    "source": "iana",
    "extensions": ["atx"]
  },
  "application/vnd.apache.arrow.file": {
    "source": "iana"
  },
  "application/vnd.apache.arrow.stream": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.binary": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.compact": {
    "source": "iana"
  },
  "application/vnd.apache.thrift.json": {
    "source": "iana"
  },
  "application/vnd.api+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.aplextor.warrp+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.apothekende.reservation+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.apple.installer+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mpkg"]
  },
  "application/vnd.apple.keynote": {
    "source": "iana",
    "extensions": ["key"]
  },
  "application/vnd.apple.mpegurl": {
    "source": "iana",
    "extensions": ["m3u8"]
  },
  "application/vnd.apple.numbers": {
    "source": "iana",
    "extensions": ["numbers"]
  },
  "application/vnd.apple.pages": {
    "source": "iana",
    "extensions": ["pages"]
  },
  "application/vnd.apple.pkpass": {
    "compressible": false,
    "extensions": ["pkpass"]
  },
  "application/vnd.arastra.swi": {
    "source": "iana"
  },
  "application/vnd.aristanetworks.swi": {
    "source": "iana",
    "extensions": ["swi"]
  },
  "application/vnd.artisan+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.artsquare": {
    "source": "iana"
  },
  "application/vnd.astraea-software.iota": {
    "source": "iana",
    "extensions": ["iota"]
  },
  "application/vnd.audiograph": {
    "source": "iana",
    "extensions": ["aep"]
  },
  "application/vnd.autopackage": {
    "source": "iana"
  },
  "application/vnd.avalon+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.avistar+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.balsamiq.bmml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["bmml"]
  },
  "application/vnd.balsamiq.bmpr": {
    "source": "iana"
  },
  "application/vnd.banana-accounting": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.error": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.msg": {
    "source": "iana"
  },
  "application/vnd.bbf.usp.msg+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.bekitzur-stech+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.bint.med-content": {
    "source": "iana"
  },
  "application/vnd.biopax.rdf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.blink-idb-value-wrapper": {
    "source": "iana"
  },
  "application/vnd.blueice.multipass": {
    "source": "iana",
    "extensions": ["mpm"]
  },
  "application/vnd.bluetooth.ep.oob": {
    "source": "iana"
  },
  "application/vnd.bluetooth.le.oob": {
    "source": "iana"
  },
  "application/vnd.bmi": {
    "source": "iana",
    "extensions": ["bmi"]
  },
  "application/vnd.bpf": {
    "source": "iana"
  },
  "application/vnd.bpf3": {
    "source": "iana"
  },
  "application/vnd.businessobjects": {
    "source": "iana",
    "extensions": ["rep"]
  },
  "application/vnd.byu.uapi+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cab-jscript": {
    "source": "iana"
  },
  "application/vnd.canon-cpdl": {
    "source": "iana"
  },
  "application/vnd.canon-lips": {
    "source": "iana"
  },
  "application/vnd.capasystems-pg+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cendio.thinlinc.clientconf": {
    "source": "iana"
  },
  "application/vnd.century-systems.tcp_stream": {
    "source": "iana"
  },
  "application/vnd.chemdraw+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["cdxml"]
  },
  "application/vnd.chess-pgn": {
    "source": "iana"
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    "source": "iana",
    "extensions": ["mmd"]
  },
  "application/vnd.ciedi": {
    "source": "iana"
  },
  "application/vnd.cinderella": {
    "source": "iana",
    "extensions": ["cdy"]
  },
  "application/vnd.cirpack.isdn-ext": {
    "source": "iana"
  },
  "application/vnd.citationstyles.style+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["csl"]
  },
  "application/vnd.claymore": {
    "source": "iana",
    "extensions": ["cla"]
  },
  "application/vnd.cloanto.rp9": {
    "source": "iana",
    "extensions": ["rp9"]
  },
  "application/vnd.clonk.c4group": {
    "source": "iana",
    "extensions": ["c4g","c4d","c4f","c4p","c4u"]
  },
  "application/vnd.cluetrust.cartomobile-config": {
    "source": "iana",
    "extensions": ["c11amc"]
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    "source": "iana",
    "extensions": ["c11amz"]
  },
  "application/vnd.coffeescript": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.document": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.document-template": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.presentation": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.presentation-template": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet": {
    "source": "iana"
  },
  "application/vnd.collabio.xodocuments.spreadsheet-template": {
    "source": "iana"
  },
  "application/vnd.collection+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.doc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.collection.next+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.comicbook+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.comicbook-rar": {
    "source": "iana"
  },
  "application/vnd.commerce-battelle": {
    "source": "iana"
  },
  "application/vnd.commonspace": {
    "source": "iana",
    "extensions": ["csp"]
  },
  "application/vnd.contact.cmsg": {
    "source": "iana",
    "extensions": ["cdbcmsg"]
  },
  "application/vnd.coreos.ignition+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cosmocaller": {
    "source": "iana",
    "extensions": ["cmc"]
  },
  "application/vnd.crick.clicker": {
    "source": "iana",
    "extensions": ["clkx"]
  },
  "application/vnd.crick.clicker.keyboard": {
    "source": "iana",
    "extensions": ["clkk"]
  },
  "application/vnd.crick.clicker.palette": {
    "source": "iana",
    "extensions": ["clkp"]
  },
  "application/vnd.crick.clicker.template": {
    "source": "iana",
    "extensions": ["clkt"]
  },
  "application/vnd.crick.clicker.wordbank": {
    "source": "iana",
    "extensions": ["clkw"]
  },
  "application/vnd.criticaltools.wbs+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wbs"]
  },
  "application/vnd.cryptii.pipe+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.crypto-shade-file": {
    "source": "iana"
  },
  "application/vnd.cryptomator.encrypted": {
    "source": "iana"
  },
  "application/vnd.cryptomator.vault": {
    "source": "iana"
  },
  "application/vnd.ctc-posml": {
    "source": "iana",
    "extensions": ["pml"]
  },
  "application/vnd.ctct.ws+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cups-pdf": {
    "source": "iana"
  },
  "application/vnd.cups-postscript": {
    "source": "iana"
  },
  "application/vnd.cups-ppd": {
    "source": "iana",
    "extensions": ["ppd"]
  },
  "application/vnd.cups-raster": {
    "source": "iana"
  },
  "application/vnd.cups-raw": {
    "source": "iana"
  },
  "application/vnd.curl": {
    "source": "iana"
  },
  "application/vnd.curl.car": {
    "source": "apache",
    "extensions": ["car"]
  },
  "application/vnd.curl.pcurl": {
    "source": "apache",
    "extensions": ["pcurl"]
  },
  "application/vnd.cyan.dean.root+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cybank": {
    "source": "iana"
  },
  "application/vnd.cyclonedx+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.cyclonedx+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.d2l.coursepackage1p0+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.d3m-dataset": {
    "source": "iana"
  },
  "application/vnd.d3m-problem": {
    "source": "iana"
  },
  "application/vnd.dart": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dart"]
  },
  "application/vnd.data-vision.rdz": {
    "source": "iana",
    "extensions": ["rdz"]
  },
  "application/vnd.datapackage+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dataresource+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dbf": {
    "source": "iana",
    "extensions": ["dbf"]
  },
  "application/vnd.debian.binary-package": {
    "source": "iana"
  },
  "application/vnd.dece.data": {
    "source": "iana",
    "extensions": ["uvf","uvvf","uvd","uvvd"]
  },
  "application/vnd.dece.ttml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uvt","uvvt"]
  },
  "application/vnd.dece.unspecified": {
    "source": "iana",
    "extensions": ["uvx","uvvx"]
  },
  "application/vnd.dece.zip": {
    "source": "iana",
    "extensions": ["uvz","uvvz"]
  },
  "application/vnd.denovo.fcselayout-link": {
    "source": "iana",
    "extensions": ["fe_launch"]
  },
  "application/vnd.desmume.movie": {
    "source": "iana"
  },
  "application/vnd.dir-bi.plate-dl-nosuffix": {
    "source": "iana"
  },
  "application/vnd.dm.delegation+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dna": {
    "source": "iana",
    "extensions": ["dna"]
  },
  "application/vnd.document+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dolby.mlp": {
    "source": "apache",
    "extensions": ["mlp"]
  },
  "application/vnd.dolby.mobile.1": {
    "source": "iana"
  },
  "application/vnd.dolby.mobile.2": {
    "source": "iana"
  },
  "application/vnd.doremir.scorecloud-binary-document": {
    "source": "iana"
  },
  "application/vnd.dpgraph": {
    "source": "iana",
    "extensions": ["dpg"]
  },
  "application/vnd.dreamfactory": {
    "source": "iana",
    "extensions": ["dfac"]
  },
  "application/vnd.drive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ds-keypoint": {
    "source": "apache",
    "extensions": ["kpxx"]
  },
  "application/vnd.dtg.local": {
    "source": "iana"
  },
  "application/vnd.dtg.local.flash": {
    "source": "iana"
  },
  "application/vnd.dtg.local.html": {
    "source": "iana"
  },
  "application/vnd.dvb.ait": {
    "source": "iana",
    "extensions": ["ait"]
  },
  "application/vnd.dvb.dvbisl+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.dvbj": {
    "source": "iana"
  },
  "application/vnd.dvb.esgcontainer": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcdftnotifaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgaccess2": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcesgpdd": {
    "source": "iana"
  },
  "application/vnd.dvb.ipdcroaming": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-base": {
    "source": "iana"
  },
  "application/vnd.dvb.iptv.alfec-enhancement": {
    "source": "iana"
  },
  "application/vnd.dvb.notif-aggregate-root+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-container+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-generic+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-msglist+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-registration-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-ia-registration-response+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.notif-init+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.dvb.pfr": {
    "source": "iana"
  },
  "application/vnd.dvb.service": {
    "source": "iana",
    "extensions": ["svc"]
  },
  "application/vnd.dxr": {
    "source": "iana"
  },
  "application/vnd.dynageo": {
    "source": "iana",
    "extensions": ["geo"]
  },
  "application/vnd.dzr": {
    "source": "iana"
  },
  "application/vnd.easykaraoke.cdgdownload": {
    "source": "iana"
  },
  "application/vnd.ecdis-update": {
    "source": "iana"
  },
  "application/vnd.ecip.rlp": {
    "source": "iana"
  },
  "application/vnd.eclipse.ditto+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ecowin.chart": {
    "source": "iana",
    "extensions": ["mag"]
  },
  "application/vnd.ecowin.filerequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.fileupdate": {
    "source": "iana"
  },
  "application/vnd.ecowin.series": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesrequest": {
    "source": "iana"
  },
  "application/vnd.ecowin.seriesupdate": {
    "source": "iana"
  },
  "application/vnd.efi.img": {
    "source": "iana"
  },
  "application/vnd.efi.iso": {
    "source": "iana"
  },
  "application/vnd.emclient.accessrequest+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.enliven": {
    "source": "iana",
    "extensions": ["nml"]
  },
  "application/vnd.enphase.envoy": {
    "source": "iana"
  },
  "application/vnd.eprints.data+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.epson.esf": {
    "source": "iana",
    "extensions": ["esf"]
  },
  "application/vnd.epson.msf": {
    "source": "iana",
    "extensions": ["msf"]
  },
  "application/vnd.epson.quickanime": {
    "source": "iana",
    "extensions": ["qam"]
  },
  "application/vnd.epson.salt": {
    "source": "iana",
    "extensions": ["slt"]
  },
  "application/vnd.epson.ssf": {
    "source": "iana",
    "extensions": ["ssf"]
  },
  "application/vnd.ericsson.quickcall": {
    "source": "iana"
  },
  "application/vnd.espass-espass+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.eszigno3+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["es3","et3"]
  },
  "application/vnd.etsi.aoc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.asic-e+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.etsi.asic-s+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.etsi.cug+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvcommand+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvdiscovery+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-bc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-cod+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsad-npvr+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvservice+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvsync+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.iptvueprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.mcid+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.mheg5": {
    "source": "iana"
  },
  "application/vnd.etsi.overload-control-policy-dataset+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.pstn+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.sci+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.simservs+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.timestamp-token": {
    "source": "iana"
  },
  "application/vnd.etsi.tsl+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.etsi.tsl.der": {
    "source": "iana"
  },
  "application/vnd.eu.kasparian.car+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.eudora.data": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.profile": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.settings": {
    "source": "iana"
  },
  "application/vnd.evolv.ecig.theme": {
    "source": "iana"
  },
  "application/vnd.exstream-empower+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.exstream-package": {
    "source": "iana"
  },
  "application/vnd.ezpix-album": {
    "source": "iana",
    "extensions": ["ez2"]
  },
  "application/vnd.ezpix-package": {
    "source": "iana",
    "extensions": ["ez3"]
  },
  "application/vnd.f-secure.mobile": {
    "source": "iana"
  },
  "application/vnd.familysearch.gedcom+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.fastcopy-disk-image": {
    "source": "iana"
  },
  "application/vnd.fdf": {
    "source": "iana",
    "extensions": ["fdf"]
  },
  "application/vnd.fdsn.mseed": {
    "source": "iana",
    "extensions": ["mseed"]
  },
  "application/vnd.fdsn.seed": {
    "source": "iana",
    "extensions": ["seed","dataless"]
  },
  "application/vnd.ffsns": {
    "source": "iana"
  },
  "application/vnd.ficlab.flb+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.filmit.zfc": {
    "source": "iana"
  },
  "application/vnd.fints": {
    "source": "iana"
  },
  "application/vnd.firemonkeys.cloudcell": {
    "source": "iana"
  },
  "application/vnd.flographit": {
    "source": "iana",
    "extensions": ["gph"]
  },
  "application/vnd.fluxtime.clip": {
    "source": "iana",
    "extensions": ["ftc"]
  },
  "application/vnd.font-fontforge-sfd": {
    "source": "iana"
  },
  "application/vnd.framemaker": {
    "source": "iana",
    "extensions": ["fm","frame","maker","book"]
  },
  "application/vnd.frogans.fnc": {
    "source": "iana",
    "extensions": ["fnc"]
  },
  "application/vnd.frogans.ltf": {
    "source": "iana",
    "extensions": ["ltf"]
  },
  "application/vnd.fsc.weblaunch": {
    "source": "iana",
    "extensions": ["fsc"]
  },
  "application/vnd.fujifilm.fb.docuworks": {
    "source": "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.binder": {
    "source": "iana"
  },
  "application/vnd.fujifilm.fb.docuworks.container": {
    "source": "iana"
  },
  "application/vnd.fujifilm.fb.jfi+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.fujitsu.oasys": {
    "source": "iana",
    "extensions": ["oas"]
  },
  "application/vnd.fujitsu.oasys2": {
    "source": "iana",
    "extensions": ["oa2"]
  },
  "application/vnd.fujitsu.oasys3": {
    "source": "iana",
    "extensions": ["oa3"]
  },
  "application/vnd.fujitsu.oasysgp": {
    "source": "iana",
    "extensions": ["fg5"]
  },
  "application/vnd.fujitsu.oasysprs": {
    "source": "iana",
    "extensions": ["bh2"]
  },
  "application/vnd.fujixerox.art-ex": {
    "source": "iana"
  },
  "application/vnd.fujixerox.art4": {
    "source": "iana"
  },
  "application/vnd.fujixerox.ddd": {
    "source": "iana",
    "extensions": ["ddd"]
  },
  "application/vnd.fujixerox.docuworks": {
    "source": "iana",
    "extensions": ["xdw"]
  },
  "application/vnd.fujixerox.docuworks.binder": {
    "source": "iana",
    "extensions": ["xbd"]
  },
  "application/vnd.fujixerox.docuworks.container": {
    "source": "iana"
  },
  "application/vnd.fujixerox.hbpl": {
    "source": "iana"
  },
  "application/vnd.fut-misnet": {
    "source": "iana"
  },
  "application/vnd.futoin+cbor": {
    "source": "iana"
  },
  "application/vnd.futoin+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.fuzzysheet": {
    "source": "iana",
    "extensions": ["fzs"]
  },
  "application/vnd.genomatix.tuxedo": {
    "source": "iana",
    "extensions": ["txd"]
  },
  "application/vnd.gentics.grd+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geo+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geocube+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.geogebra.file": {
    "source": "iana",
    "extensions": ["ggb"]
  },
  "application/vnd.geogebra.slides": {
    "source": "iana"
  },
  "application/vnd.geogebra.tool": {
    "source": "iana",
    "extensions": ["ggt"]
  },
  "application/vnd.geometry-explorer": {
    "source": "iana",
    "extensions": ["gex","gre"]
  },
  "application/vnd.geonext": {
    "source": "iana",
    "extensions": ["gxt"]
  },
  "application/vnd.geoplan": {
    "source": "iana",
    "extensions": ["g2w"]
  },
  "application/vnd.geospace": {
    "source": "iana",
    "extensions": ["g3w"]
  },
  "application/vnd.gerber": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt": {
    "source": "iana"
  },
  "application/vnd.globalplatform.card-content-mgt-response": {
    "source": "iana"
  },
  "application/vnd.gmx": {
    "source": "iana",
    "extensions": ["gmx"]
  },
  "application/vnd.google-apps.document": {
    "compressible": false,
    "extensions": ["gdoc"]
  },
  "application/vnd.google-apps.presentation": {
    "compressible": false,
    "extensions": ["gslides"]
  },
  "application/vnd.google-apps.spreadsheet": {
    "compressible": false,
    "extensions": ["gsheet"]
  },
  "application/vnd.google-earth.kml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["kml"]
  },
  "application/vnd.google-earth.kmz": {
    "source": "iana",
    "compressible": false,
    "extensions": ["kmz"]
  },
  "application/vnd.gov.sk.e-form+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.gov.sk.e-form+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.gov.sk.xmldatacontainer+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.grafeq": {
    "source": "iana",
    "extensions": ["gqf","gqs"]
  },
  "application/vnd.gridmp": {
    "source": "iana"
  },
  "application/vnd.groove-account": {
    "source": "iana",
    "extensions": ["gac"]
  },
  "application/vnd.groove-help": {
    "source": "iana",
    "extensions": ["ghf"]
  },
  "application/vnd.groove-identity-message": {
    "source": "iana",
    "extensions": ["gim"]
  },
  "application/vnd.groove-injector": {
    "source": "iana",
    "extensions": ["grv"]
  },
  "application/vnd.groove-tool-message": {
    "source": "iana",
    "extensions": ["gtm"]
  },
  "application/vnd.groove-tool-template": {
    "source": "iana",
    "extensions": ["tpl"]
  },
  "application/vnd.groove-vcard": {
    "source": "iana",
    "extensions": ["vcg"]
  },
  "application/vnd.hal+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hal+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["hal"]
  },
  "application/vnd.handheld-entertainment+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["zmm"]
  },
  "application/vnd.hbci": {
    "source": "iana",
    "extensions": ["hbci"]
  },
  "application/vnd.hc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hcl-bireports": {
    "source": "iana"
  },
  "application/vnd.hdt": {
    "source": "iana"
  },
  "application/vnd.heroku+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hhe.lesson-player": {
    "source": "iana",
    "extensions": ["les"]
  },
  "application/vnd.hl7cda+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.hl7v2+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.hp-hpgl": {
    "source": "iana",
    "extensions": ["hpgl"]
  },
  "application/vnd.hp-hpid": {
    "source": "iana",
    "extensions": ["hpid"]
  },
  "application/vnd.hp-hps": {
    "source": "iana",
    "extensions": ["hps"]
  },
  "application/vnd.hp-jlyt": {
    "source": "iana",
    "extensions": ["jlt"]
  },
  "application/vnd.hp-pcl": {
    "source": "iana",
    "extensions": ["pcl"]
  },
  "application/vnd.hp-pclxl": {
    "source": "iana",
    "extensions": ["pclxl"]
  },
  "application/vnd.httphone": {
    "source": "iana"
  },
  "application/vnd.hydrostatix.sof-data": {
    "source": "iana",
    "extensions": ["sfd-hdstx"]
  },
  "application/vnd.hyper+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hyper-item+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hyperdrive+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.hzn-3d-crossword": {
    "source": "iana"
  },
  "application/vnd.ibm.afplinedata": {
    "source": "iana"
  },
  "application/vnd.ibm.electronic-media": {
    "source": "iana"
  },
  "application/vnd.ibm.minipay": {
    "source": "iana",
    "extensions": ["mpy"]
  },
  "application/vnd.ibm.modcap": {
    "source": "iana",
    "extensions": ["afp","listafp","list3820"]
  },
  "application/vnd.ibm.rights-management": {
    "source": "iana",
    "extensions": ["irm"]
  },
  "application/vnd.ibm.secure-container": {
    "source": "iana",
    "extensions": ["sc"]
  },
  "application/vnd.iccprofile": {
    "source": "iana",
    "extensions": ["icc","icm"]
  },
  "application/vnd.ieee.1905": {
    "source": "iana"
  },
  "application/vnd.igloader": {
    "source": "iana",
    "extensions": ["igl"]
  },
  "application/vnd.imagemeter.folder+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.imagemeter.image+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.immervision-ivp": {
    "source": "iana",
    "extensions": ["ivp"]
  },
  "application/vnd.immervision-ivu": {
    "source": "iana",
    "extensions": ["ivu"]
  },
  "application/vnd.ims.imsccv1p1": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p2": {
    "source": "iana"
  },
  "application/vnd.ims.imsccv1p3": {
    "source": "iana"
  },
  "application/vnd.ims.lis.v2.result+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolproxy.id+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.informedcontrol.rms+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.informix-visionary": {
    "source": "iana"
  },
  "application/vnd.infotech.project": {
    "source": "iana"
  },
  "application/vnd.infotech.project+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.innopath.wamp.notification": {
    "source": "iana"
  },
  "application/vnd.insors.igm": {
    "source": "iana",
    "extensions": ["igm"]
  },
  "application/vnd.intercon.formnet": {
    "source": "iana",
    "extensions": ["xpw","xpx"]
  },
  "application/vnd.intergeo": {
    "source": "iana",
    "extensions": ["i2g"]
  },
  "application/vnd.intertrust.digibox": {
    "source": "iana"
  },
  "application/vnd.intertrust.nncp": {
    "source": "iana"
  },
  "application/vnd.intu.qbo": {
    "source": "iana",
    "extensions": ["qbo"]
  },
  "application/vnd.intu.qfx": {
    "source": "iana",
    "extensions": ["qfx"]
  },
  "application/vnd.iptc.g2.catalogitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.conceptitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.knowledgeitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.newsitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.newsmessage+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.packageitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.iptc.g2.planningitem+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ipunplugged.rcprofile": {
    "source": "iana",
    "extensions": ["rcprofile"]
  },
  "application/vnd.irepository.package+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["irp"]
  },
  "application/vnd.is-xpr": {
    "source": "iana",
    "extensions": ["xpr"]
  },
  "application/vnd.isac.fcs": {
    "source": "iana",
    "extensions": ["fcs"]
  },
  "application/vnd.iso11783-10+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.jam": {
    "source": "iana",
    "extensions": ["jam"]
  },
  "application/vnd.japannet-directory-service": {
    "source": "iana"
  },
  "application/vnd.japannet-jpnstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-payment-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-registration": {
    "source": "iana"
  },
  "application/vnd.japannet-registration-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-setstore-wakeup": {
    "source": "iana"
  },
  "application/vnd.japannet-verification": {
    "source": "iana"
  },
  "application/vnd.japannet-verification-wakeup": {
    "source": "iana"
  },
  "application/vnd.jcp.javame.midlet-rms": {
    "source": "iana",
    "extensions": ["rms"]
  },
  "application/vnd.jisp": {
    "source": "iana",
    "extensions": ["jisp"]
  },
  "application/vnd.joost.joda-archive": {
    "source": "iana",
    "extensions": ["joda"]
  },
  "application/vnd.jsk.isdn-ngn": {
    "source": "iana"
  },
  "application/vnd.kahootz": {
    "source": "iana",
    "extensions": ["ktz","ktr"]
  },
  "application/vnd.kde.karbon": {
    "source": "iana",
    "extensions": ["karbon"]
  },
  "application/vnd.kde.kchart": {
    "source": "iana",
    "extensions": ["chrt"]
  },
  "application/vnd.kde.kformula": {
    "source": "iana",
    "extensions": ["kfo"]
  },
  "application/vnd.kde.kivio": {
    "source": "iana",
    "extensions": ["flw"]
  },
  "application/vnd.kde.kontour": {
    "source": "iana",
    "extensions": ["kon"]
  },
  "application/vnd.kde.kpresenter": {
    "source": "iana",
    "extensions": ["kpr","kpt"]
  },
  "application/vnd.kde.kspread": {
    "source": "iana",
    "extensions": ["ksp"]
  },
  "application/vnd.kde.kword": {
    "source": "iana",
    "extensions": ["kwd","kwt"]
  },
  "application/vnd.kenameaapp": {
    "source": "iana",
    "extensions": ["htke"]
  },
  "application/vnd.kidspiration": {
    "source": "iana",
    "extensions": ["kia"]
  },
  "application/vnd.kinar": {
    "source": "iana",
    "extensions": ["kne","knp"]
  },
  "application/vnd.koan": {
    "source": "iana",
    "extensions": ["skp","skd","skt","skm"]
  },
  "application/vnd.kodak-descriptor": {
    "source": "iana",
    "extensions": ["sse"]
  },
  "application/vnd.las": {
    "source": "iana"
  },
  "application/vnd.las.las+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.las.las+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lasxml"]
  },
  "application/vnd.laszip": {
    "source": "iana"
  },
  "application/vnd.leap+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.liberty-request+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    "source": "iana",
    "extensions": ["lbd"]
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["lbe"]
  },
  "application/vnd.logipipe.circuit+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.loom": {
    "source": "iana"
  },
  "application/vnd.lotus-1-2-3": {
    "source": "iana",
    "extensions": ["123"]
  },
  "application/vnd.lotus-approach": {
    "source": "iana",
    "extensions": ["apr"]
  },
  "application/vnd.lotus-freelance": {
    "source": "iana",
    "extensions": ["pre"]
  },
  "application/vnd.lotus-notes": {
    "source": "iana",
    "extensions": ["nsf"]
  },
  "application/vnd.lotus-organizer": {
    "source": "iana",
    "extensions": ["org"]
  },
  "application/vnd.lotus-screencam": {
    "source": "iana",
    "extensions": ["scm"]
  },
  "application/vnd.lotus-wordpro": {
    "source": "iana",
    "extensions": ["lwp"]
  },
  "application/vnd.macports.portpkg": {
    "source": "iana",
    "extensions": ["portpkg"]
  },
  "application/vnd.mapbox-vector-tile": {
    "source": "iana",
    "extensions": ["mvt"]
  },
  "application/vnd.marlin.drm.actiontoken+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.conftoken+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.license+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.marlin.drm.mdcf": {
    "source": "iana"
  },
  "application/vnd.mason+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.maxar.archive.3tz+zip": {
    "source": "iana",
    "compressible": false
  },
  "application/vnd.maxmind.maxmind-db": {
    "source": "iana"
  },
  "application/vnd.mcd": {
    "source": "iana",
    "extensions": ["mcd"]
  },
  "application/vnd.medcalcdata": {
    "source": "iana",
    "extensions": ["mc1"]
  },
  "application/vnd.mediastation.cdkey": {
    "source": "iana",
    "extensions": ["cdkey"]
  },
  "application/vnd.meridian-slingshot": {
    "source": "iana"
  },
  "application/vnd.mfer": {
    "source": "iana",
    "extensions": ["mwf"]
  },
  "application/vnd.mfmp": {
    "source": "iana",
    "extensions": ["mfm"]
  },
  "application/vnd.micro+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.micrografx.flo": {
    "source": "iana",
    "extensions": ["flo"]
  },
  "application/vnd.micrografx.igx": {
    "source": "iana",
    "extensions": ["igx"]
  },
  "application/vnd.microsoft.portable-executable": {
    "source": "iana"
  },
  "application/vnd.microsoft.windows.thumbnail-cache": {
    "source": "iana"
  },
  "application/vnd.miele+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.mif": {
    "source": "iana",
    "extensions": ["mif"]
  },
  "application/vnd.minisoft-hp3000-save": {
    "source": "iana"
  },
  "application/vnd.mitsubishi.misty-guard.trustweb": {
    "source": "iana"
  },
  "application/vnd.mobius.daf": {
    "source": "iana",
    "extensions": ["daf"]
  },
  "application/vnd.mobius.dis": {
    "source": "iana",
    "extensions": ["dis"]
  },
  "application/vnd.mobius.mbk": {
    "source": "iana",
    "extensions": ["mbk"]
  },
  "application/vnd.mobius.mqy": {
    "source": "iana",
    "extensions": ["mqy"]
  },
  "application/vnd.mobius.msl": {
    "source": "iana",
    "extensions": ["msl"]
  },
  "application/vnd.mobius.plc": {
    "source": "iana",
    "extensions": ["plc"]
  },
  "application/vnd.mobius.txf": {
    "source": "iana",
    "extensions": ["txf"]
  },
  "application/vnd.mophun.application": {
    "source": "iana",
    "extensions": ["mpn"]
  },
  "application/vnd.mophun.certificate": {
    "source": "iana",
    "extensions": ["mpc"]
  },
  "application/vnd.motorola.flexsuite": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.adsi": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.fis": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.gotap": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.kmr": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.ttc": {
    "source": "iana"
  },
  "application/vnd.motorola.flexsuite.wem": {
    "source": "iana"
  },
  "application/vnd.motorola.iprm": {
    "source": "iana"
  },
  "application/vnd.mozilla.xul+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xul"]
  },
  "application/vnd.ms-3mfdocument": {
    "source": "iana"
  },
  "application/vnd.ms-artgalry": {
    "source": "iana",
    "extensions": ["cil"]
  },
  "application/vnd.ms-asf": {
    "source": "iana"
  },
  "application/vnd.ms-cab-compressed": {
    "source": "iana",
    "extensions": ["cab"]
  },
  "application/vnd.ms-color.iccprofile": {
    "source": "apache"
  },
  "application/vnd.ms-excel": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xls","xlm","xla","xlc","xlt","xlw"]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlam"]
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsb"]
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    "source": "iana",
    "extensions": ["xlsm"]
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["xltm"]
  },
  "application/vnd.ms-fontobject": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eot"]
  },
  "application/vnd.ms-htmlhelp": {
    "source": "iana",
    "extensions": ["chm"]
  },
  "application/vnd.ms-ims": {
    "source": "iana",
    "extensions": ["ims"]
  },
  "application/vnd.ms-lrm": {
    "source": "iana",
    "extensions": ["lrm"]
  },
  "application/vnd.ms-office.activex+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-officetheme": {
    "source": "iana",
    "extensions": ["thmx"]
  },
  "application/vnd.ms-opentype": {
    "source": "apache",
    "compressible": true
  },
  "application/vnd.ms-outlook": {
    "compressible": false,
    "extensions": ["msg"]
  },
  "application/vnd.ms-package.obfuscated-opentype": {
    "source": "apache"
  },
  "application/vnd.ms-pki.seccat": {
    "source": "apache",
    "extensions": ["cat"]
  },
  "application/vnd.ms-pki.stl": {
    "source": "apache",
    "extensions": ["stl"]
  },
  "application/vnd.ms-playready.initiator+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-powerpoint": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ppt","pps","pot"]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppam"]
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    "source": "iana",
    "extensions": ["pptm"]
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    "source": "iana",
    "extensions": ["sldm"]
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    "source": "iana",
    "extensions": ["ppsm"]
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["potm"]
  },
  "application/vnd.ms-printdevicecapabilities+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-printing.printticket+xml": {
    "source": "apache",
    "compressible": true
  },
  "application/vnd.ms-printschematicket+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ms-project": {
    "source": "iana",
    "extensions": ["mpp","mpt"]
  },
  "application/vnd.ms-tnef": {
    "source": "iana"
  },
  "application/vnd.ms-windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.nwprinting.oob": {
    "source": "iana"
  },
  "application/vnd.ms-windows.printerpairing": {
    "source": "iana"
  },
  "application/vnd.ms-windows.wsd.oob": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.lic-resp": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-chlg-req": {
    "source": "iana"
  },
  "application/vnd.ms-wmdrm.meter-resp": {
    "source": "iana"
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    "source": "iana",
    "extensions": ["docm"]
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    "source": "iana",
    "extensions": ["dotm"]
  },
  "application/vnd.ms-works": {
    "source": "iana",
    "extensions": ["wps","wks","wcm","wdb"]
  },
  "application/vnd.ms-wpl": {
    "source": "iana",
    "extensions": ["wpl"]
  },
  "application/vnd.ms-xpsdocument": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xps"]
  },
  "application/vnd.msa-disk-image": {
    "source": "iana"
  },
  "application/vnd.mseq": {
    "source": "iana",
    "extensions": ["mseq"]
  },
  "application/vnd.msign": {
    "source": "iana"
  },
  "application/vnd.multiad.creator": {
    "source": "iana"
  },
  "application/vnd.multiad.creator.cif": {
    "source": "iana"
  },
  "application/vnd.music-niff": {
    "source": "iana"
  },
  "application/vnd.musician": {
    "source": "iana",
    "extensions": ["mus"]
  },
  "application/vnd.muvee.style": {
    "source": "iana",
    "extensions": ["msty"]
  },
  "application/vnd.mynfc": {
    "source": "iana",
    "extensions": ["taglet"]
  },
  "application/vnd.nacamar.ybrid+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.ncd.control": {
    "source": "iana"
  },
  "application/vnd.ncd.reference": {
    "source": "iana"
  },
  "application/vnd.nearst.inv+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nebumind.line": {
    "source": "iana"
  },
  "application/vnd.nervana": {
    "source": "iana"
  },
  "application/vnd.netfpx": {
    "source": "iana"
  },
  "application/vnd.neurolanguage.nlu": {
    "source": "iana",
    "extensions": ["nlu"]
  },
  "application/vnd.nimn": {
    "source": "iana"
  },
  "application/vnd.nintendo.nitro.rom": {
    "source": "iana"
  },
  "application/vnd.nintendo.snes.rom": {
    "source": "iana"
  },
  "application/vnd.nitf": {
    "source": "iana",
    "extensions": ["ntf","nitf"]
  },
  "application/vnd.noblenet-directory": {
    "source": "iana",
    "extensions": ["nnd"]
  },
  "application/vnd.noblenet-sealer": {
    "source": "iana",
    "extensions": ["nns"]
  },
  "application/vnd.noblenet-web": {
    "source": "iana",
    "extensions": ["nnw"]
  },
  "application/vnd.nokia.catalogs": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.conml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.iptv.config+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.isds-radio-presets": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.landmark+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.landmarkcollection+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ac"]
  },
  "application/vnd.nokia.n-gage.data": {
    "source": "iana",
    "extensions": ["ngdat"]
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    "source": "iana",
    "extensions": ["n-gage"]
  },
  "application/vnd.nokia.ncd": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+wbxml": {
    "source": "iana"
  },
  "application/vnd.nokia.pcd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.nokia.radio-preset": {
    "source": "iana",
    "extensions": ["rpst"]
  },
  "application/vnd.nokia.radio-presets": {
    "source": "iana",
    "extensions": ["rpss"]
  },
  "application/vnd.novadigm.edm": {
    "source": "iana",
    "extensions": ["edm"]
  },
  "application/vnd.novadigm.edx": {
    "source": "iana",
    "extensions": ["edx"]
  },
  "application/vnd.novadigm.ext": {
    "source": "iana",
    "extensions": ["ext"]
  },
  "application/vnd.ntt-local.content-share": {
    "source": "iana"
  },
  "application/vnd.ntt-local.file-transfer": {
    "source": "iana"
  },
  "application/vnd.ntt-local.ogw_remote-access": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_remote": {
    "source": "iana"
  },
  "application/vnd.ntt-local.sip-ta_tcp_stream": {
    "source": "iana"
  },
  "application/vnd.oasis.opendocument.chart": {
    "source": "iana",
    "extensions": ["odc"]
  },
  "application/vnd.oasis.opendocument.chart-template": {
    "source": "iana",
    "extensions": ["otc"]
  },
  "application/vnd.oasis.opendocument.database": {
    "source": "iana",
    "extensions": ["odb"]
  },
  "application/vnd.oasis.opendocument.formula": {
    "source": "iana",
    "extensions": ["odf"]
  },
  "application/vnd.oasis.opendocument.formula-template": {
    "source": "iana",
    "extensions": ["odft"]
  },
  "application/vnd.oasis.opendocument.graphics": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odg"]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    "source": "iana",
    "extensions": ["otg"]
  },
  "application/vnd.oasis.opendocument.image": {
    "source": "iana",
    "extensions": ["odi"]
  },
  "application/vnd.oasis.opendocument.image-template": {
    "source": "iana",
    "extensions": ["oti"]
  },
  "application/vnd.oasis.opendocument.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odp"]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    "source": "iana",
    "extensions": ["otp"]
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ods"]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    "source": "iana",
    "extensions": ["ots"]
  },
  "application/vnd.oasis.opendocument.text": {
    "source": "iana",
    "compressible": false,
    "extensions": ["odt"]
  },
  "application/vnd.oasis.opendocument.text-master": {
    "source": "iana",
    "extensions": ["odm"]
  },
  "application/vnd.oasis.opendocument.text-template": {
    "source": "iana",
    "extensions": ["ott"]
  },
  "application/vnd.oasis.opendocument.text-web": {
    "source": "iana",
    "extensions": ["oth"]
  },
  "application/vnd.obn": {
    "source": "iana"
  },
  "application/vnd.ocf+cbor": {
    "source": "iana"
  },
  "application/vnd.oci.image.manifest.v1+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oftn.l10n+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.contentaccessdownload+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.contentaccessstreaming+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.cspg-hexbinary": {
    "source": "iana"
  },
  "application/vnd.oipf.dae.svg+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.dae.xhtml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.mippvcontrolmessage+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.pae.gem": {
    "source": "iana"
  },
  "application/vnd.oipf.spdiscovery+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.spdlist+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.ueprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oipf.userprofile+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.olpc-sugar": {
    "source": "iana",
    "extensions": ["xo"]
  },
  "application/vnd.oma-scws-config": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-request": {
    "source": "iana"
  },
  "application/vnd.oma-scws-http-response": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.drm-trigger+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.imd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.ltkm": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.notification+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.provisioningtrigger": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgboot": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.sgdd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.sgdu": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.simple-symbol-container": {
    "source": "iana"
  },
  "application/vnd.oma.bcast.smartcard-trigger+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.sprov+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.bcast.stkm": {
    "source": "iana"
  },
  "application/vnd.oma.cab-address-book+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-feature-handler+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-pcc+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-subs-invite+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.cab-user-prefs+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.dcd": {
    "source": "iana"
  },
  "application/vnd.oma.dcdc": {
    "source": "iana"
  },
  "application/vnd.oma.dd2+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dd2"]
  },
  "application/vnd.oma.drm.risd+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.group-usage-list+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.lwm2m+cbor": {
    "source": "iana"
  },
  "application/vnd.oma.lwm2m+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.lwm2m+tlv": {
    "source": "iana"
  },
  "application/vnd.oma.pal+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.detailed-progress-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.final-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.groups+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.invocation-descriptor+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.poc.optimized-progress-report+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.push": {
    "source": "iana"
  },
  "application/vnd.oma.scidm.messages+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oma.xcap-directory+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.omads-email+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omads-file+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omads-folder+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.omaloc-supl-init": {
    "source": "iana"
  },
  "application/vnd.onepager": {
    "source": "iana"
  },
  "application/vnd.onepagertamp": {
    "source": "iana"
  },
  "application/vnd.onepagertamx": {
    "source": "iana"
  },
  "application/vnd.onepagertat": {
    "source": "iana"
  },
  "application/vnd.onepagertatp": {
    "source": "iana"
  },
  "application/vnd.onepagertatx": {
    "source": "iana"
  },
  "application/vnd.openblox.game+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["obgx"]
  },
  "application/vnd.openblox.game-binary": {
    "source": "iana"
  },
  "application/vnd.openeye.oeb": {
    "source": "iana"
  },
  "application/vnd.openofficeorg.extension": {
    "source": "apache",
    "extensions": ["oxt"]
  },
  "application/vnd.openstreetmap.data+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["osm"]
  },
  "application/vnd.opentimestamps.ots": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawing+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    "source": "iana",
    "compressible": false,
    "extensions": ["pptx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    "source": "iana",
    "extensions": ["sldx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    "source": "iana",
    "extensions": ["ppsx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    "source": "iana",
    "extensions": ["potx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    "source": "iana",
    "compressible": false,
    "extensions": ["xlsx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    "source": "iana",
    "extensions": ["xltx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.theme+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.vmldrawing": {
    "source": "iana"
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    "source": "iana",
    "compressible": false,
    "extensions": ["docx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    "source": "iana",
    "extensions": ["dotx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.core-properties+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.openxmlformats-package.relationships+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oracle.resource+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.orange.indata": {
    "source": "iana"
  },
  "application/vnd.osa.netdeploy": {
    "source": "iana"
  },
  "application/vnd.osgeo.mapguide.package": {
    "source": "iana",
    "extensions": ["mgp"]
  },
  "application/vnd.osgi.bundle": {
    "source": "iana"
  },
  "application/vnd.osgi.dp": {
    "source": "iana",
    "extensions": ["dp"]
  },
  "application/vnd.osgi.subsystem": {
    "source": "iana",
    "extensions": ["esa"]
  },
  "application/vnd.otps.ct-kip+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.oxli.countgraph": {
    "source": "iana"
  },
  "application/vnd.pagerduty+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.palm": {
    "source": "iana",
    "extensions": ["pdb","pqa","oprc"]
  },
  "application/vnd.panoply": {
    "source": "iana"
  },
  "application/vnd.paos.xml": {
    "source": "iana"
  },
  "application/vnd.patentdive": {
    "source": "iana"
  },
  "application/vnd.patientecommsdoc": {
    "source": "iana"
  },
  "application/vnd.pawaafile": {
    "source": "iana",
    "extensions": ["paw"]
  },
  "application/vnd.pcos": {
    "source": "iana"
  },
  "application/vnd.pg.format": {
    "source": "iana",
    "extensions": ["str"]
  },
  "application/vnd.pg.osasli": {
    "source": "iana",
    "extensions": ["ei6"]
  },
  "application/vnd.piaccess.application-licence": {
    "source": "iana"
  },
  "application/vnd.picsel": {
    "source": "iana",
    "extensions": ["efif"]
  },
  "application/vnd.pmi.widget": {
    "source": "iana",
    "extensions": ["wg"]
  },
  "application/vnd.poc.group-advertisement+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.pocketlearn": {
    "source": "iana",
    "extensions": ["plf"]
  },
  "application/vnd.powerbuilder6": {
    "source": "iana",
    "extensions": ["pbd"]
  },
  "application/vnd.powerbuilder6-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7": {
    "source": "iana"
  },
  "application/vnd.powerbuilder7-s": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75": {
    "source": "iana"
  },
  "application/vnd.powerbuilder75-s": {
    "source": "iana"
  },
  "application/vnd.preminet": {
    "source": "iana"
  },
  "application/vnd.previewsystems.box": {
    "source": "iana",
    "extensions": ["box"]
  },
  "application/vnd.proteus.magazine": {
    "source": "iana",
    "extensions": ["mgz"]
  },
  "application/vnd.psfs": {
    "source": "iana"
  },
  "application/vnd.publishare-delta-tree": {
    "source": "iana",
    "extensions": ["qps"]
  },
  "application/vnd.pvi.ptid1": {
    "source": "iana",
    "extensions": ["ptid"]
  },
  "application/vnd.pwg-multiplexed": {
    "source": "iana"
  },
  "application/vnd.pwg-xhtml-print+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.qualcomm.brew-app-res": {
    "source": "iana"
  },
  "application/vnd.quarantainenet": {
    "source": "iana"
  },
  "application/vnd.quark.quarkxpress": {
    "source": "iana",
    "extensions": ["qxd","qxt","qwd","qwt","qxl","qxb"]
  },
  "application/vnd.quobject-quoxdocument": {
    "source": "iana"
  },
  "application/vnd.radisys.moml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-conf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-conn+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-dialog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-audit-stream+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-conf+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-base+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-group+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-speech+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.radisys.msml-dialog-transform+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.rainstor.data": {
    "source": "iana"
  },
  "application/vnd.rapid": {
    "source": "iana"
  },
  "application/vnd.rar": {
    "source": "iana",
    "extensions": ["rar"]
  },
  "application/vnd.realvnc.bed": {
    "source": "iana",
    "extensions": ["bed"]
  },
  "application/vnd.recordare.musicxml": {
    "source": "iana",
    "extensions": ["mxl"]
  },
  "application/vnd.recordare.musicxml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["musicxml"]
  },
  "application/vnd.renlearn.rlprint": {
    "source": "iana"
  },
  "application/vnd.resilient.logic": {
    "source": "iana"
  },
  "application/vnd.restful+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.rig.cryptonote": {
    "source": "iana",
    "extensions": ["cryptonote"]
  },
  "application/vnd.rim.cod": {
    "source": "apache",
    "extensions": ["cod"]
  },
  "application/vnd.rn-realmedia": {
    "source": "apache",
    "extensions": ["rm"]
  },
  "application/vnd.rn-realmedia-vbr": {
    "source": "apache",
    "extensions": ["rmvb"]
  },
  "application/vnd.route66.link66+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["link66"]
  },
  "application/vnd.rs-274x": {
    "source": "iana"
  },
  "application/vnd.ruckus.download": {
    "source": "iana"
  },
  "application/vnd.s3sms": {
    "source": "iana"
  },
  "application/vnd.sailingtracker.track": {
    "source": "iana",
    "extensions": ["st"]
  },
  "application/vnd.sar": {
    "source": "iana"
  },
  "application/vnd.sbm.cid": {
    "source": "iana"
  },
  "application/vnd.sbm.mid2": {
    "source": "iana"
  },
  "application/vnd.scribus": {
    "source": "iana"
  },
  "application/vnd.sealed.3df": {
    "source": "iana"
  },
  "application/vnd.sealed.csf": {
    "source": "iana"
  },
  "application/vnd.sealed.doc": {
    "source": "iana"
  },
  "application/vnd.sealed.eml": {
    "source": "iana"
  },
  "application/vnd.sealed.mht": {
    "source": "iana"
  },
  "application/vnd.sealed.net": {
    "source": "iana"
  },
  "application/vnd.sealed.ppt": {
    "source": "iana"
  },
  "application/vnd.sealed.tiff": {
    "source": "iana"
  },
  "application/vnd.sealed.xls": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.html": {
    "source": "iana"
  },
  "application/vnd.sealedmedia.softseal.pdf": {
    "source": "iana"
  },
  "application/vnd.seemail": {
    "source": "iana",
    "extensions": ["see"]
  },
  "application/vnd.seis+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.sema": {
    "source": "iana",
    "extensions": ["sema"]
  },
  "application/vnd.semd": {
    "source": "iana",
    "extensions": ["semd"]
  },
  "application/vnd.semf": {
    "source": "iana",
    "extensions": ["semf"]
  },
  "application/vnd.shade-save-file": {
    "source": "iana"
  },
  "application/vnd.shana.informed.formdata": {
    "source": "iana",
    "extensions": ["ifm"]
  },
  "application/vnd.shana.informed.formtemplate": {
    "source": "iana",
    "extensions": ["itp"]
  },
  "application/vnd.shana.informed.interchange": {
    "source": "iana",
    "extensions": ["iif"]
  },
  "application/vnd.shana.informed.package": {
    "source": "iana",
    "extensions": ["ipk"]
  },
  "application/vnd.shootproof+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.shopkick+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.shp": {
    "source": "iana"
  },
  "application/vnd.shx": {
    "source": "iana"
  },
  "application/vnd.sigrok.session": {
    "source": "iana"
  },
  "application/vnd.simtech-mindmapper": {
    "source": "iana",
    "extensions": ["twd","twds"]
  },
  "application/vnd.siren+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.smaf": {
    "source": "iana",
    "extensions": ["mmf"]
  },
  "application/vnd.smart.notebook": {
    "source": "iana"
  },
  "application/vnd.smart.teacher": {
    "source": "iana",
    "extensions": ["teacher"]
  },
  "application/vnd.snesdev-page-table": {
    "source": "iana"
  },
  "application/vnd.software602.filler.form+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["fo"]
  },
  "application/vnd.software602.filler.form-xml-zip": {
    "source": "iana"
  },
  "application/vnd.solent.sdkm+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["sdkm","sdkd"]
  },
  "application/vnd.spotfire.dxp": {
    "source": "iana",
    "extensions": ["dxp"]
  },
  "application/vnd.spotfire.sfs": {
    "source": "iana",
    "extensions": ["sfs"]
  },
  "application/vnd.sqlite3": {
    "source": "iana"
  },
  "application/vnd.sss-cod": {
    "source": "iana"
  },
  "application/vnd.sss-dtf": {
    "source": "iana"
  },
  "application/vnd.sss-ntf": {
    "source": "iana"
  },
  "application/vnd.stardivision.calc": {
    "source": "apache",
    "extensions": ["sdc"]
  },
  "application/vnd.stardivision.draw": {
    "source": "apache",
    "extensions": ["sda"]
  },
  "application/vnd.stardivision.impress": {
    "source": "apache",
    "extensions": ["sdd"]
  },
  "application/vnd.stardivision.math": {
    "source": "apache",
    "extensions": ["smf"]
  },
  "application/vnd.stardivision.writer": {
    "source": "apache",
    "extensions": ["sdw","vor"]
  },
  "application/vnd.stardivision.writer-global": {
    "source": "apache",
    "extensions": ["sgl"]
  },
  "application/vnd.stepmania.package": {
    "source": "iana",
    "extensions": ["smzip"]
  },
  "application/vnd.stepmania.stepchart": {
    "source": "iana",
    "extensions": ["sm"]
  },
  "application/vnd.street-stream": {
    "source": "iana"
  },
  "application/vnd.sun.wadl+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wadl"]
  },
  "application/vnd.sun.xml.calc": {
    "source": "apache",
    "extensions": ["sxc"]
  },
  "application/vnd.sun.xml.calc.template": {
    "source": "apache",
    "extensions": ["stc"]
  },
  "application/vnd.sun.xml.draw": {
    "source": "apache",
    "extensions": ["sxd"]
  },
  "application/vnd.sun.xml.draw.template": {
    "source": "apache",
    "extensions": ["std"]
  },
  "application/vnd.sun.xml.impress": {
    "source": "apache",
    "extensions": ["sxi"]
  },
  "application/vnd.sun.xml.impress.template": {
    "source": "apache",
    "extensions": ["sti"]
  },
  "application/vnd.sun.xml.math": {
    "source": "apache",
    "extensions": ["sxm"]
  },
  "application/vnd.sun.xml.writer": {
    "source": "apache",
    "extensions": ["sxw"]
  },
  "application/vnd.sun.xml.writer.global": {
    "source": "apache",
    "extensions": ["sxg"]
  },
  "application/vnd.sun.xml.writer.template": {
    "source": "apache",
    "extensions": ["stw"]
  },
  "application/vnd.sus-calendar": {
    "source": "iana",
    "extensions": ["sus","susp"]
  },
  "application/vnd.svd": {
    "source": "iana",
    "extensions": ["svd"]
  },
  "application/vnd.swiftview-ics": {
    "source": "iana"
  },
  "application/vnd.sycle+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.syft+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.symbian.install": {
    "source": "apache",
    "extensions": ["sis","sisx"]
  },
  "application/vnd.syncml+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["xsm"]
  },
  "application/vnd.syncml.dm+wbxml": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["bdm"]
  },
  "application/vnd.syncml.dm+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["xdm"]
  },
  "application/vnd.syncml.dm.notification": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmddf+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["ddf"]
  },
  "application/vnd.syncml.dmtnds+wbxml": {
    "source": "iana"
  },
  "application/vnd.syncml.dmtnds+xml": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true
  },
  "application/vnd.syncml.ds.notification": {
    "source": "iana"
  },
  "application/vnd.tableschema+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tao.intent-module-archive": {
    "source": "iana",
    "extensions": ["tao"]
  },
  "application/vnd.tcpdump.pcap": {
    "source": "iana",
    "extensions": ["pcap","cap","dmp"]
  },
  "application/vnd.think-cell.ppttc+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tmd.mediaflex.api+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.tml": {
    "source": "iana"
  },
  "application/vnd.tmobile-livetv": {
    "source": "iana",
    "extensions": ["tmo"]
  },
  "application/vnd.tri.onesource": {
    "source": "iana"
  },
  "application/vnd.trid.tpt": {
    "source": "iana",
    "extensions": ["tpt"]
  },
  "application/vnd.triscape.mxs": {
    "source": "iana",
    "extensions": ["mxs"]
  },
  "application/vnd.trueapp": {
    "source": "iana",
    "extensions": ["tra"]
  },
  "application/vnd.truedoc": {
    "source": "iana"
  },
  "application/vnd.ubisoft.webplayer": {
    "source": "iana"
  },
  "application/vnd.ufdl": {
    "source": "iana",
    "extensions": ["ufd","ufdl"]
  },
  "application/vnd.uiq.theme": {
    "source": "iana",
    "extensions": ["utz"]
  },
  "application/vnd.umajin": {
    "source": "iana",
    "extensions": ["umj"]
  },
  "application/vnd.unity": {
    "source": "iana",
    "extensions": ["unityweb"]
  },
  "application/vnd.uoml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uoml"]
  },
  "application/vnd.uplanet.alert": {
    "source": "iana"
  },
  "application/vnd.uplanet.alert-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice": {
    "source": "iana"
  },
  "application/vnd.uplanet.bearer-choice-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop": {
    "source": "iana"
  },
  "application/vnd.uplanet.cacheop-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel": {
    "source": "iana"
  },
  "application/vnd.uplanet.channel-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.list": {
    "source": "iana"
  },
  "application/vnd.uplanet.list-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd": {
    "source": "iana"
  },
  "application/vnd.uplanet.listcmd-wbxml": {
    "source": "iana"
  },
  "application/vnd.uplanet.signal": {
    "source": "iana"
  },
  "application/vnd.uri-map": {
    "source": "iana"
  },
  "application/vnd.valve.source.material": {
    "source": "iana"
  },
  "application/vnd.vcx": {
    "source": "iana",
    "extensions": ["vcx"]
  },
  "application/vnd.vd-study": {
    "source": "iana"
  },
  "application/vnd.vectorworks": {
    "source": "iana"
  },
  "application/vnd.vel+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.verimatrix.vcas": {
    "source": "iana"
  },
  "application/vnd.veritone.aion+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.veryant.thin": {
    "source": "iana"
  },
  "application/vnd.ves.encrypted": {
    "source": "iana"
  },
  "application/vnd.vidsoft.vidconference": {
    "source": "iana"
  },
  "application/vnd.visio": {
    "source": "iana",
    "extensions": ["vsd","vst","vss","vsw"]
  },
  "application/vnd.visionary": {
    "source": "iana",
    "extensions": ["vis"]
  },
  "application/vnd.vividence.scriptfile": {
    "source": "iana"
  },
  "application/vnd.vsf": {
    "source": "iana",
    "extensions": ["vsf"]
  },
  "application/vnd.wap.sic": {
    "source": "iana"
  },
  "application/vnd.wap.slc": {
    "source": "iana"
  },
  "application/vnd.wap.wbxml": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["wbxml"]
  },
  "application/vnd.wap.wmlc": {
    "source": "iana",
    "extensions": ["wmlc"]
  },
  "application/vnd.wap.wmlscriptc": {
    "source": "iana",
    "extensions": ["wmlsc"]
  },
  "application/vnd.webturbo": {
    "source": "iana",
    "extensions": ["wtb"]
  },
  "application/vnd.wfa.dpp": {
    "source": "iana"
  },
  "application/vnd.wfa.p2p": {
    "source": "iana"
  },
  "application/vnd.wfa.wsc": {
    "source": "iana"
  },
  "application/vnd.windows.devicepairing": {
    "source": "iana"
  },
  "application/vnd.wmc": {
    "source": "iana"
  },
  "application/vnd.wmf.bootstrap": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica": {
    "source": "iana"
  },
  "application/vnd.wolfram.mathematica.package": {
    "source": "iana"
  },
  "application/vnd.wolfram.player": {
    "source": "iana",
    "extensions": ["nbp"]
  },
  "application/vnd.wordperfect": {
    "source": "iana",
    "extensions": ["wpd"]
  },
  "application/vnd.wqd": {
    "source": "iana",
    "extensions": ["wqd"]
  },
  "application/vnd.wrq-hp3000-labelled": {
    "source": "iana"
  },
  "application/vnd.wt.stf": {
    "source": "iana",
    "extensions": ["stf"]
  },
  "application/vnd.wv.csp+wbxml": {
    "source": "iana"
  },
  "application/vnd.wv.csp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.wv.ssp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xacml+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xara": {
    "source": "iana",
    "extensions": ["xar"]
  },
  "application/vnd.xfdl": {
    "source": "iana",
    "extensions": ["xfdl"]
  },
  "application/vnd.xfdl.webform": {
    "source": "iana"
  },
  "application/vnd.xmi+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/vnd.xmpie.cpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.dpkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.plan": {
    "source": "iana"
  },
  "application/vnd.xmpie.ppkg": {
    "source": "iana"
  },
  "application/vnd.xmpie.xlim": {
    "source": "iana"
  },
  "application/vnd.yamaha.hv-dic": {
    "source": "iana",
    "extensions": ["hvd"]
  },
  "application/vnd.yamaha.hv-script": {
    "source": "iana",
    "extensions": ["hvs"]
  },
  "application/vnd.yamaha.hv-voice": {
    "source": "iana",
    "extensions": ["hvp"]
  },
  "application/vnd.yamaha.openscoreformat": {
    "source": "iana",
    "extensions": ["osf"]
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["osfpvg"]
  },
  "application/vnd.yamaha.remote-setup": {
    "source": "iana"
  },
  "application/vnd.yamaha.smaf-audio": {
    "source": "iana",
    "extensions": ["saf"]
  },
  "application/vnd.yamaha.smaf-phrase": {
    "source": "iana",
    "extensions": ["spf"]
  },
  "application/vnd.yamaha.through-ngn": {
    "source": "iana"
  },
  "application/vnd.yamaha.tunnel-udpencap": {
    "source": "iana"
  },
  "application/vnd.yaoweme": {
    "source": "iana"
  },
  "application/vnd.yellowriver-custom-menu": {
    "source": "iana",
    "extensions": ["cmp"]
  },
  "application/vnd.youtube.yt": {
    "source": "iana"
  },
  "application/vnd.zul": {
    "source": "iana",
    "extensions": ["zir","zirz"]
  },
  "application/vnd.zzazz.deck+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["zaz"]
  },
  "application/voicexml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["vxml"]
  },
  "application/voucher-cms+json": {
    "source": "iana",
    "compressible": true
  },
  "application/vq-rtcpxr": {
    "source": "iana"
  },
  "application/wasm": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wasm"]
  },
  "application/watcherinfo+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wif"]
  },
  "application/webpush-options+json": {
    "source": "iana",
    "compressible": true
  },
  "application/whoispp-query": {
    "source": "iana"
  },
  "application/whoispp-response": {
    "source": "iana"
  },
  "application/widget": {
    "source": "iana",
    "extensions": ["wgt"]
  },
  "application/winhlp": {
    "source": "apache",
    "extensions": ["hlp"]
  },
  "application/wita": {
    "source": "iana"
  },
  "application/wordperfect5.1": {
    "source": "iana"
  },
  "application/wsdl+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wsdl"]
  },
  "application/wspolicy+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["wspolicy"]
  },
  "application/x-7z-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["7z"]
  },
  "application/x-abiword": {
    "source": "apache",
    "extensions": ["abw"]
  },
  "application/x-ace-compressed": {
    "source": "apache",
    "extensions": ["ace"]
  },
  "application/x-amf": {
    "source": "apache"
  },
  "application/x-apple-diskimage": {
    "source": "apache",
    "extensions": ["dmg"]
  },
  "application/x-arj": {
    "compressible": false,
    "extensions": ["arj"]
  },
  "application/x-authorware-bin": {
    "source": "apache",
    "extensions": ["aab","x32","u32","vox"]
  },
  "application/x-authorware-map": {
    "source": "apache",
    "extensions": ["aam"]
  },
  "application/x-authorware-seg": {
    "source": "apache",
    "extensions": ["aas"]
  },
  "application/x-bcpio": {
    "source": "apache",
    "extensions": ["bcpio"]
  },
  "application/x-bdoc": {
    "compressible": false,
    "extensions": ["bdoc"]
  },
  "application/x-bittorrent": {
    "source": "apache",
    "extensions": ["torrent"]
  },
  "application/x-blorb": {
    "source": "apache",
    "extensions": ["blb","blorb"]
  },
  "application/x-bzip": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz"]
  },
  "application/x-bzip2": {
    "source": "apache",
    "compressible": false,
    "extensions": ["bz2","boz"]
  },
  "application/x-cbr": {
    "source": "apache",
    "extensions": ["cbr","cba","cbt","cbz","cb7"]
  },
  "application/x-cdlink": {
    "source": "apache",
    "extensions": ["vcd"]
  },
  "application/x-cfs-compressed": {
    "source": "apache",
    "extensions": ["cfs"]
  },
  "application/x-chat": {
    "source": "apache",
    "extensions": ["chat"]
  },
  "application/x-chess-pgn": {
    "source": "apache",
    "extensions": ["pgn"]
  },
  "application/x-chrome-extension": {
    "extensions": ["crx"]
  },
  "application/x-cocoa": {
    "source": "nginx",
    "extensions": ["cco"]
  },
  "application/x-compress": {
    "source": "apache"
  },
  "application/x-conference": {
    "source": "apache",
    "extensions": ["nsc"]
  },
  "application/x-cpio": {
    "source": "apache",
    "extensions": ["cpio"]
  },
  "application/x-csh": {
    "source": "apache",
    "extensions": ["csh"]
  },
  "application/x-deb": {
    "compressible": false
  },
  "application/x-debian-package": {
    "source": "apache",
    "extensions": ["deb","udeb"]
  },
  "application/x-dgc-compressed": {
    "source": "apache",
    "extensions": ["dgc"]
  },
  "application/x-director": {
    "source": "apache",
    "extensions": ["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]
  },
  "application/x-doom": {
    "source": "apache",
    "extensions": ["wad"]
  },
  "application/x-dtbncx+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ncx"]
  },
  "application/x-dtbook+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["dtb"]
  },
  "application/x-dtbresource+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["res"]
  },
  "application/x-dvi": {
    "source": "apache",
    "compressible": false,
    "extensions": ["dvi"]
  },
  "application/x-envoy": {
    "source": "apache",
    "extensions": ["evy"]
  },
  "application/x-eva": {
    "source": "apache",
    "extensions": ["eva"]
  },
  "application/x-font-bdf": {
    "source": "apache",
    "extensions": ["bdf"]
  },
  "application/x-font-dos": {
    "source": "apache"
  },
  "application/x-font-framemaker": {
    "source": "apache"
  },
  "application/x-font-ghostscript": {
    "source": "apache",
    "extensions": ["gsf"]
  },
  "application/x-font-libgrx": {
    "source": "apache"
  },
  "application/x-font-linux-psf": {
    "source": "apache",
    "extensions": ["psf"]
  },
  "application/x-font-pcf": {
    "source": "apache",
    "extensions": ["pcf"]
  },
  "application/x-font-snf": {
    "source": "apache",
    "extensions": ["snf"]
  },
  "application/x-font-speedo": {
    "source": "apache"
  },
  "application/x-font-sunos-news": {
    "source": "apache"
  },
  "application/x-font-type1": {
    "source": "apache",
    "extensions": ["pfa","pfb","pfm","afm"]
  },
  "application/x-font-vfont": {
    "source": "apache"
  },
  "application/x-freearc": {
    "source": "apache",
    "extensions": ["arc"]
  },
  "application/x-futuresplash": {
    "source": "apache",
    "extensions": ["spl"]
  },
  "application/x-gca-compressed": {
    "source": "apache",
    "extensions": ["gca"]
  },
  "application/x-glulx": {
    "source": "apache",
    "extensions": ["ulx"]
  },
  "application/x-gnumeric": {
    "source": "apache",
    "extensions": ["gnumeric"]
  },
  "application/x-gramps-xml": {
    "source": "apache",
    "extensions": ["gramps"]
  },
  "application/x-gtar": {
    "source": "apache",
    "extensions": ["gtar"]
  },
  "application/x-gzip": {
    "source": "apache"
  },
  "application/x-hdf": {
    "source": "apache",
    "extensions": ["hdf"]
  },
  "application/x-httpd-php": {
    "compressible": true,
    "extensions": ["php"]
  },
  "application/x-install-instructions": {
    "source": "apache",
    "extensions": ["install"]
  },
  "application/x-iso9660-image": {
    "source": "apache",
    "extensions": ["iso"]
  },
  "application/x-iwork-keynote-sffkey": {
    "extensions": ["key"]
  },
  "application/x-iwork-numbers-sffnumbers": {
    "extensions": ["numbers"]
  },
  "application/x-iwork-pages-sffpages": {
    "extensions": ["pages"]
  },
  "application/x-java-archive-diff": {
    "source": "nginx",
    "extensions": ["jardiff"]
  },
  "application/x-java-jnlp-file": {
    "source": "apache",
    "compressible": false,
    "extensions": ["jnlp"]
  },
  "application/x-javascript": {
    "compressible": true
  },
  "application/x-keepass2": {
    "extensions": ["kdbx"]
  },
  "application/x-latex": {
    "source": "apache",
    "compressible": false,
    "extensions": ["latex"]
  },
  "application/x-lua-bytecode": {
    "extensions": ["luac"]
  },
  "application/x-lzh-compressed": {
    "source": "apache",
    "extensions": ["lzh","lha"]
  },
  "application/x-makeself": {
    "source": "nginx",
    "extensions": ["run"]
  },
  "application/x-mie": {
    "source": "apache",
    "extensions": ["mie"]
  },
  "application/x-mobipocket-ebook": {
    "source": "apache",
    "extensions": ["prc","mobi"]
  },
  "application/x-mpegurl": {
    "compressible": false
  },
  "application/x-ms-application": {
    "source": "apache",
    "extensions": ["application"]
  },
  "application/x-ms-shortcut": {
    "source": "apache",
    "extensions": ["lnk"]
  },
  "application/x-ms-wmd": {
    "source": "apache",
    "extensions": ["wmd"]
  },
  "application/x-ms-wmz": {
    "source": "apache",
    "extensions": ["wmz"]
  },
  "application/x-ms-xbap": {
    "source": "apache",
    "extensions": ["xbap"]
  },
  "application/x-msaccess": {
    "source": "apache",
    "extensions": ["mdb"]
  },
  "application/x-msbinder": {
    "source": "apache",
    "extensions": ["obd"]
  },
  "application/x-mscardfile": {
    "source": "apache",
    "extensions": ["crd"]
  },
  "application/x-msclip": {
    "source": "apache",
    "extensions": ["clp"]
  },
  "application/x-msdos-program": {
    "extensions": ["exe"]
  },
  "application/x-msdownload": {
    "source": "apache",
    "extensions": ["exe","dll","com","bat","msi"]
  },
  "application/x-msmediaview": {
    "source": "apache",
    "extensions": ["mvb","m13","m14"]
  },
  "application/x-msmetafile": {
    "source": "apache",
    "extensions": ["wmf","wmz","emf","emz"]
  },
  "application/x-msmoney": {
    "source": "apache",
    "extensions": ["mny"]
  },
  "application/x-mspublisher": {
    "source": "apache",
    "extensions": ["pub"]
  },
  "application/x-msschedule": {
    "source": "apache",
    "extensions": ["scd"]
  },
  "application/x-msterminal": {
    "source": "apache",
    "extensions": ["trm"]
  },
  "application/x-mswrite": {
    "source": "apache",
    "extensions": ["wri"]
  },
  "application/x-netcdf": {
    "source": "apache",
    "extensions": ["nc","cdf"]
  },
  "application/x-ns-proxy-autoconfig": {
    "compressible": true,
    "extensions": ["pac"]
  },
  "application/x-nzb": {
    "source": "apache",
    "extensions": ["nzb"]
  },
  "application/x-perl": {
    "source": "nginx",
    "extensions": ["pl","pm"]
  },
  "application/x-pilot": {
    "source": "nginx",
    "extensions": ["prc","pdb"]
  },
  "application/x-pkcs12": {
    "source": "apache",
    "compressible": false,
    "extensions": ["p12","pfx"]
  },
  "application/x-pkcs7-certificates": {
    "source": "apache",
    "extensions": ["p7b","spc"]
  },
  "application/x-pkcs7-certreqresp": {
    "source": "apache",
    "extensions": ["p7r"]
  },
  "application/x-pki-message": {
    "source": "iana"
  },
  "application/x-rar-compressed": {
    "source": "apache",
    "compressible": false,
    "extensions": ["rar"]
  },
  "application/x-redhat-package-manager": {
    "source": "nginx",
    "extensions": ["rpm"]
  },
  "application/x-research-info-systems": {
    "source": "apache",
    "extensions": ["ris"]
  },
  "application/x-sea": {
    "source": "nginx",
    "extensions": ["sea"]
  },
  "application/x-sh": {
    "source": "apache",
    "compressible": true,
    "extensions": ["sh"]
  },
  "application/x-shar": {
    "source": "apache",
    "extensions": ["shar"]
  },
  "application/x-shockwave-flash": {
    "source": "apache",
    "compressible": false,
    "extensions": ["swf"]
  },
  "application/x-silverlight-app": {
    "source": "apache",
    "extensions": ["xap"]
  },
  "application/x-sql": {
    "source": "apache",
    "extensions": ["sql"]
  },
  "application/x-stuffit": {
    "source": "apache",
    "compressible": false,
    "extensions": ["sit"]
  },
  "application/x-stuffitx": {
    "source": "apache",
    "extensions": ["sitx"]
  },
  "application/x-subrip": {
    "source": "apache",
    "extensions": ["srt"]
  },
  "application/x-sv4cpio": {
    "source": "apache",
    "extensions": ["sv4cpio"]
  },
  "application/x-sv4crc": {
    "source": "apache",
    "extensions": ["sv4crc"]
  },
  "application/x-t3vm-image": {
    "source": "apache",
    "extensions": ["t3"]
  },
  "application/x-tads": {
    "source": "apache",
    "extensions": ["gam"]
  },
  "application/x-tar": {
    "source": "apache",
    "compressible": true,
    "extensions": ["tar"]
  },
  "application/x-tcl": {
    "source": "apache",
    "extensions": ["tcl","tk"]
  },
  "application/x-tex": {
    "source": "apache",
    "extensions": ["tex"]
  },
  "application/x-tex-tfm": {
    "source": "apache",
    "extensions": ["tfm"]
  },
  "application/x-texinfo": {
    "source": "apache",
    "extensions": ["texinfo","texi"]
  },
  "application/x-tgif": {
    "source": "apache",
    "extensions": ["obj"]
  },
  "application/x-ustar": {
    "source": "apache",
    "extensions": ["ustar"]
  },
  "application/x-virtualbox-hdd": {
    "compressible": true,
    "extensions": ["hdd"]
  },
  "application/x-virtualbox-ova": {
    "compressible": true,
    "extensions": ["ova"]
  },
  "application/x-virtualbox-ovf": {
    "compressible": true,
    "extensions": ["ovf"]
  },
  "application/x-virtualbox-vbox": {
    "compressible": true,
    "extensions": ["vbox"]
  },
  "application/x-virtualbox-vbox-extpack": {
    "compressible": false,
    "extensions": ["vbox-extpack"]
  },
  "application/x-virtualbox-vdi": {
    "compressible": true,
    "extensions": ["vdi"]
  },
  "application/x-virtualbox-vhd": {
    "compressible": true,
    "extensions": ["vhd"]
  },
  "application/x-virtualbox-vmdk": {
    "compressible": true,
    "extensions": ["vmdk"]
  },
  "application/x-wais-source": {
    "source": "apache",
    "extensions": ["src"]
  },
  "application/x-web-app-manifest+json": {
    "compressible": true,
    "extensions": ["webapp"]
  },
  "application/x-www-form-urlencoded": {
    "source": "iana",
    "compressible": true
  },
  "application/x-x509-ca-cert": {
    "source": "iana",
    "extensions": ["der","crt","pem"]
  },
  "application/x-x509-ca-ra-cert": {
    "source": "iana"
  },
  "application/x-x509-next-ca-cert": {
    "source": "iana"
  },
  "application/x-xfig": {
    "source": "apache",
    "extensions": ["fig"]
  },
  "application/x-xliff+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xlf"]
  },
  "application/x-xpinstall": {
    "source": "apache",
    "compressible": false,
    "extensions": ["xpi"]
  },
  "application/x-xz": {
    "source": "apache",
    "extensions": ["xz"]
  },
  "application/x-zmachine": {
    "source": "apache",
    "extensions": ["z1","z2","z3","z4","z5","z6","z7","z8"]
  },
  "application/x400-bp": {
    "source": "iana"
  },
  "application/xacml+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xaml+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xaml"]
  },
  "application/xcap-att+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xav"]
  },
  "application/xcap-caps+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xca"]
  },
  "application/xcap-diff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xdf"]
  },
  "application/xcap-el+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xel"]
  },
  "application/xcap-error+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xcap-ns+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xns"]
  },
  "application/xcon-conference-info+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xcon-conference-info-diff+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xenc+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xenc"]
  },
  "application/xhtml+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xhtml","xht"]
  },
  "application/xhtml-voice+xml": {
    "source": "apache",
    "compressible": true
  },
  "application/xliff+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xlf"]
  },
  "application/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml","xsl","xsd","rng"]
  },
  "application/xml-dtd": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dtd"]
  },
  "application/xml-external-parsed-entity": {
    "source": "iana"
  },
  "application/xml-patch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xmpp+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/xop+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xop"]
  },
  "application/xproc+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xpl"]
  },
  "application/xslt+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xsl","xslt"]
  },
  "application/xspf+xml": {
    "source": "apache",
    "compressible": true,
    "extensions": ["xspf"]
  },
  "application/xv+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["mxml","xhvml","xvml","xvm"]
  },
  "application/yang": {
    "source": "iana",
    "extensions": ["yang"]
  },
  "application/yang-data+json": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-data+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-patch+json": {
    "source": "iana",
    "compressible": true
  },
  "application/yang-patch+xml": {
    "source": "iana",
    "compressible": true
  },
  "application/yin+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["yin"]
  },
  "application/zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["zip"]
  },
  "application/zlib": {
    "source": "iana"
  },
  "application/zstd": {
    "source": "iana"
  },
  "audio/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "audio/32kadpcm": {
    "source": "iana"
  },
  "audio/3gpp": {
    "source": "iana",
    "compressible": false,
    "extensions": ["3gpp"]
  },
  "audio/3gpp2": {
    "source": "iana"
  },
  "audio/aac": {
    "source": "iana"
  },
  "audio/ac3": {
    "source": "iana"
  },
  "audio/adpcm": {
    "source": "apache",
    "extensions": ["adp"]
  },
  "audio/amr": {
    "source": "iana",
    "extensions": ["amr"]
  },
  "audio/amr-wb": {
    "source": "iana"
  },
  "audio/amr-wb+": {
    "source": "iana"
  },
  "audio/aptx": {
    "source": "iana"
  },
  "audio/asc": {
    "source": "iana"
  },
  "audio/atrac-advanced-lossless": {
    "source": "iana"
  },
  "audio/atrac-x": {
    "source": "iana"
  },
  "audio/atrac3": {
    "source": "iana"
  },
  "audio/basic": {
    "source": "iana",
    "compressible": false,
    "extensions": ["au","snd"]
  },
  "audio/bv16": {
    "source": "iana"
  },
  "audio/bv32": {
    "source": "iana"
  },
  "audio/clearmode": {
    "source": "iana"
  },
  "audio/cn": {
    "source": "iana"
  },
  "audio/dat12": {
    "source": "iana"
  },
  "audio/dls": {
    "source": "iana"
  },
  "audio/dsr-es201108": {
    "source": "iana"
  },
  "audio/dsr-es202050": {
    "source": "iana"
  },
  "audio/dsr-es202211": {
    "source": "iana"
  },
  "audio/dsr-es202212": {
    "source": "iana"
  },
  "audio/dv": {
    "source": "iana"
  },
  "audio/dvi4": {
    "source": "iana"
  },
  "audio/eac3": {
    "source": "iana"
  },
  "audio/encaprtp": {
    "source": "iana"
  },
  "audio/evrc": {
    "source": "iana"
  },
  "audio/evrc-qcp": {
    "source": "iana"
  },
  "audio/evrc0": {
    "source": "iana"
  },
  "audio/evrc1": {
    "source": "iana"
  },
  "audio/evrcb": {
    "source": "iana"
  },
  "audio/evrcb0": {
    "source": "iana"
  },
  "audio/evrcb1": {
    "source": "iana"
  },
  "audio/evrcnw": {
    "source": "iana"
  },
  "audio/evrcnw0": {
    "source": "iana"
  },
  "audio/evrcnw1": {
    "source": "iana"
  },
  "audio/evrcwb": {
    "source": "iana"
  },
  "audio/evrcwb0": {
    "source": "iana"
  },
  "audio/evrcwb1": {
    "source": "iana"
  },
  "audio/evs": {
    "source": "iana"
  },
  "audio/flexfec": {
    "source": "iana"
  },
  "audio/fwdred": {
    "source": "iana"
  },
  "audio/g711-0": {
    "source": "iana"
  },
  "audio/g719": {
    "source": "iana"
  },
  "audio/g722": {
    "source": "iana"
  },
  "audio/g7221": {
    "source": "iana"
  },
  "audio/g723": {
    "source": "iana"
  },
  "audio/g726-16": {
    "source": "iana"
  },
  "audio/g726-24": {
    "source": "iana"
  },
  "audio/g726-32": {
    "source": "iana"
  },
  "audio/g726-40": {
    "source": "iana"
  },
  "audio/g728": {
    "source": "iana"
  },
  "audio/g729": {
    "source": "iana"
  },
  "audio/g7291": {
    "source": "iana"
  },
  "audio/g729d": {
    "source": "iana"
  },
  "audio/g729e": {
    "source": "iana"
  },
  "audio/gsm": {
    "source": "iana"
  },
  "audio/gsm-efr": {
    "source": "iana"
  },
  "audio/gsm-hr-08": {
    "source": "iana"
  },
  "audio/ilbc": {
    "source": "iana"
  },
  "audio/ip-mr_v2.5": {
    "source": "iana"
  },
  "audio/isac": {
    "source": "apache"
  },
  "audio/l16": {
    "source": "iana"
  },
  "audio/l20": {
    "source": "iana"
  },
  "audio/l24": {
    "source": "iana",
    "compressible": false
  },
  "audio/l8": {
    "source": "iana"
  },
  "audio/lpc": {
    "source": "iana"
  },
  "audio/melp": {
    "source": "iana"
  },
  "audio/melp1200": {
    "source": "iana"
  },
  "audio/melp2400": {
    "source": "iana"
  },
  "audio/melp600": {
    "source": "iana"
  },
  "audio/mhas": {
    "source": "iana"
  },
  "audio/midi": {
    "source": "apache",
    "extensions": ["mid","midi","kar","rmi"]
  },
  "audio/mobile-xmf": {
    "source": "iana",
    "extensions": ["mxmf"]
  },
  "audio/mp3": {
    "compressible": false,
    "extensions": ["mp3"]
  },
  "audio/mp4": {
    "source": "iana",
    "compressible": false,
    "extensions": ["m4a","mp4a"]
  },
  "audio/mp4a-latm": {
    "source": "iana"
  },
  "audio/mpa": {
    "source": "iana"
  },
  "audio/mpa-robust": {
    "source": "iana"
  },
  "audio/mpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mpga","mp2","mp2a","mp3","m2a","m3a"]
  },
  "audio/mpeg4-generic": {
    "source": "iana"
  },
  "audio/musepack": {
    "source": "apache"
  },
  "audio/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["oga","ogg","spx","opus"]
  },
  "audio/opus": {
    "source": "iana"
  },
  "audio/parityfec": {
    "source": "iana"
  },
  "audio/pcma": {
    "source": "iana"
  },
  "audio/pcma-wb": {
    "source": "iana"
  },
  "audio/pcmu": {
    "source": "iana"
  },
  "audio/pcmu-wb": {
    "source": "iana"
  },
  "audio/prs.sid": {
    "source": "iana"
  },
  "audio/qcelp": {
    "source": "iana"
  },
  "audio/raptorfec": {
    "source": "iana"
  },
  "audio/red": {
    "source": "iana"
  },
  "audio/rtp-enc-aescm128": {
    "source": "iana"
  },
  "audio/rtp-midi": {
    "source": "iana"
  },
  "audio/rtploopback": {
    "source": "iana"
  },
  "audio/rtx": {
    "source": "iana"
  },
  "audio/s3m": {
    "source": "apache",
    "extensions": ["s3m"]
  },
  "audio/scip": {
    "source": "iana"
  },
  "audio/silk": {
    "source": "apache",
    "extensions": ["sil"]
  },
  "audio/smv": {
    "source": "iana"
  },
  "audio/smv-qcp": {
    "source": "iana"
  },
  "audio/smv0": {
    "source": "iana"
  },
  "audio/sofa": {
    "source": "iana"
  },
  "audio/sp-midi": {
    "source": "iana"
  },
  "audio/speex": {
    "source": "iana"
  },
  "audio/t140c": {
    "source": "iana"
  },
  "audio/t38": {
    "source": "iana"
  },
  "audio/telephone-event": {
    "source": "iana"
  },
  "audio/tetra_acelp": {
    "source": "iana"
  },
  "audio/tetra_acelp_bb": {
    "source": "iana"
  },
  "audio/tone": {
    "source": "iana"
  },
  "audio/tsvcis": {
    "source": "iana"
  },
  "audio/uemclip": {
    "source": "iana"
  },
  "audio/ulpfec": {
    "source": "iana"
  },
  "audio/usac": {
    "source": "iana"
  },
  "audio/vdvi": {
    "source": "iana"
  },
  "audio/vmr-wb": {
    "source": "iana"
  },
  "audio/vnd.3gpp.iufp": {
    "source": "iana"
  },
  "audio/vnd.4sb": {
    "source": "iana"
  },
  "audio/vnd.audiokoz": {
    "source": "iana"
  },
  "audio/vnd.celp": {
    "source": "iana"
  },
  "audio/vnd.cisco.nse": {
    "source": "iana"
  },
  "audio/vnd.cmles.radio-events": {
    "source": "iana"
  },
  "audio/vnd.cns.anp1": {
    "source": "iana"
  },
  "audio/vnd.cns.inf1": {
    "source": "iana"
  },
  "audio/vnd.dece.audio": {
    "source": "iana",
    "extensions": ["uva","uvva"]
  },
  "audio/vnd.digital-winds": {
    "source": "iana",
    "extensions": ["eol"]
  },
  "audio/vnd.dlna.adts": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.1": {
    "source": "iana"
  },
  "audio/vnd.dolby.heaac.2": {
    "source": "iana"
  },
  "audio/vnd.dolby.mlp": {
    "source": "iana"
  },
  "audio/vnd.dolby.mps": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2x": {
    "source": "iana"
  },
  "audio/vnd.dolby.pl2z": {
    "source": "iana"
  },
  "audio/vnd.dolby.pulse.1": {
    "source": "iana"
  },
  "audio/vnd.dra": {
    "source": "iana",
    "extensions": ["dra"]
  },
  "audio/vnd.dts": {
    "source": "iana",
    "extensions": ["dts"]
  },
  "audio/vnd.dts.hd": {
    "source": "iana",
    "extensions": ["dtshd"]
  },
  "audio/vnd.dts.uhd": {
    "source": "iana"
  },
  "audio/vnd.dvb.file": {
    "source": "iana"
  },
  "audio/vnd.everad.plj": {
    "source": "iana"
  },
  "audio/vnd.hns.audio": {
    "source": "iana"
  },
  "audio/vnd.lucent.voice": {
    "source": "iana",
    "extensions": ["lvp"]
  },
  "audio/vnd.ms-playready.media.pya": {
    "source": "iana",
    "extensions": ["pya"]
  },
  "audio/vnd.nokia.mobile-xmf": {
    "source": "iana"
  },
  "audio/vnd.nortel.vbk": {
    "source": "iana"
  },
  "audio/vnd.nuera.ecelp4800": {
    "source": "iana",
    "extensions": ["ecelp4800"]
  },
  "audio/vnd.nuera.ecelp7470": {
    "source": "iana",
    "extensions": ["ecelp7470"]
  },
  "audio/vnd.nuera.ecelp9600": {
    "source": "iana",
    "extensions": ["ecelp9600"]
  },
  "audio/vnd.octel.sbc": {
    "source": "iana"
  },
  "audio/vnd.presonus.multitrack": {
    "source": "iana"
  },
  "audio/vnd.qcelp": {
    "source": "iana"
  },
  "audio/vnd.rhetorex.32kadpcm": {
    "source": "iana"
  },
  "audio/vnd.rip": {
    "source": "iana",
    "extensions": ["rip"]
  },
  "audio/vnd.rn-realaudio": {
    "compressible": false
  },
  "audio/vnd.sealedmedia.softseal.mpeg": {
    "source": "iana"
  },
  "audio/vnd.vmx.cvsd": {
    "source": "iana"
  },
  "audio/vnd.wave": {
    "compressible": false
  },
  "audio/vorbis": {
    "source": "iana",
    "compressible": false
  },
  "audio/vorbis-config": {
    "source": "iana"
  },
  "audio/wav": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/wave": {
    "compressible": false,
    "extensions": ["wav"]
  },
  "audio/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["weba"]
  },
  "audio/x-aac": {
    "source": "apache",
    "compressible": false,
    "extensions": ["aac"]
  },
  "audio/x-aiff": {
    "source": "apache",
    "extensions": ["aif","aiff","aifc"]
  },
  "audio/x-caf": {
    "source": "apache",
    "compressible": false,
    "extensions": ["caf"]
  },
  "audio/x-flac": {
    "source": "apache",
    "extensions": ["flac"]
  },
  "audio/x-m4a": {
    "source": "nginx",
    "extensions": ["m4a"]
  },
  "audio/x-matroska": {
    "source": "apache",
    "extensions": ["mka"]
  },
  "audio/x-mpegurl": {
    "source": "apache",
    "extensions": ["m3u"]
  },
  "audio/x-ms-wax": {
    "source": "apache",
    "extensions": ["wax"]
  },
  "audio/x-ms-wma": {
    "source": "apache",
    "extensions": ["wma"]
  },
  "audio/x-pn-realaudio": {
    "source": "apache",
    "extensions": ["ram","ra"]
  },
  "audio/x-pn-realaudio-plugin": {
    "source": "apache",
    "extensions": ["rmp"]
  },
  "audio/x-realaudio": {
    "source": "nginx",
    "extensions": ["ra"]
  },
  "audio/x-tta": {
    "source": "apache"
  },
  "audio/x-wav": {
    "source": "apache",
    "extensions": ["wav"]
  },
  "audio/xm": {
    "source": "apache",
    "extensions": ["xm"]
  },
  "chemical/x-cdx": {
    "source": "apache",
    "extensions": ["cdx"]
  },
  "chemical/x-cif": {
    "source": "apache",
    "extensions": ["cif"]
  },
  "chemical/x-cmdf": {
    "source": "apache",
    "extensions": ["cmdf"]
  },
  "chemical/x-cml": {
    "source": "apache",
    "extensions": ["cml"]
  },
  "chemical/x-csml": {
    "source": "apache",
    "extensions": ["csml"]
  },
  "chemical/x-pdb": {
    "source": "apache"
  },
  "chemical/x-xyz": {
    "source": "apache",
    "extensions": ["xyz"]
  },
  "font/collection": {
    "source": "iana",
    "extensions": ["ttc"]
  },
  "font/otf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["otf"]
  },
  "font/sfnt": {
    "source": "iana"
  },
  "font/ttf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ttf"]
  },
  "font/woff": {
    "source": "iana",
    "extensions": ["woff"]
  },
  "font/woff2": {
    "source": "iana",
    "extensions": ["woff2"]
  },
  "image/aces": {
    "source": "iana",
    "extensions": ["exr"]
  },
  "image/apng": {
    "compressible": false,
    "extensions": ["apng"]
  },
  "image/avci": {
    "source": "iana",
    "extensions": ["avci"]
  },
  "image/avcs": {
    "source": "iana",
    "extensions": ["avcs"]
  },
  "image/avif": {
    "source": "iana",
    "compressible": false,
    "extensions": ["avif"]
  },
  "image/bmp": {
    "source": "iana",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/cgm": {
    "source": "iana",
    "extensions": ["cgm"]
  },
  "image/dicom-rle": {
    "source": "iana",
    "extensions": ["drle"]
  },
  "image/emf": {
    "source": "iana",
    "extensions": ["emf"]
  },
  "image/fits": {
    "source": "iana",
    "extensions": ["fits"]
  },
  "image/g3fax": {
    "source": "iana",
    "extensions": ["g3"]
  },
  "image/gif": {
    "source": "iana",
    "compressible": false,
    "extensions": ["gif"]
  },
  "image/heic": {
    "source": "iana",
    "extensions": ["heic"]
  },
  "image/heic-sequence": {
    "source": "iana",
    "extensions": ["heics"]
  },
  "image/heif": {
    "source": "iana",
    "extensions": ["heif"]
  },
  "image/heif-sequence": {
    "source": "iana",
    "extensions": ["heifs"]
  },
  "image/hej2k": {
    "source": "iana",
    "extensions": ["hej2"]
  },
  "image/hsj2": {
    "source": "iana",
    "extensions": ["hsj2"]
  },
  "image/ief": {
    "source": "iana",
    "extensions": ["ief"]
  },
  "image/jls": {
    "source": "iana",
    "extensions": ["jls"]
  },
  "image/jp2": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jp2","jpg2"]
  },
  "image/jpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpeg","jpg","jpe"]
  },
  "image/jph": {
    "source": "iana",
    "extensions": ["jph"]
  },
  "image/jphc": {
    "source": "iana",
    "extensions": ["jhc"]
  },
  "image/jpm": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpm"]
  },
  "image/jpx": {
    "source": "iana",
    "compressible": false,
    "extensions": ["jpx","jpf"]
  },
  "image/jxr": {
    "source": "iana",
    "extensions": ["jxr"]
  },
  "image/jxra": {
    "source": "iana",
    "extensions": ["jxra"]
  },
  "image/jxrs": {
    "source": "iana",
    "extensions": ["jxrs"]
  },
  "image/jxs": {
    "source": "iana",
    "extensions": ["jxs"]
  },
  "image/jxsc": {
    "source": "iana",
    "extensions": ["jxsc"]
  },
  "image/jxsi": {
    "source": "iana",
    "extensions": ["jxsi"]
  },
  "image/jxss": {
    "source": "iana",
    "extensions": ["jxss"]
  },
  "image/ktx": {
    "source": "iana",
    "extensions": ["ktx"]
  },
  "image/ktx2": {
    "source": "iana",
    "extensions": ["ktx2"]
  },
  "image/naplps": {
    "source": "iana"
  },
  "image/pjpeg": {
    "compressible": false
  },
  "image/png": {
    "source": "iana",
    "compressible": false,
    "extensions": ["png"]
  },
  "image/prs.btif": {
    "source": "iana",
    "extensions": ["btif"]
  },
  "image/prs.pti": {
    "source": "iana",
    "extensions": ["pti"]
  },
  "image/pwg-raster": {
    "source": "iana"
  },
  "image/sgi": {
    "source": "apache",
    "extensions": ["sgi"]
  },
  "image/svg+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["svg","svgz"]
  },
  "image/t38": {
    "source": "iana",
    "extensions": ["t38"]
  },
  "image/tiff": {
    "source": "iana",
    "compressible": false,
    "extensions": ["tif","tiff"]
  },
  "image/tiff-fx": {
    "source": "iana",
    "extensions": ["tfx"]
  },
  "image/vnd.adobe.photoshop": {
    "source": "iana",
    "compressible": true,
    "extensions": ["psd"]
  },
  "image/vnd.airzip.accelerator.azv": {
    "source": "iana",
    "extensions": ["azv"]
  },
  "image/vnd.cns.inf2": {
    "source": "iana"
  },
  "image/vnd.dece.graphic": {
    "source": "iana",
    "extensions": ["uvi","uvvi","uvg","uvvg"]
  },
  "image/vnd.djvu": {
    "source": "iana",
    "extensions": ["djvu","djv"]
  },
  "image/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "image/vnd.dwg": {
    "source": "iana",
    "extensions": ["dwg"]
  },
  "image/vnd.dxf": {
    "source": "iana",
    "extensions": ["dxf"]
  },
  "image/vnd.fastbidsheet": {
    "source": "iana",
    "extensions": ["fbs"]
  },
  "image/vnd.fpx": {
    "source": "iana",
    "extensions": ["fpx"]
  },
  "image/vnd.fst": {
    "source": "iana",
    "extensions": ["fst"]
  },
  "image/vnd.fujixerox.edmics-mmr": {
    "source": "iana",
    "extensions": ["mmr"]
  },
  "image/vnd.fujixerox.edmics-rlc": {
    "source": "iana",
    "extensions": ["rlc"]
  },
  "image/vnd.globalgraphics.pgb": {
    "source": "iana"
  },
  "image/vnd.microsoft.icon": {
    "source": "iana",
    "compressible": true,
    "extensions": ["ico"]
  },
  "image/vnd.mix": {
    "source": "iana"
  },
  "image/vnd.mozilla.apng": {
    "source": "iana"
  },
  "image/vnd.ms-dds": {
    "compressible": true,
    "extensions": ["dds"]
  },
  "image/vnd.ms-modi": {
    "source": "iana",
    "extensions": ["mdi"]
  },
  "image/vnd.ms-photo": {
    "source": "apache",
    "extensions": ["wdp"]
  },
  "image/vnd.net-fpx": {
    "source": "iana",
    "extensions": ["npx"]
  },
  "image/vnd.pco.b16": {
    "source": "iana",
    "extensions": ["b16"]
  },
  "image/vnd.radiance": {
    "source": "iana"
  },
  "image/vnd.sealed.png": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.gif": {
    "source": "iana"
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    "source": "iana"
  },
  "image/vnd.svf": {
    "source": "iana"
  },
  "image/vnd.tencent.tap": {
    "source": "iana",
    "extensions": ["tap"]
  },
  "image/vnd.valve.source.texture": {
    "source": "iana",
    "extensions": ["vtf"]
  },
  "image/vnd.wap.wbmp": {
    "source": "iana",
    "extensions": ["wbmp"]
  },
  "image/vnd.xiff": {
    "source": "iana",
    "extensions": ["xif"]
  },
  "image/vnd.zbrush.pcx": {
    "source": "iana",
    "extensions": ["pcx"]
  },
  "image/webp": {
    "source": "apache",
    "extensions": ["webp"]
  },
  "image/wmf": {
    "source": "iana",
    "extensions": ["wmf"]
  },
  "image/x-3ds": {
    "source": "apache",
    "extensions": ["3ds"]
  },
  "image/x-cmu-raster": {
    "source": "apache",
    "extensions": ["ras"]
  },
  "image/x-cmx": {
    "source": "apache",
    "extensions": ["cmx"]
  },
  "image/x-freehand": {
    "source": "apache",
    "extensions": ["fh","fhc","fh4","fh5","fh7"]
  },
  "image/x-icon": {
    "source": "apache",
    "compressible": true,
    "extensions": ["ico"]
  },
  "image/x-jng": {
    "source": "nginx",
    "extensions": ["jng"]
  },
  "image/x-mrsid-image": {
    "source": "apache",
    "extensions": ["sid"]
  },
  "image/x-ms-bmp": {
    "source": "nginx",
    "compressible": true,
    "extensions": ["bmp"]
  },
  "image/x-pcx": {
    "source": "apache",
    "extensions": ["pcx"]
  },
  "image/x-pict": {
    "source": "apache",
    "extensions": ["pic","pct"]
  },
  "image/x-portable-anymap": {
    "source": "apache",
    "extensions": ["pnm"]
  },
  "image/x-portable-bitmap": {
    "source": "apache",
    "extensions": ["pbm"]
  },
  "image/x-portable-graymap": {
    "source": "apache",
    "extensions": ["pgm"]
  },
  "image/x-portable-pixmap": {
    "source": "apache",
    "extensions": ["ppm"]
  },
  "image/x-rgb": {
    "source": "apache",
    "extensions": ["rgb"]
  },
  "image/x-tga": {
    "source": "apache",
    "extensions": ["tga"]
  },
  "image/x-xbitmap": {
    "source": "apache",
    "extensions": ["xbm"]
  },
  "image/x-xcf": {
    "compressible": false
  },
  "image/x-xpixmap": {
    "source": "apache",
    "extensions": ["xpm"]
  },
  "image/x-xwindowdump": {
    "source": "apache",
    "extensions": ["xwd"]
  },
  "message/cpim": {
    "source": "iana"
  },
  "message/delivery-status": {
    "source": "iana"
  },
  "message/disposition-notification": {
    "source": "iana",
    "extensions": [
      "disposition-notification"
    ]
  },
  "message/external-body": {
    "source": "iana"
  },
  "message/feedback-report": {
    "source": "iana"
  },
  "message/global": {
    "source": "iana",
    "extensions": ["u8msg"]
  },
  "message/global-delivery-status": {
    "source": "iana",
    "extensions": ["u8dsn"]
  },
  "message/global-disposition-notification": {
    "source": "iana",
    "extensions": ["u8mdn"]
  },
  "message/global-headers": {
    "source": "iana",
    "extensions": ["u8hdr"]
  },
  "message/http": {
    "source": "iana",
    "compressible": false
  },
  "message/imdn+xml": {
    "source": "iana",
    "compressible": true
  },
  "message/news": {
    "source": "iana"
  },
  "message/partial": {
    "source": "iana",
    "compressible": false
  },
  "message/rfc822": {
    "source": "iana",
    "compressible": true,
    "extensions": ["eml","mime"]
  },
  "message/s-http": {
    "source": "iana"
  },
  "message/sip": {
    "source": "iana"
  },
  "message/sipfrag": {
    "source": "iana"
  },
  "message/tracking-status": {
    "source": "iana"
  },
  "message/vnd.si.simp": {
    "source": "iana"
  },
  "message/vnd.wfa.wsc": {
    "source": "iana",
    "extensions": ["wsc"]
  },
  "model/3mf": {
    "source": "iana",
    "extensions": ["3mf"]
  },
  "model/e57": {
    "source": "iana"
  },
  "model/gltf+json": {
    "source": "iana",
    "compressible": true,
    "extensions": ["gltf"]
  },
  "model/gltf-binary": {
    "source": "iana",
    "compressible": true,
    "extensions": ["glb"]
  },
  "model/iges": {
    "source": "iana",
    "compressible": false,
    "extensions": ["igs","iges"]
  },
  "model/mesh": {
    "source": "iana",
    "compressible": false,
    "extensions": ["msh","mesh","silo"]
  },
  "model/mtl": {
    "source": "iana",
    "extensions": ["mtl"]
  },
  "model/obj": {
    "source": "iana",
    "extensions": ["obj"]
  },
  "model/step": {
    "source": "iana"
  },
  "model/step+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["stpx"]
  },
  "model/step+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["stpz"]
  },
  "model/step-xml+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["stpxz"]
  },
  "model/stl": {
    "source": "iana",
    "extensions": ["stl"]
  },
  "model/vnd.collada+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["dae"]
  },
  "model/vnd.dwf": {
    "source": "iana",
    "extensions": ["dwf"]
  },
  "model/vnd.flatland.3dml": {
    "source": "iana"
  },
  "model/vnd.gdl": {
    "source": "iana",
    "extensions": ["gdl"]
  },
  "model/vnd.gs-gdl": {
    "source": "apache"
  },
  "model/vnd.gs.gdl": {
    "source": "iana"
  },
  "model/vnd.gtw": {
    "source": "iana",
    "extensions": ["gtw"]
  },
  "model/vnd.moml+xml": {
    "source": "iana",
    "compressible": true
  },
  "model/vnd.mts": {
    "source": "iana",
    "extensions": ["mts"]
  },
  "model/vnd.opengex": {
    "source": "iana",
    "extensions": ["ogex"]
  },
  "model/vnd.parasolid.transmit.binary": {
    "source": "iana",
    "extensions": ["x_b"]
  },
  "model/vnd.parasolid.transmit.text": {
    "source": "iana",
    "extensions": ["x_t"]
  },
  "model/vnd.pytha.pyox": {
    "source": "iana"
  },
  "model/vnd.rosette.annotated-data-model": {
    "source": "iana"
  },
  "model/vnd.sap.vds": {
    "source": "iana",
    "extensions": ["vds"]
  },
  "model/vnd.usdz+zip": {
    "source": "iana",
    "compressible": false,
    "extensions": ["usdz"]
  },
  "model/vnd.valve.source.compiled-map": {
    "source": "iana",
    "extensions": ["bsp"]
  },
  "model/vnd.vtu": {
    "source": "iana",
    "extensions": ["vtu"]
  },
  "model/vrml": {
    "source": "iana",
    "compressible": false,
    "extensions": ["wrl","vrml"]
  },
  "model/x3d+binary": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3db","x3dbz"]
  },
  "model/x3d+fastinfoset": {
    "source": "iana",
    "extensions": ["x3db"]
  },
  "model/x3d+vrml": {
    "source": "apache",
    "compressible": false,
    "extensions": ["x3dv","x3dvz"]
  },
  "model/x3d+xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["x3d","x3dz"]
  },
  "model/x3d-vrml": {
    "source": "iana",
    "extensions": ["x3dv"]
  },
  "multipart/alternative": {
    "source": "iana",
    "compressible": false
  },
  "multipart/appledouble": {
    "source": "iana"
  },
  "multipart/byteranges": {
    "source": "iana"
  },
  "multipart/digest": {
    "source": "iana"
  },
  "multipart/encrypted": {
    "source": "iana",
    "compressible": false
  },
  "multipart/form-data": {
    "source": "iana",
    "compressible": false
  },
  "multipart/header-set": {
    "source": "iana"
  },
  "multipart/mixed": {
    "source": "iana"
  },
  "multipart/multilingual": {
    "source": "iana"
  },
  "multipart/parallel": {
    "source": "iana"
  },
  "multipart/related": {
    "source": "iana",
    "compressible": false
  },
  "multipart/report": {
    "source": "iana"
  },
  "multipart/signed": {
    "source": "iana",
    "compressible": false
  },
  "multipart/vnd.bint.med-plus": {
    "source": "iana"
  },
  "multipart/voice-message": {
    "source": "iana"
  },
  "multipart/x-mixed-replace": {
    "source": "iana"
  },
  "text/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "text/cache-manifest": {
    "source": "iana",
    "compressible": true,
    "extensions": ["appcache","manifest"]
  },
  "text/calendar": {
    "source": "iana",
    "extensions": ["ics","ifb"]
  },
  "text/calender": {
    "compressible": true
  },
  "text/cmd": {
    "compressible": true
  },
  "text/coffeescript": {
    "extensions": ["coffee","litcoffee"]
  },
  "text/cql": {
    "source": "iana"
  },
  "text/cql-expression": {
    "source": "iana"
  },
  "text/cql-identifier": {
    "source": "iana"
  },
  "text/css": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["css"]
  },
  "text/csv": {
    "source": "iana",
    "compressible": true,
    "extensions": ["csv"]
  },
  "text/csv-schema": {
    "source": "iana"
  },
  "text/directory": {
    "source": "iana"
  },
  "text/dns": {
    "source": "iana"
  },
  "text/ecmascript": {
    "source": "iana"
  },
  "text/encaprtp": {
    "source": "iana"
  },
  "text/enriched": {
    "source": "iana"
  },
  "text/fhirpath": {
    "source": "iana"
  },
  "text/flexfec": {
    "source": "iana"
  },
  "text/fwdred": {
    "source": "iana"
  },
  "text/gff3": {
    "source": "iana"
  },
  "text/grammar-ref-list": {
    "source": "iana"
  },
  "text/html": {
    "source": "iana",
    "compressible": true,
    "extensions": ["html","htm","shtml"]
  },
  "text/jade": {
    "extensions": ["jade"]
  },
  "text/javascript": {
    "source": "iana",
    "compressible": true
  },
  "text/jcr-cnd": {
    "source": "iana"
  },
  "text/jsx": {
    "compressible": true,
    "extensions": ["jsx"]
  },
  "text/less": {
    "compressible": true,
    "extensions": ["less"]
  },
  "text/markdown": {
    "source": "iana",
    "compressible": true,
    "extensions": ["markdown","md"]
  },
  "text/mathml": {
    "source": "nginx",
    "extensions": ["mml"]
  },
  "text/mdx": {
    "compressible": true,
    "extensions": ["mdx"]
  },
  "text/mizar": {
    "source": "iana"
  },
  "text/n3": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["n3"]
  },
  "text/parameters": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/parityfec": {
    "source": "iana"
  },
  "text/plain": {
    "source": "iana",
    "compressible": true,
    "extensions": ["txt","text","conf","def","list","log","in","ini"]
  },
  "text/provenance-notation": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/prs.fallenstein.rst": {
    "source": "iana"
  },
  "text/prs.lines.tag": {
    "source": "iana",
    "extensions": ["dsc"]
  },
  "text/prs.prop.logic": {
    "source": "iana"
  },
  "text/raptorfec": {
    "source": "iana"
  },
  "text/red": {
    "source": "iana"
  },
  "text/rfc822-headers": {
    "source": "iana"
  },
  "text/richtext": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtx"]
  },
  "text/rtf": {
    "source": "iana",
    "compressible": true,
    "extensions": ["rtf"]
  },
  "text/rtp-enc-aescm128": {
    "source": "iana"
  },
  "text/rtploopback": {
    "source": "iana"
  },
  "text/rtx": {
    "source": "iana"
  },
  "text/sgml": {
    "source": "iana",
    "extensions": ["sgml","sgm"]
  },
  "text/shaclc": {
    "source": "iana"
  },
  "text/shex": {
    "source": "iana",
    "extensions": ["shex"]
  },
  "text/slim": {
    "extensions": ["slim","slm"]
  },
  "text/spdx": {
    "source": "iana",
    "extensions": ["spdx"]
  },
  "text/strings": {
    "source": "iana"
  },
  "text/stylus": {
    "extensions": ["stylus","styl"]
  },
  "text/t140": {
    "source": "iana"
  },
  "text/tab-separated-values": {
    "source": "iana",
    "compressible": true,
    "extensions": ["tsv"]
  },
  "text/troff": {
    "source": "iana",
    "extensions": ["t","tr","roff","man","me","ms"]
  },
  "text/turtle": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["ttl"]
  },
  "text/ulpfec": {
    "source": "iana"
  },
  "text/uri-list": {
    "source": "iana",
    "compressible": true,
    "extensions": ["uri","uris","urls"]
  },
  "text/vcard": {
    "source": "iana",
    "compressible": true,
    "extensions": ["vcard"]
  },
  "text/vnd.a": {
    "source": "iana"
  },
  "text/vnd.abc": {
    "source": "iana"
  },
  "text/vnd.ascii-art": {
    "source": "iana"
  },
  "text/vnd.curl": {
    "source": "iana",
    "extensions": ["curl"]
  },
  "text/vnd.curl.dcurl": {
    "source": "apache",
    "extensions": ["dcurl"]
  },
  "text/vnd.curl.mcurl": {
    "source": "apache",
    "extensions": ["mcurl"]
  },
  "text/vnd.curl.scurl": {
    "source": "apache",
    "extensions": ["scurl"]
  },
  "text/vnd.debian.copyright": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.dmclientscript": {
    "source": "iana"
  },
  "text/vnd.dvb.subtitle": {
    "source": "iana",
    "extensions": ["sub"]
  },
  "text/vnd.esmertec.theme-descriptor": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.familysearch.gedcom": {
    "source": "iana",
    "extensions": ["ged"]
  },
  "text/vnd.ficlab.flt": {
    "source": "iana"
  },
  "text/vnd.fly": {
    "source": "iana",
    "extensions": ["fly"]
  },
  "text/vnd.fmi.flexstor": {
    "source": "iana",
    "extensions": ["flx"]
  },
  "text/vnd.gml": {
    "source": "iana"
  },
  "text/vnd.graphviz": {
    "source": "iana",
    "extensions": ["gv"]
  },
  "text/vnd.hans": {
    "source": "iana"
  },
  "text/vnd.hgl": {
    "source": "iana"
  },
  "text/vnd.in3d.3dml": {
    "source": "iana",
    "extensions": ["3dml"]
  },
  "text/vnd.in3d.spot": {
    "source": "iana",
    "extensions": ["spot"]
  },
  "text/vnd.iptc.newsml": {
    "source": "iana"
  },
  "text/vnd.iptc.nitf": {
    "source": "iana"
  },
  "text/vnd.latex-z": {
    "source": "iana"
  },
  "text/vnd.motorola.reflex": {
    "source": "iana"
  },
  "text/vnd.ms-mediapackage": {
    "source": "iana"
  },
  "text/vnd.net2phone.commcenter.command": {
    "source": "iana"
  },
  "text/vnd.radisys.msml-basic-layout": {
    "source": "iana"
  },
  "text/vnd.senx.warpscript": {
    "source": "iana"
  },
  "text/vnd.si.uricatalogue": {
    "source": "iana"
  },
  "text/vnd.sosi": {
    "source": "iana"
  },
  "text/vnd.sun.j2me.app-descriptor": {
    "source": "iana",
    "charset": "UTF-8",
    "extensions": ["jad"]
  },
  "text/vnd.trolltech.linguist": {
    "source": "iana",
    "charset": "UTF-8"
  },
  "text/vnd.wap.si": {
    "source": "iana"
  },
  "text/vnd.wap.sl": {
    "source": "iana"
  },
  "text/vnd.wap.wml": {
    "source": "iana",
    "extensions": ["wml"]
  },
  "text/vnd.wap.wmlscript": {
    "source": "iana",
    "extensions": ["wmls"]
  },
  "text/vtt": {
    "source": "iana",
    "charset": "UTF-8",
    "compressible": true,
    "extensions": ["vtt"]
  },
  "text/x-asm": {
    "source": "apache",
    "extensions": ["s","asm"]
  },
  "text/x-c": {
    "source": "apache",
    "extensions": ["c","cc","cxx","cpp","h","hh","dic"]
  },
  "text/x-component": {
    "source": "nginx",
    "extensions": ["htc"]
  },
  "text/x-fortran": {
    "source": "apache",
    "extensions": ["f","for","f77","f90"]
  },
  "text/x-gwt-rpc": {
    "compressible": true
  },
  "text/x-handlebars-template": {
    "extensions": ["hbs"]
  },
  "text/x-java-source": {
    "source": "apache",
    "extensions": ["java"]
  },
  "text/x-jquery-tmpl": {
    "compressible": true
  },
  "text/x-lua": {
    "extensions": ["lua"]
  },
  "text/x-markdown": {
    "compressible": true,
    "extensions": ["mkd"]
  },
  "text/x-nfo": {
    "source": "apache",
    "extensions": ["nfo"]
  },
  "text/x-opml": {
    "source": "apache",
    "extensions": ["opml"]
  },
  "text/x-org": {
    "compressible": true,
    "extensions": ["org"]
  },
  "text/x-pascal": {
    "source": "apache",
    "extensions": ["p","pas"]
  },
  "text/x-processing": {
    "compressible": true,
    "extensions": ["pde"]
  },
  "text/x-sass": {
    "extensions": ["sass"]
  },
  "text/x-scss": {
    "extensions": ["scss"]
  },
  "text/x-setext": {
    "source": "apache",
    "extensions": ["etx"]
  },
  "text/x-sfv": {
    "source": "apache",
    "extensions": ["sfv"]
  },
  "text/x-suse-ymp": {
    "compressible": true,
    "extensions": ["ymp"]
  },
  "text/x-uuencode": {
    "source": "apache",
    "extensions": ["uu"]
  },
  "text/x-vcalendar": {
    "source": "apache",
    "extensions": ["vcs"]
  },
  "text/x-vcard": {
    "source": "apache",
    "extensions": ["vcf"]
  },
  "text/xml": {
    "source": "iana",
    "compressible": true,
    "extensions": ["xml"]
  },
  "text/xml-external-parsed-entity": {
    "source": "iana"
  },
  "text/yaml": {
    "compressible": true,
    "extensions": ["yaml","yml"]
  },
  "video/1d-interleaved-parityfec": {
    "source": "iana"
  },
  "video/3gpp": {
    "source": "iana",
    "extensions": ["3gp","3gpp"]
  },
  "video/3gpp-tt": {
    "source": "iana"
  },
  "video/3gpp2": {
    "source": "iana",
    "extensions": ["3g2"]
  },
  "video/av1": {
    "source": "iana"
  },
  "video/bmpeg": {
    "source": "iana"
  },
  "video/bt656": {
    "source": "iana"
  },
  "video/celb": {
    "source": "iana"
  },
  "video/dv": {
    "source": "iana"
  },
  "video/encaprtp": {
    "source": "iana"
  },
  "video/ffv1": {
    "source": "iana"
  },
  "video/flexfec": {
    "source": "iana"
  },
  "video/h261": {
    "source": "iana",
    "extensions": ["h261"]
  },
  "video/h263": {
    "source": "iana",
    "extensions": ["h263"]
  },
  "video/h263-1998": {
    "source": "iana"
  },
  "video/h263-2000": {
    "source": "iana"
  },
  "video/h264": {
    "source": "iana",
    "extensions": ["h264"]
  },
  "video/h264-rcdo": {
    "source": "iana"
  },
  "video/h264-svc": {
    "source": "iana"
  },
  "video/h265": {
    "source": "iana"
  },
  "video/iso.segment": {
    "source": "iana",
    "extensions": ["m4s"]
  },
  "video/jpeg": {
    "source": "iana",
    "extensions": ["jpgv"]
  },
  "video/jpeg2000": {
    "source": "iana"
  },
  "video/jpm": {
    "source": "apache",
    "extensions": ["jpm","jpgm"]
  },
  "video/jxsv": {
    "source": "iana"
  },
  "video/mj2": {
    "source": "iana",
    "extensions": ["mj2","mjp2"]
  },
  "video/mp1s": {
    "source": "iana"
  },
  "video/mp2p": {
    "source": "iana"
  },
  "video/mp2t": {
    "source": "iana",
    "extensions": ["ts"]
  },
  "video/mp4": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mp4","mp4v","mpg4"]
  },
  "video/mp4v-es": {
    "source": "iana"
  },
  "video/mpeg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["mpeg","mpg","mpe","m1v","m2v"]
  },
  "video/mpeg4-generic": {
    "source": "iana"
  },
  "video/mpv": {
    "source": "iana"
  },
  "video/nv": {
    "source": "iana"
  },
  "video/ogg": {
    "source": "iana",
    "compressible": false,
    "extensions": ["ogv"]
  },
  "video/parityfec": {
    "source": "iana"
  },
  "video/pointer": {
    "source": "iana"
  },
  "video/quicktime": {
    "source": "iana",
    "compressible": false,
    "extensions": ["qt","mov"]
  },
  "video/raptorfec": {
    "source": "iana"
  },
  "video/raw": {
    "source": "iana"
  },
  "video/rtp-enc-aescm128": {
    "source": "iana"
  },
  "video/rtploopback": {
    "source": "iana"
  },
  "video/rtx": {
    "source": "iana"
  },
  "video/scip": {
    "source": "iana"
  },
  "video/smpte291": {
    "source": "iana"
  },
  "video/smpte292m": {
    "source": "iana"
  },
  "video/ulpfec": {
    "source": "iana"
  },
  "video/vc1": {
    "source": "iana"
  },
  "video/vc2": {
    "source": "iana"
  },
  "video/vnd.cctv": {
    "source": "iana"
  },
  "video/vnd.dece.hd": {
    "source": "iana",
    "extensions": ["uvh","uvvh"]
  },
  "video/vnd.dece.mobile": {
    "source": "iana",
    "extensions": ["uvm","uvvm"]
  },
  "video/vnd.dece.mp4": {
    "source": "iana"
  },
  "video/vnd.dece.pd": {
    "source": "iana",
    "extensions": ["uvp","uvvp"]
  },
  "video/vnd.dece.sd": {
    "source": "iana",
    "extensions": ["uvs","uvvs"]
  },
  "video/vnd.dece.video": {
    "source": "iana",
    "extensions": ["uvv","uvvv"]
  },
  "video/vnd.directv.mpeg": {
    "source": "iana"
  },
  "video/vnd.directv.mpeg-tts": {
    "source": "iana"
  },
  "video/vnd.dlna.mpeg-tts": {
    "source": "iana"
  },
  "video/vnd.dvb.file": {
    "source": "iana",
    "extensions": ["dvb"]
  },
  "video/vnd.fvt": {
    "source": "iana",
    "extensions": ["fvt"]
  },
  "video/vnd.hns.video": {
    "source": "iana"
  },
  "video/vnd.iptvforum.1dparityfec-1010": {
    "source": "iana"
  },
  "video/vnd.iptvforum.1dparityfec-2005": {
    "source": "iana"
  },
  "video/vnd.iptvforum.2dparityfec-1010": {
    "source": "iana"
  },
  "video/vnd.iptvforum.2dparityfec-2005": {
    "source": "iana"
  },
  "video/vnd.iptvforum.ttsavc": {
    "source": "iana"
  },
  "video/vnd.iptvforum.ttsmpeg2": {
    "source": "iana"
  },
  "video/vnd.motorola.video": {
    "source": "iana"
  },
  "video/vnd.motorola.videop": {
    "source": "iana"
  },
  "video/vnd.mpegurl": {
    "source": "iana",
    "extensions": ["mxu","m4u"]
  },
  "video/vnd.ms-playready.media.pyv": {
    "source": "iana",
    "extensions": ["pyv"]
  },
  "video/vnd.nokia.interleaved-multimedia": {
    "source": "iana"
  },
  "video/vnd.nokia.mp4vr": {
    "source": "iana"
  },
  "video/vnd.nokia.videovoip": {
    "source": "iana"
  },
  "video/vnd.objectvideo": {
    "source": "iana"
  },
  "video/vnd.radgamettools.bink": {
    "source": "iana"
  },
  "video/vnd.radgamettools.smacker": {
    "source": "iana"
  },
  "video/vnd.sealed.mpeg1": {
    "source": "iana"
  },
  "video/vnd.sealed.mpeg4": {
    "source": "iana"
  },
  "video/vnd.sealed.swf": {
    "source": "iana"
  },
  "video/vnd.sealedmedia.softseal.mov": {
    "source": "iana"
  },
  "video/vnd.uvvu.mp4": {
    "source": "iana",
    "extensions": ["uvu","uvvu"]
  },
  "video/vnd.vivo": {
    "source": "iana",
    "extensions": ["viv"]
  },
  "video/vnd.youtube.yt": {
    "source": "iana"
  },
  "video/vp8": {
    "source": "iana"
  },
  "video/vp9": {
    "source": "iana"
  },
  "video/webm": {
    "source": "apache",
    "compressible": false,
    "extensions": ["webm"]
  },
  "video/x-f4v": {
    "source": "apache",
    "extensions": ["f4v"]
  },
  "video/x-fli": {
    "source": "apache",
    "extensions": ["fli"]
  },
  "video/x-flv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["flv"]
  },
  "video/x-m4v": {
    "source": "apache",
    "extensions": ["m4v"]
  },
  "video/x-matroska": {
    "source": "apache",
    "compressible": false,
    "extensions": ["mkv","mk3d","mks"]
  },
  "video/x-mng": {
    "source": "apache",
    "extensions": ["mng"]
  },
  "video/x-ms-asf": {
    "source": "apache",
    "extensions": ["asf","asx"]
  },
  "video/x-ms-vob": {
    "source": "apache",
    "extensions": ["vob"]
  },
  "video/x-ms-wm": {
    "source": "apache",
    "extensions": ["wm"]
  },
  "video/x-ms-wmv": {
    "source": "apache",
    "compressible": false,
    "extensions": ["wmv"]
  },
  "video/x-ms-wmx": {
    "source": "apache",
    "extensions": ["wmx"]
  },
  "video/x-ms-wvx": {
    "source": "apache",
    "extensions": ["wvx"]
  },
  "video/x-msvideo": {
    "source": "apache",
    "extensions": ["avi"]
  },
  "video/x-sgi-movie": {
    "source": "apache",
    "extensions": ["movie"]
  },
  "video/x-smv": {
    "source": "apache",
    "extensions": ["smv"]
  },
  "x-conference/x-cooltalk": {
    "source": "apache",
    "extensions": ["ice"]
  },
  "x-shader/x-fragment": {
    "compressible": true
  },
  "x-shader/x-vertex": {
    "compressible": true
  }
}
`);
const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;
const extensions = new Map();
const types = new Map();
function populateMaps(extensions1, types1) {
    const preference = [
        "nginx",
        "apache",
        undefined,
        "iana"
    ];
    for (const type of Object.keys(__default)){
        const mime = __default[type];
        const exts = mime.extensions;
        if (!exts || !exts.length) {
            continue;
        }
        extensions1.set(type, exts);
        for (const ext of exts){
            const current = types1.get(ext);
            if (current) {
                const from = preference.indexOf(__default[current].source);
                const to = preference.indexOf(mime.source);
                if (current !== "application/octet-stream" && (from > to || from === to && current.startsWith("application/"))) {
                    continue;
                }
            }
            types1.set(ext, type);
        }
    }
}
populateMaps(extensions, types);
function charset(type) {
    const m6 = EXTRACT_TYPE_REGEXP.exec(type);
    if (!m6) {
        return undefined;
    }
    const [match] = m6;
    const mime = __default[match.toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    if (TEXT_TYPE_REGEXP.test(match)) {
        return "UTF-8";
    }
    return undefined;
}
function lookup(path60) {
    const extension1 = extname5(`x.${path60}`).toLowerCase().substring(1);
    return types.get(extension1);
}
function contentType(str7) {
    let mime = str7.includes("/") ? str7 : lookup(str7);
    if (!mime) {
        return undefined;
    }
    if (!mime.includes("charset")) {
        const cs = charset(mime);
        if (cs) {
            mime += `; charset=${cs.toLowerCase()}`;
        }
    }
    return mime;
}
function extension(type) {
    const match = EXTRACT_TYPE_REGEXP.exec(type);
    if (!match) {
        return undefined;
    }
    const exts = extensions.get(match[1].toLowerCase());
    if (!exts || !exts.length) {
        return undefined;
    }
    return exts[0];
}
function lexer(str8) {
    const tokens = [];
    let i49 = 0;
    while(i49 < str8.length){
        const __char = str8[i49];
        if (__char === "*" || __char === "+" || __char === "?") {
            tokens.push({
                type: "MODIFIER",
                index: i49,
                value: str8[i49++]
            });
            continue;
        }
        if (__char === "\\") {
            tokens.push({
                type: "ESCAPED_CHAR",
                index: i49++,
                value: str8[i49++]
            });
            continue;
        }
        if (__char === "{") {
            tokens.push({
                type: "OPEN",
                index: i49,
                value: str8[i49++]
            });
            continue;
        }
        if (__char === "}") {
            tokens.push({
                type: "CLOSE",
                index: i49,
                value: str8[i49++]
            });
            continue;
        }
        if (__char === ":") {
            let name = "";
            let j11 = i49 + 1;
            while(j11 < str8.length){
                const code33 = str8.charCodeAt(j11);
                if (code33 >= 48 && code33 <= 57 || code33 >= 65 && code33 <= 90 || code33 >= 97 && code33 <= 122 || code33 === 95) {
                    name += str8[j11++];
                    continue;
                }
                break;
            }
            if (!name) throw new TypeError(`Missing parameter name at ${i49}`);
            tokens.push({
                type: "NAME",
                index: i49,
                value: name
            });
            i49 = j11;
            continue;
        }
        if (__char === "(") {
            let count = 1;
            let pattern = "";
            let j12 = i49 + 1;
            if (str8[j12] === "?") {
                throw new TypeError(`Pattern cannot start with "?" at ${j12}`);
            }
            while(j12 < str8.length){
                if (str8[j12] === "\\") {
                    pattern += str8[j12++] + str8[j12++];
                    continue;
                }
                if (str8[j12] === ")") {
                    count--;
                    if (count === 0) {
                        j12++;
                        break;
                    }
                } else if (str8[j12] === "(") {
                    count++;
                    if (str8[j12 + 1] !== "?") {
                        throw new TypeError(`Capturing groups are not allowed at ${j12}`);
                    }
                }
                pattern += str8[j12++];
            }
            if (count) throw new TypeError(`Unbalanced pattern at ${i49}`);
            if (!pattern) throw new TypeError(`Missing pattern at ${i49}`);
            tokens.push({
                type: "PATTERN",
                index: i49,
                value: pattern
            });
            i49 = j12;
            continue;
        }
        tokens.push({
            type: "CHAR",
            index: i49,
            value: str8[i49++]
        });
    }
    tokens.push({
        type: "END",
        index: i49,
        value: ""
    });
    return tokens;
}
function parse7(str9, options = {}) {
    const tokens = lexer(str9);
    const { prefixes ="./"  } = options;
    const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`;
    const result1 = [];
    let key25 = 0;
    let i50 = 0;
    let path61 = "";
    const tryConsume = (type)=>{
        if (i50 < tokens.length && tokens[i50].type === type) return tokens[i50++].value;
    };
    const mustConsume = (type)=>{
        const value16 = tryConsume(type);
        if (value16 !== undefined) return value16;
        const { type: nextType , index  } = tokens[i50];
        throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
    };
    const consumeText = ()=>{
        let result = "";
        let value17;
        while(value17 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")){
            result += value17;
        }
        return result;
    };
    while(i50 < tokens.length){
        const __char = tryConsume("CHAR");
        const name = tryConsume("NAME");
        const pattern = tryConsume("PATTERN");
        if (name || pattern) {
            let prefix = __char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path61 += prefix;
                prefix = "";
            }
            if (path61) {
                result1.push(path61);
                path61 = "";
            }
            result1.push({
                name: name || key25++,
                prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        const value18 = __char || tryConsume("ESCAPED_CHAR");
        if (value18) {
            path61 += value18;
            continue;
        }
        if (path61) {
            result1.push(path61);
            path61 = "";
        }
        const open = tryConsume("OPEN");
        if (open) {
            const prefix = consumeText();
            const name = tryConsume("NAME") || "";
            const pattern = tryConsume("PATTERN") || "";
            const suffix = consumeText();
            mustConsume("CLOSE");
            result1.push({
                name: name || (pattern ? key25++ : ""),
                pattern: name && !pattern ? defaultPattern : pattern,
                prefix,
                suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result1;
}
function compile(str10, options) {
    return tokensToFunction(parse7(str10, options), options);
}
function tokensToFunction(tokens, options = {}) {
    const reFlags = flags(options);
    const { encode: encode3 = (x8)=>x8 , validate: validate1 = true  } = options;
    const matches = tokens.map((token)=>{
        if (typeof token === "object") {
            return new RegExp(`^(?:${token.pattern})$`, reFlags);
        }
    });
    return (data18)=>{
        let path62 = "";
        for(let i51 = 0; i51 < tokens.length; i51++){
            const token = tokens[i51];
            if (typeof token === "string") {
                path62 += token;
                continue;
            }
            const value19 = data18 ? data18[token.name] : undefined;
            const optional = token.modifier === "?" || token.modifier === "*";
            const repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value19)) {
                if (!repeat) {
                    throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                }
                if (value19.length === 0) {
                    if (optional) continue;
                    throw new TypeError(`Expected "${token.name}" to not be empty`);
                }
                for(let j13 = 0; j13 < value19.length; j13++){
                    const segment = encode3(value19[j13], token);
                    if (validate1 && !matches[i51].test(segment)) {
                        throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                    }
                    path62 += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value19 === "string" || typeof value19 === "number") {
                const segment = encode3(String(value19), token);
                if (validate1 && !matches[i51].test(segment)) {
                    throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                }
                path62 += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional) continue;
            const typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
        }
        return path62;
    };
}
function escapeString(str11) {
    return str11.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path63, keys) {
    if (!keys) return path63;
    const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    let index = 0;
    let execResult = groupsRegex.exec(path63.source);
    while(execResult){
        keys.push({
            name: execResult[1] || index++,
            prefix: "",
            suffix: "",
            modifier: "",
            pattern: ""
        });
        execResult = groupsRegex.exec(path63.source);
    }
    return path63;
}
function arrayToRegexp(paths, keys, options) {
    const parts1 = paths.map((path64)=>pathToRegexp(path64, keys, options).source);
    return new RegExp(`(?:${parts1.join("|")})`, flags(options));
}
function stringToRegexp(path65, keys, options) {
    return tokensToRegexp(parse7(path65, options), keys, options);
}
function tokensToRegexp(tokens, keys, options = {}) {
    const { strict =false , start =true , end =true , encode: encode4 = (x9)=>x9  } = options;
    const endsWith = `[${escapeString(options.endsWith || "")}]|$`;
    const delimiter6 = `[${escapeString(options.delimiter || "/#?")}]`;
    let route = start ? "^" : "";
    for (const token of tokens){
        if (typeof token === "string") {
            route += escapeString(encode4(token));
        } else {
            const prefix = escapeString(encode4(token.prefix));
            const suffix = escapeString(encode4(token.suffix));
            if (token.pattern) {
                if (keys) keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        const mod19 = token.modifier === "*" ? "?" : "";
                        route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod19}`;
                    } else {
                        route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                    }
                } else {
                    route += `(${token.pattern})${token.modifier}`;
                }
            } else {
                route += `(?:${prefix}${suffix})${token.modifier}`;
            }
        }
    }
    if (end) {
        if (!strict) route += `${delimiter6}?`;
        route += !options.endsWith ? "$" : `(?=${endsWith})`;
    } else {
        const endToken = tokens[tokens.length - 1];
        const isEndDelimited = typeof endToken === "string" ? delimiter6.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
        if (!strict) {
            route += `(?:${delimiter6}(?=${endsWith}))?`;
        }
        if (!isEndDelimited) {
            route += `(?=${delimiter6}|${endsWith})`;
        }
    }
    return new RegExp(route, flags(options));
}
function pathToRegexp(path66, keys, options) {
    if (path66 instanceof RegExp) return regexpToRegexp(path66, keys);
    if (Array.isArray(path66)) return arrayToRegexp(path66, keys, options);
    return stringToRegexp(path66, keys, options);
}
const errorStatusMap = {
    "BadRequest": 400,
    "Unauthorized": 401,
    "PaymentRequired": 402,
    "Forbidden": 403,
    "NotFound": 404,
    "MethodNotAllowed": 405,
    "NotAcceptable": 406,
    "ProxyAuthRequired": 407,
    "RequestTimeout": 408,
    "Conflict": 409,
    "Gone": 410,
    "LengthRequired": 411,
    "PreconditionFailed": 412,
    "RequestEntityTooLarge": 413,
    "RequestURITooLong": 414,
    "UnsupportedMediaType": 415,
    "RequestedRangeNotSatisfiable": 416,
    "ExpectationFailed": 417,
    "Teapot": 418,
    "MisdirectedRequest": 421,
    "UnprocessableEntity": 422,
    "Locked": 423,
    "FailedDependency": 424,
    "UpgradeRequired": 426,
    "PreconditionRequired": 428,
    "TooManyRequests": 429,
    "RequestHeaderFieldsTooLarge": 431,
    "UnavailableForLegalReasons": 451,
    "InternalServerError": 500,
    "NotImplemented": 501,
    "BadGateway": 502,
    "ServiceUnavailable": 503,
    "GatewayTimeout": 504,
    "HTTPVersionNotSupported": 505,
    "VariantAlsoNegotiates": 506,
    "InsufficientStorage": 507,
    "LoopDetected": 508,
    "NotExtended": 510,
    "NetworkAuthenticationRequired": 511
};
class HttpError extends Error {
    expose = false;
    status = Status.InternalServerError;
}
function createHttpErrorConstructor(status) {
    const name = `${Status[status]}Error`;
    const Ctor = class extends HttpError {
        constructor(message){
            super(message || STATUS_TEXT.get(status));
            this.status = status;
            this.expose = status >= 400 && status < 500;
            Object.defineProperty(this, "name", {
                configurable: true,
                enumerable: false,
                value: name,
                writable: true
            });
        }
    };
    return Ctor;
}
const httpErrors = {};
for (const [key, value] of Object.entries(errorStatusMap)){
    httpErrors[key] = createHttpErrorConstructor(value);
}
function createHttpError(status = 500, message) {
    return new httpErrors[Status[status]](message);
}
function isHttpError(value1) {
    return value1 instanceof HttpError;
}
const SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
const TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
const TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
class MediaType {
    constructor(type, subtype, suffix){
        this.type = type;
        this.subtype = subtype;
        this.suffix = suffix;
    }
    type;
    subtype;
    suffix;
}
function format7(obj) {
    const { subtype , suffix , type  } = obj;
    if (!TYPE_NAME_REGEXP.test(type)) {
        throw new TypeError("Invalid type.");
    }
    if (!SUBTYPE_NAME_REGEXP.test(subtype)) {
        throw new TypeError("Invalid subtype.");
    }
    let str12 = `${type}/${subtype}`;
    if (suffix) {
        if (!TYPE_NAME_REGEXP.test(suffix)) {
            throw new TypeError("Invalid suffix.");
        }
        str12 += `+${suffix}`;
    }
    return str12;
}
function parse8(str13) {
    const match = TYPE_REGEXP.exec(str13.toLowerCase());
    if (!match) {
        throw new TypeError("Invalid media type.");
    }
    let [, type, subtype] = match;
    let suffix;
    const idx = subtype.lastIndexOf("+");
    if (idx !== -1) {
        suffix = subtype.substr(idx + 1);
        subtype = subtype.substr(0, idx);
    }
    return new MediaType(type, subtype, suffix);
}
function mimeMatch(expected, actual) {
    if (expected === undefined) {
        return false;
    }
    const actualParts = actual.split("/");
    const expectedParts = expected.split("/");
    if (actualParts.length !== 2 || expectedParts.length !== 2) {
        return false;
    }
    const [actualType, actualSubtype] = actualParts;
    const [expectedType, expectedSubtype] = expectedParts;
    if (expectedType !== "*" && expectedType !== actualType) {
        return false;
    }
    if (expectedSubtype.substr(0, 2) === "*+") {
        return expectedSubtype.length <= actualSubtype.length + 1 && expectedSubtype.substr(1) === actualSubtype.substr(1 - expectedSubtype.length);
    }
    if (expectedSubtype !== "*" && expectedSubtype !== actualSubtype) {
        return false;
    }
    return true;
}
function normalize8(type) {
    if (type === "urlencoded") {
        return "application/x-www-form-urlencoded";
    } else if (type === "multipart") {
        return "multipart/*";
    } else if (type[0] === "+") {
        return `*/*${type}`;
    }
    return type.includes("/") ? type : lookup(type);
}
function normalizeType(value20) {
    try {
        const val = value20.split(";");
        const type = parse8(val[0]);
        return format7(type);
    } catch  {
        return;
    }
}
function isMediaType(value21, types2) {
    const val = normalizeType(value21);
    if (!val) {
        return false;
    }
    if (!types2.length) {
        return val;
    }
    for (const type of types2){
        if (mimeMatch(normalize8(type), val)) {
            return type[0] === "+" || type.includes("*") ? val : type;
        }
    }
    return false;
}
const ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;
const HTAB = "\t".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const CR2 = "\r".charCodeAt(0);
const LF2 = "\n".charCodeAt(0);
const UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;
const UNMATCHED_SURROGATE_PAIR_REPLACE = "$1\uFFFD$2";
const BODY_TYPES = [
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol"
];
function assert2(cond, msg18 = "Assertion failed") {
    if (!cond) {
        throw new Error(msg18);
    }
}
function decodeComponent(text) {
    try {
        return decodeURIComponent(text);
    } catch  {
        return text;
    }
}
function encodeUrl(url) {
    return String(url).replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE).replace(ENCODE_CHARS_REGEXP, encodeURI);
}
function bufferToHex(buffer) {
    const arr = Array.from(new Uint8Array(buffer));
    return arr.map((b9)=>b9.toString(16).padStart(2, "0")).join("");
}
async function getRandomFilename(prefix = "", extension2 = "") {
    const buffer = await crypto.subtle.digest("SHA-1", crypto.getRandomValues(new Uint8Array(256)));
    return `${prefix}${bufferToHex(buffer)}${extension2 ? `.${extension2}` : ""}`;
}
async function getBoundary() {
    const buffer = await crypto.subtle.digest("SHA-1", crypto.getRandomValues(new Uint8Array(256)));
    return `oak_${bufferToHex(buffer)}`;
}
function isAsyncIterable(value22) {
    return typeof value22 === "object" && value22 !== null && Symbol.asyncIterator in value22 && typeof value22[Symbol.asyncIterator] === "function";
}
function isRouterContext(value23) {
    return "params" in value23;
}
function isReader(value24) {
    return typeof value24 === "object" && value24 !== null && "read" in value24 && typeof value24.read === "function";
}
function isCloser(value25) {
    return typeof value25 === "object" && value25 != null && "close" in value25 && typeof value25["close"] === "function";
}
function isConn(value26) {
    return typeof value26 === "object" && value26 != null && "rid" in value26 && typeof value26.rid === "number" && "localAddr" in value26 && "remoteAddr" in value26;
}
function isListenTlsOptions(value27) {
    return typeof value27 === "object" && value27 !== null && ("cert" in value27 || "certFile" in value27) && ("key" in value27 || "keyFile" in value27) && "port" in value27;
}
function readableStreamFromAsyncIterable(source) {
    return new ReadableStream({
        async start (controller) {
            for await (const chunk of source){
                if (BODY_TYPES.includes(typeof chunk)) {
                    controller.enqueue(encoder.encode(String(chunk)));
                } else if (chunk instanceof Uint8Array) {
                    controller.enqueue(chunk);
                } else if (ArrayBuffer.isView(chunk)) {
                    controller.enqueue(new Uint8Array(chunk.buffer));
                } else if (chunk instanceof ArrayBuffer) {
                    controller.enqueue(new Uint8Array(chunk));
                } else {
                    try {
                        controller.enqueue(encoder.encode(JSON.stringify(chunk)));
                    } catch  {}
                }
            }
            controller.close();
        }
    });
}
function readableStreamFromReader(reader, options = {}) {
    const { autoClose =true , chunkSize =16_640 , strategy ,  } = options;
    return new ReadableStream({
        async pull (controller) {
            const chunk = new Uint8Array(chunkSize);
            try {
                const read1 = await reader.read(chunk);
                if (read1 === null) {
                    if (isCloser(reader) && autoClose) {
                        reader.close();
                    }
                    controller.close();
                    return;
                }
                controller.enqueue(chunk.subarray(0, read1));
            } catch (e16) {
                controller.error(e16);
                if (isCloser(reader)) {
                    reader.close();
                }
            }
        },
        cancel () {
            if (isCloser(reader) && autoClose) {
                reader.close();
            }
        }
    }, strategy);
}
function isErrorStatus(value28) {
    return [
        Status.BadRequest,
        Status.Unauthorized,
        Status.PaymentRequired,
        Status.Forbidden,
        Status.NotFound,
        Status.MethodNotAllowed,
        Status.NotAcceptable,
        Status.ProxyAuthRequired,
        Status.RequestTimeout,
        Status.Conflict,
        Status.Gone,
        Status.LengthRequired,
        Status.PreconditionFailed,
        Status.RequestEntityTooLarge,
        Status.RequestURITooLong,
        Status.UnsupportedMediaType,
        Status.RequestedRangeNotSatisfiable,
        Status.ExpectationFailed,
        Status.Teapot,
        Status.MisdirectedRequest,
        Status.UnprocessableEntity,
        Status.Locked,
        Status.FailedDependency,
        Status.UpgradeRequired,
        Status.PreconditionRequired,
        Status.TooManyRequests,
        Status.RequestHeaderFieldsTooLarge,
        Status.UnavailableForLegalReasons,
        Status.InternalServerError,
        Status.NotImplemented,
        Status.BadGateway,
        Status.ServiceUnavailable,
        Status.GatewayTimeout,
        Status.HTTPVersionNotSupported,
        Status.VariantAlsoNegotiates,
        Status.InsufficientStorage,
        Status.LoopDetected,
        Status.NotExtended,
        Status.NetworkAuthenticationRequired, 
    ].includes(value28);
}
function isRedirectStatus(value29) {
    return [
        Status.MultipleChoices,
        Status.MovedPermanently,
        Status.Found,
        Status.SeeOther,
        Status.UseProxy,
        Status.TemporaryRedirect,
        Status.PermanentRedirect, 
    ].includes(value29);
}
function isHtml(value30) {
    return /^\s*<(?:!DOCTYPE|html|body)/i.test(value30);
}
function skipLWSPChar(u8) {
    const result = new Uint8Array(u8.length);
    let j14 = 0;
    for(let i52 = 0; i52 < u8.length; i52++){
        if (u8[i52] === SPACE || u8[i52] === HTAB) continue;
        result[j14++] = u8[i52];
    }
    return result.slice(0, j14);
}
function stripEol(value31) {
    if (value31[value31.byteLength - 1] == LF2) {
        let drop = 1;
        if (value31.byteLength > 1 && value31[value31.byteLength - 2] === CR2) {
            drop = 2;
        }
        return value31.subarray(0, value31.byteLength - drop);
    }
    return value31;
}
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
function resolvePath(rootPath, relativePath) {
    let path67 = relativePath;
    let root = rootPath;
    if (relativePath === undefined) {
        path67 = rootPath;
        root = ".";
    }
    if (path67 == null) {
        throw new TypeError("Argument relativePath is required.");
    }
    if (path67.includes("\0")) {
        throw createHttpError(400, "Malicious Path");
    }
    if (isAbsolute5(path67)) {
        throw createHttpError(400, "Malicious Path");
    }
    if (UP_PATH_REGEXP.test(normalize7("." + sep5 + path67))) {
        throw createHttpError(403);
    }
    return normalize7(join7(root, path67));
}
class Uint8ArrayTransformStream extends TransformStream {
    constructor(){
        const init = {
            async transform (chunk, controller) {
                chunk = await chunk;
                switch(typeof chunk){
                    case "object":
                        if (chunk === null) {
                            controller.terminate();
                        } else if (ArrayBuffer.isView(chunk)) {
                            controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
                        } else if (Array.isArray(chunk) && chunk.every((value32)=>typeof value32 === "number")) {
                            controller.enqueue(new Uint8Array(chunk));
                        } else if (typeof chunk.valueOf === "function" && chunk.valueOf() !== chunk) {
                            this.transform(chunk.valueOf(), controller);
                        } else if ("toJSON" in chunk) {
                            this.transform(JSON.stringify(chunk), controller);
                        }
                        break;
                    case "symbol":
                        controller.error(new TypeError("Cannot transform a symbol to a Uint8Array"));
                        break;
                    case "undefined":
                        controller.error(new TypeError("Cannot transform undefined to a Uint8Array"));
                        break;
                    default:
                        controller.enqueue(this.encoder.encode(String(chunk)));
                }
            },
            encoder: new TextEncoder()
        };
        super(init);
    }
}
const replacements = {
    "/": "_",
    "+": "-",
    "=": ""
};
const encoder = new TextEncoder();
function encodeBase64Safe(data19) {
    return mod7.encode(data19).replace(/\/|\+|=/g, (c11)=>replacements[c11]);
}
function importKey(key26) {
    if (typeof key26 === "string") {
        key26 = encoder.encode(key26);
    } else if (Array.isArray(key26)) {
        key26 = new Uint8Array(key26);
    }
    return crypto.subtle.importKey("raw", key26, {
        name: "HMAC",
        hash: {
            name: "SHA-256"
        }
    }, true, [
        "sign",
        "verify"
    ]);
}
function sign(data20, key27) {
    if (typeof data20 === "string") {
        data20 = encoder.encode(data20);
    } else if (Array.isArray(data20)) {
        data20 = Uint8Array.from(data20);
    }
    return crypto.subtle.sign("HMAC", key27, data20);
}
const MIN_BUF_SIZE2 = 16;
const CR3 = "\r".charCodeAt(0);
const LF3 = "\n".charCodeAt(0);
class BufferFullError2 extends Error {
    name;
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
        this.name = "BufferFullError";
    }
    partial;
}
class BufReader2 {
    #buffer;
    #reader;
    #posRead = 0;
    #posWrite = 0;
    #eof = false;
    async #fill() {
        if (this.#posRead > 0) {
            this.#buffer.copyWithin(0, this.#posRead, this.#posWrite);
            this.#posWrite -= this.#posRead;
            this.#posRead = 0;
        }
        if (this.#posWrite >= this.#buffer.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i = 100; i > 0; i--){
            const rr = await this.#reader.read(this.#buffer.subarray(this.#posWrite));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert2(rr >= 0, "negative read");
            this.#posWrite += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    }
     #reset(buffer, reader) {
        this.#buffer = buffer;
        this.#reader = reader;
        this.#eof = false;
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE2;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    buffered() {
        return this.#posWrite - this.#posRead;
    }
    async readLine(strip = true) {
        let line;
        try {
            line = await this.readSlice(LF3);
        } catch (err) {
            assert2(err instanceof Error);
            let { partial  } = err;
            assert2(partial instanceof Uint8Array, "Caught error from `readSlice()` without `partial` property");
            if (!(err instanceof BufferFullError2)) {
                throw err;
            }
            if (!this.#eof && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR3) {
                assert2(this.#posRead > 0, "Tried to rewind past start of buffer");
                this.#posRead--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            return {
                bytes: partial,
                eol: this.#eof
            };
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                bytes: line,
                eol: true
            };
        }
        if (strip) {
            line = stripEol(line);
        }
        return {
            bytes: line,
            eol: true
        };
    }
    async readSlice(delim) {
        let s7 = 0;
        let slice;
        while(true){
            let i53 = this.#buffer.subarray(this.#posRead + s7, this.#posWrite).indexOf(delim);
            if (i53 >= 0) {
                i53 += s7;
                slice = this.#buffer.subarray(this.#posRead, this.#posRead + i53 + 1);
                this.#posRead += i53 + 1;
                break;
            }
            if (this.#eof) {
                if (this.#posRead === this.#posWrite) {
                    return null;
                }
                slice = this.#buffer.subarray(this.#posRead, this.#posWrite);
                this.#posRead = this.#posWrite;
                break;
            }
            if (this.buffered() >= this.#buffer.byteLength) {
                this.#posRead = this.#posWrite;
                const oldbuf = this.#buffer;
                const newbuf = this.#buffer.slice(0);
                this.#buffer = newbuf;
                throw new BufferFullError2(oldbuf);
            }
            s7 = this.#posWrite - this.#posRead;
            try {
                await this.#fill();
            } catch (err) {
                const e17 = err instanceof Error ? err : new Error("[non-object thrown]");
                e17.partial = slice;
                throw err;
            }
        }
        return slice;
    }
}
const COLON = ":".charCodeAt(0);
const HTAB1 = "\t".charCodeAt(0);
const SPACE1 = " ".charCodeAt(0);
const decoder = new TextDecoder();
function toParamRegExp(attributePattern, flags2) {
    return new RegExp(`(?:^|;)\\s*${attributePattern}\\s*=\\s*` + `(` + `[^";\\s][^;\\s]*` + `|` + `"(?:[^"\\\\]|\\\\"?)+"?` + `)`, flags2);
}
async function readHeaders(body) {
    const headers = {};
    let readResult = await body.readLine();
    while(readResult){
        const { bytes  } = readResult;
        if (!bytes.length) {
            return headers;
        }
        let i54 = bytes.indexOf(COLON);
        if (i54 === -1) {
            throw new httpErrors.BadRequest(`Malformed header: ${decoder.decode(bytes)}`);
        }
        const key28 = decoder.decode(bytes.subarray(0, i54)).trim().toLowerCase();
        if (key28 === "") {
            throw new httpErrors.BadRequest("Invalid header key.");
        }
        i54++;
        while(i54 < bytes.byteLength && (bytes[i54] === SPACE1 || bytes[i54] === HTAB1)){
            i54++;
        }
        const value33 = decoder.decode(bytes.subarray(i54)).trim();
        headers[key28] = value33;
        readResult = await body.readLine();
    }
    throw new httpErrors.BadRequest("Unexpected end of body reached.");
}
function unquote(value34) {
    if (value34.startsWith(`"`)) {
        const parts2 = value34.slice(1).split(`\\"`);
        for(let i55 = 0; i55 < parts2.length; ++i55){
            const quoteIndex = parts2[i55].indexOf(`"`);
            if (quoteIndex !== -1) {
                parts2[i55] = parts2[i55].slice(0, quoteIndex);
                parts2.length = i55 + 1;
            }
            parts2[i55] = parts2[i55].replace(/\\(.)/g, "$1");
        }
        value34 = parts2.join(`"`);
    }
    return value34;
}
let needsEncodingFixup = false;
function fixupEncoding(value35) {
    if (needsEncodingFixup && /[\x80-\xff]/.test(value35)) {
        value35 = textDecode("utf-8", value35);
        if (needsEncodingFixup) {
            value35 = textDecode("iso-8859-1", value35);
        }
    }
    return value35;
}
const FILENAME_STAR_REGEX = toParamRegExp("filename\\*", "i");
const FILENAME_START_ITER_REGEX = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
const FILENAME_REGEX = toParamRegExp("filename", "i");
function rfc2047decode(value36) {
    if (!value36.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value36)) {
        return value36;
    }
    return value36.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, (_, charset1, encoding, text)=>{
        if (encoding === "q" || encoding === "Q") {
            text = text.replace(/_/g, " ");
            text = text.replace(/=([0-9a-fA-F]{2})/g, (_, hex)=>String.fromCharCode(parseInt(hex, 16)));
            return textDecode(charset1, text);
        }
        try {
            text = atob(text);
        } catch  {}
        return textDecode(charset1, text);
    });
}
function rfc2231getParam(header) {
    const matches = [];
    let match;
    while(match = FILENAME_START_ITER_REGEX.exec(header)){
        const [, ns, quote, part] = match;
        const n10 = parseInt(ns, 10);
        if (n10 in matches) {
            if (n10 === 0) {
                break;
            }
            continue;
        }
        matches[n10] = [
            quote,
            part
        ];
    }
    const parts3 = [];
    for(let n11 = 0; n11 < matches.length; ++n11){
        if (!(n11 in matches)) {
            break;
        }
        let [quote, part] = matches[n11];
        part = unquote(part);
        if (quote) {
            part = unescape(part);
            if (n11 === 0) {
                part = rfc5987decode(part);
            }
        }
        parts3.push(part);
    }
    return parts3.join("");
}
function rfc5987decode(value37) {
    const encodingEnd = value37.indexOf(`'`);
    if (encodingEnd === -1) {
        return value37;
    }
    const encoding = value37.slice(0, encodingEnd);
    const langValue = value37.slice(encodingEnd + 1);
    return textDecode(encoding, langValue.replace(/^[^']*'/, ""));
}
function textDecode(encoding, value38) {
    if (encoding) {
        try {
            const decoder5 = new TextDecoder(encoding, {
                fatal: true
            });
            const bytes = Array.from(value38, (c12)=>c12.charCodeAt(0));
            if (bytes.every((code34)=>code34 <= 0xFF)) {
                value38 = decoder5.decode(new Uint8Array(bytes));
                needsEncodingFixup = false;
            }
        } catch  {}
    }
    return value38;
}
function getFilename(header) {
    needsEncodingFixup = true;
    let matches = FILENAME_STAR_REGEX.exec(header);
    if (matches) {
        const [, filename] = matches;
        return fixupEncoding(rfc2047decode(rfc5987decode(unescape(unquote(filename)))));
    }
    const filename = rfc2231getParam(header);
    if (filename) {
        return fixupEncoding(rfc2047decode(filename));
    }
    matches = FILENAME_REGEX.exec(header);
    if (matches) {
        const [, filename] = matches;
        return fixupEncoding(rfc2047decode(unquote(filename)));
    }
    return "";
}
const decoder1 = new TextDecoder();
const encoder1 = new TextEncoder();
const BOUNDARY_PARAM_REGEX = toParamRegExp("boundary", "i");
const NAME_PARAM_REGEX = toParamRegExp("name", "i");
function append(a8, b10) {
    const ab = new Uint8Array(a8.length + b10.length);
    ab.set(a8, 0);
    ab.set(b10, a8.length);
    return ab;
}
function isEqual(a9, b11) {
    return equals(skipLWSPChar(a9), b11);
}
async function readToStartOrEnd(body, start, end) {
    let lineResult;
    while(lineResult = await body.readLine()){
        if (isEqual(lineResult.bytes, start)) {
            return true;
        }
        if (isEqual(lineResult.bytes, end)) {
            return false;
        }
    }
    throw new httpErrors.BadRequest("Unable to find multi-part boundary.");
}
async function* parts({ body , customContentTypes ={} , final: __final , part , maxFileSize , maxSize , outPath , prefix  }) {
    async function getFile(contentType1) {
        const ext = customContentTypes[contentType1.toLowerCase()] ?? extension(contentType1);
        if (!ext) {
            throw new httpErrors.BadRequest(`The form contained content type "${contentType1}" which is not supported by the server.`);
        }
        if (!outPath) {
            outPath = await Deno.makeTempDir();
        }
        const filename = `${outPath}/${await getRandomFilename(prefix, ext)}`;
        const file = await Deno.open(filename, {
            write: true,
            createNew: true
        });
        return [
            filename,
            file
        ];
    }
    while(true){
        const headers = await readHeaders(body);
        const contentType2 = headers["content-type"];
        const contentDisposition = headers["content-disposition"];
        if (!contentDisposition) {
            throw new httpErrors.BadRequest("Form data part missing content-disposition header");
        }
        if (!contentDisposition.match(/^form-data;/i)) {
            throw new httpErrors.BadRequest(`Unexpected content-disposition header: "${contentDisposition}"`);
        }
        const matches = NAME_PARAM_REGEX.exec(contentDisposition);
        if (!matches) {
            throw new httpErrors.BadRequest(`Unable to determine name of form body part`);
        }
        let [, name] = matches;
        name = unquote(name);
        if (contentType2) {
            const originalName = getFilename(contentDisposition);
            let byteLength = 0;
            let file;
            let filename;
            let buf;
            if (maxSize) {
                buf = new Uint8Array();
            } else {
                const result = await getFile(contentType2);
                filename = result[0];
                file = result[1];
            }
            while(true){
                const readResult = await body.readLine(false);
                if (!readResult) {
                    throw new httpErrors.BadRequest("Unexpected EOF reached");
                }
                const { bytes  } = readResult;
                const strippedBytes = stripEol(bytes);
                if (isEqual(strippedBytes, part) || isEqual(strippedBytes, __final)) {
                    if (file) {
                        const bytesDiff = bytes.length - strippedBytes.length;
                        if (bytesDiff) {
                            const originalBytesSize = await file.seek(-bytesDiff, Deno.SeekMode.Current);
                            await file.truncate(originalBytesSize);
                        }
                        file.close();
                    }
                    yield [
                        name,
                        {
                            content: buf,
                            contentType: contentType2,
                            name,
                            filename,
                            originalName
                        }, 
                    ];
                    if (isEqual(strippedBytes, __final)) {
                        return;
                    }
                    break;
                }
                byteLength += bytes.byteLength;
                if (byteLength > maxFileSize) {
                    if (file) {
                        file.close();
                    }
                    throw new httpErrors.RequestEntityTooLarge(`File size exceeds limit of ${maxFileSize} bytes.`);
                }
                if (buf) {
                    if (byteLength > maxSize) {
                        const result = await getFile(contentType2);
                        filename = result[0];
                        file = result[1];
                        await writeAll(file, buf);
                        buf = undefined;
                    } else {
                        buf = append(buf, bytes);
                    }
                }
                if (file) {
                    await writeAll(file, bytes);
                }
            }
        } else {
            const lines = [];
            while(true){
                const readResult = await body.readLine();
                if (!readResult) {
                    throw new httpErrors.BadRequest("Unexpected EOF reached");
                }
                const { bytes  } = readResult;
                if (isEqual(bytes, part) || isEqual(bytes, __final)) {
                    yield [
                        name,
                        lines.join("\n")
                    ];
                    if (isEqual(bytes, __final)) {
                        return;
                    }
                    break;
                }
                lines.push(decoder1.decode(bytes));
            }
        }
    }
}
class FormDataReader {
    #body;
    #boundaryFinal;
    #boundaryPart;
    #reading = false;
    constructor(contentType3, body){
        const matches = contentType3.match(BOUNDARY_PARAM_REGEX);
        if (!matches) {
            throw new httpErrors.BadRequest(`Content type "${contentType3}" does not contain a valid boundary.`);
        }
        let [, boundary1] = matches;
        boundary1 = unquote(boundary1);
        this.#boundaryPart = encoder1.encode(`--${boundary1}`);
        this.#boundaryFinal = encoder1.encode(`--${boundary1}--`);
        this.#body = body;
    }
    async read(options = {}) {
        if (this.#reading) {
            throw new Error("Body is already being read.");
        }
        this.#reading = true;
        const { outPath , maxFileSize =10_485_760 , maxSize =0 , bufferSize =1_048_576 , customContentTypes ,  } = options;
        const body = new BufReader2(this.#body, bufferSize);
        const result = {
            fields: {}
        };
        if (!await readToStartOrEnd(body, this.#boundaryPart, this.#boundaryFinal)) {
            return result;
        }
        try {
            for await (const part of parts({
                body,
                customContentTypes,
                part: this.#boundaryPart,
                final: this.#boundaryFinal,
                maxFileSize,
                maxSize,
                outPath
            })){
                const [key29, value39] = part;
                if (typeof value39 === "string") {
                    result.fields[key29] = value39;
                } else {
                    if (!result.files) {
                        result.files = [];
                    }
                    result.files.push(value39);
                }
            }
        } catch (err) {
            if (err instanceof Deno.errors.PermissionDenied) {
                console.error(err.stack ? err.stack : `${err.name}: ${err.message}`);
            } else {
                throw err;
            }
        }
        return result;
    }
    async *stream(options = {}) {
        if (this.#reading) {
            throw new Error("Body is already being read.");
        }
        this.#reading = true;
        const { outPath , customContentTypes , maxFileSize =10_485_760 , maxSize =0 , bufferSize =32000 ,  } = options;
        const body = new BufReader2(this.#body, bufferSize);
        if (!await readToStartOrEnd(body, this.#boundaryPart, this.#boundaryFinal)) {
            return;
        }
        try {
            for await (const part of parts({
                body,
                customContentTypes,
                part: this.#boundaryPart,
                final: this.#boundaryFinal,
                maxFileSize,
                maxSize,
                outPath
            })){
                yield part;
            }
        } catch (err) {
            if (err instanceof Deno.errors.PermissionDenied) {
                console.error(err.stack ? err.stack : `${err.name}: ${err.message}`);
            } else {
                throw err;
            }
        }
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        return `${this.constructor.name} ${inspect({})}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        return `${options.stylize(this.constructor.name, "special")} ${inspect({}, newOptions)}`;
    }
}
const defaultBodyContentTypes = {
    json: [
        "json",
        "application/*+json",
        "application/csp-report"
    ],
    form: [
        "urlencoded"
    ],
    formData: [
        "multipart"
    ],
    text: [
        "text"
    ]
};
function resolveType(contentType4, contentTypes) {
    const contentTypesJson = [
        ...defaultBodyContentTypes.json,
        ...contentTypes.json ?? [], 
    ];
    const contentTypesForm = [
        ...defaultBodyContentTypes.form,
        ...contentTypes.form ?? [], 
    ];
    const contentTypesFormData = [
        ...defaultBodyContentTypes.formData,
        ...contentTypes.formData ?? [], 
    ];
    const contentTypesText = [
        ...defaultBodyContentTypes.text,
        ...contentTypes.text ?? [], 
    ];
    if (contentTypes.bytes && isMediaType(contentType4, contentTypes.bytes)) {
        return "bytes";
    } else if (isMediaType(contentType4, contentTypesJson)) {
        return "json";
    } else if (isMediaType(contentType4, contentTypesForm)) {
        return "form";
    } else if (isMediaType(contentType4, contentTypesFormData)) {
        return "form-data";
    } else if (isMediaType(contentType4, contentTypesText)) {
        return "text";
    }
    return "bytes";
}
const decoder2 = new TextDecoder();
class RequestBody {
    #body;
    #formDataReader;
    #headers;
    #stream;
    #readAllBody;
    #readBody;
    #type;
     #exceedsLimit(limit) {
        if (!limit || limit === Infinity) {
            return false;
        }
        if (!this.#body) {
            return false;
        }
        const contentLength = this.#headers.get("content-length");
        if (!contentLength) {
            return true;
        }
        const parsed = parseInt(contentLength, 10);
        if (isNaN(parsed)) {
            return true;
        }
        return parsed > limit;
    }
     #parse(type, limit1) {
        switch(type){
            case "form":
                this.#type = "bytes";
                if (this.#exceedsLimit(limit1)) {
                    return ()=>Promise.reject(new RangeError(`Body exceeds a limit of ${limit1}.`));
                }
                return async ()=>new URLSearchParams(decoder2.decode(await this.#valuePromise()).replace(/\+/g, " "));
            case "form-data":
                this.#type = "form-data";
                return ()=>{
                    const contentType5 = this.#headers.get("content-type");
                    assert2(contentType5);
                    const readableStream = this.#body ?? new ReadableStream();
                    return this.#formDataReader ?? (this.#formDataReader = new FormDataReader(contentType5, readerFromStreamReader(readableStream.getReader())));
                };
            case "json":
                this.#type = "bytes";
                if (this.#exceedsLimit(limit1)) {
                    return ()=>Promise.reject(new RangeError(`Body exceeds a limit of ${limit1}.`));
                }
                return async ()=>JSON.parse(decoder2.decode(await this.#valuePromise()));
            case "bytes":
                this.#type = "bytes";
                if (this.#exceedsLimit(limit1)) {
                    return ()=>Promise.reject(new RangeError(`Body exceeds a limit of ${limit1}.`));
                }
                return ()=>this.#valuePromise();
            case "text":
                this.#type = "bytes";
                if (this.#exceedsLimit(limit1)) {
                    return ()=>Promise.reject(new RangeError(`Body exceeds a limit of ${limit1}.`));
                }
                return async ()=>decoder2.decode(await this.#valuePromise());
            default:
                throw new TypeError(`Invalid body type: "${type}"`);
        }
    }
     #validateGetArgs(type1, contentTypes) {
        if (type1 === "reader" && this.#type && this.#type !== "reader") {
            throw new TypeError(`Body already consumed as "${this.#type}" and cannot be returned as a reader.`);
        }
        if (type1 === "stream" && this.#type && this.#type !== "stream") {
            throw new TypeError(`Body already consumed as "${this.#type}" and cannot be returned as a stream.`);
        }
        if (type1 === "form-data" && this.#type && this.#type !== "form-data") {
            throw new TypeError(`Body already consumed as "${this.#type}" and cannot be returned as a stream.`);
        }
        if (this.#type === "reader" && type1 !== "reader") {
            throw new TypeError("Body already consumed as a reader and can only be returned as a reader.");
        }
        if (this.#type === "stream" && type1 !== "stream") {
            throw new TypeError("Body already consumed as a stream and can only be returned as a stream.");
        }
        if (this.#type === "form-data" && type1 !== "form-data") {
            throw new TypeError("Body already consumed as form data and can only be returned as form data.");
        }
        if (type1 && Object.keys(contentTypes).length) {
            throw new TypeError(`"type" and "contentTypes" cannot be specified at the same time`);
        }
    }
     #valuePromise() {
        return this.#readAllBody ?? (this.#readAllBody = this.#readBody());
    }
    constructor({ body , readBody  }, headers){
        this.#body = body;
        this.#headers = headers;
        this.#readBody = readBody;
    }
    get({ limit: limit2 = 10_485_760 , type: type2 , contentTypes: contentTypes1 = {}  } = {}) {
        this.#validateGetArgs(type2, contentTypes1);
        if (type2 === "reader") {
            if (!this.#body) {
                this.#type = "undefined";
                throw new TypeError(`Body is undefined and cannot be returned as "reader".`);
            }
            this.#type = "reader";
            return {
                type: type2,
                value: readerFromStreamReader(this.#body.getReader())
            };
        }
        if (type2 === "stream") {
            if (!this.#body) {
                this.#type = "undefined";
                throw new TypeError(`Body is undefined and cannot be returned as "stream".`);
            }
            this.#type = "stream";
            const streams = (this.#stream ?? this.#body).tee();
            this.#stream = streams[1];
            return {
                type: type2,
                value: streams[0]
            };
        }
        if (!this.has()) {
            this.#type = "undefined";
        } else if (!this.#type) {
            const encoding = this.#headers.get("content-encoding") ?? "identity";
            if (encoding !== "identity") {
                throw new httpErrors.UnsupportedMediaType(`Unsupported content-encoding: ${encoding}`);
            }
        }
        if (this.#type === "undefined" && (!type2 || type2 === "undefined")) {
            return {
                type: "undefined",
                value: undefined
            };
        }
        if (!type2) {
            const contentType6 = this.#headers.get("content-type");
            assert2(contentType6, "The Content-Type header is missing from the request");
            type2 = resolveType(contentType6, contentTypes1);
        }
        assert2(type2);
        const body = Object.create(null);
        Object.defineProperties(body, {
            type: {
                value: type2,
                configurable: true,
                enumerable: true
            },
            value: {
                get: this.#parse(type2, limit2),
                configurable: true,
                enumerable: true
            }
        });
        return body;
    }
    has() {
        return this.#body != null;
    }
}
function compareSpecs(a10, b12) {
    return b12.q - a10.q || (b12.s ?? 0) - (a10.s ?? 0) || (a10.o ?? 0) - (b12.o ?? 0) || a10.i - b12.i || 0;
}
function isQuality(spec) {
    return spec.q > 0;
}
const SIMPLE_CHARSET_REGEXP = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseCharset(str14, i56) {
    const match = SIMPLE_CHARSET_REGEXP.exec(str14);
    if (!match) {
        return;
    }
    const [, charset2] = match;
    let q1 = 1;
    if (match[2]) {
        const params = match[2].split(";");
        for (const param of params){
            const [key30, value40] = param.trim().split("=");
            if (key30 === "q") {
                q1 = parseFloat(value40);
                break;
            }
        }
    }
    return {
        charset: charset2,
        q: q1,
        i: i56
    };
}
function parseAcceptCharset(accept) {
    const accepts = accept.split(",");
    const result = [];
    for(let i57 = 0; i57 < accepts.length; i57++){
        const charset3 = parseCharset(accepts[i57].trim(), i57);
        if (charset3) {
            result.push(charset3);
        }
    }
    return result;
}
function specify(charset4, spec, i58) {
    let s8 = 0;
    if (spec.charset.toLowerCase() === charset4.toLocaleLowerCase()) {
        s8 |= 1;
    } else if (spec.charset !== "*") {
        return;
    }
    return {
        i: i58,
        o: spec.i,
        q: spec.q,
        s: s8
    };
}
function getCharsetPriority(charset5, accepted, index) {
    let priority = {
        i: -1,
        o: -1,
        q: 0,
        s: 0
    };
    for (const accepts of accepted){
        const spec = specify(charset5, accepts, index);
        if (spec && ((priority.s ?? 0) - (spec.s ?? 0) || priority.q - spec.q || (priority.o ?? 0) - (spec.o ?? 0)) < 0) {
            priority = spec;
        }
    }
    return priority;
}
function preferredCharsets(accept = "*", provided) {
    const accepts = parseAcceptCharset(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.charset);
    }
    const priorities = provided.map((type3, index)=>getCharsetPriority(type3, accepts, index));
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]);
}
const simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseEncoding(str15, i59) {
    const match = simpleEncodingRegExp.exec(str15);
    if (!match) {
        return undefined;
    }
    const encoding = match[1];
    let q2 = 1;
    if (match[2]) {
        const params = match[2].split(";");
        for (const param of params){
            const p17 = param.trim().split("=");
            if (p17[0] === "q") {
                q2 = parseFloat(p17[1]);
                break;
            }
        }
    }
    return {
        encoding,
        q: q2,
        i: i59
    };
}
function specify1(encoding, spec, i60 = -1) {
    if (!spec.encoding) {
        return;
    }
    let s9 = 0;
    if (spec.encoding.toLocaleLowerCase() === encoding.toLocaleLowerCase()) {
        s9 = 1;
    } else if (spec.encoding !== "*") {
        return;
    }
    return {
        i: i60,
        o: spec.i,
        q: spec.q,
        s: s9
    };
}
function parseAcceptEncoding(accept) {
    const accepts = accept.split(",");
    const parsedAccepts = [];
    let hasIdentity = false;
    let minQuality = 1;
    for(let i61 = 0; i61 < accepts.length; i61++){
        const encoding = parseEncoding(accepts[i61].trim(), i61);
        if (encoding) {
            parsedAccepts.push(encoding);
            hasIdentity = hasIdentity || !!specify1("identity", encoding);
            minQuality = Math.min(minQuality, encoding.q || 1);
        }
    }
    if (!hasIdentity) {
        parsedAccepts.push({
            encoding: "identity",
            q: minQuality,
            i: accepts.length - 1
        });
    }
    return parsedAccepts;
}
function getEncodingPriority(encoding, accepted, index) {
    let priority = {
        o: -1,
        q: 0,
        s: 0,
        i: 0
    };
    for (const s10 of accepted){
        const spec = specify1(encoding, s10, index);
        if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
            priority = spec;
        }
    }
    return priority;
}
function preferredEncodings(accept, provided) {
    const accepts = parseAcceptEncoding(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.encoding);
    }
    const priorities = provided.map((type4, index)=>getEncodingPriority(type4, accepts, index));
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]);
}
const SIMPLE_LANGUAGE_REGEXP = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
function parseLanguage(str16, i62) {
    const match = SIMPLE_LANGUAGE_REGEXP.exec(str16);
    if (!match) {
        return undefined;
    }
    const [, prefix, suffix] = match;
    const full = suffix ? `${prefix}-${suffix}` : prefix;
    let q3 = 1;
    if (match[3]) {
        const params = match[3].split(";");
        for (const param of params){
            const [key31, value41] = param.trim().split("=");
            if (key31 === "q") {
                q3 = parseFloat(value41);
                break;
            }
        }
    }
    return {
        prefix,
        suffix,
        full,
        q: q3,
        i: i62
    };
}
function parseAcceptLanguage(accept) {
    const accepts = accept.split(",");
    const result = [];
    for(let i63 = 0; i63 < accepts.length; i63++){
        const language = parseLanguage(accepts[i63].trim(), i63);
        if (language) {
            result.push(language);
        }
    }
    return result;
}
function specify2(language, spec, i64) {
    const p18 = parseLanguage(language, i64);
    if (!p18) {
        return undefined;
    }
    let s11 = 0;
    if (spec.full.toLowerCase() === p18.full.toLowerCase()) {
        s11 |= 4;
    } else if (spec.prefix.toLowerCase() === p18.prefix.toLowerCase()) {
        s11 |= 2;
    } else if (spec.full.toLowerCase() === p18.prefix.toLowerCase()) {
        s11 |= 1;
    } else if (spec.full !== "*") {
        return;
    }
    return {
        i: i64,
        o: spec.i,
        q: spec.q,
        s: s11
    };
}
function getLanguagePriority(language, accepted, index) {
    let priority = {
        i: -1,
        o: -1,
        q: 0,
        s: 0
    };
    for (const accepts of accepted){
        const spec = specify2(language, accepts, index);
        if (spec && ((priority.s ?? 0) - (spec.s ?? 0) || priority.q - spec.q || (priority.o ?? 0) - (spec.o ?? 0)) < 0) {
            priority = spec;
        }
    }
    return priority;
}
function preferredLanguages(accept = "*", provided) {
    const accepts = parseAcceptLanguage(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.full);
    }
    const priorities = provided.map((type5, index)=>getLanguagePriority(type5, accepts, index));
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]);
}
const simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
function quoteCount(str17) {
    let count = 0;
    let index = 0;
    while((index = str17.indexOf(`"`, index)) !== -1){
        count++;
        index++;
    }
    return count;
}
function splitMediaTypes(accept) {
    const accepts = accept.split(",");
    let j15 = 0;
    for(let i65 = 1; i65 < accepts.length; i65++){
        if (quoteCount(accepts[j15]) % 2 === 0) {
            accepts[++j15] = accepts[i65];
        } else {
            accepts[j15] += `,${accepts[i65]}`;
        }
    }
    accepts.length = j15 + 1;
    return accepts;
}
function splitParameters(str18) {
    const parameters = str18.split(";");
    let j16 = 0;
    for(let i66 = 1; i66 < parameters.length; i66++){
        if (quoteCount(parameters[j16]) % 2 === 0) {
            parameters[++j16] = parameters[i66];
        } else {
            parameters[j16] += `;${parameters[i66]}`;
        }
    }
    parameters.length = j16 + 1;
    return parameters.map((p19)=>p19.trim());
}
function splitKeyValuePair(str19) {
    const [key32, value42] = str19.split("=");
    return [
        key32.toLowerCase(),
        value42
    ];
}
function parseMediaType(str20, i67) {
    const match = simpleMediaTypeRegExp.exec(str20);
    if (!match) {
        return;
    }
    const params = Object.create(null);
    let q4 = 1;
    const [, type6, subtype, parameters] = match;
    if (parameters) {
        const kvps = splitParameters(parameters).map(splitKeyValuePair);
        for (const [key33, val] of kvps){
            const value43 = val && val[0] === `"` && val[val.length - 1] === `"` ? val.substr(1, val.length - 2) : val;
            if (key33 === "q" && value43) {
                q4 = parseFloat(value43);
                break;
            }
            params[key33] = value43;
        }
    }
    return {
        type: type6,
        subtype,
        params,
        q: q4,
        i: i67
    };
}
function parseAccept(accept) {
    const accepts = splitMediaTypes(accept);
    const mediaTypes = [];
    for(let i68 = 0; i68 < accepts.length; i68++){
        const mediaType = parseMediaType(accepts[i68].trim(), i68);
        if (mediaType) {
            mediaTypes.push(mediaType);
        }
    }
    return mediaTypes;
}
function getFullType(spec) {
    return `${spec.type}/${spec.subtype}`;
}
function specify3(type7, spec, index) {
    const p20 = parseMediaType(type7, index);
    if (!p20) {
        return;
    }
    let s12 = 0;
    if (spec.type.toLowerCase() === p20.type.toLowerCase()) {
        s12 |= 4;
    } else if (spec.type !== "*") {
        return;
    }
    if (spec.subtype.toLowerCase() === p20.subtype.toLowerCase()) {
        s12 |= 2;
    } else if (spec.subtype !== "*") {
        return;
    }
    const keys = Object.keys(spec.params);
    if (keys.length) {
        if (keys.every((key34)=>(spec.params[key34] || "").toLowerCase() === (p20.params[key34] || "").toLowerCase())) {
            s12 |= 1;
        } else {
            return;
        }
    }
    return {
        i: index,
        o: spec.o,
        q: spec.q,
        s: s12
    };
}
function getMediaTypePriority(type8, accepted, index) {
    let priority = {
        o: -1,
        q: 0,
        s: 0,
        i: index
    };
    for (const accepts of accepted){
        const spec = specify3(type8, accepts, index);
        if (spec && ((priority.s || 0) - (spec.s || 0) || (priority.q || 0) - (spec.q || 0) || (priority.o || 0) - (spec.o || 0)) < 0) {
            priority = spec;
        }
    }
    return priority;
}
function preferredMediaTypes(accept, provided) {
    const accepts = parseAccept(accept === undefined ? "*/*" : accept || "");
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map(getFullType);
    }
    const priorities = provided.map((type9, index)=>{
        return getMediaTypePriority(type9, accepts, index);
    });
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]);
}
class Request1 {
    #body;
    #proxy;
    #secure;
    #serverRequest;
    #url;
     #getRemoteAddr() {
        return this.#serverRequest.remoteAddr ?? "";
    }
    get hasBody() {
        return this.#body.has();
    }
    get headers() {
        return this.#serverRequest.headers;
    }
    get ip() {
        return (this.#proxy ? this.ips[0] : this.#getRemoteAddr()) ?? "";
    }
    get ips() {
        return this.#proxy ? (this.#serverRequest.headers.get("x-forwarded-for") ?? this.#getRemoteAddr()).split(/\s*,\s*/) : [];
    }
    get method() {
        return this.#serverRequest.method;
    }
    get secure() {
        return this.#secure;
    }
    get originalRequest() {
        return this.#serverRequest;
    }
    get url() {
        if (!this.#url) {
            const serverRequest = this.#serverRequest;
            if (!this.#proxy) {
                try {
                    if (serverRequest.rawUrl) {
                        this.#url = new URL(serverRequest.rawUrl);
                        return this.#url;
                    }
                } catch  {}
            }
            let proto;
            let host;
            if (this.#proxy) {
                proto = serverRequest.headers.get("x-forwarded-proto")?.split(/\s*,\s*/, 1)[0] ?? "http";
                host = (serverRequest.headers.get("x-forwarded-host") ?? serverRequest.headers.get("host")) ?? "";
            } else {
                proto = this.#secure ? "https" : "http";
                host = serverRequest.headers.get("host") ?? "";
            }
            try {
                this.#url = new URL(`${proto}://${host}${serverRequest.url}`);
            } catch  {
                throw new TypeError(`The server request URL of "${proto}://${host}${serverRequest.url}" is invalid.`);
            }
        }
        return this.#url;
    }
    constructor(serverRequest, proxy1 = false, secure = false){
        this.#proxy = proxy1;
        this.#secure = secure;
        this.#serverRequest = serverRequest;
        this.#body = new RequestBody(serverRequest.getBody(), serverRequest.headers);
    }
    accepts(...types3) {
        const acceptValue = this.#serverRequest.headers.get("Accept");
        if (!acceptValue) {
            return types3.length ? types3[0] : [
                "*/*"
            ];
        }
        if (types3.length) {
            return preferredMediaTypes(acceptValue, types3)[0];
        }
        return preferredMediaTypes(acceptValue);
    }
    acceptsCharsets(...charsets) {
        const acceptCharsetValue = this.#serverRequest.headers.get("Accept-Charset");
        if (!acceptCharsetValue) {
            return charsets.length ? charsets[0] : [
                "*"
            ];
        }
        if (charsets.length) {
            return preferredCharsets(acceptCharsetValue, charsets)[0];
        }
        return preferredCharsets(acceptCharsetValue);
    }
    acceptsEncodings(...encodings) {
        const acceptEncodingValue = this.#serverRequest.headers.get("Accept-Encoding");
        if (!acceptEncodingValue) {
            return encodings.length ? encodings[0] : [
                "*"
            ];
        }
        if (encodings.length) {
            return preferredEncodings(acceptEncodingValue, encodings)[0];
        }
        return preferredEncodings(acceptEncodingValue);
    }
    acceptsLanguages(...langs) {
        const acceptLanguageValue = this.#serverRequest.headers.get("Accept-Language");
        if (!acceptLanguageValue) {
            return langs.length ? langs[0] : [
                "*"
            ];
        }
        if (langs.length) {
            return preferredLanguages(acceptLanguageValue, langs)[0];
        }
        return preferredLanguages(acceptLanguageValue);
    }
    body(options = {}) {
        return this.#body.get(options);
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        const { hasBody , headers , ip , ips , method , secure , url  } = this;
        return `${this.constructor.name} ${inspect({
            hasBody,
            headers,
            ip,
            ips,
            method,
            secure,
            url: url.toString()
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        const { hasBody , headers , ip , ips , method , secure , url  } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            hasBody,
            headers,
            ip,
            ips,
            method,
            secure,
            url
        }, newOptions)}`;
    }
}
const DomResponse = globalThis.Response ?? class MockResponse {
};
const maybeUpgradeWebSocket = "upgradeWebSocket" in Deno ? Deno.upgradeWebSocket.bind(Deno) : undefined;
class NativeRequest {
    #conn;
    #reject;
    #request;
    #requestPromise;
    #resolve;
    #resolved = false;
    #upgradeWebSocket;
    constructor(requestEvent, options = {}){
        const { conn  } = options;
        this.#conn = conn;
        this.#upgradeWebSocket = "upgradeWebSocket" in options ? options["upgradeWebSocket"] : maybeUpgradeWebSocket;
        this.#request = requestEvent.request;
        const p21 = new Promise((resolve6, reject)=>{
            this.#resolve = resolve6;
            this.#reject = reject;
        });
        this.#requestPromise = requestEvent.respondWith(p21);
    }
    get body() {
        return this.#request.body;
    }
    get donePromise() {
        return this.#requestPromise;
    }
    get headers() {
        return this.#request.headers;
    }
    get method() {
        return this.#request.method;
    }
    get remoteAddr() {
        return this.#conn?.remoteAddr?.hostname;
    }
    get request() {
        return this.#request;
    }
    get url() {
        try {
            const url = new URL(this.#request.url);
            return this.#request.url.replace(url.origin, "");
        } catch  {}
        return this.#request.url;
    }
    get rawUrl() {
        return this.#request.url;
    }
    error(reason) {
        if (this.#resolved) {
            throw new Error("Request already responded to.");
        }
        this.#reject(reason);
        this.#resolved = true;
    }
    getBody() {
        return {
            body: this.#request.body,
            readBody: async ()=>{
                const ab = await this.#request.arrayBuffer();
                return new Uint8Array(ab);
            }
        };
    }
    respond(response) {
        if (this.#resolved) {
            throw new Error("Request already responded to.");
        }
        this.#resolve(response);
        this.#resolved = true;
        return this.#requestPromise;
    }
    upgrade(options) {
        if (this.#resolved) {
            throw new Error("Request already responded to.");
        }
        if (!this.#upgradeWebSocket) {
            throw new TypeError("Upgrading web sockets not supported.");
        }
        const { response , socket  } = this.#upgradeWebSocket(this.#request, options);
        this.#resolve(response);
        this.#resolved = true;
        return socket;
    }
}
const REDIRECT_BACK = Symbol("redirect backwards");
async function convertBodyToBodyInit(body, type10) {
    let result;
    if (BODY_TYPES.includes(typeof body)) {
        result = String(body);
        type10 = type10 ?? (isHtml(result) ? "html" : "text/plain");
    } else if (isReader(body)) {
        result = readableStreamFromReader(body);
    } else if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof Blob || body instanceof URLSearchParams) {
        result = body;
    } else if (body instanceof ReadableStream) {
        result = body.pipeThrough(new Uint8ArrayTransformStream());
    } else if (body instanceof FormData) {
        result = body;
        type10 = "multipart/form-data";
    } else if (isAsyncIterable(body)) {
        result = readableStreamFromAsyncIterable(body);
    } else if (body && typeof body === "object") {
        result = JSON.stringify(body);
        type10 = type10 ?? "json";
    } else if (typeof body === "function") {
        const result = body.call(null);
        return convertBodyToBodyInit(await result, type10);
    } else if (body) {
        throw new TypeError("Response body was set but could not be converted.");
    }
    return [
        result,
        type10
    ];
}
class Response {
    #body;
    #bodySet = false;
    #domResponse;
    #headers = new Headers();
    #request;
    #resources = [];
    #status;
    #type;
    #writable = true;
    async #getBodyInit() {
        const [body, type] = await convertBodyToBodyInit(this.body, this.type);
        this.type = type;
        return body;
    }
     #setContentType() {
        if (this.type) {
            const contentTypeString = contentType(this.type);
            if (contentTypeString && !this.headers.has("Content-Type")) {
                this.headers.append("Content-Type", contentTypeString);
            }
        }
    }
    get body() {
        return this.#body;
    }
    set body(value44) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#bodySet = true;
        this.#body = value44;
    }
    get headers() {
        return this.#headers;
    }
    set headers(value45) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#headers = value45;
    }
    get status() {
        if (this.#status) {
            return this.#status;
        }
        return this.body != null ? Status.OK : this.#bodySet ? Status.NoContent : Status.NotFound;
    }
    set status(value46) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#status = value46;
    }
    get type() {
        return this.#type;
    }
    set type(value47) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#type = value47;
    }
    get writable() {
        return this.#writable;
    }
    constructor(request){
        this.#request = request;
    }
    addResource(rid) {
        this.#resources.push(rid);
    }
    destroy(closeResources = true) {
        this.#writable = false;
        this.#body = undefined;
        this.#domResponse = undefined;
        if (closeResources) {
            for (const rid of this.#resources){
                try {
                    Deno.close(rid);
                } catch  {}
            }
        }
    }
    redirect(url, alt = "/") {
        if (url === REDIRECT_BACK) {
            url = this.#request.headers.get("Referer") ?? String(alt);
        } else if (typeof url === "object") {
            url = String(url);
        }
        this.headers.set("Location", encodeUrl(url));
        if (!this.status || !isRedirectStatus(this.status)) {
            this.status = Status.Found;
        }
        if (this.#request.accepts("html")) {
            url = encodeURI(url);
            this.type = "text/html; charset=utf-8";
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        this.type = "text/plain; charset=utf-8";
        this.body = `Redirecting to ${url}.`;
    }
    async toDomResponse() {
        if (this.#domResponse) {
            return this.#domResponse;
        }
        const bodyInit = await this.#getBodyInit();
        this.#setContentType();
        const { headers  } = this;
        if (!(bodyInit || headers.has("Content-Type") || headers.has("Content-Length"))) {
            headers.append("Content-Length", "0");
        }
        this.#writable = false;
        const status = this.status;
        const responseInit = {
            headers,
            status,
            statusText: STATUS_TEXT.get(status)
        };
        return this.#domResponse = new DomResponse(bodyInit, responseInit);
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        const { body , headers , status , type: type11 , writable  } = this;
        return `${this.constructor.name} ${inspect({
            body,
            headers,
            status,
            type: type11,
            writable
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        const { body , headers , status , type: type12 , writable  } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            body,
            headers,
            status,
            type: type12,
            writable
        }, newOptions)}`;
    }
}
function isFileInfo(value48) {
    return Boolean(value48 && typeof value48 === "object" && "mtime" in value48 && "size" in value48);
}
function calcStatTag(entity) {
    const mtime = entity.mtime?.getTime().toString(16) ?? "0";
    const size = entity.size.toString(16);
    return `"${size}-${mtime}"`;
}
const encoder2 = new TextEncoder();
async function calcEntityTag(entity) {
    if (entity.length === 0) {
        return `"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk="`;
    }
    if (typeof entity === "string") {
        entity = encoder2.encode(entity);
    }
    const hash = mod7.encode(await crypto.subtle.digest("SHA-1", entity)).substring(0, 27);
    return `"${entity.length.toString(16)}-${hash}"`;
}
function fstat(file) {
    if ("fstat" in Deno) {
        return Deno.fstat(file.rid);
    }
    return Promise.resolve(undefined);
}
function getEntity(context) {
    const { body  } = context.response;
    if (body instanceof Deno.FsFile) {
        return fstat(body);
    }
    if (body instanceof Uint8Array) {
        return Promise.resolve(body);
    }
    if (BODY_TYPES.includes(typeof body)) {
        return Promise.resolve(String(body));
    }
    if (isAsyncIterable(body) || isReader(body)) {
        return Promise.resolve(undefined);
    }
    if (typeof body === "object" && body !== null) {
        try {
            const bodyText = JSON.stringify(body);
            return Promise.resolve(bodyText);
        } catch  {}
    }
    return Promise.resolve(undefined);
}
async function calculate(entity, options = {}) {
    const weak = options.weak ?? isFileInfo(entity);
    const tag = isFileInfo(entity) ? calcStatTag(entity) : await calcEntityTag(entity);
    return weak ? `W/${tag}` : tag;
}
function factory(options) {
    return async function etag(context, next) {
        await next();
        if (!context.response.headers.has("ETag")) {
            const entity = await getEntity(context);
            if (entity) {
                context.response.headers.set("ETag", await calculate(entity, options));
            }
        }
    };
}
async function ifMatch(value49, entity, options = {}) {
    const etag = await calculate(entity, options);
    if (etag.startsWith("W/")) {
        return false;
    }
    if (value49.trim() === "*") {
        return true;
    }
    const tags = value49.split(/\s*,\s*/);
    return tags.includes(etag);
}
async function ifNoneMatch(value50, entity, options = {}) {
    if (value50.trim() === "*") {
        return false;
    }
    const etag = await calculate(entity, options);
    const tags = value50.split(/\s*,\s*/);
    return !tags.includes(etag);
}
const mod10 = {
    getEntity: getEntity,
    calculate: calculate,
    factory: factory,
    ifMatch: ifMatch,
    ifNoneMatch: ifNoneMatch
};
const ETAG_RE = /(?:W\/)?"[ !#-\x7E\x80-\xFF]+"/;
async function ifRange(value51, mtime, entity) {
    if (value51) {
        const matches = value51.match(ETAG_RE);
        if (matches) {
            const [match] = matches;
            if (await calculate(entity) === match) {
                return true;
            }
        } else {
            return new Date(value51).getTime() >= mtime;
        }
    }
    return false;
}
function parseRange(value52, size) {
    const ranges = [];
    const [unit, rangesStr] = value52.split("=");
    if (unit !== "bytes") {
        throw createHttpError(Status.RequestedRangeNotSatisfiable);
    }
    for (const range of rangesStr.split(/\s*,\s+/)){
        const item = range.split("-");
        if (item.length !== 2) {
            throw createHttpError(Status.RequestedRangeNotSatisfiable);
        }
        const [startStr, endStr] = item;
        let start;
        let end;
        try {
            if (startStr === "") {
                start = size - parseInt(endStr, 10) - 1;
                end = size - 1;
            } else if (endStr === "") {
                start = parseInt(startStr, 10);
                end = size - 1;
            } else {
                start = parseInt(startStr, 10);
                end = parseInt(endStr, 10);
            }
        } catch  {
            throw createHttpError();
        }
        if (start < 0 || start >= size || end < 0 || end >= size || start > end) {
            throw createHttpError(Status.RequestedRangeNotSatisfiable);
        }
        ranges.push({
            start,
            end
        });
    }
    return ranges;
}
async function readRange(file, range) {
    let length = range.end - range.start + 1;
    assert2(length);
    await file.seek(range.start, Deno.SeekMode.Start);
    const result = new Uint8Array(length);
    let off = 0;
    while(length){
        const p22 = new Uint8Array(Math.min(length, 16_640));
        const nread = await file.read(p22);
        assert2(nread !== null, "Unexpected EOF encountered when reading a range.");
        assert2(nread > 0, "Unexpected read of 0 bytes while reading a range.");
        copy2(p22, result, off);
        off += nread;
        length -= nread;
        assert2(length >= 0, "Unexpected length remaining.");
    }
    return result;
}
const encoder3 = new TextEncoder();
class MultiPartStream extends ReadableStream {
    #contentLength;
    #postscript;
    #preamble;
    constructor(file, type13, ranges, size, boundary2){
        super({
            pull: async (controller)=>{
                const range = ranges.shift();
                if (!range) {
                    controller.enqueue(this.#postscript);
                    controller.close();
                    if (!(file instanceof Uint8Array)) {
                        file.close();
                    }
                    return;
                }
                let bytes;
                if (file instanceof Uint8Array) {
                    bytes = file.subarray(range.start, range.end + 1);
                } else {
                    bytes = await readRange(file, range);
                }
                const rangeHeader = encoder3.encode(`Content-Range: ${range.start}-${range.end}/${size}\n\n`);
                controller.enqueue(concat(this.#preamble, rangeHeader, bytes));
            }
        });
        const resolvedType = contentType(type13);
        if (!resolvedType) {
            throw new TypeError(`Could not resolve media type for "${type13}"`);
        }
        this.#preamble = encoder3.encode(`\n--${boundary2}\nContent-Type: ${resolvedType}\n`);
        this.#postscript = encoder3.encode(`\n--${boundary2}--\n`);
        this.#contentLength = ranges.reduce((prev, { start , end  })=>{
            return prev + this.#preamble.length + String(start).length + String(end).length + String(size).length + 20 + (end - start);
        }, this.#postscript.length);
    }
    contentLength() {
        return this.#contentLength;
    }
}
let boundary;
function isHidden(path68) {
    const pathArr = path68.split("/");
    for (const segment of pathArr){
        if (segment[0] === "." && segment !== "." && segment !== "..") {
            return true;
        }
        return false;
    }
}
async function exists1(path69) {
    try {
        return (await Deno.stat(path69)).isFile;
    } catch  {
        return false;
    }
}
async function getEntity1(path70, mtime, stats, maxbuffer, response) {
    let body;
    let entity;
    const file = await Deno.open(path70, {
        read: true
    });
    if (stats.size < maxbuffer) {
        const buffer1 = await readAll(file);
        file.close();
        body = entity = buffer1;
    } else {
        response.addResource(file.rid);
        body = file;
        entity = {
            mtime: new Date(mtime),
            size: stats.size
        };
    }
    return [
        body,
        entity
    ];
}
async function sendRange(response, body, range, size) {
    const ranges = parseRange(range, size);
    if (ranges.length === 0) {
        throw createHttpError(Status.RequestedRangeNotSatisfiable);
    }
    response.status = Status.PartialContent;
    if (ranges.length === 1) {
        const [byteRange] = ranges;
        response.headers.set("Content-Length", String(byteRange.end - byteRange.start + 1));
        response.headers.set("Content-Range", `bytes ${byteRange.start}-${byteRange.end}/${size}`);
        if (body instanceof Uint8Array) {
            response.body = body.slice(byteRange.start, byteRange.end + 1);
        } else {
            await body.seek(byteRange.start, Deno.SeekMode.Start);
            response.body = new LimitedReader(body, byteRange.end - byteRange.start + 1);
        }
    } else {
        assert2(response.type);
        if (!boundary) {
            boundary = await getBoundary();
        }
        response.headers.set("content-type", `multipart/byteranges; boundary=${boundary}`);
        const multipartBody = new MultiPartStream(body, response.type, ranges, size, boundary);
        response.headers.set("content-length", String(multipartBody.contentLength()));
        response.body = multipartBody;
    }
}
async function send({ request , response  }, path71, options = {
    root: ""
}) {
    const { brotli =true , contentTypes: contentTypes2 = {} , extensions: extensions2 , format: format8 = true , gzip =true , hidden =false , immutable =false , index , maxbuffer =1_048_576 , maxage =0 , root ,  } = options;
    const trailingSlash = path71[path71.length - 1] === "/";
    path71 = decodeComponent(path71.substr(parse6(path71).root.length));
    if (index && trailingSlash) {
        path71 += index;
    }
    if (!hidden && isHidden(path71)) {
        throw createHttpError(403);
    }
    path71 = resolvePath(root, path71);
    let encodingExt = "";
    if (brotli && request.acceptsEncodings("br", "identity") === "br" && await exists1(`${path71}.br`)) {
        path71 = `${path71}.br`;
        response.headers.set("Content-Encoding", "br");
        response.headers.delete("Content-Length");
        encodingExt = ".br";
    } else if (gzip && request.acceptsEncodings("gzip", "identity") === "gzip" && await exists1(`${path71}.gz`)) {
        path71 = `${path71}.gz`;
        response.headers.set("Content-Encoding", "gzip");
        response.headers.delete("Content-Length");
        encodingExt = ".gz";
    }
    if (extensions2 && !/\.[^/]*$/.exec(path71)) {
        for (let ext of extensions2){
            if (!/^\./.exec(ext)) {
                ext = `.${ext}`;
            }
            if (await exists1(`${path71}${ext}`)) {
                path71 += ext;
                break;
            }
        }
    }
    let stats;
    try {
        stats = await Deno.stat(path71);
        if (stats.isDirectory) {
            if (format8 && index) {
                path71 += `/${index}`;
                stats = await Deno.stat(path71);
            } else {
                return;
            }
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            throw createHttpError(404, err.message);
        }
        if (err instanceof Error && err.message.startsWith("ENOENT:")) {
            throw createHttpError(404, err.message);
        }
        throw createHttpError(500, err instanceof Error ? err.message : "[non-error thrown]");
    }
    let mtime = null;
    if (response.headers.has("Last-Modified")) {
        mtime = new Date(response.headers.get("Last-Modified")).getTime();
    } else if (stats.mtime) {
        mtime = stats.mtime.getTime();
        mtime -= mtime % 1000;
        response.headers.set("Last-Modified", new Date(mtime).toUTCString());
    }
    if (!response.headers.has("Cache-Control")) {
        const directives = [
            `max-age=${maxage / 1000 | 0}`
        ];
        if (immutable) {
            directives.push("immutable");
        }
        response.headers.set("Cache-Control", directives.join(","));
    }
    if (!response.type) {
        response.type = encodingExt !== "" ? extname5(basename5(path71, encodingExt)) : contentTypes2[extname5(path71)] ?? extname5(path71);
    }
    let entity = null;
    let body = null;
    if (request.headers.has("If-None-Match") && mtime) {
        [body, entity] = await getEntity1(path71, mtime, stats, maxbuffer, response);
        if (!await ifNoneMatch(request.headers.get("If-None-Match"), entity)) {
            response.headers.set("ETag", await calculate(entity));
            response.status = 304;
            return path71;
        }
    }
    if (request.headers.has("If-Modified-Since") && mtime) {
        const ifModifiedSince = new Date(request.headers.get("If-Modified-Since"));
        if (ifModifiedSince.getTime() >= mtime) {
            response.status = 304;
            return path71;
        }
    }
    if (!body || !entity) {
        [body, entity] = await getEntity1(path71, mtime ?? 0, stats, maxbuffer, response);
    }
    if (request.headers.has("If-Range") && mtime && await ifRange(request.headers.get("If-Range"), mtime, entity) && request.headers.has("Range")) {
        await sendRange(response, body, request.headers.get("Range"), stats.size);
        return path71;
    }
    if (request.headers.has("Range")) {
        await sendRange(response, body, request.headers.get("Range"), stats.size);
        return path71;
    }
    response.headers.set("Content-Length", String(stats.size));
    response.body = body;
    if (!response.headers.has("ETag")) {
        response.headers.set("ETag", await calculate(entity));
    }
    if (!response.headers.has("Accept-Ranges")) {
        response.headers.set("Accept-Ranges", "bytes");
    }
    return path71;
}
const encoder4 = new TextEncoder();
class CloseEvent extends Event {
    constructor(eventInit){
        super("close", eventInit);
    }
}
class ServerSentEvent extends Event {
    #data;
    #id;
    #type;
    constructor(type14, data21, eventInit = {}){
        super(type14, eventInit);
        const { replacer , space  } = eventInit;
        this.#type = type14;
        try {
            this.#data = typeof data21 === "string" ? data21 : JSON.stringify(data21, replacer, space);
        } catch (e18) {
            assert2(e18 instanceof Error);
            throw new TypeError(`data could not be coerced into a serialized string.\n  ${e18.message}`);
        }
        const { id  } = eventInit;
        this.#id = id;
    }
    get data() {
        return this.#data;
    }
    get id() {
        return this.#id;
    }
    toString() {
        const data22 = `data: ${this.#data.split("\n").join("\ndata: ")}\n`;
        return `${this.#type === "__message" ? "" : `event: ${this.#type}\n`}${this.#id ? `id: ${String(this.#id)}\n` : ""}${data22}\n`;
    }
}
const RESPONSE_HEADERS = [
    [
        "Connection",
        "Keep-Alive"
    ],
    [
        "Content-Type",
        "text/event-stream"
    ],
    [
        "Cache-Control",
        "no-cache"
    ],
    [
        "Keep-Alive",
        `timeout=${Number.MAX_SAFE_INTEGER}`
    ], 
];
class SSEStreamTarget extends EventTarget {
    #closed = false;
    #context;
    #controller;
    #keepAliveId;
     #error(error4) {
        console.log("error", error4);
        this.dispatchEvent(new CloseEvent({
            cancelable: false
        }));
        const errorEvent = new ErrorEvent("error", {
            error: error4
        });
        this.dispatchEvent(errorEvent);
        this.#context.app.dispatchEvent(errorEvent);
    }
     #push(payload) {
        if (!this.#controller) {
            this.#error(new Error("The controller has not been set."));
            return;
        }
        if (this.#closed) {
            return;
        }
        this.#controller.enqueue(encoder4.encode(payload));
    }
    get closed() {
        return this.#closed;
    }
    constructor(context, { headers , keepAlive =false  } = {}){
        super();
        this.#context = context;
        context.response.body = new ReadableStream({
            start: (controller)=>{
                this.#controller = controller;
            },
            cancel: (error1)=>{
                if (error1 instanceof Error && error1.message.includes("connection closed")) {
                    this.close();
                } else {
                    this.#error(error1);
                }
            }
        });
        if (headers) {
            for (const [key35, value53] of headers){
                context.response.headers.set(key35, value53);
            }
        }
        for (const [key36, value54] of RESPONSE_HEADERS){
            context.response.headers.set(key36, value54);
        }
        this.addEventListener("close", ()=>{
            this.#closed = true;
            if (this.#keepAliveId != null) {
                clearInterval(this.#keepAliveId);
                this.#keepAliveId = undefined;
            }
            if (this.#controller) {
                try {
                    this.#controller.close();
                } catch  {}
            }
        });
        if (keepAlive) {
            const interval = typeof keepAlive === "number" ? keepAlive : 30_000;
            this.#keepAliveId = setInterval(()=>{
                this.dispatchComment("keep-alive comment");
            }, interval);
        }
    }
    close() {
        this.dispatchEvent(new CloseEvent({
            cancelable: false
        }));
        return Promise.resolve();
    }
    dispatchComment(comment) {
        this.#push(`: ${comment.split("\n").join("\n: ")}\n\n`);
        return true;
    }
    dispatchMessage(data23) {
        const event = new ServerSentEvent("__message", data23);
        return this.dispatchEvent(event);
    }
    dispatchEvent(event) {
        const dispatched = super.dispatchEvent(event);
        if (dispatched && event instanceof ServerSentEvent) {
            this.#push(String(event));
        }
        return dispatched;
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        return `${this.constructor.name} ${inspect({
            "#closed": this.#closed,
            "#context": this.#context
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            "#closed": this.#closed,
            "#context": this.#context
        }, newOptions)}`;
    }
}
class Context {
    #socket;
    #sse;
    app;
    cookies;
    get isUpgradable() {
        const upgrade = this.request.headers.get("upgrade");
        if (!upgrade || upgrade.toLowerCase() !== "websocket") {
            return false;
        }
        const secKey = this.request.headers.get("sec-websocket-key");
        return typeof secKey === "string" && secKey != "";
    }
    respond;
    request;
    response;
    get socket() {
        return this.#socket;
    }
    state;
    constructor(app1, serverRequest, state1, secure = false){
        this.app = app1;
        this.state = state1;
        this.request = new Request1(serverRequest, app1.proxy, secure);
        this.respond = true;
        this.response = new Response(this.request);
        this.cookies = new Cookies(this.request, this.response, {
            keys: this.app.keys,
            secure: this.request.secure
        });
    }
    assert(condition, errorStatus = 500, message, props) {
        if (condition) {
            return;
        }
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    send(options) {
        const { path: path72 = this.request.url.pathname , ...sendOptions } = options;
        return send(this, path72, sendOptions);
    }
    sendEvents(options) {
        if (!this.#sse) {
            this.#sse = new SSEStreamTarget(this, options);
        }
        return this.#sse;
    }
    throw(errorStatus, message, props) {
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    upgrade(options) {
        if (this.#socket) {
            return this.#socket;
        }
        if (!this.request.originalRequest.upgrade) {
            throw new TypeError("Web socket upgrades not currently supported for this type of server.");
        }
        this.#socket = this.request.originalRequest.upgrade(options);
        this.respond = false;
        return this.#socket;
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        const { app: app2 , cookies , isUpgradable , respond , request , response , socket , state: state2 ,  } = this;
        return `${this.constructor.name} ${inspect({
            app: app2,
            cookies,
            isUpgradable,
            respond,
            request,
            response,
            socket,
            state: state2
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        const { app: app3 , cookies , isUpgradable , respond , request , response , socket , state: state3 ,  } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            app: app3,
            cookies,
            isUpgradable,
            respond,
            request,
            response,
            socket,
            state: state3
        }, newOptions)}`;
    }
}
const serveHttp = "serveHttp" in Deno ? Deno.serveHttp.bind(Deno) : undefined;
class HttpServer {
    #app;
    #closed = false;
    #listener;
    #httpConnections = new Set();
    #options;
    constructor(app4, options){
        if (!("serveHttp" in Deno)) {
            throw new Error("The native bindings for serving HTTP are not available.");
        }
        this.#app = app4;
        this.#options = options;
    }
    get app() {
        return this.#app;
    }
    get closed() {
        return this.#closed;
    }
    close() {
        this.#closed = true;
        if (this.#listener) {
            this.#listener.close();
            this.#listener = undefined;
        }
        for (const httpConn of this.#httpConnections){
            try {
                httpConn.close();
            } catch (error5) {
                if (!(error5 instanceof Deno.errors.BadResource)) {
                    throw error5;
                }
            }
        }
        this.#httpConnections.clear();
    }
    listen() {
        return this.#listener = isListenTlsOptions(this.#options) ? Deno.listenTls(this.#options) : Deno.listen(this.#options);
    }
     #trackHttpConnection(httpConn) {
        this.#httpConnections.add(httpConn);
    }
     #untrackHttpConnection(httpConn1) {
        this.#httpConnections.delete(httpConn1);
    }
    [Symbol.asyncIterator]() {
        const start = (controller)=>{
            const server = this;
            async function serve(conn) {
                const httpConn2 = serveHttp(conn);
                server.#trackHttpConnection(httpConn2);
                while(true){
                    try {
                        const requestEvent = await httpConn2.nextRequest();
                        if (requestEvent === null) {
                            return;
                        }
                        const nativeRequest = new NativeRequest(requestEvent, {
                            conn
                        });
                        controller.enqueue(nativeRequest);
                        nativeRequest.donePromise.catch((error6)=>{
                            server.app.dispatchEvent(new ErrorEvent("error", {
                                error: error6
                            }));
                        });
                    } catch (error7) {
                        server.app.dispatchEvent(new ErrorEvent("error", {
                            error: error7
                        }));
                    }
                    if (server.closed) {
                        server.#untrackHttpConnection(httpConn2);
                        httpConn2.close();
                        controller.close();
                    }
                }
            }
            const listener = this.#listener;
            assert2(listener);
            async function accept() {
                while(true){
                    try {
                        const conn = await listener.accept();
                        serve(conn);
                    } catch (error8) {
                        if (!server.closed) {
                            server.app.dispatchEvent(new ErrorEvent("error", {
                                error: error8
                            }));
                        }
                    }
                    if (server.closed) {
                        controller.close();
                        return;
                    }
                }
            }
            accept();
        };
        const stream = new ReadableStream({
            start
        });
        return stream[Symbol.asyncIterator]();
    }
}
function compareArrayBuffer(a11, b13) {
    assert2(a11.byteLength === b13.byteLength, "ArrayBuffer lengths must match.");
    const va = new DataView(a11);
    const vb = new DataView(b13);
    const length = va.byteLength;
    let out = 0;
    let i69 = -1;
    while(++i69 < length){
        out |= va.getUint8(i69) ^ vb.getUint8(i69);
    }
    return out === 0;
}
async function compare(a12, b14) {
    const key37 = new Uint8Array(32);
    globalThis.crypto.getRandomValues(key37);
    const cryptoKey = await importKey(key37);
    const ah = await sign(a12, cryptoKey);
    const bh = await sign(b14, cryptoKey);
    return compareArrayBuffer(ah, bh);
}
class KeyStack {
    #cryptoKeys = new Map();
    #keys;
    async #toCryptoKey(key38) {
        if (!this.#cryptoKeys.has(key38)) {
            this.#cryptoKeys.set(key38, await importKey(key38));
        }
        return this.#cryptoKeys.get(key38);
    }
    get length() {
        return this.#keys.length;
    }
    constructor(keys){
        if (!(0 in keys)) {
            throw new TypeError("keys must contain at least one value");
        }
        this.#keys = keys;
    }
    async sign(data24) {
        const key1 = await this.#toCryptoKey(this.#keys[0]);
        return encodeBase64Safe(await sign(data24, key1));
    }
    async verify(data25, digest2) {
        return await this.indexOf(data25, digest2) > -1;
    }
    async indexOf(data26, digest3) {
        for(let i70 = 0; i70 < this.#keys.length; i70++){
            const cryptoKey = await this.#toCryptoKey(this.#keys[i70]);
            if (await compare(digest3, encodeBase64Safe(await sign(data26, cryptoKey)))) {
                return i70;
            }
        }
        return -1;
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        const { length  } = this;
        return `${this.constructor.name} ${inspect({
            length
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        const { length  } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            length
        }, newOptions)}`;
    }
}
function compose(middleware1) {
    return function composedMiddleware(context, next) {
        let index = -1;
        async function dispatch(i71) {
            if (i71 <= index) {
                throw new Error("next() called multiple times.");
            }
            index = i71;
            let fn = middleware1[i71];
            if (i71 === middleware1.length) {
                fn = next;
            }
            if (!fn) {
                return;
            }
            await fn(context, dispatch.bind(null, i71 + 1));
        }
        return dispatch(0);
    };
}
const objectCloneMemo = new WeakMap();
function cloneArrayBuffer(srcBuffer, srcByteOffset, srcLength, _cloneConstructor) {
    return srcBuffer.slice(srcByteOffset, srcByteOffset + srcLength);
}
function cloneValue(value55) {
    switch(typeof value55){
        case "number":
        case "string":
        case "boolean":
        case "undefined":
        case "bigint":
            return value55;
        case "object":
            {
                if (objectCloneMemo.has(value55)) {
                    return objectCloneMemo.get(value55);
                }
                if (value55 === null) {
                    return value55;
                }
                if (value55 instanceof Date) {
                    return new Date(value55.valueOf());
                }
                if (value55 instanceof RegExp) {
                    return new RegExp(value55);
                }
                if (value55 instanceof SharedArrayBuffer) {
                    return value55;
                }
                if (value55 instanceof ArrayBuffer) {
                    const cloned = cloneArrayBuffer(value55, 0, value55.byteLength, ArrayBuffer);
                    objectCloneMemo.set(value55, cloned);
                    return cloned;
                }
                if (ArrayBuffer.isView(value55)) {
                    const clonedBuffer = cloneValue(value55.buffer);
                    let length;
                    if (value55 instanceof DataView) {
                        length = value55.byteLength;
                    } else {
                        length = value55.length;
                    }
                    return new value55.constructor(clonedBuffer, value55.byteOffset, length);
                }
                if (value55 instanceof Map) {
                    const clonedMap = new Map();
                    objectCloneMemo.set(value55, clonedMap);
                    value55.forEach((v3, k2)=>{
                        clonedMap.set(cloneValue(k2), cloneValue(v3));
                    });
                    return clonedMap;
                }
                if (value55 instanceof Set) {
                    const clonedSet = new Set([
                        ...value55
                    ].map(cloneValue));
                    objectCloneMemo.set(value55, clonedSet);
                    return clonedSet;
                }
                const clonedObj = {};
                objectCloneMemo.set(value55, clonedObj);
                const sourceKeys = Object.getOwnPropertyNames(value55);
                for (const key39 of sourceKeys){
                    clonedObj[key39] = cloneValue(value55[key39]);
                }
                Reflect.setPrototypeOf(clonedObj, Reflect.getPrototypeOf(value55));
                return clonedObj;
            }
        case "symbol":
        case "function":
        default:
            throw new DOMException("Uncloneable value in stream", "DataCloneError");
    }
}
const core = Deno?.core;
const structuredClone = globalThis.structuredClone;
function sc(value56) {
    return structuredClone ? structuredClone(value56) : core ? core.deserialize(core.serialize(value56)) : cloneValue(value56);
}
function cloneState(state4) {
    const clone = {};
    for (const [key40, value57] of Object.entries(state4)){
        try {
            const clonedValue = sc(value57);
            clone[key40] = clonedValue;
        } catch  {}
    }
    return clone;
}
const ADDR_REGEXP = /^\[?([^\]]*)\]?:([0-9]{1,5})$/;
class ApplicationErrorEvent extends ErrorEvent {
    context;
    constructor(eventInitDict){
        super("error", eventInitDict);
        this.context = eventInitDict.context;
    }
}
function logErrorListener({ error: error9 , context  }) {
    if (error9 instanceof Error) {
        console.error(`[uncaught application error]: ${error9.name} - ${error9.message}`);
    } else {
        console.error(`[uncaught application error]\n`, error9);
    }
    if (context) {
        let url;
        try {
            url = context.request.url.toString();
        } catch  {
            url = "[malformed url]";
        }
        console.error(`\nrequest:`, {
            url,
            method: context.request.method,
            hasBody: context.request.hasBody
        });
        console.error(`response:`, {
            status: context.response.status,
            type: context.response.type,
            hasBody: !!context.response.body,
            writable: context.response.writable
        });
    }
    if (error9 instanceof Error && error9.stack) {
        console.error(`\n${error9.stack.split("\n").slice(1).join("\n")}`);
    }
}
class ApplicationListenEvent extends Event {
    hostname;
    listener;
    port;
    secure;
    serverType;
    constructor(eventInitDict){
        super("listen", eventInitDict);
        this.hostname = eventInitDict.hostname;
        this.listener = eventInitDict.listener;
        this.port = eventInitDict.port;
        this.secure = eventInitDict.secure;
        this.serverType = eventInitDict.serverType;
    }
}
class Application extends EventTarget {
    #composedMiddleware;
    #contextState;
    #keys;
    #middleware = [];
    #serverConstructor;
    get keys() {
        return this.#keys;
    }
    set keys(keys) {
        if (!keys) {
            this.#keys = undefined;
            return;
        } else if (Array.isArray(keys)) {
            this.#keys = new KeyStack(keys);
        } else {
            this.#keys = keys;
        }
    }
    proxy;
    state;
    constructor(options = {}){
        super();
        const { state: state5 , keys , proxy: proxy2 , serverConstructor =HttpServer , contextState ="clone" , logErrors =true ,  } = options;
        this.proxy = proxy2 ?? false;
        this.keys = keys;
        this.state = state5 ?? {};
        this.#serverConstructor = serverConstructor;
        this.#contextState = contextState;
        if (logErrors) {
            this.addEventListener("error", logErrorListener);
        }
    }
     #getComposed() {
        if (!this.#composedMiddleware) {
            this.#composedMiddleware = compose(this.#middleware);
        }
        return this.#composedMiddleware;
    }
     #getContextState() {
        switch(this.#contextState){
            case "alias":
                return this.state;
            case "clone":
                return cloneState(this.state);
            case "empty":
                return {};
            case "prototype":
                return Object.create(this.state);
        }
    }
     #handleError(context, error10) {
        if (!(error10 instanceof Error)) {
            error10 = new Error(`non-error thrown: ${JSON.stringify(error10)}`);
        }
        const { message  } = error10;
        this.dispatchEvent(new ApplicationErrorEvent({
            context,
            message,
            error: error10
        }));
        if (!context.response.writable) {
            return;
        }
        for (const key of [
            ...context.response.headers.keys()
        ]){
            context.response.headers.delete(key);
        }
        if (error10.headers && error10.headers instanceof Headers) {
            for (const [key, value] of error10.headers){
                context.response.headers.set(key, value);
            }
        }
        context.response.type = "text";
        const status = context.response.status = Deno.errors && error10 instanceof Deno.errors.NotFound ? 404 : error10.status && typeof error10.status === "number" ? error10.status : 500;
        context.response.body = error10.expose ? error10.message : STATUS_TEXT.get(status);
    }
    async #handleRequest(request, secure, state6) {
        const context = new Context(this, request, this.#getContextState(), secure);
        let resolve;
        const handlingPromise = new Promise((res)=>resolve = res);
        state6.handling.add(handlingPromise);
        if (!state6.closing && !state6.closed) {
            try {
                await this.#getComposed()(context);
            } catch (err) {
                this.#handleError(context, err);
            }
        }
        if (context.respond === false) {
            context.response.destroy();
            resolve();
            state6.handling.delete(handlingPromise);
            return;
        }
        let closeResources = true;
        let response;
        try {
            closeResources = false;
            response = await context.response.toDomResponse();
        } catch (err) {
            this.#handleError(context, err);
            response = await context.response.toDomResponse();
        }
        assert2(response);
        try {
            await request.respond(response);
        } catch (err1) {
            this.#handleError(context, err1);
        } finally{
            context.response.destroy(closeResources);
            resolve();
            state6.handling.delete(handlingPromise);
            if (state6.closing) {
                state6.server.close();
                state6.closed = true;
            }
        }
    }
    addEventListener(type15, listener, options) {
        super.addEventListener(type15, listener, options);
    }
    handle = async (request1, secureOrConn, secure1 = false)=>{
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        assert2(isConn(secureOrConn) || typeof secureOrConn === "undefined");
        const contextRequest = new NativeRequest({
            request: request1,
            respondWith () {
                return Promise.resolve(undefined);
            }
        }, {
            conn: secureOrConn
        });
        const context1 = new Context(this, contextRequest, this.#getContextState(), secure1);
        try {
            await this.#getComposed()(context1);
        } catch (err) {
            this.#handleError(context1, err);
        }
        if (context1.respond === false) {
            context1.response.destroy();
            return;
        }
        try {
            const response = await context1.response.toDomResponse();
            context1.response.destroy(false);
            return response;
        } catch (err2) {
            this.#handleError(context1, err2);
            throw err2;
        }
    };
    async listen(options = {
        port: 0
    }) {
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        if (typeof options === "string") {
            const match = ADDR_REGEXP.exec(options);
            if (!match) {
                throw TypeError(`Invalid address passed: "${options}"`);
            }
            const [, hostname3, portStr] = match;
            options = {
                hostname: hostname3,
                port: parseInt(portStr, 10)
            };
        }
        options = Object.assign({
            port: 0
        }, options);
        const server = new this.#serverConstructor(this, options);
        const { signal  } = options;
        const state1 = {
            closed: false,
            closing: false,
            handling: new Set(),
            server
        };
        if (signal) {
            signal.addEventListener("abort", ()=>{
                if (!state1.handling.size) {
                    server.close();
                    state1.closed = true;
                }
                state1.closing = true;
            });
        }
        const { secure: secure2 = false  } = options;
        const serverType = server instanceof HttpServer ? "native" : "custom";
        const listener = server.listen();
        const { hostname: hostname4 , port: port1  } = listener.addr;
        this.dispatchEvent(new ApplicationListenEvent({
            hostname: hostname4,
            listener,
            port: port1,
            secure: secure2,
            serverType
        }));
        try {
            for await (const request2 of server){
                this.#handleRequest(request2, secure2, state1);
            }
            await Promise.all(state1.handling);
        } catch (error1) {
            const message = error1 instanceof Error ? error1.message : "Application Error";
            this.dispatchEvent(new ApplicationErrorEvent({
                message,
                error: error1
            }));
        }
    }
    use(...middleware2) {
        this.#middleware.push(...middleware2);
        this.#composedMiddleware = undefined;
        return this;
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        const { keys , proxy: proxy3 , state: state2  } = this;
        return `${this.constructor.name} ${inspect({
            "#middleware": this.#middleware,
            keys,
            proxy: proxy3,
            state: state2
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        const { keys , proxy: proxy4 , state: state3  } = this;
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            "#middleware": this.#middleware,
            keys,
            proxy: proxy4,
            state: state3
        }, newOptions)}`;
    }
}
function getQuery(ctx, { mergeParams , asMap  } = {}) {
    const result = {};
    if (mergeParams && isRouterContext(ctx)) {
        Object.assign(result, ctx.params);
    }
    for (const [key41, value58] of ctx.request.url.searchParams){
        result[key41] = value58;
    }
    return asMap ? new Map(Object.entries(result)) : result;
}
const mod11 = {
    getQuery: getQuery
};
const FORWARDED_RE = /^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$/;
function createMatcher({ match  }) {
    return function matches(ctx) {
        if (!match) {
            return true;
        }
        if (typeof match === "string") {
            return ctx.request.url.pathname.startsWith(match);
        }
        if (match instanceof RegExp) {
            return match.test(ctx.request.url.pathname);
        }
        return match(ctx);
    };
}
async function createRequest(target, ctx, { headers: optHeaders , map , proxyHeaders =true , request: reqFn  }) {
    let path73 = ctx.request.url.pathname;
    let params;
    if (isRouterContext(ctx)) {
        params = ctx.params;
    }
    if (map && typeof map === "function") {
        path73 = map(path73, params);
    } else if (map) {
        path73 = map[path73] ?? path73;
    }
    const url = new URL(String(target));
    if (url.pathname.endsWith("/") && path73.startsWith("/")) {
        url.pathname = `${url.pathname}${path73.slice(1)}`;
    } else if (!url.pathname.endsWith("/") && !path73.startsWith("/")) {
        url.pathname = `${url.pathname}/${path73}`;
    } else {
        url.pathname = `${url.pathname}${path73}`;
    }
    url.search = ctx.request.url.search;
    const body = getBodyInit(ctx);
    const headers = new Headers(ctx.request.headers);
    if (optHeaders) {
        if (typeof optHeaders === "function") {
            optHeaders = await optHeaders(ctx);
        }
        for (const [key42, value59] of iterableHeaders(optHeaders)){
            headers.set(key42, value59);
        }
    }
    if (proxyHeaders) {
        const maybeForwarded = headers.get("forwarded");
        const ip = ctx.request.ip.startsWith("[") ? `"${ctx.request.ip}"` : ctx.request.ip;
        const host = headers.get("host");
        if (maybeForwarded && FORWARDED_RE.test(maybeForwarded)) {
            let value60 = `for=${ip}`;
            if (host) {
                value60 += `;host=${host}`;
            }
            headers.append("forwarded", value60);
        } else {
            headers.append("x-forwarded-for", ip);
            if (host) {
                headers.append("x-forwarded-host", host);
            }
        }
    }
    const init = {
        body,
        headers,
        method: ctx.request.method,
        redirect: "follow"
    };
    let request3 = new Request(url.toString(), init);
    if (reqFn) {
        request3 = await reqFn(request3);
    }
    return request3;
}
function getBodyInit(ctx) {
    if (!ctx.request.hasBody) {
        return null;
    }
    return ctx.request.body({
        type: "stream"
    }).value;
}
function iterableHeaders(headers) {
    if (headers instanceof Headers) {
        return headers.entries();
    } else if (Array.isArray(headers)) {
        return headers.values();
    } else {
        return Object.entries(headers).values();
    }
}
async function processResponse(response, ctx, { contentType: contentTypeFn , response: resFn  }) {
    if (resFn) {
        response = await resFn(response);
    }
    if (response.body) {
        ctx.response.body = response.body;
    } else {
        ctx.response.body = null;
    }
    ctx.response.status = response.status;
    for (const [key43, value61] of response.headers){
        ctx.response.headers.append(key43, value61);
    }
    if (contentTypeFn) {
        const value62 = await contentTypeFn(response.url, ctx.response.headers.get("content-type") ?? undefined);
        if (value62 != null) {
            ctx.response.headers.set("content-type", value62);
        }
    }
}
function proxy(target, options = {}) {
    const matches = createMatcher(options);
    return async function proxy(ctx, next) {
        if (!matches(ctx)) {
            return next();
        }
        const request4 = await createRequest(target, ctx, options);
        const { fetch =globalThis.fetch  } = options;
        const response = await fetch(request4);
        await processResponse(response, ctx, options);
        return next();
    };
}
function toUrl(url, params = {}, options) {
    const tokens = parse7(url);
    let replace = {};
    if (tokens.some((token)=>typeof token === "object")) {
        replace = params;
    } else {
        options = params;
    }
    const toPath = compile(url, options);
    const replaced = toPath(replace);
    if (options && options.query) {
        const url = new URL(replaced, "http://oak");
        if (typeof options.query === "string") {
            url.search = options.query;
        } else {
            url.search = String(options.query instanceof URLSearchParams ? options.query : new URLSearchParams(options.query));
        }
        return `${url.pathname}${url.search}${url.hash}`;
    }
    return replaced;
}
class Layer {
    #opts;
    #paramNames = [];
    #regexp;
    methods;
    name;
    path;
    stack;
    constructor(path74, methods, middleware3, { name , ...opts } = {}){
        this.#opts = opts;
        this.name = name;
        this.methods = [
            ...methods
        ];
        if (this.methods.includes("GET")) {
            this.methods.unshift("HEAD");
        }
        this.stack = Array.isArray(middleware3) ? middleware3.slice() : [
            middleware3
        ];
        this.path = path74;
        this.#regexp = pathToRegexp(path74, this.#paramNames, this.#opts);
    }
    clone() {
        return new Layer(this.path, this.methods, this.stack, {
            name: this.name,
            ...this.#opts
        });
    }
    match(path75) {
        return this.#regexp.test(path75);
    }
    params(captures, existingParams = {}) {
        const params = existingParams;
        for(let i72 = 0; i72 < captures.length; i72++){
            if (this.#paramNames[i72]) {
                const c13 = captures[i72];
                params[this.#paramNames[i72].name] = c13 ? decodeComponent(c13) : c13;
            }
        }
        return params;
    }
    captures(path76) {
        if (this.#opts.ignoreCaptures) {
            return [];
        }
        return path76.match(this.#regexp)?.slice(1) ?? [];
    }
    url(params = {}, options) {
        const url = this.path.replace(/\(\.\*\)/g, "");
        return toUrl(url, params, options);
    }
    param(param, fn) {
        const stack = this.stack;
        const params = this.#paramNames;
        const middleware4 = function(ctx, next) {
            const p23 = ctx.params[param];
            assert2(p23);
            return fn.call(this, p23, ctx, next);
        };
        middleware4.param = param;
        const names = params.map((p24)=>p24.name);
        const x10 = names.indexOf(param);
        if (x10 >= 0) {
            for(let i73 = 0; i73 < stack.length; i73++){
                const fn = stack[i73];
                if (!fn.param || names.indexOf(fn.param) > x10) {
                    stack.splice(i73, 0, middleware4);
                    break;
                }
            }
        }
        return this;
    }
    setPrefix(prefix) {
        if (this.path) {
            this.path = this.path !== "/" || this.#opts.strict === true ? `${prefix}${this.path}` : prefix;
            this.#paramNames = [];
            this.#regexp = pathToRegexp(this.path, this.#paramNames, this.#opts);
        }
        return this;
    }
    toJSON() {
        return {
            methods: [
                ...this.methods
            ],
            middleware: [
                ...this.stack
            ],
            paramNames: this.#paramNames.map((key44)=>key44.name),
            path: this.path,
            regexp: this.#regexp,
            options: {
                ...this.#opts
            }
        };
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        return `${this.constructor.name} ${inspect({
            methods: this.methods,
            middleware: this.stack,
            options: this.#opts,
            paramNames: this.#paramNames.map((key45)=>key45.name),
            path: this.path,
            regexp: this.#regexp
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
        if (depth < 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options, {
            depth: options.depth === null ? null : options.depth - 1
        });
        return `${options.stylize(this.constructor.name, "special")} ${inspect({
            methods: this.methods,
            middleware: this.stack,
            options: this.#opts,
            paramNames: this.#paramNames.map((key46)=>key46.name),
            path: this.path,
            regexp: this.#regexp
        }, newOptions)}`;
    }
}
class Router {
    #opts;
    #methods;
    #params = {};
    #stack = [];
     #match(path77, method) {
        const matches = {
            path: [],
            pathAndMethod: [],
            route: false
        };
        for (const route of this.#stack){
            if (route.match(path77)) {
                matches.path.push(route);
                if (route.methods.length === 0 || route.methods.includes(method)) {
                    matches.pathAndMethod.push(route);
                    if (route.methods.length) {
                        matches.route = true;
                    }
                }
            }
        }
        return matches;
    }
     #register(path110, middlewares, methods, options = {}) {
        if (Array.isArray(path110)) {
            for (const p of path110){
                this.#register(p, middlewares, methods, options);
            }
            return;
        }
        let layerMiddlewares = [];
        for (const middleware of middlewares){
            if (!middleware.router) {
                layerMiddlewares.push(middleware);
                continue;
            }
            if (layerMiddlewares.length) {
                this.#addLayer(path110, layerMiddlewares, methods, options);
                layerMiddlewares = [];
            }
            const router = middleware.router.#clone();
            for (const layer of router.#stack){
                if (!options.ignorePrefix) {
                    layer.setPrefix(path110);
                }
                if (this.#opts.prefix) {
                    layer.setPrefix(this.#opts.prefix);
                }
                this.#stack.push(layer);
            }
            for (const [param, mw] of Object.entries(this.#params)){
                router.param(param, mw);
            }
        }
        if (layerMiddlewares.length) {
            this.#addLayer(path110, layerMiddlewares, methods, options);
        }
    }
     #addLayer(path210, middlewares1, methods1, options1 = {}) {
        const { end , name , sensitive =this.#opts.sensitive , strict =this.#opts.strict , ignoreCaptures ,  } = options1;
        const route = new Layer(path210, methods1, middlewares1, {
            end,
            name,
            sensitive,
            strict,
            ignoreCaptures
        });
        if (this.#opts.prefix) {
            route.setPrefix(this.#opts.prefix);
        }
        for (const [param, mw] of Object.entries(this.#params)){
            route.param(param, mw);
        }
        this.#stack.push(route);
    }
     #route(name) {
        for (const route of this.#stack){
            if (route.name === name) {
                return route;
            }
        }
    }
     #useVerb(nameOrPath, pathOrMiddleware, middleware5, methods2) {
        let name = undefined;
        let path;
        if (typeof pathOrMiddleware === "string") {
            name = nameOrPath;
            path = pathOrMiddleware;
        } else {
            path = nameOrPath;
            middleware5.unshift(pathOrMiddleware);
        }
        this.#register(path, middleware5, methods2, {
            name
        });
    }
     #clone() {
        const router = new Router(this.#opts);
        router.#methods = router.#methods.slice();
        router.#params = {
            ...this.#params
        };
        router.#stack = this.#stack.map((layer)=>layer.clone());
        return router;
    }
    constructor(opts = {}){
        this.#opts = opts;
        this.#methods = opts.methods ?? [
            "DELETE",
            "GET",
            "HEAD",
            "OPTIONS",
            "PATCH",
            "POST",
            "PUT", 
        ];
    }
    all(nameOrPath1, pathOrMiddleware1, ...middleware1) {
        this.#useVerb(nameOrPath1, pathOrMiddleware1, middleware1, [
            "DELETE",
            "GET",
            "POST",
            "PUT"
        ]);
        return this;
    }
    allowedMethods(options2 = {}) {
        const implemented = this.#methods;
        const allowedMethods = async (context2, next)=>{
            const ctx = context2;
            await next();
            if (!ctx.response.status || ctx.response.status === Status.NotFound) {
                assert2(ctx.matched);
                const allowed = new Set();
                for (const route of ctx.matched){
                    for (const method1 of route.methods){
                        allowed.add(method1);
                    }
                }
                const allowedStr = [
                    ...allowed
                ].join(", ");
                if (!implemented.includes(ctx.request.method)) {
                    if (options2.throw) {
                        throw options2.notImplemented ? options2.notImplemented() : new httpErrors.NotImplemented();
                    } else {
                        ctx.response.status = Status.NotImplemented;
                        ctx.response.headers.set("Allowed", allowedStr);
                    }
                } else if (allowed.size) {
                    if (ctx.request.method === "OPTIONS") {
                        ctx.response.status = Status.OK;
                        ctx.response.headers.set("Allowed", allowedStr);
                    } else if (!allowed.has(ctx.request.method)) {
                        if (options2.throw) {
                            throw options2.methodNotAllowed ? options2.methodNotAllowed() : new httpErrors.MethodNotAllowed();
                        } else {
                            ctx.response.status = Status.MethodNotAllowed;
                            ctx.response.headers.set("Allowed", allowedStr);
                        }
                    }
                }
            }
        };
        return allowedMethods;
    }
    delete(nameOrPath2, pathOrMiddleware2, ...middleware2) {
        this.#useVerb(nameOrPath2, pathOrMiddleware2, middleware2, [
            "DELETE"
        ]);
        return this;
    }
    *entries() {
        for (const route of this.#stack){
            const value63 = route.toJSON();
            yield [
                value63,
                value63
            ];
        }
    }
    forEach(callback, thisArg = null) {
        for (const route of this.#stack){
            const value64 = route.toJSON();
            callback.call(thisArg, value64, value64, this);
        }
    }
    get(nameOrPath3, pathOrMiddleware3, ...middleware3) {
        this.#useVerb(nameOrPath3, pathOrMiddleware3, middleware3, [
            "GET"
        ]);
        return this;
    }
    head(nameOrPath4, pathOrMiddleware4, ...middleware4) {
        this.#useVerb(nameOrPath4, pathOrMiddleware4, middleware4, [
            "HEAD"
        ]);
        return this;
    }
    *keys() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    options(nameOrPath5, pathOrMiddleware5, ...middleware5) {
        this.#useVerb(nameOrPath5, pathOrMiddleware5, middleware5, [
            "OPTIONS"
        ]);
        return this;
    }
    param(param, middleware6) {
        this.#params[param] = middleware6;
        for (const route of this.#stack){
            route.param(param, middleware6);
        }
        return this;
    }
    patch(nameOrPath6, pathOrMiddleware6, ...middleware7) {
        this.#useVerb(nameOrPath6, pathOrMiddleware6, middleware7, [
            "PATCH"
        ]);
        return this;
    }
    post(nameOrPath7, pathOrMiddleware7, ...middleware8) {
        this.#useVerb(nameOrPath7, pathOrMiddleware7, middleware8, [
            "POST"
        ]);
        return this;
    }
    prefix(prefix) {
        prefix = prefix.replace(/\/$/, "");
        this.#opts.prefix = prefix;
        for (const route of this.#stack){
            route.setPrefix(prefix);
        }
        return this;
    }
    put(nameOrPath8, pathOrMiddleware8, ...middleware9) {
        this.#useVerb(nameOrPath8, pathOrMiddleware8, middleware9, [
            "PUT"
        ]);
        return this;
    }
    redirect(source, destination, status = Status.Found) {
        if (source[0] !== "/") {
            const s13 = this.url(source);
            if (!s13) {
                throw new RangeError(`Could not resolve named route: "${source}"`);
            }
            source = s13;
        }
        if (typeof destination === "string") {
            if (destination[0] !== "/") {
                const d3 = this.url(destination);
                if (!d3) {
                    try {
                        const url = new URL(destination);
                        destination = url;
                    } catch  {
                        throw new RangeError(`Could not resolve named route: "${source}"`);
                    }
                } else {
                    destination = d3;
                }
            }
        }
        this.all(source, async (ctx, next)=>{
            await next();
            ctx.response.redirect(destination);
            ctx.response.status = status;
        });
        return this;
    }
    routes() {
        const dispatch = (context3, next1)=>{
            const ctx1 = context3;
            let pathname;
            let method2;
            try {
                const { url: { pathname: p25  } , method: m7  } = ctx1.request;
                pathname = p25;
                method2 = m7;
            } catch (e19) {
                return Promise.reject(e19);
            }
            const path310 = (this.#opts.routerPath ?? ctx1.routerPath) ?? decodeURI(pathname);
            const matches = this.#match(path310, method2);
            if (ctx1.matched) {
                ctx1.matched.push(...matches.path);
            } else {
                ctx1.matched = [
                    ...matches.path
                ];
            }
            ctx1.router = this;
            if (!matches.route) return next1();
            const { pathAndMethod: matchedRoutes  } = matches;
            const chain = matchedRoutes.reduce((prev, route)=>[
                    ...prev,
                    (ctx, next)=>{
                        ctx.captures = route.captures(path310);
                        ctx.params = route.params(ctx.captures, ctx.params);
                        ctx.routeName = route.name;
                        return next();
                    },
                    ...route.stack, 
                ], []);
            return compose(chain)(ctx1, next1);
        };
        dispatch.router = this;
        return dispatch;
    }
    url(name1, params, options3) {
        const route = this.#route(name1);
        if (route) {
            return route.url(params, options3);
        }
    }
    use(pathOrMiddleware9, ...middleware10) {
        let path4;
        if (typeof pathOrMiddleware9 === "string" || Array.isArray(pathOrMiddleware9)) {
            path4 = pathOrMiddleware9;
        } else {
            middleware10.unshift(pathOrMiddleware9);
        }
        this.#register(path4 ?? "(.*)", middleware10, [], {
            end: false,
            ignoreCaptures: !path4,
            ignorePrefix: !path4
        });
        return this;
    }
    *values() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    *[Symbol.iterator]() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    static url(path5, params, options4) {
        return toUrl(path5, params, options4);
    }
    [Symbol.for("Deno.customInspect")](inspect) {
        return `${this.constructor.name} ${inspect({
            "#params": this.#params,
            "#stack": this.#stack
        })}`;
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth, options5, inspect) {
        if (depth < 0) {
            return options5.stylize(`[${this.constructor.name}]`, "special");
        }
        const newOptions = Object.assign({}, options5, {
            depth: options5.depth === null ? null : options5.depth - 1
        });
        return `${options5.stylize(this.constructor.name, "special")} ${inspect({
            "#params": this.#params,
            "#stack": this.#stack
        }, newOptions)}`;
    }
}
function createMockApp(state7 = {}) {
    const app5 = {
        state: state7,
        use () {
            return app5;
        },
        [Symbol.for("Deno.customInspect")] () {
            return "MockApplication {}";
        },
        [Symbol.for("nodejs.util.inspect.custom")] (depth, options6, inspect) {
            if (depth < 0) {
                return options6.stylize(`[MockApplication]`, "special");
            }
            const newOptions = Object.assign({}, options6, {
                depth: options6.depth === null ? null : options6.depth - 1
            });
            return `${options6.stylize("MockApplication", "special")} ${inspect({}, newOptions)}`;
        }
    };
    return app5;
}
const mockContextState = {
    encodingsAccepted: "identity"
};
function createMockContext({ ip ="127.0.0.1" , method: method3 = "GET" , params , path: path78 = "/" , state: state8 , app: app6 = createMockApp(state8) , headers  } = {}) {
    function createMockRequest() {
        const headerMap = new Headers(headers);
        return {
            accepts (...types4) {
                const acceptValue = headerMap.get("Accept");
                if (!acceptValue) {
                    return;
                }
                if (types4.length) {
                    return preferredMediaTypes(acceptValue, types4)[0];
                }
                return preferredMediaTypes(acceptValue);
            },
            acceptsEncodings () {
                return mockContextState.encodingsAccepted;
            },
            headers: headerMap,
            ip,
            method: method3,
            path: path78,
            search: undefined,
            searchParams: new URLSearchParams(),
            url: new URL(path78, "http://localhost/")
        };
    }
    const request5 = createMockRequest();
    const response = new Response(request5);
    const cookies = new Cookies(request5, response);
    return {
        app: app6,
        params,
        request: request5,
        cookies,
        response,
        state: Object.assign({}, app6.state),
        assert (condition, errorStatus = 500, message, props) {
            if (condition) {
                return;
            }
            const err = createHttpError(errorStatus, message);
            if (props) {
                Object.assign(err, props);
            }
            throw err;
        },
        throw (errorStatus, message, props) {
            const err = createHttpError(errorStatus, message);
            if (props) {
                Object.assign(err, props);
            }
            throw err;
        },
        [Symbol.for("Deno.customInspect")] () {
            return `MockContext {}`;
        },
        [Symbol.for("nodejs.util.inspect.custom")] (depth, options7, inspect) {
            if (depth < 0) {
                return options7.stylize(`[MockContext]`, "special");
            }
            const newOptions = Object.assign({}, options7, {
                depth: options7.depth === null ? null : options7.depth - 1
            });
            return `${options7.stylize("MockContext", "special")} ${inspect({}, newOptions)}`;
        }
    };
}
function createMockNext() {
    return async function next() {};
}
const mod12 = {
    createMockApp: createMockApp,
    mockContextState: mockContextState,
    createMockContext: createMockContext,
    createMockNext: createMockNext
};
const mod13 = {
    Application: Application,
    Context: Context,
    Cookies: Cookies,
    HttpServerNative: HttpServer,
    createHttpError: createHttpError,
    HttpError: HttpError,
    httpErrors: httpErrors,
    isHttpError: isHttpError,
    proxy: proxy,
    composeMiddleware: compose,
    FormDataReader: FormDataReader,
    ifRange: ifRange,
    MultiPartStream: MultiPartStream,
    parseRange: parseRange,
    Request: Request1,
    REDIRECT_BACK: REDIRECT_BACK,
    Response: Response,
    Router: Router,
    send: send,
    ServerSentEvent: ServerSentEvent,
    isErrorStatus: isErrorStatus,
    isRedirectStatus: isRedirectStatus,
    Status: Status,
    STATUS_TEXT: STATUS_TEXT,
    helpers: mod11,
    etag: mod10,
    testing: mod12
};
const random = (bytes)=>crypto.getRandomValues(new Uint8Array(bytes));
const urlAlphabet = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
const nanoid = (size = 21)=>{
    let id = "";
    const bytes = random(size);
    while(size--)id += urlAlphabet[bytes[size] & 63];
    return id;
};
function isHashedKeyAlgorithm(algorithm) {
    return typeof algorithm.hash?.name === "string";
}
function isEcKeyAlgorithm(algorithm) {
    return typeof algorithm.namedCurve === "string";
}
function verify(alg, key47) {
    if (alg === "none") {
        if (key47 !== null) throw new Error(`The alg '${alg}' does not allow a key.`);
        else return true;
    } else {
        if (!key47) throw new Error(`The alg '${alg}' demands a key.`);
        const keyAlgorithm = key47.algorithm;
        const algAlgorithm = getAlgorithm(alg);
        if (keyAlgorithm.name === algAlgorithm.name) {
            if (isHashedKeyAlgorithm(keyAlgorithm)) {
                return keyAlgorithm.hash.name === algAlgorithm.hash.name;
            } else if (isEcKeyAlgorithm(keyAlgorithm)) {
                return keyAlgorithm.namedCurve === algAlgorithm.namedCurve;
            }
        }
        return false;
    }
}
function getAlgorithm(alg) {
    switch(alg){
        case "HS256":
            return {
                hash: {
                    name: "SHA-256"
                },
                name: "HMAC"
            };
        case "HS384":
            return {
                hash: {
                    name: "SHA-384"
                },
                name: "HMAC"
            };
        case "HS512":
            return {
                hash: {
                    name: "SHA-512"
                },
                name: "HMAC"
            };
        case "PS256":
            return {
                hash: {
                    name: "SHA-256"
                },
                name: "RSA-PSS",
                saltLength: 256 >> 3
            };
        case "PS384":
            return {
                hash: {
                    name: "SHA-384"
                },
                name: "RSA-PSS",
                saltLength: 384 >> 3
            };
        case "PS512":
            return {
                hash: {
                    name: "SHA-512"
                },
                name: "RSA-PSS",
                saltLength: 512 >> 3
            };
        case "RS256":
            return {
                hash: {
                    name: "SHA-256"
                },
                name: "RSASSA-PKCS1-v1_5"
            };
        case "RS384":
            return {
                hash: {
                    name: "SHA-384"
                },
                name: "RSASSA-PKCS1-v1_5"
            };
        case "RS512":
            return {
                hash: {
                    name: "SHA-512"
                },
                name: "RSASSA-PKCS1-v1_5"
            };
        case "ES256":
            return {
                hash: {
                    name: "SHA-256"
                },
                name: "ECDSA",
                namedCurve: "P-256"
            };
        case "ES384":
            return {
                hash: {
                    name: "SHA-384"
                },
                name: "ECDSA",
                namedCurve: "P-384"
            };
        default:
            throw new Error(`The jwt's alg '${alg}' is not supported.`);
    }
}
function addPaddingToBase64url(base64url) {
    if (base64url.length % 4 === 2) return base64url + "==";
    if (base64url.length % 4 === 3) return base64url + "=";
    if (base64url.length % 4 === 1) {
        throw new TypeError("Illegal base64url string!");
    }
    return base64url;
}
function convertBase64urlToBase64(b64url) {
    if (!/^[-_A-Z0-9]*?={0,2}$/i.test(b64url)) {
        throw new TypeError("Failed to decode base64url: invalid character");
    }
    return addPaddingToBase64url(b64url).replace(/\-/g, "+").replace(/_/g, "/");
}
function convertBase64ToBase64url(b64) {
    return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function encode2(data27) {
    return convertBase64ToBase64url(encode1(data27));
}
function decode2(b64url) {
    return decode1(convertBase64urlToBase64(b64url));
}
const mod14 = {
    addPaddingToBase64url: addPaddingToBase64url,
    encode: encode2,
    decode: decode2
};
const encoder5 = new TextEncoder();
async function verify1(signature, key48, alg, signingInput) {
    return key48 === null ? signature.length === 0 : await crypto.subtle.verify(getAlgorithm(alg), key48, signature, encoder5.encode(signingInput));
}
const decoder3 = new TextDecoder();
function isExpired(exp, leeway) {
    return exp + leeway < Date.now() / 1000;
}
function isTooEarly(nbf, leeway) {
    return nbf - leeway > Date.now() / 1000;
}
function isObject(obj) {
    return obj !== null && typeof obj === "object" && Array.isArray(obj) === false;
}
function is3Tuple(arr) {
    return arr.length === 3;
}
function hasInvalidTimingClaims(...claimValues) {
    return claimValues.some((claimValue)=>claimValue !== undefined ? typeof claimValue !== "number" : false);
}
function isHeader(headerMaybe) {
    return isObject(headerMaybe) && typeof headerMaybe.alg === "string";
}
function decode3(jwt) {
    try {
        const arr = jwt.split(".").map(mod14.decode).map((uint8Array, index)=>index === 0 || index === 1 ? JSON.parse(decoder3.decode(uint8Array)) : uint8Array);
        if (is3Tuple(arr)) return arr;
        else throw new Error();
    } catch  {
        throw Error("The serialization of the jwt is invalid.");
    }
}
function validate([header, payload1, signature], { expLeeway =1 , nbfLeeway =1  } = {}) {
    if (isHeader(header)) {
        if (isObject(payload1)) {
            if (hasInvalidTimingClaims(payload1.exp, payload1.nbf)) {
                throw new Error(`The jwt has an invalid 'exp' or 'nbf' claim.`);
            }
            if (typeof payload1.exp === "number" && isExpired(payload1.exp, expLeeway)) {
                throw RangeError("The jwt is expired.");
            }
            if (typeof payload1.nbf === "number" && isTooEarly(payload1.nbf, nbfLeeway)) {
                throw RangeError("The jwt is used too early.");
            }
            return {
                header,
                payload: payload1,
                signature
            };
        } else {
            throw new Error(`The jwt claims set is not a JSON object.`);
        }
    } else {
        throw new Error(`The jwt's 'alg' header parameter value must be a string.`);
    }
}
async function verify2(jwt, key49, options8) {
    const { header , payload: payload2 , signature  } = validate(decode3(jwt), options8);
    if (verify(header.alg, key49)) {
        if (!await verify1(signature, key49, header.alg, jwt.slice(0, jwt.lastIndexOf(".")))) {
            throw new Error("The jwt's signature does not match the verification signature.");
        }
        return payload2;
    } else {
        throw new Error(`The jwt's alg '${header.alg}' does not match the key's algorithm.`);
    }
}
function createSigningInput(header, payload3) {
    return `${mod14.encode(encoder5.encode(JSON.stringify(header)))}.${mod14.encode(encoder5.encode(JSON.stringify(payload3)))}`;
}
async function create(alg, key50, signingInput) {
    return key50 === null ? "" : mod14.encode(new Uint8Array(await crypto.subtle.sign(getAlgorithm(alg), key50, encoder5.encode(signingInput))));
}
async function create1(header, payload4, key51) {
    if (verify(header.alg, key51)) {
        const signingInput = createSigningInput(header, payload4);
        const signature = await create(header.alg, key51, signingInput);
        return `${signingInput}.${signature}`;
    } else {
        throw new Error(`The jwt's alg '${header.alg}' does not match the key's algorithm.`);
    }
}
function getNumericDate(exp) {
    return Math.round((exp instanceof Date ? exp.getTime() : Date.now() + exp * 1000) / 1000);
}
const mod15 = {
    encoder: encoder5,
    decoder: decoder3,
    decode: decode3,
    validate: validate,
    verify: verify2,
    create: create1,
    getNumericDate: getNumericDate
};
class DenoStdInternalError2 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert3(expr, msg19 = "") {
    if (!expr) {
        throw new DenoStdInternalError2(msg19);
    }
}
function copy3(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const MIN_READ1 = 32 * 1024;
const MAX_SIZE1 = 2 ** 32 - 2;
class Buffer1 {
    #buf;
    #off = 0;
    constructor(ab){
        this.#buf = ab === undefined ? new Uint8Array(0) : new Uint8Array(ab);
    }
    bytes(options9 = {
        copy: true
    }) {
        if (options9.copy === false) return this.#buf.subarray(this.#off);
        return this.#buf.slice(this.#off);
    }
    empty() {
        return this.#buf.byteLength <= this.#off;
    }
    get length() {
        return this.#buf.byteLength - this.#off;
    }
    get capacity() {
        return this.#buf.buffer.byteLength;
    }
    truncate(n12) {
        if (n12 === 0) {
            this.reset();
            return;
        }
        if (n12 < 0 || n12 > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        this.#reslice(this.#off + n12);
    }
    reset() {
        this.#reslice(0);
        this.#off = 0;
    }
     #tryGrowByReslice(n13) {
        const l = this.#buf.byteLength;
        if (n13 <= this.capacity - l) {
            this.#reslice(l + n13);
            return l;
        }
        return -1;
    }
     #reslice(len8) {
        assert3(len8 <= this.#buf.buffer.byteLength);
        this.#buf = new Uint8Array(this.#buf.buffer, 0, len8);
    }
    readSync(p26) {
        if (this.empty()) {
            this.reset();
            if (p26.byteLength === 0) {
                return 0;
            }
            return null;
        }
        const nread = copy3(this.#buf.subarray(this.#off), p26);
        this.#off += nread;
        return nread;
    }
    read(p27) {
        const rr = this.readSync(p27);
        return Promise.resolve(rr);
    }
    writeSync(p28) {
        const m8 = this.#grow(p28.byteLength);
        return copy3(p28, this.#buf, m8);
    }
    write(p29) {
        const n1 = this.writeSync(p29);
        return Promise.resolve(n1);
    }
     #grow(n21) {
        const m = this.length;
        if (m === 0 && this.#off !== 0) {
            this.reset();
        }
        const i = this.#tryGrowByReslice(n21);
        if (i >= 0) {
            return i;
        }
        const c = this.capacity;
        if (n21 <= Math.floor(c / 2) - m) {
            copy3(this.#buf.subarray(this.#off), this.#buf);
        } else if (c + n21 > MAX_SIZE1) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
        } else {
            const buf = new Uint8Array(Math.min(2 * c + n21, MAX_SIZE1));
            copy3(this.#buf.subarray(this.#off), buf);
            this.#buf = buf;
        }
        this.#off = 0;
        this.#reslice(Math.min(m + n21, MAX_SIZE1));
        return m;
    }
    grow(n3) {
        if (n3 < 0) {
            throw Error("Buffer.grow: negative count");
        }
        const m9 = this.#grow(n3);
        this.#reslice(m9);
    }
    async readFrom(r8) {
        let n4 = 0;
        const tmp = new Uint8Array(MIN_READ1);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ1;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = await r8.read(buf);
            if (nread === null) {
                return n4;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n4 += nread;
        }
    }
    readFromSync(r9) {
        let n5 = 0;
        const tmp = new Uint8Array(MIN_READ1);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ1;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = r9.readSync(buf);
            if (nread === null) {
                return n5;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n5 += nread;
        }
    }
}
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE3 = 16;
const CR4 = "\r".charCodeAt(0);
const LF4 = "\n".charCodeAt(0);
class BufferFullError3 extends Error {
    name;
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
        this.name = "BufferFullError";
    }
    partial;
}
class PartialReadError2 extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader3 {
    buf;
    rd;
    r = 0;
    w = 0;
    eof = false;
    static create(r10, size = 4096) {
        return r10 instanceof BufReader3 ? r10 : new BufReader3(r10, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE3;
        }
        this._reset(new Uint8Array(size), rd);
    }
    size() {
        return this.buf.byteLength;
    }
    buffered() {
        return this.w - this.r;
    }
    async _fill() {
        if (this.r > 0) {
            this.buf.copyWithin(0, this.r, this.w);
            this.w -= this.r;
            this.r = 0;
        }
        if (this.w >= this.buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i74 = 100; i74 > 0; i74--){
            const rr = await this.rd.read(this.buf.subarray(this.w));
            if (rr === null) {
                this.eof = true;
                return;
            }
            assert3(rr >= 0, "negative read");
            this.w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    }
    reset(r11) {
        this._reset(this.buf, r11);
    }
    _reset(buf, rd) {
        this.buf = buf;
        this.rd = rd;
        this.eof = false;
    }
    async read(p30) {
        let rr = p30.byteLength;
        if (p30.byteLength === 0) return rr;
        if (this.r === this.w) {
            if (p30.byteLength >= this.buf.byteLength) {
                const rr = await this.rd.read(p30);
                const nread = rr ?? 0;
                assert3(nread >= 0, "negative read");
                return rr;
            }
            this.r = 0;
            this.w = 0;
            rr = await this.rd.read(this.buf);
            if (rr === 0 || rr === null) return rr;
            assert3(rr >= 0, "negative read");
            this.w += rr;
        }
        const copied = copy3(this.buf.subarray(this.r, this.w), p30, 0);
        this.r += copied;
        return copied;
    }
    async readFull(p31) {
        let bytesRead = 0;
        while(bytesRead < p31.length){
            try {
                const rr = await this.read(p31.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError2();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError2) {
                    err.partial = p31.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e20 = new PartialReadError2();
                    e20.partial = p31.subarray(0, bytesRead);
                    e20.stack = err.stack;
                    e20.message = err.message;
                    e20.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p31;
    }
    async readByte() {
        while(this.r === this.w){
            if (this.eof) return null;
            await this._fill();
        }
        const c14 = this.buf[this.r];
        this.r++;
        return c14;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer2 = await this.readSlice(delim.charCodeAt(0));
        if (buffer2 === null) return null;
        return new TextDecoder().decode(buffer2);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF4);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError2) {
                partial = err.partial;
                assert3(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError3)) {
                throw err;
            }
            partial = err.partial;
            if (!this.eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR4) {
                assert3(this.r > 0, "bufio: tried to rewind past start of buffer");
                this.r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF4) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR4) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s14 = 0;
        let slice;
        while(true){
            let i75 = this.buf.subarray(this.r + s14, this.w).indexOf(delim);
            if (i75 >= 0) {
                i75 += s14;
                slice = this.buf.subarray(this.r, this.r + i75 + 1);
                this.r += i75 + 1;
                break;
            }
            if (this.eof) {
                if (this.r === this.w) {
                    return null;
                }
                slice = this.buf.subarray(this.r, this.w);
                this.r = this.w;
                break;
            }
            if (this.buffered() >= this.buf.byteLength) {
                this.r = this.w;
                const oldbuf = this.buf;
                const newbuf = this.buf.slice(0);
                this.buf = newbuf;
                throw new BufferFullError3(oldbuf);
            }
            s14 = this.w - this.r;
            try {
                await this._fill();
            } catch (err) {
                if (err instanceof PartialReadError2) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e21 = new PartialReadError2();
                    e21.partial = slice;
                    e21.stack = err.stack;
                    e21.message = err.message;
                    e21.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.w - this.r;
        while(avail < n6 && avail < this.buf.byteLength && !this.eof){
            try {
                await this._fill();
            } catch (err) {
                if (err instanceof PartialReadError2) {
                    err.partial = this.buf.subarray(this.r, this.w);
                } else if (err instanceof Error) {
                    const e22 = new PartialReadError2();
                    e22.partial = this.buf.subarray(this.r, this.w);
                    e22.stack = err.stack;
                    e22.message = err.message;
                    e22.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.w - this.r;
        }
        if (avail === 0 && this.eof) {
            return null;
        } else if (avail < n6 && this.eof) {
            return this.buf.subarray(this.r, this.r + avail);
        } else if (avail < n6) {
            throw new BufferFullError3(this.buf.subarray(this.r, this.w));
        }
        return this.buf.subarray(this.r, this.r + n6);
    }
}
class AbstractBufBase2 {
    buf;
    usedBufferBytes = 0;
    err = null;
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter2 extends AbstractBufBase2 {
    static create(writer, size = 4096) {
        return writer instanceof BufWriter2 ? writer : new BufWriter2(writer, size);
    }
    constructor(writer, size = 4096){
        super();
        this.writer = writer;
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        this.buf = new Uint8Array(size);
    }
    reset(w6) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.writer = w6;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p32 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p32.length){
                nwritten += await this.writer.write(p32.subarray(nwritten));
            }
        } catch (e23) {
            if (e23 instanceof Error) {
                this.err = e23;
            }
            throw e23;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data28) {
        if (this.err !== null) throw this.err;
        if (data28.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data28.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.writer.write(data28);
                } catch (e24) {
                    if (e24 instanceof Error) {
                        this.err = e24;
                    }
                    throw e24;
                }
            } else {
                numBytesWritten = copy3(data28, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data28 = data28.subarray(numBytesWritten);
        }
        numBytesWritten = copy3(data28, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
    writer;
}
class BufWriterSync2 extends AbstractBufBase2 {
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync2 ? writer : new BufWriterSync2(writer, size);
    }
    constructor(writer, size = 4096){
        super();
        this.writer = writer;
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        this.buf = new Uint8Array(size);
    }
    reset(w7) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.writer = w7;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p33 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p33.length){
                nwritten += this.writer.writeSync(p33.subarray(nwritten));
            }
        } catch (e25) {
            if (e25 instanceof Error) {
                this.err = e25;
            }
            throw e25;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data29) {
        if (this.err !== null) throw this.err;
        if (data29.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data29.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.writer.writeSync(data29);
                } catch (e26) {
                    if (e26 instanceof Error) {
                        this.err = e26;
                    }
                    throw e26;
                }
            } else {
                numBytesWritten = copy3(data29, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data29 = data29.subarray(numBytesWritten);
        }
        numBytesWritten = copy3(data29, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
    writer;
}
function readableStreamFromIterable(iterable) {
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    return new ReadableStream({
        async pull (controller) {
            const { value: value65 , done  } = await iterator.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value65);
            }
        },
        async cancel (reason) {
            if (typeof iterator.throw == "function") {
                try {
                    await iterator.throw(reason);
                } catch  {}
            }
        }
    });
}
class TransformChunkSizes extends TransformStream {
    constructor(outChunkSize){
        const buffer3 = new Buffer1();
        buffer3.grow(outChunkSize);
        const outChunk = new Uint8Array(outChunkSize);
        super({
            start () {},
            async transform (chunk, controller) {
                buffer3.write(chunk);
                while(buffer3.length >= outChunkSize){
                    const readFromBuffer = await buffer3.read(outChunk);
                    if (readFromBuffer !== outChunkSize) {
                        throw new Error(`Unexpectedly read ${readFromBuffer} bytes from transform buffer when trying to read ${outChunkSize} bytes.`);
                    }
                    controller.enqueue(outChunk);
                }
            },
            flush (controller) {
                if (buffer3.length) {
                    controller.enqueue(buffer3.bytes());
                }
            }
        });
    }
}
function parse9(xml) {
    xml = xml.trim();
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");
    return document();
    function document() {
        return {
            declaration: declaration(),
            root: tag()
        };
    }
    function declaration() {
        const m10 = match(/^<\?xml\s*/);
        if (!m10) return;
        const node = {
            attributes: {}
        };
        while(!(eos() || is("?>"))){
            const attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        return node;
    }
    function tag() {
        const m11 = match(/^<([\w-:.]+)\s*/);
        if (!m11) return;
        const node = {
            name: m11[1],
            attributes: {},
            children: []
        };
        while(!(eos() || is(">") || is("?>") || is("/>"))){
            const attr = attribute();
            if (!attr) return node;
            node.attributes[attr.name] = attr.value;
        }
        if (match(/^\s*\/>\s*/)) {
            return node;
        }
        match(/\??>\s*/);
        node.content = content();
        let child;
        while(child = tag()){
            node.children.push(child);
        }
        match(/^<\/[\w-:.]+>\s*/);
        return node;
    }
    function content() {
        const m12 = match(/^([^<]*)/);
        if (m12) return m12[1];
        return "";
    }
    function attribute() {
        const m13 = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m13) return;
        return {
            name: m13[1],
            value: strip(m13[2])
        };
    }
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, "");
    }
    function match(re) {
        const m14 = xml.match(re);
        if (!m14) return;
        xml = xml.slice(m14[0].length);
        return m14;
    }
    function eos() {
        return 0 == xml.length;
    }
    function is(prefix) {
        return 0 == xml.indexOf(prefix);
    }
}
class DenoS3LiteClientError extends Error {
    constructor(message){
        super(message);
    }
}
class InvalidArgumentError extends DenoS3LiteClientError {
}
class InvalidEndpointError extends DenoS3LiteClientError {
}
class InvalidBucketNameError extends DenoS3LiteClientError {
}
class InvalidObjectNameError extends DenoS3LiteClientError {
}
class AccessKeyRequiredError extends DenoS3LiteClientError {
}
class SecretKeyRequiredError extends DenoS3LiteClientError {
}
class ServerError extends DenoS3LiteClientError {
    statusCode;
    code;
    key;
    bucketName;
    resource;
    region;
    constructor(statusCode, code35, message, otherData = {}){
        super(message);
        this.statusCode = statusCode;
        this.code = code35;
        this.key = otherData.key;
        this.bucketName = otherData.bucketName;
        this.resource = otherData.resource;
        this.region = otherData.region;
    }
}
async function parseServerError(response) {
    try {
        const xmlParsed = parse9(await response.text());
        const errorRoot = xmlParsed.root;
        if (errorRoot?.name !== "Error") {
            throw new Error("Invalid root, expected <Error>");
        }
        const code36 = errorRoot.children.find((c15)=>c15.name === "Code")?.content ?? "UnknownErrorCode";
        const message = errorRoot.children.find((c16)=>c16.name === "Message")?.content ?? "The error message could not be determined.";
        const key52 = errorRoot.children.find((c17)=>c17.name === "Key")?.content;
        const bucketName = errorRoot.children.find((c18)=>c18.name === "BucketName")?.content;
        const resource = errorRoot.children.find((c19)=>c19.name === "Resource")?.content;
        const region = errorRoot.children.find((c20)=>c20.name === "Region")?.content;
        return new ServerError(response.status, code36, message, {
            key: key52,
            bucketName,
            resource,
            region
        });
    } catch  {
        return new ServerError(response.status, "UnrecognizedError", `Error: Unexpected response code ${response.status} ${response.statusText}. Unable to parse response as XML.`);
    }
}
const mod16 = {
    DenoS3LiteClientError: DenoS3LiteClientError,
    InvalidArgumentError: InvalidArgumentError,
    InvalidEndpointError: InvalidEndpointError,
    InvalidBucketNameError: InvalidBucketNameError,
    InvalidObjectNameError: InvalidObjectNameError,
    AccessKeyRequiredError: AccessKeyRequiredError,
    SecretKeyRequiredError: SecretKeyRequiredError,
    ServerError: ServerError,
    parseServerError: parseServerError
};
function isValidPort(port2) {
    if (typeof port2 !== "number" || isNaN(port2)) {
        return false;
    }
    if (port2 <= 0) {
        return false;
    }
    return port2 >= 1 && port2 <= 65535;
}
function isValidBucketName(bucket) {
    if (typeof bucket !== "string") {
        return false;
    }
    if (bucket.length < 3 || bucket.length > 63) {
        return false;
    }
    if (bucket.indexOf("..") > -1) {
        return false;
    }
    if (bucket.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
        return false;
    }
    if (bucket.match(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)) {
        return true;
    }
    return false;
}
function isValidObjectName(objectName) {
    if (!isValidPrefix(objectName)) return false;
    if (objectName.length === 0) return false;
    return true;
}
function isValidPrefix(prefix) {
    if (typeof prefix !== "string") return false;
    if (prefix.length > 1024) return false;
    return true;
}
function bin2hex(binary) {
    return Array.from(binary).map((b15)=>b15.toString(16).padStart(2, "0")).join("");
}
function sanitizeETag(etag = "") {
    const replaceChars = {
        '"': "",
        "&quot;": "",
        "&#34;": "",
        "&QUOT;": "",
        "&#x00022": ""
    };
    return etag.replace(/^("|&quot;|&#34;)|("|&quot;|&#34;)$/g, (m15)=>replaceChars[m15]);
}
function getVersionId(headers) {
    return headers.get("x-amz-version-id") ?? null;
}
function makeDateLong(date) {
    date = date || new Date();
    const dateStr = date.toISOString();
    return dateStr.substr(0, 4) + dateStr.substr(5, 2) + dateStr.substr(8, 5) + dateStr.substr(14, 2) + dateStr.substr(17, 2) + "Z";
}
function makeDateShort(date) {
    date = date || new Date();
    const dateStr = date.toISOString();
    return dateStr.substr(0, 4) + dateStr.substr(5, 2) + dateStr.substr(8, 2);
}
function getScope(region, date) {
    return `${makeDateShort(date)}/${region}/s3/aws4_request`;
}
async function sha256digestHex(data30) {
    if (!(data30 instanceof Uint8Array)) {
        data30 = new TextEncoder().encode(data30);
    }
    return bin2hex(new Uint8Array(await crypto.subtle.digest("SHA-256", data30)));
}
class ObjectUploader extends WritableStream {
    getResult;
    constructor({ client , bucketName , objectName , partSize , metadata  }){
        let result;
        let nextPartNumber = 1;
        let uploadId;
        const etags = [];
        const partsPromises = [];
        super({
            start () {},
            async write (chunk, _controller) {
                const method4 = "PUT";
                const partNumber = nextPartNumber++;
                try {
                    if (partNumber == 1 && chunk.length < partSize) {
                        const response = await client.makeRequest({
                            method: method4,
                            headers: new Headers({
                                ...metadata,
                                "Content-Length": String(chunk.length)
                            }),
                            bucketName,
                            objectName,
                            payload: chunk
                        });
                        result = {
                            etag: sanitizeETag(response.headers.get("etag") ?? undefined),
                            versionId: getVersionId(response.headers)
                        };
                        return;
                    }
                    if (partNumber === 1) {
                        uploadId = (await initiateNewMultipartUpload({
                            client,
                            bucketName,
                            objectName,
                            metadata
                        })).uploadId;
                    }
                    const partPromise = client.makeRequest({
                        method: method4,
                        query: {
                            partNumber: partNumber.toString(),
                            uploadId
                        },
                        headers: new Headers({
                            "Content-Length": String(chunk.length)
                        }),
                        bucketName: bucketName,
                        objectName: objectName,
                        payload: chunk
                    });
                    partPromise.then((response)=>{
                        let etag = response.headers.get("etag") ?? "";
                        if (etag) {
                            etag = etag.replace(/^"/, "").replace(/"$/, "");
                        }
                        etags.push({
                            part: partNumber,
                            etag
                        });
                    });
                    partsPromises.push(partPromise);
                } catch (err) {
                    throw err;
                }
            },
            async close () {
                if (result) {} else if (uploadId) {
                    await Promise.all(partsPromises);
                    etags.sort((a13, b16)=>a13.part > b16.part ? 1 : -1);
                    result = await completeMultipartUpload({
                        client,
                        bucketName,
                        objectName,
                        uploadId,
                        etags
                    });
                } else {
                    throw new Error("Stream was closed without uploading any data.");
                }
            }
        });
        this.getResult = ()=>{
            if (result === undefined) {
                throw new Error("Result is not ready. await the stream first.");
            }
            return result;
        };
    }
}
async function initiateNewMultipartUpload(options10) {
    const method5 = "POST";
    const headers = new Headers(options10.metadata);
    const query = "uploads";
    const response = await options10.client.makeRequest({
        method: method5,
        bucketName: options10.bucketName,
        objectName: options10.objectName,
        query,
        headers,
        returnBody: true
    });
    const responseText = await response.text();
    const root = parse9(responseText).root;
    if (!root || root.name !== "InitiateMultipartUploadResult") {
        throw new Error(`Unexpected response: ${responseText}`);
    }
    const uploadId = root.children.find((c21)=>c21.name === "UploadId")?.content;
    if (!uploadId) {
        throw new Error(`Unable to get UploadId from response: ${responseText}`);
    }
    return {
        uploadId
    };
}
async function completeMultipartUpload({ client , bucketName , objectName , uploadId , etags  }) {
    const payload5 = `
    <CompleteMultipartUpload xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        ${etags.map((et1)=>`  <Part><PartNumber>${et1.part}</PartNumber><ETag>${et1.etag}</ETag></Part>`).join("\n")}
    </CompleteMultipartUpload>
  `;
    const response = await client.makeRequest({
        method: "POST",
        bucketName,
        objectName,
        query: `uploadId=${encodeURIComponent(uploadId)}`,
        payload: new TextEncoder().encode(payload5),
        returnBody: true
    });
    const responseText = await response.text();
    const root = parse9(responseText).root;
    if (!root || root.name !== "CompleteMultipartUploadResult") {
        throw new Error(`Unexpected response: ${responseText}`);
    }
    const etagRaw = root.children.find((c22)=>c22.name === "ETag")?.content;
    if (!etagRaw) throw new Error(`Unable to get ETag from response: ${responseText}`);
    const versionId = getVersionId(response.headers);
    return {
        etag: sanitizeETag(etagRaw),
        versionId
    };
}
const signV4Algorithm = "AWS4-HMAC-SHA256";
async function signV4(request6) {
    if (!request6.accessKey) {
        throw new AccessKeyRequiredError("accessKey is required for signing");
    }
    if (!request6.secretKey) {
        throw new SecretKeyRequiredError("secretKey is required for signing");
    }
    const sha256sum = request6.headers.get("x-amz-content-sha256");
    if (sha256sum === null) {
        throw new Error("Internal S3 client error - expected x-amz-content-sha256 header, but it's missing.");
    }
    const signedHeaders = getHeadersToSign(request6.headers);
    const canonicalRequest = getCanonicalRequest(request6.method, request6.path, request6.headers, signedHeaders, sha256sum);
    const stringToSign = await getStringToSign(canonicalRequest, request6.date, request6.region);
    const signingKey = await getSigningKey(request6.date, request6.region, request6.secretKey);
    const credential = getCredential(request6.accessKey, request6.region, request6.date);
    const signature = bin2hex(await sha256hmac(signingKey, stringToSign)).toLowerCase();
    return `${signV4Algorithm} Credential=${credential}, SignedHeaders=${signedHeaders.join(";").toLowerCase()}, Signature=${signature}`;
}
function getHeadersToSign(headers) {
    const ignoredHeaders = [
        "authorization",
        "content-length",
        "content-type",
        "user-agent", 
    ];
    const headersToSign = [];
    for (const key53 of headers.keys()){
        if (ignoredHeaders.includes(key53.toLowerCase())) {
            continue;
        }
        headersToSign.push(key53);
    }
    headersToSign.sort();
    return headersToSign;
}
function getCanonicalRequest(method6, path79, headers, headersToSign, payloadHash) {
    const headersArray = headersToSign.reduce((acc, headerKey)=>{
        const val = `${headers.get(headerKey)}`.replace(/ +/g, " ");
        acc.push(`${headerKey.toLowerCase()}:${val}`);
        return acc;
    }, []);
    const requestResource = path79.split("?")[0];
    let requestQuery = path79.split("?")[1];
    if (requestQuery) {
        requestQuery = requestQuery.split("&").sort().map((element)=>element.indexOf("=") === -1 ? element + "=" : element).join("&");
    } else {
        requestQuery = "";
    }
    const canonical = [];
    canonical.push(method6.toUpperCase());
    canonical.push(requestResource);
    canonical.push(requestQuery);
    canonical.push(headersArray.join("\n") + "\n");
    canonical.push(headersToSign.join(";").toLowerCase());
    canonical.push(payloadHash);
    return canonical.join("\n");
}
async function getStringToSign(canonicalRequest, requestDate, region) {
    const hash = await sha256digestHex(canonicalRequest);
    const scope = getScope(region, requestDate);
    const stringToSign = [];
    stringToSign.push(signV4Algorithm);
    stringToSign.push(makeDateLong(requestDate));
    stringToSign.push(scope);
    stringToSign.push(hash);
    return stringToSign.join("\n");
}
async function getSigningKey(date, region, secretKey) {
    const dateLine = makeDateShort(date);
    const hmac1 = await sha256hmac("AWS4" + secretKey, dateLine);
    const hmac2 = await sha256hmac(hmac1, region);
    const hmac3 = await sha256hmac(hmac2, "s3");
    return await sha256hmac(hmac3, "aws4_request");
}
function getCredential(accessKey, region, requestDate) {
    return `${accessKey}/${getScope(region, requestDate)}`;
}
async function sha256hmac(secretKey, data31) {
    const enc = new TextEncoder();
    const keyObject = await crypto.subtle.importKey("raw", secretKey instanceof Uint8Array ? secretKey : enc.encode(secretKey), {
        name: "HMAC",
        hash: {
            name: "SHA-256"
        }
    }, false, [
        "sign",
        "verify"
    ]);
    const signature = await crypto.subtle.sign("HMAC", keyObject, data31 instanceof Uint8Array ? data31 : enc.encode(data31));
    return new Uint8Array(signature);
}
const metadataKeys = [
    "Content-Type",
    "Cache-Control",
    "Content-Disposition",
    "Content-Encoding",
    "Content-Language",
    "Expires",
    "x-amz-acl",
    "x-amz-grant-full-control",
    "x-amz-grant-read",
    "x-amz-grant-read-acp",
    "x-amz-grant-write-acp",
    "x-amz-server-side-encryption",
    "x-amz-storage-class",
    "x-amz-website-redirect-location",
    "x-amz-server-side-encryption-customer-algorithm",
    "x-amz-server-side-encryption-customer-key",
    "x-amz-server-side-encryption-customer-key-MD5",
    "x-amz-server-side-encryption-aws-kms-key-id",
    "x-amz-server-side-encryption-context",
    "x-amz-server-side-encryption-bucket-key-enabled",
    "x-amz-request-payer",
    "x-amz-tagging",
    "x-amz-object-lock-mode",
    "x-amz-object-lock-retain-until-date",
    "x-amz-object-lock-legal-hold",
    "x-amz-expected-bucket-owner", 
];
const minimumPartSize = 5 * 1024 * 1024;
const maximumPartSize = 5 * 1024 * 1024 * 1024;
const maxObjectSize = 5 * 1024 * 1024 * 1024 * 1024;
class Client {
    host;
    port;
    protocol;
    accessKey;
    #secretKey;
    defaultBucket;
    region;
    userAgent = "deno-s3-lite-client";
    pathStyle;
    constructor(params){
        if (params.useSSL === undefined) {
            params.useSSL = true;
        }
        if (typeof params.endPoint !== "string" || params.endPoint.length === 0 || params.endPoint.indexOf("/") !== -1) {
            throw new InvalidEndpointError(`Invalid endPoint : ${params.endPoint}`);
        }
        if (params.port !== undefined && !isValidPort(params.port)) {
            throw new InvalidArgumentError(`Invalid port : ${params.port}`);
        }
        this.port = params.port ?? (params.useSSL ? 443 : 80);
        this.host = params.endPoint.toLowerCase() + (params.port ? `:${params.port}` : "");
        this.protocol = params.useSSL ? "https:" : "http:";
        this.accessKey = params.accessKey;
        this.#secretKey = params.secretKey;
        this.pathStyle = params.pathStyle ?? true;
        this.defaultBucket = params.bucket;
        this.region = params.region;
    }
    getBucketName(options11) {
        const bucketName = options11?.bucketName ?? this.defaultBucket;
        if (bucketName === undefined || !isValidBucketName(bucketName)) {
            throw new InvalidBucketNameError(`Invalid bucket name: ${bucketName}`);
        }
        return bucketName;
    }
    async makeRequest({ method: method7 , payload: payload6 , ...options12 }) {
        const date = new Date();
        const bucketName = this.getBucketName(options12);
        const headers = options12.headers ?? new Headers();
        const host = this.pathStyle ? this.host : `${bucketName}.${this.host}`;
        const queryAsString = typeof options12.query === "object" ? new URLSearchParams(options12.query).toString().replace("+", "%20") : options12.query;
        const path80 = (this.pathStyle ? `/${bucketName}/${options12.objectName}` : `/${options12.objectName}`) + (queryAsString ? `?${queryAsString}` : "");
        const statusCode = options12.statusCode ?? 200;
        if (method7 === "POST" || method7 === "PUT" || method7 === "DELETE") {
            if (payload6 === undefined) {
                payload6 = new Uint8Array();
            } else if (typeof payload6 === "string") {
                payload6 = new TextEncoder().encode(payload6);
            }
            headers.set("Content-Length", String(payload6.length));
        } else if (payload6) {
            throw new Error(`Unexpected payload on ${method7} request.`);
        }
        const sha256sum = await sha256digestHex(payload6 ?? new Uint8Array());
        headers.set("host", host);
        headers.set("x-amz-date", makeDateLong(date));
        headers.set("x-amz-content-sha256", sha256sum);
        headers.set("authorization", await signV4({
            headers,
            method: method7,
            path: path80,
            accessKey: this.accessKey,
            secretKey: this.#secretKey,
            region: this.region,
            date
        }));
        const fullUrl = `${this.protocol}//${host}${path80}`;
        const response = await fetch(fullUrl, {
            method: method7,
            headers,
            body: payload6
        });
        if (response.status !== statusCode) {
            if (response.status >= 400) {
                const error11 = await parseServerError(response);
                throw error11;
            } else {
                throw new ServerError(response.status, "UnexpectedStatusCode", `Unexpected response code from the server (expected ${statusCode}, got ${response.status} ${response.statusText}).`);
            }
        }
        if (!options12.returnBody) {
            await response.body?.getReader().read();
        }
        return response;
    }
    async deleteObject(objectName, options13 = {}) {
        const bucketName = this.getBucketName(options13);
        if (!isValidObjectName(objectName)) {
            throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
        }
        const query = options13.versionId ? {
            versionId: options13.versionId
        } : {};
        const headers = new Headers();
        if (options13.governanceBypass) {
            headers.set("X-Amz-Bypass-Governance-Retention", "true");
        }
        await this.makeRequest({
            method: "DELETE",
            bucketName,
            objectName,
            headers,
            query,
            statusCode: 204
        });
    }
    async exists(objectName, options14) {
        try {
            await this.statObject(objectName, options14);
            return true;
        } catch (err) {
            if (err instanceof ServerError && err.statusCode === 404) {
                return false;
            }
            throw err;
        }
    }
    getObject(objectName, options15) {
        return this.getPartialObject(objectName, {
            ...options15,
            offset: 0,
            length: 0
        });
    }
    async getPartialObject(objectName, { offset , length , ...options16 }) {
        const bucketName = this.getBucketName(options16);
        if (!isValidObjectName(objectName)) {
            throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
        }
        const headers = new Headers();
        let statusCode = 200;
        if (offset || length) {
            let range = "";
            if (offset) {
                range = `bytes=${+offset}-`;
            } else {
                range = "bytes=0-";
                offset = 0;
            }
            if (length) {
                range += `${+length + offset - 1}`;
            }
            headers.set("Range", range);
            statusCode = 206;
        }
        const query = options16.versionId ? {
            versionId: options16.versionId
        } : undefined;
        return await this.makeRequest({
            method: "GET",
            bucketName,
            objectName,
            headers,
            query,
            statusCode,
            returnBody: true
        });
    }
    async *listObjects(options17 = {}) {
        for await (const result of this.listObjectsGrouped({
            ...options17,
            delimiter: ""
        })){
            if (result.type === "Object") {
                yield result;
            } else {
                throw new Error(`Unexpected result from listObjectsGrouped(): ${result}`);
            }
        }
    }
    async *listObjectsGrouped(options18) {
        const bucketName = this.getBucketName(options18);
        let continuationToken = "";
        const pageSize = options18.pageSize ?? 1_000;
        if (pageSize < 1 || pageSize > 1_000) {
            throw new InvalidArgumentError("pageSize must be between 1 and 1,000.");
        }
        let resultCount = 0;
        while(true){
            const maxKeys = options18.maxResults ? Math.min(pageSize, options18.maxResults - resultCount) : pageSize;
            if (maxKeys === 0) {
                return;
            }
            const pageResponse = await this.makeRequest({
                method: "GET",
                bucketName,
                objectName: "",
                query: {
                    "list-type": "2",
                    prefix: options18.prefix ?? "",
                    delimiter: options18.delimiter,
                    "max-keys": String(maxKeys),
                    ...continuationToken ? {
                        "continuation-token": continuationToken
                    } : {}
                },
                returnBody: true
            });
            const responseText = await pageResponse.text();
            const root = parse9(responseText).root;
            if (!root || root.name !== "ListBucketResult") {
                throw new Error(`Unexpected response: ${responseText}`);
            }
            const commonPrefixesElement = root.children.find((c23)=>c23.name === "CommonPrefixes");
            const toYield = [];
            if (commonPrefixesElement) {
                for (const prefixElement of commonPrefixesElement.children){
                    toYield.push({
                        type: "CommonPrefix",
                        prefix: prefixElement.content ?? ""
                    });
                    resultCount++;
                }
            }
            for (const objectElement of root.children.filter((c24)=>c24.name === "Contents")){
                toYield.push({
                    type: "Object",
                    key: objectElement.children.find((c25)=>c25.name === "Key")?.content ?? "",
                    etag: sanitizeETag(objectElement.children.find((c26)=>c26.name === "ETag")?.content ?? ""),
                    size: parseInt(objectElement.children.find((c27)=>c27.name === "Size")?.content ?? "", 10),
                    lastModified: new Date(objectElement.children.find((c28)=>c28.name === "LastModified")?.content ?? "invalid")
                });
                resultCount++;
            }
            toYield.sort((a14, b17)=>{
                const aStr = a14.type === "Object" ? a14.key : a14.prefix;
                const bStr = b17.type === "Object" ? b17.key : b17.prefix;
                return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
            });
            for (const entry of toYield){
                yield entry;
            }
            const isTruncated = root.children.find((c29)=>c29.name === "IsTruncated")?.content === "true";
            if (isTruncated) {
                const nextContinuationToken = root.children.find((c30)=>c30.name === "NextContinuationToken")?.content;
                if (!nextContinuationToken) {
                    throw new Error("Unexpectedly missing continuation token, but server said there are more results.");
                }
                continuationToken = nextContinuationToken;
            } else {
                return;
            }
        }
    }
    async putObject(objectName, streamOrData, options19) {
        const bucketName = this.getBucketName(options19);
        if (!isValidObjectName(objectName)) {
            throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
        }
        let size;
        let stream;
        if (typeof streamOrData === "string") {
            const binaryData = new TextEncoder().encode(streamOrData);
            stream = readableStreamFromIterable([
                binaryData
            ]);
            size = binaryData.length;
        } else if (streamOrData instanceof Uint8Array) {
            stream = readableStreamFromIterable([
                streamOrData
            ]);
            size = streamOrData.byteLength;
        } else if (streamOrData instanceof ReadableStream) {
            stream = streamOrData;
        } else {
            throw new InvalidArgumentError(`Invalid stream/data type provided.`);
        }
        if (options19?.size !== undefined) {
            if (size !== undefined && options19?.size !== size) {
                throw new InvalidArgumentError(`size was specified (${options19.size}) but doesn't match auto-detected size (${size}).`);
            }
            if (typeof size !== "number" || size < 0 || isNaN(size)) {
                throw new InvalidArgumentError(`invalid size specified: ${options19.size}`);
            } else {
                size = options19.size;
            }
        }
        const partSize = options19?.partSize ?? this.calculatePartSize(size);
        if (partSize < minimumPartSize) {
            throw new InvalidArgumentError(`Part size should be greater than 5MB`);
        } else if (partSize > maximumPartSize) {
            throw new InvalidArgumentError(`Part size should be less than 6MB`);
        }
        const chunker = new TransformChunkSizes(partSize);
        const uploader = new ObjectUploader({
            client: this,
            bucketName,
            objectName,
            partSize,
            metadata: options19?.metadata ?? {}
        });
        await stream.pipeThrough(chunker).pipeTo(uploader);
        return uploader.getResult();
    }
    calculatePartSize(size) {
        if (size === undefined) {
            size = maxObjectSize;
        }
        if (size > maxObjectSize) {
            throw new TypeError(`size should not be more than ${maxObjectSize}`);
        }
        let partSize = 64 * 1024 * 1024;
        while(true){
            if (partSize * 10_000 > size) {
                return partSize;
            }
            partSize += 16 * 1024 * 1024;
        }
    }
    async statObject(objectName, options20) {
        const bucketName = this.getBucketName(options20);
        if (!isValidObjectName(objectName)) {
            throw new InvalidObjectNameError(`Invalid object name: ${objectName}`);
        }
        const query = {};
        if (options20?.versionId) {
            query.versionId = options20.versionId;
        }
        const response = await this.makeRequest({
            method: "HEAD",
            bucketName,
            objectName,
            query
        });
        const metadata = {};
        for (const header of metadataKeys){
            if (response.headers.has(header)) {
                metadata[header] = response.headers.get(header);
            }
        }
        response.headers.forEach((_value, key54)=>{
            if (key54.startsWith("x-amz-meta-")) {
                metadata[key54] = response.headers.get(key54);
            }
        });
        return {
            type: "Object",
            key: objectName,
            size: parseInt(response.headers.get("content-length") ?? "", 10),
            metadata,
            lastModified: new Date(response.headers.get("Last-Modified") ?? "error: missing last modified"),
            versionId: response.headers.get("x-amz-version-id") || null,
            etag: sanitizeETag(response.headers.get("ETag") ?? "")
        };
    }
}
const mod17 = {
    S3Client: Client,
    S3Errors: mod16
};
function _typeof(obj1) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj1);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    Object.defineProperty(subClass, "prototype", {
        writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o1) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o1);
}
function _setPrototypeOf(o3, p1) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o4, p2) {
        o4.__proto__ = p2;
        return o4;
    };
    return _setPrototypeOf(o3, p1);
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
    } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var uintToBuf = function uintToBuf(num) {
    var buf = new ArrayBuffer(8);
    var arr = new Uint8Array(buf);
    var acc = num;
    for(var i2 = 7; i2 >= 0; i2--){
        if (acc === 0) break;
        arr[i2] = acc & 255;
        acc -= arr[i2];
        acc /= 256;
    }
    return buf;
};
var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function n(t1, n1, e1, r1) {
    var i3, s1, o5;
    var h1 = n1 || [
        0
    ], u1 = (e1 = e1 || 0) >>> 3, w1 = -1 === r1 ? 3 : 0;
    for(i3 = 0; i3 < t1.length; i3 += 1){
        o5 = i3 + u1, s1 = o5 >>> 2, h1.length <= s1 && h1.push(0), h1[s1] |= t1[i3] << 8 * (w1 + r1 * (o5 % 4));
    }
    return {
        value: h1,
        binLen: 8 * t1.length + e1
    };
}
function e(e2, r2, i4) {
    switch(r2){
        case "UTF8":
        case "UTF16BE":
        case "UTF16LE":
            break;
        default:
            throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE");
    }
    switch(e2){
        case "HEX":
            return function(t2, n22, e3) {
                return function(t3, n3, e4, r3) {
                    var i5, s2, o6, h2;
                    if (0 != t3.length % 2) throw new Error("String of HEX type must be in byte increments");
                    var u2 = n3 || [
                        0
                    ], w2 = (e4 = e4 || 0) >>> 3, c1 = -1 === r3 ? 3 : 0;
                    for(i5 = 0; i5 < t3.length; i5 += 2){
                        if (s2 = parseInt(t3.substr(i5, 2), 16), isNaN(s2)) throw new Error("String of HEX type contains invalid characters");
                        for(h2 = (i5 >>> 1) + w2, o6 = h2 >>> 2; u2.length <= o6;){
                            u2.push(0);
                        }
                        u2[o6] |= s2 << 8 * (c1 + r3 * (h2 % 4));
                    }
                    return {
                        value: u2,
                        binLen: 4 * t3.length + e4
                    };
                }(t2, n22, e3, i4);
            };
        case "TEXT":
            return function(t4, n4, e5) {
                return function(t5, n5, e6, r4, i6) {
                    var s3, o7, h3, u3, w3, c2, f1, a1, l1 = 0;
                    var A1 = e6 || [
                        0
                    ], E1 = (r4 = r4 || 0) >>> 3;
                    if ("UTF8" === n5) for(f1 = -1 === i6 ? 3 : 0, h3 = 0; h3 < t5.length; h3 += 1){
                        for(s3 = t5.charCodeAt(h3), o7 = [], 128 > s3 ? o7.push(s3) : 2048 > s3 ? (o7.push(192 | s3 >>> 6), o7.push(128 | 63 & s3)) : 55296 > s3 || 57344 <= s3 ? o7.push(224 | s3 >>> 12, 128 | s3 >>> 6 & 63, 128 | 63 & s3) : (h3 += 1, s3 = 65536 + ((1023 & s3) << 10 | 1023 & t5.charCodeAt(h3)), o7.push(240 | s3 >>> 18, 128 | s3 >>> 12 & 63, 128 | s3 >>> 6 & 63, 128 | 63 & s3)), u3 = 0; u3 < o7.length; u3 += 1){
                            for(c2 = l1 + E1, w3 = c2 >>> 2; A1.length <= w3;){
                                A1.push(0);
                            }
                            A1[w3] |= o7[u3] << 8 * (f1 + i6 * (c2 % 4)), l1 += 1;
                        }
                    }
                    else for(f1 = -1 === i6 ? 2 : 0, a1 = "UTF16LE" === n5 && 1 !== i6 || "UTF16LE" !== n5 && 1 === i6, h3 = 0; h3 < t5.length; h3 += 1){
                        for(s3 = t5.charCodeAt(h3), !0 === a1 && (u3 = 255 & s3, s3 = u3 << 8 | s3 >>> 8), c2 = l1 + E1, w3 = c2 >>> 2; A1.length <= w3;){
                            A1.push(0);
                        }
                        A1[w3] |= s3 << 8 * (f1 + i6 * (c2 % 4)), l1 += 2;
                    }
                    return {
                        value: A1,
                        binLen: 8 * l1 + r4
                    };
                }(t4, r2, n4, e5, i4);
            };
        case "B64":
            return function(n6, e7, r5) {
                return function(n7, e8, r6, i7) {
                    var s4, o8, h4, u4, w4, c3, f2, a2 = 0;
                    var l2 = e8 || [
                        0
                    ], A2 = (r6 = r6 || 0) >>> 3, E2 = -1 === i7 ? 3 : 0, H1 = n7.indexOf("=");
                    if (-1 === n7.search(/^[a-zA-Z0-9=+/]+$/)) throw new Error("Invalid character in base-64 string");
                    if (n7 = n7.replace(/=/g, ""), -1 !== H1 && H1 < n7.length) throw new Error("Invalid '=' found in base-64 string");
                    for(o8 = 0; o8 < n7.length; o8 += 4){
                        for(w4 = n7.substr(o8, 4), u4 = 0, h4 = 0; h4 < w4.length; h4 += 1){
                            s4 = t.indexOf(w4.charAt(h4)), u4 |= s4 << 18 - 6 * h4;
                        }
                        for(h4 = 0; h4 < w4.length - 1; h4 += 1){
                            for(f2 = a2 + A2, c3 = f2 >>> 2; l2.length <= c3;){
                                l2.push(0);
                            }
                            l2[c3] |= (u4 >>> 16 - 8 * h4 & 255) << 8 * (E2 + i7 * (f2 % 4)), a2 += 1;
                        }
                    }
                    return {
                        value: l2,
                        binLen: 8 * a2 + r6
                    };
                }(n6, e7, r5, i4);
            };
        case "BYTES":
            return function(t6, n8, e9) {
                return function(t7, n9, e10, r7) {
                    var i8, s5, o9, h5;
                    var u5 = n9 || [
                        0
                    ], w5 = (e10 = e10 || 0) >>> 3, c4 = -1 === r7 ? 3 : 0;
                    for(s5 = 0; s5 < t7.length; s5 += 1){
                        i8 = t7.charCodeAt(s5), h5 = s5 + w5, o9 = h5 >>> 2, u5.length <= o9 && u5.push(0), u5[o9] |= i8 << 8 * (c4 + r7 * (h5 % 4));
                    }
                    return {
                        value: u5,
                        binLen: 8 * t7.length + e10
                    };
                }(t6, n8, e9, i4);
            };
        case "ARRAYBUFFER":
            try {
                new ArrayBuffer(0);
            } catch (t8) {
                throw new Error("ARRAYBUFFER not supported by this environment");
            }
            return function(t9, e11, r8) {
                return function(t10, e12, r9, i9) {
                    return n(new Uint8Array(t10), e12, r9, i9);
                }(t9, e11, r8, i4);
            };
        case "UINT8ARRAY":
            try {
                new Uint8Array(0);
            } catch (t11) {
                throw new Error("UINT8ARRAY not supported by this environment");
            }
            return function(t12, e13, r10) {
                return n(t12, e13, r10, i4);
            };
        default:
            throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
    }
}
function r(n10, e14, r11, i10) {
    switch(n10){
        case "HEX":
            return function(t13) {
                return function(t14, n11, e15, r12) {
                    var i11, s6, o10 = "";
                    var h6 = n11 / 8, u6 = -1 === e15 ? 3 : 0;
                    for(i11 = 0; i11 < h6; i11 += 1){
                        s6 = t14[i11 >>> 2] >>> 8 * (u6 + e15 * (i11 % 4)), o10 += "0123456789abcdef".charAt(s6 >>> 4 & 15) + "0123456789abcdef".charAt(15 & s6);
                    }
                    return r12.outputUpper ? o10.toUpperCase() : o10;
                }(t13, e14, r11, i10);
            };
        case "B64":
            return function(n12) {
                return function(n13, e16, r13, i12) {
                    var s7, o11, h7, u7, w6, c5 = "";
                    var f3 = e16 / 8, a3 = -1 === r13 ? 3 : 0;
                    for(s7 = 0; s7 < f3; s7 += 3){
                        for(u7 = s7 + 1 < f3 ? n13[s7 + 1 >>> 2] : 0, w6 = s7 + 2 < f3 ? n13[s7 + 2 >>> 2] : 0, h7 = (n13[s7 >>> 2] >>> 8 * (a3 + r13 * (s7 % 4)) & 255) << 16 | (u7 >>> 8 * (a3 + r13 * ((s7 + 1) % 4)) & 255) << 8 | w6 >>> 8 * (a3 + r13 * ((s7 + 2) % 4)) & 255, o11 = 0; o11 < 4; o11 += 1){
                            c5 += 8 * s7 + 6 * o11 <= e16 ? t.charAt(h7 >>> 6 * (3 - o11) & 63) : i12.b64Pad;
                        }
                    }
                    return c5;
                }(n12, e14, r11, i10);
            };
        case "BYTES":
            return function(t15) {
                return function(t16, n14, e17) {
                    var r14, i13, s8 = "";
                    var o12 = n14 / 8, h8 = -1 === e17 ? 3 : 0;
                    for(r14 = 0; r14 < o12; r14 += 1){
                        i13 = t16[r14 >>> 2] >>> 8 * (h8 + e17 * (r14 % 4)) & 255, s8 += String.fromCharCode(i13);
                    }
                    return s8;
                }(t15, e14, r11);
            };
        case "ARRAYBUFFER":
            try {
                new ArrayBuffer(0);
            } catch (t17) {
                throw new Error("ARRAYBUFFER not supported by this environment");
            }
            return function(t18) {
                return function(t19, n15, e18) {
                    var r15;
                    var i14 = n15 / 8, s9 = new ArrayBuffer(i14), o13 = new Uint8Array(s9), h9 = -1 === e18 ? 3 : 0;
                    for(r15 = 0; r15 < i14; r15 += 1){
                        o13[r15] = t19[r15 >>> 2] >>> 8 * (h9 + e18 * (r15 % 4)) & 255;
                    }
                    return s9;
                }(t18, e14, r11);
            };
        case "UINT8ARRAY":
            try {
                new Uint8Array(0);
            } catch (t20) {
                throw new Error("UINT8ARRAY not supported by this environment");
            }
            return function(t21) {
                return function(t22, n161, e19) {
                    var r16;
                    var i15 = n161 / 8, s10 = -1 === e19 ? 3 : 0, o14 = new Uint8Array(i15);
                    for(r16 = 0; r16 < i15; r16 += 1){
                        o14[r16] = t22[r16 >>> 2] >>> 8 * (s10 + e19 * (r16 % 4)) & 255;
                    }
                    return o14;
                }(t21, e14, r11);
            };
        default:
            throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY");
    }
}
var i = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
], s = [
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
], o = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
], h = "Chosen SHA variant is not supported";
function u(t23, n17) {
    var e20, r17;
    var i16 = t23.binLen >>> 3, s11 = n17.binLen >>> 3, o15 = i16 << 3, h10 = 4 - i16 << 3;
    if (i16 % 4 != 0) {
        for(e20 = 0; e20 < s11; e20 += 4){
            r17 = i16 + e20 >>> 2, t23.value[r17] |= n17.value[e20 >>> 2] << o15, t23.value.push(0), t23.value[r17 + 1] |= n17.value[e20 >>> 2] >>> h10;
        }
        return (t23.value.length << 2) - 4 >= s11 + i16 && t23.value.pop(), {
            value: t23.value,
            binLen: t23.binLen + n17.binLen
        };
    }
    return {
        value: t23.value.concat(n17.value),
        binLen: t23.binLen + n17.binLen
    };
}
function w(t24) {
    var n18 = {
        outputUpper: !1,
        b64Pad: "=",
        outputLen: -1
    }, e21 = t24 || {}, r18 = "Output length must be a multiple of 8";
    if (n18.outputUpper = e21.outputUpper || !1, e21.b64Pad && (n18.b64Pad = e21.b64Pad), e21.outputLen) {
        if (e21.outputLen % 8 != 0) throw new Error(r18);
        n18.outputLen = e21.outputLen;
    } else if (e21.shakeLen) {
        if (e21.shakeLen % 8 != 0) throw new Error(r18);
        n18.outputLen = e21.shakeLen;
    }
    if ("boolean" != typeof n18.outputUpper) throw new Error("Invalid outputUpper formatting option");
    if ("string" != typeof n18.b64Pad) throw new Error("Invalid b64Pad formatting option");
    return n18;
}
function c(t25, n19, r19, i17) {
    var s12 = t25 + " must include a value and format";
    if (!n19) {
        if (!i17) throw new Error(s12);
        return i17;
    }
    if (void 0 === n19.value || !n19.format) throw new Error(s12);
    return e(n19.format, n19.encoding || "UTF8", r19)(n19.value);
}
var f = function() {
    function f4(t26, n20, e22) {
        _classCallCheck(this, f4);
        var r20 = e22 || {};
        if (this.t = n20, this.i = r20.encoding || "UTF8", this.numRounds = r20.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
        this.s = t26, this.o = [], this.h = 0, this.u = !1, this.l = 0, this.A = !1, this.H = [], this.S = [];
    }
    _createClass(f4, [
        {
            key: "update",
            value: function update(t27) {
                var n21, e23 = 0;
                var r21 = this.p >>> 5, i18 = this.m(t27, this.o, this.h), s13 = i18.binLen, o16 = i18.value, h11 = s13 >>> 5;
                for(n21 = 0; n21 < h11; n21 += r21){
                    e23 + this.p <= s13 && (this.C = this.R(o16.slice(n21, n21 + r21), this.C), e23 += this.p);
                }
                this.l += e23, this.o = o16.slice(e23 >>> 5), this.h = s13 % this.p, this.u = !0;
            }
        },
        {
            key: "getHash",
            value: function getHash(t28, n22) {
                var e24, i19, s14 = this.U;
                var o17 = w(n22);
                if (this.v) {
                    if (-1 === o17.outputLen) throw new Error("Output length must be specified in options");
                    s14 = o17.outputLen;
                }
                var h12 = r(t28, s14, this.K, o17);
                if (this.A && this.T) return h12(this.T(o17));
                for(i19 = this.F(this.o.slice(), this.h, this.l, this.g(this.C), s14), e24 = 1; e24 < this.numRounds; e24 += 1){
                    this.v && s14 % 32 != 0 && (i19[i19.length - 1] &= 16777215 >>> 24 - s14 % 32), i19 = this.F(i19, s14, 0, this.B(this.s), s14);
                }
                return h12(i19);
            }
        },
        {
            key: "setHMACKey",
            value: function setHMACKey(t29, n23, r22) {
                if (!this.L) throw new Error("Variant does not support HMAC");
                if (this.u) throw new Error("Cannot set MAC key after calling update");
                var i20 = e(n23, (r22 || {}).encoding || "UTF8", this.K);
                this.M(i20(t29));
            }
        },
        {
            key: "M",
            value: function M(t30) {
                var n24 = this.p >>> 3, e25 = n24 / 4 - 1;
                var r23;
                if (1 !== this.numRounds) throw new Error("Cannot set numRounds with MAC");
                if (this.A) throw new Error("MAC key already set");
                for(n24 < t30.binLen / 8 && (t30.value = this.F(t30.value, t30.binLen, 0, this.B(this.s), this.U)); t30.value.length <= e25;){
                    t30.value.push(0);
                }
                for(r23 = 0; r23 <= e25; r23 += 1){
                    this.H[r23] = 909522486 ^ t30.value[r23], this.S[r23] = 1549556828 ^ t30.value[r23];
                }
                this.C = this.R(this.H, this.C), this.l = this.p, this.A = !0;
            }
        },
        {
            key: "getHMAC",
            value: function getHMAC(t31, n25) {
                var e26 = w(n25);
                return r(t31, this.U, this.K, e26)(this.k());
            }
        },
        {
            key: "k",
            value: function k() {
                var t32;
                if (!this.A) throw new Error("Cannot call getHMAC without first setting MAC key");
                var n26 = this.F(this.o.slice(), this.h, this.l, this.g(this.C), this.U);
                return t32 = this.R(this.S, this.B(this.s)), t32 = this.F(n26, this.U, this.p, t32, this.U), t32;
            }
        }
    ]);
    return f4;
}();
function a(t33, n27) {
    return t33 << n27 | t33 >>> 32 - n27;
}
function l(t34, n28) {
    return t34 >>> n28 | t34 << 32 - n28;
}
function A(t35, n29) {
    return t35 >>> n29;
}
function E(t36, n30, e27) {
    return t36 ^ n30 ^ e27;
}
function H(t37, n31, e28) {
    return t37 & n31 ^ ~t37 & e28;
}
function S(t38, n321, e29) {
    return t38 & n321 ^ t38 & e29 ^ n321 & e29;
}
function b(t39) {
    return l(t39, 2) ^ l(t39, 13) ^ l(t39, 22);
}
function p(t40, n33) {
    var e30 = (65535 & t40) + (65535 & n33);
    return (65535 & (t40 >>> 16) + (n33 >>> 16) + (e30 >>> 16)) << 16 | 65535 & e30;
}
function d(t41, n34, e31, r24) {
    var i21 = (65535 & t41) + (65535 & n34) + (65535 & e31) + (65535 & r24);
    return (65535 & (t41 >>> 16) + (n34 >>> 16) + (e31 >>> 16) + (r24 >>> 16) + (i21 >>> 16)) << 16 | 65535 & i21;
}
function m(t42, n35, e32, r25, i22) {
    var s15 = (65535 & t42) + (65535 & n35) + (65535 & e32) + (65535 & r25) + (65535 & i22);
    return (65535 & (t42 >>> 16) + (n35 >>> 16) + (e32 >>> 16) + (r25 >>> 16) + (i22 >>> 16) + (s15 >>> 16)) << 16 | 65535 & s15;
}
function C(t43) {
    return l(t43, 7) ^ l(t43, 18) ^ A(t43, 3);
}
function y(t44) {
    return l(t44, 6) ^ l(t44, 11) ^ l(t44, 25);
}
function R(t) {
    return [
        1732584193,
        4023233417,
        2562383102,
        271733878,
        3285377520
    ];
}
function U(t45, n36) {
    var e33, r26, i23, s16, o18, h13, u8;
    var w7 = [];
    for(e33 = n36[0], r26 = n36[1], i23 = n36[2], s16 = n36[3], o18 = n36[4], u8 = 0; u8 < 80; u8 += 1){
        w7[u8] = u8 < 16 ? t45[u8] : a(w7[u8 - 3] ^ w7[u8 - 8] ^ w7[u8 - 14] ^ w7[u8 - 16], 1), h13 = u8 < 20 ? m(a(e33, 5), H(r26, i23, s16), o18, 1518500249, w7[u8]) : u8 < 40 ? m(a(e33, 5), E(r26, i23, s16), o18, 1859775393, w7[u8]) : u8 < 60 ? m(a(e33, 5), S(r26, i23, s16), o18, 2400959708, w7[u8]) : m(a(e33, 5), E(r26, i23, s16), o18, 3395469782, w7[u8]), o18 = s16, s16 = i23, i23 = a(r26, 30), r26 = e33, e33 = h13;
    }
    return n36[0] = p(e33, n36[0]), n36[1] = p(r26, n36[1]), n36[2] = p(i23, n36[2]), n36[3] = p(s16, n36[3]), n36[4] = p(o18, n36[4]), n36;
}
function v(t46, n37, e34, r27) {
    var i24;
    var s17 = 15 + (n37 + 65 >>> 9 << 4), o19 = n37 + e34;
    for(; t46.length <= s17;){
        t46.push(0);
    }
    for(t46[n37 >>> 5] |= 128 << 24 - n37 % 32, t46[s17] = 4294967295 & o19, t46[s17 - 1] = o19 / 4294967296 | 0, i24 = 0; i24 < t46.length; i24 += 16){
        r27 = U(t46.slice(i24, i24 + 16), r27);
    }
    return r27;
}
var K = function(_f) {
    _inherits(K1, _f);
    var _super = _createSuper(K1);
    function K1(t47, n38, r28) {
        var _this;
        _classCallCheck(this, K1);
        if ("SHA-1" !== t47) throw new Error(h);
        _this = _super.call(this, t47, n38, r28);
        var i25 = r28 || {};
        _this.L = !0, _this.T = _this.k, _this.K = -1, _this.m = e(_this.t, _this.i, _this.K), _this.R = U, _this.g = function(t48) {
            return t48.slice();
        }, _this.B = R, _this.F = v, _this.C = [
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520
        ], _this.p = 512, _this.U = 160, _this.v = !1, i25.hmacKey && _this.M(c("hmacKey", i25.hmacKey, _this.K));
        return _this;
    }
    return _createClass(K1);
}(f);
function T(t49) {
    var n39;
    return n39 = "SHA-224" == t49 ? s.slice() : o.slice(), n39;
}
function F(t50, n40) {
    var e35, r29, s18, o20, h14, u9, w8, c6, f5, a4, E3;
    var R1 = [];
    for(e35 = n40[0], r29 = n40[1], s18 = n40[2], o20 = n40[3], h14 = n40[4], u9 = n40[5], w8 = n40[6], c6 = n40[7], E3 = 0; E3 < 64; E3 += 1){
        R1[E3] = E3 < 16 ? t50[E3] : d(l(U1 = R1[E3 - 2], 17) ^ l(U1, 19) ^ A(U1, 10), R1[E3 - 7], C(R1[E3 - 15]), R1[E3 - 16]), f5 = m(c6, y(h14), H(h14, u9, w8), i[E3], R1[E3]), a4 = p(b(e35), S(e35, r29, s18)), c6 = w8, w8 = u9, u9 = h14, h14 = p(o20, f5), o20 = s18, s18 = r29, r29 = e35, e35 = p(f5, a4);
    }
    var U1;
    return n40[0] = p(e35, n40[0]), n40[1] = p(r29, n40[1]), n40[2] = p(s18, n40[2]), n40[3] = p(o20, n40[3]), n40[4] = p(h14, n40[4]), n40[5] = p(u9, n40[5]), n40[6] = p(w8, n40[6]), n40[7] = p(c6, n40[7]), n40;
}
var g = function(_f2) {
    _inherits(g1, _f2);
    var _super2 = _createSuper(g1);
    function g1(t51, n41, r30) {
        var _this2;
        _classCallCheck(this, g1);
        if ("SHA-224" !== t51 && "SHA-256" !== t51) throw new Error(h);
        _this2 = _super2.call(this, t51, n41, r30);
        var i26 = r30 || {};
        _this2.T = _this2.k, _this2.L = !0, _this2.K = -1, _this2.m = e(_this2.t, _this2.i, _this2.K), _this2.R = F, _this2.g = function(t52) {
            return t52.slice();
        }, _this2.B = T, _this2.F = function(n42, e36, r31, i27) {
            return function(t53, n43, e37, r32, i28) {
                var s19, o21;
                var h15 = 15 + (n43 + 65 >>> 9 << 4), u10 = n43 + e37;
                for(; t53.length <= h15;){
                    t53.push(0);
                }
                for(t53[n43 >>> 5] |= 128 << 24 - n43 % 32, t53[h15] = 4294967295 & u10, t53[h15 - 1] = u10 / 4294967296 | 0, s19 = 0; s19 < t53.length; s19 += 16){
                    r32 = F(t53.slice(s19, s19 + 16), r32);
                }
                return o21 = "SHA-224" === i28 ? [
                    r32[0],
                    r32[1],
                    r32[2],
                    r32[3],
                    r32[4],
                    r32[5],
                    r32[6]
                ] : r32, o21;
            }(n42, e36, r31, i27, t51);
        }, _this2.C = T(t51), _this2.p = 512, _this2.U = "SHA-224" === t51 ? 224 : 256, _this2.v = !1, i26.hmacKey && _this2.M(c("hmacKey", i26.hmacKey, _this2.K));
        return _this2;
    }
    return _createClass(g1);
}(f);
var B = _createClass(function B1(t54, n44) {
    _classCallCheck(this, B1);
    this.Y = t54, this.N = n44;
});
function L(t55, n45) {
    var e38;
    return n45 > 32 ? (e38 = 64 - n45, new B(t55.N << n45 | t55.Y >>> e38, t55.Y << n45 | t55.N >>> e38)) : 0 !== n45 ? (e38 = 32 - n45, new B(t55.Y << n45 | t55.N >>> e38, t55.N << n45 | t55.Y >>> e38)) : t55;
}
function M(t56, n46) {
    var e39;
    return n46 < 32 ? (e39 = 32 - n46, new B(t56.Y >>> n46 | t56.N << e39, t56.N >>> n46 | t56.Y << e39)) : (e39 = 64 - n46, new B(t56.N >>> n46 | t56.Y << e39, t56.Y >>> n46 | t56.N << e39));
}
function k(t57, n47) {
    return new B(t57.Y >>> n47, t57.N >>> n47 | t57.Y << 32 - n47);
}
function Y(t58, n48, e40) {
    return new B(t58.Y & n48.Y ^ t58.Y & e40.Y ^ n48.Y & e40.Y, t58.N & n48.N ^ t58.N & e40.N ^ n48.N & e40.N);
}
function N(t59) {
    var n49 = M(t59, 28), e41 = M(t59, 34), r33 = M(t59, 39);
    return new B(n49.Y ^ e41.Y ^ r33.Y, n49.N ^ e41.N ^ r33.N);
}
function I(t60, n50) {
    var e42, r34;
    e42 = (65535 & t60.N) + (65535 & n50.N), r34 = (t60.N >>> 16) + (n50.N >>> 16) + (e42 >>> 16);
    var i29 = (65535 & r34) << 16 | 65535 & e42;
    e42 = (65535 & t60.Y) + (65535 & n50.Y) + (r34 >>> 16), r34 = (t60.Y >>> 16) + (n50.Y >>> 16) + (e42 >>> 16);
    return new B((65535 & r34) << 16 | 65535 & e42, i29);
}
function X(t61, n51, e43, r35) {
    var i30, s20;
    i30 = (65535 & t61.N) + (65535 & n51.N) + (65535 & e43.N) + (65535 & r35.N), s20 = (t61.N >>> 16) + (n51.N >>> 16) + (e43.N >>> 16) + (r35.N >>> 16) + (i30 >>> 16);
    var o22 = (65535 & s20) << 16 | 65535 & i30;
    i30 = (65535 & t61.Y) + (65535 & n51.Y) + (65535 & e43.Y) + (65535 & r35.Y) + (s20 >>> 16), s20 = (t61.Y >>> 16) + (n51.Y >>> 16) + (e43.Y >>> 16) + (r35.Y >>> 16) + (i30 >>> 16);
    return new B((65535 & s20) << 16 | 65535 & i30, o22);
}
function z(t62, n52, e44, r36, i31) {
    var s21, o23;
    s21 = (65535 & t62.N) + (65535 & n52.N) + (65535 & e44.N) + (65535 & r36.N) + (65535 & i31.N), o23 = (t62.N >>> 16) + (n52.N >>> 16) + (e44.N >>> 16) + (r36.N >>> 16) + (i31.N >>> 16) + (s21 >>> 16);
    var h16 = (65535 & o23) << 16 | 65535 & s21;
    s21 = (65535 & t62.Y) + (65535 & n52.Y) + (65535 & e44.Y) + (65535 & r36.Y) + (65535 & i31.Y) + (o23 >>> 16), o23 = (t62.Y >>> 16) + (n52.Y >>> 16) + (e44.Y >>> 16) + (r36.Y >>> 16) + (i31.Y >>> 16) + (s21 >>> 16);
    return new B((65535 & o23) << 16 | 65535 & s21, h16);
}
function x(t63, n53) {
    return new B(t63.Y ^ n53.Y, t63.N ^ n53.N);
}
function _(t64) {
    var n54 = M(t64, 19), e45 = M(t64, 61), r37 = k(t64, 6);
    return new B(n54.Y ^ e45.Y ^ r37.Y, n54.N ^ e45.N ^ r37.N);
}
function O(t65) {
    var n55 = M(t65, 1), e46 = M(t65, 8), r38 = k(t65, 7);
    return new B(n55.Y ^ e46.Y ^ r38.Y, n55.N ^ e46.N ^ r38.N);
}
function P(t66) {
    var n56 = M(t66, 14), e47 = M(t66, 18), r39 = M(t66, 41);
    return new B(n56.Y ^ e47.Y ^ r39.Y, n56.N ^ e47.N ^ r39.N);
}
var V = [
    new B(i[0], 3609767458),
    new B(i[1], 602891725),
    new B(i[2], 3964484399),
    new B(i[3], 2173295548),
    new B(i[4], 4081628472),
    new B(i[5], 3053834265),
    new B(i[6], 2937671579),
    new B(i[7], 3664609560),
    new B(i[8], 2734883394),
    new B(i[9], 1164996542),
    new B(i[10], 1323610764),
    new B(i[11], 3590304994),
    new B(i[12], 4068182383),
    new B(i[13], 991336113),
    new B(i[14], 633803317),
    new B(i[15], 3479774868),
    new B(i[16], 2666613458),
    new B(i[17], 944711139),
    new B(i[18], 2341262773),
    new B(i[19], 2007800933),
    new B(i[20], 1495990901),
    new B(i[21], 1856431235),
    new B(i[22], 3175218132),
    new B(i[23], 2198950837),
    new B(i[24], 3999719339),
    new B(i[25], 766784016),
    new B(i[26], 2566594879),
    new B(i[27], 3203337956),
    new B(i[28], 1034457026),
    new B(i[29], 2466948901),
    new B(i[30], 3758326383),
    new B(i[31], 168717936),
    new B(i[32], 1188179964),
    new B(i[33], 1546045734),
    new B(i[34], 1522805485),
    new B(i[35], 2643833823),
    new B(i[36], 2343527390),
    new B(i[37], 1014477480),
    new B(i[38], 1206759142),
    new B(i[39], 344077627),
    new B(i[40], 1290863460),
    new B(i[41], 3158454273),
    new B(i[42], 3505952657),
    new B(i[43], 106217008),
    new B(i[44], 3606008344),
    new B(i[45], 1432725776),
    new B(i[46], 1467031594),
    new B(i[47], 851169720),
    new B(i[48], 3100823752),
    new B(i[49], 1363258195),
    new B(i[50], 3750685593),
    new B(i[51], 3785050280),
    new B(i[52], 3318307427),
    new B(i[53], 3812723403),
    new B(i[54], 2003034995),
    new B(i[55], 3602036899),
    new B(i[56], 1575990012),
    new B(i[57], 1125592928),
    new B(i[58], 2716904306),
    new B(i[59], 442776044),
    new B(i[60], 593698344),
    new B(i[61], 3733110249),
    new B(i[62], 2999351573),
    new B(i[63], 3815920427),
    new B(3391569614, 3928383900),
    new B(3515267271, 566280711),
    new B(3940187606, 3454069534),
    new B(4118630271, 4000239992),
    new B(116418474, 1914138554),
    new B(174292421, 2731055270),
    new B(289380356, 3203993006),
    new B(460393269, 320620315),
    new B(685471733, 587496836),
    new B(852142971, 1086792851),
    new B(1017036298, 365543100),
    new B(1126000580, 2618297676),
    new B(1288033470, 3409855158),
    new B(1501505948, 4234509866),
    new B(1607167915, 987167468),
    new B(1816402316, 1246189591)
];
function Z(t67) {
    return "SHA-384" === t67 ? [
        new B(3418070365, s[0]),
        new B(1654270250, s[1]),
        new B(2438529370, s[2]),
        new B(355462360, s[3]),
        new B(1731405415, s[4]),
        new B(41048885895, s[5]),
        new B(3675008525, s[6]),
        new B(1203062813, s[7])
    ] : [
        new B(o[0], 4089235720),
        new B(o[1], 2227873595),
        new B(o[2], 4271175723),
        new B(o[3], 1595750129),
        new B(o[4], 2917565137),
        new B(o[5], 725511199),
        new B(o[6], 4215389547),
        new B(o[7], 327033209)
    ];
}
function j(t68, n57) {
    var e48, r40, i32, s22, o24, h17, u11, w9, c7, f6, a5, l3;
    var A3 = [];
    for(e48 = n57[0], r40 = n57[1], i32 = n57[2], s22 = n57[3], o24 = n57[4], h17 = n57[5], u11 = n57[6], w9 = n57[7], a5 = 0; a5 < 80; a5 += 1){
        a5 < 16 ? (l3 = 2 * a5, A3[a5] = new B(t68[l3], t68[l3 + 1])) : A3[a5] = X(_(A3[a5 - 2]), A3[a5 - 7], O(A3[a5 - 15]), A3[a5 - 16]), c7 = z(w9, P(o24), (H2 = h17, S1 = u11, new B((E4 = o24).Y & H2.Y ^ ~E4.Y & S1.Y, E4.N & H2.N ^ ~E4.N & S1.N)), V[a5], A3[a5]), f6 = I(N(e48), Y(e48, r40, i32)), w9 = u11, u11 = h17, h17 = o24, o24 = I(s22, c7), s22 = i32, i32 = r40, r40 = e48, e48 = I(c7, f6);
    }
    var E4, H2, S1;
    return n57[0] = I(e48, n57[0]), n57[1] = I(r40, n57[1]), n57[2] = I(i32, n57[2]), n57[3] = I(s22, n57[3]), n57[4] = I(o24, n57[4]), n57[5] = I(h17, n57[5]), n57[6] = I(u11, n57[6]), n57[7] = I(w9, n57[7]), n57;
}
var q = function(_f3) {
    _inherits(q1, _f3);
    var _super3 = _createSuper(q1);
    function q1(t69, n58, r41) {
        var _this3;
        _classCallCheck(this, q1);
        if ("SHA-384" !== t69 && "SHA-512" !== t69) throw new Error(h);
        _this3 = _super3.call(this, t69, n58, r41);
        var i33 = r41 || {};
        _this3.T = _this3.k, _this3.L = !0, _this3.K = -1, _this3.m = e(_this3.t, _this3.i, _this3.K), _this3.R = j, _this3.g = function(t70) {
            return t70.slice();
        }, _this3.B = Z, _this3.F = function(n59, e49, r42, i34) {
            return function(t71, n60, e50, r43, i35) {
                var s23, o25;
                var h18 = 31 + (n60 + 129 >>> 10 << 5), u12 = n60 + e50;
                for(; t71.length <= h18;){
                    t71.push(0);
                }
                for(t71[n60 >>> 5] |= 128 << 24 - n60 % 32, t71[h18] = 4294967295 & u12, t71[h18 - 1] = u12 / 4294967296 | 0, s23 = 0; s23 < t71.length; s23 += 32){
                    r43 = j(t71.slice(s23, s23 + 32), r43);
                }
                return o25 = "SHA-384" === i35 ? [
                    (r43 = r43)[0].Y,
                    r43[0].N,
                    r43[1].Y,
                    r43[1].N,
                    r43[2].Y,
                    r43[2].N,
                    r43[3].Y,
                    r43[3].N,
                    r43[4].Y,
                    r43[4].N,
                    r43[5].Y,
                    r43[5].N
                ] : [
                    r43[0].Y,
                    r43[0].N,
                    r43[1].Y,
                    r43[1].N,
                    r43[2].Y,
                    r43[2].N,
                    r43[3].Y,
                    r43[3].N,
                    r43[4].Y,
                    r43[4].N,
                    r43[5].Y,
                    r43[5].N,
                    r43[6].Y,
                    r43[6].N,
                    r43[7].Y,
                    r43[7].N
                ], o25;
            }(n59, e49, r42, i34, t69);
        }, _this3.C = Z(t69), _this3.p = 1024, _this3.U = "SHA-384" === t69 ? 384 : 512, _this3.v = !1, i33.hmacKey && _this3.M(c("hmacKey", i33.hmacKey, _this3.K));
        return _this3;
    }
    return _createClass(q1);
}(f);
var D = [
    new B(0, 1),
    new B(0, 32898),
    new B(2147483648, 32906),
    new B(2147483648, 2147516416),
    new B(0, 32907),
    new B(0, 2147483649),
    new B(2147483648, 2147516545),
    new B(2147483648, 32777),
    new B(0, 138),
    new B(0, 136),
    new B(0, 2147516425),
    new B(0, 2147483658),
    new B(0, 2147516555),
    new B(2147483648, 139),
    new B(2147483648, 32905),
    new B(2147483648, 32771),
    new B(2147483648, 32770),
    new B(2147483648, 128),
    new B(0, 32778),
    new B(2147483648, 2147483658),
    new B(2147483648, 2147516545),
    new B(2147483648, 32896),
    new B(0, 2147483649),
    new B(2147483648, 2147516424)
], G = [
    [
        0,
        36,
        3,
        41,
        18
    ],
    [
        1,
        44,
        10,
        45,
        2
    ],
    [
        62,
        6,
        43,
        15,
        61
    ],
    [
        28,
        55,
        25,
        21,
        56
    ],
    [
        27,
        20,
        39,
        8,
        14
    ]
];
function J(t) {
    var n61;
    var e51 = [];
    for(n61 = 0; n61 < 5; n61 += 1){
        e51[n61] = [
            new B(0, 0),
            new B(0, 0),
            new B(0, 0),
            new B(0, 0),
            new B(0, 0)
        ];
    }
    return e51;
}
function Q(t72) {
    var n62;
    var e52 = [];
    for(n62 = 0; n62 < 5; n62 += 1){
        e52[n62] = t72[n62].slice();
    }
    return e52;
}
function W(t73, n63) {
    var e53, r44, i36, s24;
    var o26 = [], h19 = [];
    if (null !== t73) for(r44 = 0; r44 < t73.length; r44 += 2){
        n63[(r44 >>> 1) % 5][(r44 >>> 1) / 5 | 0] = x(n63[(r44 >>> 1) % 5][(r44 >>> 1) / 5 | 0], new B(t73[r44 + 1], t73[r44]));
    }
    for(e53 = 0; e53 < 24; e53 += 1){
        for(s24 = J(), r44 = 0; r44 < 5; r44 += 1){
            o26[r44] = (u13 = n63[r44][0], w10 = n63[r44][1], c8 = n63[r44][2], f7 = n63[r44][3], a6 = n63[r44][4], new B(u13.Y ^ w10.Y ^ c8.Y ^ f7.Y ^ a6.Y, u13.N ^ w10.N ^ c8.N ^ f7.N ^ a6.N));
        }
        for(r44 = 0; r44 < 5; r44 += 1){
            h19[r44] = x(o26[(r44 + 4) % 5], L(o26[(r44 + 1) % 5], 1));
        }
        for(r44 = 0; r44 < 5; r44 += 1){
            for(i36 = 0; i36 < 5; i36 += 1){
                n63[r44][i36] = x(n63[r44][i36], h19[r44]);
            }
        }
        for(r44 = 0; r44 < 5; r44 += 1){
            for(i36 = 0; i36 < 5; i36 += 1){
                s24[i36][(2 * r44 + 3 * i36) % 5] = L(n63[r44][i36], G[r44][i36]);
            }
        }
        for(r44 = 0; r44 < 5; r44 += 1){
            for(i36 = 0; i36 < 5; i36 += 1){
                n63[r44][i36] = x(s24[r44][i36], new B(~s24[(r44 + 1) % 5][i36].Y & s24[(r44 + 2) % 5][i36].Y, ~s24[(r44 + 1) % 5][i36].N & s24[(r44 + 2) % 5][i36].N));
            }
        }
        n63[0][0] = x(n63[0][0], D[e53]);
    }
    var u13, w10, c8, f7, a6;
    return n63;
}
function $(t74) {
    var n64, e54, r45 = 0;
    var i37 = [
        0,
        0
    ], s25 = [
        4294967295 & t74,
        t74 / 4294967296 & 2097151
    ];
    for(n64 = 6; n64 >= 0; n64--){
        e54 = s25[n64 >> 2] >>> 8 * n64 & 255, 0 === e54 && 0 === r45 || (i37[r45 + 1 >> 2] |= e54 << 8 * (r45 + 1), r45 += 1);
    }
    return r45 = 0 !== r45 ? r45 : 1, i37[0] |= r45, {
        value: r45 + 1 > 4 ? i37 : [
            i37[0]
        ],
        binLen: 8 + 8 * r45
    };
}
function tt(t75) {
    return u($(t75.binLen), t75);
}
function nt(t76, n65) {
    var e55, r46 = $(n65);
    r46 = u(r46, t76);
    var i38 = n65 >>> 2, s26 = (i38 - r46.value.length % i38) % i38;
    for(e55 = 0; e55 < s26; e55++){
        r46.value.push(0);
    }
    return r46.value;
}
var et = function(_f4) {
    _inherits(et1, _f4);
    var _super4 = _createSuper(et1);
    function et1(t77, n66, r47) {
        var _this4;
        _classCallCheck(this, et1);
        var i39 = 6, s27 = 0;
        _this4 = _super4.call(this, t77, n66, r47);
        var o27 = r47 || {};
        if (1 !== _this4.numRounds) {
            if (o27.kmacKey || o27.hmacKey) throw new Error("Cannot set numRounds with MAC");
            if ("CSHAKE128" === _this4.s || "CSHAKE256" === _this4.s) throw new Error("Cannot set numRounds for CSHAKE variants");
        }
        switch(_this4.K = 1, _this4.m = e(_this4.t, _this4.i, _this4.K), _this4.R = W, _this4.g = Q, _this4.B = J, _this4.C = J(), _this4.v = !1, t77){
            case "SHA3-224":
                _this4.p = s27 = 1152, _this4.U = 224, _this4.L = !0, _this4.T = _this4.k;
                break;
            case "SHA3-256":
                _this4.p = s27 = 1088, _this4.U = 256, _this4.L = !0, _this4.T = _this4.k;
                break;
            case "SHA3-384":
                _this4.p = s27 = 832, _this4.U = 384, _this4.L = !0, _this4.T = _this4.k;
                break;
            case "SHA3-512":
                _this4.p = s27 = 576, _this4.U = 512, _this4.L = !0, _this4.T = _this4.k;
                break;
            case "SHAKE128":
                i39 = 31, _this4.p = s27 = 1344, _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = null;
                break;
            case "SHAKE256":
                i39 = 31, _this4.p = s27 = 1088, _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = null;
                break;
            case "KMAC128":
                i39 = 4, _this4.p = s27 = 1344, _this4.I(r47), _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = _this4.X;
                break;
            case "KMAC256":
                i39 = 4, _this4.p = s27 = 1088, _this4.I(r47), _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = _this4.X;
                break;
            case "CSHAKE128":
                _this4.p = s27 = 1344, i39 = _this4._(r47), _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = null;
                break;
            case "CSHAKE256":
                _this4.p = s27 = 1088, i39 = _this4._(r47), _this4.U = -1, _this4.v = !0, _this4.L = !1, _this4.T = null;
                break;
            default:
                throw new Error(h);
        }
        _this4.F = function(t78, n67, e, r48, o28) {
            return function(t79, n68, e, r49, i40, s28, o29) {
                var h20, u14, w11 = 0;
                var c9 = [], f8 = i40 >>> 5, a7 = n68 >>> 5;
                for(h20 = 0; h20 < a7 && n68 >= i40; h20 += f8){
                    r49 = W(t79.slice(h20, h20 + f8), r49), n68 -= i40;
                }
                for(t79 = t79.slice(h20), n68 %= i40; t79.length < f8;){
                    t79.push(0);
                }
                for(h20 = n68 >>> 3, t79[h20 >> 2] ^= s28 << h20 % 4 * 8, t79[f8 - 1] ^= 2147483648, r49 = W(t79, r49); 32 * c9.length < o29 && (u14 = r49[w11 % 5][w11 / 5 | 0], c9.push(u14.N), !(32 * c9.length >= o29));){
                    c9.push(u14.Y), w11 += 1, 0 == 64 * w11 % i40 && (W(null, r49), w11 = 0);
                }
                return c9;
            }(t78, n67, 0, r48, s27, i39, o28);
        }, o27.hmacKey && _this4.M(c("hmacKey", o27.hmacKey, _this4.K));
        return _this4;
    }
    _createClass(et1, [
        {
            key: "_",
            value: function _(t80, n69) {
                var e56 = function(t81) {
                    var n70 = t81 || {};
                    return {
                        funcName: c("funcName", n70.funcName, 1, {
                            value: [],
                            binLen: 0
                        }),
                        customization: c("Customization", n70.customization, 1, {
                            value: [],
                            binLen: 0
                        })
                    };
                }(t80 || {});
                n69 && (e56.funcName = n69);
                var r50 = u(tt(e56.funcName), tt(e56.customization));
                if (0 !== e56.customization.binLen || 0 !== e56.funcName.binLen) {
                    var _t = nt(r50, this.p >>> 3);
                    for(var _n = 0; _n < _t.length; _n += this.p >>> 5){
                        this.C = this.R(_t.slice(_n, _n + (this.p >>> 5)), this.C), this.l += this.p;
                    }
                    return 4;
                }
                return 31;
            }
        },
        {
            key: "I",
            value: function I(t82) {
                var n71 = function(t83) {
                    var n72 = t83 || {};
                    return {
                        kmacKey: c("kmacKey", n72.kmacKey, 1),
                        funcName: {
                            value: [
                                1128353099
                            ],
                            binLen: 32
                        },
                        customization: c("Customization", n72.customization, 1, {
                            value: [],
                            binLen: 0
                        })
                    };
                }(t82 || {});
                this._(t82, n71.funcName);
                var e57 = nt(tt(n71.kmacKey), this.p >>> 3);
                for(var _t2 = 0; _t2 < e57.length; _t2 += this.p >>> 5){
                    this.C = this.R(e57.slice(_t2, _t2 + (this.p >>> 5)), this.C), this.l += this.p;
                }
                this.A = !0;
            }
        },
        {
            key: "X",
            value: function X(t84) {
                var n73 = u({
                    value: this.o.slice(),
                    binLen: this.h
                }, function(t85) {
                    var n74, e58, r51 = 0;
                    var i41 = [
                        0,
                        0
                    ], s29 = [
                        4294967295 & t85,
                        t85 / 4294967296 & 2097151
                    ];
                    for(n74 = 6; n74 >= 0; n74--){
                        e58 = s29[n74 >> 2] >>> 8 * n74 & 255, 0 === e58 && 0 === r51 || (i41[r51 >> 2] |= e58 << 8 * r51, r51 += 1);
                    }
                    return r51 = 0 !== r51 ? r51 : 1, i41[r51 >> 2] |= r51 << 8 * r51, {
                        value: r51 + 1 > 4 ? i41 : [
                            i41[0]
                        ],
                        binLen: 8 + 8 * r51
                    };
                }(t84.outputLen));
                return this.F(n73.value, n73.binLen, this.l, this.g(this.C), t84.outputLen);
            }
        }
    ]);
    return et1;
}(f);
var _default = function() {
    function _default1(t86, n75, e59) {
        _classCallCheck(this, _default1);
        if ("SHA-1" == t86) this.O = new K(t86, n75, e59);
        else if ("SHA-224" == t86 || "SHA-256" == t86) this.O = new g(t86, n75, e59);
        else if ("SHA-384" == t86 || "SHA-512" == t86) this.O = new q(t86, n75, e59);
        else {
            if ("SHA3-224" != t86 && "SHA3-256" != t86 && "SHA3-384" != t86 && "SHA3-512" != t86 && "SHAKE128" != t86 && "SHAKE256" != t86 && "CSHAKE128" != t86 && "CSHAKE256" != t86 && "KMAC128" != t86 && "KMAC256" != t86) throw new Error(h);
            this.O = new et(t86, n75, e59);
        }
    }
    _createClass(_default1, [
        {
            key: "update",
            value: function update(t87) {
                this.O.update(t87);
            }
        },
        {
            key: "getHash",
            value: function getHash(t88, n76) {
                return this.O.getHash(t88, n76);
            }
        },
        {
            key: "setHMACKey",
            value: function setHMACKey(t89, n77, e60) {
                this.O.setHMACKey(t89, n77, e60);
            }
        },
        {
            key: "getHMAC",
            value: function getHMAC(t90, n78) {
                return this.O.getHMAC(t90, n78);
            }
        }
    ]);
    return _default1;
}();
var globalThis1 = function() {
    if (_typeof(globalThis1) === "object") return globalThis1;
    else {
        Object.defineProperty(Object.prototype, "__GLOBALTHIS__", {
            get: function get() {
                return this;
            },
            configurable: true
        });
        try {
            if (typeof __GLOBALTHIS__ !== "undefined") return __GLOBALTHIS__;
        } finally{
            delete Object.prototype.__GLOBALTHIS__;
        }
    }
    if (typeof self !== "undefined") return self;
    else if (typeof window !== "undefined") return window;
    else if (typeof global !== "undefined") return global;
    return undefined;
}();
var isNode = Object.prototype.toString.call(globalThis1.process) === "[object process]";
var nodeRequire = isNode ? eval("require") : function() {};
var NodeBuffer$1 = isNode ? globalThis1.Buffer : undefined;
var NodeCrypto$2 = isNode ? nodeRequire("crypto") : undefined;
var OPENSSL_TO_JSSHA_ALGO = {
    SHA1: "SHA-1",
    SHA224: "SHA-224",
    SHA256: "SHA-256",
    SHA384: "SHA-384",
    SHA512: "SHA-512",
    "SHA3-224": "SHA3-224",
    "SHA3-256": "SHA3-256",
    "SHA3-384": "SHA3-384",
    "SHA3-512": "SHA3-512"
};
var hmacDigest = function hmacDigest(algorithm, key55, message) {
    if (isNode) {
        var hmac = NodeCrypto$2.createHmac(algorithm, NodeBuffer$1.from(key55));
        hmac.update(NodeBuffer$1.from(message));
        return hmac.digest().buffer;
    } else {
        var variant = OPENSSL_TO_JSSHA_ALGO[algorithm.toUpperCase()];
        if (typeof variant === "undefined") {
            throw new TypeError("Unknown hash function");
        }
        var _hmac = new _default(variant, "ARRAYBUFFER");
        _hmac.setHMACKey(key55, "ARRAYBUFFER");
        _hmac.update(message);
        return _hmac.getHMAC("ARRAYBUFFER");
    }
};
var pad = function pad(num, digits) {
    var prefix = "";
    var repeat = digits - String(num).length;
    while(repeat-- > 0){
        prefix += "0";
    }
    return "".concat(prefix).concat(num);
};
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var base32ToBuf = function base32ToBuf(str21) {
    var cstr = str21.toUpperCase().replace(/=+$/, "");
    var buf = new ArrayBuffer(cstr.length * 5 / 8 | 0);
    var arr = new Uint8Array(buf);
    var bits = 0;
    var value66 = 0;
    var index = 0;
    for(var i42 = 0; i42 < cstr.length; i42++){
        var idx = ALPHABET.indexOf(cstr[i42]);
        if (idx === -1) throw new TypeError("Invalid character found: ".concat(cstr[i42]));
        value66 = value66 << 5 | idx;
        bits += 5;
        if (bits >= 8) {
            arr[index++] = value66 >>> bits - 8 & 255;
            bits -= 8;
        }
    }
    return buf;
};
var base32FromBuf = function base32FromBuf(buf) {
    var arr = new Uint8Array(buf);
    var bits = 0;
    var value67 = 0;
    var str22 = "";
    for(var i43 = 0; i43 < arr.length; i43++){
        value67 = value67 << 8 | arr[i43];
        bits += 8;
        while(bits >= 5){
            str22 += ALPHABET[value67 >>> bits - 5 & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        str22 += ALPHABET[value67 << 5 - bits & 31];
    }
    return str22;
};
var hexToBuf = function hexToBuf(str23) {
    var buf = new ArrayBuffer(str23.length / 2);
    var arr = new Uint8Array(buf);
    for(var i44 = 0; i44 < str23.length; i44 += 2){
        arr[i44 / 2] = parseInt(str23.substr(i44, 2), 16);
    }
    return buf;
};
var hexFromBuf = function hexFromBuf(buf) {
    var arr = new Uint8Array(buf);
    var str24 = "";
    for(var i45 = 0; i45 < arr.length; i45++){
        var hex = arr[i45].toString(16);
        if (hex.length === 1) str24 += "0";
        str24 += hex;
    }
    return str24.toUpperCase();
};
var latin1ToBuf = function latin1ToBuf(str25) {
    var buf = new ArrayBuffer(str25.length);
    var arr = new Uint8Array(buf);
    for(var i46 = 0; i46 < str25.length; i46++){
        arr[i46] = str25.charCodeAt(i46) & 0xff;
    }
    return buf;
};
var latin1FromBuf = function latin1FromBuf(buf) {
    var arr = new Uint8Array(buf);
    var str26 = "";
    for(var i47 = 0; i47 < arr.length; i47++){
        str26 += String.fromCharCode(arr[i47]);
    }
    return str26;
};
var ENCODER = globalThis1.TextEncoder ? new globalThis1.TextEncoder("utf-8") : null;
var DECODER = globalThis1.TextDecoder ? new globalThis1.TextDecoder("utf-8") : null;
var utf8ToBuf = function utf8ToBuf(str27) {
    if (!ENCODER) {
        throw new Error("Encoding API not available");
    }
    return ENCODER.encode(str27).buffer;
};
var utf8FromBuf = function utf8FromBuf(buf) {
    if (!DECODER) {
        throw new Error("Encoding API not available");
    }
    return DECODER.decode(buf);
};
var NodeCrypto$1 = isNode ? nodeRequire("crypto") : undefined;
var BrowserCrypto = !isNode ? globalThis1.crypto || globalThis1.msCrypto : undefined;
var randomBytes = function randomBytes(size) {
    if (isNode) {
        return NodeCrypto$1.randomBytes(size).buffer;
    } else {
        if (!BrowserCrypto || !BrowserCrypto.getRandomValues) {
            throw new Error("Cryptography API not available");
        }
        return BrowserCrypto.getRandomValues(new Uint8Array(size)).buffer;
    }
};
var Secret = function() {
    function Secret1() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, buffer4 = _ref.buffer, _ref$size = _ref.size, size = _ref$size === void 0 ? 20 : _ref$size;
        _classCallCheck(this, Secret1);
        this.buffer = typeof buffer4 === "undefined" ? randomBytes(size) : buffer4;
    }
    _createClass(Secret1, [
        {
            key: "latin1",
            get: function get() {
                Object.defineProperty(this, "latin1", {
                    enumerable: true,
                    value: latin1FromBuf(this.buffer)
                });
                return this.latin1;
            }
        },
        {
            key: "utf8",
            get: function get() {
                Object.defineProperty(this, "utf8", {
                    enumerable: true,
                    value: utf8FromBuf(this.buffer)
                });
                return this.utf8;
            }
        },
        {
            key: "base32",
            get: function get() {
                Object.defineProperty(this, "base32", {
                    enumerable: true,
                    value: base32FromBuf(this.buffer)
                });
                return this.base32;
            }
        },
        {
            key: "hex",
            get: function get() {
                Object.defineProperty(this, "hex", {
                    enumerable: true,
                    value: hexFromBuf(this.buffer)
                });
                return this.hex;
            }
        }
    ], [
        {
            key: "fromLatin1",
            value: function fromLatin1(str28) {
                return new Secret1({
                    buffer: latin1ToBuf(str28)
                });
            }
        },
        {
            key: "fromUTF8",
            value: function fromUTF8(str29) {
                return new Secret1({
                    buffer: utf8ToBuf(str29)
                });
            }
        },
        {
            key: "fromBase32",
            value: function fromBase32(str30) {
                return new Secret1({
                    buffer: base32ToBuf(str30)
                });
            }
        },
        {
            key: "fromHex",
            value: function fromHex(str31) {
                return new Secret1({
                    buffer: hexToBuf(str31)
                });
            }
        }
    ]);
    return Secret1;
}();
var NodeBuffer = isNode ? globalThis1.Buffer : undefined;
var NodeCrypto = isNode ? nodeRequire("crypto") : undefined;
var timingSafeEqual = function timingSafeEqual(a8, b1) {
    if (isNode) {
        return NodeCrypto.timingSafeEqual(NodeBuffer.from(a8), NodeBuffer.from(b1));
    } else {
        if (a8.length !== b1.length) {
            throw new TypeError("Input strings must have the same length");
        }
        var i48 = -1;
        var out = 0;
        while(++i48 < a8.length){
            out |= a8.charCodeAt(i48) ^ b1.charCodeAt(i48);
        }
        return out === 0;
    }
};
var HOTP = function() {
    function HOTP1() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$issuer = _ref.issuer, issuer = _ref$issuer === void 0 ? HOTP1.defaults.issuer : _ref$issuer, _ref$label = _ref.label, label = _ref$label === void 0 ? HOTP1.defaults.label : _ref$label, _ref$secret = _ref.secret, secret1 = _ref$secret === void 0 ? new Secret() : _ref$secret, _ref$algorithm = _ref.algorithm, algorithm = _ref$algorithm === void 0 ? HOTP1.defaults.algorithm : _ref$algorithm, _ref$digits = _ref.digits, digits = _ref$digits === void 0 ? HOTP1.defaults.digits : _ref$digits, _ref$counter = _ref.counter, counter = _ref$counter === void 0 ? HOTP1.defaults.counter : _ref$counter;
        _classCallCheck(this, HOTP1);
        this.issuer = issuer;
        this.label = label;
        this.secret = typeof secret1 === "string" ? Secret.fromBase32(secret1) : secret1;
        this.algorithm = algorithm.toUpperCase();
        this.digits = digits;
        this.counter = counter;
    }
    _createClass(HOTP1, [
        {
            key: "generate",
            value: function generate() {
                var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref2$counter = _ref2.counter, counter = _ref2$counter === void 0 ? this.counter++ : _ref2$counter;
                return HOTP1.generate({
                    secret: this.secret,
                    algorithm: this.algorithm,
                    digits: this.digits,
                    counter: counter
                });
            }
        },
        {
            key: "validate",
            value: function validate(_ref3) {
                var token = _ref3.token, _ref3$counter = _ref3.counter, counter = _ref3$counter === void 0 ? this.counter : _ref3$counter, window = _ref3.window;
                return HOTP1.validate({
                    token: token,
                    secret: this.secret,
                    algorithm: this.algorithm,
                    digits: this.digits,
                    counter: counter,
                    window: window
                });
            }
        },
        {
            key: "toString",
            value: function toString() {
                var e61 = encodeURIComponent;
                return "otpauth://hotp/" + "".concat(this.issuer.length > 0 ? "".concat(e61(this.issuer), ":").concat(e61(this.label), "?issuer=").concat(e61(this.issuer), "&") : "".concat(e61(this.label), "?")) + "secret=".concat(e61(this.secret.base32), "&") + "algorithm=".concat(e61(this.algorithm), "&") + "digits=".concat(e61(this.digits), "&") + "counter=".concat(e61(this.counter));
            }
        }
    ], [
        {
            key: "defaults",
            get: function get() {
                return {
                    issuer: "",
                    label: "OTPAuth",
                    algorithm: "SHA1",
                    digits: 6,
                    counter: 0,
                    window: 1
                };
            }
        },
        {
            key: "generate",
            value: function generate(_ref4) {
                var secret2 = _ref4.secret, _ref4$algorithm = _ref4.algorithm, algorithm = _ref4$algorithm === void 0 ? HOTP1.defaults.algorithm : _ref4$algorithm, _ref4$digits = _ref4.digits, digits = _ref4$digits === void 0 ? HOTP1.defaults.digits : _ref4$digits, _ref4$counter = _ref4.counter, counter = _ref4$counter === void 0 ? HOTP1.defaults.counter : _ref4$counter;
                var digest4 = new Uint8Array(hmacDigest(algorithm, secret2.buffer, uintToBuf(counter)));
                var offset = digest4[digest4.byteLength - 1] & 15;
                var otp = ((digest4[offset] & 127) << 24 | (digest4[offset + 1] & 255) << 16 | (digest4[offset + 2] & 255) << 8 | digest4[offset + 3] & 255) % Math.pow(10, digits);
                return pad(otp, digits);
            }
        },
        {
            key: "validate",
            value: function validate(_ref5) {
                var token = _ref5.token, secret3 = _ref5.secret, algorithm = _ref5.algorithm, digits = _ref5.digits, _ref5$counter = _ref5.counter, counter = _ref5$counter === void 0 ? HOTP1.defaults.counter : _ref5$counter, _ref5$window = _ref5.window, window = _ref5$window === void 0 ? HOTP1.defaults.window : _ref5$window;
                if (token.length !== digits) return null;
                var delta = null;
                for(var i49 = counter - window; i49 <= counter + window; ++i49){
                    var generatedToken = HOTP1.generate({
                        secret: secret3,
                        algorithm: algorithm,
                        digits: digits,
                        counter: i49
                    });
                    if (timingSafeEqual(token, generatedToken)) {
                        delta = i49 - counter;
                    }
                }
                return delta;
            }
        }
    ]);
    return HOTP1;
}();
var TOTP = function() {
    function TOTP1() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$issuer = _ref.issuer, issuer = _ref$issuer === void 0 ? TOTP1.defaults.issuer : _ref$issuer, _ref$label = _ref.label, label = _ref$label === void 0 ? TOTP1.defaults.label : _ref$label, _ref$secret = _ref.secret, secret4 = _ref$secret === void 0 ? new Secret() : _ref$secret, _ref$algorithm = _ref.algorithm, algorithm = _ref$algorithm === void 0 ? TOTP1.defaults.algorithm : _ref$algorithm, _ref$digits = _ref.digits, digits = _ref$digits === void 0 ? TOTP1.defaults.digits : _ref$digits, _ref$period = _ref.period, period = _ref$period === void 0 ? TOTP1.defaults.period : _ref$period;
        _classCallCheck(this, TOTP1);
        this.issuer = issuer;
        this.label = label;
        this.secret = typeof secret4 === "string" ? Secret.fromBase32(secret4) : secret4;
        this.algorithm = algorithm.toUpperCase();
        this.digits = digits;
        this.period = period;
    }
    _createClass(TOTP1, [
        {
            key: "generate",
            value: function generate() {
                var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref2$timestamp = _ref2.timestamp, timestamp = _ref2$timestamp === void 0 ? Date.now() : _ref2$timestamp;
                return TOTP1.generate({
                    secret: this.secret,
                    algorithm: this.algorithm,
                    digits: this.digits,
                    period: this.period,
                    timestamp: timestamp
                });
            }
        },
        {
            key: "validate",
            value: function validate(_ref3) {
                var token = _ref3.token, timestamp = _ref3.timestamp, window = _ref3.window;
                return TOTP1.validate({
                    token: token,
                    secret: this.secret,
                    algorithm: this.algorithm,
                    digits: this.digits,
                    period: this.period,
                    timestamp: timestamp,
                    window: window
                });
            }
        },
        {
            key: "toString",
            value: function toString() {
                var e62 = encodeURIComponent;
                return "otpauth://totp/" + "".concat(this.issuer.length > 0 ? "".concat(e62(this.issuer), ":").concat(e62(this.label), "?issuer=").concat(e62(this.issuer), "&") : "".concat(e62(this.label), "?")) + "secret=".concat(e62(this.secret.base32), "&") + "algorithm=".concat(e62(this.algorithm), "&") + "digits=".concat(e62(this.digits), "&") + "period=".concat(e62(this.period));
            }
        }
    ], [
        {
            key: "defaults",
            get: function get() {
                return {
                    issuer: "",
                    label: "OTPAuth",
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                    window: 1
                };
            }
        },
        {
            key: "generate",
            value: function generate(_ref4) {
                var secret5 = _ref4.secret, algorithm = _ref4.algorithm, digits = _ref4.digits, _ref4$period = _ref4.period, period = _ref4$period === void 0 ? TOTP1.defaults.period : _ref4$period, _ref4$timestamp = _ref4.timestamp, timestamp = _ref4$timestamp === void 0 ? Date.now() : _ref4$timestamp;
                return HOTP.generate({
                    secret: secret5,
                    algorithm: algorithm,
                    digits: digits,
                    counter: Math.floor(timestamp / 1000 / period)
                });
            }
        },
        {
            key: "validate",
            value: function validate(_ref5) {
                var token = _ref5.token, secret6 = _ref5.secret, algorithm = _ref5.algorithm, digits = _ref5.digits, _ref5$period = _ref5.period, period = _ref5$period === void 0 ? TOTP1.defaults.period : _ref5$period, _ref5$timestamp = _ref5.timestamp, timestamp = _ref5$timestamp === void 0 ? Date.now() : _ref5$timestamp, window = _ref5.window;
                return HOTP.validate({
                    token: token,
                    secret: secret6,
                    algorithm: algorithm,
                    digits: digits,
                    counter: Math.floor(timestamp / 1000 / period),
                    window: window
                });
            }
        }
    ]);
    return TOTP1;
}();
var OTPURI_REGEX = /^otpauth:\/\/([ht]otp)\/(.+)\?([A-Z0-9.~_-]+=[^?&]*(?:&[A-Z0-9.~_-]+=[^?&]*)*)$/i;
var SECRET_REGEX = /^[2-7A-Z]+=*$/i;
var ALGORITHM_REGEX = /^SHA(?:1|224|256|384|512|3-224|3-256|3-384|3-512)$/i;
var INTEGER_REGEX = /^[+-]?\d+$/;
var POSITIVE_INTEGER_REGEX = /^\+?[1-9]\d*$/;
var URI = function() {
    function URI1() {
        _classCallCheck(this, URI1);
    }
    _createClass(URI1, null, [
        {
            key: "parse",
            value: function parse(uri) {
                var uriGroups;
                try {
                    uriGroups = uri.match(OTPURI_REGEX);
                } catch (error) {}
                if (!Array.isArray(uriGroups)) {
                    throw new URIError("Invalid URI format");
                }
                var uriType = uriGroups[1].toLowerCase();
                var uriLabel = uriGroups[2].split(/(?::|%3A) *(.+)/i, 2).map(decodeURIComponent);
                var uriParams = uriGroups[3].split("&").reduce(function(acc, cur) {
                    var pairArr = cur.split(/=(.*)/, 2).map(decodeURIComponent);
                    var pairKey = pairArr[0].toLowerCase();
                    var pairVal = pairArr[1];
                    var pairAcc = acc;
                    pairAcc[pairKey] = pairVal;
                    return pairAcc;
                }, {});
                var OTP;
                var config = {};
                if (uriType === "hotp") {
                    OTP = HOTP;
                    if (typeof uriParams.counter !== "undefined" && INTEGER_REGEX.test(uriParams.counter)) {
                        config.counter = parseInt(uriParams.counter, 10);
                    } else {
                        throw new TypeError("Missing or invalid 'counter' parameter");
                    }
                } else if (uriType === "totp") {
                    OTP = TOTP;
                    if (typeof uriParams.period !== "undefined") {
                        if (POSITIVE_INTEGER_REGEX.test(uriParams.period)) {
                            config.period = parseInt(uriParams.period, 10);
                        } else {
                            throw new TypeError("Invalid 'period' parameter");
                        }
                    }
                } else {
                    throw new TypeError("Unknown OTP type");
                }
                if (uriLabel.length === 2) {
                    config.label = uriLabel[1];
                    config.issuer = uriLabel[0];
                } else {
                    config.label = uriLabel[0];
                    if (typeof uriParams.issuer !== "undefined") {
                        config.issuer = uriParams.issuer;
                    }
                }
                if (typeof uriParams.secret !== "undefined" && SECRET_REGEX.test(uriParams.secret)) {
                    config.secret = uriParams.secret;
                } else {
                    throw new TypeError("Missing or invalid 'secret' parameter");
                }
                if (typeof uriParams.algorithm !== "undefined") {
                    if (ALGORITHM_REGEX.test(uriParams.algorithm)) {
                        config.algorithm = uriParams.algorithm;
                    } else {
                        throw new TypeError("Invalid 'algorithm' parameter");
                    }
                }
                if (typeof uriParams.digits !== "undefined") {
                    if (POSITIVE_INTEGER_REGEX.test(uriParams.digits)) {
                        config.digits = parseInt(uriParams.digits, 10);
                    } else {
                        throw new TypeError("Invalid 'digits' parameter");
                    }
                }
                return new OTP(config);
            }
        },
        {
            key: "stringify",
            value: function stringify(otp) {
                if (otp instanceof HOTP || otp instanceof TOTP) {
                    return otp.toString();
                }
                throw new TypeError("Invalid 'HOTP/TOTP' object");
            }
        }
    ]);
    return URI1;
}();
var version = "7.1.3";
const mod18 = {
    HOTP: HOTP,
    Secret: Secret,
    TOTP: TOTP,
    URI: URI,
    version: version
};
const importMeta = {
    url: "https://deno.land/x/denomailer@1.1.0/client/worker/worker.ts",
    main: false
};
class SMTPWorker {
    id = 1;
    #timeout;
    constructor(config){
        this.#config = config;
        this.#timeout = config.pool.timeout;
    }
    #w;
    #idleTO = null;
    #idleMode2 = false;
    #noCon = true;
    #config;
    #resolver = new Map();
     #startup() {
        this.#w = new Worker(new URL("./worker-file.ts", importMeta.url), {
            type: "module",
            deno: {
                permissions: {
                    net: "inherit",
                    read: true
                },
                namespace: true
            }
        });
        this.#w.addEventListener("message", (ev)=>{
            if (typeof ev.data === "object") {
                if ("err" in ev.data) {
                    this.#resolver.get(ev.data.__ret)?.rej(ev.data.err);
                }
                if ("res" in ev.data) {
                    this.#resolver.get(ev.data.__ret)?.res(ev.data.res);
                }
                this.#resolver.delete(ev.data.__ret);
                return;
            }
            if (ev.data) {
                this.#stopIdle();
            } else {
                if (this.#idleMode2) {
                    this.#cleanup();
                } else {
                    this.#startIdle();
                }
            }
        });
        this.#w.postMessage({
            __setup: {
                ...this.#config,
                client: {
                    ...this.#config.client,
                    preprocessors: []
                }
            }
        });
        this.#noCon = false;
    }
     #startIdle() {
        console.log("started idle");
        if (this.#idleTO) {
            return;
        }
        this.#idleTO = setTimeout(()=>{
            console.log("idle mod 2");
            this.#idleMode2 = true;
            this.#w.postMessage({
                __check_idle: true
            });
        }, this.#timeout);
    }
     #stopIdle() {
        if (this.#idleTO) {
            clearTimeout(this.#idleTO);
        }
        this.#idleMode2 = false;
        this.#idleTO = null;
    }
     #cleanup() {
        console.log("killed");
        this.#w.terminate();
        this.#stopIdle();
    }
    send(mail) {
        const myID = this.id;
        this.id++;
        this.#stopIdle();
        if (this.#noCon) {
            this.#startup();
        }
        this.#w.postMessage({
            __mail: myID,
            mail
        });
        return new Promise((res, rej)=>{
            this.#resolver.set(myID, {
                res,
                rej
            });
        });
    }
    close() {
        if (this.#w) this.#w.terminate();
        if (this.#idleTO) {
            clearTimeout(this.#idleTO);
        }
    }
}
class SMTPWorkerPool {
    pool = [];
    constructor(config){
        for(let i76 = 0; i76 < config.pool.size; i76++){
            this.pool.push(new SMTPWorker(config));
        }
    }
    #lastUsed = -1;
    send(mail) {
        this.#lastUsed = (this.#lastUsed + 1) % this.pool.length;
        return this.pool[this.#lastUsed].send(mail);
    }
    close() {
        this.pool.forEach((v4)=>v4.close());
    }
}
class DenoStdInternalError3 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert4(expr, msg20 = "") {
    if (!expr) {
        throw new DenoStdInternalError3(msg20);
    }
}
function concat1(...buf) {
    let length = 0;
    for (const b18 of buf){
        length += b18.length;
    }
    const output = new Uint8Array(length);
    let index = 0;
    for (const b1 of buf){
        output.set(b1, index);
        index += b1.length;
    }
    return output;
}
function copy4(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const MIN_BUF_SIZE4 = 16;
const CR5 = "\r".charCodeAt(0);
const LF5 = "\n".charCodeAt(0);
class BufferFullError4 extends Error {
    name;
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
        this.name = "BufferFullError";
    }
    partial;
}
class PartialReadError3 extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader4 {
    #buf;
    #rd;
    #r = 0;
    #w = 0;
    #eof = false;
    static create(r52, size = 4096) {
        return r52 instanceof BufReader4 ? r52 : new BufReader4(r52, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE4;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    size() {
        return this.#buf.byteLength;
    }
    buffered() {
        return this.#w - this.#r;
    }
    #fill = async ()=>{
        if (this.#r > 0) {
            this.#buf.copyWithin(0, this.#r, this.#w);
            this.#w -= this.#r;
            this.#r = 0;
        }
        if (this.#w >= this.#buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i77 = 100; i77 > 0; i77--){
            const rr = await this.#rd.read(this.#buf.subarray(this.#w));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert4(rr >= 0, "negative read");
            this.#w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    };
    reset(r53) {
        this.#reset(this.#buf, r53);
    }
    #reset = (buf, rd)=>{
        this.#buf = buf;
        this.#rd = rd;
        this.#eof = false;
    };
    async read(p34) {
        let rr = p34.byteLength;
        if (p34.byteLength === 0) return rr;
        if (this.#r === this.#w) {
            if (p34.byteLength >= this.#buf.byteLength) {
                const rr = await this.#rd.read(p34);
                const nread = rr ?? 0;
                assert4(nread >= 0, "negative read");
                return rr;
            }
            this.#r = 0;
            this.#w = 0;
            rr = await this.#rd.read(this.#buf);
            if (rr === 0 || rr === null) return rr;
            assert4(rr >= 0, "negative read");
            this.#w += rr;
        }
        const copied = copy4(this.#buf.subarray(this.#r, this.#w), p34, 0);
        this.#r += copied;
        return copied;
    }
    async readFull(p35) {
        let bytesRead = 0;
        while(bytesRead < p35.length){
            try {
                const rr = await this.read(p35.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError3();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError3) {
                    err.partial = p35.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e63 = new PartialReadError3();
                    e63.partial = p35.subarray(0, bytesRead);
                    e63.stack = err.stack;
                    e63.message = err.message;
                    e63.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p35;
    }
    async readByte() {
        while(this.#r === this.#w){
            if (this.#eof) return null;
            await this.#fill();
        }
        const c31 = this.#buf[this.#r];
        this.#r++;
        return c31;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer5 = await this.readSlice(delim.charCodeAt(0));
        if (buffer5 === null) return null;
        return new TextDecoder().decode(buffer5);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF5);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError3) {
                partial = err.partial;
                assert4(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError4)) {
                throw err;
            }
            partial = err.partial;
            if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR5) {
                assert4(this.#r > 0, "bufio: tried to rewind past start of buffer");
                this.#r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.#eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF5) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR5) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s30 = 0;
        let slice;
        while(true){
            let i78 = this.#buf.subarray(this.#r + s30, this.#w).indexOf(delim);
            if (i78 >= 0) {
                i78 += s30;
                slice = this.#buf.subarray(this.#r, this.#r + i78 + 1);
                this.#r += i78 + 1;
                break;
            }
            if (this.#eof) {
                if (this.#r === this.#w) {
                    return null;
                }
                slice = this.#buf.subarray(this.#r, this.#w);
                this.#r = this.#w;
                break;
            }
            if (this.buffered() >= this.#buf.byteLength) {
                this.#r = this.#w;
                const oldbuf = this.#buf;
                const newbuf = this.#buf.slice(0);
                this.#buf = newbuf;
                throw new BufferFullError4(oldbuf);
            }
            s30 = this.#w - this.#r;
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError3) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e64 = new PartialReadError3();
                    e64.partial = slice;
                    e64.stack = err.stack;
                    e64.message = err.message;
                    e64.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.#w - this.#r;
        while(avail < n6 && avail < this.#buf.byteLength && !this.#eof){
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError3) {
                    err.partial = this.#buf.subarray(this.#r, this.#w);
                } else if (err instanceof Error) {
                    const e65 = new PartialReadError3();
                    e65.partial = this.#buf.subarray(this.#r, this.#w);
                    e65.stack = err.stack;
                    e65.message = err.message;
                    e65.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.#w - this.#r;
        }
        if (avail === 0 && this.#eof) {
            return null;
        } else if (avail < n6 && this.#eof) {
            return this.#buf.subarray(this.#r, this.#r + avail);
        } else if (avail < n6) {
            throw new BufferFullError4(this.#buf.subarray(this.#r, this.#w));
        }
        return this.#buf.subarray(this.#r, this.#r + n6);
    }
}
class AbstractBufBase3 {
    buf;
    usedBufferBytes = 0;
    err = null;
    constructor(buf){
        this.buf = buf;
    }
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter3 extends AbstractBufBase3 {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriter3 ? writer : new BufWriter3(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w12) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w12;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p36 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p36.length){
                nwritten += await this.#writer.write(p36.subarray(nwritten));
            }
        } catch (e66) {
            if (e66 instanceof Error) {
                this.err = e66;
            }
            throw e66;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data32) {
        if (this.err !== null) throw this.err;
        if (data32.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data32.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.#writer.write(data32);
                } catch (e67) {
                    if (e67 instanceof Error) {
                        this.err = e67;
                    }
                    throw e67;
                }
            } else {
                numBytesWritten = copy4(data32, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data32 = data32.subarray(numBytesWritten);
        }
        numBytesWritten = copy4(data32, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync3 extends AbstractBufBase3 {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync3 ? writer : new BufWriterSync3(writer, size);
    }
    constructor(writer, size = 4096){
        super(new Uint8Array(size <= 0 ? 4096 : size));
        this.#writer = writer;
    }
    reset(w13) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w13;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p37 = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p37.length){
                nwritten += this.#writer.writeSync(p37.subarray(nwritten));
            }
        } catch (e68) {
            if (e68 instanceof Error) {
                this.err = e68;
            }
            throw e68;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data33) {
        if (this.err !== null) throw this.err;
        if (data33.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data33.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.#writer.writeSync(data33);
                } catch (e69) {
                    if (e69 instanceof Error) {
                        this.err = e69;
                    }
                    throw e69;
                }
            } else {
                numBytesWritten = copy4(data33, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data33 = data33.subarray(numBytesWritten);
        }
        numBytesWritten = copy4(data33, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
const CHAR_SPACE = " ".charCodeAt(0);
const CHAR_TAB = "\t".charCodeAt(0);
const CHAR_COLON = ":".charCodeAt(0);
const WHITESPACES = [
    CHAR_SPACE,
    CHAR_TAB
];
const decoder4 = new TextDecoder();
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
    return !buf ? "" : decoder4.decode(buf);
}
class TextProtoReader {
    constructor(r54){
        this.r = r54;
    }
    async readLine() {
        const s31 = await this.readLineSlice();
        return s31 === null ? null : str(s31);
    }
    async readMIMEHeader() {
        const m16 = new Headers();
        let line;
        let buf = await this.r.peek(1);
        if (buf === null) {
            return null;
        } else if (WHITESPACES.includes(buf[0])) {
            line = await this.readLineSlice();
        }
        buf = await this.r.peek(1);
        if (buf === null) {
            throw new Deno.errors.UnexpectedEof();
        } else if (WHITESPACES.includes(buf[0])) {
            throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
        }
        while(true){
            const kv = await this.readLineSlice();
            if (kv === null) throw new Deno.errors.UnexpectedEof();
            if (kv.byteLength === 0) return m16;
            let i79 = kv.indexOf(CHAR_COLON);
            if (i79 < 0) {
                throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
            }
            const key56 = str(kv.subarray(0, i79));
            if (key56 == "") {
                continue;
            }
            i79++;
            while(i79 < kv.byteLength && WHITESPACES.includes(kv[i79])){
                i79++;
            }
            const value68 = str(kv.subarray(i79)).replace(invalidHeaderCharRegex, encodeURI);
            try {
                m16.append(key56, value68);
            } catch  {}
        }
    }
    async readLineSlice() {
        let line = new Uint8Array(0);
        let r55 = null;
        do {
            r55 = await this.r.readLine();
            if (r55 !== null && this.skipSpace(r55.line) !== 0) {
                line = concat1(line, r55.line);
            }
        }while (r55 !== null && r55.more)
        return r55 === null ? null : line;
    }
    skipSpace(l4) {
        let n79 = 0;
        for (const val of l4){
            if (!WHITESPACES.includes(val)) {
                n79++;
            }
        }
        return n79;
    }
    r;
}
function decode4(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i80 = 0; i80 < size; i80++){
        bytes[i80] = binString.charCodeAt(i80);
    }
    return bytes;
}
const encoder6 = new TextEncoder();
class SMTPConnection {
    secure;
    conn;
    #reader;
    #writer;
    constructor(config){
        this.config = config;
        this.secure = false;
        this.conn = null;
        this.#reader = null;
        this.#writer = null;
        this.ready = this.#connect();
    }
    ready;
    async close() {
        await this.ready;
        if (!this.conn) {
            return;
        }
        await this.conn.close();
    }
    setupConnection(conn) {
        this.conn = conn;
        const reader1 = new BufReader4(this.conn);
        this.#writer = new BufWriter3(this.conn);
        this.#reader = new TextProtoReader(reader1);
    }
    async #connect() {
        if (this.config.connection.tls) {
            this.conn = await Deno.connectTls({
                hostname: this.config.connection.hostname,
                port: this.config.connection.port
            });
            this.secure = true;
        } else {
            this.conn = await Deno.connect({
                hostname: this.config.connection.hostname,
                port: this.config.connection.port
            });
        }
        this.setupConnection(this.conn);
    }
    assertCode(cmd, code37, msg21) {
        if (!cmd) {
            throw new Error(`invalid cmd`);
        }
        if (cmd.code !== code37) {
            throw new Error(msg21 || cmd.code + ": " + cmd.args);
        }
    }
    async readCmd() {
        if (!this.#reader) {
            return null;
        }
        const result = [];
        while(result.length === 0 || result.at(-1) && result.at(-1).at(3) === "-"){
            result.push(await this.#reader.readLine());
        }
        const nonNullResult = result.at(-1) === null ? result.slice(0, result.length - 1) : result;
        if (nonNullResult.length === 0) return null;
        const code38 = parseInt(nonNullResult[0].slice(0, 3));
        const data34 = nonNullResult.map((v5)=>v5.slice(4).trim());
        if (this.config.debug.log) {
            nonNullResult.forEach((v6)=>console.log(v6));
        }
        return {
            code: code38,
            args: data34
        };
    }
    async writeCmd(...args14) {
        if (!this.#writer) {
            return null;
        }
        if (this.config.debug.log) {
            console.table(args14);
        }
        const data35 = encoder6.encode([
            ...args14
        ].join(" ") + "\r\n");
        await this.#writer.write(data35);
        await this.#writer.flush();
    }
    async writeCmdBinary(...args15) {
        if (!this.#writer) {
            return null;
        }
        if (this.config.debug.log) {
            console.table(args15.map(()=>"Uint8Attay"));
        }
        for(let i81 = 0; i81 < args15.length; i81++){
            await this.#writer.write(args15[i81]);
        }
        await this.#writer.flush();
    }
    config;
}
const CommandCode = {
    READY: 220,
    AUTHO_SUCCESS: 235,
    OK: 250,
    BEGIN_DATA: 354,
    FAIL: 554
};
class QUE {
    running = false;
    #que = [];
    idle = Promise.resolve();
    #idbleCB;
    que() {
        if (!this.running) {
            this.running = true;
            this.idle = new Promise((res)=>{
                this.#idbleCB = res;
            });
            return Promise.resolve();
        }
        return new Promise((res)=>{
            this.#que.push(res);
        });
    }
    next() {
        if (this.#que.length === 0) {
            this.running = false;
            if (this.#idbleCB) this.#idbleCB();
            return;
        }
        this.#que[0]();
        this.#que.splice(0, 1);
    }
}
class SMTPClient {
    #connection;
    #que;
    constructor(config){
        this.config = config;
        this.#que = new QUE();
        this.#supportedFeatures = new Set();
        const c32 = new SMTPConnection(config);
        this.#connection = c32;
        this.#ready = (async ()=>{
            await c32.ready;
            await this.#prepareConnection();
        })();
    }
    #ready;
    close() {
        return this.#connection.close();
    }
    get isSending() {
        return this.#que.running;
    }
    get idle() {
        return this.#que.idle;
    }
    async send(config) {
        await this.#ready;
        try {
            await this.#que.que();
            await this.#connection.writeCmd("MAIL", "FROM:", `<${config.from.mail}>`);
            this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.OK);
            for(let i82 = 0; i82 < config.to.length; i82++){
                await this.#connection.writeCmd("RCPT", "TO:", `<${config.to[i82].mail}>`);
                this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.OK);
            }
            for(let i1 = 0; i1 < config.cc.length; i1++){
                await this.#connection.writeCmd("RCPT", "TO:", `<${config.cc[i1].mail}>`);
                this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.OK);
            }
            for(let i2 = 0; i2 < config.bcc.length; i2++){
                await this.#connection.writeCmd("RCPT", "TO:", `<${config.bcc[i2].mail}>`);
                this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.OK);
            }
            await this.#connection.writeCmd("DATA");
            this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.BEGIN_DATA);
            await this.#connection.writeCmd("Subject: ", config.subject);
            await this.#connection.writeCmd("From: ", `${config.from.name} <${config.from.mail}>`);
            if (config.to.length > 0) {
                await this.#connection.writeCmd("To: ", config.to.map((m17)=>`${m17.name} <${m17.mail}>`).join(";"));
            }
            if (config.cc.length > 0) {
                await this.#connection.writeCmd("Cc: ", config.cc.map((m18)=>`${m18.name} <${m18.mail}>`).join(";"));
            }
            await this.#connection.writeCmd("Date: ", config.date);
            const obj = Object.entries(config.headers);
            for(let i3 = 0; i3 < obj.length; i3++){
                const [name2, value69] = obj[i3];
                await this.#connection.writeCmd(name2 + ": ", value69);
            }
            if (config.inReplyTo) {
                await this.#connection.writeCmd("InReplyTo: ", config.inReplyTo);
            }
            if (config.references) {
                await this.#connection.writeCmd("Refrences: ", config.references);
            }
            if (config.replyTo) {
                await this.#connection.writeCmd("ReplyTo: ", `${config.replyTo.name} <${config.replyTo.name}>`);
            }
            if (config.priority) {
                await this.#connection.writeCmd("Priority:", config.priority);
            }
            await this.#connection.writeCmd("MIME-Version: 1.0");
            let boundaryAdditionAtt = 100;
            config.mimeContent.map((v7)=>v7.content).join("\n").replace(new RegExp("--attachment([0-9]+)", "g"), (_, numb)=>{
                boundaryAdditionAtt += parseInt(numb, 10);
                return "";
            });
            const dec = new TextDecoder();
            config.attachments.map((v8)=>{
                if (v8.encoding === "text") return v8.content;
                const arr = new Uint8Array(v8.content);
                return dec.decode(arr);
            }).join("\n").replace(new RegExp("--attachment([0-9]+)", "g"), (_, numb)=>{
                boundaryAdditionAtt += parseInt(numb, 10);
                return "";
            });
            const attachmentBoundary = `attachment${boundaryAdditionAtt}`;
            await this.#connection.writeCmd(`Content-Type: multipart/mixed; boundary=${attachmentBoundary}`, "\r\n");
            await this.#connection.writeCmd(`--${attachmentBoundary}`);
            let boundaryAddition = 100;
            config.mimeContent.map((v9)=>v9.content).join("\n").replace(new RegExp("--message([0-9]+)", "g"), (_, numb)=>{
                boundaryAddition += parseInt(numb, 10);
                return "";
            });
            const messageBoundary = `message${boundaryAddition}`;
            await this.#connection.writeCmd(`Content-Type: multipart/alternative; boundary=${messageBoundary}`, "\r\n");
            for(let i4 = 0; i4 < config.mimeContent.length; i4++){
                await this.#connection.writeCmd(`--${messageBoundary}`);
                await this.#connection.writeCmd("Content-Type: " + config.mimeContent[i4].mimeType);
                if (config.mimeContent[i4].transferEncoding) {
                    await this.#connection.writeCmd(`Content-Transfer-Encoding: ${config.mimeContent[i4].transferEncoding}` + "\r\n");
                } else {
                    await this.#connection.writeCmd("");
                }
                await this.#connection.writeCmd(config.mimeContent[i4].content, "\r\n");
            }
            await this.#connection.writeCmd(`--${messageBoundary}--\r\n`);
            for(let i5 = 0; i5 < config.attachments.length; i5++){
                const attachment = config.attachments[i5];
                await this.#connection.writeCmd(`--${attachmentBoundary}`);
                await this.#connection.writeCmd("Content-Type:", attachment.contentType + ";", "name=" + attachment.filename);
                await this.#connection.writeCmd("Content-Disposition: attachment; filename=" + attachment.filename, "\r\n");
                if (attachment.encoding === "binary") {
                    await this.#connection.writeCmd("Content-Transfer-Encoding: binary");
                    if (attachment.content instanceof ArrayBuffer || attachment.content instanceof SharedArrayBuffer) {
                        await this.#connection.writeCmdBinary(new Uint8Array(attachment.content));
                    } else {
                        await this.#connection.writeCmdBinary(attachment.content);
                    }
                    await this.#connection.writeCmd("\r\n");
                } else if (attachment.encoding === "text") {
                    await this.#connection.writeCmd("Content-Transfer-Encoding: quoted-printable");
                    await this.#connection.writeCmd(attachment.content, "\r\n");
                }
            }
            await this.#connection.writeCmd(`--${attachmentBoundary}--\r\n`);
            await this.#connection.writeCmd(".\r\n");
            this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.OK);
            await this.#cleanup();
            this.#que.next();
        } catch (ex) {
            await this.#cleanup();
            this.#que.next();
            throw ex;
        }
    }
    async #prepareConnection() {
        this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.READY);
        await this.#connection.writeCmd("EHLO", this.config.connection.hostname);
        const cmd1 = await this.#connection.readCmd();
        if (!cmd1) throw new Error("Unexpected empty response");
        if (typeof cmd1.args === "string") {
            this.#supportedFeatures.add(cmd1.args);
        } else {
            cmd1.args.forEach((cmd2)=>{
                this.#supportedFeatures.add(cmd2);
            });
        }
        if (this.#supportedFeatures.has("STARTTLS") && !this.config.debug.noStartTLS) {
            await this.#connection.writeCmd("STARTTLS");
            this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.READY);
            const conn = await Deno.startTls(this.#connection.conn, {
                hostname: this.config.connection.hostname
            });
            this.#connection.setupConnection(conn);
            this.#connection.secure = true;
            await this.#connection.writeCmd("EHLO", this.config.connection.hostname);
            await this.#connection.readCmd();
        }
        if (!this.config.debug.allowUnsecure && !this.#connection.secure) {
            this.#connection.close();
            this.#connection = null;
            throw new Error("Connection is not secure! Don't send authentication over non secure connection!");
        }
        if (this.config.connection.auth) {
            await this.#connection.writeCmd("AUTH", "LOGIN");
            this.#connection.assertCode(await this.#connection.readCmd(), 334);
            await this.#connection.writeCmd(btoa(this.config.connection.auth.username));
            this.#connection.assertCode(await this.#connection.readCmd(), 334);
            await this.#connection.writeCmd(btoa(this.config.connection.auth.password));
            this.#connection.assertCode(await this.#connection.readCmd(), CommandCode.AUTHO_SUCCESS);
        }
        await this.#cleanup();
    }
    #supportedFeatures;
    async #cleanup() {
        this.#connection.writeCmd("NOOP");
        while(true){
            const cmd = await this.#connection.readCmd();
            if (cmd && cmd.code === 250) return;
        }
    }
    config;
}
function resolveClientOptions(config) {
    return {
        debug: {
            log: config.debug?.log ?? false,
            allowUnsecure: config.debug?.allowUnsecure ?? false,
            encodeLB: config.debug?.encodeLB ?? false,
            noStartTLS: config.debug?.noStartTLS ?? false
        },
        connection: {
            hostname: config.connection.hostname,
            port: config.connection.port ?? (config.connection.tls ? 465 : 25),
            tls: config.connection.tls ?? false,
            auth: config.connection.auth
        },
        pool: config.pool ? config.pool === true ? {
            size: 2,
            timeout: 60000
        } : {
            size: config.pool.size ?? 2,
            timeout: config.pool.timeout ?? 60000
        } : undefined,
        client: {
            warning: config.client?.warning ?? "log",
            preprocessors: config.client?.preprocessors ?? []
        }
    };
}
const encoder7 = new TextEncoder();
function quotedPrintableEncode(data36, encLB = false) {
    data36.replaceAll("=", "=3D");
    if (!encLB) {
        data36 = data36.replaceAll(" \r\n", "=20\r\n").replaceAll(" \n", "=20\n");
    }
    const encodedData = Array.from(data36).map((ch)=>{
        const encodedChar = encoder7.encode(ch);
        if (encodedChar.length === 1) {
            const code39 = encodedChar[0];
            if (code39 >= 32 && code39 <= 126 && code39 !== 61) return ch;
            if (!encLB && (code39 === 10 || code39 === 13)) return ch;
            if (code39 === 9) return ch;
        }
        let enc = "";
        encodedChar.forEach((i83)=>{
            let c33 = i83.toString(16);
            if (c33.length === 1) c33 = "0" + c33;
            enc += `=${c33}`;
        });
        return enc;
    }).join("");
    let ret = "";
    const lines = Math.ceil(encodedData.length / 74) - 1;
    let offset = 0;
    for(let i1 = 0; i1 < lines; i1++){
        let old = encodedData.slice(i1 * 74 + offset, (i1 + 1) * 74);
        offset = 0;
        if (old.at(-1) === "=") {
            old = old.slice(0, old.length - 1);
            offset = -1;
        }
        if (old.at(-2) === "=") {
            old = old.slice(0, old.length - 2);
            offset = -2;
        }
        if (old.endsWith("\r") || old.endsWith("\n")) {
            ret += old;
        } else {
            ret += `${old}=\r\n`;
        }
    }
    ret += encodedData.slice(lines * 74);
    return ret;
}
function resolveAttachment(attachment) {
    if (attachment.encoding === "base64") {
        return {
            filename: attachment.filename,
            contentType: attachment.contentType,
            encoding: "binary",
            content: decode4(attachment.content)
        };
    } else {
        return attachment;
    }
}
function resolveContent({ text , html , mimeContent  }) {
    const newContent = [
        ...mimeContent ?? []
    ];
    if (text === "auto" && html) {
        text = html.replace(/<head((.|\n|\r)*?)<\/head>/g, "").replace(/<style((.|\n|\r)*?)<\/style>/g, "").replace(/<[^>]+>/g, "");
    }
    if (text) {
        newContent.push({
            mimeType: 'text/plain; charset="utf-8"',
            content: quotedPrintableEncode(text),
            transferEncoding: "quoted-printable"
        });
    }
    if (html) {
        newContent.push({
            mimeType: 'text/html; charset="utf-8"',
            content: quotedPrintableEncode(html),
            transferEncoding: "quoted-printable"
        });
    }
    return newContent;
}
function isSingleMail(mail) {
    return /^(([^<>()\[\]\\,;:\s@"]+@[a-zA-Z0-9\-]+\.([a-zA-Z0-9\-]+\.)*[a-zA-Z]{2,})|(<[^<>()\[\]\\,;:\s@"]+@[a-zA-Z0-9]+\.([a-zA-Z0-9\-]+\.)*[a-zA-Z]{2,}>)|([^<>]+ <[^<>()\[\]\\,;:\s@"]+@[a-zA-Z0-9]+\.([a-zA-Z0-9\-]+\.)*[a-zA-Z]{2,}>))$/.test(mail);
}
function parseSingleEmail(mail) {
    if (typeof mail !== "string") {
        return {
            mail: mail.mail,
            name: mail.name ?? ""
        };
    }
    const mailSplitRe = /^([^<]*)<([^>]+)>\s*$/;
    const res = mailSplitRe.exec(mail);
    if (!res) {
        return {
            mail,
            name: ""
        };
    }
    const [_, name3, email] = res;
    return {
        name: name3.trim(),
        mail: email.trim()
    };
}
function parseMailList(list) {
    if (typeof list === "string") return [
        parseSingleEmail(list)
    ];
    if (Array.isArray(list)) return list.map((v10)=>parseSingleEmail(v10));
    if ("mail" in list) {
        return [
            {
                mail: list.mail,
                name: list.name ?? ""
            }
        ];
    }
    return Object.entries(list).map(([name4, mail])=>({
            name: name4,
            mail
        }));
}
function validateEmailList(list) {
    const ok = [];
    const bad = [];
    list.forEach((mail)=>{
        if (isSingleMail(mail.mail)) {
            ok.push(mail);
        } else {
            bad.push(mail);
        }
    });
    return {
        ok,
        bad
    };
}
function validateHeaders(headers) {
    return !(Object.keys(headers).some((v11)=>v11.includes("\n") || v11.includes("\r")) || Object.values(headers).some((v12)=>v12.includes("\n") || v12.includes("\r")));
}
function resolveSendConfig(config) {
    const { to , cc =[] , bcc =[] , from , date =new Date().toUTCString().split(",")[1].slice(1) , subject , content , mimeContent , html , inReplyTo , replyTo , references , priority , attachments , internalTag , headers ,  } = config;
    return {
        to: parseMailList(to),
        cc: parseMailList(cc),
        bcc: parseMailList(bcc),
        from: parseSingleEmail(from),
        date,
        mimeContent: resolveContent({
            mimeContent,
            html,
            text: content
        }),
        replyTo: replyTo ? parseSingleEmail(replyTo) : undefined,
        inReplyTo,
        subject,
        attachments: attachments ? attachments.map((attachment)=>resolveAttachment(attachment)) : [],
        references,
        priority,
        internalTag,
        headers: headers ?? {}
    };
}
function validateConfig(config, client) {
    const errors = [];
    const warn = [];
    if (!isSingleMail(config.from.mail)) {
        errors.push(`The specified from adress is not a valid email adress.`);
    }
    if (config.replyTo && !isSingleMail(config.replyTo.mail)) {
        errors.push(`The specified replyTo adress is not a valid email adress.`);
    }
    const valTo = validateEmailList(config.to);
    if (valTo.bad.length > 0) {
        config.to = valTo.ok;
        valTo.bad.forEach((m19)=>{
            warn.push(`TO Email ${m19.mail} is not valid!`);
        });
    }
    const valCc = validateEmailList(config.cc);
    if (valCc.bad.length > 0) {
        config.to = valCc.ok;
        valCc.bad.forEach((m20)=>{
            warn.push(`CC Email ${m20.mail} is not valid!`);
        });
    }
    const valBcc = validateEmailList(config.bcc);
    if (valBcc.bad.length > 0) {
        config.to = valBcc.ok;
        valBcc.bad.forEach((m21)=>{
            warn.push(`BCC Email ${m21.mail} is not valid!`);
        });
    }
    if (config.to.length + config.cc.length + config.bcc.length === 0) {
        errors.push(`No valid emails provided!`);
    }
    if (config.mimeContent.length === 0) {
        errors.push(`No content provided!`);
    }
    if (!config.mimeContent.some((v13)=>v13.mimeType.includes("text/html") || v13.mimeType.includes("text/plain"))) {
        warn.push("You should provide at least html or text content!");
    }
    if (!validateHeaders(config.headers)) {
        errors.push(`Headers are not allowed to include linebreaks!`);
    }
    if (client.client.warning === "log" && warn.length > 0) {
        console.warn(warn.join("\n"));
    }
    if (client.client.warning === "error") {
        errors.push(...warn);
    }
    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
    return config;
}
class SMTPHandler {
    #internalClient;
    #clientConfig;
    constructor(config){
        const resolvedConfig = resolveClientOptions(config);
        resolvedConfig.client.preprocessors.push(validateConfig);
        this.#clientConfig = resolvedConfig;
        if (resolvedConfig.debug.log) {
            console.log("used resolved config");
            console.log(".debug");
            console.table(resolvedConfig.debug);
            console.log(".connection");
            console.table({
                ...resolvedConfig.connection,
                ...resolvedConfig.connection.auth ? {
                    auth: JSON.stringify(resolvedConfig.connection.auth)
                } : {}
            });
            console.log(".pool");
            console.table(resolvedConfig.pool);
        }
        const Client1 = resolvedConfig.pool ? resolvedConfig.pool.size > 1 ? SMTPWorkerPool : SMTPWorker : SMTPClient;
        this.#internalClient = new Client1(resolvedConfig);
    }
    send(config) {
        let resolvedConfig = resolveSendConfig(config);
        for(let i84 = 0; i84 < this.#clientConfig.client.preprocessors.length; i84++){
            const cb = this.#clientConfig.client.preprocessors[i84];
            resolvedConfig = cb(resolvedConfig, this.#clientConfig);
        }
        return this.#internalClient.send(resolvedConfig);
    }
    close() {
        return this.#internalClient.close();
    }
}
const args = mod6.parse(Deno.args);
function getArg(name5) {
    return args[name5] || args[name5.toLowerCase().replaceAll('_', '-')] || Deno.env.get("EDRYS_" + name5);
}
const address = getArg("ADDRESS") ?? "localhost:8000";
const secret = getArg("SECRET") ?? "secret";
if (secret == 'secret') mod.warning("For production, please specify a unique --secret to generate a secret private key. Currently using default.");
const serve_path = getArg("SERVE_PATH") ?? `./static`;
const config_class_creators = (getArg("CONFIG_CLASS_CREATORS_CSV") ?? "*").split(",");
getArg("HTTPS_CERT_FILE") ?? undefined;
getArg("HTTPS_KEY_FILE") ?? undefined;
const log_level = getArg("LOG_LEVEL") ?? "DEBUG";
const smtp_tls = getArg("SMTP_TLS") == "true";
const smtp_hostname = getArg("SMTP_HOST") ?? "";
const smtp_port = Number(getArg("SMTP_PORT") ?? "0");
const smtp_username = getArg("SMTP_USERNAME") ?? "";
const smtp_password = getArg("SMTP_PASSWORD") ?? "";
const smtp_from = getArg("SMTP_FROM") ?? "";
const data_engine = getArg("DATA_ENGINE") ?? "file";
const data_file_path = getArg("DATA_FILE_PATH") ?? ".edrys";
const data_s3_endpoint = getArg("DATA_S3_ENDPOINT") ?? "";
const data_s3_port = Number(getArg("DATA_S3_PORT") ?? "443");
const data_s3_use_ssl = getArg("DATA_S3_USE_SSL") == "true";
const data_s3_region = getArg("DATA_S3_REGION") ?? "";
const data_s3_access_key = getArg("DATA_S3_ACCESS_KEY") ?? "";
const data_s3_secret_key = getArg("DATA_S3_SECRET_KEY") ?? "";
const data_s3_bucket = getArg("DATA_S3_BUCKET") ?? "";
const frontend_address = getArg("FRONTEND_ADDRESS") ?? address;
const config_default_modules = JSON.parse(getArg("CONFIG_DEFAULT_MODULES_JSON") ?? "null") ?? [
    {
        url: "https://edrys-org.github.io/module-reference/",
        config: '',
        studentConfig: '',
        teacherConfig: '',
        stationConfig: '',
        width: "full",
        height: "tall"
    }, 
];
const jwt_lifetime_days = Number(getArg("JWT_LIFETIME_DAYS") ?? "30");
const jwt_keys_path = getArg("JWT_KEYS_PATH") ?? false;
const limit_msg_len = Number(getArg("LIMIT_MSG_LEN") ?? '10000');
const limit_state_len = Number(getArg("LIMIT_STATE_LEN") ?? '999000');
let ready = false;
let s3c;
const inMemoryStorage = {};
if (data_engine == "s3") {
    if (data_s3_endpoint == "" || data_s3_port == 0 || data_s3_region == "" || data_s3_access_key == "" || data_s3_secret_key == "" || data_s3_bucket == "") {
        throw new Error("Invalid Data S3 config");
    }
    s3c = new mod17.S3Client({
        endPoint: data_s3_endpoint,
        port: data_s3_port,
        useSSL: data_s3_use_ssl,
        region: data_s3_region,
        accessKey: data_s3_access_key,
        secretKey: data_s3_secret_key,
        bucket: data_s3_bucket,
        pathStyle: true
    });
} else if (data_engine == "file") {
    await mod5.ensureDir(data_file_path);
}
ready = true;
async function read(folder, file) {
    const path81 = `${data_file_path}/${folder}/${file}.json`;
    if (data_engine == "s3") {
        const res = await s3c.getObject(path81);
        if (res.status == 200) {
            return res.json();
        } else {
            throw new Error(`S3 Error (${res.status})`);
        }
    } else if (data_engine == "file") {
        await mod5.ensureDir(`${data_file_path}/${folder}`);
        return JSON.parse(await Deno.readTextFile(path81));
    } else {
        if (path81 in inMemoryStorage) return JSON.parse(inMemoryStorage[path81]);
        else throw new Error(`Not found: ${path81}`);
    }
}
async function write(folder, file, value70) {
    const text = JSON.stringify(value70);
    const path82 = `${data_file_path}/${folder}/${file}.json`;
    if (data_engine == "s3") {
        if (text == undefined) {
            return await s3c.deleteObject(path82);
        }
        await s3c.putObject(path82, text);
    } else if (data_engine == "file") {
        await mod5.ensureDir(`${data_file_path}/${folder}`);
        if (text == undefined) {
            return await Deno.remove(path82);
        }
        await Deno.writeTextFile(path82, text);
    } else {
        if (text == undefined) {
            delete inMemoryStorage[path82];
        } else {
            inMemoryStorage[path82] = text;
        }
    }
}
function setToValue(obj, pathArr, value71) {
    let i85 = 0;
    for(i85 = 0; i85 < pathArr.length - 1; i85++){
        obj = obj[pathArr[i85]];
        if (!obj[pathArr[i85 + 1]]) {
            obj[pathArr[i85 + 1]] = {};
        }
    }
    obj[pathArr[i85]] = value71;
    if (value71 === null) delete obj[pathArr[i85]];
}
var RoleName;
(function(RoleName1) {
    RoleName1["Student"] = "student";
    RoleName1["Teacher"] = "teacher";
})(RoleName || (RoleName = {}));
var ReservedRoomNames;
(function(ReservedRoomNames1) {
    ReservedRoomNames1["Lobby"] = "Lobby";
    ReservedRoomNames1["TeachersLounge"] = "Teacher's Lounge";
    ReservedRoomNames1["StationX"] = "Station *";
})(ReservedRoomNames || (ReservedRoomNames = {}));
function can_create_class(e70) {
    return config_class_creators.includes("*") || config_class_creators.includes(`*@${e70.split("@")[1]}`) || config_class_creators.filter((p38)=>p38.includes("/")).some((p39)=>new RegExp(p39, "g").test(e70)) || config_class_creators.includes(e70);
}
function validate_class(c34) {
    return typeof c34.id == "string" && typeof c34.dateCreated == "number" && validate_email(c34.createdBy) && validate_name(c34.name) && typeof c34.members == "object" && Object.entries(c34.members).every((e71)=>Object.values(RoleName).includes(e71[0])) && Object.entries(c34.members).every((e72)=>e72[1].every((v14, _i, _a)=>validate_email(v14))) && Array.isArray(c34.modules) && c34.modules.every((v15, _i, _a)=>validate_module(v15));
}
function validate_user(u15) {
    return validate_email(u15.email) && typeof u15.dateCreated == "number" && validate_human_name(u15.displayName) && u15.memberships.every((m22)=>validate_url(m22.instance) && typeof m22.class_id == "string" && validate_name(m22.class_name) && Object.values(RoleName).includes(m22.role));
}
function validate_email(e73) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e73);
}
function validate_name(n80) {
    return typeof n80 == "string" && /^([A-Za-z0-9 ]{1,100})$/.test(n80);
}
function validate_human_name(n81) {
    return typeof n81 == "string" && /^[^§¡@£%§¶^&*€#±!_+¢•ªº«\\/<>?$:;|=.,]{1,50}$/.test(n81);
}
function validate_url(u16) {
    try {
        new URL(u16);
        return true;
    } catch (_error) {
        return false;
    }
}
function validate_module(m23) {
    return validate_url(m23.url) && [
        "full",
        "half",
        "third"
    ].includes(m23.width) && [
        "tall",
        "medium",
        "short"
    ].includes(m23.height);
}
function validate_live_state(s32) {
    return JSON.stringify(s32).length < limit_state_len;
}
function validate_message(message, role) {
    return message.subject.length < 1000 && (message.body.length < limit_msg_len || role == RoleName.Teacher) && validate_url(message.module);
}
async function get_class_and_role(class_id, user_id) {
    try {
        if (!class_id) {
            return undefined;
        }
        const class_ = await read("classes", class_id);
        if (!class_) {
            return undefined;
        }
        if (class_.members.student?.includes(user_id)) {
            return [
                class_,
                RoleName.Student
            ];
        } else if (class_.members.teacher?.includes(user_id)) {
            return [
                class_,
                RoleName.Teacher
            ];
        } else {
            return undefined;
        }
    } catch (_error) {
        return undefined;
    }
}
let smtpClient;
let jwt_public_key;
let jwt_private_key;
if (smtp_hostname == "" || smtp_port == 0 || smtp_username == "" || smtp_password == "" || smtp_from == "") {
    smtpClient = {
        send: async function(params) {
            await new Promise((resolve7)=>setTimeout(resolve7, 1000));
            console.log("Email sent", params);
        }
    };
} else {
    smtpClient = new SMTPHandler({
        connection: {
            hostname: smtp_hostname,
            port: smtp_port,
            tls: smtp_tls,
            auth: {
                username: smtp_username,
                password: smtp_password
            }
        }
    });
}
if (jwt_keys_path) {
    jwt_private_key = await crypto.subtle.importKey("pkcs8", mod1.decode(await Deno.readTextFile(`${jwt_keys_path}/jwt_private_key`)), {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-512"
    }, true, [
        "sign"
    ]);
    jwt_public_key = await crypto.subtle.importKey("spki", mod1.decode(await Deno.readTextFile(`${jwt_keys_path}/jwt_public_key`)), {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-512"
    }, true, [
        "verify"
    ]);
} else {
    jwt_private_key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
        name: "HMAC",
        hash: "SHA-512"
    }, true, [
        "sign",
        "verify"
    ]);
}
async function sendToken(email) {
    ensureEmailValid(email);
    const token = getTotp(email).generate();
    await smtpClient.send({
        from: smtp_from,
        to: email,
        subject: "Your Edrys secret code",
        content: `Use this secret code in the Edrys app: ${token}`,
        html: `Use this secret code in the Edrys app: <em>${token}</em>`
    });
}
async function verifyToken(token, email) {
    ensureEmailValid(email);
    ensureTokenValid(token, email);
    return [
        await ensureUserExists(email),
        await mod15.create({
            alg: jwt_public_key ? "RS512" : "HS512",
            typ: "JWT"
        }, {
            sub: normaliseEmail(email),
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + jwt_lifetime_days)
        }, jwt_private_key), 
    ];
}
async function ensureUserExists(email) {
    if (!ready) {
        throw new Error(`Error ensuring user exists, data module not ready (${email})`);
    }
    try {
        await read("users", email);
        return false;
    } catch (_error) {
        let displayName = email.trim().split("@")[0].replaceAll(/[^A-Za-z ]+/g, " ").slice(0, 99);
        displayName = displayName.length <= 1 ? "New User" : displayName;
        await write("users", normaliseEmail(email), {
            email: normaliseEmail(email),
            displayName: displayName,
            dateCreated: new Date().getTime(),
            memberships: []
        });
        return true;
    }
}
function ensureTokenValid(token, email) {
    const res = getTotp(email).validate({
        token: token,
        window: 2
    });
    if (res == null || res < -1) {
        throw new Error(`Invalid token ${email} ${token}`);
    }
}
function getTotp(email) {
    return new mod18.TOTP({
        issuer: "App",
        label: "EmailToken",
        algorithm: "SHA3-256",
        digits: 6,
        period: 30,
        secret: mod18.Secret.fromUTF8(secret + email)
    });
}
function ensureEmailValid(email) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        throw new Error(`Invalid email ${email}`);
    }
}
async function ensureJwtValid(jwt) {
    try {
        return await mod15.verify(jwt, jwt_public_key ?? jwt_private_key);
    } catch (_error) {
        throw new Error(`JWT signiture validation error ${jwt}`);
    }
}
function normaliseEmail(email) {
    return email.trim().toLowerCase();
}
const middleware = async (ctx, next)=>{
    try {
        const jwt = ctx.request.headers?.get("Authorization")?.replace("Bearer ", "") || mod13.helpers.getQuery(ctx)["jwt"];
        if (!jwt) throw new Error("Unauthorized");
        const jwt_verified = await ensureJwtValid(jwt);
        ctx.state.user = jwt_verified.sub;
    } catch (_error) {}
    await next();
};
const router = new mod13.Router().get("/jwtPublicKey", async (ctx)=>{
    ctx.response.body = mod1.encode(await crypto.subtle.exportKey("spki", jwt_public_key));
}).get("/sendToken", async (ctx)=>{
    await sendToken(mod13.helpers.getQuery(ctx)["email"]);
    ctx.response.body = "Sent";
}).get("/verifyToken", async (ctx)=>{
    try {
        const [isNewbie, jwt] = await verifyToken(mod13.helpers.getQuery(ctx)["token"], mod13.helpers.getQuery(ctx)["email"]);
        ctx.response.body = [
            isNewbie,
            jwt
        ];
    } catch (error12) {
        console.log(error12);
        ctx.response.status = 401;
    }
});
const classes = {};
const router1 = new mod13.Router().get("/readUser", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    ctx.response.body = await read("users", ctx.state.user);
    ctx.response.status = 200;
}).get("/updateUser", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const user_new = JSON.parse(mod13.helpers.getQuery(ctx)["user"]);
    if (!user_new || ctx.state.user != user_new.email || !validate_user(user_new)) {
        ctx.response.status = 400;
        return;
    } else {
        const user_old = await read("users", ctx.state.user);
        user_new.dateCreated = user_old.dateCreated;
        const user = {
            ...user_old,
            ...user_new
        };
        await write("users", ctx.state.user, user);
        ctx.response.body = user;
        ctx.response.status = 200;
    }
}).get("/canCreateClass", (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    ctx.response.body = can_create_class(ctx.state.user);
    ctx.response.status = 200;
}).get("/readClass/:class_id", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    const res = await get_class_and_role(class_id, ctx.state.user);
    if (res == undefined) {
        ctx.response.status = 404;
        return;
    }
    const [class_, role] = res;
    if (role == RoleName.Student) {
        ctx.response.body = {
            id: class_.id,
            dateCreated: class_.dateCreated,
            createdBy: class_.createdBy,
            name: class_.name,
            modules: class_.modules.map((m24)=>({
                    url: m24.url,
                    config: m24.config,
                    studentConfig: m24.studentConfig,
                    width: m24.width,
                    height: m24.height
                })),
            members: {
                [RoleName.Student]: [
                    ctx.state.user
                ]
            }
        };
        ctx.response.status = 200;
    } else if (role == RoleName.Teacher) {
        ctx.response.body = class_;
        ctx.response.status = 200;
    } else {
        ctx.response.status = 404;
    }
}).get("/createClass", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    if (can_create_class(ctx.state.user)) {
        const new_class_id = nanoid();
        const new_class = {
            id: new_class_id,
            createdBy: ctx.state.user,
            dateCreated: new Date().getTime(),
            name: "My New Class",
            members: {
                "teacher": [
                    ctx.state.user
                ],
                "student": []
            },
            modules: config_default_modules
        };
        await write("classes", new_class_id, new_class);
        ctx.response.body = new_class_id;
        ctx.response.status = 200;
    }
}).get("/updateClass/:class_id", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    const class_new = JSON.parse(mod13.helpers.getQuery(ctx)["class"]);
    if (!class_new || class_id != class_new.id || !validate_class(class_new)) {
        ctx.response.status = 400;
        return;
    }
    const res = await get_class_and_role(class_id, ctx.state.user);
    if (typeof res == "undefined") {
        ctx.response.status = 404;
        return;
    }
    const [class_old, role] = res;
    class_new.dateCreated = class_old.dateCreated;
    class_new.createdBy = class_old.createdBy;
    class_new.members.teacher.push(ctx.state.user);
    class_new.members.teacher = [
        ...new Set(class_new.members.teacher)
    ];
    class_new.members.student = [
        ...new Set(class_new.members.student)
    ];
    if (role == RoleName.Student) {
        ctx.response.status = 404;
    } else if (role == RoleName.Teacher) {
        const class_ = {
            ...class_old,
            ...class_new
        };
        await write("classes", class_id, class_);
        for (const user_id of Object.keys(classes[class_id]?.users || [])){
            if (!class_new.members.student.includes(user_id) && !class_new.members.teacher.includes(user_id)) {
                delete classes[class_id]?.users[user_id];
            }
        }
        await onClassUpdated(class_id);
        ctx.response.body = class_;
        ctx.response.status = 200;
    } else {
        ctx.response.status = 404;
    }
}).get("/deleteClass/:class_id", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    const res = await get_class_and_role(class_id, ctx.state.user);
    if (typeof res == "undefined") {
        ctx.response.status = 404;
        return;
    }
    const [_, role] = res;
    if (role == RoleName.Teacher) {
        await Object.values(classes[class_id]?.users || []).flatMap((u17)=>u17.connections).forEach(async (c35)=>{
            await c35.target.close();
        });
        delete classes[class_id];
        await write("classes", class_id, undefined);
        ctx.response.body = "OK";
        ctx.response.status = 200;
    } else {
        ctx.response.status = 404;
    }
}).get("/readLiveClass/:class_id", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    const display_name = mod13.helpers.getQuery(ctx)["displayName"];
    const is_station = mod13.helpers.getQuery(ctx)["isStation"] == "true";
    const username = is_station ? display_name : ctx.state.user;
    const res = await get_class_and_role(class_id, ctx.state.user);
    if (typeof res == "undefined" || !validate_name(display_name) || is_station && display_name.includes("@")) {
        ctx.response.status = 404;
        return;
    }
    const target = ctx.sendEvents();
    const [_, role] = res;
    let live_class1 = classes[class_id];
    if (role != RoleName.Teacher && is_station) {
        ctx.response.status = 401;
        return;
    }
    if (!live_class1) {
        classes[class_id] = {
            autoAssign: undefined,
            users: {},
            rooms: {
                "Lobby": {
                    studentPublicState: "",
                    teacherPublicState: "",
                    teacherPrivateState: ""
                },
                "Teacher's Lounge": {
                    studentPublicState: "",
                    teacherPublicState: "",
                    teacherPrivateState: ""
                }
            }
        };
        live_class1 = classes[class_id];
    }
    let connection_id = "";
    if (live_class1.users[username]) {
        connection_id = nanoid();
        live_class1.users[username].connections ??= [];
        live_class1.users[username].connections.push({
            id: connection_id,
            target: target
        });
    } else {
        live_class1.users[username] = {
            displayName: display_name,
            room: is_station ? `Station ${display_name}` : ReservedRoomNames.Lobby,
            role: role,
            dateJoined: new Date().getTime(),
            handRaised: false,
            connections: [
                {
                    id: connection_id,
                    target: target
                }
            ]
        };
        if (is_station) {
            live_class1.rooms[`Station ${display_name}`] = {
                studentPublicState: "",
                teacherPublicState: "",
                teacherPrivateState: "",
                userLinked: username
            };
        }
    }
    await onClassUpdated(class_id);
    if (!classes[class_id]?.users[username] || !classes[class_id]?.users[username].connections.length) {
        target.close();
    }
    const kaInterval = setInterval(()=>{
        target.dispatchComment("ka");
    }, 1000);
    target.addEventListener("close", async (_e)=>{
        clearInterval(kaInterval);
        const live_class = classes[class_id];
        if (!live_class) {
            return;
        }
        mod.debug([
            "Disconnection",
            username
        ]);
        const all_connections = Object.values(live_class.users).flatMap((u18)=>u18.connections);
        if (all_connections.length == 1) {
            delete classes[class_id];
        } else if (!live_class.users[username]) {
            delete classes[class_id]?.users[username];
        } else if (live_class.users[username]?.connections?.length == 1) {
            delete classes[class_id]?.users[username];
            Object.entries(live_class.rooms).filter((r56)=>r56[1].userLinked == username).forEach((r57)=>{
                delete classes[class_id]?.rooms[r57[0]];
            });
        } else {
            live_class.users[username].connections = live_class.users[username].connections?.filter((c36)=>c36.id != connection_id);
            live_class.users[username].connections ??= [];
        }
        await onClassUpdated(class_id);
    });
}).get("/updateLiveClass/:class_id", async (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    if (!classes[class_id]) {
        ctx.response.status = 404;
        return;
    }
    const res = await get_class_and_role(class_id, ctx.state.user);
    if (typeof res == "undefined") {
        ctx.response.status = 404;
        return;
    }
    const [_, role] = res;
    const live_class = classes[class_id];
    if (!live_class) {
        ctx.response.status = 400;
        return;
    }
    const stationId = mod13.helpers.getQuery(ctx)["stationId"];
    const username = stationId || ctx.state.user;
    if (role != RoleName.Teacher && stationId) {
        ctx.response.status = 401;
        return;
    }
    const user = live_class.users[username];
    const update_str = mod13.helpers.getQuery(ctx)["update"];
    if (update_str.length > 100000) {
        ctx.response.status = 401;
        return;
    }
    const update = JSON.parse(update_str);
    const update_path_str = JSON.stringify(update.path);
    if (role == RoleName.Student) {
        const valid_student_updates = [
            [
                JSON.stringify([
                    "rooms",
                    user.room,
                    "studentPublicState"
                ]),
                validate_live_state, 
            ],
            [
                JSON.stringify([
                    "users",
                    username,
                    "displayName"
                ]),
                validate_human_name, 
            ],
            [
                JSON.stringify([
                    "users",
                    username,
                    "handRaised"
                ]),
                (v16)=>v16 === true || v16 === false, 
            ], 
        ];
        if (!valid_student_updates.some((u19)=>u19[0] == update_path_str && u19[1](update.value))) {
            ctx.response.status = 401;
            return;
        }
    } else if (role == RoleName.Teacher) {
        if (update.path.length == 3 && update.path[0] == 'users' && update.path[2] == 'room') {
            const dateJoiendPath = [
                ...update.path
            ];
            dateJoiendPath[2] = 'dateJoined';
            setToValue(classes[class_id], dateJoiendPath, new Date().getTime());
        }
    }
    setToValue(classes[class_id], update.path, update.value);
    await onClassUpdated(class_id);
    ctx.response.status = 200;
}).get("/sendMessage/:class_id", (ctx)=>{
    if (!ctx.state.user) ctx.throw(401);
    const class_id = ctx?.params?.class_id;
    const message = JSON.parse(mod13.helpers.getQuery(ctx)["message"]);
    const user_role = classes[class_id]?.users[ctx.state.user]?.role || RoleName.Student;
    if (!class_id || !validate_message(message, user_role) || validate_email(message.from) && message.from != ctx.state.user || !validate_email(message.from) && user_role == 'student') {
        ctx.response.status = 400;
        return;
    }
    if (sendMessage(class_id, message)) {
        ctx.response.status = 200;
    } else {
        ctx.response.status = 401;
    }
});
async function onClassUpdated(class_id) {
    const live_class = classes[class_id];
    if (!live_class) {
        return false;
    }
    mod.debug([
        "Class Update",
        class_id,
        live_class
    ]);
    for (const user_id of Object.keys(classes[class_id]?.users || [])){
        const user = live_class.users[user_id];
        const connections = user?.connections;
        if (!user || !connections) {
            continue;
        }
        let res = undefined;
        if (user.role == RoleName.Student) {
            res = {
                rooms: {
                    [user.room]: {
                        ...live_class.rooms[user.room],
                        teacherPrivateState: undefined
                    }
                },
                users: {
                    [user_id]: {
                        ...user
                    }
                }
            };
        } else if (user.role == RoleName.Teacher) {
            res = live_class;
        }
        connections.forEach((c37)=>c37.target.dispatchEvent(new mod13.ServerSentEvent("update", res)));
    }
    return true;
}
function sendMessage(class_id, message) {
    const live_class = classes[class_id];
    if (!live_class) return false;
    mod.debug([
        "Message to be sent",
        class_id,
        message
    ]);
    const user_from = live_class.users[message.from];
    if (!user_from) return true;
    const user_conns_in_room = Object.entries(classes[class_id]?.users || []).filter((u20)=>u20[1].room == user_from.room).flatMap((u21)=>u21[1].connections);
    for (const user_conn of user_conns_in_room){
        user_conn.target.dispatchEvent(new mod13.ServerSentEvent("message", {
            ...message,
            date: new Date().getTime()
        }));
    }
    return true;
}
const app = new mod13.Application();
if (frontend_address) {
    app.use((ctx, next)=>{
        ctx.response.headers.set("Access-Control-Allow-Origin", frontend_address);
        ctx.response.headers.set("Access-Control-Allow-Credential", "true");
        ctx.response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
        ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        return next();
    });
}
app.use(async (ctx, next)=>{
    await next();
    mod.info(`${new Date().toISOString()} ${ctx.request.method} ${ctx.request.url}`);
});
await mod.setup({
    handlers: {
        console: new mod.handlers.ConsoleHandler("DEBUG", {
            formatter: "{levelName} {datetime} {msg}"
        })
    },
    loggers: {
        default: {
            level: log_level,
            handlers: [
                "console"
            ]
        }
    }
});
const ping_router = new mod13.Router();
ping_router.get("/ping", (ctx)=>{
    ctx.response.body = address;
});
app.use(ping_router.routes());
app.use(ping_router.allowedMethods());
const auth_router = new mod13.Router().use("/auth", router.routes(), router.allowedMethods());
app.use(auth_router.routes());
app.use(auth_router.allowedMethods());
app.use(middleware);
const data_router = new mod13.Router().use("/data", router1.routes(), router1.allowedMethods());
app.use(data_router.routes());
app.use(data_router.allowedMethods());
app.use(async (context4, next)=>{
    try {
        await context4.send({
            root: serve_path,
            index: "index.html"
        });
    } catch  {
        next();
    }
});
const hostname = address.split(":")[0];
const port = address.split(":")[1];
mod.info(`Listening on ${hostname}:${port}`);
await app.listen({
    hostname: hostname,
    port: Number(port),
    alpnProtocols: [
        "h2"
    ]
});
