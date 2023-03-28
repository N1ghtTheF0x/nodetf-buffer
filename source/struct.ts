import NBuffer from "./buffer"
import { AnyNumberType } from "./type"

interface Struct
{
    [fieldName: string]: StructFieldType
}

export type ReadFunction = (buffer: NBuffer) => any

export type StructFieldType = AnyNumberType | ReadFunction | Struct

export default Struct