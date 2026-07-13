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
        answer: "32",
        explanation: "Mesma base: soma os expoentes. 2³⁺² = 2⁵ = 32.",
      },
      {
        id: "q2",
        prompt: "Quanto é (-3)²?",
        type: "numeric",
        answer: "9",
        explanation: "Expoente par com base negativa dá resultado positivo: (-3) × (-3) = 9.",
      },
      {
        id: "q3",
        prompt: "Quanto é (-2)³?",
        type: "numeric",
        answer: "-8",
        explanation: "Expoente ímpar mantém o sinal negativo: (-2) × (-2) × (-2) = -8.",
      },
      {
        id: "q4",
        prompt: "Quanto é √81?",
        type: "numeric",
        answer: "9",
        explanation: "9 × 9 = 81, então √81 = 9.",
      },
      {
        id: "q5",
        prompt: "Quanto é ∛27 (raiz cúbica de 27)?",
        type: "numeric",
        answer: "3",
        explanation: "3 × 3 × 3 = 27, então ∛27 = 3.",
      },
      {
        id: "q6",
        prompt: "Qual o valor de 2⁻²?",
        type: "multiple-choice",
        options: ["1/4", "-4", "4", "-1/4"],
        answer: "1/4",
        explanation: "Expoente negativo inverte a base: 2⁻² = 1/2² = 1/4.",
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
        answer: "28",
        explanation: "Cada caneta custa 12 ÷ 3 = 4 reais. 7 canetas custam 7 × 4 = 28 reais.",
      },
      {
        id: "q2",
        prompt: "Calcule 20% de 150.",
        type: "numeric",
        answer: "30",
        explanation: "20% = 0,20. 0,20 × 150 = 30.",
      },
      {
        id: "q3",
        prompt: "Calcule 8% de 50.",
        type: "numeric",
        answer: "4",
        explanation: "8% = 0,08. 0,08 × 50 = 4.",
      },
      {
        id: "q4",
        prompt: "Um produto de R$ 80 tem desconto de 25%. Qual o novo preço, em reais?",
        type: "numeric",
        answer: "60",
        explanation: "25% de 80 é 20. O novo preço é 80 - 20 = 60 reais.",
      },
      {
        id: "q5",
        prompt: "Qual fração, já simplificada, representa 40%?",
        type: "multiple-choice",
        options: ["2/5", "4/5", "1/4", "5/2"],
        answer: "2/5",
        explanation: "40% = 40/100. Dividindo numerador e denominador por 20: 2/5.",
      },
      {
        id: "q6",
        prompt: "Na proporção a/4 = 6/8, qual o valor de a?",
        type: "numeric",
        answer: "3",
        explanation: "Produto dos extremos = produto dos meios: a × 8 = 4 × 6 = 24, então a = 3.",
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
        answer: "1",
        explanation: "Δ = b² - 4ac = (-5)² - 4×1×6 = 25 - 24 = 1.",
      },
      {
        id: "q2",
        prompt: "Resolva x² - 5x + 6 = 0. Informe a menor raiz.",
        type: "numeric",
        answer: "2",
        explanation: "Com Δ=1, x = (5 ± 1)/2, o que dá x=3 ou x=2. A menor raiz é 2.",
      },
      {
        id: "q3",
        prompt: "Resolva x² - 5x + 6 = 0. Informe a maior raiz.",
        type: "numeric",
        answer: "3",
        explanation: "Com Δ=1, x = (5 ± 1)/2, o que dá x=3 ou x=2. A maior raiz é 3.",
      },
      {
        id: "q4",
        prompt: "Resolva a equação incompleta x² - 9 = 0. Informe a raiz positiva.",
        type: "numeric",
        answer: "3",
        explanation: "x² = 9, então x = 3 ou x = -3. A raiz positiva é 3.",
      },
      {
        id: "q5",
        prompt: "Resolva a equação incompleta x² - 4x = 0. Informe a raiz diferente de zero.",
        type: "numeric",
        answer: "4",
        explanation: "Coloque x em evidência: x(x - 4) = 0, então x = 0 ou x = 4.",
      },
      {
        id: "q6",
        prompt: "Qual o discriminante de x² + 2x + 1 = 0?",
        type: "multiple-choice",
        options: ["0", "1", "4", "-4"],
        answer: "0",
        explanation: "Δ = 2² - 4×1×1 = 4 - 4 = 0 (raiz dupla, x = -1).",
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
        answer: "24",
        explanation: "Área do retângulo = base × altura = 6 × 4 = 24 cm².",
      },
      {
        id: "q2",
        prompt: "Qual o perímetro de um quadrado de lado 7 cm, em cm?",
        type: "numeric",
        answer: "28",
        explanation: "Perímetro do quadrado = 4 × lado = 4 × 7 = 28 cm.",
      },
      {
        id: "q3",
        prompt: "Qual a área de um triângulo de base 10 cm e altura 6 cm, em cm²?",
        type: "numeric",
        answer: "30",
        explanation: "Área do triângulo = (base × altura) / 2 = (10 × 6) / 2 = 30 cm².",
      },
      {
        id: "q4",
        prompt: "Um triângulo retângulo tem catetos de 6 cm e 8 cm. Qual a medida da hipotenusa, em cm?",
        type: "numeric",
        answer: "10",
        explanation: "Pitágoras: a² = 6² + 8² = 36 + 64 = 100, então a = √100 = 10 cm.",
      },
      {
        id: "q5",
        prompt: "Um triângulo retângulo tem hipotenusa de 13 cm e um cateto de 5 cm. Qual a medida do outro cateto, em cm?",
        type: "numeric",
        answer: "12",
        explanation: "Pitágoras: 13² - 5² = 169 - 25 = 144, então o cateto = √144 = 12 cm.",
      },
      {
        id: "q6",
        prompt: "Qual a fórmula da área de um círculo de raio r?",
        type: "multiple-choice",
        options: ["πr²", "2πr", "πr", "4πr²"],
        answer: "πr²",
        explanation: "A área do círculo é π multiplicado pelo raio ao quadrado.",
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
