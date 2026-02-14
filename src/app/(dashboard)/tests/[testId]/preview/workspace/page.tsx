"use client";

import * as React from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type McqOption = { id: string; label: string; meta?: string };
type McqConstraint = { k: string; v: string };

type McqScenario = {
  type: "mcq";
  id: string;
  title: string;
  skill: string;
  subtitle: string;
  description: string;
  constraints: McqConstraint[];
  imageUrl?: string;
  taskText: string;
  taskTimeMeta: string;
  taskEvalMeta: string;
  optionPrompt: string;
  optionHint: string;
  options: McqOption[];
  rationalePlaceholder: string;
  rationaleHint: string;
  notePrompts: string[];
  badges?: string[];
};

type VoiceScenario = {
  type: "voice";
  id: string;
  title: string;
  skill: string;
  subtitle: string;
  description: string;
  constraints: McqConstraint[];
  taskText: string;
  taskTimeMeta: string;
  taskEvalMeta: string;
  badges?: string[];
};

type Scenario = McqScenario | VoiceScenario;

const SCENARIOS: Scenario[] = [
  {
    type: "mcq",
    id: "gripper",
    title: "Robotic Gripper Validation",
    skill: "Technical",
    subtitle: "Mechanical / Robotics • Early validation strategy",
    description:
      "You are designing a new robotic gripper for a pick-and-place application. The immediate goal is to validate geometry, range of motion, and basic compliance before committing to a production design.",
    constraints: [
      { k: "Timeline", v: "Validation must be completed within 6 days" },
      { k: "Iteration", v: "Multiple design iterations may be required" },
      { k: "Out of scope", v: "Strength, wear life, and surface finish" },
      { k: "Priority", v: "Low cost + fast turnaround over material fidelity" },
    ],
    imageUrl: "/gripper-drawing.png",
    taskText:
      "Choose the fabrication approach you would use first to validate geometry and motion within the constraints. Then provide a short rationale.",
    taskTimeMeta: "~2–4 minutes",
    taskEvalMeta: "Tradeoffs, iteration plan, clarity",
    optionPrompt: "Pick your approach",
    optionHint: "Choose the method you would use first for rapid validation.",
    options: [
      { id: "cnc", label: "CNC-machined aluminum", meta: "High fidelity • Higher cost • Longer lead" },
      { id: "sheet", label: "Sheet-metal steel fabrication", meta: "Moderate fidelity • Medium speed" },
      { id: "laser", label: "Laser-cut acrylic sheets", meta: "Fast • Low cost • Limited stiffness" },
      { id: "print", label: "3D-printed prototype", meta: "Fastest iteration • Low cost" },
    ],
    rationalePlaceholder: "Explain why this is the best first step given the constraints…",
    rationaleHint: "2–5 sentences. Explain tradeoffs + iteration plan.",
    notePrompts: ["What would you test first?", "What would you learn in the first iteration?", "If iteration 1 fails, what changes next?"],
    badges: ["Early validation", "6-day window"],
  },
  {
    type: "mcq",
    id: "dfm",
    title: "DFM Principle Application",
    skill: "Problem Solving",
    subtitle: "Manufacturing • Tolerance strategy",
    description:
      "When dimensioning a part for manufacturability, the choice of tolerance strategy directly impacts cost, lead time, and assembly quality. Mating features—such as shaft/hole fits, bolt clearances, or locating pins—require careful consideration of function vs. manufacturability.",
    constraints: [
      { k: "Context", v: "Mating features (e.g. shaft/hole, bolt/bore)" },
      { k: "Goal", v: "Balance manufacturability with required function" },
      { k: "Priority", v: "Apply Design for Manufacturability (DFM) principles" },
    ],
    taskText: "Select the tolerance strategy you would generally prefer for mating features, and explain your reasoning.",
    taskTimeMeta: "~2–3 minutes",
    taskEvalMeta: "DFM understanding, tradeoff reasoning",
    optionPrompt: "Select the preferred strategy",
    optionHint: "Which approach best aligns with DFM for mating features?",
    options: [
      { id: "widest", label: "Widest possible tolerances", meta: "Lower cost • Easiest to machine • May compromise fit" },
      { id: "tight", label: "Tight tolerances throughout", meta: "Best fit • Higher cost • Longer lead" },
      { id: "functional", label: "Functional tolerances based on fit", meta: "Fit-driven • Balanced cost • Standard approach" },
      { id: "none", label: "No tolerances specified", meta: "Not recommended • Ambiguous • Risk of rework" },
    ],
    rationalePlaceholder: "Explain why this strategy is preferred for mating features…",
    rationaleHint: "2–4 sentences. Consider cost, fit, and manufacturability.",
    notePrompts: ["What drives tolerance selection for mating features?", "How does tighter tolerance affect cost and lead time?", "When would you specify different tolerances for different features?"],
    badges: ["DFM", "Tolerancing"],
  },
  {
    type: "voice",
    id: "thermal-accuracy",
    title: "Robotic Joint Thermal-Accuracy Trade-off",
    skill: "Verbal",
    subtitle: "Thermal • Precision • Design trade-offs",
    description:
      "A high-precision robotic joint operates inside a sealed enclosure due to environmental exposure (dust, coolant mist).\n\nObserved issues:\n• Motor overheats during continuous operation\n• Joint accuracy degrades after warm-up\n\nYou must explain how you would approach this problem, including why improving thermal conduction can conflict with accuracy, which design changes you would prioritize first, and what trade-offs you would explicitly accept.",
    constraints: [
      { k: "Size", v: "Joint size cannot increase" },
      { k: "Sealing", v: "Sealing cannot be compromised" },
      { k: "Preload", v: "Bearing preload is already near allowable limits" },
    ],
    taskText: "Record a verbal response explaining your approach, prioritization, and accepted trade-offs.",
    taskTimeMeta: "~3–5 minutes",
    taskEvalMeta: "Trade-off reasoning, design prioritization, clarity",
    badges: ["Verbal", "45s prep"],
  },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkles: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M19 12l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12z" />
        <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" />
      </svg>
    ),
    chevronLeft: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    chevronRight: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    maximize: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stickyNote: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 18h-2M14 14h-2" strokeLinecap="round" />
      </svg>
    ),
    mic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" />
        <path d="M12 19v3M9 22h6" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

