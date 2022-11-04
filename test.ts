import NBuffer from "./index";

const buffer = new NBuffer(2)

console.info(buffer.writeOffset)
buffer.writeUInt8(55)
console.info(buffer.writeOffset)
buffer.writeUInt8(255)
console.info(buffer.writeOffset)
buffer.writeFloat(8.0)
console.info(NBuffer.isNBuffer(buffer))

console.dir(buffer.toString())

for(const byte of buffer)
{
    console.info(byte)
}