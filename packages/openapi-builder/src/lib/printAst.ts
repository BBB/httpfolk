import ts from "typescript";

export function printAst(ast: ts.Node) {
  const resultFile = ts.createSourceFile(
    "",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printNode(ts.EmitHint.Unspecified, ast, resultFile);
}
