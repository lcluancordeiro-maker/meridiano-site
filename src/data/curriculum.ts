export type ExerciseType = "multiple-choice" | "numeric";

export type Difficulty = "facil" | "medio" | "dificil" | "olimpiada";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
  olimpiada: "Olimpíada",
};

export const DIFFICULTY_ORDER: Difficulty[] = ["facil", "medio", "dificil", "olimpiada"];

export type Exercise = {
  id: string;
  prompt: string;
  type: ExerciseType;
  difficulty: Difficulty;
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
    description:
      "Números inteiros, frações, potências, proporcionalidade, equações e geometria plana.",
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
        difficulty: "medio",
        answer: "-4",
        explanation:
          "Sinais diferentes: 7 - 3 = 4. Como -7 tem o maior valor absoluto, o resultado é -4.",
      },
      {
        id: "q2",
        prompt: "Quanto é 9 + (-9)?",
        type: "numeric",
        difficulty: "medio",
        answer: "0",
        explanation: "Números opostos sempre se cancelam: 9 - 9 = 0.",
      },
      {
        id: "q3",
        prompt: "Quanto é (-5) × 4?",
        type: "numeric",
        difficulty: "medio",
        answer: "-20",
        explanation: "Sinais diferentes → resultado negativo: 5 × 4 = 20, logo -20.",
      },
      {
        id: "q4",
        prompt: "Quanto é (-12) ÷ (-3)?",
        type: "numeric",
        difficulty: "medio",
        answer: "4",
        explanation: "Sinais iguais → resultado positivo: 12 ÷ 3 = 4.",
      },
      {
        id: "q5",
        prompt: "Qual o resultado de (-2) - (-6)?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["-8", "-4", "4", "8"],
        answer: "4",
        explanation:
          "Subtrair um negativo é o mesmo que somar: -2 - (-6) = -2 + 6 = 4.",
      },
      {
        id: "q6",
        prompt: "Qual o resultado de 3 - 10?",
        type: "numeric",
        difficulty: "medio",
        answer: "-7",
        explanation: "3 - 10 = -(10 - 3) = -7.",
      },
      {
        id: "f1",
        prompt: "Quanto é 5 + 3?",
        type: "numeric",
        difficulty: "facil",
        answer: "8",
        explanation: "5 + 3 = 8.",
      },
      {
        id: "f2",
        prompt: "Quanto é 10 - 4?",
        type: "numeric",
        difficulty: "facil",
        answer: "6",
        explanation: "10 - 4 = 6.",
      },
      {
        id: "f3",
        prompt: "Quanto é (-2) + (-3)?",
        type: "numeric",
        difficulty: "facil",
        answer: "-5",
        explanation: "Mesmo sinal: some os valores e mantenha o sinal. 2 + 3 = 5, então -5.",
      },
      {
        id: "f4",
        prompt: "Quanto é 6 × 2?",
        type: "numeric",
        difficulty: "facil",
        answer: "12",
        explanation: "6 × 2 = 12.",
      },
      {
        id: "f5",
        prompt: "Quanto é 8 ÷ 2?",
        type: "numeric",
        difficulty: "facil",
        answer: "4",
        explanation: "8 ÷ 2 = 4.",
      },
      {
        id: "f6",
        prompt: "Quanto é (-5) + 5?",
        type: "numeric",
        difficulty: "facil",
        answer: "0",
        explanation: "Números opostos se cancelam: -5 + 5 = 0.",
      },
      {
        id: "d1",
        prompt: "Quanto é (-3) × 4 + 5?",
        type: "numeric",
        difficulty: "dificil",
        answer: "-7",
        explanation: "Multiplicação primeiro: (-3) × 4 = -12. Depois: -12 + 5 = -7.",
      },
      {
        id: "d2",
        prompt: "Quanto é 10 - (-4) × 2?",
        type: "numeric",
        difficulty: "dificil",
        answer: "18",
        explanation: "Multiplicação primeiro: (-4) × 2 = -8. Depois: 10 - (-8) = 10 + 8 = 18.",
      },
      {
        id: "d3",
        prompt: "Quanto é (-6) × (-3) - 10?",
        type: "numeric",
        difficulty: "dificil",
        answer: "8",
        explanation: "Multiplicação primeiro: (-6) × (-3) = 18. Depois: 18 - 10 = 8.",
      },
      {
        id: "d4",
        prompt: "Quanto é (-20) ÷ (-4) + (-3)?",
        type: "numeric",
        difficulty: "dificil",
        answer: "2",
        explanation: "Divisão primeiro: (-20) ÷ (-4) = 5. Depois: 5 + (-3) = 2.",
      },
      {
        id: "d5",
        prompt: "Quanto é 3 × (-4) - 2 × (-5)?",
        type: "numeric",
        difficulty: "dificil",
        answer: "-2",
        explanation: "Multiplicações primeiro: 3×(-4)=-12 e 2×(-5)=-10. Depois: -12 - (-10) = -2.",
      },
      {
        id: "d6",
        prompt: "Quanto é 15 - 2 × (-6)?",
        type: "numeric",
        difficulty: "dificil",
        answer: "27",
        explanation: "Multiplicação primeiro: 2 × (-6) = -12. Depois: 15 - (-12) = 27.",
      },
      {
        id: "o1",
        prompt:
          "A soma de dois números inteiros é -3 e o produto é -10. Um dos números é -5. Qual é o outro número?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "2",
        explanation: "-5 + x = -3, então x = 2. Confira o produto: -5 × 2 = -10. ✓",
      },
      {
        id: "o2",
        prompt:
          "Qual é o menor número inteiro positivo que, somado a -17, resulta em um número maior que 5?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "23",
        explanation:
          "-17 + x > 5, então x > 22. O menor inteiro positivo maior que 22 é 23 (verifique: -17+23=6>5).",
      },
      {
        id: "o3",
        prompt: "Se a é um número negativo e b é um número positivo, o produto a × b é sempre:",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["negativo", "positivo", "zero", "depende"],
        answer: "negativo",
        explanation: "Sinais diferentes na multiplicação sempre resultam em um número negativo.",
      },
      {
        id: "o4",
        prompt:
          "Um termômetro marcava -8°C e subiu 15°C. Depois desceu 6°C. Qual a temperatura final, em °C?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "1",
        explanation: "-8 + 15 - 6 = 7 - 6 = 1.",
      },
      {
        id: "o5",
        prompt:
          "A diferença entre um número inteiro positivo e seu oposto (simétrico) é 14. Qual é esse número?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "7",
        explanation: "x - (-x) = 2x = 14, então x = 7.",
      },
      {
        id: "o6",
        prompt: "Qual das expressões abaixo é sempre verdadeira para quaisquer inteiros a e b?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["a - b = -(b - a)", "a - b = b - a", "a × b = b + a", "a ÷ b = b ÷ a"],
        answer: "a - b = -(b - a)",
        explanation:
          "A subtração é anti-comutativa: trocar a ordem inverte o sinal do resultado, o que sempre vale.",
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
        difficulty: "medio",
        answer: "2/3",
        explanation: "O maior divisor comum de 6 e 9 é 3. 6÷3 = 2 e 9÷3 = 3, então 6/9 = 2/3.",
      },
      {
        id: "q2",
        prompt: "Quanto é 1/3 + 1/3? (responda no formato a/b)",
        type: "numeric",
        difficulty: "medio",
        answer: "2/3",
        explanation: "Mesmo denominador: some os numeradores. 1+1 = 2, então 2/3.",
      },
      {
        id: "q3",
        prompt: "Quanto é 1/2 + 1/4? (responda no formato a/b)",
        type: "numeric",
        difficulty: "medio",
        answer: "3/4",
        explanation: "MMC(2,4) = 4. 1/2 = 2/4. Somando: 2/4 + 1/4 = 3/4.",
      },
      {
        id: "q4",
        prompt: "Qual fração é equivalente a 3/5?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["6/10", "5/3", "3/10", "9/10"],
        answer: "6/10",
        explanation: "Multiplicando numerador e denominador por 2: 3×2/5×2 = 6/10.",
      },
      {
        id: "q5",
        prompt: "Quanto é 2/3 × 3/4? (responda no formato a/b, simplificado)",
        type: "numeric",
        difficulty: "medio",
        answer: "1/2",
        explanation: "2×3/3×4 = 6/12, que simplificado é 1/2.",
      },
      {
        id: "q6",
        prompt: "Quanto é 1/2 ÷ 1/4? (responda como número inteiro)",
        type: "numeric",
        difficulty: "medio",
        answer: "2",
        explanation: "1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2.",
      },
      {
        id: "f1",
        prompt: "Simplifique 4/8 (formato a/b).",
        type: "numeric",
        difficulty: "facil",
        answer: "1/2",
        explanation: "O maior divisor comum de 4 e 8 é 4. 4÷4=1 e 8÷4=2, então 4/8 = 1/2.",
      },
      {
        id: "f2",
        prompt: "Quanto é 1/5 + 2/5? (formato a/b)",
        type: "numeric",
        difficulty: "facil",
        answer: "3/5",
        explanation: "Mesmo denominador: some os numeradores. 1+2=3, então 3/5.",
      },
      {
        id: "f3",
        prompt: "Quanto é 3/4 - 1/4, simplificado? (formato a/b)",
        type: "numeric",
        difficulty: "facil",
        answer: "1/2",
        explanation: "Mesmo denominador: 3-1=2, então 2/4, que simplificado é 1/2.",
      },
      {
        id: "f4",
        prompt: "Qual fração representa 'metade de 1'?",
        type: "multiple-choice",
        difficulty: "facil",
        options: ["1/2", "2/1", "1/1", "0/2"],
        answer: "1/2",
        explanation: "Metade de 1 é 1/2.",
      },
      {
        id: "f5",
        prompt: "Quanto é 2/6 simplificado? (formato a/b)",
        type: "numeric",
        difficulty: "facil",
        answer: "1/3",
        explanation: "O maior divisor comum de 2 e 6 é 2. 2÷2=1 e 6÷2=3, então 2/6 = 1/3.",
      },
      {
        id: "f6",
        prompt: "Quanto é 1/2 × 1/3? (formato a/b)",
        type: "numeric",
        difficulty: "facil",
        answer: "1/6",
        explanation: "Multiplique numerador por numerador e denominador por denominador: 1×1/2×3 = 1/6.",
      },
      {
        id: "d1",
        prompt: "Quanto é 2/5 + 1/3? (formato a/b)",
        type: "numeric",
        difficulty: "dificil",
        answer: "11/15",
        explanation: "MMC(5,3)=15. 2/5=6/15 e 1/3=5/15. Somando: 6/15+5/15=11/15.",
      },
      {
        id: "d2",
        prompt: "Quanto é 3/4 - 2/5? (formato a/b)",
        type: "numeric",
        difficulty: "dificil",
        answer: "7/20",
        explanation: "MMC(4,5)=20. 3/4=15/20 e 2/5=8/20. Subtraindo: 15/20-8/20=7/20.",
      },
      {
        id: "d3",
        prompt: "Quanto é 2/3 × 3/8, simplificado? (formato a/b)",
        type: "numeric",
        difficulty: "dificil",
        answer: "1/4",
        explanation: "2×3/3×8 = 6/24, que simplificado (÷6) é 1/4.",
      },
      {
        id: "d4",
        prompt: "Quanto é 3/4 ÷ 2/5? (formato a/b)",
        type: "numeric",
        difficulty: "dificil",
        answer: "15/8",
        explanation: "Multiplique pelo inverso: 3/4 × 5/2 = 15/8.",
      },
      {
        id: "d5",
        prompt: "Quanto é 1/2 + 1/3 + 1/6, simplificado? (formato a/b ou número inteiro)",
        type: "numeric",
        difficulty: "dificil",
        answer: "1",
        explanation: "MMC=6: 3/6+2/6+1/6=6/6=1.",
      },
      {
        id: "d6",
        prompt: "Se 2/3 de um número é 18, qual é o número?",
        type: "numeric",
        difficulty: "dificil",
        answer: "27",
        explanation: "x × 2/3 = 18, então x = 18 × 3/2 = 27.",
      },
      {
        id: "o1",
        prompt:
          "A soma de duas frações unitárias (numerador 1) com denominadores diferentes é 7/12. Uma das frações é 1/3. Qual é a outra fração? (formato a/b)",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "1/4",
        explanation: "1/3 = 4/12. 7/12 - 4/12 = 3/12 = 1/4.",
      },
      {
        id: "o2",
        prompt:
          "Um tanque está 3/8 cheio. Depois de adicionar 30 litros, ficou 3/4 cheio. Qual a capacidade total do tanque, em litros?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "80",
        explanation:
          "3/4 - 3/8 = 6/8 - 3/8 = 3/8 da capacidade equivale a 30 L. Capacidade = 30 ÷ 3/8 = 30 × 8/3 = 80 L.",
      },
      {
        id: "o3",
        prompt: "Qual é o valor de x na equação x/5 = 3/15?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "1",
        explanation: "3/15 simplifica para 1/5, então x/5 = 1/5, logo x = 1.",
      },
      {
        id: "o4",
        prompt: "Qual fração é maior: 5/6 ou 7/9?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["5/6", "7/9", "são iguais", "não dá para comparar"],
        answer: "5/6",
        explanation: "5/6 ≈ 0,833 e 7/9 ≈ 0,778. Comparando com o mesmo denominador (18): 15/18 > 14/18.",
      },
      {
        id: "o5",
        prompt: "A soma de três frações iguais é 9/10. Qual é o valor de cada fração, simplificado? (formato a/b)",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "3/10",
        explanation: "9/10 ÷ 3 = 9/30, que simplificado (÷3) é 3/10.",
      },
      {
        id: "o6",
        prompt: "Num grupo, 2/5 são meninos. Se há 12 meninas, quantas pessoas há no grupo, ao todo?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "20",
        explanation: "Se 2/5 são meninos, 3/5 são meninas. 3/5 do total = 12, então total = 12 × 5/3 = 20.",
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
        difficulty: "medio",
        answer: "8",
        explanation: "Subtraia 7 dos dois lados: x = 15 - 7 = 8.",
      },
      {
        id: "q2",
        prompt: "Resolva: 3x = 21. Qual o valor de x?",
        type: "numeric",
        difficulty: "medio",
        answer: "7",
        explanation: "Divida os dois lados por 3: x = 21 ÷ 3 = 7.",
      },
      {
        id: "q3",
        prompt: "Resolva: 4x - 5 = 11. Qual o valor de x?",
        type: "numeric",
        difficulty: "medio",
        answer: "4",
        explanation: "Some 5: 4x = 16. Divida por 4: x = 4.",
      },
      {
        id: "q4",
        prompt: "Resolva: 2x + 4 = x + 9. Qual o valor de x?",
        type: "numeric",
        difficulty: "medio",
        answer: "5",
        explanation: "Subtraia x dos dois lados: x + 4 = 9. Subtraia 4: x = 5.",
      },
      {
        id: "q5",
        prompt: "Qual expressão representa 'o dobro de um número somado a 3'?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["2x + 3", "x + 3", "2(x + 3)", "3x + 2"],
        answer: "2x + 3",
        explanation:
          "'O dobro de um número' é 2x, e 'somado a 3' adiciona +3, resultando em 2x + 3.",
      },
      {
        id: "q6",
        prompt: "Resolva: 5(x - 1) = 20. Qual o valor de x?",
        type: "numeric",
        difficulty: "medio",
        answer: "5",
        explanation: "Divida por 5: x - 1 = 4. Some 1: x = 5.",
      },
      {
        id: "f1",
        prompt: "Resolva: x + 3 = 10. Qual o valor de x?",
        type: "numeric",
        difficulty: "facil",
        answer: "7",
        explanation: "Subtraia 3 dos dois lados: x = 10 - 3 = 7.",
      },
      {
        id: "f2",
        prompt: "Resolva: x - 5 = 2. Qual o valor de x?",
        type: "numeric",
        difficulty: "facil",
        answer: "7",
        explanation: "Some 5 aos dois lados: x = 2 + 5 = 7.",
      },
      {
        id: "f3",
        prompt: "Resolva: 2x = 10. Qual o valor de x?",
        type: "numeric",
        difficulty: "facil",
        answer: "5",
        explanation: "Divida os dois lados por 2: x = 10 ÷ 2 = 5.",
      },
      {
        id: "f4",
        prompt: "Qual o valor de x + x, se x = 4?",
        type: "numeric",
        difficulty: "facil",
        answer: "8",
        explanation: "4 + 4 = 8.",
      },
      {
        id: "f5",
        prompt: "Resolva: x/3 = 4. Qual o valor de x?",
        type: "numeric",
        difficulty: "facil",
        answer: "12",
        explanation: "Multiplique os dois lados por 3: x = 4 × 3 = 12.",
      },
      {
        id: "f6",
        prompt: "Qual expressão representa 'um número mais 5'?",
        type: "multiple-choice",
        difficulty: "facil",
        options: ["x + 5", "5x", "x - 5", "5 - x"],
        answer: "x + 5",
        explanation: "'Um número' é x, e 'mais 5' adiciona +5, resultando em x + 5.",
      },
      {
        id: "d1",
        prompt: "Resolva: 3x + 7 = 22. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "Subtraia 7: 3x = 15. Divida por 3: x = 5.",
      },
      {
        id: "d2",
        prompt: "Resolva: 2x - 3 = x + 8. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "11",
        explanation: "Subtraia x dos dois lados: x - 3 = 8. Some 3: x = 11.",
      },
      {
        id: "d3",
        prompt: "Resolva: 4(x + 2) = 28. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "Divida por 4: x + 2 = 7. Subtraia 2: x = 5.",
      },
      {
        id: "d4",
        prompt: "Resolva: 3x + 2 = 2x + 9. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "7",
        explanation: "Subtraia 2x dos dois lados: x + 2 = 9. Subtraia 2: x = 7.",
      },
      {
        id: "d5",
        prompt: "Resolva: 5x - 4 = 3x + 10. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "7",
        explanation: "Subtraia 3x: 2x - 4 = 10. Some 4: 2x = 14. Divida por 2: x = 7.",
      },
      {
        id: "d6",
        prompt: "A soma de um número com o dobro dele é 27. Qual é esse número?",
        type: "numeric",
        difficulty: "dificil",
        answer: "9",
        explanation: "x + 2x = 27, então 3x = 27, logo x = 9.",
      },
      {
        id: "o1",
        prompt:
          "A idade de Ana é o dobro da idade de Beatriz. Juntas, elas têm 36 anos. Qual a idade de Beatriz?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "12",
        explanation: "Se Beatriz = x, Ana = 2x. x + 2x = 36, então 3x = 36, logo x = 12.",
      },
      {
        id: "o2",
        prompt: "Um número somado ao seu triplo, menos 4, é igual a 24. Qual é o número?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "7",
        explanation: "x + 3x - 4 = 24, então 4x = 28, logo x = 7.",
      },
      {
        id: "o3",
        prompt: "Resolva o sistema: x + y = 10 e x - y = 2. Qual o valor de x?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "6",
        explanation: "Somando as duas equações: 2x = 12, então x = 6.",
      },
      {
        id: "o4",
        prompt: "Resolva o sistema: x + y = 10 e x - y = 2. Qual o valor de y?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "4",
        explanation: "Com x = 6 (da primeira equação): 6 + y = 10, então y = 4.",
      },
      {
        id: "o5",
        prompt: "Se 2x + 3 = 3x - 5, qual o valor de x?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["8", "-8", "2", "-2"],
        answer: "8",
        explanation: "Subtraia 2x: 3 = x - 5. Some 5: x = 8.",
      },
      {
        id: "o6",
        prompt:
          "Pedro tem o dobro da idade de seu filho. Daqui a 5 anos, a soma das idades será 40. Qual a idade atual do filho?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "10",
        explanation:
          "Filho = x, Pedro = 2x. Daqui a 5 anos: (x+5)+(2x+5)=40, então 3x+10=40, 3x=30, x=10.",
      },
    ],
  },
  {
    id: "potenciacao-radiciacao",
    title: "Potenciação e Radiciação",
    summary:
      "Aprenda as propriedades das potências e como calcular raízes quadradas e cúbicas.",
    minutes: 18,
    theory: [
      {
        heading: "O que é potenciação?",
        body: [
          "Potenciação é uma multiplicação de fatores iguais: aⁿ = a × a × ... × a (n vezes). Na expressão aⁿ, 'a' é a base e 'n' é o expoente.",
          "Todo número elevado a 0 é igual a 1 (exceto 0⁰, que não é definido). Todo número elevado a 1 é ele mesmo.",
        ],
        example: {
          problem: "2⁴",
          solution: "2 × 2 × 2 × 2 = 16.",
        },
      },
      {
        heading: "Propriedades das potências",
        body: [
          "Multiplicação de potências de mesma base: some os expoentes (aᵐ × aⁿ = aᵐ⁺ⁿ).",
          "Divisão de potências de mesma base: subtraia os expoentes (aᵐ ÷ aⁿ = aᵐ⁻ⁿ).",
          "Potência de potência: multiplique os expoentes ((aᵐ)ⁿ = aᵐˣⁿ).",
          "Expoente negativo: inverte a base (a⁻ⁿ = 1/aⁿ).",
          "Base negativa com expoente par dá resultado positivo; com expoente ímpar, mantém o sinal negativo.",
        ],
        example: {
          problem: "2³ × 2²",
          solution: "Mesma base, soma os expoentes: 2³⁺² = 2⁵ = 32.",
        },
      },
      {
        heading: "Radiciação",
        body: [
          "Radiciação é a operação inversa da potenciação. A raiz quadrada de um número a (√a) é o número que, elevado ao quadrado, resulta em a.",
          "A raiz cúbica de a (∛a) é o número que, elevado ao cubo, resulta em a.",
        ],
        example: {
          problem: "√81",
          solution: "9 × 9 = 81, então √81 = 9.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Quanto é 2³ × 2²?",
        type: "numeric",
        difficulty: "medio",
        answer: "32",
        explanation: "Mesma base: soma os expoentes. 2³⁺² = 2⁵ = 32.",
      },
      {
        id: "q2",
        prompt: "Quanto é (-3)²?",
        type: "numeric",
        difficulty: "medio",
        answer: "9",
        explanation: "Expoente par com base negativa dá resultado positivo: (-3) × (-3) = 9.",
      },
      {
        id: "q3",
        prompt: "Quanto é (-2)³?",
        type: "numeric",
        difficulty: "medio",
        answer: "-8",
        explanation: "Expoente ímpar mantém o sinal negativo: (-2) × (-2) × (-2) = -8.",
      },
      {
        id: "q4",
        prompt: "Quanto é √81?",
        type: "numeric",
        difficulty: "medio",
        answer: "9",
        explanation: "9 × 9 = 81, então √81 = 9.",
      },
      {
        id: "q5",
        prompt: "Quanto é ∛27 (raiz cúbica de 27)?",
        type: "numeric",
        difficulty: "medio",
        answer: "3",
        explanation: "3 × 3 × 3 = 27, então ∛27 = 3.",
      },
      {
        id: "q6",
        prompt: "Qual o valor de 2⁻²?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["1/4", "-4", "4", "-1/4"],
        answer: "1/4",
        explanation: "Expoente negativo inverte a base: 2⁻² = 1/2² = 1/4.",
      },
      {
        id: "f1",
        prompt: "Quanto é 3²?",
        type: "numeric",
        difficulty: "facil",
        answer: "9",
        explanation: "3 × 3 = 9.",
      },
      {
        id: "f2",
        prompt: "Quanto é 10²?",
        type: "numeric",
        difficulty: "facil",
        answer: "100",
        explanation: "10 × 10 = 100.",
      },
      {
        id: "f3",
        prompt: "Quanto é 2⁵?",
        type: "numeric",
        difficulty: "facil",
        answer: "32",
        explanation: "2×2×2×2×2 = 32.",
      },
      {
        id: "f4",
        prompt: "Quanto é 6⁰?",
        type: "numeric",
        difficulty: "facil",
        answer: "1",
        explanation: "Todo número (não nulo) elevado a 0 é igual a 1.",
      },
      {
        id: "f5",
        prompt: "Quanto é √16?",
        type: "numeric",
        difficulty: "facil",
        answer: "4",
        explanation: "4 × 4 = 16, então √16 = 4.",
      },
      {
        id: "f6",
        prompt: "Quanto é √49?",
        type: "numeric",
        difficulty: "facil",
        answer: "7",
        explanation: "7 × 7 = 49, então √49 = 7.",
      },
      {
        id: "d1",
        prompt: "Quanto é 3³ - 2³?",
        type: "numeric",
        difficulty: "dificil",
        answer: "19",
        explanation: "3³=27 e 2³=8. 27 - 8 = 19.",
      },
      {
        id: "d2",
        prompt: "Quanto é (2³)²?",
        type: "numeric",
        difficulty: "dificil",
        answer: "64",
        explanation: "Potência de potência: multiplique os expoentes. 2^(3×2) = 2⁶ = 64.",
      },
      {
        id: "d3",
        prompt: "Quanto é 5² × 5⁻¹?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "Mesma base: some os expoentes. 5^(2-1) = 5¹ = 5.",
      },
      {
        id: "d4",
        prompt: "Quanto é √(25 + 144)?",
        type: "numeric",
        difficulty: "dificil",
        answer: "13",
        explanation: "25 + 144 = 169. √169 = 13.",
      },
      {
        id: "d5",
        prompt: "Quanto é (-2)⁴?",
        type: "numeric",
        difficulty: "dificil",
        answer: "16",
        explanation: "Expoente par com base negativa dá resultado positivo: (-2)×(-2)×(-2)×(-2)=16.",
      },
      {
        id: "d6",
        prompt: "Quanto é ∛(8 × 27) (raiz cúbica de 8×27)?",
        type: "numeric",
        difficulty: "dificil",
        answer: "6",
        explanation: "8 × 27 = 216. 6×6×6=216, então ∛216 = 6.",
      },
      {
        id: "o1",
        prompt: "Se 2ˣ = 32, qual é o valor de x?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "5",
        explanation: "2⁵ = 32, então x = 5.",
      },
      {
        id: "o2",
        prompt: "Se 3ˣ = 81, qual é o valor de x?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "4",
        explanation: "3⁴ = 81, então x = 4.",
      },
      {
        id: "o3",
        prompt: "Qual é o valor de x em √x = 12?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "144",
        explanation: "Elevando os dois lados ao quadrado: x = 12² = 144.",
      },
      {
        id: "o4",
        prompt: "Qual o valor de 2¹⁰ dividido por 2⁸?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["4", "2", "8", "16"],
        answer: "4",
        explanation: "Mesma base: subtraia os expoentes. 2^(10-8) = 2² = 4.",
      },
      {
        id: "o5",
        prompt: "A área de um quadrado é 169 cm². Qual é a medida do lado, em cm?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "13",
        explanation: "O lado é a raiz quadrada da área: √169 = 13.",
      },
      {
        id: "o6",
        prompt: "Quanto é (4² + 3²) - (5² - 4²)?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "16",
        explanation: "(16+9) - (25-16) = 25 - 9 = 16.",
      },
    ],
  },
  {
    id: "proporcionalidade-porcentagem",
    title: "Proporcionalidade e Porcentagem",
    summary:
      "Domine razão, proporção, regra de três simples e cálculo de porcentagem.",
    minutes: 20,
    theory: [
      {
        heading: "Razão e proporção",
        body: [
          "Razão é a comparação entre duas grandezas, escrita como a/b. Por exemplo, numa turma com 18 meninas e 12 meninos, a razão meninas:meninos é 18/12 = 3/2.",
          "Proporção é a igualdade entre duas razões: a/b = c/d. Nela vale a propriedade fundamental: o produto dos extremos é igual ao produto dos meios (a × d = b × c).",
        ],
      },
      {
        heading: "Regra de três simples",
        body: [
          "A regra de três resolve problemas com duas grandezas diretamente proporcionais: monte a proporção e use a propriedade fundamental para encontrar o valor desconhecido.",
        ],
        example: {
          problem: "Se 4 lápis custam R$ 8, quanto custam 10 lápis?",
          solution:
            "Monte a proporção 4/8 = 10/x. Produto dos extremos = produto dos meios: 4x = 80, então x = 20.",
        },
      },
      {
        heading: "Porcentagem",
        body: [
          "Porcentagem é uma fração de denominador 100: x% = x/100. Para calcular x% de um valor, multiplique o valor por x/100.",
          "Para aplicar um desconto de x%, subtraia x% do valor original. Para um aumento de x%, some x% ao valor original.",
        ],
        example: {
          problem: "Calcule 15% de 200.",
          solution: "15% = 15/100 = 0,15. 0,15 × 200 = 30.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Se 3 canetas custam R$ 12, quanto custam 7 canetas, na mesma proporção (em reais)?",
        type: "numeric",
        difficulty: "medio",
        answer: "28",
        explanation: "Cada caneta custa 12 ÷ 3 = 4 reais. 7 canetas custam 7 × 4 = 28 reais.",
      },
      {
        id: "q2",
        prompt: "Calcule 20% de 150.",
        type: "numeric",
        difficulty: "medio",
        answer: "30",
        explanation: "20% = 0,20. 0,20 × 150 = 30.",
      },
      {
        id: "q3",
        prompt: "Calcule 8% de 50.",
        type: "numeric",
        difficulty: "medio",
        answer: "4",
        explanation: "8% = 0,08. 0,08 × 50 = 4.",
      },
      {
        id: "q4",
        prompt: "Um produto de R$ 80 tem desconto de 25%. Qual o novo preço, em reais?",
        type: "numeric",
        difficulty: "medio",
        answer: "60",
        explanation: "25% de 80 é 20. O novo preço é 80 - 20 = 60 reais.",
      },
      {
        id: "q5",
        prompt: "Qual fração, já simplificada, representa 40%?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["2/5", "4/5", "1/4", "5/2"],
        answer: "2/5",
        explanation: "40% = 40/100. Dividindo numerador e denominador por 20: 2/5.",
      },
      {
        id: "q6",
        prompt: "Na proporção a/4 = 6/8, qual o valor de a?",
        type: "numeric",
        difficulty: "medio",
        answer: "3",
        explanation: "Produto dos extremos = produto dos meios: a × 8 = 4 × 6 = 24, então a = 3.",
      },
      {
        id: "f1",
        prompt: "Calcule 10% de 100.",
        type: "numeric",
        difficulty: "facil",
        answer: "10",
        explanation: "10% = 0,10. 0,10 × 100 = 10.",
      },
      {
        id: "f2",
        prompt: "Calcule 50% de 40.",
        type: "numeric",
        difficulty: "facil",
        answer: "20",
        explanation: "50% = 0,50. 0,50 × 40 = 20.",
      },
      {
        id: "f3",
        prompt: "Se 2 maçãs custam R$ 4, quanto custam 4 maçãs, na mesma proporção (em reais)?",
        type: "numeric",
        difficulty: "facil",
        answer: "8",
        explanation: "Cada maçã custa 4 ÷ 2 = 2 reais. 4 maçãs custam 4 × 2 = 8 reais.",
      },
      {
        id: "f4",
        prompt: "Calcule 100% de 35.",
        type: "numeric",
        difficulty: "facil",
        answer: "35",
        explanation: "100% de qualquer valor é o próprio valor.",
      },
      {
        id: "f5",
        prompt: "Qual fração representa 50%?",
        type: "multiple-choice",
        difficulty: "facil",
        options: ["1/2", "1/4", "1/5", "2/1"],
        answer: "1/2",
        explanation: "50% = 50/100, que simplificado é 1/2.",
      },
      {
        id: "f6",
        prompt: "Calcule 25% de 80.",
        type: "numeric",
        difficulty: "facil",
        answer: "20",
        explanation: "25% = 0,25. 0,25 × 80 = 20.",
      },
      {
        id: "d1",
        prompt: "Um produto custa R$ 120 e recebe um aumento de 10%. Qual o novo preço, em reais?",
        type: "numeric",
        difficulty: "dificil",
        answer: "132",
        explanation: "10% de 120 é 12. Novo preço = 120 + 12 = 132.",
      },
      {
        id: "d2",
        prompt:
          "Se 5 operários constroem um muro em 12 dias, quantos dias 10 operários (no mesmo ritmo) levariam para construir o mesmo muro?",
        type: "numeric",
        difficulty: "dificil",
        answer: "6",
        explanation:
          "Grandezas inversamente proporcionais: 5 × 12 = 10 × x, então 60 = 10x, logo x = 6.",
      },
      {
        id: "d3",
        prompt: "Numa promoção, um item de R$ 150 está com 30% de desconto. Qual o preço final, em reais?",
        type: "numeric",
        difficulty: "dificil",
        answer: "105",
        explanation: "30% de 150 é 45. Preço final = 150 - 45 = 105.",
      },
      {
        id: "d4",
        prompt: "Se 8 é 20% de um número, qual é esse número?",
        type: "numeric",
        difficulty: "dificil",
        answer: "40",
        explanation: "8 = 0,20 × x, então x = 8 ÷ 0,20 = 40.",
      },
      {
        id: "d5",
        prompt: "Numa proporção, 3/x = 9/15. Qual o valor de x?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "Produto dos extremos = produto dos meios: 3 × 15 = 9 × x, então 45 = 9x, logo x = 5.",
      },
      {
        id: "d6",
        prompt: "Um salário de R$ 2000 passou a ser R$ 2200. Qual foi a porcentagem de aumento?",
        type: "numeric",
        difficulty: "dificil",
        answer: "10",
        explanation: "Aumento de 200 sobre 2000: (200/2000) × 100 = 10%.",
      },
      {
        id: "o1",
        prompt:
          "Um produto teve um aumento de 20% e, em seguida, um desconto de 20% sobre o novo preço. O preço final é:",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["Menor que o original", "Maior que o original", "Igual ao original", "Depende do valor inicial"],
        answer: "Menor que o original",
        explanation:
          "100 → 120 (+20%) → 120×0,8=96 (-20% de 120). 96 é menor que 100, pois o desconto incide sobre um valor maior.",
      },
      {
        id: "o2",
        prompt: "Se A é 25% maior que B, quantos por cento B é menor que A?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "20",
        explanation: "A = 1,25B, então B = A ÷ 1,25 = 0,8A = 80% de A. Logo, B é 20% menor que A.",
      },
      {
        id: "o3",
        prompt:
          "Numa liquidação, um produto teve dois descontos sucessivos de 10% cada. O desconto total equivale a quantos por cento do preço original?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "19",
        explanation: "100 → 90 (-10%) → 81 (-10% de 90). O desconto total é 100 - 81 = 19%.",
      },
      {
        id: "o4",
        prompt:
          "Se 4 pintores pintam 4 casas em 4 dias, quantos dias 8 pintores levam para pintar 8 casas, no mesmo ritmo?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "4",
        explanation: "Dobrar o número de pintores e de casas na mesma proporção mantém o tempo: continua 4 dias.",
      },
      {
        id: "o5",
        prompt: "Um investimento de R$ 1000 rende 5% ao mês (juros simples). Após 2 meses, qual o valor total, em reais?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "1100",
        explanation: "Juros simples: 1000 × 0,05 × 2 = 100. Total = 1000 + 100 = 1100.",
      },
      {
        id: "o6",
        prompt: "A razão entre dois números é 3:5 e a soma deles é 40. Qual é o maior número?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "25",
        explanation: "3+5=8 partes. Cada parte = 40÷8=5. O maior número tem 5 partes: 5×5=25.",
      },
    ],
  },
  {
    id: "equacoes-segundo-grau",
    title: "Equações do 2º Grau",
    summary: "Aprenda a fórmula de Bhaskara e resolva equações do segundo grau.",
    minutes: 22,
    graphExpressions: ["x^2 - 5x + 6"],
    theory: [
      {
        heading: "O que é uma equação do 2º grau?",
        body: [
          "Uma equação do 2º grau tem a forma ax² + bx + c = 0, com a ≠ 0. Os valores de x que satisfazem a equação são chamados de raízes.",
        ],
      },
      {
        heading: "Fórmula de Bhaskara",
        body: [
          "Calcule o discriminante: Δ = b² - 4ac.",
          "As raízes são dadas por x = (-b ± √Δ) / (2a).",
          "Se Δ > 0, há duas raízes reais diferentes. Se Δ = 0, há uma raiz real (dupla). Se Δ < 0, não há raízes reais.",
        ],
        example: {
          problem: "x² - 5x + 6 = 0",
          solution:
            "a=1, b=-5, c=6. Δ = (-5)² - 4×1×6 = 25 - 24 = 1. x = (5 ± 1)/2, então x = 3 ou x = 2.",
        },
      },
      {
        heading: "Equações incompletas",
        body: [
          "Quando b = 0 (ax² + c = 0), isole x² e depois tire a raiz quadrada.",
          "Quando c = 0 (ax² + bx = 0), coloque x em evidência: x(ax + b) = 0, o que dá x = 0 ou ax + b = 0.",
        ],
        example: {
          problem: "x² - 9 = 0",
          solution: "x² = 9, então x = 3 ou x = -3.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Na equação x² - 5x + 6 = 0, qual o valor do discriminante (Δ)?",
        type: "numeric",
        difficulty: "medio",
        answer: "1",
        explanation: "Δ = b² - 4ac = (-5)² - 4×1×6 = 25 - 24 = 1.",
      },
      {
        id: "q2",
        prompt: "Resolva x² - 5x + 6 = 0. Informe a menor raiz.",
        type: "numeric",
        difficulty: "medio",
        answer: "2",
        explanation: "Com Δ=1, x = (5 ± 1)/2, o que dá x=3 ou x=2. A menor raiz é 2.",
      },
      {
        id: "q3",
        prompt: "Resolva x² - 5x + 6 = 0. Informe a maior raiz.",
        type: "numeric",
        difficulty: "medio",
        answer: "3",
        explanation: "Com Δ=1, x = (5 ± 1)/2, o que dá x=3 ou x=2. A maior raiz é 3.",
      },
      {
        id: "q4",
        prompt: "Resolva a equação incompleta x² - 9 = 0. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "medio",
        answer: "3",
        explanation: "x² = 9, então x = 3 ou x = -3. A raiz positiva é 3.",
      },
      {
        id: "q5",
        prompt: "Resolva a equação incompleta x² - 4x = 0. Informe a raiz diferente de zero.",
        type: "numeric",
        difficulty: "medio",
        answer: "4",
        explanation: "Coloque x em evidência: x(x - 4) = 0, então x = 0 ou x = 4.",
      },
      {
        id: "q6",
        prompt: "Qual o discriminante de x² + 2x + 1 = 0?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["0", "1", "4", "-4"],
        answer: "0",
        explanation: "Δ = 2² - 4×1×1 = 4 - 4 = 0 (raiz dupla, x = -1).",
      },
      {
        id: "f1",
        prompt: "Resolva x² = 16. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "facil",
        answer: "4",
        explanation: "4 × 4 = 16, então a raiz positiva é 4.",
      },
      {
        id: "f2",
        prompt: "Resolva x² = 25. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "facil",
        answer: "5",
        explanation: "5 × 5 = 25, então a raiz positiva é 5.",
      },
      {
        id: "f3",
        prompt: "Resolva x² - 4 = 0. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "facil",
        answer: "2",
        explanation: "x² = 4, então x = 2 ou x = -2. A raiz positiva é 2.",
      },
      {
        id: "f4",
        prompt: "Resolva x² - 1 = 0. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "facil",
        answer: "1",
        explanation: "x² = 1, então x = 1 ou x = -1. A raiz positiva é 1.",
      },
      {
        id: "f5",
        prompt: "Resolva x² + 2x = 0. Informe a raiz diferente de zero.",
        type: "numeric",
        difficulty: "facil",
        answer: "-2",
        explanation: "Coloque x em evidência: x(x + 2) = 0, então x = 0 ou x = -2.",
      },
      {
        id: "f6",
        prompt: "Na equação x² - 6x + 8 = 0, qual o valor do discriminante (Δ)?",
        type: "numeric",
        difficulty: "facil",
        answer: "4",
        explanation: "Δ = b² - 4ac = (-6)² - 4×1×8 = 36 - 32 = 4.",
      },
      {
        id: "d1",
        prompt: "Resolva x² - 6x + 8 = 0. Informe a menor raiz.",
        type: "numeric",
        difficulty: "dificil",
        answer: "2",
        explanation: "Δ=4, √Δ=2. x=(6±2)/2, o que dá x=4 ou x=2. A menor raiz é 2.",
      },
      {
        id: "d2",
        prompt: "Resolva x² - 6x + 8 = 0. Informe a maior raiz.",
        type: "numeric",
        difficulty: "dificil",
        answer: "4",
        explanation: "Δ=4, √Δ=2. x=(6±2)/2, o que dá x=4 ou x=2. A maior raiz é 4.",
      },
      {
        id: "d3",
        prompt: "Resolva x² - 7x + 12 = 0. Informe a maior raiz.",
        type: "numeric",
        difficulty: "dificil",
        answer: "4",
        explanation: "Δ=49-48=1, √Δ=1. x=(7±1)/2, o que dá x=4 ou x=3. A maior raiz é 4.",
      },
      {
        id: "d4",
        prompt: "Resolva x² - 7x + 12 = 0. Informe a menor raiz.",
        type: "numeric",
        difficulty: "dificil",
        answer: "3",
        explanation: "Δ=49-48=1, √Δ=1. x=(7±1)/2, o que dá x=4 ou x=3. A menor raiz é 3.",
      },
      {
        id: "d5",
        prompt: "Resolva 2x² - 8 = 0. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "dificil",
        answer: "2",
        explanation: "x² = 4, então x = 2 ou x = -2. A raiz positiva é 2.",
      },
      {
        id: "d6",
        prompt: "Resolva x² - 2x - 15 = 0. Informe a raiz positiva.",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "Δ=4+60=64, √Δ=8. x=(2±8)/2, o que dá x=5 ou x=-3. A raiz positiva é 5.",
      },
      {
        id: "o1",
        prompt:
          "A soma das raízes de ax²+bx+c=0 é -b/a. Na equação x² - 9x + 20 = 0, qual é a soma das raízes?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "9",
        explanation: "-b/a = -(-9)/1 = 9. (Confira: raízes 5 e 4, soma 9.)",
      },
      {
        id: "o2",
        prompt: "O produto das raízes de ax²+bx+c=0 é c/a. Na equação x² - 9x + 20 = 0, qual é o produto das raízes?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "20",
        explanation: "c/a = 20/1 = 20. (Confira: raízes 5 e 4, produto 20.)",
      },
      {
        id: "o3",
        prompt: "Um número somado ao seu quadrado é igual a 20. Qual é esse número, sabendo que é positivo?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "4",
        explanation: "x + x² = 20, então x² + x - 20 = 0. Δ=81, √Δ=9. x=(-1±9)/2, o que dá x=4 ou x=-5.",
      },
      {
        id: "o4",
        prompt:
          "A área de um retângulo é 24 cm² e o comprimento é 2 cm maior que a largura. Qual é a largura, em cm?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "4",
        explanation:
          "w(w+2)=24, então w²+2w-24=0. Δ=4+96=100, √Δ=10. w=(-2±10)/2, o que dá w=4 ou w=-6.",
      },
      {
        id: "o5",
        prompt: "Para quais valores de k a equação x² + kx + 9 = 0 tem raiz dupla (Δ=0)?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["6 ou -6", "apenas 6", "apenas -6", "9 ou -9"],
        answer: "6 ou -6",
        explanation: "Δ = k² - 4×1×9 = k² - 36 = 0, então k² = 36, logo k = 6 ou k = -6.",
      },
      {
        id: "o6",
        prompt: "Resolva x² - 5x + 6 = 0 e informe a soma das duas raízes.",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "5",
        explanation: "As raízes são 2 e 3 (veja a teoria). A soma é 2 + 3 = 5, que também é -b/a = 5.",
      },
    ],
  },
  {
    id: "geometria-plana",
    title: "Geometria Plana",
    summary:
      "Calcule perímetros, áreas de figuras planas e aplique o Teorema de Pitágoras.",
    minutes: 20,
    theory: [
      {
        heading: "Perímetro e área",
        body: [
          "Perímetro é a soma de todos os lados de uma figura.",
          "Área do retângulo: base × altura. Área do quadrado: lado × lado. Área do triângulo: (base × altura) / 2. Área do círculo: π × r².",
        ],
        example: {
          problem: "Retângulo de base 6 cm e altura 4 cm",
          solution: "Área = 6 × 4 = 24 cm². Perímetro = 2×(6+4) = 20 cm.",
        },
      },
      {
        heading: "Teorema de Pitágoras",
        body: [
          "Em todo triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos: a² = b² + c², onde 'a' é a hipotenusa (lado oposto ao ângulo reto) e 'b', 'c' são os catetos.",
        ],
        example: {
          problem: "Catetos de 3 cm e 4 cm",
          solution: "a² = 3² + 4² = 9 + 16 = 25, então a = √25 = 5 cm.",
        },
      },
    ],
    exercises: [
      {
        id: "q1",
        prompt: "Qual a área de um retângulo de base 6 cm e altura 4 cm, em cm²?",
        type: "numeric",
        difficulty: "medio",
        answer: "24",
        explanation: "Área do retângulo = base × altura = 6 × 4 = 24 cm².",
      },
      {
        id: "q2",
        prompt: "Qual o perímetro de um quadrado de lado 7 cm, em cm?",
        type: "numeric",
        difficulty: "medio",
        answer: "28",
        explanation: "Perímetro do quadrado = 4 × lado = 4 × 7 = 28 cm.",
      },
      {
        id: "q3",
        prompt: "Qual a área de um triângulo de base 10 cm e altura 6 cm, em cm²?",
        type: "numeric",
        difficulty: "medio",
        answer: "30",
        explanation: "Área do triângulo = (base × altura) / 2 = (10 × 6) / 2 = 30 cm².",
      },
      {
        id: "q4",
        prompt: "Um triângulo retângulo tem catetos de 6 cm e 8 cm. Qual a medida da hipotenusa, em cm?",
        type: "numeric",
        difficulty: "medio",
        answer: "10",
        explanation: "Pitágoras: a² = 6² + 8² = 36 + 64 = 100, então a = √100 = 10 cm.",
      },
      {
        id: "q5",
        prompt: "Um triângulo retângulo tem hipotenusa de 13 cm e um cateto de 5 cm. Qual a medida do outro cateto, em cm?",
        type: "numeric",
        difficulty: "medio",
        answer: "12",
        explanation: "Pitágoras: 13² - 5² = 169 - 25 = 144, então o cateto = √144 = 12 cm.",
      },
      {
        id: "q6",
        prompt: "Qual a fórmula da área de um círculo de raio r?",
        type: "multiple-choice",
        difficulty: "medio",
        options: ["πr²", "2πr", "πr", "4πr²"],
        answer: "πr²",
        explanation: "A área do círculo é π multiplicado pelo raio ao quadrado.",
      },
      {
        id: "f1",
        prompt: "Qual a área de um quadrado de lado 5 cm, em cm²?",
        type: "numeric",
        difficulty: "facil",
        answer: "25",
        explanation: "Área do quadrado = lado × lado = 5 × 5 = 25 cm².",
      },
      {
        id: "f2",
        prompt: "Qual o perímetro de um retângulo de base 8 cm e altura 3 cm, em cm?",
        type: "numeric",
        difficulty: "facil",
        answer: "22",
        explanation: "Perímetro = 2×(base+altura) = 2×(8+3) = 22 cm.",
      },
      {
        id: "f3",
        prompt: "Qual a área de um triângulo de base 8 cm e altura 5 cm, em cm²?",
        type: "numeric",
        difficulty: "facil",
        answer: "20",
        explanation: "Área do triângulo = (base×altura)/2 = (8×5)/2 = 20 cm².",
      },
      {
        id: "f4",
        prompt: "Qual o perímetro de um triângulo equilátero de lado 6 cm, em cm?",
        type: "numeric",
        difficulty: "facil",
        answer: "18",
        explanation: "Perímetro = 3 × lado = 3 × 6 = 18 cm.",
      },
      {
        id: "f5",
        prompt: "Um quadrado tem área 36 cm². Qual a medida do lado, em cm?",
        type: "numeric",
        difficulty: "facil",
        answer: "6",
        explanation: "O lado é a raiz quadrada da área: √36 = 6 cm.",
      },
      {
        id: "f6",
        prompt: "Qual a área de um retângulo de base 10 cm e altura 2 cm, em cm²?",
        type: "numeric",
        difficulty: "facil",
        answer: "20",
        explanation: "Área do retângulo = base × altura = 10 × 2 = 20 cm².",
      },
      {
        id: "d1",
        prompt: "Um triângulo retângulo tem catetos de 9 cm e 12 cm. Qual a medida da hipotenusa, em cm?",
        type: "numeric",
        difficulty: "dificil",
        answer: "15",
        explanation: "Pitágoras: a² = 9² + 12² = 81 + 144 = 225, então a = √225 = 15 cm.",
      },
      {
        id: "d2",
        prompt: "Um retângulo tem perímetro 26 cm e base 8 cm. Qual é a altura, em cm?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "2×(8+h)=26, então 8+h=13, logo h=5 cm.",
      },
      {
        id: "d3",
        prompt: "Um terreno retangular tem 15 m de base e 60 m² de área. Qual é a altura, em m?",
        type: "numeric",
        difficulty: "dificil",
        answer: "4",
        explanation: "Altura = área ÷ base = 60 ÷ 15 = 4 m.",
      },
      {
        id: "d4",
        prompt: "Um triângulo retângulo tem hipotenusa 25 cm e um cateto de 15 cm. Qual a medida do outro cateto, em cm?",
        type: "numeric",
        difficulty: "dificil",
        answer: "20",
        explanation: "Pitágoras: 25² - 15² = 625 - 225 = 400, então o cateto = √400 = 20 cm.",
      },
      {
        id: "d5",
        prompt: "A área de um triângulo é 45 cm² e a base mede 9 cm. Qual é a altura, em cm?",
        type: "numeric",
        difficulty: "dificil",
        answer: "10",
        explanation: "(9×h)/2=45, então 9h=90, logo h=10 cm.",
      },
      {
        id: "d6",
        prompt: "Um retângulo tem base igual ao dobro da altura. Se a área é 50 cm², qual é a altura, em cm?",
        type: "numeric",
        difficulty: "dificil",
        answer: "5",
        explanation: "base=2h. Área = 2h×h = 2h² = 50, então h²=25, logo h=5 cm.",
      },
      {
        id: "o1",
        prompt: "Um triângulo retângulo tem catetos 5 cm e 12 cm. Qual é a área do triângulo, em cm²?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "30",
        explanation: "Os catetos servem de base e altura: área = (5×12)/2 = 30 cm².",
      },
      {
        id: "o2",
        prompt:
          "Um quadrado e um retângulo têm a mesma área. O retângulo tem base 16 cm e altura 4 cm. Qual é o lado do quadrado, em cm?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "8",
        explanation: "Área do retângulo = 16×4=64 cm². Lado do quadrado = √64 = 8 cm.",
      },
      {
        id: "o3",
        prompt:
          "Um triângulo retângulo isósceles tem os dois catetos iguais a 6 cm. Qual é a medida da hipotenusa ao quadrado, em cm²?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "72",
        explanation: "Pitágoras: a² = 6² + 6² = 36 + 36 = 72 cm².",
      },
      {
        id: "o4",
        prompt:
          "Um pátio retangular tem perímetro 40 m. Se a base é o triplo da altura, qual é a área do pátio, em m²?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "75",
        explanation: "2×(3h+h)=40, então 8h=40, logo h=5 e base=15. Área = 15×5=75 m².",
      },
      {
        id: "o5",
        prompt:
          "A hipotenusa de um triângulo retângulo mede 17 cm e um dos catetos mede 8 cm. Qual é a área do triângulo, em cm²?",
        type: "numeric",
        difficulty: "olimpiada",
        answer: "60",
        explanation:
          "Outro cateto: √(17²-8²)=√(289-64)=√225=15 cm. Área = (8×15)/2 = 60 cm².",
      },
      {
        id: "o6",
        prompt: "Se o lado de um quadrado dobra, a área fica multiplicada por quanto?",
        type: "multiple-choice",
        difficulty: "olimpiada",
        options: ["4", "2", "8", "16"],
        answer: "4",
        explanation: "A área é proporcional ao quadrado do lado: (2L)² = 4L², ou seja, multiplica por 4.",
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
