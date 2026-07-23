export class MathExprError extends Error {}

type Token =
  | { type: "num"; value: number }
  | { type: "ident"; value: string }
  | { type: "op"; value: "+" | "-" | "*" | "/" | "^" }
  | { type: "lparen" }
  | { type: "rparen" };

type Node =
  | { type: "num"; value: number }
  | { type: "var" }
  | { type: "neg"; operand: Node }
  | { type: "bin"; op: "+" | "-" | "*" | "/" | "^"; left: Node; right: Node }
  | { type: "call"; name: string; arg: Node };

const FUNCTIONS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      const numStr = input.slice(i, j);
      if ((numStr.match(/\./g) ?? []).length > 1) {
        throw new MathExprError(`Número inválido: "${numStr}"`);
      }
      tokens.push({ type: "num", value: parseFloat(numStr) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let j = i;
      while (j < input.length && /[a-zA-Z]/.test(input[j])) j++;
      tokens.push({ type: "ident", value: input.slice(i, j).toLowerCase() });
      i = j;
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    throw new MathExprError(`Caractere inválido: "${ch}"`);
  }
  return tokens;
}

function withImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = [];
  for (const t of tokens) {
    if (result.length > 0) {
      const prev = result[result.length - 1];
      const prevEndsValue =
        prev.type === "num" ||
        prev.type === "rparen" ||
        (prev.type === "ident" && !(prev.value in FUNCTIONS));
      const curStartsValue =
        t.type === "num" || t.type === "lparen" || t.type === "ident";
      if (prevEndsValue && curStartsValue) {
        result.push({ type: "op", value: "*" });
      }
    }
    result.push(t);
  }
  return result;
}

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new MathExprError("Expressão incompleta");
    this.pos++;
    return t;
  }

  parseProgram(): Node {
    const node = this.parseExpr();
    if (this.pos !== this.tokens.length) {
      throw new MathExprError("Expressão inválida");
    }
    return node;
  }

  private parseExpr(): Node {
    let node = this.parseTerm();
    for (;;) {
      const t = this.peek();
      if (t?.type === "op" && (t.value === "+" || t.value === "-")) {
        this.next();
        node = { type: "bin", op: t.value, left: node, right: this.parseTerm() };
      } else break;
    }
    return node;
  }

  private parseTerm(): Node {
    let node = this.parseUnary();
    for (;;) {
      const t = this.peek();
      if (t?.type === "op" && (t.value === "*" || t.value === "/")) {
        this.next();
        node = { type: "bin", op: t.value, left: node, right: this.parseUnary() };
      } else break;
    }
    return node;
  }

  private parseUnary(): Node {
    const t = this.peek();
    if (t?.type === "op" && (t.value === "-" || t.value === "+")) {
      this.next();
      const operand = this.parseUnary();
      return t.value === "-" ? { type: "neg", operand } : operand;
    }
    return this.parsePower();
  }

  private parsePower(): Node {
    const base = this.parsePrimary();
    const t = this.peek();
    if (t?.type === "op" && t.value === "^") {
      this.next();
      return { type: "bin", op: "^", left: base, right: this.parseUnary() };
    }
    return base;
  }

  private parsePrimary(): Node {
    const t = this.next();
    if (t.type === "num") return { type: "num", value: t.value };
    if (t.type === "lparen") {
      const node = this.parseExpr();
      const close = this.next();
      if (close.type !== "rparen") throw new MathExprError("Parêntese não fechado");
      return node;
    }
    if (t.type === "ident") {
      const name = t.value;
      if (name in FUNCTIONS) {
        const open = this.next();
        if (open.type !== "lparen") {
          throw new MathExprError(`Esperado "(" após "${name}"`);
        }
        const arg = this.parseExpr();
        const close = this.next();
        if (close.type !== "rparen") throw new MathExprError("Parêntese não fechado");
        return { type: "call", name, arg };
      }
      if (name === "x") return { type: "var" };
      if (name in CONSTANTS) return { type: "num", value: CONSTANTS[name] };
      throw new MathExprError(`Identificador desconhecido: "${name}"`);
    }
    throw new MathExprError("Expressão inválida");
  }
}

function evalNode(node: Node, x: number): number {
  switch (node.type) {
    case "num":
      return node.value;
    case "var":
      return x;
    case "neg":
      return -evalNode(node.operand, x);
    case "call":
      return FUNCTIONS[node.name](evalNode(node.arg, x));
    case "bin": {
      const l = evalNode(node.left, x);
      const r = evalNode(node.right, x);
      switch (node.op) {
        case "+":
          return l + r;
        case "-":
          return l - r;
        case "*":
          return l * r;
        case "/":
          return l / r;
        case "^":
          return Math.pow(l, r);
      }
    }
  }
}

/** Compiles a math expression in `x` (e.g. "2x^2 - 3x + 1", "sin(x)") into an
 * evaluator function. Throws MathExprError on invalid syntax. */
export function compileExpression(input: string): (x: number) => number {
  const trimmed = input.trim();
  if (!trimmed) throw new MathExprError("Digite uma expressão");
  const tokens = withImplicitMultiplication(tokenize(trimmed));
  if (tokens.length === 0) throw new MathExprError("Digite uma expressão");
  const ast = new Parser(tokens).parseProgram();
  evalNode(ast, 1); // validate: throws if referencing unknown identifiers etc.
  return (x: number) => evalNode(ast, x);
}
