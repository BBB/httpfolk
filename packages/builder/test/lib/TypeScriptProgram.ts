import { expect, it } from "vitest";
import prettier from "prettier";

export class TypeScriptProgram {
  constructor(public value: string) {}
}

expect.addSnapshotSerializer({
  test: (v): v is TypeScriptProgram => v instanceof TypeScriptProgram,
  print(val) {
    return `// typescript
${prettier.format((val as TypeScriptProgram).value, {
  parser: "typescript",
})}`;
  },
});

it("should render a TypeScriptProgram", () => {
  expect(new TypeScriptProgram("const a = {}")).toMatchInlineSnapshot(`
    // typescript
    const a = {};
  `);
});
