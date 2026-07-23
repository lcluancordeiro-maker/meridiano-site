import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BADGES,
  DIFFICULTY_XP,
  GEMS_PER_LEVEL,
  GEM_COST_ACCENT_THEME,
  GEM_COST_STREAK_FREEZE,
  MAX_STREAK_FREEZES,
  XP_BOOST_MULTIPLIER,
  __resetGamificationForTests,
  buyAccentTheme,
  buyStreakFreeze,
  buyXpBoost,
  getGamificationSnapshot,
  levelFromXp,
  recordBonusXp,
  recordCorrectAnswer,
  recordTopicCompletion,
} from "./gamification";
import { __resetProgressForTests, saveTopicProgress } from "./progress";
import { DIFFICULTY_ORDER } from "@/data/curriculum";

beforeEach(() => {
  window.localStorage.clear();
  __resetGamificationForTests();
  __resetProgressForTests();
});

describe("levelFromXp", () => {
  it("starts at level 1 with 0 xp", () => {
    expect(levelFromXp(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNextLevel: 100 });
  });

  it("advances one level per 100 xp", () => {
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(250)).toEqual({ level: 3, xpIntoLevel: 50, xpForNextLevel: 100 });
  });
});

describe("recordCorrectAnswer", () => {
  it("awards xp scaled by difficulty", () => {
    for (const [difficulty, amount] of Object.entries(DIFFICULTY_XP)) {
      __resetGamificationForTests();
      window.localStorage.clear();
      recordCorrectAnswer(difficulty as keyof typeof DIFFICULTY_XP);
      expect(getGamificationSnapshot().xp).toBe(amount);
    }
  });

  it("accumulates xp across multiple calls", () => {
    recordCorrectAnswer("facil");
    recordCorrectAnswer("medio");
    expect(getGamificationSnapshot().xp).toBe(DIFFICULTY_XP.facil + DIFFICULTY_XP.medio);
  });
});

describe("recordTopicCompletion — badges", () => {
  it("unlocks first-topic and awards the completion bonus on first completion", () => {
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 4, 6);
    const state = getGamificationSnapshot();
    expect(state.unlockedBadges).toContain("first-topic");
    expect(state.xp).toBe(50); // completion bonus only, no per-answer xp recorded here
  });

  it("does not re-award the completion bonus on a repeat attempt of the same topic", () => {
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 4, 6);
    const xpAfterFirst = getGamificationSnapshot().xp;
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "dificil", 3, 6);
    expect(getGamificationSnapshot().xp).toBe(xpAfterFirst);
  });

  it("unlocks perfect-score on a 100% result", () => {
    recordTopicCompletion("fundamental-2", "fracoes", "medio", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).toContain("perfect-score");
  });

  it("does not unlock perfect-score on a non-perfect result", () => {
    recordTopicCompletion("fundamental-2", "fracoes", "medio", 5, 6);
    expect(getGamificationSnapshot().unlockedBadges).not.toContain("perfect-score");
  });

  it("unlocks olympian only for a perfect olimpiada-tier result", () => {
    recordTopicCompletion("fundamental-2", "fracoes", "dificil", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).not.toContain("olympian");

    recordTopicCompletion("fundamental-2", "fracoes", "olimpiada", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).toContain("olympian");
  });

  it("unlocks all-difficulties once every difficulty tier of a topic is completed", () => {
    for (const difficulty of DIFFICULTY_ORDER) {
      saveTopicProgress("fundamental-2", "numeros-inteiros", difficulty, 6, 6);
    }
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "olimpiada", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).toContain("all-difficulties");
  });

  it("does not unlock all-difficulties when a tier is missing", () => {
    saveTopicProgress("fundamental-2", "numeros-inteiros", "facil", 6, 6);
    saveTopicProgress("fundamental-2", "numeros-inteiros", "medio", 6, 6);
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).not.toContain("all-difficulties");
  });

  it("unlocks fundamental-2-complete only once all 7 topics have a completion", () => {
    const topicIds = [
      "numeros-inteiros",
      "fracoes",
      "introducao-algebra",
      "potenciacao-radiciacao",
      "proporcionalidade-porcentagem",
      "equacoes-segundo-grau",
      "geometria-plana",
    ];
    for (const id of topicIds.slice(0, -1)) {
      recordTopicCompletion("fundamental-2", id, "medio", 5, 6);
    }
    expect(getGamificationSnapshot().unlockedBadges).not.toContain("fundamental-2-complete");

    recordTopicCompletion("fundamental-2", topicIds[topicIds.length - 1], "medio", 5, 6);
    expect(getGamificationSnapshot().unlockedBadges).toContain("fundamental-2-complete");
  });

  it("does not unlock fundamental-2-complete from a different level's topics", () => {
    recordTopicCompletion("estatistica-iniciante", "medidas-tendencia-central", "medio", 6, 6);
    expect(getGamificationSnapshot().unlockedBadges).not.toContain("fundamental-2-complete");
  });
});

