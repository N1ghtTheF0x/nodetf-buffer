import NBuffer from ".";

const buffer = new NBuffer(2)

buffer.writeUInt8(55)
buffer.writeUInt8(255)

console.info(NBuffer.isNBuffer(buffer))

console.dir(buffer.toJSON())