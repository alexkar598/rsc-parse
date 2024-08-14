import * as fs from "node:fs";
import { packRsc, unpackRsc } from "../index.js";
import { assert } from "../util.js";

const path = "./data/paradise.rsc";
const file = fs.readFileSync(path);

console.time("RSC Parse");
const rsc = unpackRsc(file.buffer, {
  validate_checksums: false,
  include_empty: true,
});
console.timeEnd("RSC Parse");

const newFile = Buffer.from(packRsc(rsc));
fs.writeFileSync("./data/paradise.rsc.repacked", newFile);
assert(file.equals(newFile));

console.log(`[SUCCESS] pack(unpack(${path})) is a noop!`);
