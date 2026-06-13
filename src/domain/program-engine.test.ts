import { describe, it, expect } from "vitest";
import {
  selectTemplate,
  generateProgramBlocks,
  validateLiftRatios,
} from "./program-engine";
import type { IntakeAnswers } from "./types";

const baseAnswers: IntakeAnswers = {
  goal: "first_meet",
  email: "test@example.com",
  name: "Test Athlete",
  age: 25,
  gender: "male",
  heightCm: 175,
  bodyweightKg: 80,
  experience: "intermediate",
  federation: "ipf_pi",
  squat1rm: 140,
  bench1rm: 100,
  deadlift1rm: 180,
  trainingDays: 4,
  trainingStyle: "mixed",
  gymType: "warehouse",
  equipment: { barbell: true, rack: true, bench: true },
  injuries: [],
  sleepQuality: 4,
  disclaimerAccepted: true,
};

describe("program-engine", () => {
  it("selects first meet template for first_meet goal", () => {
    const t = selectTemplate(baseAnswers);
    expect(t.id).toBe("first_meet_12wk");
  });

  it("selects squat specialization template", () => {
    const t = selectTemplate({ ...baseAnswers, goal: "improve_squat" });
    expect(t.id).toBe("squat_specialization");
  });

  it("generates blocks with calculated loads", () => {
    const t = selectTemplate(baseAnswers);
    const blocks = generateProgramBlocks(t, baseAnswers);
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks[0].load).toMatch(/kg/);
  });

  it("warns on aggressive meet timeline", () => {
    const warnings = validateLiftRatios({
      ...baseAnswers,
      meetDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    });
    expect(warnings.some((w) => w.includes("8 weeks"))).toBe(true);
  });
});
