"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NBuffer {
    __buffer;
    readOffset = 0;
    writeOffset = 0;
    endian = "little";
    constructor(a) {
        this.__buffer = typeof a == "number" ? Buffer.alloc(a) : a;
    }
    readInt8() {
        const value = this.__buffer.readInt8(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int8;
        return value;
    }
    readInt16() {
        const value = this.endian == "little" ? this.__buffer.readInt16LE(this.readOffset) : this.__buffer.readInt16BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int16;
        return value;
    }
    readInt32() {
        const value = this.endian == "little" ? this.__buffer.readInt32LE(this.readOffset) : this.__buffer.readInt32BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int32;
        return value;
    }
    readInt64() {
        const value = this.endian == "little" ? this.__buffer.readBigInt64LE(this.readOffset) : this.__buffer.readBigInt64BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int64;
        return value;
    }
    readUInt8() {
        const value = this.__buffer.readUInt8(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int8;
        return value;
    }
    readUInt16() {
        const value = this.endian == "little" ? this.__buffer.readUInt16LE(this.readOffset) : this.__buffer.readUInt16BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int16;
        return value;
    }
    readUInt32() {
        const value = this.endian == "little" ? this.__buffer.readUInt32LE(this.readOffset) : this.__buffer.readUInt32BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int32;
        return value;
    }
    readUInt64() {
        const value = this.endian == "little" ? this.__buffer.readBigUInt64LE(this.readOffset) : this.__buffer.readBigUInt64BE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Int64;
        return value;
    }
    readFloat() {
        const value = this.endian == "little" ? this.__buffer.readFloatLE(this.readOffset) : this.__buffer.readFloatBE(this.readOffset);
        this.readOffset += NBuffer.SizeOf.Float;
        return value;
    }
    readDouble() {
        const value = this.endian == "little" ? this.__buffer.readDoubleLE(this.readOffset) : this.__buffer.readDoubleBE(this.readOffset);
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
            }
        return arr;
    }
    readString(size, encoding) {
        const value = this.__buffer.toString(encoding, this.readOffset, this.readOffset + size);
        this.readOffset += size;
        return value;
    }
    writeInt8(value) {
        this.writeOffset = this.__buffer.writeInt8(value, this.writeOffset);
    }
    writeInt16(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeInt16LE(value, this.writeOffset) : this.__buffer.writeInt16BE(value, this.writeOffset);
    }
    writeInt32(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeInt32LE(value, this.writeOffset) : this.__buffer.writeInt32BE(value, this.writeOffset);
    }
    writeInt64(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeBigInt64LE(value, this.writeOffset) : this.__buffer.writeBigInt64BE(value, this.writeOffset);
    }
    writeUInt8(value) {
        this.writeOffset = this.__buffer.writeUInt8(value, this.writeOffset);
    }
    writeUInt16(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeUInt16LE(value, this.writeOffset) : this.__buffer.writeUInt16BE(value, this.writeOffset);
    }
    writeUInt32(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeUInt32LE(value, this.writeOffset) : this.__buffer.writeUInt32BE(value, this.writeOffset);
    }
    writeUInt64(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeBigUInt64LE(value, this.writeOffset) : this.__buffer.writeBigUInt64BE(value, this.writeOffset);
    }
    writeFloat(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeFloatLE(value, this.writeOffset) : this.__buffer.writeFloatBE(value, this.writeOffset);
    }
    writeDouble(value) {
        this.writeOffset = this.endian == "little" ? this.__buffer.writeDoubleLE(value, this.writeOffset) : this.__buffer.writeDoubleBE(value, this.writeOffset);
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
        this.writeOffset += this.__buffer.write(str, this.writeOffset, encoding);
    }
    write(buffer) {
        if (Buffer.isBuffer(buffer)) {
            this.__buffer.set(buffer, this.writeOffset);
            this.writeOffset += buffer.length;
        }
        else
            this.write(buffer.__buffer);
    }
    subarray(size) {
        const buffer = this.__buffer.subarray(this.writeOffset, this.writeOffset + size);
        this.writeOffset += size;
        return new NBuffer(buffer);
    }
    toString() {
        return String(this.__buffer).replace("Buffer", "NBuffer");
    }
    toJSON() {
        return {
            type: 'NBuffer',
            data: [...this.__buffer.toJSON().data]
        };
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