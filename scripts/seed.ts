#!/usr/bin/env tsx
/**
 * Seed initial data: gym partners, concierge beta slots
 * Run: pnpm seed
 */
import { writeDb } from "../src/database";
import type { Database } from "../src/domain/types";

const seed: Database = {
  waitlist: [],
  intakes: [],
  programs: [],
  sessions: [],
  prs: [],
  gymPartners: [
    {
      id: "gym-1",
      name: "Flex Your Limits Warehouse",
      city: "Delhi",
      contactName: "Partner TBD",
      contactEmail: "delhi@partner.gym",
      referralCode: "STHIR-DEL-01",
      status: "signed",
      referrals: 0,
      notes: "18,000 sq ft warehouse gym — meet-day activation planned",
    },
    {
      id: "gym-2",
      name: "Kanhaji Strength Warehouse",
      city: "Delhi",
      contactName: "Partner TBD",
      contactEmail: "kanhaji@partner.gym",
      referralCode: "STHIR-DEL-02",
      status: "signed",
      referrals: 0,
    },
    {
      id: "gym-3",
      name: "Barbell Brigade Mumbai",
      city: "Mumbai",
      contactName: "Partner TBD",
      contactEmail: "mumbai@partner.gym",
      referralCode: "STHIR-MUM-01",
      status: "signed",
      referrals: 0,
    },
    {
      id: "gym-4",
      name: "South Bangalore Strength Co.",
      city: "Bangalore",
      contactName: "Partner TBD",
      contactEmail: "blr@partner.gym",
      referralCode: "STHIR-BLR-01",
      status: "prospect",
      referrals: 0,
    },
    {
      id: "gym-5",
      name: "Pune Iron Warehouse",
      city: "Pune",
      contactName: "Partner TBD",
      contactEmail: "pune@partner.gym",
      referralCode: "STHIR-PUN-01",
      status: "prospect",
      referrals: 0,
    },
  ],
  concierge: Array.from({ length: 10 }, (_, i) => ({
    id: `concierge-${i + 1}`,
    athleteName: `[Slot ${i + 1}] — assign athlete`,
    email: "",
    goal: "first_meet" as const,
    deliveredAt: "",
    week4CheckIn: false,
    npsScore: undefined,
    notes: "Manual Google Sheet delivery — track Week-4 adherence & NPS here",
  })),
  auditLogs: [],
};

writeDb(seed).then(() => {
  console.log("Seed complete:");
  console.log(`  ${seed.gymPartners.length} gym partners`);
  console.log(`  ${seed.concierge.length} concierge beta slots`);
});
