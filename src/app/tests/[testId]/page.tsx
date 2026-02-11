"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ROLES } from "@/lib/roles";

type Question = {
  id: string;
  title: string;
  skill: string;
  type: string;
  timeMinutes: number;
  description: string;
};

type SectionState = {
  id: string;
  title: string;
  minutes: number;
  questions: Question[];
};

const QUESTION_TYPES = [
  "Project (Generated)",
  "Multiple Choice",
  "Short Answer",
  "Coding",
];

const QUESTION_LIBRARY: Question[] = [
  {
    id: "q-gdt-stackup",
    title: "Interpret a feature control frame and propose a datum scheme",
    skill: "GD&T",
    type: "Short Answer",
    timeMinutes: 25,
    description:
      "Given a drawing snippet, explain the meaning of the feature control frame, identify functional datums, and suggest a tolerance strategy.",
  },
  {
    id: "q-dfm-injection",
    title: "DFM review: injection-molded enclosure draft + ribs",
    skill: "DFM/DFA",
    type: "Project (Generated)",
    timeMinutes: 45,
    description:
      "Review a concept enclosure and list DFM improvements (draft, wall thickness, ribs, bosses, gate locations) with reasoning.",
  },
  {
    id: "q-fea-setup",
    title: "FEA setup: boundary conditions and mesh tradeoffs",
    skill: "FEA",
    type: "Short Answer",
    timeMinutes: 30,
    description:
      "Explain how you'd choose constraints, loads, and mesh density for a bracket under combined loading. Call out common modeling pitfalls.",
  },
  {
    id: "q-power-buck",
    title: "Buck converter selection: inductor, ripple, and stability",
    skill: "Power",
    type: "Short Answer",
    timeMinutes: 30,
    description:
      "Given an input/output requirement and load step, select key components and discuss layout considerations for stability and EMI.",
  },
  {
    id: "q-emc-layout",
    title: "EMC layout review: return paths and stitching",
    skill: "EMI/EMC",
    type: "Multiple Choice",
    timeMinutes: 20,
    description:
      "Identify the best layout fixes for a noisy board: return paths, split planes, stitching vias, and connector filtering.",
  },
  {
    id: "q-debug-oscilloscope",
    title: "Debug a failing I2C bus with a scope capture",
    skill: "Debugging",
    type: "Project (Generated)",
    timeMinutes: 35,
    description:
      "Diagnose common I2C issues (pull-ups, rise times, arbitration, clock stretching) and propose a test plan to isolate the root cause.",
  },
  {
    id: "q-rtos-priority",
    title: "RTOS scheduling: priority inversion and mitigation",
    skill: "RTOS",
    type: "Short Answer",
    timeMinutes: 25,
    description:
      "Explain priority inversion with an example and recommend mitigation strategies (priority inheritance, ceilings, redesign).",
  },
  {
    id: "q-c-pointers",
    title: "C pointers and memory: identify UB and fix it",
    skill: "C/C++",
    type: "Coding",
    timeMinutes: 35,
    description:
      "Given a small C snippet, identify undefined behavior, lifetime bugs, and suggest safer patterns while keeping performance constraints in mind.",
  },
  {
    id: "q-peripherals-spi",
    title: "SPI driver bring-up: timing, mode, and error cases",
    skill: "SPI/I2C/UART",
    type: "Project (Generated)",
    timeMinutes: 30,
    description:
      "Describe how you would bring up an SPI peripheral: modes, clock polarity/phase, chip-select timing, and validating transfers.",
  },
  {
    id: "q-plc-io",
    title: "Industrial I/O: choose sensors and wire a safety loop",
    skill: "PLC",
    type: "Short Answer",
    timeMinutes: 25,
    description:
      "Choose between PNP/NPN sensors, specify wiring, and describe how you'd validate a basic E-stop / safety chain.",
  },
];

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPencil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.9 3.6a2 2 0 0 1 2.8 2.8l-9.2 9.2-3.6.8.8-3.6 9.2-9.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 5 15 8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconInfo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 9v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 6.25h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 10h.01M10 10h.01M16 10h.01"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCog(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.2 3.2 10 2l1.8 1.2.9 2.1 2.2.6.6 2.2 2.1.9L18 10l-1.2 1.8.9 2.1-.9 2.1-2.2.6-.6 2.2-2.2.6-.9 2.1L10 18l-1.8-1.2-.9-2.1-2.2-.6-.6-2.2-2.1-.9L2 10l1.2-1.8-.9-2.1.9-2.1 2.2-.6.6-2.2 2.2-.6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 4.5h4M5.5 6.5h9M8 6.5v9m4-9v9M6.8 6.5l.6 10a1.5 1.5 0 0 0 1.5 1.4h2.2a1.5 1.5 0 0 0 1.5-1.4l.6-10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 4.5a2.5 2.5 0 0 1 5 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ModalShell({
  title,
  open,
  onClose,
  children,
}: React.PropsWithChildren<{
  title: string;
  open: boolean;
  onClose: () => void;
}>) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="absolute left-1/2 top-1/2 w-[min(860px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="text-lg font-semibold text-zinc-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-50"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Tab({
  active,
  children,
}: React.PropsWithChildren<{ active?: boolean }>) {
  return (
    <button
      type="button"
      className={[
        "relative px-1 pb-3 text-sm font-medium transition",
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-corePurple" />
      ) : null}
    </button>
  );
}

