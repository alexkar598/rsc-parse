import { assert, checksum, encodeCString } from "./util.js";
import { RscEntry } from "./rsc_entry.js";

/**
 * Pack {@link RscEntry | entries} into an RSC file
 *
 * @remarks
 * Unlike {@link unpackRsc}, the resulting buffer is not a view. It may be safely modified.
 *
 * @public
 * @param entries - Entries to compose
 * @returns The RSC file
 */
export function packRsc(entries: RscEntry[]): ArrayBuffer {
  const buf = new ArrayBuffer(
    entries.reduce((acc, entry) => acc + entry.rawSize(), 0),
  );

  let pos = 0;
  for (const entry of entries) {
    const size = entry.rawSize();
    encodeEntry(new DataView(buf, pos, size), entry);
    pos += size;
  }

  assert(pos === buf.byteLength, "Miscalculated rawFileSize");

  return buf;
}

function encodeEntry(buf: DataView, entry: RscEntry) {
  const computed_checksum = checksum(entry.content);
  const cPath = encodeCString(entry.path);
  const cPathLen = cPath.length;
  const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

  let pos = 0;

  buf.setUint32(
    (pos += 4) - 4,
    buf.byteLength - 5 /* size and used flag aren't included */,
    true,
  );
  buf.setUint8(pos++, Number(entry.used));
  buf.setUint8(pos++, (Number(entry.encrypted) << 7) | entry.type);
  buf.setUint32((pos += 4) - 4, computed_checksum, true);
  buf.setUint32((pos += 4) - 4, entry.added.valueOf() / 1000, true);
  buf.setUint32((pos += 4) - 4, entry.modified.valueOf() / 1000, true);
  buf.setUint32((pos += 4) - 4, entry.content.byteLength, true);
  arr.set(cPath, (pos += cPathLen) - cPathLen);

  arr.set(entry.content, pos);
  pos += entry.content.byteLength;

  assert(pos === buf.byteLength, "Miscalculated entry rawSize");
}
