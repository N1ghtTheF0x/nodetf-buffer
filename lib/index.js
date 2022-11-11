"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
class NBuffer {
    static DEFAULT_ENDIAN = "little";
    #buffer;
    readOffset = 0;
    writeOffset = 0;
    endian;
    static isNBuffer(obj) {
        return obj instanceof NBuffer;
    }
    static read(path) {
        return new this((0, node_fs_1.readFileSync)(path));
    }
    static async readA(path) {
        return new this(await (0, promises_1.readFile)(path));
    }
    static write(path, buffer) {
        return (0, node_fs_1.writeFileSync)(path, buffer.#buffer);
    }
    static writeA(path, buffer) {
        return (0, promises_1.writeFile)(path, buffer.#buffer);
    }
    constructor(a) {
        this.#buffer = typeof a == "number" ? Buffer.alloc(a) : Buffer.isBuffer(a) ? a : Buffer.from(a);
        this.endian = NBuffer.DEFAULT_ENDIAN;
    }
    getNodeJSBuffer() {
        return this.#buffer;
    }
    readInt8() {
        const value = this.#buffer.readInt8(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int8;
        return value;
    }
    readInt16() {
        const value = this.endian == "little" ? this.#buffer.readInt16LE(this.readOffset) : this.#buffer.readInt16BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int16;
        return value;
    }
    readInt32() {
        const value = this.endian == "little" ? this.#buffer.readInt32LE(this.readOffset) : this.#buffer.readInt32BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int32;
        return value;
    }
    readInt64() {
        const value = this.endian == "little" ? this.#buffer.readBigInt64LE(this.readOffset) : this.#buffer.readBigInt64BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int64;
        return value;
    }
    readUInt8() {
        const value = this.#buffer.readUInt8(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int8;
        return value;
    }
    readUInt16() {
        const value = this.endian == "little" ? this.#buffer.readUInt16LE(this.readOffset) : this.#buffer.readUInt16BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int16;
        return value;
    }
    readUInt32() {
        const value = this.endian == "little" ? this.#buffer.readUInt32LE(this.readOffset) : this.#buffer.readUInt32BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int32;
        return value;
    }
    readUInt64() {
        const value = this.endian == "little" ? this.#buffer.readBigUInt64LE(this.readOffset) : this.#buffer.readBigUInt64BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int64;
        return value;
    }
    readFloat() {
        const value = this.endian == "little" ? this.#buffer.readFloatLE(this.readOffset) : this.#buffer.readFloatBE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Float;
        return value;
    }
    readDouble() {
        const value = this.endian == "little" ? this.#buffer.readDoubleLE(this.readOffset) : this.#buffer.readDoubleBE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Double;
        return value;
    }
    readArray(size, type = NBuffer.SizeOf.Int8) {
        const arr = [];
        for (var i = 0; i < size; i++)
            switch (type) {
                case NBuffer.SizeOf.Int8:
                    arr.push(this.readInt8());
                    break;
                case NBuffer.SizeOf.Int16:
                    arr.push(this.readInt16());
                    break;
                case NBuffer.SizeOf.Int32:
                    arr.push(this.readInt32());
                    break;
                case NBuffer.SizeOf.Int64:
                    arr.push(this.readInt64());
                    break;
            }
        return arr;
    }
    readUArray(size, type = NBuffer.SizeOf.Int8) {
        const arr = [];
        for (var i = 0; i < size; i++)
            switch (type) {
                case NBuffer.SizeOf.Int8:
                    arr.push(this.readUInt8());
                    break;
                case NBuffer.SizeOf.Int16:
                    arr.push(this.readUInt16());
                    break;
                case NBuffer.SizeOf.Int32:
                    arr.push(this.readUInt32());
                    break;
                case NBuffer.SizeOf.Int64:
                    arr.push(this.readUInt64());
                    break;
            }
        return arr;
    }
    readString(size, encoding) {
        const value = this.#buffer.toString(encoding, this.readOffset, this.readOffset + size);
        this.readOffset += size;
        return value;
    }
    readStruct(struct) {
        const obj = {};
        for (const [key, type] of Object.entries(struct)) {
            switch (type) {
                case "double":
                    obj[key] = this.readDouble();
                    break;
                case "float":
                    obj[key] = this.readFloat();
                    break;
                case "int16":
                    obj[key] = this.readInt16();
                    break;
                case "int32":
                    obj[key] = this.readInt32();
                    break;
                case "int64":
                    obj[key] = this.readInt64();
                    break;
                case "int8":
                    obj[key] = this.readInt8();
                    break;
                case "uint16":
                    obj[key] = this.readUInt16();
                    break;
                case "uint32":
                    obj[key] = this.readUInt32();
                    break;
                case "uint64":
                    obj[key] = this.readUInt64();
                    break;
                case "uint8":
                    obj[key] = this.readUInt8();
                    break;
                default:
                    if (typeof type == "function")
                        obj[key] = type(this);
                    else if (typeof type == "object")
                        obj[key] = this.readStruct(type);
            }
        }
        return obj;
    }
    writeInt8(value) {
        this.writeOffset = this.#buffer.writeInt8(value, this.writeOffset);
    }
    writeInt16(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt16LE(value, this.writeOffset) : this.#buffer.writeInt16BE(value, this.writeOffset);
    }
    writeInt32(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt32LE(value, this.writeOffset) : this.#buffer.writeInt32BE(value, this.writeOffset);
    }
    writeInt64(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigInt64LE(value, this.writeOffset) : this.#buffer.writeBigInt64BE(value, this.writeOffset);
    }
    writeUInt8(value) {
        this.writeOffset = this.#buffer.writeUInt8(value, this.writeOffset);
    }
    writeUInt16(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt16LE(value, this.writeOffset) : this.#buffer.writeUInt16BE(value, this.writeOffset);
    }
    writeUInt32(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt32LE(value, this.writeOffset) : this.#buffer.writeUInt32BE(value, this.writeOffset);
    }
    writeUInt64(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigUInt64LE(value, this.writeOffset) : this.#buffer.writeBigUInt64BE(value, this.writeOffset);
    }
    writeFloat(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeFloatLE(value, this.writeOffset) : this.#buffer.writeFloatBE(value, this.writeOffset);
    }
    writeDouble(value) {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeDoubleLE(value, this.writeOffset) : this.#buffer.writeDoubleBE(value, this.writeOffset);
    }
    writeArray(arr, type = NBuffer.SizeOf.Int8) {
        for (const num of arr) {
            switch (type) {
                case NBuffer.SizeOf.Int8:
                    this.writeInt8(num);
                    break;
                case NBuffer.SizeOf.Int16:
                    this.writeInt16(num);
                    break;
                case NBuffer.SizeOf.Int32:
                    this.writeInt32(num);
                    break;
            }
        }
    }
    writeString(str, encoding) {
        this.writeOffset += this.#buffer.write(str, this.writeOffset, encoding);
    }
    write(buffer) {
        if (Buffer.isBuffer(buffer)) {
            this.#buffer.set(buffer, this.writeOffset);
            this.writeOffset += buffer.length;
        }
        else
            this.write(buffer.#buffer);
    }
    subarray(size) {
        const buffer = this.#buffer.subarray(this.writeOffset, this.writeOffset + size);
        this.readOffset += size;
        return new NBuffer(buffer);
    }
    get [Symbol.toStringTag]() {
        return "NBuffer";
    }
    toJSON() {
        return {
            type: 'NBuffer',
            data: [...this.#buffer.toJSON().data]
        };
    }
    *[Symbol.iterator]() {
        for (const byte of this.#buffer) {
            yield byte;
        }
    }
    get length() {
        return this.#buffer.byteLength;
    }
}
(function (NBuffer) {
    let SizeOf;
    (function (SizeOf) {
        SizeOf[SizeOf["Int8"] = 1] = "Int8";
        SizeOf[SizeOf["Int16"] = 2] = "Int16";
        SizeOf[SizeOf["Int32"] = 4] = "Int32";
        SizeOf[SizeOf["Int64"] = 8] = "Int64";
        SizeOf[SizeOf["Float"] = 4] = "Float";
        SizeOf[SizeOf["Double"] = 8] = "Double";
    })(SizeOf = NBuffer.SizeOf || (NBuffer.SizeOf = {}));
})(NBuffer || (NBuffer = {}));
exports.default = NBuffer;
//# sourceMappingURL=index.js.map