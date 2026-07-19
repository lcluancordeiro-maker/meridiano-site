# Meridiano Matemática

App web (PWA) de ensino de matemática, estatística, matemática
financeira, programação e machine learning, do Ensino Fundamental ao
Superior, com teoria, calculadora gráfica, exercícios em 4 níveis de
dificuldade e gamificação.

Por ser um PWA, funciona em qualquer navegador e pode ser instalado na
tela inicial no iOS e Android como um app nativo — sem precisar de loja
de aplicativos.

## Estado atual

- **Ensino Fundamental II** (7 tópicos: números inteiros, frações,
  álgebra, potenciação/radiciação, proporcionalidade/porcentagem,
  equações do 2º grau, geometria plana), cada um com 24 exercícios
  divididos em 4 níveis de dificuldade (Fácil/Médio/Difícil/Olimpíada),
  escolhidos livremente pelo aluno.
- **Ensino Médio** — 7 tópicos: "Função do 1º Grau" (coeficientes,
  raiz, gráfico), "Função Quadrática" (vértice, concavidade, gráfico em
  parábola), "Trigonometria no Triângulo Retângulo" (seno, cosseno,
  tangente, Teorema de Pitágoras), "Geometria Analítica" (distância
  entre pontos, ponto médio, coeficiente angular, equação da reta),
  "Progressões Aritméticas e Geométricas" (termo geral, soma de PA/PG),
  "Números Complexos" (a unidade imaginária i, soma, multiplicação,
  módulo e o conjugado) e agora também "Vetores" (módulo, soma,
  subtração, produto escalar e perpendicularidade — junta-se ao
  capítulo "Geometria e Trigonometria") — todos em 4 níveis de
  dificuldade, com gráfico interativo embutido onde faz sentido
  (parábola, `sin(x)`, reta, vetores).
- **Estatística** — trilha independente com 3 níveis (Iniciante:
  medidas de tendência central, medidas de dispersão (amplitude,
  variância, desvio padrão), "Gráficos e Distribuição de
  Frequências" — tabelas de frequência absoluta/relativa/acumulada e
  leitura de gráficos de barras e de setores — e agora também
  "Amostragem e Coleta de Dados" — população vs. amostra, tipos de
  amostragem (aleatória simples, sistemática, estratificada, por
  conveniência) e como o tamanho da amostra afeta o erro de amostragem;
  Intermediário:
  probabilidade básica, regras de probabilidade e agora também
  "Distribuição Binomial" — combinações C(n,k), a fórmula P(X=k) e o
  valor esperado
  n×p; Avançado: distribuição normal e escore-z, intervalos de
  confiança e "Testes de Hipótese" — H0/H1, estatística de teste z,
  valor crítico e a regra de decisão de rejeitar ou não a hipótese
  nula). Os 5 tópicos mais antigos da trilha (Medidas de Tendência
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
  Dados: Pilhas e Filas" — LIFO/FIFO, quando usar cada uma — e agora
  também "Recursão" — o caso base, como as chamadas desempilham, e
  fatorial/fibonacci como exemplos clássicos) e "Fundamentos de
  Aprendizado Supervisionado"
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
- Fundamental I ainda aparece como "em breve" — a estrutura de dados
  (`src/data/curriculum.ts`) já suporta adicionar novos níveis e
  tópicos sem mudar a arquitetura.
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
  commit — mesma técnica descrita em "Sobre o idioma"/testes) já que o
  ambiente de teste não tem Supabase/Stripe configurado pra simular uma
  assinatura ativa. `InteractiveWidgetRenderer` carrega cada widget sob
  demanda via `next/dynamic` (chunk próprio por widget, ~2-5KB cada) —
  uma página de tópico só baixa o widget que ela de fato usa, em vez do
  bundle com os 24 juntos que era carregado antes em toda página
  `/trilha/*/*`, com widget ou sem. Ver `src/components/widgets/`. O
  mesmo problema existia com `FunctionGrapher` (o gráfico de função que
  ~10 dos ~230 tópicos mostram via `topic.graphExpressions`) — como
  `TopicPage` importava ele estaticamente, seu JS ia pra toda página de
  tópico, mesmo nas ~220 sem gráfico nenhum.
  `src/components/LazyFunctionGrapher.tsx` é o mesmo padrão de
  `next/dynamic` + `"use client"` do `InteractiveWidgetRenderer`,
  isolando FunctionGrapher (~9KB) num chunk carregado só quando o
  tópico realmente tem `graphExpressions`. A página `/calculadora`
  continua importando `FunctionGrapher` direto — é a única coisa que
  ela renderiza, então não há nada pra economizar ali.
- **História da matemática**: alguns tópicos terminam com uma nota "📜 Um
  pouco de história" contando de onde o assunto veio e por que ele
  importa (o Nilo e a geometria, Al-Khwarizmi e a álgebra, o menino
  Gauss somando de 1 a 100…), com links para as biografias em
  **/matematicos** — 9 figuras por enquanto (Pitágoras, Euclides,
  Arquimedes, Hipátia, Al-Khwarizmi, Descartes, Newton, Euler e Gauss),
  cada uma com vida, principais contribuições e links de volta para os
  tópicos do app onde suas ideias aparecem (mesmo espírito do grafo de
  conhecimento). Campo `historicalNote` opcional em `Topic`
  (`curriculum.ts`) + `src/data/mathematicians.ts`; páginas estáticas
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
  opcional em `Exercise` (`src/data/curriculum.ts`), renderizado por
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
  (`src/data/curriculum.ts`), `useChapterCompletion.ts` soma o
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
  (`src/data/curriculum.ts`), renderizado por
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
- **Tutor de IA (Gauss)**: um chat flutuante (canto inferior esquerdo,
  disponível em qualquer página), inspirado no "Koji" do Brilliant.org.
  Gauss usa o método socrático — faz perguntas e dá pistas em vez de
  entregar a resposta de primeira — e responde sobre qualquer matéria do
  catálogo. Exige login (mesmo padrão do "resolver por foto"), com cota
  diária (15 mensagens grátis, 60 Premium). A conversa fica só no
  navegador (não é salva no banco nem sincronizada entre dispositivos —
  um possível próximo passo). Veja "Configurando o tutor de IA" abaixo.
- **Preparatório para Vestibulares**: simulados no estilo real de cada
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
  "Configurando notificações push" abaixo.
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
  abaixo.
- **Resolver por foto** (`/foto`, exclusivo para quem tem conta): o
  aluno fotografa um problema de matemática e recebe a solução passo a
  passo, gerada pela Claude API (visão). Veja "Configurando resolver
  por foto" abaixo.
- **Quadro de rascunho** (`/quadro`): quadro negro digital — desenhar
  com mouse, dedo ou caneta (cores, espessura, borracha, desfazer,
  baixar como PNG). Aberto a todos, sem conta; o botão "Resolver com
  IA" (que reaproveita o mesmo pipeline do "resolver por foto") exige
  login. Quem está logado também pode ativar "Analisar
  automaticamente ao pausar": 2 segundos depois do fim de um traço, o
  quadro é enviado sozinho para a IA — sem precisar clicar no botão a
  cada tentativa. A escrita ao toque foi refinada
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
  uma imagem estática do quadro.
- **Modo escuro**: alternância clara/escura no menu, com detecção da
  preferência do sistema e persistência em `localStorage`. Sem "flash"
  de tema errado ao carregar a página (script inline aplicado antes da
  primeira renderização).
- **Idioma** (11 opções: Português, English, Español, 中文, Italiano,
  한국어, Deutsch, Français, 日本語, العربية e Русский): seletor no menu
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
  isso é intencional, não um bug. Veja "Sobre o idioma" abaixo para o
  que ainda **não** é traduzido.
- **Assinatura Premium** (opcional, via Stripe): Estatística
  Intermediário/Avançado exigem assinatura ativa (Fundamental II,
  Ensino Médio e Estatística Iniciante continuam grátis, pra sempre
  servirem de porta de entrada). Assinantes também têm uma cota diária
  de "resolver por foto" bem maior. Sem configurar o Stripe, o
  conteúdo Premium fica bloqueado para todo mundo mas o resto do app
  funciona normalmente. Veja "Configurando assinaturas (Stripe)"
  abaixo.
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
  pra praticar. Veja "Sobre as turmas" abaixo para os detalhes de RLS.
