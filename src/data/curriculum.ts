export type ExerciseType = "multiple-choice" | "numeric";

export type Exercise = {
  id: string;
  prompt: string;
  type: ExerciseType;
  options?: string[];
  answer: string;
  explanation: string;
};

export type TheoryExample = {
  problem: string;
  solution: string;
};

export type TheorySection = {
  heading: string;
  body: string[];
  example?: TheoryExample;
};

export type Topic = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  theory: TheorySection[];
  exercises: Exercise[];
  /** Optional starting expressions for an embedded interactive graph. */
  graphExpressions?: string[];
};

export type Level = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  available: boolean;
};

export const levels: Level[] = [
  {
    id: "fundamental-1",
    name: "Ensino Fundamental I",
    shortName: "Fund. I",
    description: "Números, contagem e as quatro operações básicas.",
    available: false,
  },
  {
    id: "fundamental-2",
    name: "Ensino Fundamental II",
    shortName: "Fund. II",
    description: "Números inteiros, frações e os primeiros passos na álgebra.",
    available: true,
  },
  {
    id: "medio",
    name: "Ensino Médio",
    shortName: "Médio",
    description: "Funções, geometria analítica, trigonometria e estatística.",
    available: false,
  },
  {
    id: "superior",
    name: "Ensino Superior",
    shortName: "Superior",
    description: "Cálculo, álgebra linear e equações diferenciais.",
    available: false,
  },
];

