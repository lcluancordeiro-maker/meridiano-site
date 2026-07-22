# Meridiano Matemática

App web (PWA) de ensino de matemática, estatística, matemática
financeira, programação e machine learning, do Ensino Fundamental ao
Superior, com teoria, calculadora gráfica, exercícios em 4 níveis de
dificuldade e gamificação.

Por ser um PWA, funciona em qualquer navegador e pode ser instalado na
tela inicial no iOS e Android como um app nativo — sem precisar de loja
de aplicativos.

## Documentação

Este README cobre a visão geral do projeto, como rodar localmente, a
estrutura do código e os testes. Para configurar uma integração
(Supabase, Stripe, LiveKit, notificações push etc.), veja
[docs/setup.md](docs/setup.md); para entender como um recurso
específico funciona por dentro (chat, comunidades, turmas, moderação,
idioma etc.), veja [docs/features.md](docs/features.md).

## Estado atual

- **Ensino Fundamental I** (10 tópicos em 2 capítulos, voltado para os
  anos iniciais — 1º-5º ano, sem álgebra): capítulo "Números" —
  "Números Naturais e Valor Posicional", "Arredondamento de Números",
  "Adição e Subtração", "Adição e Subtração com Números Maiores",
  "Multiplicação e Divisão" e "Divisão com Resto" —; capítulo
  "Frações, Formas e Medidas" — "Frações do Dia a Dia", "Frações
  Equivalentes e Comparação", "Formas Geométricas e Medidas" e "Área
  de Figuras Planas". Os 5 tópicos originais cobrem números inteiros
  positivos, tabuada e medidas do cotidiano; o segundo nível de tópicos
  aprofunda cada um deles — arredondamento e estimativa, contas com
  números de 4-5 algarismos, quociente e resto, frações equivalentes e
  soma com denominadores diferentes, e área (complementando o
  perímetro já visto). Reaproveita os widgets `integer-line-explorer`
  e `fraction-visualizer` já usados no Fundamental II, e estreia três
  widgets novos: `place-value-explorer` (`PlaceValueExplorer.tsx`) —
  sliders de milhar/centena/dezena/unidade que montam um número ao
  vivo, com a decomposição (ex: "3.426 = 3000 + 400 + 20 + 6") e uma
  barra de blocos preenchidos por casa —, `multiplication-array-explorer`
  (`MultiplicationArrayExplorer.tsx`) — uma grade de fileiras ×
  colunas que mostra a multiplicação como soma repetida em blocos — e
  `rectangle-perimeter-explorer` (`RectanglePerimeterExplorer.tsx`) —
  um retângulo desenhado à escala a partir de comprimento e largura,
  com o cálculo do perímetro ao vivo. Os 5 tópicos do segundo nível
  também têm "Explore ao vivo" agora: `rounding-explorer`
  (`RoundingExplorer.tsx`, reta numérica que mostra para qual dezena/
  centena/milhar um número arredonda), `column-addition-explorer`
  (`ColumnAdditionExplorer.tsx`, refaz a soma coluna por coluna
  explicando cada "vai um"), `division-remainder-explorer`
  (`DivisionRemainderExplorer.tsx`, agrupa bolinhas de acordo com o
  divisor e destaca o resto à parte) e `equivalent-fractions-explorer`
  (`EquivalentFractionsExplorer.tsx`, duas barras de fração lado a
  lado provando a equivalência) — o quinto, "Área de Figuras Planas",
  reaproveita o `multiplication-array-explorer` (a mesma grade
  fileiras × colunas prova tanto multiplicação quanto área). Ao
  adicionar o conteúdo original, veio à tona que `fundamental1Topics`
  nunca tinha sido registrado em `e2e/exercises-correctness.spec.ts`
  — corrigido, o que passou a cobrir automaticamente todos os
  exercícios do Fundamental I (antes só verificados manualmente).
- **Ensino Fundamental II** (7 tópicos: números inteiros, frações,
  álgebra, potenciação/radiciação, proporcionalidade/porcentagem,
  equações do 2º grau, geometria plana), cada um com 24 exercícios
  divididos em 4 níveis de dificuldade (Fácil/Médio/Difícil/Olimpíada),
  escolhidos livremente pelo aluno.
- **Ensino Médio** — 9 tópicos: "Função do 1º Grau" (coeficientes,
  raiz, gráfico), "Função Quadrática" (vértice, concavidade, gráfico em
  parábola), "Trigonometria no Triângulo Retângulo" (seno, cosseno,
  tangente, Teorema de Pitágoras), "Trigonometria em Triângulos
  Quaisquer" — a área de um triângulo qualquer (Área = ½×a×b×sen(C)), a
  Lei dos Cossenos (generaliza Pitágoras: c²=a²+b²-2ab×cos(C)) e a Lei
  dos Senos (a/sen(A)=b/sen(B)=c/sen(C)=2R), com o widget
  `TriangleAreaExplorer` desenhando o triângulo à escala a partir de
  dois lados e o ângulo entre eles —, "Setores Circulares e Polígonos
  Regulares" — área e comprimento de arco de um setor circular
  ((θ/360°)×πr² e (θ/360°)×2πr) e a área de um polígono regular a
  partir do apótema (perímetro×apótema/2), com o widget
  `CircularSectorExplorer` desenhando o setor à escala a partir do
  raio e do ângulo —, "Geometria Analítica" (distância
  entre pontos, ponto médio, coeficiente angular, equação da reta),
  "Progressões Aritméticas e Geométricas" (termo geral, soma de PA/PG),
  "Números Complexos" (a unidade imaginária i, soma, multiplicação,
  módulo e o conjugado) e "Vetores" (módulo, soma,
  subtração, produto escalar e perpendicularidade) — os três tópicos de
  trigonometria/círculo juntos no capítulo "Geometria e Trigonometria"
  — todos os 9 tópicos em 4 níveis de dificuldade, com gráfico
  interativo embutido onde faz sentido (parábola, `sin(x)`, reta,
  vetores).
- **Estatística** — trilha independente com 3 níveis (Iniciante:
  medidas de tendência central, medidas de dispersão (amplitude,
  variância, desvio padrão), "Gráficos e Distribuição de
  Frequências" — tabelas de frequência absoluta/relativa/acumulada e
  leitura de gráficos de barras e de setores — e agora também
  "Amostragem e Coleta de Dados" — população vs. amostra, tipos de
  amostragem (aleatória simples, sistemática, estratificada, por
  conveniência) e como o tamanho da amostra afeta o erro de amostragem;
  Intermediário:
  probabilidade básica, regras de probabilidade, "Distribuição
  Binomial" — combinações C(n,k), a fórmula P(X=k) e o valor esperado
  n×p — e agora também "Probabilidade Condicional e Independência" —
  P(A|B) = P(A∩B)/P(B), como verificar independência (P(A∩B)=P(A)×P(B))
  e a regra do produto para eventos dependentes; Avançado: distribuição
  normal e escore-z, intervalos de confiança, "Testes de Hipótese" —
  H0/H1, estatística de teste z, valor crítico e a regra de decisão de
  rejeitar ou não a hipótese nula — e agora também "Teste Qui-Quadrado"
  — comparar observado com esperado por categoria, χ² = Σ(O-E)²/E, e a
  ideia de valor crítico para decidir se a diferença é só ruído
  amostral). Os 5 tópicos mais antigos da trilha (Medidas de Tendência
  Central, Probabilidade Básica, Regras de Probabilidade, Distribuição
  Normal e Intervalos de Confiança) tinham só o nível Médio — ganharam
  agora Fácil, Difícil e Olimpíada também (mais 18 exercícios cada),
  fechando a lacuna encontrada numa auditoria de qualidade.
- **Programação & Machine Learning** — trilha independente com 4
  níveis disponíveis: "Lógica de Programação" (Iniciante: variáveis,
  comparações, condicionais, "Vetores e Listas" — percorrer um vetor
  com laços, somar/buscar elementos —, "Strings e Manipulação de
  Texto" — tamanho, concatenação e subcadeia/substring — e agora
  também "Operadores Lógicos (E, OU, NÃO)" — combinar condições com E,
  OU e NÃO em pseudocódigo, ligado à trilha de matemática Lógica e
  Conjuntos), "Estruturas de Repetição" (Intermediário: laços 'para'/'enquanto',
  repetições aninhadas, "Funções e Modularização" — parâmetros,
  retorno, escopo de variáveis e composição de funções —, "Busca e
  Ordenação Básica" — busca linear e o bubble sort, contando
  comparações e passagens — e agora também "Dicionários e Estruturas
  Chave-Valor" — busca por chave em O(1) contra a busca sequencial em
  O(n) de uma lista, e quando usar cada estrutura), "Orientação a Objetos" (Avançado,
  Premium: classes, atributos, métodos, encapsulamento, "Estruturas de
  Dados: Pilhas e Filas" — LIFO/FIFO, quando usar cada uma —,
  "Recursão" — o caso base, como as chamadas desempilham, e
  fatorial/fibonacci como exemplos clássicos — e agora também "Herança
  e Polimorfismo" — classe pai/filha, sobrescrita de método (override)
  e como objetos diferentes respondem de formas diferentes ao mesmo
  método) e "Fundamentos de Aprendizado Supervisionado"
  (Machine Learning — Introdução, Premium: treino/teste, overfitting,
  acurácia e matriz de confusão, "Classificação: Matriz de Confusão,
  Precisão e Revocação" — por que acurácia sozinha engana em classes
  desbalanceadas, e o F1-score —, "Árvores de Decisão" —
  nós/ramos/folhas, impureza, profundidade máxima e como ela se
  relaciona com overfitting — e agora também "Validação Cruzada
  (k-fold)" — por que um único split treino/teste depende de sorte, como
  o k-fold divide os dados em k partes alternando qual serve de teste, e
  a média das k rodadas como métrica mais confiável) — todos ensinados com pseudocódigo
  (independente de linguagem) já que o app não executa código de
  verdade; os exercícios pedem pra prever o valor final de variáveis
  (ou calcular métricas) a partir de um enunciado, não pra escrever
  código.
