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
    assert(!strict, `${value} does not the given enum`);
    return null;
  }
  return value as T[keyof T];
}

class AssertionError extends Error {}

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (condition) return;

  throw new AssertionError(message ?? "Condition failed");
}
