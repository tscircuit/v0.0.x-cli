import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface LintResult {
  filePath: string;
  messages: LintMessage[];
}

interface LintMessage {
  line: number;
  column: number;
  message: string;
  fix?: {
    range: [number, number];
    text: string;
  };
}

export function lintProject(projectPath: string, fix: boolean = false): LintResult[] {
  const results: LintResult[] = [];
  const files = getTypeScriptFiles(projectPath);

  for (const file of files) {
    const sourceFile = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );

    const result = lintFile(sourceFile, fix);
    if (result.messages.length > 0) {
      results.push({ filePath: file, messages: result.messages });
    }

    if (fix && result.messages.some(m => m.fix)) {
      const newContent = applyFixes(sourceFile.text, result.messages);
      fs.writeFileSync(file, newContent);
    }
  }

  return results;
}

function lintFile(sourceFile: ts.SourceFile, fix: boolean): { messages: LintMessage[] } {
  const messages: LintMessage[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'capacitor') {
      const valueArg = node.arguments.find(arg => ts.isObjectLiteralExpression(arg));
      if (valueArg && ts.isObjectLiteralExpression(valueArg)) {
        const valueProp = valueArg.properties.find(
          prop => ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'value'
        );
        if (valueProp && ts.isPropertyAssignment(valueProp) && ts.isStringLiteral(valueProp.initializer)) {
          const value = valueProp.initializer.text;
          if (!value.match(/[µuμ]F$/)) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(valueProp.getStart());
            messages.push({
              line: line + 1,
              column: character + 1,
              message: 'Capacitor value should include units (e.g., "100F")',
              fix: fix ? {
                range: [valueProp.initializer.getStart(), valueProp.initializer.getEnd()],
                text: `"${value}F"`
              } : undefined
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { messages };
}

function getTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        files.push(...getTypeScriptFiles(fullPath));
      }
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function applyFixes(source: string, messages: LintMessage[]): string {
  const fixes = messages
    .filter(m => m.fix)
    .sort((a, b) => (b.fix!.range[0] - a.fix!.range[0]));

  let result = source;
  for (const message of fixes) {
    const [start, end] = message.fix!.range;
    result = result.slice(0, start) + message.fix!.text + result.slice(end);
  }

  return result;
}