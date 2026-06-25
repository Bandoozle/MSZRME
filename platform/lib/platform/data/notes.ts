// Ported from mszrme-dealer-runtime.js — NOTES + initiatives seed data.

export type NoteType = "bullet" | "numbered";

export interface NoteItem {
  text: string;
  done: boolean;
}

export interface Note {
  id: number;
  title: string;
  type: NoteType;
  created: string;
  items: NoteItem[];
}

export type InitiativeStatus = "active" | "backlog" | "done";

export interface Initiative {
  id: string;
  title: string;
  status: InitiativeStatus;
  position: number;
  createdAt: number;
  completedAt?: number;
}

export const SEED_NOTES: Note[] = [
  {
    id: 1,
    title: "Q2 Install Targets",
    type: "numbered",
    created: "May 17",
    items: [
      { text: "Follow up 12 pending estimates", done: true },
      { text: "Schedule 3 heat pump installs", done: false },
      { text: "Submit grant paperwork — CleanBC", done: false },
      { text: "Review equipment inventory", done: false },
    ],
  },
  {
    id: 2,
    title: "Service Call Reminders",
    type: "bullet",
    created: "May 16",
    items: [
      { text: "North Van — thermostat acting up", done: true },
      { text: "Burnaby townhouse — annual maintenance", done: false },
      { text: "Richmond — callback re: noise complaint", done: false },
    ],
  },
];

export function seedInitiatives(): Initiative[] {
  const now = Date.now();
  return [
    {
      id: "i1",
      title: "Hit 65% closing ratio for 3 months running",
      status: "active",
      position: 0,
      createdAt: now - 30 * 86400000,
    },
    {
      id: "i2",
      title: "Build a documented dispatch SOP",
      status: "active",
      position: 1,
      createdAt: now - 25 * 86400000,
    },
    {
      id: "i3",
      title: "Reach 60 active maintenance agreements",
      status: "active",
      position: 2,
      createdAt: now - 20 * 86400000,
    },
    {
      id: "i4",
      title: "Hire a sales coordinator",
      status: "backlog",
      position: 3,
      createdAt: now - 15 * 86400000,
    },
    {
      id: "i5",
      title: "Rebuild website with conversion focus",
      status: "backlog",
      position: 4,
      createdAt: now - 12 * 86400000,
    },
    {
      id: "i6",
      title: "Launch financing partner referral program",
      status: "backlog",
      position: 5,
      createdAt: now - 10 * 86400000,
    },
    {
      id: "i7",
      title: "Establish quarterly P&L review with accountant",
      status: "backlog",
      position: 6,
      createdAt: now - 8 * 86400000,
    },
    {
      id: "i8",
      title: "Implement Net Promoter survey on every job",
      status: "backlog",
      position: 7,
      createdAt: now - 5 * 86400000,
    },
    {
      id: "i9",
      title: "Standardize technician training onboarding",
      status: "done",
      position: 8,
      createdAt: now - 90 * 86400000,
      completedAt: now - 14 * 86400000,
    },
  ];
}

export const INITIATIVES_STORAGE_KEY = "mszrme.initiatives";
export const NOTES_STORAGE_KEY = "mszrme.notes";
export const NOTES_NEXT_ID_KEY = "mszrme.notes_next_id";
