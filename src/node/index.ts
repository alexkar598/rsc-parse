import * as fs from "node:fs";
import { decode } from "../index.js";

const file = fs.readFileSync("./data/yogstation.rsc");

console.time("RSC Parse");
const rsc = decode(file.buffer);
console.timeEnd("RSC Parse");

for (const block of rsc) {
  console.log(
    `${block.used ? "+" : "-"}${block.path}: ${block.content_length}`,
  );
}