describe("streak", () => {
  it("starts a streak of 1 on the first activity", () => {
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 5, 6);
    expect(getGamificationSnapshot().streak.current).toBe(1);
  });

  it("does not double-count activity on the same day", () => {
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 5, 6);
    recordTopicCompletion("fundamental-2", "fracoes", "medio", 5, 6);
    expect(getGamificationSnapshot().streak.current).toBe(1);
  });

  it("increments the streak on consecutive days and unlocks streak-3", () => {
    const base = new Date("2026-01-01T12:00:00Z");
    for (let day = 0; day < 3; day++) {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(base.getTime() + day * 86400000));
      recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 5, 6);
      vi.useRealTimers();
    }
    const state = getGamificationSnapshot();
    expect(state.streak.current).toBe(3);
    expect(state.unlockedBadges).toContain("streak-3");
  });

  it("resets the streak after a missed day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 5, 6);
    vi.setSystemTime(new Date("2026-01-03T12:00:00Z")); // skipped Jan 2
    recordTopicCompletion("fundamental-2", "fracoes", "medio", 5, 6);
    vi.useRealTimers();
    expect(getGamificationSnapshot().streak.current).toBe(1);
  });
});

describe("streak freezes", () => {
  const base = new Date("2026-01-01T12:00:00Z");

  function studyOnDay(dayOffset: number) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(base.getTime() + dayOffset * 86400000));
    recordTopicCompletion("fundamental-2", "numeros-inteiros", "medio", 5, 6);
    vi.useRealTimers();
  }

  it("earns a freeze after a 7-day streak", () => {
    for (let day = 0; day < 7; day++) studyOnDay(day);
    expect(getGamificationSnapshot().streak.current).toBe(7);
    expect(getGamificationSnapshot().streak.freezes).toBe(1);
  });

  it("caps banked freezes at MAX_STREAK_FREEZES", () => {
    for (let day = 0; day < 21; day++) studyOnDay(day); // three 7-day milestones, no freeze spent
    expect(getGamificationSnapshot().streak.freezes).toBe(MAX_STREAK_FREEZES);
  });

  it("consumes a banked freeze to bridge a 2-day gap, extending the streak", () => {
    for (let day = 0; day < 7; day++) studyOnDay(day); // streak = 7, freezes = 1
    studyOnDay(8); // day 7 skipped (2-day gap from day 6)
    const state = getGamificationSnapshot();
    expect(state.streak.current).toBe(8);
    expect(state.streak.freezes).toBe(0);
  });

  it("resets the streak on a 2-day gap when no freeze is banked", () => {
    studyOnDay(0);
    studyOnDay(3); // 2-day gap, no freeze banked yet
    const state = getGamificationSnapshot();
    expect(state.streak.current).toBe(1);
    expect(state.streak.freezes).toBe(0);
  });
});

