import { PathLike, readFileSync, writeFileSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"

import { inflateSync, deflateSync, gzipSync, gunzipSync, brotliCompressSync, brotliDecompressSync } from "node:zlib"

/**
 * A class similar to Java's "Number-Buffers"
 */
class NBuffer
{
    /**
     * The default endianess of every Buffercreation. Can be changed if the other one is prefered
     */
    static DEFAULT_ENDIAN: NBuffer.Endian = "little"
    /**
     * The NodeJS Buffer as a reference
     */
    #buffer: Buffer
    /**
     * The number of bytes already read. Should be lower than NBuffer.length
     */
    readOffset: number = 0
    /**
     * The number of bytes already written. Should be lower than NBuffer.length
     */
    writeOffset: number = 0
    /**
     * The endianess of this Buffer
     */
    endian: NBuffer.Endian
    /**
     * Check if `obj` is a NBuffer
     * @param obj The JavaScript Object
     * @returns The truth
     */
    static isNBuffer(obj: any): obj is NBuffer
    {
        return obj instanceof NBuffer
    }
    /**
     * Read a Buffer in Sync
     * @param path Path to the file
     * @returns A Buffer from that file
     */
    static read(path: PathLike)
    {
        return new this(readFileSync(path))
    }
    /**
     * Read a Buffer in Async
     * @param path Path to the file
     * @returns A Promise that contains that Buffer from that file
     */
    static async readA(path: PathLike)
    {
        return new this(await readFile(path))
    }
    /**
     * Write the `buffer` to `path` in Sync
     * @param path Path to write the content of `buffer`
     * @param buffer The buffer to write
     * @returns nothing
     */
    static write(path: PathLike,buffer: NBuffer)
    {
        return writeFileSync(path,buffer.#buffer)
    }
    /**
     * Write the `buffer` to `path` in Async
     * @param path Path to write the content of `buffer`
     * @param buffer The buffer to write
     * @returns A Promise that contains nothing
     */
    static writeA(path: PathLike,buffer: NBuffer)
    {
        return writeFile(path,buffer.#buffer)
    }
    /**
     * Create a `NBuffer` from a NodeJS Buffer
     * @param buffer 
     */
    constructor(buffer: Buffer)
    /**
     * Create a `NBuffer` from allocating
     * @param size The size of the Buffer in bytes (like `Buffer.alloc`)
     */
    constructor(size: number)
    /**
     * Create a `NBuffer` from `ArrayBuffer`
     * @param array The ArrayBuffer to use
     */
    constructor(array: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>)
    constructor(a: Buffer | number | WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>)
    {
        this.#buffer = typeof a == "number" ? Buffer.alloc(a) : Buffer.isBuffer(a) ? a : Buffer.from(a)
        this.endian = NBuffer.DEFAULT_ENDIAN
    }
    /**
     * Get the NodeJS Buffer used as reference
     * @returns The reference to the NodeJS Buffer
     */
    getNodeJSBuffer()
    {
        return this.#buffer
    }
    /**
     * Read an int8/char/byte
     * @returns that
     */
    readInt8()
    {
        const value = this.#buffer.readInt8(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int8
        return value
    }
    /**
     * Read an int16/short
     * @returns that
     */
    readInt16()
    {
        const value = this.endian == "little" ? this.#buffer.readInt16LE(this.readOffset) : this.#buffer.readInt16BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int16
        return value
    }
    /**
     * Read an int32/int
     * @returns that
     */
    readInt32()
    {
        const value = this.endian == "little" ? this.#buffer.readInt32LE(this.readOffset) : this.#buffer.readInt32BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int32
        return value
    }
    /**
     * Read an int64/long
     * @returns that
     */
    readInt64()
    {
        const value = this.endian == "little" ? this.#buffer.readBigInt64LE(this.readOffset) : this.#buffer.readBigInt64BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int64
        return value
    }
    /**
     * Read an unsigned int8/char/byte
     * @returns that
     */
    readUInt8()
    {
        const value = this.#buffer.readUInt8(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int8
        return value
    }
    /**
     * Read an unsigned int16/short
     * @returns that
     */
    readUInt16()
    {
        const value = this.endian == "little" ? this.#buffer.readUInt16LE(this.readOffset) : this.#buffer.readUInt16BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int16
        return value
    }
    /**
     * Read an unsigned int32/int
     * @returns that
     */
    readUInt32()
    {
        const value = this.endian == "little" ? this.#buffer.readUInt32LE(this.readOffset) : this.#buffer.readUInt32BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int32
        return value
    }
    /**
     * Read an unsigned int64/long
     * @returns that
     */
    readUInt64()
    {
        const value = this.endian == "little" ? this.#buffer.readBigUInt64LE(this.readOffset) : this.#buffer.readBigUInt64BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int64
        return value
    }
    /**
     * Read an float
     * @returns that
     */
    readFloat()
    {
        const value = this.endian == "little" ? this.#buffer.readFloatLE(this.readOffset) : this.#buffer.readFloatBE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Float
        return value
    }
    /**
     * Read an double
     * @returns that
     */
    readDouble()
    {
        const value = this.endian == "little" ? this.#buffer.readDoubleLE(this.readOffset) : this.#buffer.readDoubleBE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Double
        return value
    }
    /**
     * Read an Array as a `type` Array with the length `size`
     * @param size The length of the Array
     * @param type The type of number to read
     */
    readArray(size: number,type: NBuffer.SizeOf.Int64): Array<bigint>
    readArray(size: number,type: NBuffer.SizeOf): Array<number>
    readArray(size: number,type: NBuffer.SizeOf = NBuffer.SizeOf.Int8)
    {
        const arr = []

        for(var i = 0;i < size;i++)
            switch(type)
            {
                case NBuffer.SizeOf.Int8:
                    arr.push(this.readInt8())
                    break
                case NBuffer.SizeOf.Int16:
                    arr.push(this.readInt16())
                    break
                case NBuffer.SizeOf.Int32:
                    arr.push(this.readInt32())
                    break
                case NBuffer.SizeOf.Int64:
                    arr.push(this.readInt64())
                    break
            }

        return arr
    }
    /**
     * Read an Array as a unsigned `type` Array with the length `size`. `float` and `double` cannot be read from this
     * @param size The length of the Array
     * @param type The type of number to read
     */
    readUArray(size: number,type: NBuffer.SizeOf.Int64): Array<bigint>
    readUArray(size: number,type: NBuffer.SizeOf): Array<number>
    readUArray(size: number,type: NBuffer.SizeOf = NBuffer.SizeOf.Int8)
    {
        const arr = []

        for(var i = 0;i < size;i++)
            switch(type)
            {
                case NBuffer.SizeOf.Int8:
                    arr.push(this.readUInt8())
                    break
                case NBuffer.SizeOf.Int16:
                    arr.push(this.readUInt16())
                    break
                case NBuffer.SizeOf.Int32:
                    arr.push(this.readUInt32())
                    break
                case NBuffer.SizeOf.Int64:
                    arr.push(this.readUInt64())
                    break
            }

        return arr
    }
    /**
     * Read a string with the length `size` as a `encoding`
     * @param size The length of the string
     * @param encoding The encoding of the string. Default is `utf-8` as in `Buffer.toString`
     * @returns that
     */
    readString(size: number,encoding?: BufferEncoding)
    {
        const value = this.#buffer.toString(encoding,this.readOffset,this.readOffset+size)
        this.readOffset += size
        return value
    }
    /**
     * Read the content of the Buffer as a struct like in C/C++
     * @param struct The template of the Struct
     * @returns The struct with values
     */
    readStruct(struct: NBuffer.Struct)
    {
        const obj: Record<string,any> = {}
        for(const [key,type] of Object.entries(struct))
        {
            switch(type)
            {
                case "double":
                    obj[key] = this.readDouble()
                    break
                case "float":
                    obj[key] = this.readFloat()
                    break
                case "int16":
                    obj[key] = this.readInt16()
                    break
                case "int32":
                    obj[key] = this.readInt32()
                    break
                case "int64":
                    obj[key] = this.readInt64()
                    break
                case "int8":
                    obj[key] = this.readInt8()
                    break
                case "uint16":
                    obj[key] = this.readUInt16()
                    break
                case "uint32":
                    obj[key] = this.readUInt32()
                    break
                case "uint64":
                    obj[key] = this.readUInt64()
                    break
                case "uint8":
                    obj[key] = this.readUInt8()
                    break
                default:
                    if(typeof type == "function") obj[key] = type(this)
                    else if(typeof type == "object") obj[key] = this.readStruct(type)
            }
        }
        return obj
    }
    /**
     * Write an int8/char/byte
     * @param value The value to write
     */
    writeInt8(value: number)
    {
        this.writeOffset = this.#buffer.writeInt8(value,this.writeOffset)
    }
    /**
     * Write an int16/short
     * @param value The value to write
     */
    writeInt16(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt16LE(value,this.writeOffset) : this.#buffer.writeInt16BE(value,this.writeOffset)
    }
    /**
     * Write an int32/int
     * @param value The value to write
     */
    writeInt32(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt32LE(value,this.writeOffset) : this.#buffer.writeInt32BE(value,this.writeOffset)
    }
    /**
     * Write an int64/long
     * @param value The value to write
     */
    writeInt64(value: bigint)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigInt64LE(value,this.writeOffset) : this.#buffer.writeBigInt64BE(value,this.writeOffset)
    }
    /**
     * Write an unsigned int8/char/byte
     * @param value The value to write
     */
    writeUInt8(value: number)
    {
        this.writeOffset = this.#buffer.writeUInt8(value,this.writeOffset)
    }
    /**
     * Write an unsigned int16/short
     * @param value The value to write
     */
    writeUInt16(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt16LE(value,this.writeOffset) : this.#buffer.writeUInt16BE(value,this.writeOffset)
    }
    /**
     * Write an unsigned int32/int
     * @param value The value to write
     */
    writeUInt32(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt32LE(value,this.writeOffset) : this.#buffer.writeUInt32BE(value,this.writeOffset)
    }
    /**
     * Write an unsigned int64/long
     * @param value The value to write
     */
    writeUInt64(value: bigint)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigUInt64LE(value,this.writeOffset) : this.#buffer.writeBigUInt64BE(value,this.writeOffset)
    }
    /**
     * Write an float
     * @param value The value to write
     */
    writeFloat(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeFloatLE(value,this.writeOffset) : this.#buffer.writeFloatBE(value,this.writeOffset)
    }
    /**
     * Write an double
     * @param value The value to write
     */
    writeDouble(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeDoubleLE(value,this.writeOffset) : this.#buffer.writeDoubleBE(value,this.writeOffset)
    }
    /**
     * Write the `arr` of `type` to the Buffer
     * @param arr The Array as input
     * @param type The type of number to write
     */
    writeArray(arr: ReadonlyArray<bigint>,type: NBuffer.SizeOf.Int64): void
    writeArray(arr: ReadonlyArray<number>,type: NBuffer.SizeOf): void
    writeArray(arr: ReadonlyArray<bigint | number>,type: NBuffer.SizeOf = NBuffer.SizeOf.Int8)
    {
        for(const num of arr)
        {
            switch(type)
            {
                case NBuffer.SizeOf.Int8:
                    this.writeInt8(num as number)
                    break
                case NBuffer.SizeOf.Int16:
                    this.writeInt16(num as number)
                    break
                case NBuffer.SizeOf.Int32:
                    this.writeInt32(num as number)
                    break
                case NBuffer.SizeOf.Int64:
                    this.writeInt64(num as bigint)
                    break
            }
        }
    }
    /**
     * Write the `arr` of unsigned `type` to the Buffer. `float` and `double` are not available
     * @param arr The Array as input
     * @param type The type of number to write
     */
    writeUArray(arr: ReadonlyArray<bigint>,type: NBuffer.SizeOf.Int64): void
    writeUArray(arr: ReadonlyArray<number>,type: NBuffer.SizeOf): void
    writeUArray(arr: ReadonlyArray<bigint | number>,type: NBuffer.SizeOf = NBuffer.SizeOf.Int8)
    {
        for(const num of arr)
        {
            switch(type)
            {
                case NBuffer.SizeOf.Int8:
                    this.writeUInt8(num as number)
                    break
                case NBuffer.SizeOf.Int16:
                    this.writeUInt16(num as number)
                    break
                case NBuffer.SizeOf.Int32:
                    this.writeUInt32(num as number)
                    break
                case NBuffer.SizeOf.Int64:
                    this.writeUInt64(num as bigint)
                    break
            }
        }
    }
    /**
     * Write the string with the `encoding` to the buffer
     * @param str The string as input
     * @param encoding THe encoding of the string. Default is `utf-8`
     */
    writeString(str: string,encoding?: BufferEncoding)
    {
        this.writeOffset += this.#buffer.write(str,this.writeOffset,encoding)
    }
    /**
     * Write a NBuffer/NodeJS Buffer to this Buffer
     * @param buffer The Buffer as input
     */
    write(buffer: NBuffer): void
    write(buffer: Buffer): void
    write(buffer: NBuffer | Buffer)
    {
        if(Buffer.isBuffer(buffer))
        {
            this.#buffer.set(buffer,this.writeOffset)
            this.writeOffset += buffer.length
        }
        else this.write(buffer.#buffer)
    }
    /**
     * Same as `Buffer.subarray` but adds to the offset and endian
     * @param size How much to cut
     * @returns The new Buffer
     */
    subarray(size: number)
    {
        const buffer = this.#buffer.subarray(this.writeOffset,this.writeOffset+size)
        this.readOffset += size
        const nbuffer = new NBuffer(buffer)
        nbuffer.endian = this.endian
        return nbuffer
    }
    get [Symbol.toStringTag]()
    {
        return "NBuffer"
    }
    /**
     * Compresses the Buffer with the compression `type`
     * @param type The type of compression
     */
    compress(type: NBuffer.Compression): NBuffer
    /**
     * Compresses the Buffer with the compression `type` into a new Buffer
     * @param type The type of input
     * @param size How much to cut
     */
    compress(type: NBuffer.Compression,size: number): NBuffer
    compress(type: NBuffer.Compression,size?: number)
    {
        const buffer = size ? this.subarray(size) : this
        switch(type)
        {
            case "brotli":
                return new NBuffer(brotliCompressSync(buffer.#buffer))
            case "gzip":
                return new NBuffer(gzipSync(buffer.#buffer))
            case "zlib":
                return new NBuffer(inflateSync(buffer.#buffer))
        }
    }
    /**
     * Decompresses the Buffer with the compression `type`
     * @param type The type of compression
     */
    decompress(type: NBuffer.Compression): NBuffer
    /**
     * Decompresses the Buffer with the compression `type` into a new Buffer
     * @param type The type of input
     * @param size How much to cut
     */
    decompress(type: NBuffer.Compression,size: number): NBuffer
    decompress(type: NBuffer.Compression,size?: number)
    {
        const buffer = size ? this.subarray(size) : this
        switch(type)
        {
            case "brotli":
                return new NBuffer(brotliDecompressSync(buffer.#buffer))
            case "gzip":
                return new NBuffer(gunzipSync(buffer.#buffer))
            case "zlib":
                return new NBuffer(deflateSync(buffer.#buffer))
        }
    }
    /**
     * Returns the Buffer as a JSON. Same as `Buffer.toJSON`, but the `type` field is `NBuffer`
     */
    toJSON(): NBuffer.JSON
    {
        return {
            type: 'NBuffer',
            data: [...this.#buffer.toJSON().data]
        }
    }
    *[Symbol.iterator]()
    {
        for(var i = 0;i < this.length;i++)
        {
            yield this.readInt8()
        }
    }
    /**
     * Redirects to `Buffer.byteLength`
     */
    get length()
    {
        return this.#buffer.byteLength
    }
}

namespace NBuffer
{
    export type Endian = "little" | "big"
    export type Compression = "gzip" | "zlib" | "brotli"
    export enum SizeOf
    {
        Int8 = 1,
        Int16 = 2,
        Int32 = 4,
        Int64 = 8,
        Float = 4,
        Double = 8
    }
    export type Integer = "int8" | "int16" | "int32" | "uint8" | "uint16" | "uint32"
    export type BigInteger = "int64" | "uint64"
    export type Float = "float"
    export type Double = "double"
    export type Number = Integer | BigInteger | Float | Double
    export type Struct = {
        [propertyName: string]: Struct.Property
    }
    export namespace Struct
    {
        export type Property = Number | Struct | ((buffer: NBuffer) => any)
    }
    export interface JSON
    {
        type: 'NBuffer'
        data: ReadonlyArray<number>
    }
}

export default NBuffer