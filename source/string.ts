export type StringEncoder = (string: string) => ArrayBufferLike
export type StringDecoder = (buffer: ArrayBufferLike) => string