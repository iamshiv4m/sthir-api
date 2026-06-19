import fs from "fs";
import path from "path";
import type { GoalId } from "./constants";
import type { IntakeAnswers, ProgramBlock } from "./types";

export type TemplateExercise = {
  name: string;
  sets: number;
  reps: string;
  intensityPct: number;
  rpe?: string;
  liftKey?: "squat" | "bench" | "deadlift";
  notes?: string;
};

export type ProgramTemplate = {
  id: string;
  name: string;
  goal: GoalId;
  durationWeeks: number;
  daysPerWeek: number;
  federationTags: string[];
  description?: string;
  weekTemplate: Array<{
    day: number;
    focus: string;
    exercises: TemplateExercise[];
  }>;
  phases?: Array<{ name: string; weeks: number[]; volumeMultiplier: number }>;
  deloadWeek?: number;
  meetDayNotes?: string;
  nutritionNote?: string;
};

const TEMPLATE_DIR = path.join(process.cwd(), "templates", "programs");

export function loadAllTemplates(): ProgramTemplate[] {
  const files = fs.readdirSync(TEMPLATE_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(TEMPLATE_DIR, file), "utf-8");
    return JSON.parse(raw) as ProgramTemplate;
  });
}

export function selectTemplate(answers: IntakeAnswers): ProgramTemplate {
  const templates = loadAllTemplates();
  const federation = answers.federation === "ipf_pi" ? "ipf_pi" : answers.federation;

  const goalMap: Record<GoalId, string[]> = {
    first_meet: ["first_meet_12wk"],
    increase_total:
      answers.meetDate && answers.experience !== "beginner"
        ? ["meet_peak_16wk", "intermediate_block"]
        : ["intermediate_block", "meet_peak_16wk"],
    improve_squat: ["squat_specialization"],
    improve_bench: ["bench_specialization"],
    improve_deadlift: ["deadlift_specialization"],
    powerbuilding: ["powerbuilding_10wk"],
    office_strength: ["office_strength_4wk", "beginner_linear"],
    general_strength:
      answers.experience === "beginner" || answers.experience === "novice"
        ? ["beginner_linear"]
        : ["intermediate_block"],
    fat_loss_strength: ["fat_loss_strength_8wk"],
  };

  const preferredIds = goalMap[answers.goal] ?? ["intermediate_block"];

  for (const id of preferredIds) {
    const match = templates.find(
      (t) =>
        t.id === id &&
        (t.federationTags.includes(federation) || t.federationTags.includes("other"))
    );
    if (match) return match;
  }

  const fallback = templates.find((t) => t.goal === answers.goal);
  return fallback ?? templates[0];
}

/** Founding free tier — always the 4-week block regardless of goal selection. */
export function selectFoundingTemplate(answers: IntakeAnswers): ProgramTemplate {
  const templates = loadAllTemplates();
  const founding = templates.find((t) => t.id === "founding_4wk");
  if (founding) return founding;
  return selectTemplate(answers);
}

function getLiftMax(exercise: TemplateExercise, answers: IntakeAnswers): number {
  const key = exercise.liftKey ?? inferLiftKey(exercise.name);
  if (key === "squat") return answers.squat1rm;
  if (key === "bench") return answers.bench1rm;
  if (key === "deadlift") return answers.deadlift1rm;
  return answers.squat1rm;
}

function inferLiftKey(name: string): "squat" | "bench" | "deadlift" | null {
  const lower = name.toLowerCase();
  if (lower.includes("squat") && !lower.includes("front")) return "squat";
  if (lower.includes("bench") || lower.includes("press")) return "bench";
  if (lower.includes("deadlift")) return "deadlift";
  return null;
}

function phaseMultiplier(template: ProgramTemplate, week: number): number {
  if (template.deloadWeek === week) return 0.6;
  const phase = template.phases?.find((p) => p.weeks.includes(week));
  return phase?.volumeMultiplier ?? 1;
}

function roundToPlate(weight: number): number {
  return Math.round(weight * 2) / 2;
}

export function generateProgramBlocks(
  template: ProgramTemplate,
  answers: IntakeAnswers
): ProgramBlock[] {
  const blocks: ProgramBlock[] = [];
  const style = answers.trainingStyle;

  for (let week = 1; week <= template.durationWeeks; week++) {
    const mult = phaseMultiplier(template, week);

    for (const dayTemplate of template.weekTemplate) {
      for (const ex of dayTemplate.exercises) {
        const max = getLiftMax(ex, answers);
        const adjustedPct = ex.intensityPct * mult;
        const loadKg =
          ex.intensityPct > 0 && max > 0
            ? roundToPlate((max * adjustedPct) / 100)
            : null;

        const sets = Math.max(1, Math.round(ex.sets * mult));

        let loadStr = "Bodyweight / RPE only";
        if (loadKg !== null) {
          loadStr =
            style === "rpe"
              ? `@ RPE ${ex.rpe} (~${loadKg} kg)`
              : style === "mixed"
                ? `${loadKg} kg (${adjustedPct.toFixed(0)}%) / RPE ${ex.rpe}`
                : `${loadKg} kg (${adjustedPct.toFixed(0)}%)`;
        }

        blocks.push({
          week,
          day: dayTemplate.day,
          exercise: ex.name,
          sets,
          reps: ex.reps,
          load: loadStr,
          rpe: ex.rpe,
          notes: dayTemplate.focus,
        });
      }
    }
  }

  return blocks;
}

export function generateCoachNotes(
  template: ProgramTemplate,
  answers: IntakeAnswers
): string {
  const lines: string[] = [
    `Program: ${template.name}`,
    `Athlete: ${answers.name} | Federation: ${answers.federation}`,
    `SBD: ${answers.squat1rm}/${answers.bench1rm}/${answers.deadlift1rm} kg`,
    `Training ${answers.trainingDays} days/week | Style: ${answers.trainingStyle}`,
  ];

  if (answers.injuries.length && !answers.injuries.includes("None / Minor")) {
    lines.push(`Injury considerations: ${answers.injuries.join(", ")}`);
    if (answers.injuryNotes) lines.push(answers.injuryNotes);
  }

  if (answers.meetDate) {
    lines.push(`Meet date: ${answers.meetDate} — adjust final week taper accordingly.`);
  }

  if (answers.goal === "office_strength") {
    lines.push(
      "Office / 9–5 athlete: keep sessions 45–60 min; default 3 days/week (AM before work or PM after). Reduce volume if sleep <6h or long commute day."
    );
  }

  if (template.meetDayNotes) lines.push(template.meetDayNotes);
  if (template.nutritionNote) lines.push(template.nutritionNote);

  lines.push(
    "Review all loads against daily readiness. Reduce 2–5% if sleep <6h or RPE overshoots."
  );

  return lines.join("\n");
}

export function validateLiftRatios(answers: IntakeAnswers): string[] {
  const warnings: string[] = [];
  const { squat1rm, bench1rm, deadlift1rm, experience } = answers;

  if (bench1rm > squat1rm * 1.05 && experience === "beginner") {
    warnings.push("Bench exceeds squat — verify bench 1RM is accurate.");
  }
  if (deadlift1rm < squat1rm * 0.9) {
    warnings.push("Deadlift lower than expected vs squat — confirm numbers.");
  }
  if (answers.meetDate) {
    const weeksOut =
      (new Date(answers.meetDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000);
    if (weeksOut < 8) {
      warnings.push("Meet less than 8 weeks away — peak timeline is aggressive.");
    }
  }
  return warnings;
}
