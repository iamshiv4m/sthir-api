import { promises as fs } from "fs";
import path from "path";
import type { GeneratedProgram, IntakeAnswers } from "./types";

export async function generateProgramPdf(
  program: GeneratedProgram,
  answers: IntakeAnswers
): Promise<string> {
  const dir = path.join(process.cwd(), "data", "exports");
  await fs.mkdir(dir, { recursive: true });

  const lines: string[] = [
    "STHIR — PERSONALIZED TRAINING PROGRAM",
    "=====================================",
    "",
    `Athlete: ${answers.name}`,
    `Email: ${answers.email}`,
    `Program: ${program.templateName}`,
    `Generated: ${new Date(program.createdAt).toLocaleString("en-IN")}`,
    "",
    "COACH NOTES",
    "-----------",
  ];

  if (program.coachNotes.trim()) {
    lines.push(program.coachNotes);
  } else {
    lines.push("(None — add notes in admin before delivery)");
  }

  lines.push(
    "",
    "TRAINING BLOCK",
    "--------------",
    "Week | Day | Exercise | Sets | Reps | Load | RPE",
    "-----|-----|----------|------|------|------|----",
  );

  for (const b of program.blocks.slice(0, 120)) {
    lines.push(
      `${String(b.week).padStart(4)} | ${String(b.day).padStart(3)} | ${b.exercise.slice(0, 20).padEnd(20)} | ${String(b.sets).padStart(4)} | ${String(b.reps).padStart(4)} | ${b.load.slice(0, 12).padEnd(12)} | ${b.rpe ?? "-"}`
    );
  }

  if (program.blocks.length > 120) {
    lines.push(`... and ${program.blocks.length - 120} more rows (see CSV export)`);
  }

  lines.push(
    "",
    "DISCLAIMER: Not medical advice. Consult a physician before starting any program.",
    "© Sthir — India Strength Sports Platform"
  );

  const filename = `program_${program.intakeId.slice(0, 8)}.txt`;
  const filepath = path.join(dir, filename.replace(".txt", ".pdf.txt"));
  await fs.writeFile(filepath, lines.join("\n"), "utf-8");

  return filepath;
}
