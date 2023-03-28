import { readFileSync, writeFileSync } from "fs"
import NBuffer from "./source/buffer"
import Struct from "./source/struct"
import { AnyNumber, AnyNumberType } from "./source/type"

const buffer = readFileSync("test.txt")
const nbuffer = new NBuffer(buffer)

const test: Struct = {
    hello: (b) => b.readString(5),
    world: (b) => b.readString(5)
}

const output = nbuffer.readStruct(test)

console.dir(output)