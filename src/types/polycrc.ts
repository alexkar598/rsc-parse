// noinspection JSUnusedGlobalSymbols

declare module "polycrc" {
  type BufferCompatible =
    | number
    | string
    | bigint
    | ArrayBufferView
    | ArrayBufferLike;
  export class CRC {
    converter: Converter;

    constructor(
      width: number,
      poly: number,
      xor_in?: number,
      xor_out?: number,
      reflect?: boolean,
    );
    calculate(buffer: BufferCompatible): number;
    calculate_no_table(buffer: BufferCompatible): number;
    gen_table(): Int32Array;
    print_table(): string;
  }
  export function crc(
    width: number,
    poly: number,
    xor_in?: number,
    xor_out?: number,
    reflect?: boolean,
  ): CRC["calculate"];

  export const models: {
    crc1: CRC;
    crc6: CRC;
    crc8: CRC;
    crc10: CRC;
    crc16: CRC;
    crc24: CRC;
    crc32: CRC;
    crc32c: CRC;
  };
  export const crc1: CRC;
  export const crc6: CRC;
  export const crc8: CRC;
  export const crc10: CRC;
  export const crc16: CRC;
  export const crc24: CRC;
  export const crc32: CRC;
  export const crc32c: CRC;

  class Converter {
    validate_buffer(data: BufferCompatible): Uint8Array;
    fromUInt32?: (data: number) => Uint8Array;
    fromByteArray: (data: number[]) => Uint8Array;
    fromString: (data: string) => Uint8Array;
  }

  export function makeBufferConverter(preferTypedArrays?: boolean): Converter;
}
