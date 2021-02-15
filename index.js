const uint64le = require('uint64le')

encode.bytes = decode.bytes = 0

module.exports = {
  encodingLength,
  encode,
  decode
}

function encode (n, buf, offset) {
  if (!offset) offset = 0
  if (!buf) buf = Buffer.allocUnsafe(encodingLength(n))

  if (n <= 0xfc) {
    buf[offset] = n
    encode.bytes = 1
    return buf
  }

  if (n <= 0xffff) {
    buf[offset] = 0xfd
    buf.writeUInt16LE(n, offset + 1)
    encode.bytes = 3
    return buf
  }

  if (n <= 0xffffffff) {
    buf[offset] = 0xfe
    buf.writeUInt32LE(n, offset + 1)
    encode.bytes = 5
    return buf
  }

  buf[offset] = 0xff
  uint64le.encode(n, buf, offset + 1)
  encode.bytes = 9

  return buf
}

function encodingLength (n) {
  return n <= 0xfc
    ? 1
    : n <= 0xffff
      ? 3
      : n <= 0xffffffff
        ? 5
        : 9
}

function decode (buf, offset) {
  if (!offset) offset = 0

  const first = buf[offset]

  if (first <= 0xfc) {
    decode.bytes = 1
    return first
  }

  if (first === 0xfd) {
    decode.bytes = 3
    return buf.readUInt16LE(offset + 1)
  }

  if (first === 0xfe) {
    decode.bytes = 5
    return buf.readUInt32LE(offset + 1)
  }

  decode.bytes = 9
  return uint64le.decode(buf, offset + 1)
}
