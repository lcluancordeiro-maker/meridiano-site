"use client";

import { useState } from "react";
import type { Difficulty, Exercise } from "@/data/curriculum";
import { DIFFICULTY_LABELS } from "@/data/curriculum";
import DifficultyPicker from "./DifficultyPicker";
import ExerciseQuiz from "./ExerciseQuiz";

export default function PracticeSection({
  levelId,
  topicId,
  exercises,
}: {
  levelId: string;
  topicId: string;
  exercises: Exercise[];
}) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  if (!difficulty) {
    return (
      <DifficultyPicker
        levelId={levelId}
        topicId={topicId}
        exercises={exercises}
        onSelect={setDifficulty}
      />
    );
  }

  const filtered = exercises.filter((e) => e.difficulty === difficulty);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">
          Nível: <span className="font-semibold text-foreground">{DIFFICULTY_LABELS[difficulty]}</span>
        </span>
        <button
          onClick={() => setDifficulty(null)}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Trocar de nível
        </button>
      </div>
      <ExerciseQuiz
        key={difficulty}
        levelId={levelId}
        topicId={topicId}
        difficulty={difficulty}
        exercises={filtered}
      />
    </div>
  );
}
