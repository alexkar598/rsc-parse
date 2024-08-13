import { parseBool, parseEnum } from "./util.js";
import { ResourceType } from "./constants.js";

export function decode(arrayBuffer: ArrayBufferLike) {
  const buf = new DataView(arrayBuffer);
  const blocks = new Array<Block>();

  let next_block = 0;
  while (next_block < buf.byteLength) {
    const size = buf.getUint32(next_block, true);
    const block = decodeBlock(new DataView(arrayBuffer, next_block + 4, size));
    blocks.push(block);
    next_block += size + 4 + 1;
  }

  return blocks;
}

interface Block {
  used: boolean;
  encrypted: boolean;
  type: ResourceType;
  encrypted_checksum: number;
  added: Date;
  modified: Date;
  content_length: number;
  path: string;
  content: DataView;
}

function decodeBlock(buf: DataView): Block {
  let pos = 0;

  const used = parseBool(buf.getUint8(pos++), true);
  const encrypted = Boolean(buf.getUint8(pos) & 0b1000_0000);
  const type = parseEnum(buf.getUint8(pos++) & 0b0111_1111, ResourceType, true);
  const encrypted_checksum = buf.getUint32((pos += 4) - 4, true);
  const added = new Date(buf.getUint32((pos += 4) - 4, true) * 1000);
  const modified = new Date(buf.getUint32((pos += 4) - 4, true) * 1000);
  const content_length = buf.getUint32((pos += 4) - 4, true);
  const [path, path_length] = parseCString(buf, pos);
  const content = new DataView(
    buf.buffer,
    buf.byteOffset + pos + path_length,
    content_length,
  );

  return {
    used,
    encrypted,
    type,
    encrypted_checksum,
    added,
    modified,
    content_length,
    path,
    content,
  };
}

const utf8_decoder = new TextDecoder("utf-8");
export function parseCString(
  buf: DataView,
  start: number,
): [output: string, length: number] {
  let length = 0;

  do length++;
  while (buf.getUint8(start + length) != 0);

  return [
    utf8_decoder.decode(
      new DataView(buf.buffer, buf.byteOffset + start, length),
    ),
    length,
  ];
}
