export * from "./types";
export { levels } from "./levels";
import type { Level, Topic } from "./types";
import { levels } from "./levels";
export { fundamental1Topics } from "./topics/fundamental1";
import { fundamental1Topics } from "./topics/fundamental1";
export { fundamental2Topics } from "./topics/fundamental2";
import { fundamental2Topics } from "./topics/fundamental2";
export { estatisticaInicianteTopics } from "./topics/estatistica-iniciante";
import { estatisticaInicianteTopics } from "./topics/estatistica-iniciante";
export { estatisticaIntermediarioTopics } from "./topics/estatistica-intermediario";
import { estatisticaIntermediarioTopics } from "./topics/estatistica-intermediario";
export { estatisticaAvancadoTopics } from "./topics/estatistica-avancado";
import { estatisticaAvancadoTopics } from "./topics/estatistica-avancado";
export { medioTopics } from "./topics/medio";
import { medioTopics } from "./topics/medio";
export { programacaoInicianteTopics } from "./topics/programacao-iniciante";
import { programacaoInicianteTopics } from "./topics/programacao-iniciante";
export { programacaoIntermediarioTopics } from "./topics/programacao-intermediario";
import { programacaoIntermediarioTopics } from "./topics/programacao-intermediario";
export { matematicaFinanceiraInicianteTopics } from "./topics/matematica-financeira-iniciante";
import { matematicaFinanceiraInicianteTopics } from "./topics/matematica-financeira-iniciante";
export { matematicaFinanceiraAvancadoTopics } from "./topics/matematica-financeira-avancado";
import { matematicaFinanceiraAvancadoTopics } from "./topics/matematica-financeira-avancado";
export { superiorTopics } from "./topics/superior";
import { superiorTopics } from "./topics/superior";
export { geometriaEspacialTopics } from "./topics/geometria-espacial";
import { geometriaEspacialTopics } from "./topics/geometria-espacial";
export { logicaEConjuntosTopics } from "./topics/logica-e-conjuntos";
import { logicaEConjuntosTopics } from "./topics/logica-e-conjuntos";
export { algebraLinearTopics } from "./topics/algebra-linear";
import { algebraLinearTopics } from "./topics/algebra-linear";
export { analiseRealTopics } from "./topics/analise-real";
import { analiseRealTopics } from "./topics/analise-real";
export { econometriaTopics } from "./topics/econometria";
import { econometriaTopics } from "./topics/econometria";
export { programacaoAvancadoTopics } from "./topics/programacao-avancado";
import { programacaoAvancadoTopics } from "./topics/programacao-avancado";
export { machineLearningInicianteTopics } from "./topics/machine-learning-iniciante";
import { machineLearningInicianteTopics } from "./topics/machine-learning-iniciante";
export { vestibularEnemTopics } from "./topics/vestibular-enem";
import { vestibularEnemTopics } from "./topics/vestibular-enem";
export { vestibularUerjTopics } from "./topics/vestibular-uerj";
import { vestibularUerjTopics } from "./topics/vestibular-uerj";
export { vestibularUnespTopics } from "./topics/vestibular-unesp";
import { vestibularUnespTopics } from "./topics/vestibular-unesp";
export { vestibularObmepTopics } from "./topics/vestibular-obmep";
import { vestibularObmepTopics } from "./topics/vestibular-obmep";
export { vestibularOimTopics } from "./topics/vestibular-oim";
import { vestibularOimTopics } from "./topics/vestibular-oim";
export { vestibularSatTopics } from "./topics/vestibular-sat";
import { vestibularSatTopics } from "./topics/vestibular-sat";
export { vestibularGmatTopics } from "./topics/vestibular-gmat";
import { vestibularGmatTopics } from "./topics/vestibular-gmat";

const TOPICS_BY_LEVEL: Record<string, Topic[]> = {
  "fundamental-1": fundamental1Topics,
  "fundamental-2": fundamental2Topics,
  medio: medioTopics,
  "estatistica-iniciante": estatisticaInicianteTopics,
  "estatistica-intermediario": estatisticaIntermediarioTopics,
  "estatistica-avancado": estatisticaAvancadoTopics,
  "programacao-iniciante": programacaoInicianteTopics,
  "programacao-intermediario": programacaoIntermediarioTopics,
  "matematica-financeira-iniciante": matematicaFinanceiraInicianteTopics,
  "matematica-financeira-avancado": matematicaFinanceiraAvancadoTopics,
  superior: superiorTopics,
  "geometria-espacial": geometriaEspacialTopics,
  "logica-e-conjuntos": logicaEConjuntosTopics,
  "algebra-linear": algebraLinearTopics,
  "analise-real": analiseRealTopics,
  "econometria-iniciante": econometriaTopics,
  "programacao-avancado": programacaoAvancadoTopics,
  "machine-learning-iniciante": machineLearningInicianteTopics,
  "vestibular-enem": vestibularEnemTopics,
  "vestibular-uerj": vestibularUerjTopics,
  "vestibular-unesp": vestibularUnespTopics,
  "vestibular-obmep": vestibularObmepTopics,
  "vestibular-oim": vestibularOimTopics,
  "vestibular-sat": vestibularSatTopics,
  "vestibular-gmat": vestibularGmatTopics,
};

export function getLevel(levelId: string): Level | undefined {
  return levels.find((l) => l.id === levelId);
}

export function getTopicsForLevel(levelId: string): Topic[] {
  return TOPICS_BY_LEVEL[levelId] ?? [];
}

export function getTopic(levelId: string, topicId: string): Topic | undefined {
  return getTopicsForLevel(levelId).find((t) => t.id === topicId);
}

/** Resolves a topic's `relatedTopics` refs into the actual level+topic pairs,
 * dropping any ref whose target doesn't exist (e.g. a typo'd id). */
export function getRelatedTopics(topic: Topic): { level: Level; topic: Topic }[] {
  if (!topic.relatedTopics) return [];

  const resolved: { level: Level; topic: Topic }[] = [];
  for (const ref of topic.relatedTopics) {
    const level = getLevel(ref.levelId);
    const relatedTopic = getTopic(ref.levelId, ref.topicId);
    if (level && relatedTopic) resolved.push({ level, topic: relatedTopic });
  }
  return resolved;
}
