import NBuffer from ".";

const buffer = new NBuffer(2)

buffer.writeUInt8(55)
buffer.writeUInt8(255)

console.dir(buffer.toJSON())