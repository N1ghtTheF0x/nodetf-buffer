import { INT16_SIZE, INT32_SIZE, INT64_SIZE, INT8_SIZE, FLOAT_SIZE, DOUBLE_SIZE } from "./size"
import { StringDecoder, StringEncoder } from "./string"
import Struct from "./struct"
import { AnyNumber, AnyNumberType, double, Endianness, float, sint16, sint32, sint64, sint8, uint16, uint32, uint64, uint8 } from "./type"
import { SINT16, SINT32, SINT64, SINT8, UINT16, UINT32, UINT64, UINT8, FLOAT as _FLOAT,DOUBLE as _DOUBLE } from "./utils"

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
    static async fromBlob(blob: Blob | Promise<Blob>,byteOffset?: number,byteLength?: number)
    {
        return new this(await (await blob).arrayBuffer(),byteOffset,byteLength)
    }
    static async fromResponse(response: Response,byteOffset?: number,byteLength?: number)
    {
        return this.fromBlob(await response.blob(),byteOffset,byteLength)
    }
    static fromJSON(json: ReturnType<Buffer["toJSON"]>,byteOffset?: number,byteLength?: number)
    {
        return new this(new Uint8Array(json.data),byteOffset,byteLength)
    }
    constructor(buffer: ArrayBufferLike, byteOffset?: number, byteLength?: number)
    {
        this.#view = new DataView(new Uint8Array(buffer).buffer,byteOffset,byteLength)
    }
    read<Type extends AnyNumberType>(type: Type): AnyNumber[Type]
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
    readArray<Type extends AnyNumberType>(type: Type,length: number): Array<AnyNumber[Type]>
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
    readString(length: number,decoder: StringDecoder = (buf) => new TextDecoder().decode(buf))
    {
        const buffer = this.readBuffer(length)
        return decoder(buffer)
    }
    readStruct<Output extends object>(struct: Struct): Output
    {
        const entries = Object.entries(struct)
        const output: Record<string,any> = {}

        for(const [fieldName,type] of entries)
        {
            if(typeof type == "string") output[fieldName] = this.read(type)
            else if(typeof type == "function") output[fieldName] = type(this)
            else if(typeof type == "object") output[fieldName] = this.readStruct(type)
        }

        return output as Output
    }
    readInt8(): sint8
    {
        const value = this.#view.getInt8(this.readOffset)
        this.readOffset += INT8_SIZE
        return value
    }
    readInt16(): sint16
    {
        const value = this.#view.getInt16(this.readOffset,this.endianness == "little")
        this.readOffset += INT16_SIZE
        return value
    }
    readInt32(): sint32
    {
        const value = this.#view.getInt32(this.readOffset,this.endianness == "little")
        this.readOffset += INT32_SIZE
        return value
    }
    readInt64(): sint64
    {
        const value = this.#view.getBigInt64(this.readOffset,this.endianness == "little")
        this.readOffset += INT64_SIZE
        return value
    }
    readUInt8(): uint8
    {
        const value = this.#view.getUint8(this.readOffset)
        this.readOffset += INT8_SIZE
        return value
    }
    readUInt16(): uint16
    {
        const value = this.#view.getUint16(this.readOffset,this.endianness == "little")
        this.readOffset += INT16_SIZE
        return value
    }
    readUInt32(): uint32
    {
        const value = this.#view.getUint32(this.readOffset,this.endianness == "little")
        this.readOffset += INT32_SIZE
        return value
    }
    readUInt64(): uint64
    {
        const value = this.#view.getBigUint64(this.readOffset,this.endianness == "little")
        this.readOffset += INT64_SIZE
        return value
    }
    readFloat(): float
    {
        const value = this.#view.getFloat32(this.readOffset,this.endianness == "little")
        this.readOffset += FLOAT_SIZE
        return value
    }
    readDouble(): double
    {
        const value = this.#view.getFloat64(this.readOffset,this.endianness == "little")
        this.readOffset += FLOAT_SIZE
        return value
    }
    write<Type extends AnyNumberType>(type: Type,value: AnyNumber[Type])
    {
        switch(type)
        {
            case "sint8":
                return this.writeInt8(value as number)
            case "sint16":
                return this.writeInt16(value as number)
            case "sint32":
                return this.writeInt32(value as number)
            case "sint64":
                return this.writeInt64(value as bigint)
            case "uint8":
                return this.writeUInt8(value as number)
            case "uint16":
                return this.writeUInt16(value as number)
            case "uint32":
                return this.writeUInt32(value as number)
            case "uint64":
                return this.writeUInt64(value as bigint)
            case "float":
                return this.writeFloat(value as number)
            case "double":
                return this.writeDouble(value as number)
            default:
                throw new TypeError(`"${type}" is not a valid number type!`)
        }
    }
    writeArray<Type extends AnyNumberType>(type: Type,array: Array<AnyNumber[Type]>)
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
    writeString(string: string,encoding: StringEncoder = (string) => new TextEncoder().encode(string))
    {
        return this.writeBuffer(encoding(string))
    }
    writeInt8(value: sint8)
    {
        this.#view.setInt8(this.writeOffset,SINT8(value))
        this.writeOffset += INT8_SIZE
        return this
    }
    writeInt16(value: sint16)
    {
        this.#view.setInt16(this.writeOffset,SINT16(value),this.endianness == "little")
        this.writeOffset += INT16_SIZE
        return this
    }
    writeInt32(value: sint32)
    {
        this.#view.setInt32(this.writeOffset,SINT32(value),this.endianness == "little")
        this.writeOffset += INT32_SIZE
        return this
    }
    writeInt64(value: sint64)
    {
        this.#view.setBigInt64(this.writeOffset,SINT64(value),this.endianness == "little")
        this.writeOffset += INT64_SIZE
        return this
    }
    writeUInt8(value: uint8)
    {
        this.#view.setUint8(this.writeOffset,UINT8(value))
        this.writeOffset += INT8_SIZE
        return this
    }
    writeUInt16(value: uint16)
    {
        this.#view.setUint16(this.writeOffset,UINT16(value),this.endianness == "little")
        this.writeOffset += INT16_SIZE
        return this
    }
    writeUInt32(value: uint32)
    {
        this.#view.setUint32(this.writeOffset,UINT32(value),this.endianness == "little")
        this.writeOffset += INT32_SIZE
        return this
    }
    writeUInt64(value: uint64)
    {
        this.#view.setBigUint64(this.writeOffset,UINT64(value),this.endianness == "little")
        this.writeOffset += INT64_SIZE
        return this
    }
    writeFloat(value: float)
    {
        this.#view.setFloat32(this.writeOffset,_FLOAT(value),this.endianness == "little")
        this.writeOffset += FLOAT_SIZE
        return this
    }
    writeDouble(value: double)
    {
        this.#view.setFloat64(this.writeOffset,_DOUBLE(value),this.endianness == "little")
        this.writeOffset += DOUBLE_SIZE
        return this
    }
    [Symbol.toStringTag]()
    {
        return "NBuffer"
    }
    *[Symbol.iterator]()
    {
        while(this.readOffset < this.byteLength) yield this.readUInt8()
    }
    async *[Symbol.asyncIterator]()
    {
        while(this.readOffset < this.byteLength) yield this.readUInt8()
    }
    [Symbol.toPrimitive](hint: "number" | "string" | "default")
    {
        switch(hint)
        {
            case "number":
                return this.byteLength
            case "default":
            default:
            case "string":
                return `NBuffer[${this.byteLength}]`
        }
    }
}

export default NBuffer