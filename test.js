const tape = require('tape')
const { encodingLength, encode, decode } = require('./')

tape('encodingLength', function (t) {
  t.same(encodingLength(0xfb), 1)
  t.same(encodingLength(0xfc), 1)
  t.same(encodingLength(0x12), 1)
  t.same(encodingLength(0xfd), 3)
  t.same(encodingLength(0x1234), 3)
  t.same(encodingLength(0xffff), 3)
  t.same(encodingLength(0xffff + 1), 5)
  t.same(encodingLength(0x12345678), 5)
  t.same(encodingLength(0xffffffff), 5)
  t.same(encodingLength(0xffffffff + 1), 9)
  t.same(encodingLength(0x1234567890ab), 9)
  t.end()
})

tape('encode', function (t) {
  t.same(encode(0x12), Buffer.from([0x12]))
  t.same(encode.bytes, 1)
  t.same(encode(0x1234), Buffer.from([0xfd, 0x34, 0x12]))
  t.same(encode.bytes, 3)
  t.same(encode(0x12345678), Buffer.from([0xfe, 0x78, 0x56, 0x34, 0x12]))
  t.same(encode.bytes, 5)
  t.same(encode(0x1234567890ab), Buffer.from([0xff, 0xab, 0x90, 0x78, 0x56, 0x34, 0x12, 0x00, 0x00]))
  t.same(encode.bytes, 9)
  t.end()
})

tape('encode to buf', function (t) {
  const buf = Buffer.alloc(10)
  t.same(encode(0x12, buf, 3).slice(3, 4), Buffer.from([0x12]))
  t.same(encode.bytes, 1)
  t.same(encode(0x12345678, buf, 1), Buffer.from([0x00, 0xfe, 0x78, 0x56, 0x34, 0x12, 0x00, 0x00, 0x00, 0x00]))
  t.same(encode.bytes, 5)
  t.end()
})

tape('decode', function (t) {
  t.same(decode(Buffer.from([0x12])), 0x12)
  t.same(decode.bytes, 1)
  t.same(decode(Buffer.from([0xfd, 0x34, 0x12])), 0x1234)
  t.same(decode.bytes, 3)
  t.same(decode(Buffer.from([0xfe, 0x78, 0x56, 0x34, 0x12])), 0x12345678)
  t.same(decode.bytes, 5)
  t.same(decode(Buffer.from([0xff, 0xab, 0x90, 0x78, 0x56, 0x34, 0x12, 0x00, 0x00])), 0x1234567890ab)
  t.same(decode.bytes, 9)
  t.end()
})

tape('encode then decode', function (t) {
  const buf = Buffer.alloc(10)

  const ints = [
    0xff,
    0xfc,
    0x12,
    0x1234,
    0x12345678,
    0x1234567890ab,
    Number.MAX_SAFE_INTEGER,
    0
  ]

  for (const i of ints) {
    encode(i, buf)
    t.same(decode(buf), i)
    t.same(encode.bytes, decode.bytes)
    t.same(encodingLength(i), encode.bytes)
  }

  for (let i = 0; i < 50; i++) {
    const r = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    encode(r, buf)
    t.same(decode(buf), r)
    t.same(encode.bytes, decode.bytes)
    t.same(encodingLength(r), encode.bytes)
  }

  t.end()
})
