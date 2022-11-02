class NBuffer
{
    #buffer: Buffer
    readOffset: number = 0
    writeOffset: number = 0
    endian: NBuffer.Endian = "little"
    constructor(buffer: Buffer)
    constructor(size: number)
    constructor(a: Buffer | number)
    {
        this.#buffer = typeof a == "number" ? Buffer.alloc(a) : a
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
            }

        return arr
    }
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
            }

        return arr
    }
    readString(size: number,encoding?: BufferEncoding)
    {
        const value = this.#buffer.toString(encoding,this.readOffset,this.readOffset+size)
        this.readOffset += size
        return value
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
    writeArray(arr: ReadonlyArray<number>,type: NBuffer.SizeOf = NBuffer.SizeOf.Int8)
    {
        for(const num of arr)
        {
            switch(type)
            {
                case NBuffer.SizeOf.Int8:
                    this.writeInt8(num)
                    break
                case NBuffer.SizeOf.Int16:
                    this.writeInt16(num)
                    break
                case NBuffer.SizeOf.Int32:
                    this.writeInt32(num)
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
        this.writeOffset += size
        return new NBuffer(buffer)
    }
    toString()
    {
        return String(this.#buffer).replace("Buffer","NBuffer")
    }
    toJSON(): NBuffer.JSON
    {
        return {
            type: 'NBuffer',
            data: [...this.#buffer.toJSON().data]
        }
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
        Int64 = 8
    }
    export type JSON = {
        type: 'NBuffer'
        data: Array<number>
    }
}

export default NBuffer