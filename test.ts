import NBuffer from "./index";

const buffer = NBuffer.read("test.bin")

const customStruct: NBuffer.Struct = {
    "test": (buf) =>
    {
        return buf.readString(buf.readInt16(),"ascii")
    }
}

const result = buffer.readStruct(customStruct)

console.dir(result)