export const fundamental2Topics: Topic[] = [
  {
    id: "numeros-inteiros",
    title: "Operações com Números Inteiros",
    summary:
      "Domine a soma, subtração, multiplicação e divisão de números positivos e negativos.",
    minutes: 15,
    theory: [
      {
        heading: "O que são números inteiros?",
        body: [
          "Os números inteiros são todos os números positivos, negativos e o zero, sem casas decimais: ..., -3, -2, -1, 0, 1, 2, 3, ...",
          "Eles aparecem o tempo todo: saldo bancário negativo, temperatura abaixo de zero, andares abaixo do térreo.",
        ],
      },
      {
        heading: "Soma e subtração",
        body: [
          "Ao somar dois números de mesmo sinal, some os valores e mantenha o sinal.",
          "Ao somar números de sinais diferentes, subtraia o menor valor do maior e use o sinal do número com maior valor absoluto.",
        ],
        example: {
          problem: "(-8) + 5",
          solution:
            "Sinais diferentes: 8 - 5 = 3. Como 8 (valor absoluto maior) é negativo, o resultado é -3.",
        },
      },
      {
        heading: "Multiplicação e divisão",
        body: [
          "Sinais iguais (+ × + ou - × -) resultam em um número positivo.",
          "Sinais diferentes (+ × - ou - × +) resultam em um número negativo.",
          "A mesma regra de sinais vale para a divisão.",
        ],
        example: {
          problem: "(-6) × (-4)",
          solution: "Sinais iguais → resultado positivo: 6 × 4 = 24.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Quanto é (-7) + 3?",
        type: "numeric",
        answer: "-4",
        explanation:
          "Sinais diferentes: 7 - 3 = 4. Como -7 tem o maior valor absoluto, o resultado é -4.",
      },
      {
        id: "q2",
        prompt: "Quanto é 9 + (-9)?",
        type: "numeric",
        answer: "0",
        explanation: "Números opostos sempre se cancelam: 9 - 9 = 0.",
      },
      {
        id: "q3",
        prompt: "Quanto é (-5) × 4?",
        type: "numeric",
        answer: "-20",
        explanation: "Sinais diferentes → resultado negativo: 5 × 4 = 20, logo -20.",
      },
      {
        id: "q4",
        prompt: "Quanto é (-12) ÷ (-3)?",
        type: "numeric",
        answer: "4",
        explanation: "Sinais iguais → resultado positivo: 12 ÷ 3 = 4.",
      },
      {
        id: "q5",
        prompt: "Qual o resultado de (-2) - (-6)?",
        type: "multiple-choice",
        options: ["-8", "-4", "4", "8"],
        answer: "4",
        explanation:
          "Subtrair um negativo é o mesmo que somar: -2 - (-6) = -2 + 6 = 4.",
      },
      {
        id: "q6",
        prompt: "Qual o resultado de 3 - 10?",
        type: "numeric",
        answer: "-7",
        explanation: "3 - 10 = -(10 - 3) = -7.",
      },
    ],
  },
  {
    id: "fracoes",
    title: "Frações",
    summary:
      "Entenda o que são frações, como simplificá-las e como somar, subtrair, multiplicar e dividir.",
    minutes: 18,
    theory: [
      {
        heading: "O que é uma fração?",
        body: [
          "Uma fração representa uma parte de um todo. Ela é escrita como a/b, onde 'a' é o numerador (quantas partes você tem) e 'b' é o denominador (em quantas partes o todo foi dividido).",
        ],
      },
      {
        heading: "Frações equivalentes e simplificação",
        body: [
          "Duas frações são equivalentes quando representam a mesma quantidade, como 1/2 e 2/4.",
          "Para simplificar uma fração, divida o numerador e o denominador pelo mesmo número (o maior divisor comum entre eles).",
        ],
        example: {
          problem: "Simplifique 8/12",
          solution: "O maior divisor comum de 8 e 12 é 4. 8÷4 = 2 e 12÷4 = 3, então 8/12 = 2/3.",
        },
      },
      {
        heading: "Somar e subtrair frações",
        body: [
          "Com o mesmo denominador, some ou subtraia apenas os numeradores.",
          "Com denominadores diferentes, primeiro encontre um denominador comum (o MMC dos denominadores).",
        ],
        example: {
          problem: "1/4 + 1/6",
          solution: "MMC(4,6) = 12. 1/4 = 3/12 e 1/6 = 2/12. Somando: 3/12 + 2/12 = 5/12.",
        },
      },
      {
        heading: "Multiplicar e dividir frações",
        body: [
          "Para multiplicar, multiplique numerador por numerador e denominador por denominador.",
          "Para dividir, multiplique a primeira fração pelo inverso da segunda.",
        ],
        example: {
          problem: "2/3 ÷ 1/2",
          solution: "Multiplique pelo inverso: 2/3 × 2/1 = 4/3.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Simplifique 6/9 (responda no formato a/b).",
        type: "numeric",
        answer: "2/3",
        explanation: "O maior divisor comum de 6 e 9 é 3. 6÷3 = 2 e 9÷3 = 3, então 6/9 = 2/3.",
      },
      {
        id: "q2",
        prompt: "Quanto é 1/3 + 1/3? (responda no formato a/b)",
        type: "numeric",
        answer: "2/3",
        explanation: "Mesmo denominador: some os numeradores. 1+1 = 2, então 2/3.",
      },
      {
        id: "q3",
        prompt: "Quanto é 1/2 + 1/4? (responda no formato a/b)",
        type: "numeric",
        answer: "3/4",
        explanation: "MMC(2,4) = 4. 1/2 = 2/4. Somando: 2/4 + 1/4 = 3/4.",
      },
      {
        id: "q4",
        prompt: "Qual fração é equivalente a 3/5?",
        type: "multiple-choice",
        options: ["6/10", "5/3", "3/10", "9/10"],
        answer: "6/10",
        explanation: "Multiplicando numerador e denominador por 2: 3×2/5×2 = 6/10.",
      },
      {
        id: "q5",
        prompt: "Quanto é 2/3 × 3/4? (responda no formato a/b, simplificado)",
        type: "numeric",
        answer: "1/2",
        explanation: "2×3/3×4 = 6/12, que simplificado é 1/2.",
      },
      {
        id: "q6",
        prompt: "Quanto é 1/2 ÷ 1/4? (responda como número inteiro)",
        type: "numeric",
        answer: "2",
        explanation: "1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.",
      },
    ],
  },
  {
    id: "introducao-algebra",
    title: "Introdução à Álgebra",
    summary:
      "Aprenda a trabalhar com variáveis e a resolver equações do primeiro grau.",
    minutes: 20,
    graphExpressions: ["2x + 3"],
    theory: [
      {
        heading: "O que é uma variável?",
        body: [
          "Uma variável é uma letra (geralmente x, y ou n) que representa um número desconhecido.",
          "Uma expressão algébrica combina números, variáveis e operações, como 3x + 5.",
        ],
      },
      {
        heading: "Resolvendo equações do primeiro grau",
        body: [
          "Uma equação é uma igualdade com uma variável, como 2x + 3 = 11.",
          "Para resolver, isole a variável: passe os números para o outro lado da igualdade invertendo a operação (soma vira subtração, multiplicação vira divisão).",
        ],
        example: {
          problem: "2x + 3 = 11",
          solution:
            "Subtraia 3 dos dois lados: 2x = 8. Divida os dois lados por 2: x = 4.",
        },
      },
      {
        heading: "Equações com variável dos dois lados",
        body: [
          "Quando a variável aparece nos dois lados, agrupe os termos com variável de um lado e os números do outro.",
        ],
        example: {
          problem: "5x - 2 = 2x + 10",
          solution:
            "Subtraia 2x dos dois lados: 3x - 2 = 10. Some 2 dos dois lados: 3x = 12. Divida por 3: x = 4.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Resolva: x + 7 = 15. Qual o valor de x?",
        type: "numeric",
        answer: "8",
        explanation: "Subtraia 7 dos dois lados: x = 15 - 7 = 8.",
      },
      {
        id: "q2",
        prompt: "Resolva: 3x = 21. Qual o valor de x?",
        type: "numeric",
        answer: "7",
        explanation: "Divida os dois lados por 3: x = 21 ÷ 3 = 7.",
      },
      {
        id: "q3",
        prompt: "Resolva: 4x - 5 = 11. Qual o valor de x?",
        type: "numeric",
        answer: "4",
        explanation: "Some 5: 4x = 16. Divida por 4: x = 4.",
      },
      {
        id: "q4",
        prompt: "Resolva: 2x + 4 = x + 9. Qual o valor de x?",
        type: "numeric",
        answer: "5",
        explanation: "Subtraia x dos dois lados: x + 4 = 9. Subtraia 4: x = 5.",
      },
      {
        id: "q5",
        prompt: "Qual expressão representa 'o dobro de um número somado a 3'?",
        type: "multiple-choice",
        options: ["2x + 3", "x + 3", "2(x + 3)", "3x + 2"],
        answer: "2x + 3",
        explanation:
          "'O dobro de um número' é 2x, e 'somado a 3' adiciona +3, resultando em 2x + 3.",
      },
      {
        id: "q6",
        prompt: "Resolva: 5(x - 1) = 20. Qual o valor de x?",
        type: "numeric",
        answer: "5",
        explanation: "Divida por 5: x - 1 = 4. Some 1: x = 5.",
      },
    ],
  },
];

export function getLevel(levelId: string): Level | undefined {
  return levels.find((l) => l.id === levelId);
}

export function getTopicsForLevel(levelId: string): Topic[] {
  if (levelId === "fundamental-2") return fundamental2Topics;
  return [];
}

export function getTopic(levelId: string, topicId: string): Topic | undefined {
  return getTopicsForLevel(levelId).find((t) => t.id === topicId);
}
