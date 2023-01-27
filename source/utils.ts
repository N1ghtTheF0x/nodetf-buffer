import { MAX_DOUBLE, MAX_FLOAT, MAX_SINT16, MAX_SINT32, MAX_SINT64, MAX_SINT8, MAX_UINT16, MAX_UINT32, MAX_UINT64, MAX_UINT8, MIN_DOUBLE, MIN_FLOAT, MIN_SINT16, MIN_SINT32, MIN_SINT64, MIN_SINT8, MIN_UINT16, MIN_UINT32, MIN_UINT64, MIN_UINT8 } from "./size";
import { AnyNumberType, double, float, sint16, sint32, sint64, sint8, uint16, uint32, uint64, uint8 } from "./type";

function limit(min: AnyNumberType,value: AnyNumberType,max: AnyNumberType): AnyNumberType
{
    if(value < min) return min
    if(max < value) return max
    return value
}

export function SINT8(value: sint8): sint8
{
    return limit(MIN_SINT8,value,MAX_SINT8) as sint8
}
export function UINT8(value: uint8): uint8
{
    return limit(MIN_UINT8,value,MAX_UINT8) as uint8
}
export function SINT16(value: sint16): sint16
{
    return limit(MIN_SINT16,value,MAX_SINT16) as sint16
}
export function UINT16(value: uint16): uint16
{
    return limit(MIN_UINT16,value,MAX_UINT16) as uint16
}
export function SINT32(value: sint32): sint32
{
    return limit(MIN_SINT32,value,MAX_SINT32) as sint32
}
export function UINT32(value: uint32): uint32
{
    return limit(MIN_UINT32,value,MAX_UINT32) as uint32
}
export function SINT64(value: sint64): sint64
{
    return limit(MIN_SINT64,value,MAX_SINT64) as sint64
}
export function UINT64(value: uint64): uint64
{
    return limit(MIN_UINT64,value,MAX_UINT64) as uint64
}
export function FLOAT(value: float): float
{
    return limit(MIN_FLOAT,value,MAX_FLOAT) as float
}
export function DOUBLE(value: double): double
{
    return limit(MIN_DOUBLE,value,MAX_DOUBLE) as double
}