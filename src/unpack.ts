import {
  assert,
  checksum,
  parseBool,
  parseCString,
  parseEnum,
} from "./util.js";
import { ResourceType } from "./constants.js";
import { RscEntry } from "./rsc_entry.js";

/**
 * Options when unpacking an RSC file
 * @public
 */
export interface UnpackOptions {
  /**
   * Validate the RSC file's integrity
   * @defaultValue false
   */
  validate_checksums?: boolean;
}

/**
 * Unpack an RSC file into the {@link RscEntry | entries} that compose it
 *
 * @remarks
 * This function creates views over the buffer passed as argument. Modifying the content of an {@link RscEntry | entry}
 * will modify the buffer passed in this function and vice versa.
 *
 * @public
 * @param arrayBuffer - Buffer containing an RSC file
 * @param options -
 * @returns The {@link RscEntry | entries} contained within the arrayBuffer parameter
 */
export function unpackRsc(
  arrayBuffer: ArrayBufferLike,
  options: UnpackOptions = {},
): RscEntry[] {
  const buf = new DataView(arrayBuffer);
  const entries = new Array<RscEntry>();

  let next_entry = 0;
  while (next_entry < buf.byteLength) {
    const size = buf.getUint32(next_entry, true);
    const entry = decodeEntry(
      new DataView(arrayBuffer, next_entry + 4, size),
      options,
    );
    entries.push(entry);

    next_entry += size + 4 + 1;
  }

  return entries;
}

function decodeEntry(buf: DataView, options: UnpackOptions): RscEntry {
  let pos = 0;

  const used = parseBool(buf.getUint8(pos++), true);
  const entry_type = buf.getUint8(pos++);
  const encrypted = Boolean(entry_type & 0b1000_0000);
  const type = parseEnum(entry_type, ResourceType, true);
  const expected_checksum = buf.getUint32((pos += 4) - 4, true);
  const added = new Date(buf.getUint32((pos += 4) - 4, true) * 1000);
  const modified = new Date(buf.getUint32((pos += 4) - 4, true) * 1000);
  const expected_content_length = buf.getUint32((pos += 4) - 4, true);
  const [path, path_length] = parseCString(buf, pos++);
  pos += path_length;

  let content = new Uint8Array(
    buf.buffer,
    buf.byteOffset + pos,
    buf.byteLength - pos + 1,
  );
  assert(content.byteLength === expected_content_length, "Inconsistent length");
  assert(
    !options?.validate_checksums || checksum(content) === expected_checksum,
    `Checksum mismatch on type ${entry_type}`,
  );

  return new RscEntry({
    used,
    encrypted,
    type,
    added,
    modified,
    content,
    path,
  });
}
