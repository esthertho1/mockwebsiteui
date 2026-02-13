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
  options?: string[];
};

type SectionState = {
  id: string;
  title: string;
  minutes: number;
  questions: Question[];
};

function seedQuestionDescription(sectionTitle: string) {
  const base = sectionTitle.replace(/\s+/g, " ").trim().toLowerCase();
  if (base.includes("schematic review")) {
    return [
      "You’re given a mixed‑signal board schematic (power + MCU + sensors). Walk through your schematic review process and flag the top risks you’d want addressed before layout.",
      "",
      "What to cover (mock):",
      "- Power path: protections, inrush/current limits, compensation/stability, decoupling strategy",
      "- Interfaces: I2C/SPI pull-ups/levels, ESD/TVS, connector considerations",
      "- Grounding/return paths: split planes, analog/digital partitioning, reference integrity",
      "- Clocks/high‑speed: routing constraints, termination needs, isolation/noise coupling",
      "",
      "Deliverable:",
      "- List 5 specific risks and propose 3 concrete schematic changes (with rationale).",
    ].join("\n");
  }
  if (base.includes("cad") && base.includes("drawing")) {
    return [
      "You’re given a simple bracket assembly (2–3 parts) with a mating interface and a fastener pattern. Produce manufacturing-ready drawings and call out what matters for a supplier to build it correctly.",
      "",
      "What to include (mock):",
      "- View strategy: orthographic + section/detail views where needed",
      "- Critical dimensions and datum scheme (how you chose them)",
      "- Hole callouts/threads and tolerances appropriate for the process",
      "- Notes: finish, deburr, material/heat treat, inspection-critical features",
      "",
      "Deliverable:",
      "- List 8–12 specific annotations/callouts you would add and why.",
    ].join("\n");
  }
  return "Mock question content. In a real app this would show the full prompt, constraints, and evaluation rubric.";
}

const QUESTION_TYPES = [
  "Project (Generated)",
  "Multiple Choice",
  "Short Answer",
  "Coding",
  "Voice",
  "Simulation",
];

const CUSTOM_QUESTION_TYPES = ["Multiple Choice", "Short Answer"];

