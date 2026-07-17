import type { RelatedTopicRef } from "./curriculum";

/** Biografias curtas dos grandes nomes da história da matemática, exibidas
 * em /matematicos e /matematicos/[figura]. Referenciadas pelos ids em
 * HistoricalNote.mathematicians (curriculum.ts), que viram links nos
 * tópicos — e cada biografia aponta de volta para os tópicos do app onde
 * a contribuição da pessoa aparece. */
export type Mathematician = {
  id: string;
  name: string;
  years: string;
  origin: string;
  tagline: string;
  portrait: string;
  bio: string[];
  contributions: string[];
  relatedTopics?: RelatedTopicRef[];
};

export const MATHEMATICIANS: Mathematician[] = [
  {
    id: "pitagoras",
    name: "Pitágoras",
    years: "c. 570–495 a.C.",
    origin: "Samos, Grécia Antiga",
    tagline: "O teorema mais famoso da geometria",
    portrait: "📐",
    bio: [
      "Filósofo e matemático grego, Pitágoras fundou em Crotona (sul da Itália) uma escola que era ao mesmo tempo comunidade filosófica e religiosa. Para os pitagóricos, os números eram a essência de todas as coisas — da música ao movimento dos astros.",
      "O teorema que leva seu nome (a² = b² + c² no triângulo retângulo) já era usado na prática por babilônios e egípcios séculos antes, mas a tradição atribui à escola pitagórica a primeira demonstração geral — a diferença entre saber que funciona e provar por que funciona.",
      "Ironicamente, foi dentro da própria escola que se descobriu que √2 não pode ser escrito como fração — os números irracionais. A descoberta abalou a crença pitagórica de que tudo se reduzia a razões entre inteiros.",
    ],
    contributions: [
      "Teorema de Pitágoras (primeira demonstração atribuída à sua escola)",
      "Ligação entre harmonia musical e razões numéricas",
      "Tradição de demonstrar resultados em vez de só aplicá-los",
    ],
    relatedTopics: [
      { levelId: "fundamental-2", topicId: "geometria-plana" },
      { levelId: "medio", topicId: "trigonometria-triangulo-retangulo" },
    ],
  },
  {
    id: "euclides",
    name: "Euclides",
    years: "c. 300 a.C.",
    origin: "Alexandria, Egito helenístico",
    tagline: "O pai da geometria",
    portrait: "📏",
    bio: [
      "Pouco se sabe da vida de Euclides além de que ensinou em Alexandria, o grande centro intelectual do mundo helenístico. Sua obra, porém, é a mais influente da história da matemática.",
      "Os Elementos — treze livros que partem de definições e cinco postulados e deduzem, passo a passo, centenas de teoremas — organizaram todo o conhecimento geométrico da época e definiram o padrão do que significa demonstrar algo em matemática. A obra foi usada como livro-texto por mais de dois mil anos.",
      "Também é dele o algoritmo de Euclides, o método para achar o máximo divisor comum de dois números — exatamente o que usamos até hoje para simplificar frações.",
    ],
    contributions: [
      "Os Elementos: a geometria organizada como sistema axiomático",
      "Algoritmo de Euclides para o MDC (base da simplificação de frações)",
      "Demonstração de que existem infinitos números primos",
    ],
    relatedTopics: [
      { levelId: "fundamental-2", topicId: "geometria-plana" },
      { levelId: "fundamental-2", topicId: "fracoes" },
    ],
  },
  {
    id: "arquimedes",
    name: "Arquimedes",
    years: "c. 287–212 a.C.",
    origin: "Siracusa, Sicília",
    tagline: "O maior matemático da Antiguidade",
    portrait: "🛁",
    bio: [
      "Arquimedes de Siracusa combinou como ninguém a matemática pura e a engenharia. É dele o famoso 'Eureka!' — a descoberta, na banheira, de como medir o volume de um corpo irregular pela água que ele desloca.",
      "Calculou áreas e volumes de figuras curvas 'fatiando-as' em pedaços cada vez menores (o método da exaustão) — essencialmente a ideia central do cálculo integral, dois mil anos antes de Newton e Leibniz. Também obteve uma aproximação notável de π usando polígonos de 96 lados.",
      "Morreu durante o saque de Siracusa pelos romanos. Segundo a tradição, estava desenhando círculos na areia quando disse ao soldado: 'Não perturbe meus círculos'.",
    ],
    contributions: [
      "Método da exaustão: áreas e volumes por aproximações sucessivas (precursor do cálculo)",
      "Aproximação de π entre 3 10/71 e 3 1/7",
      "Princípio de Arquimedes (empuxo) e a lei das alavancas",
    ],
    relatedTopics: [
      { levelId: "fundamental-2", topicId: "geometria-plana" },
      { levelId: "superior", topicId: "limites-e-derivadas" },
    ],
  },
  {
    id: "hipatia",
    name: "Hipátia",
    years: "c. 355–415 d.C.",
    origin: "Alexandria, Egito romano",
    tagline: "A primeira matemática cuja vida conhecemos bem",
    portrait: "🌟",
    bio: [
      "Hipátia liderou a escola neoplatônica de Alexandria, onde ensinava matemática, astronomia e filosofia — uma posição extraordinária para uma mulher no mundo antigo.",
      "Editou e comentou obras fundamentais, como a Aritmética de Diofanto e as Cônicas de Apolônio — as curvas (elipse, parábola, hipérbole) que séculos depois se revelariam as órbitas dos planetas e a base da geometria analítica.",
      "Foi assassinada por uma turba em 415, num episódio de violência política e religiosa. Tornou-se símbolo perene da defesa da razão e do conhecimento.",
    ],
    contributions: [
      "Comentários que preservaram Diofanto e as Cônicas de Apolônio",
      "Liderança da escola de Alexandria em seu período final",
      "Construção de instrumentos astronômicos (astrolábio, hidrômetro)",
    ],
    relatedTopics: [{ levelId: "medio", topicId: "geometria-analitica" }],
  },
  {
    id: "al-khwarizmi",
    name: "Al-Khwarizmi",
    years: "c. 780–850",
    origin: "Bagdá, Califado Abássida",
    tagline: "De onde vêm as palavras 'álgebra' e 'algoritmo'",
    portrait: "📖",
    bio: [
      "Muhammad ibn Musa al-Khwarizmi trabalhou na Casa da Sabedoria de Bagdá, o maior centro científico do mundo medieval, onde obras gregas, indianas e persas eram traduzidas e expandidas.",
      "Seu livro sobre 'al-jabr' (restauração) apresentou métodos sistemáticos para resolver equações de 1º e 2º graus — não com fórmulas simbólicas, mas com receitas passo a passo e justificativas geométricas. Do título do livro veio a palavra 'álgebra'; da latinização do seu nome ('Algoritmi'), a palavra 'algoritmo'.",
      "Também escreveu o tratado que difundiu no Ocidente os numerais indo-arábicos e o sistema posicional com zero — os algarismos que usamos hoje.",
    ],
    contributions: [
      "Métodos sistemáticos para equações do 1º e 2º graus (origem da álgebra)",
      "Difusão dos numerais indo-arábicos e do zero no Ocidente",
      "Seu nome latinizado deu origem à palavra 'algoritmo'",
    ],
    relatedTopics: [
      { levelId: "medio", topicId: "funcao-quadratica" },
      { levelId: "programacao-iniciante", topicId: "logica-de-programacao" },
    ],
  },
  {
    id: "descartes",
    name: "René Descartes",
    years: "1596–1650",
    origin: "França",
    tagline: "Uniu a álgebra e a geometria",
    portrait: "🪰",
    bio: [
      "Filósofo do 'penso, logo existo', Descartes também transformou a matemática. Em La Géométrie (1637), apêndice do Discurso do Método, mostrou que pontos podem ser descritos por pares de números — e curvas, por equações.",
      "Essa ponte entre álgebra e geometria (o plano cartesiano leva seu nome) permitiu resolver problemas geométricos com contas e visualizar equações como desenhos. Sem ela, o cálculo de Newton e Leibniz não teria linguagem para existir.",
      "Conta a lenda que a ideia surgiu observando uma mosca no teto do quarto: para descrever a posição dela, bastavam as distâncias até duas paredes — as coordenadas.",
    ],
    contributions: [
      "Geometria analítica: curvas descritas por equações no plano cartesiano",
      "Notação moderna de expoentes (x², x³)",
      "Base conceitual para o desenvolvimento do cálculo",
    ],
    relatedTopics: [
      { levelId: "medio", topicId: "geometria-analitica" },
      { levelId: "medio", topicId: "funcao-primeiro-grau" },
    ],
  },
  {
    id: "newton",
    name: "Isaac Newton",
    years: "1643–1727",
    origin: "Inglaterra",
    tagline: "Cálculo, gravidade e as leis do movimento",
    portrait: "🍎",
    bio: [
      "Durante a peste de 1665–66, com a universidade de Cambridge fechada, Newton desenvolveu em isolamento as bases do cálculo, da teoria da gravitação e da óptica — talvez o período mais produtivo de um cientista na história.",
      "O cálculo (que ele chamava de 'método das fluxões') resolve o problema de lidar com variação contínua: velocidades instantâneas, tangentes, áreas sob curvas. Leibniz chegou às mesmas ideias de forma independente, com a notação que usamos hoje — a disputa entre os dois dividiu a matemática europeia por décadas.",
      "Seu Principia Mathematica (1687) deduziu as órbitas dos planetas das mesmas leis que regem a queda de uma maçã — mostrando que o céu e a Terra obedecem à mesma matemática.",
    ],
    contributions: [
      "Cálculo diferencial e integral (com Leibniz, independentemente)",
      "Leis do movimento e gravitação universal (Principia, 1687)",
      "Binômio generalizado e contribuições à óptica",
    ],
    relatedTopics: [
      { levelId: "superior", topicId: "limites-e-derivadas" },
      { levelId: "superior", topicId: "equacoes-diferenciais" },
    ],
  },
  {
    id: "euler",
    name: "Leonhard Euler",
    years: "1707–1783",
    origin: "Basileia, Suíça",
    tagline: "O matemático mais produtivo da história",
    portrait: "✍️",
    bio: [
      "Euler publicou mais de 800 trabalhos — estima-se que um terço de toda a matemática, física e mecânica publicada na Europa entre 1726 e 1800 saiu da pena dele. Continuou produzindo mesmo depois de ficar completamente cego, ditando de memória.",
      "Boa parte da linguagem matemática moderna é invenção sua: a notação f(x) para funções, a letra e para a base dos logaritmos naturais, i para √(-1), Σ para somatórios e a popularização de π.",
      "Resolveu o problema das pontes de Königsberg — pode-se atravessar as sete pontes da cidade sem repetir nenhuma? — criando de passagem a teoria dos grafos, hoje essencial em redes, mapas e computação.",
    ],
    contributions: [
      "Notações f(x), e, i, Σ e popularização de π",
      "Identidade de Euler: e^(iπ) + 1 = 0",
      "Teoria dos grafos (pontes de Königsberg) e avanços em praticamente toda área da matemática",
    ],
    relatedTopics: [
      { levelId: "medio", topicId: "funcao-primeiro-grau" },
      { levelId: "medio", topicId: "trigonometria-triangulo-retangulo" },
    ],
  },
  {
    id: "gauss",
    name: "Carl Friedrich Gauss",
    years: "1777–1855",
    origin: "Brunswick, Alemanha",
    tagline: "O príncipe da matemática",
    portrait: "👑",
    bio: [
      "Conta-se que, ainda criança, Gauss somou os números de 1 a 100 em segundos: percebeu que 1+100, 2+99, 3+98… formam 50 pares de 101, logo a soma é 5050 — exatamente a ideia por trás da fórmula da soma de uma progressão aritmética.",
      "Aos 24 anos publicou as Disquisitiones Arithmeticae, que refundou a teoria dos números. Previu a posição do asteroide Ceres com seu método dos mínimos quadrados — o mesmo que hoje ajusta a reta de regressão em estatística e econometria.",
      "A 'curva de Gauss' (distribuição normal) leva seu nome porque ele a usou para modelar erros de medição astronômica. Seu lema era 'pauca sed matura': pouco, mas maduro — só publicava o que considerava perfeito.",
    ],
    contributions: [
      "Disquisitiones Arithmeticae: a teoria dos números moderna",
      "Método dos mínimos quadrados (base da regressão linear)",
      "Distribuição normal ('curva de Gauss') na modelagem de erros",
    ],
    relatedTopics: [
      { levelId: "medio", topicId: "progressoes" },
      { levelId: "estatistica-avancado", topicId: "distribuicao-normal" },
      { levelId: "econometria-iniciante", topicId: "regressao-linear-simples" },
    ],
  },
];

export function getMathematician(id: string): Mathematician | undefined {
  return MATHEMATICIANS.find((m) => m.id === id);
}
