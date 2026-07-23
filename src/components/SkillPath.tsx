"use client";

import { Fragment } from "react";
import Link from "next/link";
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, type Chapter, type Topic } from "@/data/curriculum";
import { useTopicProgress } from "@/lib/useTopicProgress";
import { useChapterCompletion } from "@/lib/useChapterCompletion";
import { computeTopicMastery, type MasteryInput } from "@/lib/mastery";

type NodeStatus = "concluído" | "em progresso" | "não iniciado";

function statusOf(completedTiers: number): NodeStatus {
  if (completedTiers === DIFFICULTY_ORDER.length) return "concluído";
  if (completedTiers > 0) return "em progresso";
  return "não iniciado";
}

/** One stop on the trail: a numbered node (✓ when every difficulty tier is
 * complete) connected to the next stop by a vertical line that turns green
 * as the student progresses, plus the topic card itself. Progress comes
 * from the same localStorage store the quiz writes to, so the map updates
 * live as quizzes are finished. */
function SkillPathNode({
  levelId,
  topic,
  index,
  isLast,
}: {
  levelId: string;
  topic: Topic;
  index: number;
  isLast: boolean;
}) {
  const facil = useTopicProgress(levelId, topic.id, "facil");
  const medio = useTopicProgress(levelId, topic.id, "medio");
  const dificil = useTopicProgress(levelId, topic.id, "dificil");
  const olimpiada = useTopicProgress(levelId, topic.id, "olimpiada");
  const tiers = [facil, medio, dificil, olimpiada];
  const completedTiers = tiers.filter((p) => p?.completed).length;
  const status = statusOf(completedTiers);
  const done = status === "concluído";
  const started = status === "em progresso";

  const masteryInput: MasteryInput = {
    facil,
    medio,
    dificil,
    olimpiada,
  };
  const mastery = computeTopicMastery(masteryInput);

  return (
    <li className="relative flex gap-4 sm:gap-5">
      <div className="flex flex-col items-center">
        <span
          data-testid="skill-node"
          aria-label={`${topic.title}: ${status}`}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-semibold ${
            done
              ? "border-success bg-success text-white"
              : started
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface text-muted"
          }`}
        >
          {done ? "✓" : index + 1}
        </span>
        {!isLast && (
          <span aria-hidden className={`w-0.5 flex-1 ${done ? "bg-success" : "bg-border"}`} />
        )}
      </div>

      <Link
        href={`/trilha/${levelId}/${topic.id}`}
        className="group mb-6 flex flex-1 flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
      >
        <h3 className="font-display text-lg font-semibold text-foreground">{topic.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{topic.summary}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>~{topic.minutes} min</span>
          <div className="flex items-center gap-2">
            {mastery !== null && (
              <span
                data-testid="mastery-badge"
                className="font-semibold text-foreground"
                title="Pontuação de domínio: acerto ponderado pela dificuldade, descontado quando faz tempo que você não pratica"
              >
                Domínio: {mastery}%
              </span>
            )}
            <span>
              {completedTiers}/{DIFFICULTY_ORDER.length} níveis
            </span>
            <div className="flex gap-1">
              {DIFFICULTY_ORDER.map((d, i) => (
                <span
                  key={d}
                  title={DIFFICULTY_LABELS[d]}
                  className={`h-2 w-2 rounded-full ${
                    tiers[i]?.completed ? "bg-success" : "bg-border"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

/** A section divider between chapters — shows the chapter title and a
 * rolled-up "n/total" across every difficulty tier of every topic in it,
 * turning green once the whole chapter is done.
 *
 * Also carries a *soft* prerequisite nudge: if the previous chapter has no
 * progress at all yet, this one shows a 🔒 hint suggesting the student
 * start there first. It's a suggestion only — every topic link underneath
 * stays fully clickable either way, so nobody who wants to skip ahead is
 * ever blocked. `previousChapter` is undefined for the first chapter in a
 * level, which is never locked. */
function ChapterHeading({
  levelId,
  chapter,
  previousChapter,
}: {
  levelId: string;
  chapter: Chapter;
  previousChapter?: Chapter;
}) {
  const { completed, total } = useChapterCompletion(levelId, chapter.topicIds);
  const previous = useChapterCompletion(levelId, previousChapter?.topicIds ?? []);
  const done = completed === total;
  const locked = Boolean(previousChapter) && previous.total > 0 && previous.completed === 0;

  return (
    <li
      className="my-2 flex items-center gap-3 first:mt-0"
      data-testid="chapter-heading"
      data-locked={locked}
    >
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span
        className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide ${
          done ? "text-success" : locked ? "text-warning" : "text-muted"
        }`}
        title={
          locked
            ? `Recomendado: comece por "${previousChapter!.title}" antes deste capítulo.`
            : undefined
        }
      >
        {locked && "🔒 "}
        {chapter.title} · {completed}/{total}
        {done ? " ✓" : ""}
      </span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </li>
  );
}

type Section = { chapter?: Chapter; topics: Topic[] };

/** Groups `topics` by the level's `chapters` config, in chapter order.
 * Falls back to one unlabeled section (the original flat list) when no
 * chapters are defined, or appends any topic a chapter list doesn't cover
 * (defensive — curriculum.test.ts asserts this never actually happens). */
function buildSections(topics: Topic[], chapters?: Chapter[]): Section[] {
  if (!chapters || chapters.length === 0) {
    return [{ topics }];
  }

  const covered = new Set<string>();
  const sections: Section[] = chapters.map((chapter) => {
    const chapterTopics = chapter.topicIds
      .map((id) => topics.find((t) => t.id === id))
      .filter((t): t is Topic => Boolean(t));
    chapterTopics.forEach((t) => covered.add(t.id));
    return { chapter, topics: chapterTopics };
  });

  const leftover = topics.filter((t) => !covered.has(t.id));
  if (leftover.length > 0) sections.push({ topics: leftover });
  return sections;
}

/** Pairs each section with the running topic index it starts at, so the
 * component can render numbered nodes without mutating anything during
 * render — the mutation (a plain running total) happens once here, in an
 * ordinary module-scope helper, not inside a component-body closure. */
function withStartIndices(sections: Section[]): { section: Section; startIndex: number }[] {
  let start = 0;
  return sections.map((section) => {
    const startIndex = start;
    start += section.topics.length;
    return { section, startIndex };
  });
}

export default function SkillPath({
  levelId,
  topics,
  chapters,
}: {
  levelId: string;
  topics: Topic[];
  chapters?: Chapter[];
}) {
  const sections = withStartIndices(buildSections(topics, chapters));

  return (
    <ol className="mt-10 flex flex-col">
      {sections.map(({ section, startIndex }, sectionIndex) => (
        <Fragment key={section.chapter?.title ?? `section-${sectionIndex}`}>
          {section.chapter && (
            <ChapterHeading
              levelId={levelId}
              chapter={section.chapter}
              previousChapter={sections[sectionIndex - 1]?.section.chapter}
            />
          )}
          {section.topics.map((topic, topicIndex) => {
            const index = startIndex + topicIndex;
            return (
              <SkillPathNode
                key={topic.id}
                levelId={levelId}
                topic={topic}
                index={index}
                isLast={index === topics.length - 1}
              />
            );
          })}
        </Fragment>
      ))}
    </ol>
  );
}
