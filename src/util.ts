import polycrc from "polycrc";

export function parseBool(num: number, strict?: false): boolean | null;
export function parseBool(num: number, strict: true): boolean;
export function parseBool(num: number, strict?: boolean): boolean | null {
  if (num < 0 || num > 2) {
    assert(!strict, `${num} is not a boolean`);
    return null;
  }
  return !!num;
}

export function parseEnum<T>(
  value: number,
  enumType: T,
  strict?: false,
): T[keyof T] | null;
export function parseEnum<T>(
  value: number,
  enumType: T,
  strict: true,
): T[keyof T];
export function parseEnum<T extends Record<string | number, string | number>>(
  value: number,
  enumType: T,
  strict?: boolean,
): T[keyof T] | null {
  const valid = Object.hasOwn(enumType, value);
  if (!valid) {
    assert(!strict, `Value ${value} does not match the given enum`);
    return null;
  }
  return value as T[keyof T];
}

const utf8_decoder = new TextDecoder("utf-8");
export function parseCString(
  buf: DataView,
  start: number,
): [output: string, length: number] {
  let length = 1;

  while (buf.getUint8(start + length) != 0) length++;

  return [
    utf8_decoder.decode(
      new DataView(buf.buffer, buf.byteOffset + start, length),
    ),
    length,
  ];
}

const utf8_encoder = new TextEncoder();
export function encodeCString(string: string) {
  const buf = utf8_encoder.encode(string + "a");
  buf[buf.length - 1] = 0;
  return buf;
}

class AssertionError extends Error {}
export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (condition) return;

  throw new AssertionError(message ?? "Condition failed");
}

export const checksum: (buffer: ArrayBufferLike | DataView) => number =
  polycrc.crc(32, 0xaf, 0xffff_ffff);