export default function TestDetailsPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";
  const router = useRouter();
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [detailsModal, setDetailsModal] = React.useState<Question | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [published, setPublished] = React.useState(false);

  const [skillQuery, setSkillQuery] = React.useState("");
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = React.useState<
    string | null
  >(null);
  const [selectedLibraryQuestionId, setSelectedLibraryQuestionId] =
    React.useState<string | null>(null);
  const [targetSectionId, setTargetSectionId] = React.useState<string | null>(
    null,
  );

  const [inviteInput, setInviteInput] = React.useState("");
  const [inviteEmails, setInviteEmails] = React.useState<string[]>([]);
  const csvInputRef = React.useRef<HTMLInputElement | null>(null);
  const [lastCsvImport, setLastCsvImport] = React.useState<{
    fileName: string;
    imported: number;
  } | null>(null);

  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const invitesStorageKey = React.useMemo(() => `invites:${testId}`, [testId]);

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(invitesStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const emails = parsed
          .map((x) => (typeof x === "string" ? x : ""))
          .map((x) => x.trim())
          .filter(Boolean);
        setInviteEmails(emails);
      }
    } catch {
      // ignore
    }
  }, [invitesStorageKey, testId]);

  const [sections, setSections] = React.useState<SectionState[]>(() => {
    const base = role?.preview.sections ?? [];
    const total = role?.preview.durationMinutes ?? 0;
    return base.map((s, idx) => {
      const minutes =
        s.minutes ?? Math.max(30, Math.round(total * (idx === 0 ? 0.85 : 0.5)));
      const q: Question = {
        id: `seed-${idx}`,
        title: `${s.title}: Practical system question`,
        skill: s.title.replace(/\s*\(.*?\)\s*/g, "").trim(),
        type: "Project (Generated)",
        timeMinutes: minutes,
        description:
          "Mock question content. In a real app this would show the full prompt, constraints, and evaluation rubric.",
      };
      return {
        id: `section-${idx}`,
        title: s.title,
        minutes,
        questions: [q],
      };
    });
  });

  React.useEffect(() => {
    const base = role?.preview.sections ?? [];
    const total = role?.preview.durationMinutes ?? 0;
    setSections(
      base.map((s, idx) => {
        const minutes =
          s.minutes ??
          Math.max(30, Math.round(total * (idx === 0 ? 0.85 : 0.5)));
        const q: Question = {
          id: `seed-${idx}`,
          title: `${s.title}: Practical system question`,
          skill: s.title.replace(/\s*\(.*?\)\s*/g, "").trim(),
          type: "Project (Generated)",
          timeMinutes: minutes,
          description:
            "Mock question content. In a real app this would show the full prompt, constraints, and evaluation rubric.",
        };
        return {
          id: `section-${idx}`,
          title: s.title,
          minutes,
          questions: [q],
        };
      }),
    );
    setOpenSection(null);
  }, [role]);

  const allSkillOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of ROLES) for (const s of r.skills) set.add(s);
    for (const q of QUESTION_LIBRARY) set.add(q.skill);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredSkillOptions = React.useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return allSkillOptions.slice(0, 8);
    return allSkillOptions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allSkillOptions, skillQuery]);

  const filteredLibraryQuestions = React.useMemo(() => {
    const sq = (selectedSkill ?? "").toLowerCase();
    const tq = (selectedQuestionType ?? "").toLowerCase();
    return QUESTION_LIBRARY.filter((q) => {
      const okSkill = sq ? q.skill.toLowerCase() === sq : true;
      const okType = tq ? q.type.toLowerCase() === tq : true;
      return okSkill && okType;
    });
  }, [selectedSkill, selectedQuestionType]);

  function openAddModal() {
    setAddModalOpen(true);
    setSkillQuery("");
    setSelectedSkill(null);
    setSelectedQuestionType(null);
    setSelectedLibraryQuestionId(null);
    const fallbackSectionId = openSection ?? sections[0]?.id ?? null;
    setTargetSectionId(fallbackSectionId);
  }

  function parseEmails(value: string) {
    return value
      .split(/[\n,;\t ]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function parseCsvLine(line: string) {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  }

  function extractEmailsFromCsv(csvText: string) {
    const text = csvText.replace(/^\uFEFF/, "").trim();
    if (!text) return [];
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    const headerCells = parseCsvLine(lines[0]).map((c) => c.toLowerCase());
    const emailIdx = headerCells.findIndex((c) => c.includes("email"));

    const startRow = emailIdx >= 0 ? 1 : 0;
    const idx = emailIdx >= 0 ? emailIdx : 0;

    const emails: string[] = [];
    for (let i = startRow; i < lines.length; i++) {
      const cells = parseCsvLine(lines[i]);
      const candidate = (cells[idx] ?? "").trim();
      if (candidate) emails.push(candidate);
    }
    return emails;
  }

  function isValidEmail(email: string) {
    // simple but effective enough for UI validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function addInvitesFromInput() {
    const candidates = parseEmails(inviteInput);
    if (candidates.length === 0) return;
    setInviteEmails((prev) => {
      const set = new Set(prev.map((e) => e.toLowerCase()));
      for (const c of candidates) {
        if (isValidEmail(c)) set.add(c.toLowerCase());
      }
      const next = Array.from(set);
      try {
        window.localStorage.setItem(invitesStorageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setInviteInput("");
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-700">
            Tests
          </Link>
          <IconChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="truncate text-zinc-600">
            {role?.preview.testTitle ?? "Hiring Test"}
          </span>
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
                {role?.preview.testTitle ?? "Hiring Test"}
              </h1>
              <button
                type="button"
                aria-label="Edit title"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              >
                <IconPencil className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Share removed per request */}
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Try Test
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-corePurple px-3 text-sm font-semibold text-white hover:bg-violet"
              onClick={() => {
                setPublished(true);
                setInviteModalOpen(true);
              }}
            >
              {published ? "Published" : "Publish"}
            </button>
            <button
              type="button"
              aria-label="More"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              <IconDots className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex items-end gap-5">
            <Tab active>Questions</Tab>
            <button
              type="button"
              onClick={() => router.push(`/tests/${testId}/candidates`)}
              className="relative px-1 pb-3 text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              Candidates
            </button>
            {/* Insights removed per request */}
            <Tab>Settings</Tab>
          </div>
        </div>

        <div className="mt-6">
          {/* Right-side "Role" box removed per request */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <span className="text-zinc-700">Test duration:</span>
                <span className="font-semibold">
                  {role?.preview.durationMinutes ?? 0} mins
                </span>
                <button
                  type="button"
                  aria-label="Edit duration"
                  className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                >
                  <IconPencil className="h-4 w-4" />
                </button>
                <span className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400">
                  <IconInfo className="h-4 w-4" />
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-500">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" />
                Draft
              </span>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">
                  Sections ({sections.length})
                </div>
                <button
                  type="button"
                    onClick={openAddModal}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-corePurple hover:bg-softLavender"
                >
                  <span>Add New</span>
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((s) => {
                  const isOpen = openSection === s.id;
                  const durationMins = s.minutes;

                  return (
                    <div
                      key={s.id}
                      className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            aria-label="Expand"
                            aria-expanded={isOpen}
                            onClick={() =>
                              setOpenSection((prev) =>
                                prev === s.id ? null : s.id,
                              )
                            }
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50"
                          >
                            <span
                              className={[
                                "text-lg leading-none transition-transform",
                                isOpen ? "rotate-90" : "",
                              ].join(" ")}
                            >
                              ›
                            </span>
                          </button>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-zinc-900">
                              {s.title}
                            </div>
                            <div className="truncate text-xs text-zinc-500">
                              Picks all questions
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-xs font-medium text-zinc-500">
                            <span className="mr-1 inline-block align-middle">
                              ⏱
                            </span>
                            {durationMins} mins
                          </div>
                          <button
                            type="button"
                            aria-label="Section settings"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                          >
                            <IconCog className="h-4.5 w-4.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete section"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                          >
                            <IconTrash className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      {isOpen ? (
                        <div className="border-t border-zinc-200 bg-zinc-50/30 px-4 py-4">
                          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                            <div className="grid grid-cols-[1.7fr_1fr_0.7fr_0.9fr_0.6fr] gap-3 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-600">
                              <div>Questions ({s.questions.length})</div>
                              <div>Type</div>
                              <div>Time</div>
                              <div>Skills</div>
                              <div className="text-right">Action</div>
                            </div>

                            <div className="divide-y divide-zinc-100">
                              {s.questions.map((q) => (
                                <div
                                  key={q.id}
                                  className="grid grid-cols-[1.7fr_1fr_0.7fr_0.9fr_0.6fr] gap-3 px-4 py-3 text-xs text-zinc-700"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-zinc-300"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setDetailsModal(q)}
                                      className="min-w-0 truncate text-left font-medium text-zinc-800 hover:underline"
                                    >
                                      {q.title}
                                    </button>
                                  </div>
                                  <div className="text-zinc-600">{q.type}</div>
                                  <div className="text-zinc-600">
                                    {q.timeMinutes} mins
                                  </div>
                                  <div className="text-zinc-600">{q.skill}</div>
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      aria-label="Analytics"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                                    >
                                      <span className="text-sm">▮▮</span>
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="More"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                                    >
                                      <IconDots className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalShell
        title="Add Skill-Based Questions"
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      >
        <div className="grid gap-5">
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Skill <span className="text-red-500">*</span>
            </div>
            <div className="relative mt-2">
              <input
                value={selectedSkill ?? skillQuery}
                onChange={(e) => {
                  setSelectedSkill(null);
                  setSkillQuery(e.target.value);
                  setSelectedLibraryQuestionId(null);
                }}
                placeholder="Choose a skill"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <span className="text-lg leading-none">⌄</span>
              </span>

              {!selectedSkill ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                  {filteredSkillOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-zinc-500">
                      No skills found.
                    </div>
                  ) : (
                    filteredSkillOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSelectedSkill(s);
                          setSkillQuery("");
                          setSelectedLibraryQuestionId(null);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50"
                      >
                        <span>{s}</span>
                        <span className="text-xs text-zinc-400">Skill</span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-zinc-800">
              Question type <span className="text-red-500">*</span>
            </div>
            <div className="relative mt-2">
              <select
                value={selectedQuestionType ?? ""}
                onChange={(e) => {
                  setSelectedQuestionType(e.target.value || null);
                  setSelectedLibraryQuestionId(null);
                }}
                disabled={!selectedSkill}
                className={[
                  "h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm outline-none",
                  selectedSkill
                    ? "border-zinc-200 bg-white text-zinc-900 focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                    : "border-zinc-200 bg-zinc-100 text-zinc-500",
                ].join(" ")}
              >
                <option value="">Pick a question type</option>
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <span className="text-lg leading-none">⌄</span>
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-4">
            <div className="text-sm font-semibold text-zinc-900">
              Library results
            </div>
            <div className="mt-3 space-y-2">
              {!selectedSkill ? (
                <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500">
                  Select a skill to see matching questions.
                </div>
              ) : filteredLibraryQuestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500">
                  No questions found for that skill/type.
                </div>
              ) : (
                filteredLibraryQuestions.slice(0, 6).map((q) => {
                  const selected = selectedLibraryQuestionId === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedLibraryQuestionId(q.id)}
                      className={[
                        "w-full rounded-xl border p-3 text-left transition",
                        selected
                          ? "border-violet bg-softLavender/80 shadow-[0_0_0_3px_rgba(89,76,233,0.15)]"
                          : "border-zinc-200 bg-white hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold text-zinc-900">
                        {q.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-600">
                        {q.type} · {q.timeMinutes} mins · {q.skill}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Target section{" "}
              <span className="font-medium text-zinc-700">
                {sections.find((s) => s.id === targetSectionId)?.title ??
                  "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={targetSectionId ?? ""}
                onChange={(e) => setTargetSectionId(e.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedLibraryQuestionId || !targetSectionId}
                onClick={() => {
                  if (!selectedLibraryQuestionId || !targetSectionId) return;
                  const q =
                    QUESTION_LIBRARY.find((x) => x.id === selectedLibraryQuestionId) ??
                    null;
                  if (!q) return;
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id !== targetSectionId
                        ? s
                        : {
                            ...s,
                            questions: [
                              ...s.questions,
                              {
                                ...q,
                                id: `${q.id}-${Date.now()}`,
                              },
                            ],
                          },
                    ),
                  );
                  setOpenSection(targetSectionId);
                  setAddModalOpen(false);
                }}
                className={[
                  "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold",
                  !selectedLibraryQuestionId || !targetSectionId
                    ? "bg-zinc-200 text-zinc-500"
                    : "bg-corePurple text-white hover:bg-violet",
                ].join(" ")}
              >
                Add to test
              </button>
            </div>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        title="Question details"
        open={!!detailsModal}
        onClose={() => setDetailsModal(null)}
      >
        {detailsModal ? (
          <div className="space-y-3">
            <div className="text-base font-semibold text-zinc-900">
              {detailsModal.title}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {detailsModal.skill}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {detailsModal.type}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {detailsModal.timeMinutes} mins
              </span>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              {detailsModal.description}
            </div>
          </div>
        ) : null}
      </ModalShell>

      <ModalShell
        title="Invite candidates"
        open={inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
          setLastCsvImport(null);
        }}
      >
        <div className="grid gap-5">
          <div className="text-sm text-zinc-600">
            Add candidate emails to invite them to{" "}
            <span className="font-medium text-zinc-800">
              {role?.preview.testTitle ?? "this test"}
            </span>
            .
          </div>

          <div>
            <div className="text-sm font-medium text-zinc-800">
              Candidate emails <span className="text-red-500">*</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInvitesFromInput();
                  }
                }}
                placeholder="e.g. alex@company.com, priya@company.com"
                className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              />
              <button
                type="button"
                onClick={addInvitesFromInput}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Add
              </button>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Tip: paste multiple emails separated by commas or new lines.
            </div>

            <input
              ref={csvInputRef}
              type="file"
              className="hidden"
              accept=".csv,text/csv"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                if (!file) return;
                const csv = await file.text();
                const candidates = extractEmailsFromCsv(csv);
                setInviteEmails((prev) => {
                  const set = new Set(prev.map((x) => x.toLowerCase()));
                  let added = 0;
                  for (const c of candidates) {
                    const norm = c.trim().toLowerCase();
                    if (!norm) continue;
                    if (!isValidEmail(norm)) continue;
                    if (set.has(norm)) continue;
                    set.add(norm);
                    added++;
                  }
                  setLastCsvImport({ fileName: file.name, imported: added });
                  return Array.from(set);
                });
                // allow re-uploading the same file
                e.currentTarget.value = "";
              }}
            />

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Upload CSV
              </button>
              <div className="text-xs text-zinc-500">
                CSV can include an <span className="font-medium">email</span>{" "}
                column (header optional).
              </div>
            </div>
            {lastCsvImport ? (
              <div className="mt-2 text-xs text-zinc-600">
                Imported{" "}
                <span className="font-semibold">{lastCsvImport.imported}</span>{" "}
                from{" "}
                <span className="font-medium">{lastCsvImport.fileName}</span>.
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Recipients ({inviteEmails.length})
            </div>
            {inviteEmails.length === 0 ? (
              <div className="text-sm text-zinc-500">
                No recipients added yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {inviteEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800"
                  >
                    <span className="max-w-[340px] truncate">{email}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${email}`}
                      onClick={() =>
                        setInviteEmails((prev) =>
                          prev.filter((e) => e !== email),
                        )
                      }
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 hover:bg-white hover:text-zinc-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={inviteEmails.length === 0}
              onClick={() => {
                // mock: no backend yet; persist to local storage and navigate
                try {
                  window.localStorage.setItem(
                    invitesStorageKey,
                    JSON.stringify(inviteEmails),
                  );
                } catch {
                  // ignore
                }
                setInviteModalOpen(false);
                router.push(`/tests/${testId}/candidates`);
              }}
              className={[
                "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold",
                inviteEmails.length === 0
                  ? "bg-zinc-200 text-zinc-500"
                  : "bg-corePurple text-white hover:bg-violet",
              ].join(" ")}
            >
              Send invites
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}

