import { test, expect, type Page } from "@playwright/test";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
  estatisticaInicianteTopics,
  fundamental1Topics,
  fundamental2Topics,
  logicaEConjuntosTopics,
  matematicaFinanceiraInicianteTopics,
  medioTopics,
  programacaoInicianteTopics,
  programacaoIntermediarioTopics,
  vestibularEnemTopics,
  type Difficulty,
  type Exercise,
} from "../src/data/curriculum";

/**
 * Data-driven regression test: for every topic/difficulty combination in the
 * curriculum, answer each exercise with its own `answer` field and assert the
 * app marks it "Certinho!". This formalizes the manual verification done while
 * authoring content — a future edit that breaks grading (normalization, the
 * difficulty filter, option matching, etc.) fails here, even though it can't
 * catch a wrong `answer` value baked into the content itself.
 *
 * estatistica-intermediario, estatistica-avancado,
 * matematica-financeira-avancado and the vestibular-uerj/unesp/obmep/oim exam
 * tracks are deliberately absent: all are Premium-gated (see
 * src/lib/entitlements.ts), and there's no way to get an authenticated +
 * subscribed session in this test environment (same limitation as Supabase
 * auth — see e2e/auth.spec.ts). Their content was verified against this same
 * suite before the paywall existed (or via the temporary premium:false
 * workaround documented in the README); paywall.spec.ts covers the behavior
 * that *is* testable here (the paywall itself renders).
 */
const TRACKS: { levelId: string; topicId: string; exercises: Exercise[] }[] = [
  ...fundamental1Topics.map((t) => ({ levelId: "fundamental-1", topicId: t.id, exercises: t.exercises })),
  ...fundamental2Topics.map((t) => ({ levelId: "fundamental-2", topicId: t.id, exercises: t.exercises })),
  ...medioTopics.map((t) => ({ levelId: "medio", topicId: t.id, exercises: t.exercises })),
  ...estatisticaInicianteTopics.map((t) => ({
    levelId: "estatistica-iniciante",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...programacaoInicianteTopics.map((t) => ({
    levelId: "programacao-iniciante",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...programacaoIntermediarioTopics.map((t) => ({
    levelId: "programacao-intermediario",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...matematicaFinanceiraInicianteTopics.map((t) => ({
    levelId: "matematica-financeira-iniciante",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...vestibularEnemTopics.map((t) => ({ levelId: "vestibular-enem", topicId: t.id, exercises: t.exercises })),
  ...logicaEConjuntosTopics.map((t) => ({ levelId: "logica-e-conjuntos", topicId: t.id, exercises: t.exercises })),
];

async function answerExercise(page: Page, exercise: Exercise) {
  if (exercise.type === "multiple-choice") {
    await page.getByRole("button", { name: exercise.answer, exact: true }).click();
  } else {
    await page.getByPlaceholder("Digite sua resposta").fill(exercise.answer);
  }
  await page.getByRole("button", { name: "Verificar" }).click();
}

test.describe("every exercise grades its own answer as correct", () => {
  for (const { levelId, topicId, exercises } of TRACKS) {
    for (const difficulty of DIFFICULTY_ORDER) {
      const tierExercises = exercises.filter((e) => e.difficulty === difficulty);
      if (tierExercises.length === 0) continue;

      test(`${levelId}/${topicId} — ${DIFFICULTY_LABELS[difficulty as Difficulty]}`, async ({
        page,
      }) => {
        await page.goto(`/trilha/${levelId}/${topicId}`);
        await page
          .getByRole("button", { name: new RegExp(`^${DIFFICULTY_LABELS[difficulty as Difficulty]}`) })
          .click();

        for (let i = 0; i < tierExercises.length; i++) {
          const exercise = tierExercises[i];
          await answerExercise(page, exercise);
          await expect(
            page.getByText("Certinho!"),
            `${levelId}/${topicId}/${exercise.id} (${exercise.prompt}) expected answer "${exercise.answer}" to be graded correct`
          ).toBeVisible();

          const isLast = i === tierExercises.length - 1;
          await page.getByRole("button", { name: isLast ? "Ver resultado" : "Próxima" }).click();
        }

        await expect(page.getByText(`${tierExercises.length} de ${tierExercises.length}`)).toBeVisible();
      });
    }
  }
});
