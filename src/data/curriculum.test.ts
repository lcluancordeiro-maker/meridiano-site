import { describe, expect, it } from "vitest";
import {
  DIFFICULTY_ORDER,
  estatisticaAvancadoTopics,
  estatisticaInicianteTopics,
  estatisticaIntermediarioTopics,
  fundamental2Topics,
  getLevel,
  getTopic,
  getTopicsForLevel,
  levels,
  medioTopics,
  programacaoInicianteTopics,
  programacaoIntermediarioTopics,
  type Topic,
} from "./curriculum";

const ALL_TRACKS: { levelId: string; topics: Topic[] }[] = [
  { levelId: "fundamental-2", topics: fundamental2Topics },
  { levelId: "medio", topics: medioTopics },
  { levelId: "estatistica-iniciante", topics: estatisticaInicianteTopics },
  { levelId: "estatistica-intermediario", topics: estatisticaIntermediarioTopics },
  { levelId: "estatistica-avancado", topics: estatisticaAvancadoTopics },
  { levelId: "programacao-iniciante", topics: programacaoInicianteTopics },
  { levelId: "programacao-intermediario", topics: programacaoIntermediarioTopics },
];

describe("levels", () => {
  it("has unique ids", () => {
    const ids = levels.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every available level has at least one topic", () => {
    for (const level of levels) {
      if (level.available) {
        expect(getTopicsForLevel(level.id).length).toBeGreaterThan(0);
      }
    }
  });

  it("getLevel finds a known level and returns undefined for unknown ids", () => {
    expect(getLevel("fundamental-2")?.name).toBe("Ensino Fundamental II");
    expect(getLevel("nao-existe")).toBeUndefined();
  });

  it("keeps the intro tier of every track free (fundamental-2, medio, estatistica-iniciante)", () => {
    expect(getLevel("fundamental-2")?.premium).toBe(false);
    expect(getLevel("medio")?.premium).toBe(false);
    expect(getLevel("estatistica-iniciante")?.premium).toBe(false);
  });

  it("gates the advanced statistics tiers behind Premium", () => {
    expect(getLevel("estatistica-intermediario")?.premium).toBe(true);
    expect(getLevel("estatistica-avancado")?.premium).toBe(true);
  });

  it("keeps Programação — Iniciante free and gates the advanced/ML tiers behind Premium", () => {
    expect(getLevel("programacao-iniciante")?.premium).toBe(false);
    expect(getLevel("programacao-avancado")?.premium).toBe(true);
    expect(getLevel("machine-learning-iniciante")?.premium).toBe(true);
  });

  it("makes Programação — Intermediário available and free", () => {
    expect(getLevel("programacao-intermediario")?.available).toBe(true);
    expect(getLevel("programacao-intermediario")?.premium).toBe(false);
  });
});

describe.each(ALL_TRACKS)("topics for $levelId", ({ levelId, topics }) => {
  it("has unique topic ids within the level", () => {
    const ids = topics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every topic has at least one theory section with non-empty body", () => {
    for (const topic of topics) {
      expect(topic.theory.length).toBeGreaterThan(0);
      for (const section of topic.theory) {
        expect(section.heading.trim()).not.toBe("");
        expect(section.body.length).toBeGreaterThan(0);
        for (const paragraph of section.body) {
          expect(paragraph.trim()).not.toBe("");
        }
      }
    }
  });

  it("getTopic resolves each topic through the public accessor", () => {
    for (const topic of topics) {
      expect(getTopic(levelId, topic.id)?.title).toBe(topic.title);
    }
  });

  describe.each(topics.map((t) => [t.id, t] as const))("topic %s", (_id, topic) => {
    it("has unique exercise ids", () => {
      const ids = topic.exercises.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has non-empty prompt, answer and explanation for every exercise", () => {
      for (const ex of topic.exercises) {
        expect(ex.prompt.trim(), `${topic.id}/${ex.id} prompt`).not.toBe("");
        expect(ex.answer.trim(), `${topic.id}/${ex.id} answer`).not.toBe("");
        expect(ex.explanation.trim(), `${topic.id}/${ex.id} explanation`).not.toBe("");
      }
    });

    it("gives every multiple-choice exercise at least two options that include the answer", () => {
      for (const ex of topic.exercises) {
        if (ex.type !== "multiple-choice") continue;
        expect(ex.options?.length ?? 0, `${topic.id}/${ex.id} options`).toBeGreaterThanOrEqual(2);
        expect(ex.options, `${topic.id}/${ex.id} options include answer`).toContain(ex.answer);
      }
    });

    it("gives every numeric exercise no options", () => {
      for (const ex of topic.exercises) {
        if (ex.type === "numeric") {
          expect(ex.options, `${topic.id}/${ex.id} numeric should not have options`).toBeUndefined();
        }
      }
    });
  });
});

describe("fundamental2Topics — difficulty coverage", () => {
  it("gives every topic exactly 6 exercises per difficulty tier", () => {
    for (const topic of fundamental2Topics) {
      for (const difficulty of DIFFICULTY_ORDER) {
        const count = topic.exercises.filter((e) => e.difficulty === difficulty).length;
        expect(count, `${topic.id} / ${difficulty}`).toBe(6);
      }
    }
  });

  it("gives every topic 24 exercises total", () => {
    for (const topic of fundamental2Topics) {
      expect(topic.exercises.length, topic.id).toBe(24);
    }
  });
});

describe("routing uniqueness", () => {
  it("never has the same (level, topic) pair defined twice across the app", () => {
    const seen = new Set<string>();
    for (const { levelId, topics } of ALL_TRACKS) {
      for (const topic of topics) {
        const key = `${levelId}/${topic.id}`;
        expect(seen.has(key), key).toBe(false);
        seen.add(key);
      }
    }
  });
});