const QUESTION_LIBRARY: Question[] = [
  {
    id: "q-cad-dimensioning",
    title: "Create a fully constrained sketch with proper dimensions",
    skill: "CAD",
    type: "Project (Generated)",
    timeMinutes: 30,
    description:
      "Given a part outline, dimension the sketch using best practices for fully defining geometry. Explain your datum selection and constraint strategy.",
  },
  {
    id: "q-cad-assembly",
    title: "Design an assembly with proper mates and motion",
    skill: "CAD",
    type: "Short Answer",
    timeMinutes: 25,
    description:
      "Describe how you would mate components in a multi-part assembly to achieve the intended motion. Include considerations for in-context design and external references.",
  },
  {
    id: "q-cad-drawings",
    title: "Generate production-ready drawing views and annotations",
    skill: "CAD",
    type: "Multiple Choice",
    timeMinutes: 20,
    description:
      "A drawing needs orthographic views, section views, and detail callouts. Which view type is most appropriate for showing internal features of a hollow cylinder?",
  },
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

function IconMultipleChoice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3.5"
        y="4.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle
        cx="6"
        cy="7"
        r="0.75"
        fill="currentColor"
      />
      <rect
        x="3.5"
        y="10.5"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M11 7h5M11 13h5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconVoice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 2v11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5.5v5a3.5 3.5 0 0 0 7 0v-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 9a6 6 0 0 0 12 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10 14v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSimulation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6v8l6 3 6-3V6l-6-3-6 3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M4 6l6 3 6-3M10 9v7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShortAnswer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6h12M4 10h9M4 14h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCoding(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 7l-3 3 3 3M14 7l3 3-3 3M12 5l-4 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProject(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect
        x="4"
        y="4"
        width="12"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7 8h6M7 11h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 5v10l8-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPreview(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M17.5 10c-1.5 3.5-4 5.5-7.5 5.5S4 13.5 2.5 10 4 4.5 7.5 4.5 10 6.5 11.5 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuestionTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const t = type.toLowerCase();
  if (t.includes("multiple choice")) return <IconMultipleChoice className={className} />;
  if (t.includes("voice")) return <IconVoice className={className} />;
  if (t.includes("simulation")) return <IconSimulation className={className} />;
  if (t.includes("short answer")) return <IconShortAnswer className={className} />;
  if (t.includes("coding")) return <IconCoding className={className} />;
  if (t.includes("project")) return <IconProject className={className} />;
  return null;
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
        "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
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
  const [addDropdownOpen, setAddDropdownOpen] = React.useState(false);
  const [sectionLibraryOpen, setSectionLibraryOpen] = React.useState<
    string | null
  >(null);
  const [sectionLibraryQuery, setSectionLibraryQuery] = React.useState("");
  const [sectionLibrarySkill, setSectionLibrarySkill] = React.useState<
    string | null
  >(null);
  const [customQuestionModalOpen, setCustomQuestionModalOpen] =
    React.useState(false);
  const [customQuestion, setCustomQuestion] = React.useState({
    title: "",
    skills: [] as string[],
    type: "Short Answer" as "Multiple Choice" | "Short Answer",
    timeMinutes: 15,
    description: "",
    options: ["", ""] as string[],
  });
  const [customSkillQuery, setCustomSkillQuery] = React.useState("");
  const [detailsModal, setDetailsModal] = React.useState<Question | null>(null);
  const [questionMenuOpen, setQuestionMenuOpen] = React.useState<string | null>(
    null,
  );
  const [replaceTargetQuestionId, setReplaceTargetQuestionId] = React.useState<
    string | null
  >(null);
  const [published, setPublished] = React.useState(false);

  const [skillQuery, setSkillQuery] = React.useState("");
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = React.useState<
    string | null
  >(null);

  const [customDurationMinutes, setCustomDurationMinutes] = React.useState<
    number | null
  >(null);
  const [durationEditMode, setDurationEditMode] = React.useState(false);
  const [durationInputValue, setDurationInputValue] = React.useState("");

  const [savedFeedback, setSavedFeedback] = React.useState(false);

  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const invitesStorageKey = React.useMemo(() => `invites:${testId}`, [testId]);
  const testDurationStorageKey = React.useMemo(
    () => `test-duration:${testId}`,
    [testId],
  );
  const testSavedStorageKey = React.useMemo(
    () => `test-saved:${testId}`,
    [testId],
  );

  const [hasBeenSaved, setHasBeenSaved] = React.useState(false);
  React.useEffect(() => {
    if (!testId) return;
    try {
      if (window.localStorage.getItem(testSavedStorageKey) === "1") {
        setHasBeenSaved(true);
      }
    } catch {
      // ignore
    }
  }, [testId, testSavedStorageKey]);

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(testDurationStorageKey);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n > 0) {
          setCustomDurationMinutes(n);
        }
      }
    } catch {
      // ignore
    }
  }, [testId, testDurationStorageKey]);

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
        description: seedQuestionDescription(s.title),
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
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(`test-sections:${testId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
          setOpenSection(null);
          return;
        }
      }
    } catch {
      // ignore
    }
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
          description: seedQuestionDescription(s.title),
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
  }, [role, testId]);

  const sectionsStorageKey = React.useMemo(
    () => `test-sections:${testId}`,
    [testId],
  );

  function saveTest() {
    if (!testId) return;
    try {
      window.localStorage.setItem(
        sectionsStorageKey,
        JSON.stringify(sections),
      );
      const duration =
        customDurationMinutes ??
        sections.reduce(
          (acc, s) =>
            acc + s.questions.reduce((a, q) => a + q.timeMinutes, 0),
          0,
        );
      window.localStorage.setItem(testDurationStorageKey, String(duration));
      window.localStorage.setItem(testSavedStorageKey, "1");
      setHasBeenSaved(true);
      setSavedFeedback(true);
      window.setTimeout(() => setSavedFeedback(false), 2000);
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    if (!testId || sections.length === 0) return;
    try {
      window.localStorage.setItem(
        sectionsStorageKey,
        JSON.stringify(sections),
      );
    } catch {
      // ignore
    }
  }, [sections, sectionsStorageKey, testId]);

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

  const filteredCustomSkills = React.useMemo(() => {
    const q = customSkillQuery.trim().toLowerCase();
    const selected = customQuestion.skills;
    return allSkillOptions
      .filter(
        (s) =>
          (!q || s.toLowerCase().includes(q)) && !selected.includes(s),
      )
      .slice(0, 8);
  }, [allSkillOptions, customSkillQuery, customQuestion.skills]);

  const sectionLibraryQuestions = React.useMemo(() => {
    const sq = sectionLibraryQuery.trim().toLowerCase();
    const skill = sectionLibrarySkill?.toLowerCase() ?? "";
    return QUESTION_LIBRARY.filter((q) => {
      const qSkill = q.skill.toLowerCase();
      const okSkill = skill
        ? qSkill === skill || qSkill.includes(skill) || skill.includes(qSkill)
        : true;
      const okSearch =
        !sq ||
        q.title.toLowerCase().includes(sq) ||
        q.description.toLowerCase().includes(sq);
      return okSkill && okSearch;
    });
  }, [sectionLibraryQuery, sectionLibrarySkill]);

  function openAddModal() {
    setAddModalOpen(true);
    setSkillQuery("");
    setSelectedSkill(null);
    setSelectedQuestionType(null);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/tests" className="hover:text-zinc-700">
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
            {hasBeenSaved ? (
              <>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Share
                </button>
                <Link
                  href={`/tests/${testId}/preview`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Try Test
                </Link>
                <Link
                  href={`/tests/${testId}/candidates?invite=1`}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-corePurple px-3 text-sm font-semibold text-white hover:bg-violet"
                >
                  + Invite
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    saveTest();
                    try {
                      const raw = window.localStorage.getItem(invitesStorageKey);
                      const parsed = raw ? JSON.parse(raw) : [];
                      const hasExisting = Array.isArray(parsed) && parsed.some((x: unknown) => typeof x === "string" && String(x).trim().length > 0);
                      router.push(
                        `/tests/${testId}/candidates${!hasExisting ? "?invite=1" : ""}`,
                      );
                    } catch {
                      router.push(`/tests/${testId}/candidates?invite=1`);
                    }
                  }}
                  className={[
                    "inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition",
                    savedFeedback
                      ? "border border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "bg-corePurple text-white hover:bg-violet",
                  ].join(" ")}
                >
                  {savedFeedback ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  aria-label="More"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                >
                  <IconDots className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex gap-6">
            <Tab active>Questions</Tab>
            <Link
              href={`/tests/${testId}/candidates`}
              className="relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              Candidates
            </Link>
            <Link
              href={`/tests/${testId}/insights`}
              className="relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              Insights
            </Link>
            <Link
              href={`/tests/${testId}/settings`}
              className="relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              Settings
            </Link>
          </div>
        </div>

        <div className="mt-6">
          {/* Right-side "Role" box removed per request */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <span className="text-zinc-700">Test duration:</span>
                  {durationEditMode ? (
                    <>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={durationInputValue}
                        onChange={(e) =>
                          setDurationInputValue(e.target.value.replace(/\D/g, ""))
                        }
                        onBlur={() => {
                          const n = parseInt(durationInputValue, 10);
                          if (!Number.isNaN(n) && n > 0) {
                            setCustomDurationMinutes(n);
                          }
                          setDurationEditMode(false);
                          setDurationInputValue("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const n = parseInt(durationInputValue, 10);
                            if (!Number.isNaN(n) && n > 0) {
                              setCustomDurationMinutes(n);
                            }
                            setDurationEditMode(false);
                            setDurationInputValue("");
                          } else if (e.key === "Escape") {
                            setDurationEditMode(false);
                            setDurationInputValue("");
                          }
                        }}
                        autoFocus
                        className="h-8 w-20 rounded-md border border-zinc-300 px-2 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200"
                      />
                      <span className="text-zinc-500">mins</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {(customDurationMinutes ??
                          sections.reduce(
                            (acc, s) =>
                              acc +
                              s.questions.reduce(
                                (a, q) => a + q.timeMinutes,
                                0,
                              ),
                            0,
                          ))}{" "}
                        mins
                      </span>
                      <button
                        type="button"
                        aria-label="Edit duration"
                        onClick={() => {
                          const recommended = sections.reduce(
                            (acc, s) =>
                              acc +
                              s.questions.reduce(
                                (a, q) => a + q.timeMinutes,
                                0,
                              ),
                            0,
                          );
                          setDurationInputValue(
                            String(customDurationMinutes ?? recommended),
                          );
                          setDurationEditMode(true);
                        }}
                        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                      >
                        <IconPencil className="h-4 w-4" />
                      </button>
                      <span
                        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400"
                        title="Recommended duration based on question times"
                      >
                        <IconInfo className="h-4 w-4" />
                      </span>
                    </>
                  )}
                </div>
                {(() => {
                  const recommended = sections.reduce(
                    (acc, s) =>
                      acc +
                      s.questions.reduce((a, q) => a + q.timeMinutes, 0),
                    0,
                  );
                  if (
                    customDurationMinutes !== null &&
                    customDurationMinutes < recommended
                  ) {
                    return (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                        Duration is below recommended ({recommended} mins based
                        on questions). Candidates may not have enough time.
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/tests/${testId}/preview`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <IconPlay className="h-3.5 w-3.5" />
                  Preview
                </Link>
                <span className="text-xs font-medium text-zinc-500">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" />
                  Draft
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900">
                  Sections ({sections.length})
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setAddDropdownOpen((prev) => !prev)
                    }
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-corePurple hover:bg-softLavender"
                  >
                    <span>Add New</span>
                    <span
                      className={[
                        "text-lg leading-none transition-transform",
                        addDropdownOpen ? "rotate-45" : "",
                      ].join(" ")}
                    >
                      +
                    </span>
                  </button>
                  {addDropdownOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label="Close dropdown"
                        className="fixed inset-0 z-10"
                        onClick={() => setAddDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setAddDropdownOpen(false);
                            openAddModal();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                        >
                          From library
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddDropdownOpen(false);
                            setCustomQuestionModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                        >
                          Custom question
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                {sections.map((s) => {
                  const isOpen = openSection === s.id;
                  const sectionMins = s.questions.reduce(
                    (acc, q) => acc + q.timeMinutes,
                    0,
                  );
                  const levelMatch = s.title.match(/\(([^)]+)\)\s*$/);
                  const sectionLevel = levelMatch?.[1] ?? null;
                  const baseSectionTitle = sectionLevel
                    ? s.title.replace(/\s*\([^)]+\)\s*$/, "").trim()
                    : s.title;

                  return (
                    <div
                      key={s.id}
                      className="overflow-visible rounded-xl border border-zinc-200 bg-white"
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
                              {baseSectionTitle}
                            </div>
                            <div className="truncate text-xs text-zinc-500">
                              Picks all questions
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <span>{sectionMins} mins</span>
                            {sectionLevel ? (
                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                                {sectionLevel}
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            aria-label="Section settings"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                          >
                            <IconCog className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>

                      {isOpen ? (
                        <div className="border-t border-zinc-200 bg-zinc-50/30 px-4 py-4">
                          <div className="overflow-visible rounded-xl border border-zinc-200 bg-white">
                            <div className="grid grid-cols-[1.7fr_1fr_0.7fr_0.8fr_0.9fr_0.5fr] gap-3 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-600">
                              <div>Questions ({s.questions.length})</div>
                              <div>Type</div>
                              <div>Time</div>
                              <div>Difficulty</div>
                              <div>Skills</div>
                              <div className="text-right">Action</div>
                            </div>

                            <div className="divide-y divide-zinc-100">
                              {s.questions.map((q) => {
                                const displayTitle = q.title
                                  .replace(/\s*\([^)]+\)\s*/, "")
                                  .replace(/\s+/g, " ")
                                  .trim();
                                return (
                                <div
                                  key={q.id}
                                  className="grid grid-cols-[1.7fr_1fr_0.7fr_0.8fr_0.9fr_0.5fr] gap-3 px-4 py-3 text-xs text-zinc-700"
                                >
                                  <div className="flex min-w-0 items-center">
                                    <button
                                      type="button"
                                      onClick={() => setDetailsModal(q)}
                                      className="min-w-0 flex-1 truncate text-left font-medium text-zinc-800 hover:underline"
                                    >
                                      {displayTitle}
                                    </button>
                                  </div>
                                  <div className="text-zinc-600">{q.type}</div>
                                  <div className="text-zinc-600">
                                    {q.timeMinutes} mins
                                  </div>
                                  <div className="text-zinc-600">
                                    {sectionLevel ? (
                                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                                        {sectionLevel}
                                      </span>
                                    ) : (
                                      <span className="text-zinc-400">—</span>
                                    )}
                                  </div>
                                  <div className="text-zinc-600">{q.skill}</div>
                                  <div className="relative flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      aria-label="Preview question"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDetailsModal(q);
                                      }}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                                    >
                                      <IconPreview className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Question actions"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setQuestionMenuOpen((prev) =>
                                          prev === q.id ? null : q.id,
                                        );
                                      }}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                                    >
                                      <IconDots className="h-4 w-4" />
                                    </button>
                                    {questionMenuOpen === q.id ? (
                                      <>
                                        <button
                                          type="button"
                                          aria-label="Close menu"
                                          className="fixed inset-0 z-40"
                                          onClick={() =>
                                            setQuestionMenuOpen(null)
                                          }
                                        />
                                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSectionLibraryOpen(s.id);
                                              setReplaceTargetQuestionId(q.id);
                                              const derived =
                                                baseSectionTitle
                                                  .split(" + ")[0]
                                                  ?.trim() ??
                                                baseSectionTitle;
                                              setSectionLibrarySkill(derived);
                                              setSectionLibraryQuery("");
                                              setQuestionMenuOpen(null);
                                            }}
                                            className="flex w-full items-center px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50"
                                          >
                                            Replace
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSections((prev) =>
                                                prev.map((sec) =>
                                                  sec.id !== s.id
                                                    ? sec
                                                    : {
                                                        ...sec,
                                                        questions:
                                                          sec.questions.filter(
                                                            (qq) =>
                                                              qq.id !== q.id,
                                                          ),
                                                      },
                                                ),
                                              );
                                              setQuestionMenuOpen(null);
                                            }}
                                            className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              );
                              })}
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                const prev = sectionLibraryOpen;
                                const next = prev === s.id ? null : s.id;
                                setSectionLibraryOpen(next);
                                if (next === s.id) {
                                  const derived =
                                    baseSectionTitle.split(" + ")[0]?.trim() ??
                                    baseSectionTitle;
                                  setSectionLibrarySkill(derived);
                                  setSectionLibraryQuery("");
                                  setReplaceTargetQuestionId(null);
                                } else {
                                  setReplaceTargetQuestionId(null);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs font-semibold text-corePurple hover:border-corePurple hover:bg-softLavender/50"
                            >
                              Add from library
                              <span className="text-lg leading-none">
                                {sectionLibraryOpen === s.id ? "−" : "+"}
                              </span>
                            </button>
                            {sectionLibraryOpen === s.id ? (
                              <div className="mt-3 space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
                                {replaceTargetQuestionId ? (
                                  <div className="rounded-lg bg-softLavender/50 px-3 py-2 text-xs font-medium text-corePurple">
                                    Replacing:{" "}
                                    {s.questions.find(
                                      (qq) => qq.id === replaceTargetQuestionId,
                                    )?.title?.slice(0, 50)}
                                    ...
                                  </div>
                                ) : null}
                                <div className="flex gap-2">
                                  <input
                                    value={sectionLibraryQuery}
                                    onChange={(e) =>
                                      setSectionLibraryQuery(e.target.value)
                                    }
                                    placeholder="Search questions..."
                                    className="h-10 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300"
                                  />
                                  <select
                                    value={sectionLibrarySkill ?? ""}
                                    onChange={(e) =>
                                      setSectionLibrarySkill(
                                        e.target.value || null,
                                      )
                                    }
                                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300"
                                  >
                                    <option value="">All skills</option>
                                    {[
                                      ...(sectionLibrarySkill &&
                                      !allSkillOptions.includes(
                                        sectionLibrarySkill,
                                      )
                                        ? [sectionLibrarySkill]
                                        : []),
                                      ...allSkillOptions,
                                    ]
                                      .filter(
                                        (sk, i, arr) =>
                                          arr.indexOf(sk) === i,
                                      )
                                      .map((sk) => (
                                        <option key={sk} value={sk}>
                                          {sk}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                  {sectionLibraryQuestions.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-zinc-500">
                                      No questions match your search.
                                    </div>
                                  ) : (
                                    sectionLibraryQuestions.map((libQ) => (
                                      <button
                                        key={libQ.id}
                                        type="button"
                                        onClick={() => {
                                          const targetId = replaceTargetQuestionId;
                                          setSections((prev) =>
                                            prev.map((sec) =>
                                              sec.id !== s.id
                                                ? sec
                                                : targetId
                                                  ? {
                                                      ...sec,
                                                      questions:
                                                        sec.questions.map(
                                                          (qq) =>
                                                            qq.id === targetId
                                                              ? {
                                                                  ...libQ,
                                                                  id: `${libQ.id}-${Date.now()}`,
                                                                }
                                                              : qq,
                                                        ),
                                                    }
                                                  : {
                                                      ...sec,
                                                      questions: [
                                                        ...sec.questions,
                                                        {
                                                          ...libQ,
                                                          id: `${libQ.id}-${Date.now()}`,
                                                        },
                                                      ],
                                                    },
                                            ),
                                          );
                                          setReplaceTargetQuestionId(null);
                                        }}
                                        className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-left transition hover:border-zinc-300 hover:bg-zinc-50"
                                      >
                                        <div className="text-sm font-semibold text-zinc-900">
                                          {libQ.title}
                                        </div>
                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                            {libQ.skill}
                                          </span>
                                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                            {libQ.type}
                                          </span>
                                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                            {libQ.timeMinutes} mins
                                          </span>
                                        </div>
                                        <p className="mt-2 line-clamp-2 text-xs text-zinc-600">
                                          {libQ.description}
                                        </p>
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            ) : null}
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
                }}
                placeholder="Choose a skill"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <span className="text-lg leading-none">⌄</span>
              </span>

              {!selectedSkill && skillQuery.trim().length > 0 ? (
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
                filteredLibraryQuestions.slice(0, 6).map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      const firstSectionId = sections[0]?.id;
                      if (!firstSectionId) return;
                      setSections((prev) =>
                        prev.map((s) =>
                          s.id !== firstSectionId
                            ? s
                            : {
                                ...s,
                                questions: [
                                  ...s.questions,
                                  { ...q, id: `${q.id}-${Date.now()}` },
                                ],
                              },
                        ),
                      );
                      setOpenSection(firstSectionId);
                      setAddModalOpen(false);
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-left transition hover:bg-zinc-50 hover:border-zinc-300"
                  >
                    <div className="text-sm font-semibold text-zinc-900">
                      {q.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                      <QuestionTypeIcon
                        type={q.type}
                        className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                      />
                      <span>{q.type} · {q.timeMinutes} mins · {q.skill}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        title="Add custom question"
        open={customQuestionModalOpen}
        onClose={() => {
          setCustomQuestionModalOpen(false);
          setCustomSkillQuery("");
          setCustomQuestion({
            title: "",
            skills: [],
            type: "Short Answer",
            timeMinutes: 15,
            description: "",
            options: ["", ""],
          });
        }}
      >
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            const firstSectionId = sections[0]?.id;
            const isMultipleChoice = customQuestion.type === "Multiple Choice";
            const validOptions =
              !isMultipleChoice ||
              customQuestion.options.some((o) => o.trim().length > 0);
            if (
              !firstSectionId ||
              !customQuestion.description.trim() ||
              !validOptions
            )
              return;
            const optionsForQuestion =
              isMultipleChoice
                ? customQuestion.options.filter((o) => o.trim().length > 0)
                : undefined;
            const q: Question = {
              id: `custom-${Date.now()}`,
              title: customQuestion.title.trim() || customQuestion.description.trim().slice(0, 50),
              skill: customQuestion.skills.length > 0
                ? customQuestion.skills.join(", ")
                : "General",
              type: customQuestion.type,
              timeMinutes: customQuestion.timeMinutes,
              description: customQuestion.description.trim(),
              ...(optionsForQuestion && optionsForQuestion.length > 0
                ? { options: optionsForQuestion }
                : {}),
            };
            setSections((prev) =>
              prev.map((s) =>
                s.id !== firstSectionId
                  ? s
                  : { ...s, questions: [...s.questions, q] },
              ),
            );
            setOpenSection(firstSectionId);
            setCustomQuestionModalOpen(false);
            setCustomQuestion({
              title: "",
              skills: [],
              type: "Short Answer",
              timeMinutes: 15,
              description: "",
              options: ["", ""],
            });
          }}
        >
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Question type
            </div>
            <select
              value={customQuestion.type}
              onChange={(e) => {
                const v = e.target.value as "Multiple Choice" | "Short Answer";
                setCustomQuestion((p) => ({
                  ...p,
                  type: v,
                  options: v === "Multiple Choice" ? ["", ""] : [],
                }));
              }}
              className="mt-2 h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm outline-none focus:border-zinc-300"
            >
              {CUSTOM_QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Title (optional)
            </div>
            <input
              value={customQuestion.title}
              onChange={(e) =>
                setCustomQuestion((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Short label for this question"
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Skills <span className="text-zinc-500">(multi-select)</span>
            </div>
            {customQuestion.skills.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {customQuestion.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-corePurple px-3 py-1 text-xs font-medium text-white"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setCustomQuestion((p) => ({
                          ...p,
                          skills: p.skills.filter((x) => x !== s),
                        }))
                      }
                      className="hover:text-white/80"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <div className="relative mt-2">
              <input
                value={customSkillQuery}
                onChange={(e) => setCustomSkillQuery(e.target.value)}
                placeholder="Search and add skills"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <span className="text-lg leading-none">⌄</span>
              </span>
              {customSkillQuery.trim() && filteredCustomSkills.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                  {filteredCustomSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setCustomQuestion((p) => ({
                          ...p,
                          skills: [...p.skills, s],
                        }));
                        setCustomSkillQuery("");
                      }}
                      className="flex w-full px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : customSkillQuery.trim() ? (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 shadow-lg">
                  No matching skills.
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Time (minutes)
            </div>
            <input
              type="number"
              min={1}
              max={999}
              value={customQuestion.timeMinutes}
              onChange={(e) =>
                setCustomQuestion((p) => ({
                  ...p,
                  timeMinutes: parseInt(e.target.value, 10) || 15,
                }))
              }
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
            />
          </div>
          {customQuestion.type === "Multiple Choice" ? (
            <div>
              <div className="text-sm font-medium text-zinc-800">
                Options <span className="text-red-500">*</span>
              </div>
              <div className="mt-2 space-y-2">
                {customQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 shrink-0 text-xs text-zinc-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...customQuestion.options];
                        next[i] = e.target.value;
                        setCustomQuestion((p) => ({ ...p, options: next }));
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="h-10 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300"
                    />
                    <button
                      type="button"
                      aria-label="Remove option"
                      onClick={() => {
                        if (customQuestion.options.length > 2) {
                          setCustomQuestion((p) => ({
                            ...p,
                            options: p.options.filter((_, j) => j !== i),
                          }));
                        }
                      }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCustomQuestion((p) => ({
                      ...p,
                      options: [...p.options, ""],
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                >
                  + Add option
                </button>
              </div>
            </div>
          ) : null}
          <div>
            <div className="text-sm font-medium text-zinc-800">
              Question <span className="text-red-500">*</span>
            </div>
            <textarea
              required
              value={customQuestion.description}
              onChange={(e) =>
                setCustomQuestion((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Enter your question"
              rows={3}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCustomQuestionModalOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !customQuestion.description.trim() ||
                (customQuestion.type === "Multiple Choice" &&
                  !customQuestion.options.some((o) => o.trim().length > 0))
              }
              className={[
                "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold",
                customQuestion.description.trim() &&
                (customQuestion.type !== "Multiple Choice" ||
                  customQuestion.options.some((o) => o.trim().length > 0))
                  ? "bg-corePurple text-white hover:bg-violet"
                  : "bg-zinc-200 text-zinc-500",
              ].join(" ")}
            >
              Add question
            </button>
          </div>
        </form>
      </ModalShell>

      <ModalShell
        title="Question details"
        open={!!detailsModal}
        onClose={() => setDetailsModal(null)}
      >
        {detailsModal ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/tests/${testId}/preview?question=${encodeURIComponent(detailsModal.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              >
                <IconPreview className="h-4 w-4" />
                Preview question
              </a>
              <button
                type="button"
                onClick={() => {
                  const section = sections.find((s) =>
                    s.questions.some((qq) => qq.id === detailsModal.id),
                  );
                  if (section) {
                    setSections((prev) =>
                      prev.map((sec) =>
                        sec.id !== section.id
                          ? sec
                          : {
                              ...sec,
                              questions: sec.questions.filter(
                                (qq) => qq.id !== detailsModal.id,
                              ),
                            },
                      ),
                    );
                  }
                  setDetailsModal(null);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            </div>
            <div className="text-base font-semibold text-zinc-900">
              {detailsModal.title.replace(/\s*\([^)]+\)\s*/, "").replace(/\s+/g, " ").trim()}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {detailsModal.skill}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5">
                <QuestionTypeIcon
                  type={detailsModal.type}
                  className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                />
                {detailsModal.type}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                {detailsModal.timeMinutes} mins
              </span>
              {(() => {
                const section = sections.find((s) =>
                  s.questions.some((qq) => qq.id === detailsModal.id),
                );
                const levelMatch = section?.title.match(/\(([^)]+)\)\s*$/);
                const difficulty = levelMatch?.[1] ?? null;
                return difficulty ? (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                    {difficulty}
                  </span>
                ) : null;
              })()}
            </div>
            <div className="whitespace-pre-line rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
              {(() => {
                const section = sections.find((s) =>
                  s.questions.some((qq) => qq.id === detailsModal.id),
                );
                // Override cached placeholder with a deterministic mock prompt.
                const isPlaceholder =
                  detailsModal.description.startsWith("Mock question content.");
                return section && isPlaceholder
                  ? seedQuestionDescription(section.title)
                  : detailsModal.description;
              })()}
            </div>
            {detailsModal.options && detailsModal.options.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-medium text-zinc-500">Options</div>
                <div className="space-y-1">
                  {detailsModal.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-200 text-xs font-medium text-zinc-600">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

