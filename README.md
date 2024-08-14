# rsc-tools

Library for packing and unpacking .rsc files

[Documentation](https://alexkar598.github.io/rsc-tools/latest/) [NPM](https://www.npmjs.com/package/rsc-tools)

## Example Usage

```ts
import * as fs from "node:fs";
import { packRsc, unpackRsc } from "rsc-tools";

const file = fs.readFileSync("./data.rsc");
const rsc = unpackRsc(file);
rsc[0].path += ".alt";
const newFile = Buffer.from(packRsc(rsc));
fs.writeFileSync("./data.rsc", newFile);
```