- **Ensino Superior** (Premium): "Limites e Derivadas" — a porta de
  entrada do Cálculo, com forma indeterminada, regra da potência e o
  limite fundamental de sin(x)/x —, "Integrais": antiderivada, integral
  definida como área sob a curva e o Teorema Fundamental do Cálculo —,
  "Aplicações de Derivadas": pontos críticos, crescimento e
  decrescimento, o teste da derivada segunda para achar máximos e
  mínimos locais, e problemas de otimização (área máxima de um
  retângulo, volume máximo de uma caixa) — e agora também "Equações
  Diferenciais": achar a função original a partir de dy/dx=f(x) e usar
  uma condição inicial para fixar a constante C.
- **Geometria Espacial** (Premium, nova trilha): "Prismas e Cilindros"
  — volume (área da base × altura) e área lateral/total —, "Pirâmides
  e Cones" — sempre 1/3 do volume do prisma/cilindro correspondente,
  mais a geratriz de um cone (g²=r²+h²) —, "Esferas e Sólidos
  Compostos" — volume (4/3)πr³ e área 4πr² da esfera, e como somar ou
  subtrair partes para achar o volume de um sólido composto (silo,
  cavidade) — e agora também "Poliedros e a Relação de Euler":
  vértices, arestas e faces, a relação V-A+F=2 (válida para todo
  poliedro convexo), os 5 sólidos de Platão e a soma dos ângulos das
  faces S=(V-2)×360°. 4 tópicos, 20 exercícios cada, mesmo padrão do
  Ensino Médio/Superior.
- **Lógica e Conjuntos** (gratuita): "Proposições e Conectivos
  Lógicos" — negação, conjunção, disjunção, condicional,
  tabelas-verdade e as Leis de De Morgan —, "Operações com Conjuntos"
  — união, interseção, diferença e o princípio da inclusão-exclusão
  (|A∪B|=|A|+|B|-|A∩B|), com um diagrama de Venn interativo —,
  "Conjuntos Numéricos e Intervalos" — N⊂Z⊂Q⊂R, números irracionais e
  notação/operações com intervalos ([a,b], (a,b) etc) — e "Argumentos
  Lógicos e Validade" — Modus Ponens, Modus Tollens, silogismo
  hipotético e as duas falácias mais comuns (afirmar o consequente,
  negar o antecedente), incluindo exercícios de nível olimpíada que
  testam a diferença entre "forma válida" e "conclusão verdadeira"
  (um argumento pode ter forma inválida e ainda assim chegar numa
  conclusão verdadeira por coincidência, e vice-versa). 4 tópicos, 20
  exercícios cada.
- **Álgebra Linear** (Premium, nova trilha): "Matrizes e Operações" —
  soma/subtração, multiplicação por escalar, multiplicação de matrizes
  (com a ressalva de que não é comutativa) e transposta —, com o widget
  `MatrixOperationsExplorer` mostrando k×A e Aᵀ recalculados ao vivo a
  partir de 4 sliders da matriz A e 1 do escalar k —, "Determinantes" —
  a fórmula ad-bc para 2×2, a regra de Sarrus para 3×3 e propriedades
  (det(AB)=det(A)×det(B), troca de linhas troca o sinal, det=0 significa
  matriz singular) —, reaproveitando o widget `matrix-explorer` já
  existente (seu foco já era o determinante de uma 2×2) —, "Sistemas
  Lineares" — a forma matricial Ax=b, classificação por determinante
  (única solução, sem solução, infinitas soluções) e a regra de Cramer
  (x=Dx/D, y=Dy/D) —, com o widget `LinearSystemExplorer` desenhando
  duas retas a partir de sliders de inclinação/intercepto e apontando o
  ponto de interseção (ou identificando retas paralelas/coincidentes)
  — e "Transformações Lineares e Autovalores/Autovetores" — T(v)=Av,
  a equação característica λ²-traço(A)×λ+det(A)=0 para 2×2, e a relação
  λ₁+λ₂=traço(A), λ₁×λ₂=det(A) —, com o widget `EigenvectorExplorer`
  desenhando v e Av a partir de sliders da matriz e do vetor, destacando
  quando eles ficam paralelos (v é autovetor). 4 tópicos, 20 exercícios
  cada — os exercícios usam sempre uma pergunta sobre um único elemento
  ou escalar (nunca a matriz inteira como resposta), pelo mesmo motivo
  documentado desde "Matrizes e Sistemas Lineares" (UNESP): comparação
  exata de string não lida bem com formatação de matriz.
- **Análise Real** (Premium, nova trilha): "Supremo, Ínfimo e
  Completude dos Reais" — cotas superior/inferior, supremo/ínfimo (a
  menor cota superior/maior cota inferior, que não precisa pertencer ao
  conjunto), a diferença entre máximo/mínimo e supremo/ínfimo, e o
  Axioma da Completude que distingue R de Q (o clássico {x∈Q : x²<2}
  sem supremo racional) —, com o widget `SupremumExplorer` marcando um
  candidato a cota superior numa reta numérica e indicando se ele é só
  uma cota superior ou exatamente o supremo —, "Sequências e
  Convergência" — a definição ε-N de limite de sequência, como achar N
  para um ε dado (aₙ=1/n → N=⌈1/ε⌉) e o Teorema da Sequência Monótona
  (monótona + limitada ⟹ converge) —, com o widget
  `SequenceConvergenceExplorer` plotando os 15 primeiros termos de
  aₙ=1/n e colorindo de verde os que caem dentro da faixa ε ao redor do
  limite —, "Limite de Funções via ε-δ" — a definição ε-δ, como achar
  δ=ε/|m| para uma reta f(x)=mx+b, limites laterais divergentes (por
  que |x|/x não tem limite em 0) e as propriedades operatórias
  (soma/produto/quociente de limites) —, com o widget
  `EpsilonDeltaExplorer` desenhando a faixa ε ao redor de L e a faixa δ
  correspondente ao redor de a sobre o gráfico de f(x)=mx — e
  "Continuidade e Teorema do Valor Intermediário" — as três condições
  de continuidade, os três tipos de descontinuidade (removível, salto,
  essencial) e o TVI (f contínua e sinais opostos nos extremos ⟹ raiz
  garantida no intervalo) —, com o widget `IntermediateValueExplorer`
  desenhando f(x)=x³-3x+1 e destacando em verde f(a) e f(b) quando têm
  sinais opostos. 4 tópicos, 20 exercícios cada — por ser um assunto
  tradicionalmente baseado em demonstração, os exercícios foram
  adaptados para o formato de resposta exata do quiz: cálculos
  numéricos com resposta única bem definida (ex: o menor N para um ε
  dado) ou múltipla escolha conceitual, nunca uma demonstração aberta.
- **Econometria** (Premium): "Regressão Linear Simples" — estimar
  β0/β1 a partir de covariância e variância, prever valores e
  interpretar o coeficiente de determinação (R²) —, "Regressão
  Múltipla e Multicolinearidade": modelos com várias variáveis
  explicativas, R² ajustado e os cuidados com variáveis correlacionadas
  entre si —, "Significância dos Coeficientes (Teste
  t)": a estatística t = β̂/erro-padrão, o valor crítico ≈2 e por que
  um coeficiente "não significante" não prova ausência de relação — e
  agora também "Variáveis Dummy (Binárias)": como indicadoras 0/1
  incluem características categóricas num modelo numérico, a
  interpretação do coeficiente da dummy como deslocamento do intercepto,
  e a "armadilha da dummy" (usar k-1 dummies para k categorias).
- **Calculadora gráfica** (`/calculadora`) com parser de expressões
  próprio (sem `eval`), zoom e navegação por arraste.
- **Desafio do Dia** (na home, inspirado no Brilliant.org): um problema em
  destaque, o mesmo para todo mundo no mesmo dia (seleção determinística
  por data — `src/lib/dailyChallenge.ts`), escolhido só entre exercícios
  gratuitos de dificuldade Fácil/Médio. Responder (certo ou errado) conta
  para uma sequência própria, separada da sequência geral de prática;
  acertar dá um bônus fixo de XP. Funciona sem conta (modo convidado,
  salvo no `localStorage`) — a sequência do Desafio do Dia ainda não é
  sincronizada na nuvem quando logado, diferente da sequência geral (é um
  possível próximo passo).