type ScenarioAnswers = { selected: string; rationale: string; notes: string };

type VoiceState = {
  modalDismissed: boolean;
  recordingStarted: boolean;
  countdown: number | null;
  stopped: boolean;
};

const getDefaultMcqAnswers = (scenario: McqScenario): ScenarioAnswers => ({
  selected: scenario.options[0]?.id ?? "",
  rationale: "",
  notes: "",
});

const getDefaultAnswers = (scenario: Scenario): ScenarioAnswers =>
  scenario.type === "mcq" ? getDefaultMcqAnswers(scenario) : { selected: "", rationale: "", notes: "" };

export default function WorkspaceLayoutPage() {
  const params = useParams<{ testId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = params?.testId ?? "";

  const scenarioIndex = Math.min(
    Math.max(0, parseInt(searchParams?.get("scenario") ?? "0", 10)),
    SCENARIOS.length - 1
  );
  const scenario = SCENARIOS[scenarioIndex];
  const scenarioTotal = SCENARIOS.length;
  const isMcq = scenario.type === "mcq";
  const isVoice = scenario.type === "voice";

  const [answersByIndex, setAnswersByIndex] = React.useState<Record<number, ScenarioAnswers>>(() => ({
    0: {
      selected: "print",
      rationale:
        "I'd start with 3D printing to validate geometry + range-of-motion within the 6-day window, then iterate quickly based on fit and motion results. Material fidelity isn't required at this stage, so speed and cost dominate.",
      notes: "Check: jaw clearance near gear mesh • Confirm max opening angle • Verify mounting interface",
    },
  }));

  const [voiceStateByIndex, setVoiceStateByIndex] = React.useState<Record<number, VoiceState>>({});
  const [showVoiceIntroModal, setShowVoiceIntroModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"answer" | "notes">("answer");

  const currentAnswers = answersByIndex[scenarioIndex] ?? getDefaultAnswers(scenario);
  const voiceState = voiceStateByIndex[scenarioIndex] ?? {
    modalDismissed: false,
    recordingStarted: false,
    countdown: null,
    stopped: false,
  };

  React.useEffect(() => {
    if (isVoice && !voiceState.recordingStarted && !voiceState.modalDismissed) {
      setShowVoiceIntroModal(true);
    }
  }, [scenarioIndex, isVoice, voiceState.recordingStarted, voiceState.modalDismissed]);

  React.useEffect(() => {
    if (!isVoice || !voiceState.recordingStarted || voiceState.countdown === null || voiceState.countdown <= 0 || voiceState.stopped)
      return;
    const t = setTimeout(() => {
      setVoiceStateByIndex((prev) => {
        const cur = prev[scenarioIndex];
        if (!cur) return prev;
        const next = Math.max(0, (cur.countdown ?? 45) - 1);
        return { ...prev, [scenarioIndex]: { ...cur, countdown: next } };
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [scenarioIndex, isVoice, voiceState.recordingStarted, voiceState.countdown, voiceState.stopped]);

  const setSelected = (id: string) =>
    setAnswersByIndex((prev) => ({
      ...prev,
      [scenarioIndex]: { ...(prev[scenarioIndex] ?? getDefaultAnswers(scenario)), selected: id },
    }));
  const setRationale = (s: string) =>
    setAnswersByIndex((prev) => ({
      ...prev,
      [scenarioIndex]: { ...(prev[scenarioIndex] ?? getDefaultAnswers(scenario)), rationale: s },
    }));
  const setNotes = (s: string) =>
    setAnswersByIndex((prev) => ({
      ...prev,
      [scenarioIndex]: { ...(prev[scenarioIndex] ?? getDefaultAnswers(scenario)), notes: s },
    }));

  const goPrev = () => {
    if (scenarioIndex === 0) {
      router.push(`/tests/${testId}/preview`);
    } else {
      router.push(`/tests/${testId}/preview/workspace?scenario=${scenarioIndex - 1}`);
    }
  };

  const goNext = () => {
    if (scenarioIndex < scenarioTotal - 1) {
      router.push(`/tests/${testId}/preview/workspace?scenario=${scenarioIndex + 1}`);
    }
  };

  const progress = Math.round(((scenarioIndex + 1) / scenarioTotal) * 100);

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
              <Icon name="sparkles" className="h-4 w-4 text-corePurple" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-semibold text-zinc-900">{scenario.title}</h1>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  Scenario {scenarioIndex + 1}
                </span>
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600">{scenario.skill}</span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="truncate">{scenario.subtitle}</span>
                <span className="hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" className="h-3.5 w-3.5" /> 5:55 remaining
                </span>
              </div>
            </div>
          </div>

          <div className="ml-auto hidden min-w-[260px] flex-col gap-1 md:flex">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Progress</span>
              <span>
                {scenarioIndex + 1}/{scenarioTotal}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full rounded-full bg-corePurple transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <Icon name="chevronLeft" className="h-4 w-4" /> Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-corePurple px-3 py-2 text-sm font-medium text-white transition hover:brightness-105"
            >
              Next <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-column workspace */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Center: Document brief */}
        <div className="h-[calc(100vh-88px)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Design brief</div>
                <div className="text-xs text-zinc-500">Read the context, then decide your approach</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {scenario.badges?.map((b) => (
                  <span key={b} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    {b}
                  </span>
                ))}
                {!scenario.badges?.length && (
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600">{scenario.skill}</span>
                )}
              </div>
            </div>
          </div>
          <div className="h-[calc(100vh-160px)] overflow-y-auto p-4">
            <div className="space-y-5">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{scenario.title}</h2>
                <p className="whitespace-pre-line text-sm text-zinc-600">{scenario.description}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Context & constraints</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {scenario.constraints.map((c) => (
                    <div key={c.k} className="rounded-xl border border-zinc-200 bg-white p-3">
                      <div className="text-xs font-medium text-zinc-700">{c.k}</div>
                      <div className="mt-1 text-sm text-zinc-600">{c.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {"imageUrl" in scenario && scenario.imageUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-zinc-900">Drawing</div>
                    <button
                      type="button"
                      className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon name="maximize" className="h-4 w-4" /> Zoom / annotate
                      </span>
                    </button>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-3">
                    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                      <Image
                        src={scenario.imageUrl}
                        alt="Reference"
                        width={600}
                        height={250}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>Tip:</span>
                      <span>Use zoom to inspect details. Annotations (optional) can support your rationale.</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="text-sm font-semibold text-zinc-900">Task</div>
                <p className="mt-1 text-sm text-zinc-600">{scenario.taskText}</p>
                <div className="my-4 border-t border-zinc-200" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="text-xs font-medium text-zinc-700">Expected response time</div>
                    <div className="mt-1 text-sm text-zinc-600">{scenario.taskTimeMeta}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="text-xs font-medium text-zinc-700">What we evaluate</div>
                    <div className="mt-1 text-sm text-zinc-600">{scenario.taskEvalMeta}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Candidate workspace */}
        <div className="h-[calc(100vh-88px)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Your workspace</div>
                <div className="text-xs text-zinc-500">
                  {isVoice ? "Record your verbal response" : "Decision + rationale + notes"}
                </div>
              </div>
              {isMcq && <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500">Autosaved</span>}
            </div>
          </div>

          <div className="p-4">
            {isMcq ? (
              <>
                <div className="mb-3 flex gap-1 rounded-xl border border-zinc-200 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("answer")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeTab === "answer" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Response
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("notes")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeTab === "notes" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Notes
                  </button>
                </div>

                {activeTab === "answer" ? (
                  <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 240px)" }}>
                    <div className="rounded-2xl border border-zinc-200 p-4">
                      <div className="text-sm font-semibold text-zinc-900">{scenario.optionPrompt}</div>
                      <div className="mt-1 text-xs text-zinc-500">{scenario.optionHint}</div>
                      <div className="mt-4 space-y-3">
                        {scenario.options.map((o) => (
                          <label
                            key={o.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                              currentAnswers.selected === o.id
                                ? "border-corePurple bg-softLavender/30"
                                : "border-zinc-200 hover:bg-zinc-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="approach"
                              value={o.id}
                              checked={currentAnswers.selected === o.id}
                              onChange={() => setSelected(o.id)}
                              className="mt-1 h-4 w-4 border-zinc-300 text-corePurple focus:ring-corePurple"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-zinc-800">{o.label}</div>
                              {o.meta && <div className="mt-0.5 text-xs text-zinc-500">{o.meta}</div>}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-zinc-900">Rationale</div>
                          <div className="text-xs text-zinc-500">{scenario.rationaleHint}</div>
                        </div>
                        <span className="text-xs text-zinc-400">~100–250 words</span>
                      </div>
                      <textarea
                        value={currentAnswers.rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        className="mt-3 min-h-[160px] w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-corePurple focus:ring-2 focus:ring-corePurple/20"
                        placeholder={scenario.rationalePlaceholder}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 240px)" }}>
                    <div className="rounded-2xl border border-zinc-200 p-4">
                      <div className="flex items-center gap-2">
                        <Icon name="stickyNote" className="h-4 w-4 text-zinc-600" />
                        <div className="text-sm font-semibold text-zinc-900">Scratchpad</div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Optional. Notes are not graded unless you include them in your rationale.
                      </div>
                      <textarea
                        value={currentAnswers.notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-3 min-h-[260px] w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-corePurple focus:ring-2 focus:ring-corePurple/20"
                        placeholder="Work your thoughts out here…"
                      />
                    </div>

                    <div className="rounded-2xl border border-zinc-200 p-4">
                      <div className="text-sm font-semibold text-zinc-900">Helpful prompts</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-500">
                        {scenario.notePrompts.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 min-h-[280px]">
                {!voiceState.recordingStarted ? (
                  <>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-corePurple/10">
                      <Icon name="mic" className="h-10 w-10 text-corePurple" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-700">Record your voice response</p>
                      <p className="mt-1 text-xs text-zinc-500">Click the button below to start</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVoiceIntroModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-corePurple px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                    >
                      <Icon name="mic" className="h-5 w-5" />
                      Start recording
                    </button>
                  </>
                ) : voiceState.countdown !== null && voiceState.countdown > 0 ? (
                  <div className="flex flex-col items-center gap-6">
                    <p className="text-sm text-zinc-600">
                      Take a moment to gather your thoughts. Recording will start automatically, or begin whenever you&apos;re ready.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-medium tabular-nums text-zinc-400">{voiceState.countdown}s</span>
                      <span className="text-sm text-zinc-400">to prepare</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setVoiceStateByIndex((prev) => ({
                          ...prev,
                          [scenarioIndex]: { ...(prev[scenarioIndex] ?? voiceState), countdown: 0 },
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-corePurple px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                    >
                      <Icon name="mic" className="h-4 w-4" />
                      Start recording now
                    </button>
                  </div>
                ) : voiceState.stopped ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-zinc-700">Recording saved</p>
                  </div>
                ) : (
                  <div className="flex w-full max-w-xs flex-col items-center gap-6">
                    <div className="flex h-20 items-end justify-center gap-1.5">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div
                          key={i}
                          className="w-2 rounded-full bg-gradient-to-t from-corePurple to-violet origin-bottom"
                          style={{
                            height: "32px",
                            animation: "voicewave 0.5s ease-in-out infinite alternate",
                            animationDelay: `${i * 0.06}s`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                        </span>
                        <p className="text-sm font-medium text-zinc-700">Recording...</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setVoiceStateByIndex((prev) => ({
                            ...prev,
                            [scenarioIndex]: { ...(prev[scenarioIndex] ?? voiceState), stopped: true },
                          }))
                        }
                        className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Stop recording
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isVoice && showVoiceIntroModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setShowVoiceIntroModal(false)}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-corePurple/10">
                  <Icon name="mic" className="h-6 w-6 text-corePurple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Verbal question</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
                    This is a verbal question. We want to understand your process and how you think through the problem. Once you
                    click &quot;Start question&quot;, you&apos;ll have up to 45 seconds to prepare—or begin recording right away if
                    you&apos;re ready. Click &quot;Stop recording&quot; when you&apos;re finished.
                  </p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVoiceIntroModal(false);
                        setVoiceStateByIndex((prev) => ({
                          ...prev,
                          [scenarioIndex]: { ...(prev[scenarioIndex] ?? voiceState), modalDismissed: true },
                        }));
                      }}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowVoiceIntroModal(false);
                        setVoiceStateByIndex((prev) => ({
                          ...prev,
                          [scenarioIndex]: {
                            ...(prev[scenarioIndex] ?? voiceState),
                            recordingStarted: true,
                            countdown: 45,
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-corePurple px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                    >
                      <Icon name="mic" className="h-4 w-4" />
                      Start question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
