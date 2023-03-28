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

export type SignedIntegerType = keyof SignedInteger

export type UnsignedInteger = {
    "uint8": uint8
    "uint16": uint16
    "uint32": uint32
    "uint64": uint64
}

export type UnsignedIntegerType = keyof UnsignedInteger

export type int = sint | uint

export type Integer = SignedInteger & UnsignedInteger
export type IntegerType = SignedIntegerType | UnsignedIntegerType
export type IntegerValue = SignedInteger[SignedIntegerType] | UnsignedInteger[UnsignedIntegerType]

// IEEE 754 (float,double)

export type float = Float32Array[0]
export type double = Float64Array[0]

export type decimal = float | double

export type IEEE754 = {
    "float": float
    "double": double
}

export type IEEE754Type = keyof IEEE754
export type IEEE754Value = IEEE754[IEEE754Type]

// Numbers

export type AnyNumber = Integer & IEEE754
export type AnyNumberType = IntegerType | IEEE754Type
export type AnyNumberValue = IntegerValue | IEEE754Value

// Endianness

export type Endianness = "little" | "big"