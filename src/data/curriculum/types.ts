export type ExerciseType = "multiple-choice" | "numeric";

export type Difficulty = "facil" | "medio" | "dificil" | "olimpiada";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
  olimpiada: "Olimpíada",
};

export const DIFFICULTY_ORDER: Difficulty[] = ["facil", "medio", "dificil", "olimpiada"];

/** One sub-step of a guided decomposition of a harder exercise —
 * Brilliant-style scaffolding ("primeiro, qual relação usamos?…"). Steps
 * are one-tap multiple choice and revealed one at a time by the optional
 * "Resolver em etapas" panel in the quiz; they never gate or grade the
 * final answer, which stays the only thing worth XP. */
export type ExerciseStep = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type Exercise = {
  id: string;
  prompt: string;
  type: ExerciseType;
  difficulty: Difficulty;
  options?: string[];
  answer: string;
  explanation: string;
  /** Optional guided decomposition shown as a collapsible "Resolver em
   * etapas" panel — see ExerciseStep. */
  steps?: ExerciseStep[];
  /** Shown instead of the correct answer on the first wrong attempt — a
   * nudge pointing at the likely misconception, so the student gets a
   * chance to self-correct before the answer is revealed on a second miss.
   * Optional: exercises without one keep the original immediate-reveal
   * behavior. */
  commonMistakeHint?: string;
};

export type TheoryExample = {
  problem: string;
  solution: string;
};

/** Interactive widgets embedded in a theory section — sliders/draggable
 * points that give instant visual feedback, in the spirit of Brilliant.org.
 * See src/components/widgets/. */
export type InteractiveWidget =
  | "slope-explorer"
  | "two-point-explorer"
  | "quadratic-explorer"
  | "unit-circle-explorer"
  | "fraction-visualizer"
  | "probability-spinner"
  | "mean-median-explorer"
  | "compound-interest-explorer"
  | "tangent-line-explorer"
  | "pythagorean-explorer"
  | "sequence-explorer"
  | "normal-distribution-explorer"
  | "regression-line-explorer"
  | "percentage-change-explorer"
  | "confusion-matrix-explorer"
  | "matrix-explorer"
  | "prime-factorization-explorer"
  | "combination-explorer"
  | "solid-3d-explorer"
  | "vector-explorer"
  | "venn-diagram-explorer"
  | "truth-table-explorer"
  | "interval-explorer"
  | "bubble-sort-explorer"
  | "integer-line-explorer"
  | "equation-balance-explorer"
  | "power-root-explorer"
  | "proportion-percent-explorer"
  | "quadratic-roots-explorer"
  | "complex-plane-explorer"
  | "probability-bar-explorer"
  | "probability-rules-explorer"
  | "binomial-distribution-explorer"
  | "confidence-interval-explorer"
  | "hypothesis-test-explorer"
  | "dispersion-explorer"
  | "conditional-logic-explorer"
  | "array-index-explorer"
  | "string-index-explorer"
  | "logic-operator-explorer"
  | "loop-step-explorer"
  | "function-call-explorer"
  | "simple-interest-explorer"
  | "inflation-erosion-explorer"
  | "integral-area-explorer"
  | "critical-point-explorer"
  | "differential-equation-explorer"
  | "cone-volume-explorer"
  | "sphere-volume-explorer"
  | "euler-formula-explorer"
  | "multiple-regression-explorer"
  | "t-statistic-explorer"
  | "object-state-explorer"
  | "stack-queue-explorer"
  | "recursion-explorer"
  | "overfitting-explorer"
  | "decision-tree-explorer"
  | "sac-schedule-explorer"
  | "present-value-explorer"
  | "argument-validity-explorer"
  | "sampling-explorer"
  | "dictionary-explorer"
  | "cross-validation-explorer"
  | "dummy-variable-explorer"
  | "place-value-explorer"
  | "multiplication-array-explorer"
  | "rectangle-perimeter-explorer"
  | "rounding-explorer"
  | "column-addition-explorer"
  | "division-remainder-explorer"
  | "equivalent-fractions-explorer"
  | "triangle-area-explorer"
  | "circular-sector-explorer"
  | "matrix-operations-explorer"
  | "linear-system-explorer"
  | "eigenvector-explorer"
  | "supremum-explorer"
  | "sequence-convergence-explorer"
  | "epsilon-delta-explorer"
  | "intermediate-value-explorer";

/** A quick one-tap multiple-choice check rendered inline right after a
 * theory section — Brilliant.org-style "learn by doing": instead of reading
 * all the theory and only then practicing, the student answers a small
 * question right after (almost) every concept, with immediate feedback and
 * an explanation reinforcing what was just read. Unlike Exercise, there's
 * no difficulty tier, XP or progress tracking — it's a comprehension check,
 * not a graded exercise. */
export type CheckQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type TheorySection = {
  heading: string;
  body: string[];
  example?: TheoryExample;
  interactiveWidget?: InteractiveWidget;
  checkQuestion?: CheckQuestion;
};

/** A link to another topic that shares an underlying idea — e.g. "slope"
 * connects a Geometria Analítica topic to a Regressão Linear topic in
 * Econometria. Powers the "Tópicos relacionados" section (see
 * KnowledgeGraph.tsx) that surfaces these cross-subject connections. Only
 * populated for a pilot set of topics for now — see "Sobre a integração de
 * conhecimento" in the README. */
export type RelatedTopicRef = { levelId: string; topicId: string };

/** Optional mid-level grouping between a Level (course) and its Topics
 * (lessons) — a themed cluster of a few topics, purely presentational (no
 * own route). Lets the skill path (SkillPath.tsx) render a level's topics
 * as chapter-sized sections instead of one long flat list, closer to how
 * Brilliant.org structures a course. `topicIds` must list, in order, a
 * subset of that level's topic ids — a level without `chapters` renders as
 * a flat list exactly as before (fully backward compatible). */
export type Chapter = {
  title: string;
  topicIds: string[];
};

/** "Um pouco de história": nota opcional no fim da teoria contando por que
 * o assunto existe e de onde veio — contexto que motiva o conteúdo em vez
 * de só apresentá-lo. `mathematicians` são ids de src/data/mathematicians.ts
 * e viram links para as biografias em /matematicos. */
export type HistoricalNote = {
  title: string;
  body: string[];
  mathematicians?: string[];
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
  relatedTopics?: RelatedTopicRef[];
  historicalNote?: HistoricalNote;
};

export type LevelGroup = "serie" | "estatistica" | "econometria" | "programacao" | "financas" | "vestibulares";

export type Level = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  available: boolean;
  /** Requires an active Premium subscription once `available` — see
   * src/lib/entitlements.ts. Irrelevant while `available` is false. */
  premium: boolean;
  group: LevelGroup;
  /** Optional chapter grouping for the skill path — see Chapter. */
  chapters?: Chapter[];
};

