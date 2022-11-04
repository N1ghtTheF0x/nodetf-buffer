/// <reference types="node" />
declare class NBuffer {
    __buffer: Buffer;
    readOffset: number;
    writeOffset: number;
    endian: NBuffer.Endian;
    constructor(buffer: Buffer);
    constructor(size: number);
    readInt8(): number;
    readInt16(): number;
    readInt32(): number;
    readInt64(): bigint;
    readUInt8(): number;
    readUInt16(): number;
    readUInt32(): number;
    readUInt64(): bigint;
    readFloat(): number;
    readDouble(): number;
    readArray(size: number, type?: NBuffer.SizeOf): number[];
    readUArray(size: number, type?: NBuffer.SizeOf): number[];
    readString(size: number, encoding?: BufferEncoding): string;
    writeInt8(value: number): void;
    writeInt16(value: number): void;
    writeInt32(value: number): void;
    writeInt64(value: bigint): void;
    writeUInt8(value: number): void;
    writeUInt16(value: number): void;
    writeUInt32(value: number): void;
    writeUInt64(value: bigint): void;
    writeFloat(value: number): void;
    writeDouble(value: number): void;
    writeArray(arr: ReadonlyArray<number>, type?: NBuffer.SizeOf): void;
    writeString(str: string, encoding?: BufferEncoding): void;
    write(buffer: NBuffer): void;
    write(buffer: Buffer): void;
    subarray(size: number): NBuffer;
    toString(): string;
    toJSON(): NBuffer.JSON;
}
declare namespace NBuffer {
    type Endian = "little" | "big";
    enum SizeOf {
        Int8 = 1,
        Int16 = 2,
        Int32 = 4,
        Int64 = 8,
        Float = 4,
        Double = 8
    }
    type JSON = {
        type: 'NBuffer';
        data: Array<number>;
    };
}
export default NBuffer;
