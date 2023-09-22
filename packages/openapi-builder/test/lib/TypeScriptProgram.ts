import { expect, it } from "vitest";
import prettier from "@prettier/sync";

export class TypeScriptProgram {
  constructor(public value: string) {}

  static of(value: string) {
    return new TypeScriptProgram(value);
  }
}

expect.addSnapshotSerializer({
  test: (v: any): v is TypeScriptProgram => v instanceof TypeScriptProgram,
  serialize(val: TypeScriptProgram) {
    return `// typescript
${prettier.format((val as TypeScriptProgram).value, {
  parser: "typescript",
})}`;
  },
});

it("should render a TypeScriptProgram", () => {
  expect(TypeScriptProgram.of("const a = {}")).toMatchInlineSnapshot(`
    // typescript
    const a = {};
  `);
});
