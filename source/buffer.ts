import { INT16, INT32, INT64, INT8, FLOAT, DOUBLE } from "./size"
import { AnyNumber, double, Endianness, float, sint16, sint32, sint64, sint8, uint16, uint32, uint64, uint8 } from "./type"
import { SINT16, SINT32, SINT64, SINT8, UINT16, UINT32, UINT64, UINT8, FLOAT as _FLOAT,DOUBLE as _DOUBLE } from "./utils"

function isLittleEndian(endian: Endianness)
{
    return endian == "little"
}

class NBuffer
{
    static DEFAULT_ENDIANNESS: Endianness = "little"
    #view: DataView
    get buffer(){return this.#view.buffer}
    get byteLength(){return this.#view.byteLength}
    get byteOffset(){return this.#view.byteOffset}
    readOffset: number = 0
    writeOffset: number = 0
    endianness: Endianness = NBuffer.DEFAULT_ENDIANNESS
    constructor(...params: ConstructorParameters<DataViewConstructor>)
    {
        this.#view = new DataView(...params)
    }
    read<Type extends keyof AnyNumber>(type: Type): AnyNumber[Type]
    {
        switch(type)
        {
            case "sint8":
                return this.readInt8() as AnyNumber[Type]
            case "sint16":
                return this.readInt16() as AnyNumber[Type]
            case "sint32":
                return this.readInt32() as AnyNumber[Type]
            case "sint64":
                return this.readInt64() as AnyNumber[Type]
            case "uint8":
                return this.readUInt8() as AnyNumber[Type]
            case "uint16":
                return this.readUInt16() as AnyNumber[Type]
            case "uint32":
                return this.readUInt32() as AnyNumber[Type]
            case "uint64":
                return this.readUInt64() as AnyNumber[Type]
            case "float":
                return this.readFloat() as AnyNumber[Type]
            case "double":
                return this.readDouble() as AnyNumber[Type]
            default:
                throw new TypeError(`"${type}" is not a valid number type!`)
        }
    }
    readArray<Type extends keyof AnyNumber>(type: Type,length: number): Array<AnyNumber[Type]>
    {
        const arr: Array<AnyNumber[Type]> = []
        for(var index = 0;index < length;index++) arr.push(this.read(type))
        return arr
    }
    readBuffer(length: number): ArrayBuffer
    {
        const buffer = this.buffer.slice(this.readOffset,this.readOffset + length)
        this.readOffset += length
        return buffer
    }
    readString(length: number,label?: string)
    {
        const buffer = this.readBuffer(length)
        return new TextDecoder(label).decode(buffer)
    }
    readInt8(): sint8
    {
        const value = this.#view.getInt8(this.readOffset)
        this.readOffset += INT8
        return value
    }
    readInt16(): sint16
    {
        const value = this.#view.getInt16(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT16
        return value
    }
    readInt32(): sint32
    {
        const value = this.#view.getInt32(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT32
        return value
    }
    readInt64(): sint64
    {
        const value = this.#view.getBigInt64(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT64
        return value
    }
    readUInt8(): uint8
    {
        const value = this.#view.getUint8(this.readOffset)
        this.readOffset += INT8
        return value
    }
    readUInt16(): uint16
    {
        const value = this.#view.getUint16(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT16
        return value
    }
    readUInt32(): uint32
    {
        const value = this.#view.getUint32(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT32
        return value
    }
    readUInt64(): uint64
    {
        const value = this.#view.getBigUint64(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += INT64
        return value
    }
    readFloat(): float
    {
        const value = this.#view.getFloat32(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += FLOAT
        return value
    }
    readDouble(): double
    {
        const value = this.#view.getFloat64(this.readOffset,isLittleEndian(this.endianness))
        this.readOffset += FLOAT
        return value
    }
    write<Type extends keyof AnyNumber>(type: Type,value: AnyNumber[Type])
    {
        switch(type)
        {
            case "sint8":
                return this.writeInt8(value)
            case "sint16":
                return this.writeInt16(value)
            case "sint32":
                return this.writeInt32(value)
            case "sint64":
                return this.writeInt64(value)
            case "uint8":
                return this.writeUInt8(value)
            case "uint16":
                return this.writeUInt16(value)
            case "uint32":
                return this.writeUInt32(value)
            case "uint64":
                return this.writeUInt64(value)
            case "float":
                return this.writeFloat(value)
            case "double":
                return this.writeDouble(value)
            default:
                throw new TypeError(`"${type}" is not a valid number type!`)
        }
    }
    writeArray<Type extends keyof AnyNumber>(type: Type,array: Array<AnyNumber[Type]>)
    {
        for(const value of array) this.write(type,value)
        return this
    }
    writeBuffer(buffer: ArrayBufferLike)
    {
        new Uint8Array(this.buffer,0,this.buffer.byteLength).set(new Uint8Array(buffer),this.writeOffset)
        this.writeOffset += buffer.byteLength
        return this
    }
    writeString(string: string)
    {
        return this.writeBuffer(new TextEncoder().encode(string))
    }
    writeInt8(value: sint8)
    {
        this.#view.setInt8(this.writeOffset,SINT8(value))
        this.writeOffset += INT8
        return this
    }
    writeInt16(value: sint16)
    {
        this.#view.setInt16(this.writeOffset,SINT16(value),isLittleEndian(this.endianness))
        this.writeOffset += INT16
        return this
    }
    writeInt32(value: sint32)
    {
        this.#view.setInt32(this.writeOffset,SINT32(value),isLittleEndian(this.endianness))
        this.writeOffset += INT32
        return this
    }
    writeInt64(value: sint64)
    {
        this.#view.setBigInt64(this.writeOffset,SINT64(value),isLittleEndian(this.endianness))
        this.writeOffset += INT64
        return this
    }
    writeUInt8(value: uint8)
    {
        this.#view.setUint8(this.writeOffset,UINT8(value))
        this.writeOffset += INT8
        return this
    }
    writeUInt16(value: uint16)
    {
        this.#view.setUint16(this.writeOffset,UINT16(value),isLittleEndian(this.endianness))
        this.writeOffset += INT16
        return this
    }
    writeUInt32(value: uint32)
    {
        this.#view.setUint32(this.writeOffset,UINT32(value),isLittleEndian(this.endianness))
        this.writeOffset += INT32
        return this
    }
    writeUInt64(value: uint64)
    {
        this.#view.setBigUint64(this.writeOffset,UINT64(value),isLittleEndian(this.endianness))
        this.writeOffset += INT64
        return this
    }
    writeFloat(value: float)
    {
        this.#view.setFloat32(this.writeOffset,_FLOAT(value),isLittleEndian(this.endianness))
        this.writeOffset += FLOAT
        return this
    }
    writeDouble(value: double)
    {
        this.#view.setFloat64(this.writeOffset,_DOUBLE(value),isLittleEndian(this.endianness))
        this.writeOffset += DOUBLE
        return this
    }
}

export default NBuffer