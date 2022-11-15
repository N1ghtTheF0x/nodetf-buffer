import { PathLike, readFileSync, writeFileSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"

class NBuffer
{
    static DEFAULT_ENDIAN: NBuffer.Endian = "little"
    #buffer: Buffer
    readOffset: number = 0
    writeOffset: number = 0
    endian: NBuffer.Endian
    static isNBuffer(obj: any): obj is NBuffer
    {
        return obj instanceof NBuffer
    }
    static read(path: PathLike)
    {
        return new this(readFileSync(path))
    }
    static async readA(path: PathLike)
    {
        return new this(await readFile(path))
    }
    static write(path: PathLike,buffer: NBuffer)
    {
        return writeFileSync(path,buffer.#buffer)
    }
    static writeA(path: PathLike,buffer: NBuffer)
    {
        return writeFile(path,buffer.#buffer)
    }
    constructor(buffer: Buffer)
    constructor(size: number)
    constructor(array: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>)
    constructor(a: Buffer | number | WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>)
    {
        this.#buffer = typeof a == "number" ? Buffer.alloc(a) : Buffer.isBuffer(a) ? a : Buffer.from(a)
        this.endian = NBuffer.DEFAULT_ENDIAN
    }
    getNodeJSBuffer()
    {
        return this.#buffer
    }
    readInt8()
    {
        const value = this.#buffer.readInt8(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int8
        return value
    }
    readInt16()
    {
        const value = this.endian == "little" ? this.#buffer.readInt16LE(this.readOffset) : this.#buffer.readInt16BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int16
        return value
    }
    readInt32()
    {
        const value = this.endian == "little" ? this.#buffer.readInt32LE(this.readOffset) : this.#buffer.readInt32BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int32
        return value
    }
    readInt64()
    {
        const value = this.endian == "little" ? this.#buffer.readBigInt64LE(this.readOffset) : this.#buffer.readBigInt64BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int64
        return value
    }
    readUInt8()
    {
        const value = this.#buffer.readUInt8(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int8
        return value
    }
    readUInt16()
    {
        const value = this.endian == "little" ? this.#buffer.readUInt16LE(this.readOffset) : this.#buffer.readUInt16BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int16
        return value
    }
    readUInt32()
    {
        const value = this.endian == "little" ? this.#buffer.readUInt32LE(this.readOffset) : this.#buffer.readUInt32BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int32
        return value
    }
    readUInt64()
    {
        const value = this.endian == "little" ? this.#buffer.readBigUInt64LE(this.readOffset) : this.#buffer.readBigUInt64BE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Int64
        return value
    }
    readFloat()
    {
        const value = this.endian == "little" ? this.#buffer.readFloatLE(this.readOffset) : this.#buffer.readFloatBE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Float
        return value
    }
    readDouble()
    {
        const value = this.endian == "little" ? this.#buffer.readDoubleLE(this.readOffset) : this.#buffer.readDoubleBE(this.readOffset)
        this.readOffset += NBuffer.SizeOf.Double
        return value
    }
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
    readString(size: number,encoding?: BufferEncoding)
    {
        const value = this.#buffer.toString(encoding,this.readOffset,this.readOffset+size)
        this.readOffset += size
        return value
    }
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
    writeInt8(value: number)
    {
        this.writeOffset = this.#buffer.writeInt8(value,this.writeOffset)
    }
    writeInt16(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt16LE(value,this.writeOffset) : this.#buffer.writeInt16BE(value,this.writeOffset)
    }
    writeInt32(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeInt32LE(value,this.writeOffset) : this.#buffer.writeInt32BE(value,this.writeOffset)
    }
    writeInt64(value: bigint)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigInt64LE(value,this.writeOffset) : this.#buffer.writeBigInt64BE(value,this.writeOffset)
    }
    writeUInt8(value: number)
    {
        this.writeOffset = this.#buffer.writeUInt8(value,this.writeOffset)
    }
    writeUInt16(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt16LE(value,this.writeOffset) : this.#buffer.writeUInt16BE(value,this.writeOffset)
    }
    writeUInt32(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeUInt32LE(value,this.writeOffset) : this.#buffer.writeUInt32BE(value,this.writeOffset)
    }
    writeUInt64(value: bigint)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeBigUInt64LE(value,this.writeOffset) : this.#buffer.writeBigUInt64BE(value,this.writeOffset)
    }
    writeFloat(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeFloatLE(value,this.writeOffset) : this.#buffer.writeFloatBE(value,this.writeOffset)
    }
    writeDouble(value: number)
    {
        this.writeOffset = this.endian == "little" ? this.#buffer.writeDoubleLE(value,this.writeOffset) : this.#buffer.writeDoubleBE(value,this.writeOffset)
    }
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
    writeString(str: string,encoding?: BufferEncoding)
    {
        this.writeOffset += this.#buffer.write(str,this.writeOffset,encoding)
    }
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
    toJSON(): NBuffer.JSON
    {
        return {
            type: 'NBuffer',
            data: [...this.#buffer.toJSON().data]
        }
    }
    *[Symbol.iterator]()
    {
        for(const byte of this.#buffer)
        {
            yield byte
        }
    }
    get length()
    {
        return this.#buffer.byteLength
    }
}

namespace NBuffer
{
    export type Endian = "little" | "big"
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