- **Widgets interativos na teoria** (também inspirado no Brilliant.org):
  algumas seções de teoria têm uma seção extra "Explore ao vivo" com um
  mini-app SVG em vez de só texto — sliders ou pontos arrastáveis que
  recalculam algo na hora. Hoje são vinte e quatro: em "Função do 1º Grau" (Ensino
  Médio), sliders para os coeficientes a/b mostram a reta mudando ao
  vivo; em "Geometria Analítica" (Ensino Médio), dois pontos arrastáveis
  recalculam distância, ponto médio e coeficiente angular em tempo real;
  em "Função Quadrática" (Ensino Médio), sliders para a/b/c desenham a
  parábola e recalculam a concavidade e o vértice na hora; em
  "Trigonometria no Triângulo Retângulo" (Ensino Médio), um slider de
  ângulo move um ponto no círculo trigonométrico e recalcula sen/cos/tan
  ao vivo; em "Frações" (Fundamental II), sliders de numerador e
  denominador preenchem uma barra dividida em partes e mostram a forma
  simplificada quando ela existir; em "Gráficos e Distribuição de
  Frequências" (Estatística — Iniciante), sliders de casos possíveis e
  favoráveis giram a fatia de uma roda mostrando a frequência relativa;
  em "Medidas de Tendência Central" (Estatística — Iniciante), 5
  sliders de valores movem pontos numa reta numérica e recalculam
  média/mediana ao vivo; em "Geometria Plana" (Fundamental II), sliders
  para os dois catetos desenham o triângulo retângulo e recalculam a
  hipotenusa (Teorema de Pitágoras) ao vivo; em "Progressões
  Aritméticas e Geométricas" (Ensino Médio), botões alternam entre PA e
  PG e sliders de primeiro termo/razão recalculam os 6 primeiros termos
  na hora; em "Juros Compostos" (Matemática Financeira — Avançado,
  Premium), sliders de capital/taxa/tempo desenham a curva de
  crescimento exponencial do montante; em "Limites e Derivadas" (Ensino
  Superior, Premium), um slider move um ponto sobre f(x)=x² e desenha a
  reta tangente naquele ponto, recalculando f'(x)=2x ao vivo; em
  "Distribuição Normal e Escore-Z" (Estatística — Avançado, Premium),
  sliders de média/desvio padrão/valor x desenham a curva normal e
  recalculam o escore-z ao vivo; em "Descontos e Acréscimos Percentuais"
  (Matemática Financeira — Iniciante), sliders de valor original e duas
  variações percentuais sucessivas mostram um gráfico de barras
  evoluindo e o valor final em reais ao vivo; em "Regressão Linear
  Simples" (Econometria, Premium), 5 sliders de valores de Y movem
  pontos num gráfico de dispersão e recalculam a reta de regressão e o
  R² na hora; em "Classificação: Matriz de Confusão, Precisão e
  Revocação" (Machine Learning — Introdução, Premium), 4 sliders (VP,
  FP, FN, VN) recalculam precisão, revocação, F1-score e acurácia ao
  vivo; em "Matrizes e Sistemas Lineares" (UNESP, Premium), 4 sliders
  para os elementos a/b/c/d de uma matriz 2×2 recalculam o determinante
  ao vivo; em "Divisibilidade e Números Primos" (OBMEP, Premium), um
  slider de 2 a 100 mostra a fatoração em primos do número e a
  contagem de divisores positivos em tempo real; em "Combinatória e
  Contagem" (OIM, Premium), sliders de n e k recalculam C(n,k) e
  destacam a posição correspondente na linha n do triângulo de Pascal;
  em "Prismas e Cilindros" (Geometria Espacial, Premium), sliders de
  raio e altura desenham um cilindro (elipses + retas) e recalculam
  volume e área lateral em termos de π ao vivo; em "Vetores" (Ensino
  Médio), sliders para as componentes de dois vetores u e v desenham
  as setas a partir da origem (mais a soma tracejada) e recalculam
  módulo e produto escalar ao vivo — com um destaque quando os dois
  ficam perpendiculares; em "Operações com Conjuntos" (Lógica e
  Conjuntos), sliders para |A|, |B| e |A∩B| desenham um diagrama de
  Venn com a contagem de cada região e recalculam |A∪B| ao vivo; em
  "Proposições e Conectivos Lógicos" (Lógica e Conjuntos), botões
  alternam o conectivo (∧/∨/→) e o valor lógico de p e q, destacando
  ao vivo a linha correspondente da tabela-verdade; em "Conjuntos
  Numéricos e Intervalos" (Lógica e Conjuntos), sliders para os
  extremos de dois intervalos os desenham numa reta numérica e
  recalculam interseção (destacada em roxo) e união ao vivo; em "Busca
  e Ordenação Básica" (Programação — Intermediário), um botão "Próximo
  passo" avança o bubble sort uma comparação por vez, destacando o par
  sendo comparado e marcando em verde os elementos já na posição
  final. Os vinte e quatro widgets compartilham as constantes e
  funções de conversão de coordenadas SVG em
  `src/components/widgets/svgUtils.ts` (os widgets mais novos usam sua
  própria escala, calibrada pra cada visualização, e cinco deles —
  matriz, fatoração, combinação, tabela-verdade e bubble sort — nem
  usam SVG, só grid/flexbox/tabela/barras). Os nove widgets em
  trilhas Premium foram verificados manualmente
  (`premium: false` temporário, rodada de e2e, revertido antes do
  commit — mesma técnica descrita em docs/features.md#sobre-o-idioma)
  já que o ambiente de teste não tem Supabase/Stripe configurado pra
  simular uma assinatura ativa. `InteractiveWidgetRenderer` carrega
  cada widget sob demanda via `next/dynamic` (chunk próprio por widget,
  ~2-5KB cada) — uma página de tópico só baixa o widget que ela de
  fato usa, em vez do bundle com os 24 juntos que era carregado antes
  em toda página `/trilha/*/*`, com widget ou sem. Ver
  `src/components/widgets/`. O mesmo problema existia com
  `FunctionGrapher` (o gráfico de função que ~10 dos ~230 tópicos
  mostram via `topic.graphExpressions`) — como `TopicPage` importava
  ele estaticamente, seu JS ia pra toda página de tópico, mesmo nas
  ~220 sem gráfico nenhum. `src/components/LazyFunctionGrapher.tsx` é
  o mesmo padrão de `next/dynamic` + `"use client"` do
  `InteractiveWidgetRenderer`, isolando FunctionGrapher (~9KB) num
  chunk carregado só quando o tópico realmente tem
  `graphExpressions`. A página `/calculadora` continua importando
  `FunctionGrapher` direto — é a única coisa que ela renderiza, então
  não há nada pra economizar ali.
- **História da matemática**: alguns tópicos terminam com uma nota "📜 Um
  pouco de história" contando de onde o assunto veio e por que ele
  importa (o Nilo e a geometria, Al-Khwarizmi e a álgebra, o menino
  Gauss somando de 1 a 100…), com links para as biografias em
  **/matematicos** — 9 figuras por enquanto (Pitágoras, Euclides,
  Arquimedes, Hipátia, Al-Khwarizmi, Descartes, Newton, Euler e Gauss),
  cada uma com vida, principais contribuições e links de volta para os
  tópicos do app onde suas ideias aparecem (mesmo espírito do grafo de
  conhecimento). Campo `historicalNote` opcional em `Topic`
  (`src/data/curriculum/types.ts`) + `src/data/mathematicians.ts`; páginas estáticas
  incluídas no sitemap. Piloto: 5 notas (Frações, Geometria Plana,
  Função Quadrática, Geometria Analítica e Progressões).
- **Liga semanal** (`/liga`, requer conta): ranking amistoso e opt-in do
  XP ganho na semana corrente, no espírito das ligas do Brilliant.org.
  Só participa (e vê o placar) quem clica "Entrar na liga"; apenas o
  nome de exibição aparece, nunca ids. Não há tabela nova de pontuação:
  a função `get_weekly_leaderboard()` (em `supabase/schema.sql`) agrega
  o `xp_log` diário que `gamification_state` já sincroniza, contando a
  semana a partir de segunda-feira, e a flag `leaderboard_opt_in` vive
  no `profiles`. Sem Supabase configurado, a página degrada para o
  aviso padrão de recurso indisponível. Link de entrada em /progresso.
- **Problemas guiados em etapas**: exercícios mais difíceis podem trazer
  um painel recolhível "Resolver em etapas" que decompõe o problema em
  sub-perguntas de um toque, reveladas uma por vez com feedback imediato
  ("primeiro, qual relação usamos?" → "quanto vale 9² + 12²?" → …). O
  painel é um andaime opcional: nunca bloqueia o campo de resposta
  final, que continua sendo a única parte que vale XP. Campo `steps`
  opcional em `Exercise` (`src/data/curriculum/types.ts`), renderizado por
  `GuidedSteps.tsx`. Piloto: 3 exercícios (2 em Geometria Plana, 1 em
  Descontos e Acréscimos).
- **"Continue de onde parou"**: a home mostra, logo abaixo do CTA
  principal, um card apontando para o último tópico em que o aluno
  respondeu algo — no espírito do Brilliant.org de retomar o curso
  exatamente de onde parou. Some por completo para quem nunca praticou
  (só os CTAs padrão do hero aparecem nesse caso). `getMostRecentTopic()`
  em `src/lib/progress.ts` varre o mesmo `localStorage` do quiz e
  resolve pelo `updatedAt` mais recente entre todos os níveis/tópicos;
  `src/components/ContinueLearningCard.tsx` renderiza o card.
- **Progresso real nos cards de nível**: na home, cada card de trilha
  mostra uma barra de progresso fina com a % de dificuldades concluídas
  em todos os tópicos daquele nível — some quando o nível ainda não foi
  começado (mesma convenção do badge de XP na navbar). Reaproveita
  `useChapterCompletion` passando a lista completa de tópicos do nível
  em vez de só um capítulo. Ver `src/components/LevelCardProgress.tsx`.
- **Mapa de progressão (skill path)**: a página de cada trilha
  (`/trilha/[nivel]`) mostra os tópicos como uma jornada vertical —
  nós numerados conectados por uma linha, com o nó virando um ✓ verde
  quando os 4 níveis de dificuldade do tópico são concluídos e a linha
  se pintando de verde atrás dele. Cada nó mostra também o contador
  "n/4 níveis" e os pontinhos por dificuldade. O progresso vem do mesmo
  `localStorage` que o quiz grava, então o mapa atualiza ao vivo. Ver
  `src/components/SkillPath.tsx` (substituiu o antigo grid de
  `TopicCard`).
- **Pré-requisito suave entre capítulos**: quando o capítulo anterior
  ainda não tem nenhum progresso, o divisor do capítulo seguinte mostra
  um aviso 🔒 sugerindo começar por ali primeiro (com tooltip explicando
  qual capítulo). É só uma sugestão: nenhum link de tópico é bloqueado —
  quem quiser pular à frente clica normalmente. O aviso some assim que
  qualquer exercício do capítulo anterior é concluído. Implementado em
  `ChapterHeading` (`SkillPath.tsx`), sem tabela nem estado novo — reusa
  `useChapterCompletion` para descobrir se o capítulo anterior está
  zerado.
- **Capítulos (agrupamento intermediário)**: opcionalmente, uma trilha
  pode definir `chapters` — clusters temáticos de 2-3 tópicos entre o
  nível e o tópico, mais perto de como o Brilliant.org estrutura um
  curso (curso → capítulo → lição). No mapa de progressão, cada
  capítulo aparece como um divisor com o título e um contador somado
  entre todos os seus tópicos e dificuldades ("n/total"), virando ✓
  quando o capítulo inteiro é concluído. Piloto em Ensino Fundamental
  II ("Números e Frações", "Álgebra e Potências", "Equações e
  Geometria") e Ensino Médio ("Funções", "Geometria e Trigonometria",
  "Sequências e Números Complexos") — os demais tópicos e trilhas
  continuam sem `chapters`, renderizando como lista plana, sem nenhuma
  mudança de comportamento. Campo opcional `chapters` em `Level`
  (`src/data/curriculum/types.ts`), `useChapterCompletion.ts` soma o
  progresso do capítulo, e `curriculum.test.ts` garante que, quando
  definidos, os capítulos cobrem cada tópico da trilha exatamente uma
  vez (sem lacunas nem duplicatas).
- **Desafios nos widgets**: três widgets gratuitos (reta, Pitágoras e
  frações) trazem um card "Desafio" que transforma a exploração em
  pergunta — um alvo é proposto ("monte a reta f(x) = -2x + 3", "monte
  um triângulo com hipotenusa exatamente 10", "mostre 1/2 com
  denominador 8") e o botão "Conferir desafio" avalia o estado ao vivo
  dos sliders, no espírito do Brilliant.org em que a interação É a
  pergunta. Componente compartilhado `WidgetChallenge.tsx`, sem
  XP/progresso (como os checks de teoria).
- **"Verifique se entendeu" — teoria e prática intercaladas** (também
  inspirado no Brilliant.org): em vez de ler toda a teoria e só depois
  praticar, algumas seções de teoria terminam com uma pergunta rápida de
  múltipla escolha embutida ali mesmo — um toque na opção já corrige na
  hora (sem botão "Verificar") e mostra a explicação reforçando o que
  acabou de ser lido. É um check de compreensão, não um exercício
  valendo nota: não dá XP nem entra no progresso. O campo
  `checkQuestion` é opcional em qualquer `TheorySection`
  (`src/data/curriculum/types.ts`), renderizado por
  `TheoryCheckQuestion.tsx`. Piloto atual: 10 perguntas em 4 tópicos
  gratuitos — Função do 1º Grau, Frações, Medidas de Tendência Central
  e Descontos e Acréscimos Percentuais.
- **Feedback de erro mais inteligente**: alguns exercícios têm um campo
  `commonMistakeHint` — na primeira resposta errada, em vez de revelar a
  resposta certa na hora, o app mostra uma dica apontando o erro de
  raciocínio mais provável e deixa o aluno tentar de novo; só revela a
  resposta certa numa segunda tentativa errada. Exercícios sem essa dica
  (a maioria, por enquanto) mantêm o comportamento original de revelar na
  hora. Hoje as dicas cobrem "Função do 1º Grau", "Geometria Analítica",
  "Função Quadrática" e "Trigonometria no Triângulo Retângulo" (todos do
  Ensino Médio) — dá pra adicionar aos poucos em outros tópicos.
- **"Reportar erro"**: depois de responder um exercício (`ExerciseQuiz.tsx`)
  ou revelar uma solução do Gauss/resolver por foto (`SolutionDisplay.tsx`),
  o aluno pode sinalizar que algo parece errado — um comentário opcional
  vai para `content_reports` (RLS: qualquer um insere só a própria linha,
  só admin lê a lista) e aparece em `/admin/relatos-conteudo`. É a rede de
  segurança contra erros sutis em conteúdo gerado com ajuda de IA em
  escala — mais barato e contínuo do que só auditorias manuais pontuais.
  `ReportContentButton.tsx` é o mesmo componente nos dois lugares.
- **Tutor de IA (Gauss)**: um chat flutuante (canto inferior esquerdo,
  disponível em qualquer página), inspirado no "Koji" do Brilliant.org.
  Gauss usa o método socrático — faz perguntas e dá pistas em vez de
  entregar a resposta de primeira — e responde sobre qualquer matéria do
  catálogo. Exige login (mesmo padrão do "resolver por foto"), com cota
  diária (15 mensagens grátis, 60 Premium). A resposta chega em streaming
  (a mensagem do Gauss vai aparecendo palavra a palavra, `/api/tutor`
  devolve um stream NDJSON em vez de esperar a resposta inteira) e usa
  extended thinking (`thinking: { type: "adaptive" }`, sem exibir o
  raciocínio ao aluno) para pensar melhor em perguntas mais difíceis.
  Gauss sempre responde no idioma selecionado pelo aluno (o seletor de
  idioma do app), não só em português — `buildTutorSystemPrompt` recebe
  o locale e monta a instrução de idioma dinamicamente
  (`src/lib/localeLanguageName.ts`). A conversa é salva (ver
  `/historico` acima) e pode ser revisitada depois — não fica só no
  navegador. Veja "Configurando o tutor de IA" em docs/setup.md.
  Um botão "Guiado"/"Direto" no topo do chat deixa explícito o que
  antes só existia como uma regra escondida no prompt ("se o aluno
  pedir a resposta depois de tentar, pode explicar"): Guiado (padrão)
  mantém o método socrático; Direto resolve o exercício por completo
  de uma vez, pro aluno que só quer conferir uma resposta — mesmo
  espírito do resolver por foto/quadro, que sempre foram diretos. O
  modo escolhido vai no corpo da requisição a `/api/tutor`
  (`buildTutorSystemPrompt` recebe um terceiro parâmetro `mode`).
  O chat tem uma calculadora gráfica interativa embutida (mesmo
  `FunctionGrapher`/`LazyFunctionGrapher` da página `/calculadora`,
  código-splitado para não pesar o chat quando não usada) — um botão
  "📈 Calculadora" no topo do painel abre/fecha um gráfico compacto e
  arrastável. Ela é "contextual": `extractPlottableExpression`
  (`src/lib/tutor/extractExpression.ts`) escaneia a última resposta do
  Gauss por um padrão `f(x) = ...`/`y = ...`, valida contra o mesmo
  parser da calculadora (`mathExpr.ts`) e usa esse resultado como
  expressão inicial do gráfico sempre que uma nova resposta traz uma
  função plotável — com fallback pra `x^2` quando não encontra nada.
  Gauss também sabe em qual trilha/tópico o aluno está numa página de
  tópico, sem precisar perguntar — `<SetTutorContext>` (renderizado
  pelo `TopicPage`, um Server Component) dispara um evento captado
  pelo tutor global, evitando importar os dados do currículo no bundle
  do layout raiz (ver docs/setup.md).
- **Resolver por foto vira exercício interativo**: em vez de já mostrar
  a solução completa, `SolutionDisplay.tsx` (compartilhado entre
  `/foto` e `/quadro`) primeiro pede pro aluno digitar a própria
  resposta. Acertou de primeira → mostra "Certinho!" e revela o
  passo a passo como reforço. Errou a primeira vez → uma mensagem de
  incentivo pra tentar de novo (sem revelar nada). Errou a segunda vez
  (ou clicou em "Ver solução completa" a qualquer momento) → revela o
  passo a passo e a resposta certa. A comparação (`src/lib/answerMatch.ts`)
  é mais frouxa que a do motor de exercícios — normaliza texto e, se os
  dois lados forem expressões matemáticas válidas (reaproveita
  `compileExpression` de `mathExpr.ts`), também aceita equivalência
  numérica (ex: "0,75" bate com "3/4") e ignora um prefixo tipo "x = "
  em qualquer um dos lados. O botão "Perguntar ao Gauss sobre isso"
  continua disponível o tempo todo, mesmo antes de errar — dá pra pedir
  ajuda ao tutor sem precisar revelar a resposta. Depois de revelar o
  passo a passo, aparece um botão "Praticar um exercício parecido":
  chama `/api/exercicio-parecido` (mesmo schema JSON e mesma cota diária
  do resolver por foto, via `photoSolveSchema.ts` e `increment_photo_usage`)
  pedindo pro Claude criar um problema novo no mesmo assunto e já
  resolvê-lo, substituindo a solução exibida por essa nova — dá pra
  encadear vários exercícios de reforço sem tirar outra foto. O estado de
  "gerando" (`generatingSimilar`) fica separado do estado principal do
  `usePhotoSolve`, então a solução antiga continua na tela (com o botão
  desabilitado) enquanto a nova é gerada, em vez de sumir a UI.
- **Resolver por foto aceita múltiplas fotos por problema**: em `/foto` dá
  pra selecionar/arrastar até 4 fotos de uma vez (uma grade de miniaturas
  com botão de remover cada uma, e um slot "Adicionar outra foto" enquanto
  não atingir o limite) — útil quando o enunciado continua em outra
  página ou quando uma foto mostra o enunciado e outra a tentativa de
  resolução do aluno. `usePhotoSolve.resolve()` agora recebe uma lista de
  imagens em vez de uma única, e a rota `/api/resolver-foto` manda todas
  como blocos de imagem numa única mensagem pro Claude, com o prompt
  avisando que podem ser páginas/partes do mesmo problema. A validação do
  lote (tipo, tamanho, quantidade) vive em `src/lib/photoImageLimits.ts`,
  compartilhada entre cliente (feedback antes de enviar) e servidor
  (checagem definitiva). O quadro de rascunho (`/quadro`) continua
  enviando uma única imagem (o PNG exportado do desenho), só que agora
  como uma lista de um item — mesma função, sem mudança de UI lá.
- **Histórico de conversas do Gauss e fotos resolvidas** (`/historico`):
  toda mensagem trocada com o tutor e todo problema resolvido por
  foto/quadro fica salvo (tabelas `gauss_conversations`/`gauss_messages`/
  `photo_solve_history`, RLS restringe cada aluno à própria linha) e pode
  ser revisitado depois, sem exigir nenhuma ação — a gravação acontece
  sozinha em `/api/tutor` e `/api/resolver-foto`/`/api/exercicio-parecido`
  como efeito colateral best-effort (uma falha ao salvar nunca derruba a
  resposta da IA que já foi gerada). Uma conversa aberta no Gauss vira uma
  linha só até a página recarregar — `/historico` mostra o que já foi
  dito, mas não retoma uma conversa antiga pra continuar de onde parou.
- **Preparatório para Vestibulares** (destaque na home, logo abaixo do
  hero — e um botão "Preparar para o Vestibular" no próprio hero levando
  direto pra lá): esse é o diferencial real do produto frente a
  concorrentes como Brilliant/Khan Academy/Photomath, nenhum dos quais
  foca em vestibular brasileiro — por isso a seção não fica mais no fim
  da home, atrás de todo o resto do currículo. A `description` raiz
  (`layout.tsx`, usada em SEO/compartilhamento) também cita ENEM/UERJ/
  UNESP/OBMEP explicitamente em vez de só "ensino fundamental ao
  superior". Simulados no estilo real de cada
  prova — ENEM (grátis: questões contextualizadas, múltipla escolha),
  UERJ (Premium: estilo discursivo/interdisciplinar), UNESP (Premium:
  múltipla escolha direta), OBMEP (Premium: raciocínio lógico estilo
  1ª fase) e OIM (Premium: teoria dos números, combinatória e geometria
  de olimpíada internacional). Cada uma dessas 5 provas já tem 2
  tópicos — o simulado geral (20 exercícios) mais um segundo tópico com
  um recorte temático específico (16 exercícios): "Geometria e Escalas"
  no ENEM, "Funções e Geometria Analítica" na UERJ, "Trigonometria e
  Geometria Espacial" na UNESP, "2ª Fase: Desafios Avançados" na OBMEP
  e "Geometria e Desigualdades" na OIM — todos genuinamente no estilo
  daquele exame, não um simulado genérico reaproveitado. O ENEM ganhou
  um 3º tópico, "Estatística e Probabilidade" (20 exercícios): leitura
  de gráficos/tabelas, médias, mediana, moda e probabilidade simples e
  de eventos sucessivos. A UERJ também ganhou um 3º tópico, "Funções
  Exponenciais e Logarítmicas" (16 exercícios): equações exponenciais,
  logaritmo como operação inversa, propriedades dos logaritmos e
  aplicações interdisciplinares (decaimento radioativo, escala
  Richter) — um assunto que nenhuma outra trilha cobria ainda. A UNESP
  ganhou seu próprio 3º tópico, "Matrizes e Sistemas Lineares" (16
  exercícios): operações com matrizes, determinante de matriz 2×2 e
  resolução de sistemas lineares pela regra de Cramer — um tema
  clássico e recorrente na prova. A OBMEP ganhou "Divisibilidade e
  Números Primos" (16 exercícios): critérios de divisibilidade,
  fatoração em primos, MDC e MMC — as ferramentas por trás da maioria
  dos quebra-cabeças numéricos da 1ª fase. E a OIM ganhou "Combinatória
  e Contagem" (16 exercícios): princípio fundamental da contagem,
  permutações, combinações e o princípio da casa dos pombos em sua
  forma geral — fechando as 5 provas da Fase 1 com 3 tópicos cada.
  **Fase 2** adiciona **SAT Math** (Premium: álgebra e funções, estilo
  múltipla escolha com 4 alternativas — uma a menos que o ENEM — e
  agora também "Estatística e Geometria": média, mediana, moda,
  probabilidade simples e as fórmulas de círculos e sólidos) e **GMAT
  Quant** (Premium: raciocínio lógico-quantitativo rápido, com
  problemas de razão, taxas e contextos de negócio, e agora também
  "Combinatória e Probabilidade": permutações, combinações C(n,k) e
  probabilidade de eventos independentes). Ambas também ganharam um 3º
  tópico (20 exercícios cada, no mesmo formato do simulado geral): o
  SAT com "Sistemas e Exponenciais" (sistemas lineares por substituição
  e eliminação, regras de expoentes e inequações) e o GMAT com
  "Conjuntos e Estatística" (conjuntos sobrepostos com diagrama de
  Venn, amplitude e interpretação de dados em contextos de negócio).
  Como o resto do conteúdo do app, os enunciados do SAT/GMAT ficam em
  português por consistência com a base de exercícios — as provas
  reais são em inglês, então vale complementar o preparo com material
  em inglês também. Gaokao (multidisciplinar, em chinês) e PISA
  (avaliação de letramento da OCDE, não uma prova que se "treina" com
  simulados) ficaram de fora por não se encaixarem no formato do app.
- **Gamificação**: XP por resposta certa (escalado por dificuldade),
  níveis, sequência (streak) diária e conquistas.
- **Micro-animações**: o feedback de resposta (quiz, revisão, Desafio do
  Dia e checks de teoria) entra com um slide-in curto, os chips de XP e a
  tela de resultado ganham um "pop" celebratório, e os botões de opção
  respondem ao toque com uma leve compressão. Tudo definido em
  `globals.css` (keyframes `rise-in`/`pop-in`/`xp-pop`) e desligado por
  completo para quem usa `prefers-reduced-motion`.
- **Dashboard de progresso** (`/progresso`) com gráficos de desempenho
  por tópico e XP ao longo do tempo, e um card **"Pontos de atenção"**
  que varre o progresso salvo em TODAS as trilhas (não só as que têm
  gráfico dedicado), soma acerto por tópico entre os quatro níveis de
  dificuldade e lista os até 5 tópicos com menor acerto abaixo de 80%
  (só entram tópicos com pelo menos 3 exercícios respondidos, pra um
  chute isolado não aparecer como "ponto fraco") — cada linha já linka
  de volta pra praticar aquele tópico (`src/lib/weakSpots.ts`, testado
  isoladamente). Quem está logado vê ali um botão para ativar
  **lembretes de sequência por notificação push** — avisa quando a
  sequência de dias praticando está prestes a quebrar. Veja
  "Configurando notificações push" em docs/setup.md.
- **"Recomendado para você"** (`/progresso`, acima do resto do
  dashboard): antes disso, revisão espaçada (`/revisao`), dificuldade
  adaptativa (badge "Recomendado" no seletor de dificuldade) e o skill
  tree (próximo nó não começado) eram três sistemas separados que o
  aluno tinha que checar um por um. `src/lib/unifiedRecommendations.ts`
  (`buildRecommendations`, testado isoladamente) junta os três numa
  lista só, ranqueada — revisões vencidas primeiro (curva do
  esquecimento é mais urgente), depois tópicos já começados e não
  dominados, depois o próximo tópico de uma trilha em andamento —
  removendo duplicata quando mais de um sistema sugeriria a mesma
  combinação (nível, tópico, dificuldade). Não cria tabela nova: só lê
  os mesmos dados que `ReviewSession.tsx`, `weakSpots.ts` e
  `adaptiveDifficulty.ts` já liam separadamente.
- Progresso e gamificação salvos localmente no navegador
  (`localStorage`) — funciona sem conta (modo convidado).
- **Contas (opcional)**: login/cadastro (`/entrar`, `/cadastro`) via
  Supabase Auth sincronizam XP, progresso e conquistas na nuvem entre
  dispositivos. Além de e-mail/senha, dá pra entrar direto com **Google**,
  **Microsoft**, **GitHub** ou **Apple** — sem precisar criar outra
  senha — ou com **Face ID / Touch ID / Windows Hello** (passkey/WebAuthn,
  em `/entrar`, só aparece em dispositivos com biometria; gerenciar em
  `/conta`). Sem configurar o Supabase, o app roda 100% em modo local —
  nada quebra. Veja "Configurando contas (Supabase)", "Login com Google,
  Microsoft, GitHub e Apple" e "Login biométrico (Face ID / Touch ID)"
  em docs/setup.md.
- **Resolver por foto** (`/foto`, exclusivo para quem tem conta): o
  aluno fotografa um problema de matemática e recebe a solução passo a
  passo, gerada pela Claude API (visão). Veja "Configurando resolver
  por foto" em docs/setup.md. A dropzone aceita arrastar-e-soltar uma
  foto (além do clique/câmera do celular), com destaque visual
  enquanto o arquivo está sendo arrastado por cima.
- **Quadro de rascunho** (`/quadro`): quadro negro digital — desenhar
  com mouse, dedo ou caneta (cores, espessura, borracha, desfazer,
  refazer, grade/papel quadriculado, modo tela cheia, baixar como
  PNG). Aberto a todos, sem conta; o botão "Resolver com IA" (que
  reaproveita o mesmo pipeline do "resolver por foto" via o hook
  compartilhado `src/lib/usePhotoSolve.ts`) exige login. Quem está
  logado também pode ativar "Analisar automaticamente ao pausar": 2
  segundos depois do fim de um traço, o quadro é enviado sozinho para
  a IA — sem precisar clicar no botão a cada tentativa. A grade é um
  overlay puramente visual (`QuadroBoard.tsx`, CSS por cima do canvas)
  — não é desenhada nos pixels reais, então nunca aparece no PNG
  baixado nem na imagem enviada pra IA. O modo tela cheia
  (`isExpanded`) troca o layout normal por um overlay `fixed inset-0`
  ocupando a viewport inteira — mais espaço de desenho sem mudar a
  resolução interna do canvas — e fecha com Esc. Refazer usa uma pilha
  de redo em `DrawingCanvas.tsx` que é limpa a cada novo traço/limpar
  (convenção padrão de undo/redo — desenhar algo novo depois de
  desfazer descarta o que dava pra refazer). A toolbar foi extraída
  pra `QuadroToolbar.tsx`, mantendo `QuadroBoard.tsx` focado em estado
  e lógica. A escrita ao toque foi refinada
  (`src/components/DrawingCanvas.tsx`): os traços usam curvas
  quadráticas entre os pontos médios de cada 3 pontos brutos (em vez de
  segmentos retos), o que remove o aspecto "poligonal" de traços
  rápidos; a espessura reage à pressão da caneta/stylus
  (`PointerEvent.pressure`, sem efeito com mouse/toque comum, que
  reportam sempre 0,5); `getCoalescedEvents()` captura os pontos
  intermediários que o navegador agrupa entre eventos `pointermove`,
  pra não perder detalhe em traços rápidos; e uma rejeição básica de
  palma (`activePointer` em `DrawingCanvas.tsx`) garante que uma caneta
  sempre tem prioridade sobre um toque concorrente (a mão apoiada na
  tela), descartando o traço de toque incompleto quando a caneta
  encosta. Reconhecimento de escrita à mão *durante* o traço
  (convertendo os traços em equação em tempo real, sem round-trip pra
  API) continua sendo um item futuro maior — hoje a IA sempre analisa
  uma imagem estática do quadro. O quadro acompanha o tema do site: no
  modo escuro vira um quadro-negro de verdade (fundo escuro, giz claro
  no lugar de tinta preta) em vez de forçar um retângulo branco —
  `paperColor` em `DrawingCanvas.tsx` é fixado no tema vigente no
  momento em que o quadro é montado (a borracha "apaga" de volta pra
  essa cor, não sempre branco), e a cor de tinta padrão em
  `QuadroBoard.tsx` segue o mesmo tema via `src/lib/theme.ts` (o mesmo
  store compartilhado por trás do `ThemeToggle`).
- **Modo escuro**: alternância clara/escura no menu, com detecção da
  preferência do sistema e persistência em `localStorage`. Sem "flash"
  de tema errado ao carregar a página (script inline aplicado antes da
  primeira renderização).
- **Idioma** (15 opções: Português, English, Español, 中文, Italiano,
  한국어, Deutsch, Français, 日本語, العربية, Русский, हिन्दी, Tiếng Việt,
  Polski e Türkçe): seletor no menu
  troca o texto de toda a navegação, páginas e mensagens de erro
  (`src/i18n/`). A escolha fica salva em cookie, então funciona em
  Server Components também (Navbar, cabeçalhos de página etc.). O
  árabe usa `dir="rtl"` no `<html>`, aplicado automaticamente
  (`src/i18n/config.ts` → `isRtl()`, lido em `src/app/layout.tsx`) — o
  texto e a maior parte do layout (nav, formulários, cabeçalhos) se
  espelham sozinhos por herdarem a direção do `<html>`. Duas exceções
  conhecidas: o botão do tutor de IA e o banner de instalação do PWA
  ficam fixos nos cantos inferiores esquerdo/direito da tela por
  design (pra não se sobrepor um ao outro) e não se invertem em RTL —
  isso é intencional, não um bug. Veja "Sobre o idioma" em
  docs/features.md para o que ainda **não** é traduzido.
- **Assinatura Premium** (opcional, via Stripe): Estatística
  Intermediário/Avançado exigem assinatura ativa (Fundamental II,
  Ensino Médio e Estatística Iniciante continuam grátis, pra sempre
  servirem de porta de entrada). Assinantes também têm uma cota diária
  de "resolver por foto" bem maior. Sem configurar o Stripe, o
  conteúdo Premium fica bloqueado para todo mundo mas o resto do app
  funciona normalmente. Veja "Configurando assinaturas (Stripe)" em
  docs/setup.md.
- **Política de Privacidade** (`/privacidade`, link no rodapé): o que
  coletamos, com quem compartilhamos (Supabase, Stripe, Anthropic) e os
  direitos do titular pela LGPD. Gerada como ponto de partida — ainda
  precisa do e-mail de contato real preenchido e de revisão por um
  advogado antes de valer como documento oficial.
- **Turmas** (`/turmas`, exige conta): qualquer usuário pode criar uma
  turma (vira "professor" dela) e continuar praticando normalmente como
  aluno em paralelo — não existe um papel de professor separado. O
  professor recebe um código de acesso pra compartilhar com os alunos,
  vê o XP/sequência de cada um e atribui tarefas (nível + tópico +
  dificuldade); os alunos veem as tarefas atribuídas com um link direto
  pra praticar. O professor também vê o uso de IA de cada aluno —
  mensagens enviadas ao Gauss e fotos resolvidas (soma de todo o
  histórico, mais a data da última atividade), via `get_turma_ai_usage`
  (reaproveita os mesmos contadores diários de cota já existentes em
  `tutor_usage`/`photo_solve_usage`, sem tabela nova). Veja "Sobre as
  turmas" em docs/features.md para os detalhes de RLS.
- **Matemática Financeira** — trilha independente com 2 níveis:
  Iniciante, grátis ("Juros Simples", "Descontos e Acréscimos
  Percentuais" — fator multiplicativo, aumentos/descontos sucessivos —,
  "Inflação e Correção Monetária" — corrigir valores pela inflação com
  juros compostos, poder de compra e inflação acumulada em vários
  períodos — e agora também "Câmbio e Conversão de Moedas" —
  multiplicar/dividir por uma taxa de câmbio para converter entre
  reais, dólares e euros) e Avançado, Premium ("Juros
  Compostos", com gráfico interativo de
  crescimento exponencial, "Financiamentos: Price e SAC", comparando
  amortização constante com parcelas fixas, "Valor
  Presente e Valor Futuro" — trazer uma quantia a valor de hoje ou
  projetá-la no futuro, e o valor futuro/presente de uma série de
  depósitos ou parcelas iguais, a base matemática por trás das
  prestações da Tabela Price — e agora também "Taxas Equivalentes:
  Nominal e Efetiva" — converter uma taxa de juros compostos entre
  períodos diferentes (semestral ↔ anual, via (1+i)² ou √(1+i)) e a
  diferença entre taxa nominal simples e taxa efetiva composta).
- **App para desktop e smartphone**: além de já ser um PWA instalável
  (veja abaixo), a navegação agora é totalmente responsiva — em telas
  estreitas o menu do topo vira um botão de hambúrguer que abre um
  painel com todos os links, mantendo a barra horizontal normal em
  telas largas (`src/components/MobileNavMenu.tsx`). Um banner
  "Instalar o app" aparece automaticamente quando o navegador oferece a
  instalação (evento `beforeinstallprompt`), com botão de instalar e de
  dispensar (`src/components/InstallPwaPrompt.tsx`).
- **Navbar consolidada (menu "Mais")**: no desktop, a barra do topo só
  mostra os 3 links do ciclo central de estudo — Trilhas, Progresso,
  Revisão — mantendo o topo enxuto no espírito minimalista do
  Brilliant.org. Tudo o mais (Calculadora, Resolver por foto, Quadro,
  Turmas, Chat, Comunidades, Lives, Liga, Matemáticos e Moderação para
  admins) fica atrás de um dropdown "Mais". No mobile, o hambúrguer
  continua revelando os links todos numa lista única (não há espaço de
  sobra pra um segundo nível de menu numa tela pequena). Ver
  `src/components/Navbar.tsx` (divide `primaryNavItems`/
  `secondaryNavItems`) e `src/components/MobileNavMenu.tsx` (renderiza
  os dois em containers separados — badges de XP, seletor de idioma,
  tema e login ficam num terceiro container à parte, pra nunca duplicar
  no DOM).
- **Prontidão para produção**: `sitemap.xml`/`robots.txt` gerados a
  partir do catálogo de trilhas, metadados OpenGraph/Twitter,
  monitoramento de erros opcional (Sentry) e analytics de página sem
  cookies opcional (compatível com Plausible) — todos inertes até você
  configurar as variáveis de ambiente correspondentes. Domínio próprio
  também documentado, mas é um passo manual (DNS/registrador) que só
  você pode fazer. Veja "Preparando para produção" em docs/setup.md.
  Cada página de nível e de tópico (`/trilha/[nivel]` e
  `/trilha/[nivel]/[topico]`, as ~230 páginas mais indexáveis do site)
  tem seu próprio `<title>`/descrição/canonical via `generateMetadata`
  — antes disso, toda página do catálogo herdava o título/descrição
  genérico do layout raiz, então resultado de busca e preview de link
  compartilhado ficavam idênticos entre "Frações" e "Limites e
  Derivadas". O site também não tinha nenhuma imagem de Open
  Graph/Twitter Card (previews de link em WhatsApp/Slack/Twitter
  ficavam sem imagem) — `src/app/opengraph-image.tsx` gera uma imagem
  1200×630 de marca via `next/og` (`ImageResponse`), e o card do
  Twitter virou `summary_large_image` pra usá-la.
- **Recursos sociais** (chat, comunidades e lives, via LiveKit Cloud):
  exigem verificação de identidade via Stripe Identity (documento +
  selfie), com consentimento dos responsáveis obrigatório para usuários
  verificados como menores de idade antes de liberar qualquer recurso
  social. Hospedar uma live é Premium; assistir é grátis para qualquer
  verificado. Veja "Configurando verificação de identidade e
  consentimento dos responsáveis" em docs/setup.md, e "Sobre o chat",
  "Sobre as comunidades" e "Sobre as lives" em docs/features.md.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Sobre o `overrides` de `postcss` no `package.json`**: o Next.js
16.2.10 (a versão estável mais recente no momento) vendoriza sua
própria cópia interna de `postcss@8.4.31`, que tem um advisory
moderado de XSS ([GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)).
`npm audit fix --force` "resolveria" isso rebaixando o Next inteiro
pra uma canary de 2020 — claramente errado. Em vez disso, um
`overrides` força postcss `^8.5.18` em toda a árvore, inclusive dentro
de `node_modules/next` — o mesmo postcss que o projeto já usa direto
via `@tailwindcss/postcss`, então não é uma versão não testada.
`npm audit` volta a reportar zero vulnerabilidades depois disso; build
de produção e suite completa verificados sem regressão. Revisitar
quando uma versão estável do Next incorporar o postcss corrigido (o
fix já existe nas builds `canary`/`preview` do Next 16.3, só ainda não
foi promovido a `latest`).

## Testes

```bash
npm run typecheck # checagem de tipos (tsc --noEmit)
npm test          # testes unitários (Vitest) — lógica pura
npm run test:watch
npm run test:e2e  # testes end-to-end (Playwright) — builda, sobe o app e testa no navegador
```

Os testes unitários cobrem o parser de expressões da calculadora, a
lógica de gamificação (XP/streak/badges) e a integridade dos dados do
currículo (ids únicos, todo exercício de múltipla escolha tem a
resposta entre as opções, sem opções repetidas, etc.) — essa suíte de
integridade (`curriculum.test.ts`) roda sobre `ALL_TRACKS`, que precisa
listar toda trilha existente; 5 trilhas (Fundamental I, Geometria
Espacial, Lógica e Conjuntos, Álgebra Linear, Análise Real) tinham sido
adicionadas sem entrar nessa lista e ficaram sem essa checagem por um
tempo — foram incluídas depois de uma auditoria de conteúdo, e passaram
limpas (nenhum problema estrutural encontrado).

O teste e2e mais importante é `e2e/exercises-correctness.spec.ts`: ele
lê o currículo diretamente, preenche cada exercício com sua própria
resposta (`exercise.answer`) e confirma que o app marca como
"Certinho!" — isto é, toda vez que um exercício é adicionado ou editado,
rodar `npm run test:e2e` confere automaticamente que a correção
continua funcionando para ele.

Conteúdo em trilhas Premium (hoje, Estatística Intermediário/Avançado)
não aparece nesse arquivo, porque a suíte não consegue logar como
assinante neste ambiente de teste — o professor veria o paywall, não o
exercício. Ao adicionar conteúdo a uma trilha Premium, vale a pena
verificar manualmente rodando os testes com `premium: false`
temporário no nível em questão (revertendo antes de commitar) — foi
assim que "Regras de Probabilidade", "Intervalos de Confiança" e as
160 questões das novas trilhas Álgebra Linear e Análise Real foram
conferidas.

O CI (`.github/workflows/ci.yml`) roda lint, checagem de tipos, testes
unitários e e2e em todo push e pull request.

## Estrutura

- `src/data/curriculum/` — conteúdo: níveis, tópicos, teoria e
  exercícios (com campo `difficulty`). Era um único arquivo
  `curriculum.ts` de ~24 mil linhas; foi dividido em `types.ts` (os
  tipos: `Topic`, `Exercise`, `Level` etc.), `levels.ts` (o array
  `levels`), um arquivo por trilha em `topics/` (`fundamental1.ts`,
  `medio.ts`, `algebra-linear.ts` etc. — um `xTopics: Topic[]` cada) e
  `index.ts` (re-exporta tudo, mais `TOPICS_BY_LEVEL`/`getLevel`/
  `getTopicsForLevel`/`getTopic`/`getRelatedTopics`). Todo import
  existente (`@/data/curriculum` ou `./curriculum` a partir de
  `src/data/`) continua funcionando sem mudança nenhuma — TypeScript/
  Next.js resolvem uma pasta com `index.ts` exatamente como resolviam
  o arquivo antes. Cada trilha agora é um arquivo de ~500-2200 linhas
  em vez de uma fatia de um arquivo gigante, o que reduz conflito de
  merge e deixa a IDE/o code review mais rápidos ao mexer em uma
  trilha por vez.
- `src/lib/progress.ts` — progresso por tópico e dificuldade no
  `localStorage`.
- `src/lib/gamification.ts` — XP, streak e badges.
- `src/lib/dailyChallenge.ts` + `src/components/DailyChallenge.tsx` —
  Desafio do Dia: seleção determinística do problema por data, sequência
  e histórico próprios em `localStorage`.
- `src/components/widgets/` — widgets interativos embutidos na teoria
  (`SlopeExplorer.tsx`, `TwoPointExplorer.tsx`, `QuadraticExplorer.tsx`,
  `UnitCircleExplorer.tsx`, `FractionVisualizer.tsx`,
  `ProbabilitySpinner.tsx`, `MeanMedianExplorer.tsx`,
  `CompoundInterestExplorer.tsx`, `TangentLineExplorer.tsx`,
  `PythagoreanExplorer.tsx`, `SequenceExplorer.tsx`,
  `NormalDistributionExplorer.tsx`, `RegressionLineExplorer.tsx`,
  `PercentageChangeExplorer.tsx`, `ConfusionMatrixExplorer.tsx`,
  `MatrixExplorer.tsx`, `PrimeFactorizationExplorer.tsx`,
  `CombinationExplorer.tsx`, `Solid3DExplorer.tsx`, `VectorExplorer.tsx`,
  `VennDiagramExplorer.tsx`, `TruthTableExplorer.tsx`,
  `IntervalExplorer.tsx`, `BubbleSortExplorer.tsx`,
  `IntegerLineExplorer.tsx`, `EquationBalanceExplorer.tsx`,
  `PowerRootExplorer.tsx`, `ProportionPercentExplorer.tsx`,
  `QuadraticRootsExplorer.tsx` (Fundamental 2, antes sem nenhum widget),
  `ComplexPlaneExplorer.tsx` (Números Complexos, Ensino Médio),
  `ProbabilityBarExplorer.tsx`, `ProbabilityRulesExplorer.tsx`,
  `BinomialDistributionExplorer.tsx`, `ConfidenceIntervalExplorer.tsx`,
  `HypothesisTestExplorer.tsx` (Estatística Intermediário/Avançado),
  `DispersionExplorer.tsx` (Estatística Iniciante),
  `ConditionalLogicExplorer.tsx`, `ArrayIndexExplorer.tsx`,
  `StringIndexExplorer.tsx`, `LogicOperatorExplorer.tsx` (Programação
  Iniciante), `LoopStepExplorer.tsx`, `FunctionCallExplorer.tsx`
  (Programação Intermediário), `SimpleInterestExplorer.tsx`,
  `InflationErosionExplorer.tsx` (Matemática Financeira Iniciante),
  `IntegralAreaExplorer.tsx`, `CriticalPointExplorer.tsx`,
  `DifferentialEquationExplorer.tsx` (Ensino Superior),
  `ConeVolumeExplorer.tsx`, `SphereVolumeExplorer.tsx`,
  `EulerFormulaExplorer.tsx` (Geometria Espacial),
  `MultipleRegressionExplorer.tsx`, `TStatisticExplorer.tsx`
  (Econometria Iniciante), `ObjectStateExplorer.tsx`,
  `StackQueueExplorer.tsx`, `RecursionExplorer.tsx` (Programação
  Avançado), `OverfittingExplorer.tsx`, `DecisionTreeExplorer.tsx`
  (Machine Learning Iniciante), `SacScheduleExplorer.tsx`,
  `PresentValueExplorer.tsx` (Matemática Financeira Avançado),
  `ArgumentValidityExplorer.tsx` (Lógica e Conjuntos — Modus Ponens/Tollens
  e as duas falácias correspondentes), `SamplingExplorer.tsx` (Estatística
  Iniciante — novo tópico "Amostragem e Coleta de Dados"),
  `DictionaryExplorer.tsx` (Programação Intermediário — novo tópico
  "Dicionários e Estruturas Chave-Valor"), `CrossValidationExplorer.tsx`
  (Machine Learning Iniciante — novo tópico "Validação Cruzada (k-fold)"),
  `DummyVariableExplorer.tsx` (Econometria Iniciante — novo tópico
  "Variáveis Dummy (Binárias)"), `TriangleAreaExplorer.tsx`,
  `CircularSectorExplorer.tsx` (Ensino Médio — novos tópicos de
  trigonometria/círculo), `MatrixOperationsExplorer.tsx`,
  `LinearSystemExplorer.tsx`, `EigenvectorExplorer.tsx` (Álgebra
  Linear, nova trilha), `SupremumExplorer.tsx`,
  `SequenceConvergenceExplorer.tsx`, `EpsilonDeltaExplorer.tsx`,
  `IntermediateValueExplorer.tsx` (Análise Real, nova trilha));
  `InteractiveWidgetRenderer.tsx`
  mapeia o campo `interactiveWidget` de uma `TheorySection` (em
  `src/data/curriculum/types.ts`) pro componente
  certo, renderizado pelo `TopicPage`. Todos os widgets usam apenas as
  variáveis de tema (`var(--color-foreground)`, `var(--color-muted)`,
  `var(--color-border)`, `bg-surface`) para fundo, texto e linhas do SVG,
  em vez de cores fixas (`bg-white`, `#1a1a2e` etc.) — o canvas de cada
  widget acompanha o modo claro/escuro automaticamente. Cores saturadas de
  dado (azul, verde, vermelho, âmbar, roxo) permanecem fixas por
  legibilidade em ambos os temas.
- `src/lib/mathExpr.ts` — parser/avaliador de expressões matemáticas
  para a calculadora gráfica.
- `FunctionGrapher.tsx` (`/calculadora` e o gráfico embutido em tópicos
  via `graphExpressions`) tinha o mesmo problema que os widgets antes do
  ajuste acima — canvas, grade, eixos e rótulos fixos em cores claras —
  e foi corrigido do mesmo jeito (variáveis de tema em vez de
  `bg-white`/`#e4e2f1`/`#898781`/`#635f78`). As curvas em si continuam
  com cores fixas, como nos widgets.
- `src/components/PracticeSection.tsx` + `DifficultyPicker.tsx` +
  `ExerciseQuiz.tsx` — seleção de dificuldade e motor de exercícios.
- `public/manifest.json`, `public/sw.js` — configuração PWA (instalável,
  cache de app shell).
- `src/lib/supabase/` — clientes Supabase (browser/server) e refresh de
  sessão; `src/lib/cloudSync.ts` — sincronização de progresso/XP com a
  nuvem quando logado.
- `src/app/api/resolver-foto/route.ts` + `src/components/PhotoSolver.tsx`
  — rota e UI de "resolver por foto" (Claude API com visão). A resposta usa
  structured outputs (`output_config.format` com o JSON schema de
  `PhotoSolution`) em vez de pedir "responda só com JSON" no prompt, e
  extended thinking (`thinking: { type: "adaptive" }`) para problemas mais
  complexos. Responde no idioma selecionado pelo aluno (locale enviado no
  `FormData`, mesmo `localeToLanguageName` do tutor).
- `src/components/DrawingCanvas.tsx` + `QuadroToolbar.tsx` +
  `QuadroBoard.tsx` — quadro de rascunho (canvas livre com undo/redo),
  a toolbar (cores, espessura, borracha, grade, tela cheia) e o botão
  "Resolver com IA", que reaproveita `/api/resolver-foto` exportando o
  desenho como PNG. `SolutionDisplay.tsx` (compartilhado entre `/foto`
  e `/quadro`) primeiro pede a resposta do aluno antes de revelar o
  passo a passo (ver seção de features acima e `src/lib/answerMatch.ts`),
  e tem um botão "Perguntar ao Gauss sobre isso" que abre o chat do
  tutor já com uma pergunta pré-preenchida sobre a solução (mesmo
  padrão `askGauss()`/`ASK_GAUSS_EVENT` usado no grafo de conhecimento).
- `src/lib/usePhotoSolve.ts` — hook compartilhado entre `QuadroBoard.tsx`
  e `PhotoSolver.tsx` (fetch a `/api/resolver-foto` + locale +
  status/erro/solução), eliminando a duplicação que existia entre os
  dois fluxos de "resolver por foto". Também expõe `generateSimilar`/
  `generatingSimilar` pro botão "Praticar um exercício parecido".
  `resolve()` recebe uma lista de `{ blob, filename }` (não uma imagem
  única) pra suportar múltiplas fotos por problema.
- `src/lib/photoImageLimits.ts` — `MAX_IMAGES` (4) e
  `validateImageBatch()`, compartilhados entre `PhotoSolver.tsx` (feedback
  antes de enviar) e `resolver-foto/route.ts` (checagem definitiva), pra
  não duplicar as regras de tipo/tamanho/quantidade de fotos em dois
  lugares.
- `src/lib/photoSolveSchema.ts` — o JSON schema `PHOTO_SOLUTION_SCHEMA`
  usado tanto por `resolver-foto/route.ts` quanto por
  `exercicio-parecido/route.ts`, extraído pra um só lugar já que as duas
  rotas retornam o mesmo formato de solução.
- `src/app/api/exercicio-parecido/route.ts` — gera um novo exercício no
  mesmo assunto de um problema já resolvido e já devolve a solução dele
  (mesmo schema, mesmo modelo e mesma cota diária de `resolver-foto`, via
  `increment_photo_usage`). Usado pelo botão "Praticar um exercício
  parecido" em `SolutionDisplay.tsx`.
- `src/app/historico/page.tsx` + `src/components/HistoricoList.tsx` +
  `src/app/actions/historico.ts` — página de histórico. O Server
  Component busca a lista de conversas (`gauss_conversations`) e fotos
  resolvidas (`photo_solve_history`) direto do Supabase e passa como
  props; o transcript completo de uma conversa só é buscado sob demanda
  (ao expandir um item) via a server action `getConversationMessages`,
  pra não carregar toda a mensageria do aluno de uma vez. `src/lib/
  photoSolveHistory.ts` (`recordPhotoSolveHistory`) e o bloco try/catch em
  `/api/tutor/route.ts` gravam best-effort — uma falha aqui nunca derruba
  uma resposta da IA que já foi gerada. `src/lib/tutorHistory.ts`
  (`titleFromMessage`) deriva o título de uma conversa da primeira
  mensagem do aluno.
- `src/lib/tutor/extractExpression.ts` — extrai uma expressão plotável
  de uma resposta do Gauss (usada pela calculadora embutida no
  `TutorChat.tsx`), reaproveitando `compileExpression` de `mathExpr.ts`
  pra validar candidatos.
- `supabase/schema.sql` — esquema do banco (tabelas + RLS). Índices em
  toda foreign key usada em filtro/RLS (inclusive a 2ª coluna de PKs
  compostas, que o índice da própria PK não cobre — ex:
  `conversation_participants.user_id`, `blocked_users.blocked_id`);
  `message_reports.resolved_by` e `banned_users.banned_by` ficam nulos
  (`on delete set null`) se a conta do admin/moderador que agiu for
  excluída, preservando o histórico de moderação em vez de apagá-lo em
  cascata.
- `src/i18n/` — seletor de idioma: dicionários, cookie de locale
  (`getServerLocale.ts` para Server Components, `LanguageContext.tsx`
  para Client Components) e `src/components/LanguageSwitcher.tsx`.
- `src/components/ThemeToggle.tsx` — alternância de modo escuro,
  variáveis de cor em `src/app/globals.css` (`:root[data-theme="dark"]`).
- `src/lib/stripe/` — cliente Stripe e config; `src/lib/entitlements.ts`
  — `isPremiumUser()`, lido pelas páginas de trilha para decidir se
  mostra o conteúdo ou o paywall; `src/app/api/stripe/` — checkout,
  portal de gerenciamento e webhook; `src/app/assinatura/page.tsx` —
  página de assinatura.
- `src/app/privacidade/page.tsx` — política de privacidade (LGPD).
- `src/lib/actionAuth.ts` — `getAuthedSupabase()`, o guard "Supabase está
  configurado? tem usuário logado?" compartilhado por server actions em
  `account.ts`, `chat.ts`, `communities.ts`, `identity.ts`,
  `leaderboard.ts`, `lives.ts` e `turmas.ts` (antes copiado em cada
  arquivo); retorna uma união discriminada (`{ supabase, user }` ou
  `{ reason }`) porque cada action ainda decide sozinha o que devolver
  numa falha (mensagem de erro, `void` ou redirect). `admin.ts` e
  `moderation.ts` mantêm seus próprios `requireAdmin()`/`requireUser()`
  locais — já resolviam a duplicação dentro do próprio arquivo, então não
  foram alterados.
- `src/app/turmas/` — lista de turmas e detalhe (roster do professor +
  tarefas atribuídas); `src/app/actions/turmas.ts` — criar turma, entrar
  por código, atribuir tarefa; `src/lib/turmaCode.ts` — gerador do
  código de acesso. `src/components/TurmaAiUsage.tsx` (usando a RPC
  `get_turma_ai_usage`) mostra o uso de IA (mensagens ao Gauss + fotos
  resolvidas) de cada aluno, mesmo padrão de RPC "security definer +
  checa `teacher_user_id = auth.uid()`" de `get_turma_roster`.
- `src/components/MobileNavMenu.tsx` — menu de navegação responsivo
  (hambúrguer em telas estreitas, barra horizontal em telas largas),
  usado pelo `Navbar.tsx`.
- `src/components/OAuthButtons.tsx` + `signInWithGoogle`/
  `signInWithMicrosoft`/`signInWithGitHub`/`signInWithApple` em
  `src/app/actions/auth.ts` — login social; `src/components/PasskeyLoginButton.tsx` +
  `src/components/PasskeyManager.tsx` — login/cadastro biométrico
  (WebAuthn); `src/app/auth/callback/route.ts` troca o código de
  autorização OAuth por uma sessão do Supabase.
- `src/components/InstallPwaPrompt.tsx` — banner de instalação do PWA,
  captura o evento `beforeinstallprompt` e é renderizado globalmente no
  `src/app/layout.tsx`.
- `src/lib/push/` — config (`isPushConfigured`), envio via `web-push`
  (`server.ts`, VAPID); `src/components/NotificationOptIn.tsx` — botão
  de ativar/desativar lembretes em `/progresso`; `src/app/api/push/` —
  rotas de inscrição (`subscribe`, `unsubscribe`) e de envio
  (`send-streak-reminders`, protegida por `CRON_SECRET` e disparada por
  um agendador externo); `public/sw.js` — listeners `push` e
  `notificationclick`.
- `.github/workflows/ci.yml` — lint, checagem de tipos, testes
  unitários e e2e em todo push/PR.
- `e2e/` — testes end-to-end (Playwright).

## Adicionando conteúdo

Para adicionar um tópico a uma trilha existente, edite o array de
tópicos correspondente em `src/data/curriculum/topics/` (um arquivo por
trilha) seguindo o formato de
`Topic` (teoria + exercícios, cada exercício com um `difficulty`). A
ordem dos tópicos dentro do array é a ordem de aprendizado pretendida —
tópicos fundamentais (ex: pré-requisitos conceituais de outros tópicos
da mesma trilha) devem vir cedo, não só no fim da lista. Para habilitar
um novo nível de ensino, marque `available: true` em `levels`, crie o
array de tópicos dele e registre-o em `TOPICS_BY_LEVEL`. Depois de
editar conteúdo, rode `npm run test:e2e` para confirmar que os
gabaritos continuam corretos.

Para adicionar um widget interativo numa seção de teoria, defina
`interactiveWidget: "slope-explorer" | "two-point-explorer"` nela; para
criar um widget novo, adicione o componente em `src/components/widgets/`,
registre-o em `InteractiveWidgetRenderer.tsx` e inclua o nome no tipo
`InteractiveWidget` (`src/data/curriculum/types.ts`).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Contas/banco de dados:
Supabase (opcional). IA (resolver por foto): Claude API (opcional).
Testes: Vitest (unitário) + Playwright (e2e).
