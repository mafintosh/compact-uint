# compact-uint

[Compact Size Unsigned Integers](https://btcinformation.org/en/developer-reference#compactsize-unsigned-integers) in JS

```
npm install compact-uint
```

## Usage

``` js
const cuint = require('compact-uint')

cuint.encode(12) // -> Buffer([0x0c])
cuint.encode(123) // -> Buffer([0x7b])
cuint.encode(1234) // -> Buffer([0xfc04d2])
```

## API

#### `buf = cuint.encode(uint, [buf], [offset])`

Encodes a uint into a buffer using the compact size spec.
After encoding `encode.bytes` is set to the number of bytes that was used to encode the number.

#### `len = cuint.encodingLength(uint)`

How many bytes are needed to encode a uint?

#### `uint = cuint.decode(buf, [offset])`

Decode a uint from a buffer.
After decoding `decode.bytes` is set to the number of bytes that was used to decode the number.

## License

MIT
