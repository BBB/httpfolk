#!/usr/bin/env node

import fs from "node:fs";
import packageDef from "../package.json" assert { type: "json" };

const peers = {
  "@fp-ts/schema": "^0.0.8",
};

packageDef.peerDependencies = peers;
packageDef.devDependencies = {
  ...packageDef.devDependencies,
  ...peers,
};

fs.writeFileSync("package.json", JSON.stringify(packageDef, null, 2));