- **Matemática Financeira** — trilha independente com 2 níveis:
  Iniciante, grátis ("Juros Simples", "Descontos e Acréscimos
  Percentuais" — fator multiplicativo, aumentos/descontos sucessivos —
  e agora também "Inflação e Correção Monetária" — corrigir valores
  pela inflação com juros compostos, poder de compra e inflação
  acumulada em vários períodos) e Avançado, Premium ("Juros
  Compostos", com gráfico interativo de
  crescimento exponencial, "Financiamentos: Price e SAC", comparando
  amortização constante com parcelas fixas, e agora também "Valor
  Presente e Valor Futuro" — trazer uma quantia a valor de hoje ou
  projetá-la no futuro, e o valor futuro/presente de uma série de
  depósitos ou parcelas iguais, a base matemática por trás das
  prestações da Tabela Price).
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
  você pode fazer. Veja "Preparando para produção" abaixo.
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
  consentimento dos responsáveis", "Sobre o chat", "Sobre as
  comunidades" e "Sobre as lives" abaixo.

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

## Configurando contas (Supabase)

Contas são opcionais — o app funciona normalmente sem elas. Para
habilitar login e sincronização de progresso:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **Settings → API**, copie a **Project URL** e a **anon/public key**.
3. Copie `.env.local.example` para `.env.local` e preencha as duas
   variáveis (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. No **SQL Editor** do painel do Supabase, rode o conteúdo de
   `supabase/schema.sql` (cria as tabelas `profiles`, `topic_progress` e
   `gamification_state`, todas com Row Level Security — cada usuário só
   acessa os próprios dados).
5. Reinicie o servidor (`npm run dev`). O link "Entrar" no topo passa a
   funcionar.

Como funciona: o progresso continua sendo salvo primeiro no
`localStorage` (rápido, funciona offline). Se o usuário está logado,
cada mudança também é replicada em segundo plano para o Supabase
(`src/lib/cloudSync.ts`). No login, se a conta já tiver dados na nuvem,
eles substituem os locais (sincronização entre dispositivos); se for o
primeiro login, o progresso local (de convidado) é enviado para a
nuvem, sem perda.

### Login com Google, Microsoft, GitHub e Apple

Além de e-mail/senha, `/entrar` e `/cadastro` mostram os botões
"Continuar com Google", "Continuar com Microsoft", "Continuar com
GitHub" e "Continuar com Apple" — quem já tem uma dessas contas não
precisa criar senha nova. Funciona via OAuth do Supabase Auth; a conta
é criada automaticamente no primeiro login com qualquer um deles.

Para habilitar (com o Supabase já configurado acima):

1. **Google**: crie um OAuth Client ID em
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (tipo "Web application"). Em **Authorized redirect URIs**, adicione a
   Callback URL que o Supabase mostra no passo 5.
2. **Microsoft**: registre um app em
   [Azure Portal → App registrations](https://portal.azure.com) e crie
   um client secret. Em **Redirect URI**, use a mesma Callback URL do
   Supabase (plataforma "Web").
3. **GitHub**: crie um OAuth App em
   [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers).
   Em **Authorization callback URL**, use a mesma Callback URL do
   Supabase.
4. **Apple**: exige uma conta paga no
   [Apple Developer Program](https://developer.apple.com/programs/) —
   crie um **Services ID** (não o App ID), com "Sign in with Apple"
   habilitado, e uma chave privada (.p8) para gerar o client secret
   (JWT assinado). É o provedor mais trabalhoso de configurar dos
   quatro; o [guia do Supabase para Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple)
   detalha o passo a passo.
5. No painel do Supabase, em **Authentication → Providers**, habilite
   **Google**, **Azure**, **GitHub** e **Apple**, e cole o Client
   ID/Secret de cada um. O Supabase mostra, em cada provedor, a
   **Callback URL** a usar nos passos 1 a 4 (algo como
   `https://<seu-projeto>.supabase.co/auth/v1/callback`).
6. Em **Authentication → URL Configuration**, adicione a URL do seu app
   (ex.: `http://localhost:3000` em desenvolvimento, ou o domínio de
   produção) em **Redirect URLs** — é para lá que o Supabase manda o
   usuário de volta depois do login (rota `/auth/callback` no app, que
   troca o código por uma sessão).

Sem esses provedores habilitados, os botões continuam visíveis mas o
login retorna um erro amigável — nada quebra. `src/app/actions/auth.ts`
(`signInWithGoogle`/`signInWithMicrosoft`/`signInWithGitHub`/`signInWithApple`)
e `src/app/auth/callback/route.ts` concentram toda a lógica.

> Nesta versão do Next.js, "Middleware" foi renomeado para "Proxy"
> (arquivo `proxy.ts`, função `proxy`) — é isso que mantém a sessão do
> Supabase atualizada a cada requisição.

### Login biométrico (Face ID / Touch ID / Windows Hello)

Não existe uma "API do Face ID" para a web — o que o navegador expõe é
o **WebAuthn** (padrão de passkeys), e é o sistema operacional quem
decide qual biometria usar como autenticador de plataforma: Face
ID/Touch ID no macOS/iOS/Safari, Windows Hello no Windows, biometria
nativa no Android/Chrome. `/entrar` mostra o botão "Entrar com Face
ID / Touch ID" só quando `navigator.credentials` reporta um
autenticador de plataforma disponível (`PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`)
— em desktops sem biometria, ou navegadores sem suporte, o botão nem
aparece.

Como funciona:

- **Entrar** (`src/components/PasskeyLoginButton.tsx`, em `/entrar`):
  chama `supabase.auth.signInWithPasskey()`, que dispara o prompt
  nativo de biometria do dispositivo e cria a sessão direto — não
  precisa de servidor próprio nem de `navigator.credentials.get()`
  manual, o SDK do Supabase cuida da cerimônia WebAuthn inteira.
- **Cadastrar uma biometria** (`src/components/PasskeyManager.tsx`, em
  `/conta`, exige estar logado): chama `supabase.auth.registerPasskey()`
  para registrar o dispositivo atual, e lista/remove passkeys já
  cadastradas via `supabase.auth.passkey.list()`/`.delete()`.

Isso usa a API de passkeys do `@supabase/supabase-js`
(`auth.experimental.passkey`, habilitado em `src/lib/supabase/client.ts`)
— **marcada como experimental** pelo próprio Supabase; a assinatura
pode mudar em versões futuras do SDK. Pode ser necessário habilitar
passkeys explicitamente nas configurações do seu projeto Supabase
(**Authentication → Providers** ou **Authentication → Passkeys**,
dependendo da versão do painel) antes de funcionar em produção.

## Configurando resolver por foto

Exige contas (Supabase) já configuradas (passo anterior) e uma chave da
Claude API:

1. Crie uma chave em [console.anthropic.com](https://console.anthropic.com).
2. Adicione `ANTHROPIC_API_KEY=...` ao `.env.local`.
3. Reinicie o servidor. O link "Resolver por foto" no topo passa a
   funcionar para usuários logados.

Sem `ANTHROPIC_API_KEY` configurada, a página `/foto` continua
acessível mas a rota `/api/resolver-foto` responde com erro — o resto
do app não é afetado.

Cada usuário logado tem um limite diário de fotos resolvidas —
5/dia no plano grátis, 30/dia no Premium (`increment_photo_usage` em
`supabase/schema.sql`, aplicado de forma atômica no banco) — proteção
simples contra abuso, já que cada chamada tem custo real de API. O
mesmo limite vale para o botão "Resolver com IA" do quadro de
rascunho, já que os dois usam a mesma rota (`/api/resolver-foto`).

## Configurando o tutor de IA (Gauss)

Usa a mesma `ANTHROPIC_API_KEY` configurada acima — nenhuma variável
nova. Sem ela (ou sem contas configuradas), o chat continua aparecendo
mas mostra a mensagem de indisponível/login em vez do bate-papo.

Igual ao "resolver por foto", cada usuário logado tem um limite diário
de mensagens — 15/dia no plano grátis, 60/dia no Premium
(`increment_tutor_usage` em `supabase/schema.sql`). O prompt de sistema
(`src/lib/tutor/systemPrompt.ts`) instrui o modelo a nunca entregar a
resposta de um exercício de primeira — o objetivo é o aluno chegar lá
com perguntas guiadas, não só receber a solução pronta (o mesmo
espírito das dicas de erro comum, ver acima). O componente
(`src/components/TutorChat.tsx`) hoje não sabe em qual trilha/tópico o
aluno está — o prompt instrui o Gauss a perguntar, mas passar esse
contexto automaticamente é um possível próximo passo.

Não testado com uma conversa real nesta sessão (sem
`ANTHROPIC_API_KEY` configurada aqui).

## Configurando assinaturas (Stripe)

Exige contas (Supabase) já configuradas. Assinaturas são opcionais —
sem configurar, o conteúdo Premium fica bloqueado para todo mundo, mas
o resto do app funciona normalmente:

1. Crie uma conta em [dashboard.stripe.com](https://dashboard.stripe.com)
   (comece com as chaves de **teste**, no modo "Test mode").
2. Em **Product catalog**, crie um produto "Premium" com um **Preço**
   recorrente (mensal ou anual) e copie o ID do preço (`price_...`).
3. Em **Developers → API keys**, copie a **Secret key**.
4. Em **Developers → Webhooks**, adicione um endpoint apontando para
   `https://SEU_DOMINIO/api/stripe/webhook`, com os eventos
   `checkout.session.completed`, `customer.subscription.updated` e
   `customer.subscription.deleted` — copie o **Signing secret**.
5. Em **Settings → API** do Supabase, copie a chave **service_role**
   (nunca a exponha no cliente).
6. Preencha `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `STRIPE_PREMIUM_PRICE_ID` e `SUPABASE_SERVICE_ROLE_KEY` no
   `.env.local`.
7. No **SQL Editor** do Supabase, rode `supabase/schema.sql` de novo
   (cria a tabela `subscriptions`, seguro de rodar mais de uma vez).
8. Reinicie o servidor. O link "Premium" no topo passa a permitir
   assinar.

Como funciona: o checkout usa a página hospedada da Stripe (sem
formulário de cartão no seu próprio site). O webhook recebe os
eventos e grava o status da assinatura na tabela `subscriptions` via
`service_role` (que ignora Row Level Security de propósito — é o
único jeito de gravar sem depender da sessão do navegador do
usuário). `src/lib/entitlements.ts` lê essa tabela para decidir se um
usuário tem acesso Premium.

**Quais trilhas são Premium**: veja o campo `premium` de cada nível em
`src/data/curriculum.ts`. Hoje são Estatística Intermediário e
Avançado, Matemática Financeira Avançado, Ensino Superior, Econometria,
Programação Avançado/Machine Learning, e os simulados UERJ, UNESP,
OBMEP e OIM (o ENEM fica grátis, como porta de entrada do
preparatório).

### Formas de pagamento

O checkout aceita **cartão** (crédito e débito — Stripe não distingue
os dois como métodos separados, isso depende só do cartão/banco do
cliente; cobre bandeiras internacionais automaticamente), **boleto**
e **Pix**, esses dois últimos apenas quando o preço do Premium está em
BRL (`src/app/api/stripe/checkout/route.ts` decide isso olhando a
moeda do Price no momento do checkout).

Dois detalhes importantes sobre renovação, que são limitações do
método de pagamento em si, não do código:

- **Boleto não renova sozinho.** Cada cobrança gera um boleto novo que
  o cliente precisa pagar manualmente; se não pagar, a assinatura cai
  para `past_due`/`unpaid` conforme as regras de cobrança configuradas
  no Dashboard da Stripe (Settings → Billing → Subscriptions and
  emails). Bom para quem não tem cartão, mas não é "fire and forget".
- **Pix usa mandato (Pix Automático)**, uma funcionalidade recente da
  Stripe: no primeiro pagamento o cliente autoriza a cobrança recorrente
  no app do banco dele, e as cobranças seguintes são automáticas dentro
  do valor autorizado — mas a confirmação de cada cobrança pode levar
  alguns dias, então o acesso Premium pode demorar um pouco a mais pra
  renovar depois de cada ciclo, comparado a cartão. Vale confirmar no
  Dashboard da Stripe se Pix Automático já está disponível pra sua
  conta antes de divulgar essa opção.

Nenhuma dessas duas formas foi testada com uma cobrança real nesta
sessão (sem chaves da Stripe configuradas aqui) — teste no modo de
teste da Stripe antes de ativar em produção.

## Configurando notificações push

Lembretes de sequência (streak) são opcionais — sem configurar, o
botão de ativar fica oculto e o resto do app funciona normalmente.
Requer contas (Supabase) já configuradas, porque a inscrição de push
fica salva por usuário.

1. Gere o par de chaves VAPID: `npx web-push generate-vapid-keys`.
2. Preencha `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` em
   `.env.local` com as chaves geradas, e `VAPID_SUBJECT` com um e-mail
   ou URL de contato (ex.: `mailto:voce@exemplo.com`) — exigido pelo
   protocolo Web Push.
3. Rode `supabase/schema.sql` de novo no SQL Editor do Supabase (cria
   a tabela `push_subscriptions`, se ainda não existir).
4. Escolha um `CRON_SECRET` (qualquer string aleatória longa) e
   preencha essa variável também.
5. Configure um agendador externo para chamar, uma vez por dia,
   `POST https://SEU_DOMINIO/api/push/send-streak-reminders` com o
   header `x-cron-secret: <seu CRON_SECRET>`. Esse endpoint varre a
   tabela `gamification_state` (via `service_role`) em busca de
   usuários cuja sequência foi estendida ontem — ou seja, quebra hoje
   se eles não praticarem — e envia um push a cada inscrição salva
   deles, removendo automaticamente inscrições expiradas (410/404).
   Qualquer agendador serve: um cron job de um provedor de hospedagem,
   um workflow do GitHub Actions com `schedule:`, ou até um serviço
   externo de "ping" HTTP diário.

Como funciona no navegador: `/progresso` mostra um botão "Ativar
lembretes" (`src/components/NotificationOptIn.tsx`) que pede permissão
de notificação, assina o `PushManager` do navegador e salva a inscrição
via `/api/push/subscribe`. O service worker (`public/sw.js`) escuta o
evento `push` e mostra a notificação; clicar nela abre `/progresso`.

Não testado com um envio real nesta sessão (sem chaves VAPID
configuradas aqui) — teste com uma inscrição de verdade antes de
agendar o cron em produção.

A mesma infraestrutura (chaves VAPID + `push_subscriptions`) também
notifica mensagens novas de chat e de comunidade — nenhuma variável
adicional é necessária. Diferente do lembrete de streak (que roda uma
vez por dia via cron), essa notificação é disparada na hora: depois
que `ChatThread.tsx`/`CommunityThread.tsx` insere a mensagem no
Supabase (o `insert` direto do navegador, para minimizar latência —
ver "Sobre o chat" abaixo), o navegador também chama, sem esperar a
resposta (`notifyNewMessage` em `src/lib/pushNotifyMessage.ts`),
`POST /api/push/notify-message`. Essa rota reconfirma a mensagem pelo
próprio Supabase do usuário logado (garantindo que quem chamou é
realmente quem enviou aquela mensagem — não dá pra forjar um id de
mensagem alheia para gerar spam de notificação) e envia um push para
todo participante/membro (menos quem enviou).

**Limitações desta primeira versão**: sem preferência de silenciar
uma conversa/comunidade específica, e em comunidades grandes todo
membro recebe push a cada mensagem — pode ficar barulhento em
comunidades muito ativas. Um passo natural futuro é agregar várias
mensagens numa única notificação, ou permitir silenciar por
conversa/comunidade.

## Configurando verificação de identidade e consentimento dos responsáveis

Chat, comunidades e lives (ver seções abaixo) são recursos sociais que
exigem verificação de identidade antes de liberar — tanto por segurança
quanto para proteger menores de idade. Em vez de tentar construir um
scanner de documento/rosto por conta própria (o que seria só teatro de
segurança, ou uma tentativa inadequada de KYC biométrico caseiro), essa
verificação é feita pelo [Stripe Identity](https://stripe.com/identity)
— documento oficial + selfie com prova de vida, processado pela Stripe.
Sem configurar, a verificação (e tudo que depende dela) fica
indisponível, mas o resto do app funciona normalmente.

1. No dashboard da Stripe, ative o produto "Identity".
2. Em **Developers → Webhooks**, adicione um **segundo** endpoint
   (separado do de assinaturas) para
   `https://SEU_DOMINIO/api/identity/webhook`, com os eventos
   `identity.verification_session.verified`,
   `identity.verification_session.requires_input` e
   `identity.verification_session.canceled` — copie o "Signing secret"
   em `STRIPE_IDENTITY_WEBHOOK_SECRET`. Reaproveita `STRIPE_SECRET_KEY`
   (o mesmo das assinaturas).
3. Rode `supabase/schema.sql` de novo (cria `identity_verifications` e
   `parent_consents`).
4. (Opcional, mas recomendado) crie uma conta em
   [resend.com](https://resend.com), verifique um domínio remetente e
   preencha `RESEND_API_KEY`/`RESEND_FROM_EMAIL` — sem isso, o link de
   consentimento dos responsáveis é gerado e salvo, mas nenhum e-mail é
   enviado de verdade (você teria que buscar o link manualmente no
   banco para testar).

Como funciona: em `/verificar-identidade`, o usuário inicia uma
`VerificationSession` da Stripe Identity (documento oficial + selfie).
O webhook recebe o resultado e extrai a data de nascimento verificada
(`verified_outputs.dob`) — não confiamos em nenhuma data autodeclarada
pelo usuário. Se a idade calculada (`src/lib/identity/age.ts`) for
menor que 18 anos, o status vira `verified_minor` em vez de `verified`,
e a liberação de chat/comunidades/lives fica bloqueada até um
responsável confirmar consentimento: o menor informa o e-mail do
responsável, o app gera um token aleatório e envia um link de
confirmação (`/consentimento/[token]`) — esse fluxo é inspirado no
"verifiable parental consent" da COPPA americana, embora este app não
seja necessariamente sujeito a essa lei especificamente (verifique com
um advogado quais leis de proteção a menores se aplicam à sua
jurisdição antes de operar isso com usuários reais). Nenhum documento
de identidade ou imagem de selfie é armazenado neste banco — tudo isso
fica só do lado da Stripe; guardamos apenas o status e a data de
nascimento extraída. Não testado com uma conta Stripe Identity real
nesta sessão — teste uma verificação de ponta a ponta antes de contar
com isso em produção.

## Configurando as lives (LiveKit Cloud)

Lives (ver "Sobre as lives" abaixo) usam a [LiveKit
Cloud](https://cloud.livekit.io) para a transmissão de vídeo/áudio de
verdade — este app só guarda metadados (quem, quando, título). Sem
configurar, `/lives` fica indisponível, mas o resto do app funciona
normalmente.

1. Crie um projeto em [cloud.livekit.io](https://cloud.livekit.io).
2. Em **Settings → Keys**, copie a API Key e o API Secret para
   `LIVEKIT_API_KEY`/`LIVEKIT_API_SECRET`.
3. Copie a "Project URL" (formato `wss://SEU-PROJETO.livekit.cloud`)
   para `NEXT_PUBLIC_LIVEKIT_URL` — essa URL é usada pelo navegador
   para conectar na sala, por isso é pública.

Como as lives também são um recurso social, valem as mesmas exigências
de verificação de identidade descritas acima. Não testado com uma
conta LiveKit Cloud real nesta sessão — teste uma chamada de ponta a
ponta (dois navegadores/dispositivos diferentes) antes de contar com
isso em produção.

## Sobre o chat

`/chat` (link no menu) é um chat 1:1 e em grupo, estilo WhatsApp,
exigindo verificação de identidade (`granted`, ver seção acima) para
usar. Iniciar uma conversa é pelo e-mail da outra pessoa (não existe
busca/listagem de usuários — só confirma se aquele e-mail específico
tem conta, via a RPC `find_user_by_email`, o mesmo tipo de checagem
usada num fluxo de "esqueci minha senha"). Um grupo aceita vários
e-mails separados por vírgula.

Como funciona: `src/app/actions/chat.ts` cria a conversa (RPCs
`find_or_create_direct_conversation`/`create_group_conversation`, que
evitam duplicar uma conversa 1:1 já existente); `ChatThread.tsx`
(client) assina o canal Realtime do Supabase
(`postgres_changes`/INSERT em `dm_messages`, filtrado por
`conversation_id`) para receber mensagens novas ao vivo, e envia
mensagens com um `insert` direto do navegador (sem round-trip por uma
Server Action) para minimizar a latência percebida. Como a tabela
`profiles` só permite a cada usuário ler a própria linha (RLS), mostrar
o nome de quem está do outro lado da conversa exige RPCs `security
definer` dedicadas (`list_my_conversations`, `get_conversation_header`,
`get_conversation_participants`) — mesmo padrão já usado em
`get_turma_roster` para turmas.

**Limitações desta primeira versão**: sem edição/exclusão de mensagem,
sem indicador de "digitando...", sem confirmação de leitura, sem
upload de imagem/arquivo (só texto), e sem paginação do histórico (todas
as mensagens da conversa são carregadas de uma vez — ok para o volume
esperado agora, mas um ponto a revisar se conversas ficarem muito
longas). Cotas de Premium (nº de grupos, tamanho de grupo) ainda não
são aplicadas aqui — é um próximo passo natural.

## Sobre as comunidades

`/comunidades` (link no menu) são grupos de estudo persistentes, com
chat próprio, também exigindo verificação de identidade (`granted`)
para usar. Diferente do chat 1:1/grupo, uma comunidade tem: um código
de entrada (`join_code`, gerado com `generateJoinCode()`, o mesmo
gerador já usado nas turmas), opção de ser pública (listada em
"Descobrir comunidades públicas" para qualquer verificado entrar sem
código) ou privada (só entra quem tiver o código), e um limite opcional
de membros.

Limites do plano gratuito: um usuário free pode **criar** no máximo
`FREE_COMMUNITY_LIMIT = 1` comunidade (checado contando linhas em
`communities` por `creator_id` em `src/app/actions/communities.ts`), e
uma comunidade criada por um usuário free tem um teto de
`FREE_MEMBER_CAP = 20` membros (aplicado dentro da RPC `join_community`,
que recusa a entrada com o erro `community_full` quando o teto é
atingido). Comunidades criadas por assinantes Premium não têm limite de
membros (`member_cap` nulo). Não há limite para **entrar** em
comunidades de outras pessoas, seja free ou Premium.

Como funciona: `create_community` (RPC `security definer`) cria a
comunidade e já insere o criador como `role='owner'` na mesma
transação — evita o problema de "ovo e galinha" de `community_members`
não ter política de insert direta (toda entrada de membro passa pela
RPC `join_community`, que também é quem checa o `member_cap`).
`CommunityThread.tsx` é uma cópia quase idêntica de `ChatThread.tsx`,
só trocando a tabela/canal Realtime para `community_messages`/
`community:{id}`. Mostrar nome e papel (owner/member) de cada membro
usa a mesma técnica de RPC `security definer` (`get_community_members`)
para contornar a RLS de `profiles`, igual ao chat.

**Limitações desta primeira versão**: sem papéis intermediários
(moderador), sem expulsar/banir membro, sem editar nome/descrição
depois de criada, e as mesmas limitações de mensagens do chat (sem
edição/exclusão, sem upload de arquivo, sem paginação).

## Sobre as lives

`/lives` (link no menu) são sessões de vídeo ao vivo, hospedadas na
LiveKit Cloud — este app nunca vê o vídeo/áudio bruto, só guarda
metadados (quem, quando, título, comunidade associada) na tabela
`live_sessions`. Assistir uma live exige a mesma verificação de
identidade (`granted`) do chat/comunidades e é **grátis** para
qualquer verificado; **hospedar** uma live (virar anfitrião) é um
recurso **Premium** — checado com `isPremiumUser()` em
`src/app/actions/lives.ts` antes de criar a sessão.

Como funciona: `createLive` gera um `room_name` único
(`live-{uuid}`) e insere a linha em `live_sessions` (a política de RLS
`live_sessions_insert` já garante que só o próprio host pode se
declarar host, e que uma live vinculada a uma comunidade exige ser
membro dela). A página `/lives/[roomName]` busca essa linha (RLS
`live_sessions_select` já filtra quem pode ver: o host, ninguém
vinculado a comunidade nenhuma, ou quem for membro da comunidade
associada) e renderiza `LiveRoom.tsx`, que busca um token de acesso em
`POST /api/livekit/token` (essa rota decide se o token permite
publicar vídeo/áudio — `canPublish` — comparando `live.host_id` com o
usuário logado; quem não é o host só recebe permissão de assistir) e
conecta na sala com `livekit-client` (`Room.connect`). O host tem
botões para ligar/desligar câmera e microfone
(`localParticipant.setCameraEnabled`/`setMicrophoneEnabled`) e um
botão "Encerrar live" que marca `ended_at` e redireciona para a lista.

**Limitações desta primeira versão**: sem gravação/replay da live, sem
chat de texto durante a transmissão, sem lista de espectadores, e o
layout de vídeo é uma grade simples (sem destaque automático de quem
está falando). Como não temos uma conta real da LiveKit Cloud
configurada neste ambiente de desenvolvimento, este fluxo não foi
testado contra o serviço de verdade — só o estado "não configurado" tem
cobertura de testes automatizados (veja `e2e/lives.spec.ts`).

## Sobre a moderação

Chat, grupos e comunidades precisam de um jeito de lidar com abuso —
principalmente considerando que parte dos usuários pode ser menor de
idade. Esta primeira versão cobre:

- **Denunciar mensagem**: um botão "Denunciar" em cada mensagem alheia
  (chat e comunidade) chama a RPC `report_message`, que confirma que
  quem denuncia realmente tinha acesso àquela mensagem antes de
  aceitar, e grava em `message_reports`. Denúncias são revisadas no
  painel `/admin/moderacao` (ver "Sobre o painel de moderação" abaixo).
- **Bloquear um contato**: no cabeçalho de uma conversa 1:1,
  "Bloquear esta pessoa" insere uma linha em `blocked_users`. A partir
  daí, a policy de RLS `dm_messages_insert` passa a recusar qualquer
  mensagem nova dessa pessoa em **qualquer** conversa que
  compartilhem — não é só uma cortina na tela, é aplicado no banco.
  `find_or_create_direct_conversation` também recusa iniciar uma nova
  conversa se a outra pessoa já bloqueou você. A lista de bloqueados
  fica em `/chat/bloqueados`, com opção de desbloquear.
- **Sair/remover de um grupo de chat**: qualquer participante sai por
  conta própria (`leave_group_conversation`); quem criou o grupo pode
  remover outros participantes (`remove_conversation_participant`) —
  mas não pode remover a si mesmo (para isso, basta sair).
- **Sair/remover de uma comunidade**: mesma lógica
  (`leave_community`/`remove_community_member`), só que o dono da
  comunidade não pode sair por essa via — sair deixaria a comunidade
  sem dono, então a única opção do dono é excluir a comunidade.

**Limitações desta primeira versão**: sem mute temporário (só
remoção definitiva de grupo/comunidade, ou banimento total dos
recursos sociais via painel de moderação), sem banimento que impeça
reentrar com um novo convite/link, sem aviso automático quando uma
denúncia atinge um certo número de ocorrências, e o painel de
moderação não notifica ninguém — um admin precisa entrar em
`/admin/moderacao` periodicamente para ver o que chegou.

## Sobre o tour de boas-vindas

`OnboardingTour.tsx` (montado globalmente em `layout.tsx`, junto com o
prompt de instalação do PWA e a bolha do tutor) mostra um modal de 6
passos na primeira visita — Trilhas/gamificação, ferramentas de
estudo (calculadora, foto, quadro), o tutor Gauss, os recursos
sociais (chat/comunidades/lives) e um passo final. "Pular" ou chegar
ao último passo grava `onboarding-tour-dismissed` no `localStorage` e
o tour nunca mais aparece nesse navegador — sem conta, sem backend,
mesmo padrão do prompt de instalação do PWA
(`InstallPwaPrompt.tsx`).

**Nota para quem for mexer nos testes e2e**: como cada teste do
Playwright começa com um contexto de navegador limpo (sem
`localStorage`), o tour apareceria na primeira visita de *todo* teste
e bloquearia cliques nos elementos por baixo do modal. Para não
precisar tocar em ~30 arquivos de spec existentes, `playwright.config.ts`
seta `use.storageState` para um arquivo (`e2e/onboarding-dismissed-storage-state.json`)
que já marca o tour como dispensado, globalmente, por padrão.
`e2e/onboarding.spec.ts` é o único arquivo que precisa ver o tour de
verdade — ele sobrescreve isso com
`test.use({ storageState: { cookies: [], origins: [] } })` para
simular um visitante realmente novo.

## Sobre exportação e exclusão de conta (LGPD)

A [página de privacidade](/privacidade) promete os direitos de acesso,
portabilidade e exclusão previstos na LGPD — `/conta` (link no e-mail
do usuário, no canto superior direito) é onde a pessoa exerce esses
direitos sozinha, sem precisar pedir para alguém da equipe:

- **Exportar meus dados**: `GET /api/account/export` devolve um JSON
  para download com tudo que o app guarda sobre a conta — perfil, XP,
  sequência, progresso por tópico, assinatura, status de verificação
  de identidade, turmas criadas/matriculadas, comunidades
  criadas/participadas, mensagens enviadas (chat e comunidade), lives
  hospedadas, contatos bloqueados e denúncias feitas. Cada consulta
  passa pelo client do próprio usuário (RLS), nunca pela
  `service_role` — só pode devolver o que a pessoa já teria acesso de
  qualquer forma.
- **Excluir minha conta**: exige digitar o próprio e-mail como
  confirmação antes de habilitar o botão (`DeleteAccountForm.tsx`).
  `deleteMyAccount` (em `src/app/actions/account.ts`) chama
  `supabase.auth.admin.deleteUser(user.id)` — como toda tabela no
  schema referencia `auth.users` com `on delete cascade`, apagar essa
  linha já apaga perfil, progresso, assinatura, mensagens, turmas e
  comunidades criadas, tudo em cascata, sem precisar apagar tabela por
  tabela manualmente. Ação irreversível.

**Limitações desta primeira versão**: a exportação não inclui as
contagens de uso diário (`photo_solve_usage`/`tutor_usage` — só
contadores de limite, não conteúdo pessoal em si) nem mensagens que a
pessoa *recebeu* de outros (só as que ela mesma enviou, já que
mensagens recebidas também são dado de quem enviou). **Cuidado ao
excluir a conta de quem criou uma turma, comunidade ou conversa**: como
`communities.creator_id`, `turmas.teacher_user_id` e
`conversations.created_by` também têm `on delete cascade` até
`auth.users`, excluir a conta do criador apaga a turma/comunidade/
conversa **inteira em cascata para todo mundo**, não só a participação
de quem foi excluído — os alunos perdem a turma, os outros membros
perdem a comunidade, o outro lado de uma conversa perde o histórico
todo. Um passo futuro seria transferir a titularidade para outro
membro (ou bloquear a autoexclusão enquanto a pessoa for a única
dona) antes de permitir a exclusão da conta.

## Sobre o painel de moderação

`/admin/moderacao` lista as denúncias feitas via "Denunciar" (chat e
comunidades), com o conteúdo da mensagem, quem enviou e quem denunciou
— só quem está na tabela `admins` consegue ver essa página (qualquer
outra pessoa recebe 404, não uma mensagem de "acesso negado", para não
revelar que a página existe). Para cada denúncia pendente, o admin
pode:

- **Dispensar**: marca a denúncia como resolvida sem tomar nenhuma
  ação (`resolve_report` com status `dismissed`).
- **Marcar ação tomada**: mesma coisa, mas registra que alguma ação
  foi tomada fora do painel (`action_taken`) — útil quando a ação já
  foi feita manualmente (ex: conversa direta com o usuário).
- **Banir remetente dos recursos sociais**: insere o autor da
  mensagem em `banned_users`. A partir daí, `getSocialAccessStatus()`
  retorna `"banned"` para essa pessoa, bloqueando chat, comunidades e
  lives — mas **não** afeta login nem o conteúdo educacional do resto
  do app. Reversível a qualquer momento ("Desbanir remetente").

**Promovendo um admin**: não existe (de propósito) nenhuma tela de
"virar admin" — isso teria que ser auto-serviço ou exigir um segundo
nível de permissão para conceder permissões, o que é mais complexidade
do que vale a pena agora. Em vez disso, promova alguém rodando, no SQL
Editor do Supabase (com a `service_role`, nunca pelo cliente):

```sql
insert into public.admins (user_id)
values ('UUID_DO_USUARIO_AQUI');
```

**Limitações desta primeira versão**: sem log de auditoria de ações do
painel (quem baniu quem, quando), sem busca/filtro na lista de
denúncias, e sem paginação (ok para o volume esperado agora).

## Preparando para produção

Quatro peças de "prontidão para produção" — domínio próprio, SEO,
monitoramento de erros e analytics. Todas são opcionais: sem
configurar nada, o app funciona normalmente (só que com URLs
`localhost` no sitemap e sem monitoramento/analytics).

### Domínio próprio

Isso depende do seu provedor de hospedagem e registrador de domínio —
não é algo que dá pra automatizar por código. Passos gerais:

1. Registre um domínio (ex.: em registro.br, se for `.com.br`).
2. No painel do seu provedor de hospedagem (Vercel, Netlify etc.),
   adicione o domínio ao projeto — ele vai indicar os registros DNS
   (geralmente um `A`/`ALIAS` para a raiz e um `CNAME` para `www`).
3. Cadastre esses registros no painel do seu registrador. A propagação
   DNS pode levar de minutos a até 48h.
4. Preencha `NEXT_PUBLIC_SITE_URL` com a URL final (ex.:
   `https://meridianomatematica.com.br`) — o sitemap, o robots.txt e as
   tags OpenGraph passam a usar essa URL em vez de `localhost:3000`.

### SEO

Sem configurar nada além do domínio acima, o app já expõe:

- `/sitemap.xml` (`src/app/sitemap.ts`) — gerado a partir de
  `src/data/curriculum.ts`: a home, páginas estáticas (calculadora,
  quadro, etc.) e uma URL para cada trilha/tópico disponível
  (`available: true`). Trilhas "em breve" ficam de fora.
  `src/app/sitemap.test.ts` cobre esse comportamento.
- `/robots.txt` (`src/app/robots.ts`) — libera tudo, exceto `/api/`,
  `/auth/callback` e `/progresso` (uma página pessoal, sem valor pra
  indexação), e aponta pro sitemap acima.
- Metadados OpenGraph/Twitter e `metadataBase` (`src/app/layout.tsx`),
  usados por WhatsApp/redes sociais ao gerar a prévia de um link
  compartilhado, e um título com template (`%s — Meridiano
  Matemática`) pra páginas que definirem seu próprio `title`.

### Monitoramento de erros (Sentry)

Sem configurar, nenhum evento é enviado — o app funciona normalmente.

1. Crie uma conta e um projeto Next.js em [sentry.io](https://sentry.io)
   e copie o DSN do projeto.
2. Preencha `NEXT_PUBLIC_SENTRY_DSN` e `SENTRY_DSN` (mesmo valor nas
   duas) em `.env.local`.
3. Reinicie o servidor.

Como funciona: `instrumentation-client.ts` (erros/performance no
navegador) e `instrumentation.ts` (`register()` para erros de
servidor, `onRequestError` para erros de Server Components/rotas)
inicializam o SDK do Sentry só se o DSN estiver definido — sem ele,
essas funções retornam imediatamente e o `@sentry/nextjs` fica
instalado, mas inerte. Não testado com um DSN de verdade nesta sessão
(sem conta Sentry configurada aqui) — verifique um erro de teste
chegando ao painel antes de confiar no monitoramento em produção.

### Analytics

Sem configurar, nenhum script de analytics é carregado. O app suporta
qualquer serviço compatível com o formato de script do
[Plausible](https://plausible.io) (cookieless, sem consentimento de
cookies necessário) — incluindo instâncias próprias/[Umami](https://umami.is)
que imitam esse formato.

1. Crie um site em plausible.io (ou rode sua própria instância) e
   copie o domínio cadastrado lá (geralmente igual ao
   `NEXT_PUBLIC_SITE_URL`, sem o `https://`).
2. Preencha `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` em `.env.local`.
3. Só se você hospedar seu próprio Plausible/Umami: preencha também
   `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` apontando pro `script.js` do seu
   servidor (sem essa variável, usa o script oficial do plausible.io).

Como funciona: `src/components/Analytics.tsx` renderiza um `<Script>`
carregando o `script.js` do Plausible só quando o domínio está
configurado — sem ele, o componente não renderiza nada.

## Sobre as turmas

Não existe uma tabela/flag de "papel" (professor vs. aluno) — qualquer
conta pode criar uma turma em `/turmas` e vira dona dela; nada impede a
mesma pessoa de também ser aluna em outra turma. Isso mantém o modelo
de dados simples e evita uma etapa de "solicitar acesso de professor".

O código de acesso (6 caracteres, sem `0/O/1/I` pra evitar confusão ao
digitar) é a única forma de entrar numa turma — não existe listagem
pública de turmas. Ver o progresso dos alunos (XP, sequência, resultado
de uma tarefa) exigiria que o professor lesse linhas de
`topic_progress`/`gamification_state` de outros usuários, o que a RLS
dessas tabelas bloqueia por padrão (cada usuário só lê a própria
linha). Em vez de afrouxar a RLS dessas tabelas — o que abriria uma
brecha maior do que o necessário — três funções `security definer` em
`supabase/schema.sql` fazem exatamente essa checagem pontual
(confirmam que quem está chamando é o professor daquela turma
específica antes de retornar qualquer linha): `join_turma_by_code`,
`get_turma_roster` e `get_turma_assignment_progress`.

**Desempenho por atribuição**: a página da turma (para o professor)
mostra uma tabela aluno × tarefa — cada célula é a nota daquela tarefa
específica para aquele aluno (`X/Y (Z%)`, colorida verde/amarelo/
vermelho pela porcentagem), ou "Ainda não tentou" se o aluno ainda não
fez aquele exercício. Isso já usava a RPC `get_turma_assignment_progress`
(criada desde o início, mas nunca conectada a nenhuma tela) — o único
código novo foi chamá-la uma vez por tarefa (em paralelo, via
`Promise.all`) e montar a tabela em `TurmaPerformanceMatrix.tsx`. É
assim que um professor identifica rapidamente que um aluno específico
está com dificuldade num tópico específico, em vez de só ver XP/
sequência agregados.

## Sobre a integração de conhecimento (o "neurônio")

A ideia: o conhecimento no app não devia viver isolado em "gavetas"
por trilha — uma ideia como "coeficiente angular" aparece na Geometria
Analítica do Ensino Médio, reaparece como β1 na Regressão Linear
Simples de Econometria, e é o próprio modelo que o Machine Learning
"Introdução" ensina a treinar. Esta primeira versão (v1) conecta esses
pontos de um jeito propositalmente simples — sem embeddings nem busca
vetorial de verdade —, servindo como prova de conceito para uma versão
2 mais sofisticada (ver "Fase 2" abaixo).

Como funciona hoje:

1. **Tópicos relacionados**: um campo opcional `relatedTopics` em
   `Topic` (`src/data/curriculum.ts`) referencia outros tópicos por
   `{ levelId, topicId }`. `getRelatedTopics(topic)` resolve essas
   referências para os tópicos de verdade (ignorando qualquer id
   digitado errado). Curada à mão, hoje conectando tópicos que
   atravessam trilhas diferentes — ex: "Função do 1º Grau" ↔ "Geometria
   Analítica" ↔ "Regressão Linear Simples" (Econometria) ↔
   "Fundamentos de Aprendizado Supervisionado" (Machine Learning),
   "Progressões" ↔ "Juros Simples"/"Juros Compostos" (Matemática
   Financeira, PA e PG na prática), "Probabilidade Básica" ↔ "Operações
   com Conjuntos" (Lógica e Conjuntos), "Distribuição Binomial" ↔
   "Distribuição Normal", "Testes de Hipótese" ↔ "Significância dos
   Coeficientes" (Econometria), e "Função Quadrática" ↔ "Limites e
   Derivadas" (Ensino Superior) — a mesma curva que vira parábola no
   Médio reaparece como objeto de derivada no Cálculo.
2. **Perguntar ao Gauss sobre isso**: um botão que abre o tutor de IA
   global (a bolha do Gauss) já com uma pergunta pré-preenchida
   mencionando o tópico atual. Como o tutor é um componente separado
   montado uma vez no layout raiz, a comunicação é feita com um evento
   customizado do navegador (`window.dispatchEvent`/`addEventListener`,
   ver `src/lib/gaussPrompt.ts`) — sem precisar de um Context ou
   estado global só para isso.
3. **Conversas relacionadas**: quando o usuário tem acesso social
   liberado (`granted`), a página do tópico busca (com `ilike` no
   título do tópico) mensagens de comunidades e conversas de chat das
   quais ele já participa — respeitando a RLS normalmente, então só
   aparecem resultados de comunidades/conversas que o usuário já é
   membro.

Tudo isso é renderizado por `KnowledgeGraph.tsx`, incluído no fim de
`/trilha/[nivel]/[topico]`. Quando um tópico não tem `relatedTopics`,
só o botão do Gauss aparece — o resto da seção fica invisível.

4. **Caminho de conhecimento (`/caminho/[nivel]/[topico]`)**: o rodapé
   de tópicos relacionados é uma lista plana — bom para "aqui está algo
   parecido", mas não mostra a ideia de espiral entre trilhas. A página
   `/caminho` resolve isso: mostra o tópico atual no centro, seus
   tópicos relacionados diretos (1º grau) cada um com dois botões
   ("Estudar este tópico" → a lição de verdade; "Explorar conexões" →
   continua a navegação pelo caminho daquele tópico), e — o que faz
   isso parecer de fato um caminho, não só uma lista — os tópicos
   relacionados de CADA um desses (2º grau), como chips menores. É
   assim que "Geometria Analítica" (Ensino Médio) mostra "Regressão
   Linear Simples" (Econometria) que por sua vez mostra "Fundamentos de
   Aprendizado Supervisionado" (Machine Learning) sem precisar clicar
   duas vezes. Lógica pura e testável em
   `src/lib/knowledgePathway.ts` (a função `buildPathway` cuida de não
   repetir o tópico central nem duplicar um tópico de 2º grau que
   aparece nas conexões de mais de um tópico de 1º grau). Um link "Ver
   caminho de conhecimento completo →" na página real do tópico é a
   porta de entrada; tópicos sem `relatedTopics` mostram um estado
   vazio em vez de 404.

**Fase 2 (implementada, opcional)**: a curadoria manual de
`relatedTopics` não escala para milhares de exercícios, então também
existe um caminho por embeddings — opcional, precisa de
`VOYAGE_API_KEY` configurada (veja "Configurando o grafo de
conhecimento (Fase 2)" abaixo). `npm run generate-embeddings`
(`scripts/generate-topic-embeddings.ts`) gera um embedding do
título+resumo+teoria de cada tópico via a [Voyage
AI](https://www.voyageai.com/) (modelo `voyage-4`, 1024 dimensões;
exercícios ficam de fora do texto embeddado de propósito, para não
diluir o embedding com variações repetitivas de uma mesma ideia) e
grava numa tabela `topic_embeddings` (extensão
[pgvector](https://github.com/pgvector/pgvector) do Postgres),
pulando tópicos cujo conteúdo não mudou (comparando um hash). A RPC
`match_related_topics` busca os tópicos mais parecidos por
similaridade de cosseno (`<=>` no pgvector). `KnowledgeGraph.tsx`
mescla esses resultados semânticos com os `relatedTopics` curados à
mão (sem duplicar), então mesmo sem rodar o script nada quebra — o
grafo só usa a curadoria manual, exatamente como antes. A busca de
discussões no chat/comunidades continua usando `ilike` por enquanto
(buscar por embedding ali também é possível, mas não foi feito nesta
versão). Como não temos uma conta real da Voyage AI configurada neste
ambiente de desenvolvimento, esse caminho não foi testado contra o
serviço de verdade.

## Sobre os comandos de voz

Usa a [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) do próprio navegador (`SpeechRecognition`/
`webkitSpeechRecognition`) — sem chave de API, sem custo, sem servidor
envolvido. Funciona no Chrome/Edge e no Safari; **não funciona no
Firefox**, que ainda não implementa essa API — nesse caso o botão de
voz simplesmente não aparece (detecção de suporte em
`src/lib/useSpeechRecognition.ts`), sem quebrar nada.

Dois lugares usam voz hoje:

1. **Responder exercícios** (`ExerciseQuiz.tsx`): um botão "🎤 Falar
   resposta" aparece acima das alternativas (múltipla escolha) ou ao
   lado do campo de resposta (numérico). Para múltipla escolha, o
   texto reconhecido é comparado com as opções (`matchSpokenOption`
   em `src/lib/voiceMatching.ts` — primeiro tenta igualdade exata,
   depois substring, depois a opção com mais palavras em comum) e a
   mais parecida é selecionada automaticamente. Para resposta
   numérica, `extractSpokenNumber` tenta achar um número (ou fração
   tipo "2/3", testado antes do padrão decimal simples para não
   truncar a fração) na fala, e cai no texto bruto se não achar
   nenhum.
2. **Perguntar ao Gauss por voz**: o mesmo botão de voz aparece ao
   lado do campo de mensagem do tutor de IA, adicionando a fala
   reconhecida ao texto já digitado (não substitui, então dá pra
   compor uma pergunta por voz e texto juntos).

O reconhecimento usa o idioma da interface (`src/i18n/`) para
configurar `recognition.lang` (ex: `pt-BR`, `en-US`, `es-ES`) — exceto
nos exercícios, que são conteúdo só em português e por isso sempre
usam `pt-BR`, independente do idioma da interface.

Como testar sem microfone: a API real não roda em Chromium headless
(sem permissão de microfone), então os testes (`e2e/voice-input.spec.ts`)
injetam uma classe `SpeechRecognition` de mentira via
`page.addInitScript` antes da página carregar — `start()` dispara
`onresult` com uma transcrição fixa, exercitando o fluxo completo
"clicar no microfone → preencher resposta → corrigir" de ponta a
ponta, sem precisar de áudio de verdade.

**Limitações desta primeira versão**: sem suporte a comandos de voz
para navegação (ex: "próxima pergunta", "abrir turma") — só
preenchimento de resposta/pergunta. A correspondência de opções de
múltipla escolha funciona bem para alternativas com palavras (ex:
"Verdadeiro"/"Falso"), mas é menos confiável quando as opções são só
notação numérica (ex: frações como "6/10") — falar "seis décimos" não
bate com "6/10" através de correspondência de texto simples.

## Sobre a revisão espaçada

A página `/revisao` (`src/components/ReviewSession.tsx`) traz de volta,
depois de um tempo, exercícios específicos que o aluno errou em
qualquer trilha — repetição espaçada no estilo SM-2, mas simplificada
(`src/lib/reviewSchedule.ts`):

- Toda vez que `ExerciseQuiz.tsx` verifica uma resposta, ele chama
  `recordReviewResult(levelId, topicId, difficulty, exerciseId,
  correto)`, que agenda a próxima revisão daquele exercício específico
  (não do tópico inteiro): acerto dobra o intervalo desde a última vez
  (começando em 1 dia, com teto de 60 dias); erro volta o intervalo pra
  1 dia.
- O estado fica no `localStorage` (`meridiano-math-review-schedule`),
  local-first como progresso e gamificação, e sincroniza com a nuvem do
  mesmo jeito (tabela `review_schedule`, RLS dono-só, wireup em
  `src/lib/cloudSync.ts`) quando o usuário está logado com Supabase
  configurado.
- Ao abrir `/revisao`, a lista de exercícios vencidos (`dueAt` no
  passado) é capturada uma única vez no início da sessão
  (`buildDueItems()`) — revisar um exercício não o remove da lista
  atual, mesmo que ele já não esteja mais "vencido" no armazenamento;
  isso evita que a lista mude de tamanho no meio da sessão.
- Quando não há nada vencido, a página mostra um estado vazio
  convidando a praticar mais trilhas — é assim que a maioria dos
  acessos deve começar, já que o intervalo mínimo é de 1 dia.

**Limitação desta primeira versão**: como a lista de "vencidos" só é
recalculada ao carregar a página (não em tempo real), um exercício que
passa a vencer enquanto a aba já está aberta só aparece na próxima
visita a `/revisao`.

## Sobre a dificuldade adaptativa

O seletor de dificuldade (`DifficultyPicker.tsx`) destaca com um selo
"Recomendado" o nível mais indicado pra praticar em seguida, sem tirar
a escolha manual do usuário — os quatro níveis continuam clicáveis
como sempre.

A recomendação (`src/lib/adaptiveDifficulty.ts`, função pura e
testada) usa a mesma régua de 70% de acerto do resultado do quiz
("Muito bem!" vs. "Bom começo"): percorre Fácil → Médio → Difícil →
Olimpíada e recomenda o primeiro nível que o aluno ainda não tentou, ou
tentou e ficou abaixo de 70% — nesse caso, o selo fica no nível atual
em vez de empurrar pra frente, sugerindo reforçar antes de avançar. Se
todos os quatro níveis já foram dominados, a recomendação fica em
Olimpíada, o mais difícil.

Como o `DifficultyPicker` faz parte do motor de exercícios (junto com
o `ExerciseQuiz`), o selo "Recomendado" fica hardcoded em português,
pela mesma razão dos outros textos dessa seção — ver "O que ainda não
é traduzido" acima. Para não quebrar seletores de teste como
`getByRole("button", { name: /^Fácil/ })`, o card recomendado recebe um
`aria-label` explícito ("Fácil (recomendado)") em vez de deixar o texto
do selo entrar na ordem natural do nome acessível do botão.

## Sobre o idioma

O seletor de idioma (`src/i18n/`) traduz toda a navegação e as páginas
de nível superior: menu, home, login/cadastro, resolver por foto e
quadro de rascunho, em 11 idiomas — Português, English, Español, 中文
(chinês), Italiano, 한국어 (coreano), Deutsch, Français, 日本語
(japonês), العربية (árabe) e Русский (russo). A arquitetura é simples
de propósito — dicionários (`src/i18n/dictionaries.ts`) mais um cookie
(lido por Server e Client Components), sem reescrever rotas com
prefixo de idioma (`/en/...`). Adicionar um novo idioma é só: (1)
adicionar o código à união `Locale` e ao array `LOCALES` em
`src/i18n/config.ts` (mais `RTL_LOCALES` se for um idioma da direita
pra esquerda), e (2) adicionar um objeto completo ao `dictionaries` em
`dictionaries.ts` — o TypeScript aponta na hora qualquer chave faltando,
porque `Record<Locale, Dictionary>` exige as ~330 chaves do tipo
`Dictionary` para todo idioma.

**O que ainda não é traduzido** (fica em português por enquanto):

- O conteúdo do currículo em si (teoria e enunciados de exercícios em
  `src/data/curriculum.ts`) — traduzir isso com qualidade pedagógica é
  um projeto de conteúdo à parte, do mesmo porte de adicionar um nível
  novo, não algo que dá para fazer bem em lote.
- O motor de exercícios (`ExerciseQuiz`, `DifficultyPicker`) e a
  página de revisão espaçada (`ReviewSession`, que reaproveita o mesmo
  motor) — mexer neles quebraria dezenas de testes e2e que hoje
  verificam texto exato em português; fica como próximo passo se
  decidirmos ir além da navegação. O link do menu (`nav.revisao`) já
  está traduzido nos 11 idiomas, como qualquer outro item de navegação.
  O dashboard de progresso (`/progresso`, incluindo o card "Pontos de
  atenção" e a grade de conquistas) já é totalmente traduzido — chaves
  `progresso` e `badges` em `dictionaries.ts` (`badges` é indexada por
  `BadgeId`, o mesmo `id` usado em `BADGES` no `gamification.ts`),
  real em pt-BR/en/es, fallback pro inglês nos outros 8. A única
  exceção é o toast "Nova conquista!" que aparece dentro do
  `ExerciseQuiz` ao terminar um quiz — ele ainda usa `badge.name`/
  `badge.description` direto do `gamification.ts` (português), de
  propósito: o resto da tela de resultado do `ExerciseQuiz` também é
  só português (ver item acima), então traduzir só o nome da conquista
  ali deixaria a tela com dois idiomas misturados — pior que deixar
  tudo em português.
- Mensagens de erro de autenticação (vêm prontas do Supabase via
  `src/app/actions/auth.ts`).

Isso significa: hoje dá para navegar o app inteiro em qualquer um dos
10 outros idiomas, mas ao entrar numa trilha e resolver exercícios, o
conteúdo continua em português.

**Sobre as seções sociais mais novas** (`identity`, `chat`,
`communities`, `lives`, `knowledgeGraph`, `onboarding`): pt-BR e es têm
tradução real desde que essas seções foram criadas; os outros 8 idiomas
apontam para `socialFeaturesEn` (um bloco de textos em inglês
compartilhado) em vez de repetir o inglês em cada objeto de idioma —
assim o `Dictionary` fica satisfeito sem duplicar string por string.
Traduzir de verdade as 6 seções para os 8 idiomas de uma vez é um
projeto grande; em vez de tentar tudo junto, aprofundamos uma seção por
vez conforme dá tempo — `chat` já tem tradução real em Français (`fr`)
como primeiro passo, e o resto do inglês compartilhado continua
funcionando normalmente enquanto isso avança aos poucos.

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
resposta entre as opções, etc.).

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
assim que "Regras de Probabilidade" e "Intervalos de Confiança" foram
conferidos.

O CI (`.github/workflows/ci.yml`) roda lint, checagem de tipos, testes
unitários e e2e em todo push e pull request.

## Estrutura

- `src/data/curriculum.ts` — conteúdo: níveis, tópicos, teoria e
  exercícios (com campo `difficulty`).
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
  "Variáveis Dummy (Binárias)"));
  `InteractiveWidgetRenderer.tsx`
  mapeia o campo `interactiveWidget` de uma `TheorySection` (em
  `src/data/curriculum.ts`) pro componente
  certo, renderizado pelo `TopicPage`. Todos os widgets usam apenas as
  variáveis de tema (`var(--color-foreground)`, `var(--color-muted)`,
  `var(--color-border)`, `bg-surface`) para fundo, texto e linhas do SVG,
  em vez de cores fixas (`bg-white`, `#1a1a2e` etc.) — o canvas de cada
  widget acompanha o modo claro/escuro automaticamente. Cores saturadas de
  dado (azul, verde, vermelho, âmbar, roxo) permanecem fixas por
  legibilidade em ambos os temas.
- `src/lib/mathExpr.ts` — parser/avaliador de expressões matemáticas
  para a calculadora gráfica.
- `src/components/PracticeSection.tsx` + `DifficultyPicker.tsx` +
  `ExerciseQuiz.tsx` — seleção de dificuldade e motor de exercícios.
- `public/manifest.json`, `public/sw.js` — configuração PWA (instalável,
  cache de app shell).
- `src/lib/supabase/` — clientes Supabase (browser/server) e refresh de
  sessão; `src/lib/cloudSync.ts` — sincronização de progresso/XP com a
  nuvem quando logado.
- `src/app/api/resolver-foto/route.ts` + `src/components/PhotoSolver.tsx`
  — rota e UI de "resolver por foto" (Claude API com visão).
- `src/components/DrawingCanvas.tsx` + `QuadroBoard.tsx` — quadro de
  rascunho (canvas livre) e o botão "Resolver com IA", que reaproveita
  `/api/resolver-foto` exportando o desenho como PNG.
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
  código de acesso.
- `src/components/MobileNavMenu.tsx` — menu de navegação responsivo
  (hambúrguer em telas estreitas, barra horizontal em telas largas),
  usado pelo `Navbar.tsx`.
- `src/components/OAuthButtons.tsx` + `signInWithGoogle`/
  `signInWithMicrosoft` em `src/app/actions/auth.ts` — login com
  Google/Microsoft; `src/app/auth/callback/route.ts` troca o código de
  autorização por uma sessão do Supabase.
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
tópicos correspondente em `src/data/curriculum.ts` seguindo o formato de
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
`InteractiveWidget` (`src/data/curriculum.ts`).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Contas/banco de dados:
Supabase (opcional). IA (resolver por foto): Claude API (opcional).
Testes: Vitest (unitário) + Playwright (e2e).
