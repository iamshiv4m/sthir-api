import { promises as fs } from "fs";
import path from "path";
import type { GeneratedProgram, IntakeAnswers } from "./types";

export function buildProgramCsvContent(
  program: GeneratedProgram,
  answers: IntakeAnswers,
): string {
  const header = "Week,Day,Exercise,Sets,Reps,Load,RPE,Notes\n";
  const rows = program.blocks
    .map(
      (b) =>
        `${b.week},${b.day},"${b.exercise}",${b.sets},"${b.reps}","${b.load}","${b.rpe ?? ""}","${b.notes ?? ""}"`,
    )
    .join("\n");

  const meta = [
    `# Sthir Program Export`,
    `# Athlete: ${answers.name}`,
    `# Template: ${program.templateName}`,
    `# Generated: ${program.createdAt}`,
    `# Coach Notes:`,
    ...program.coachNotes.split("\n").map((l) => `# ${l}`),
    "",
  ].join("\n");

  return meta + header + rows;
}

export async function exportProgramCsv(
  program: GeneratedProgram,
  answers: IntakeAnswers,
): Promise<{ filepath: string; content: string }> {
  const dir = path.join(process.cwd(), "data", "exports");
  await fs.mkdir(dir, { recursive: true });

  const content = buildProgramCsvContent(program, answers);
  const filename = `program_${program.intakeId.slice(0, 8)}.csv`;
  const filepath = path.join(dir, filename);
  await fs.writeFile(filepath, content, "utf-8");

  return { filepath, content };
}

export function buildSheetInstructions(
  program: GeneratedProgram,
  answers: IntakeAnswers
): string {
  return [
    "Google Sheet delivery (configure GOOGLE_SERVICE_ACCOUNT for auto-copy):",
    `1. Duplicate master template for ${answers.name}`,
    `2. Import CSV from admin dashboard`,
    `3. Share link with athlete email: ${answers.email}`,
    `Template: ${program.templateName} | Version ${program.version}`,
  ].join("\n");
}
