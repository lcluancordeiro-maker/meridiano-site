import { test, expect, type Page } from "@playwright/test";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
  estatisticaAvancadoTopics,
  estatisticaInicianteTopics,
  estatisticaIntermediarioTopics,
  fundamental2Topics,
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
 */
const TRACKS: { levelId: string; topicId: string; exercises: Exercise[] }[] = [
  ...fundamental2Topics.map((t) => ({ levelId: "fundamental-2", topicId: t.id, exercises: t.exercises })),
  ...estatisticaInicianteTopics.map((t) => ({
    levelId: "estatistica-iniciante",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...estatisticaIntermediarioTopics.map((t) => ({
    levelId: "estatistica-intermediario",
    topicId: t.id,
    exercises: t.exercises,
  })),
  ...estatisticaAvancadoTopics.map((t) => ({
    levelId: "estatistica-avancado",
    topicId: t.id,
    exercises: t.exercises,
  })),
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
