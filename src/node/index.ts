import * as fs from "node:fs";
import { packRsc, unpackRsc } from "../index.js";
import { assert } from "../util.js";

const file = fs.readFileSync("./data/yogstation.rsc");

console.time("RSC Parse");
const rsc = unpackRsc(file.buffer);
console.timeEnd("RSC Parse");

const newFile = Buffer.from(packRsc(rsc));
fs.writeFileSync("./data/yogstation_repacked.rsc", newFile);
assert(file.equals(newFile));