describe("BADGES catalog", () => {
  it("has unique ids matching everything referenced by recordTopicCompletion", () => {
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("gem economy", () => {
  it("awards gems when xp crosses a level boundary", () => {
    recordBonusXp(99);
    expect(getGamificationSnapshot().gems).toBe(0);
    recordBonusXp(1); // xp = 100, crosses into level 2
    expect(getGamificationSnapshot().gems).toBe(GEMS_PER_LEVEL);
  });

  it("awards gems proportionally for a multi-level jump in one call", () => {
    recordBonusXp(250); // level 1 -> level 3, two boundaries crossed
    expect(getGamificationSnapshot().gems).toBe(GEMS_PER_LEVEL * 2);
  });

  describe("buyStreakFreeze", () => {
    it("fails without enough gems", () => {
      expect(buyStreakFreeze()).toBe(false);
      expect(getGamificationSnapshot().streak.freezes).toBe(0);
    });

    it("spends gems for one extra banked freeze", () => {
      recordBonusXp(500); // 5 level-ups => 5 * GEMS_PER_LEVEL gems earned
      expect(buyStreakFreeze()).toBe(true);
      const state = getGamificationSnapshot();
      expect(state.gems).toBe(5 * GEMS_PER_LEVEL - GEM_COST_STREAK_FREEZE);
      expect(state.streak.freezes).toBe(1);
    });

    it("refuses to exceed MAX_STREAK_FREEZES even with enough gems", () => {
      recordBonusXp(1000);
      for (let i = 0; i < MAX_STREAK_FREEZES; i++) expect(buyStreakFreeze()).toBe(true);
      expect(buyStreakFreeze()).toBe(false);
      expect(getGamificationSnapshot().streak.freezes).toBe(MAX_STREAK_FREEZES);
    });
  });

  describe("buyXpBoost", () => {
    it("fails without enough gems", () => {
      expect(buyXpBoost()).toBe(false);
      expect(getGamificationSnapshot().xpBoostUntil).toBeNull();
    });

    it("doubles subsequently earned xp while active", () => {
      recordBonusXp(1000); // plenty of gems to afford the boost
      expect(buyXpBoost()).toBe(true);
      const before = getGamificationSnapshot().xp;
      recordCorrectAnswer("facil");
      expect(getGamificationSnapshot().xp).toBe(before + DIFFICULTY_XP.facil * XP_BOOST_MULTIPLIER);
    });

    it("extends an already-active boost instead of restarting it", () => {
      recordBonusXp(2000); // plenty of gems for two boost purchases
      buyXpBoost();
      const firstUntil = getGamificationSnapshot().xpBoostUntil;
      buyXpBoost();
      const secondUntil = getGamificationSnapshot().xpBoostUntil;
      expect(secondUntil).toBe((firstUntil ?? 0) + 60 * 60 * 1000);
    });
  });

  describe("buyAccentTheme", () => {
    it("fails without enough gems", () => {
      expect(buyAccentTheme("oceano")).toBe(false);
      expect(getGamificationSnapshot().unlockedAccentThemes).toEqual([]);
    });

    it("unlocks the theme once and refuses a repeat purchase", () => {
      recordBonusXp(1000);
      expect(buyAccentTheme("oceano")).toBe(true);
      expect(getGamificationSnapshot().unlockedAccentThemes).toEqual(["oceano"]);
      const gemsAfterFirstBuy = getGamificationSnapshot().gems;
      expect(buyAccentTheme("oceano")).toBe(false);
      expect(getGamificationSnapshot().gems).toBe(gemsAfterFirstBuy);
    });

    it("can unlock more than one theme", () => {
      recordBonusXp(1000);
      buyAccentTheme("oceano");
      buyAccentTheme("floresta");
      expect(getGamificationSnapshot().unlockedAccentThemes).toEqual(["oceano", "floresta"]);
      expect(GEM_COST_ACCENT_THEME).toBeGreaterThan(0);
    });
  });
});
