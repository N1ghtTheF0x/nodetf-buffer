// Integers

export type sint8 = Int8Array[0]
export type sint16 = Int16Array[0]
export type sint32 = Int32Array[0]
export type sint64 = BigInt64Array[0]

export type sint = sint8 | sint16 | sint32 | sint64

export type uint8 = Uint8Array[0]
export type uint16 = Uint16Array[0]
export type uint32 = Uint32Array[0]
export type uint64 = BigUint64Array[0]

export type uint = uint8 | uint16 | uint32 | uint64

export type SignedInteger = {
    "sint8": sint8
    "sint16": sint16
    "sint32": sint32
    "sint64": sint64
}

export type UnsignedInteger = {
    "uint8": uint8
    "uint16": uint16
    "uint32": uint32
    "uint64": uint64
}

export type int = sint | uint

export type Integer = SignedInteger | UnsignedInteger

// IEEE 754 (float,double)

export type float = Float32Array[0]
export type double = Float64Array[0]

export type decimal = float | double

export type IEEE754 = {
    "float": float
    "double": double
}

// Numbers

export type AnyNumber = Integer | IEEE754
export type AnyNumberType = int | decimal

// Endianness

export type Endianness = "little" | "big"