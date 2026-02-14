"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ROLES } from "@/lib/roles";

type Question = {
  id: string;
  title: string;
  skill: string;
  type: string;
  timeMinutes: number;
  description: string;
  options?: string[];
  imageUrl?: string;
};

type SectionState = {
  id: string;
  title: string;
  minutes: number;
  questions: Question[];
};

const USE_MOCK_PREVIEW = true;
const MOCK_PREVIEW_QUESTIONS: Question[] = [
  {
    id: "mock-mcq-1",
    title: "Robotic Gripper Validation",
    skill: "Technical",
    type: "Multiple Choice",
    timeMinutes: 5,
    description: "You are designing a new robotic gripper for a pick-and-place application. The immediate goal is to validate geometry, range of motion, and basic compliance before committing to a production design.\n\nSome points to consider:\n\n• Validation must be completed within 6 days\n• Multiple design iterations may be required\n• Strength, wear life, and surface finish are not part of this validation phase\n• Low cost and fast turnaround are prioritized over material fidelity",
    options: ["CNC-machined aluminum", "Sheet-metal steel fabrication", "Laser cut from Acrylic sheets", "3D-printed prototype"],
    imageUrl: "/gripper-drawing.png",
  },
  {
    id: "mock-mcq-2",
    title: "DFM Principle Application",
    skill: "Problem Solving",
    type: "Multiple Choice",
    timeMinutes: 5,
    description: "When dimensioning a part for manufacturability, which tolerance strategy is generally preferred for mating features?",
    options: ["Widest possible tolerances", "Tight tolerances throughout", "Functional tolerances based on fit", "No tolerances specified"],
  },
  {
    id: "mock-voice-1",
    title: "Robotic Joint Thermal-Accuracy Trade-off",
    skill: "Verbal",
    type: "Voice",
    timeMinutes: 5,
    description: "A high-precision robotic joint operates inside a sealed enclosure due to environmental exposure (dust, coolant mist).\n\nObserved issues:\n• Motor overheats during continuous operation\n• Joint accuracy degrades after warm-up\n\nConstraints:\n• Joint size cannot increase\n• Sealing cannot be compromised\n• Bearing preload is already near allowable limits\n\nExplain how you would approach this problem, including:\n• Why improving thermal conduction can conflict with accuracy\n• Which design changes you would prioritize first\n• What trade-offs you would explicitly accept",
  },
  {
    id: "mock-sim-1",
    title: "Component Positioning for Assembly",
    skill: "Practical",
    type: "Simulation",
    timeMinutes: 10,
    description: "Use the controls below to position the component within the tolerance zone. The goal is to achieve the best possible fit for the assembly.",
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

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function IconInfo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 9v4M10 7h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconMic(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 19v3M9 22h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconSimulation(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 4h6v6H4V4ZM14 4h6v6h-6V4ZM4 14h6v6H4v-6ZM14 14h6v6h-6v-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PreviewPage() {
  const params = useParams<{ testId: string }>();
  const searchParams = useSearchParams();
  const testId = params?.testId ?? "";
  const questionId = searchParams?.get("question") ?? null;
  const router = useRouter();

  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const [question, setQuestion] = React.useState<Question | null>(null);
  const [answer, setAnswer] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [showStartModal, setShowStartModal] = React.useState(false);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [showVoiceIntroModal, setShowVoiceIntroModal] = React.useState(false);
  const [voiceModalDismissed, setVoiceModalDismissed] = React.useState(false);
  const [voiceRecordingStarted, setVoiceRecordingStarted] = React.useState(false);
  const [voiceCountdown, setVoiceCountdown] = React.useState<number | null>(null);
  const [voiceRecordingStopped, setVoiceRecordingStopped] = React.useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = React.useState<number | null>(null);

  const totalDurationMinutes = USE_MOCK_PREVIEW
    ? MOCK_PREVIEW_QUESTIONS.reduce((a, q) => a + q.timeMinutes, 0)
    : (role?.preview.durationMinutes ?? 60);

  React.useEffect(() => {
    if (!questionId) return;
    const totalSeconds = totalDurationMinutes * 60;
    const key = `preview-timer:${testId}`;
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(key) : null;
    const initial = stored ? parseInt(stored, 10) : totalSeconds;
    setTimeRemainingSeconds(Math.max(0, initial));
  }, [questionId, testId, totalDurationMinutes]);

  React.useEffect(() => {
    if (!questionId || timeRemainingSeconds === null || timeRemainingSeconds <= 0) return;
    const key = `preview-timer:${testId}`;
    const t = setInterval(() => {
      setTimeRemainingSeconds((s) => {
        if (s === null || s <= 0) return 0;
        const next = Math.max(0, s - 1);
        if (typeof window !== "undefined") window.sessionStorage.setItem(key, String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [questionId, testId, timeRemainingSeconds]);

  const allQuestionIds = React.useMemo(() => {
    if (USE_MOCK_PREVIEW) return MOCK_PREVIEW_QUESTIONS.map((q) => q.id);
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(`test-sections:${testId}`);
      if (!raw) return [];
      const parsed: SectionState[] = JSON.parse(raw);
      return parsed.flatMap((s) => s.questions).map((q) => q.id);
    } catch {
      return [];
    }
  }, [testId]);

  React.useEffect(() => {
    setAnswer("");
    setSelectedOption(null);
    setVoiceRecordingStarted(false);
    setVoiceCountdown(null);
    setVoiceRecordingStopped(false);
    setVoiceModalDismissed(false);
  }, [questionId]);

  React.useEffect(() => {
    if (questionId === "mock-voice-1" && !voiceRecordingStarted && !voiceModalDismissed) {
      setShowVoiceIntroModal(true);
    }
  }, [questionId, voiceRecordingStarted, voiceModalDismissed]);

  React.useEffect(() => {
    if (!voiceRecordingStarted || voiceCountdown === null || voiceCountdown <= 0 || voiceRecordingStopped) return;
    const t = setTimeout(() => {
      setVoiceCountdown((c) => (c === null ? 0 : c - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [voiceRecordingStarted, voiceCountdown, voiceRecordingStopped]);

  React.useEffect(() => {
    if (!questionId) {
      setQuestion(null);
      return;
    }
    if (USE_MOCK_PREVIEW) {
      const q = MOCK_PREVIEW_QUESTIONS.find((x) => x.id === questionId);
      setQuestion(q ?? null);
      return;
    }
    if (!testId) {
      setQuestion(null);
      return;
    }
    try {
      const raw = window.localStorage.getItem(`test-sections:${testId}`);
      if (!raw) {
        setQuestion(null);
        return;
      }
      const sections: SectionState[] = JSON.parse(raw);
      for (const s of sections) {
        const q = s.questions.find((x) => x.id === questionId);
        if (q) {
          setQuestion(q);
          return;
        }
      }
      setQuestion(null);
    } catch {
      setQuestion(null);
    }
  }, [testId, questionId]);

  const isMultipleChoice = question?.type === "Multiple Choice";
  const isLongAnswer = question?.type === "Long Answer" || question?.type === "Short Answer";
  const isVoice = question?.type === "Voice";
  const isSimulation = question?.type === "Simulation";

  const currentIndex = questionId ? allQuestionIds.indexOf(questionId) : -1;
  const prevQuestionId = currentIndex > 0 ? allQuestionIds[currentIndex - 1] : null;
  const nextQuestionId = currentIndex >= 0 && currentIndex < allQuestionIds.length - 1 ? allQuestionIds[currentIndex + 1] : null;
  const totalQuestionsCount = allQuestionIds.length;
  const { firstQuestionId } = React.useMemo(() => {
    if (USE_MOCK_PREVIEW && MOCK_PREVIEW_QUESTIONS.length > 0) {
      return { firstQuestionId: MOCK_PREVIEW_QUESTIONS[0].id };
    }
    if (typeof window === "undefined") {
      const previewSections = role?.preview.sections ?? [];
      return { firstQuestionId: previewSections.length > 0 ? "seed-0" : null };
    }
    try {
      const raw = window.localStorage.getItem(`test-sections:${testId}`);
      if (raw) {
        const parsed: SectionState[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const questions = parsed.flatMap((s) => s.questions);
          return { firstQuestionId: questions[0]?.id ?? null };
        }
      }
    } catch {
      // ignore
    }
    const previewSections = role?.preview.sections ?? [];
    return { firstQuestionId: previewSections.length > 0 ? "seed-0" : null };
  }, [testId, role?.preview.sections]);

  const durationMinutes = role?.preview.durationMinutes ?? 60;

  if (!questionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f6ff] via-[#fbfaff] to-[#f4f0ff] text-zinc-900">
        <div className="border-b border-white/60 bg-white/50 backdrop-blur-sm px-6 py-3 shadow-[0_1px_0_0_rgba(77,62,240,0.06)]">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-corePurple/10">
              <IconInfo className="h-4 w-4 text-corePurple" />
            </div>
            <span className="text-sm font-medium text-zinc-600">
              This is a preview of your test. Complete the steps below before starting.
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div className="min-w-0 lg:pt-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-corePurple/80">
                Assessment
              </p>
              <h1 className="mt-3 font-fustat text-3xl font-semibold tracking-tight text-graphite sm:text-4xl sm:leading-[1.15]">
                Welcome. You&apos;ve been invited to take a test.
              </h1>
              <div className="mt-8 space-y-1">
                <p className="text-[15px] leading-relaxed text-zinc-600">
                  To have a great experience:
                </p>
                <ul className="mt-4 space-y-3 text-[15px] text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-corePurple to-violet" />
                    Watch the introductory video first so you feel comfortable and perform your best.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-corePurple to-violet" />
                    Ensure you have a stable internet connection and a quiet environment.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-corePurple to-violet" />
                    <span>
                      Before taking the test, please go through the{" "}
                      <Link href="#faq" className="font-medium text-corePurple underline underline-offset-2 hover:text-violet">
                        FAQs
                      </Link>{" "}
                      to resolve your queries related to the test or the Colare platform.
                    </span>
                  </li>
                </ul>
                <p className="mt-8 rounded-xl border border-zinc-200/80 bg-white/70 px-5 py-4 text-sm font-medium text-zinc-700 shadow-sm">
                  <span className="text-corePurple font-semibold">Estimated time: {durationMinutes} minutes</span>
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-12 lg:pt-20">
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_4px_24px_-4px_rgba(77,62,240,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
                <div className="p-6 sm:p-7">
                  <h2 className="text-lg font-semibold text-zinc-900">Introductory video</h2>
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50 to-zinc-100/80 shadow-inner min-h-[280px] sm:min-h-[320px]">
                    <div className="flex h-full min-h-[280px] sm:min-h-[320px] w-full flex-col items-center justify-center gap-3 text-zinc-400">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-zinc-200/60 transition hover:scale-105 hover:shadow-xl">
                        <IconPlay className="h-10 w-10 text-corePurple ml-0.5" />
                      </div>
                      <p className="text-sm font-medium text-zinc-500">Video placeholder</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowStartModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(77,62,240,0.45)] transition hover:shadow-[0_6px_20px_-2px_rgba(77,62,240,0.5)] hover:brightness-105"
                    >
                      Start test
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {showStartModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      aria-modal="true"
                      role="dialog"
                    >
                        <div
                        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
                        onClick={() => {
                          setShowStartModal(false);
                          setAgreedToTerms(false);
                        }}
                        aria-hidden="true"
                      />
                      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="font-fustat text-xl font-semibold text-graphite sm:text-2xl">
                            You&apos;re about to start your test
                          </h2>
                          <button
                            type="button"
                            onClick={() => {
                              setShowStartModal(false);
                              setAgreedToTerms(false);
                            }}
                            className="-m-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                            aria-label="Close"
                          >
                            <IconX className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-6 space-y-5 text-[15px] text-zinc-600">
                          <p className="leading-relaxed">
                            Once you click the &quot;Start&quot; button, you cannot stop the flow of questions. Once you submit an answer, you cannot go back to the previous question.
                          </p>
                          <div>
                            <p className="font-semibold text-zinc-800">
                              Cheating is prohibited. Our software detects cheating attempts and reports them to the recruiter.
                            </p>
                          </div>
                          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-3.5">
                            <p className="mb-3 font-medium text-zinc-700">Please note that:</p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-corePurple" />
                                Camera access and screen recording permissions are mandatory for this assessment.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-corePurple" />
                                It is strictly forbidden to record or disclose the questions of this test by any means whatsoever.
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-corePurple" />
                                The privacy policy of the company who invited you to this test applies.
                              </li>
                            </ul>
                          </div>
                        </div>

                        <label className="mt-6 flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-corePurple focus:ring-corePurple"
                          />
                          <span className="text-sm text-zinc-700">
                            I agree to the{" "}
                            <Link href="#terms" className="font-medium text-corePurple underline underline-offset-2 hover:text-violet">
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link href="#privacy" className="font-medium text-corePurple underline underline-offset-2 hover:text-violet">
                              privacy policy
                            </Link>
                          </span>
                        </label>

                        <div className="mt-8 flex justify-end">
                          <button
                            type="button"
                            disabled={!agreedToTerms}
                            onClick={() => {
                              if (agreedToTerms) {
                                router.push(`/tests/${testId}/preview/workspace`);
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(77,62,240,0.45)] transition hover:shadow-[0_6px_20px_-2px_rgba(77,62,240,0.5)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Start
                            <IconChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f3ff] via-[#faf8ff] to-[#f0ecff] text-zinc-900">
      {/* Top bar: question + timer + Next */}
      <div className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple/8 to-violet/8 px-4 py-2 ring-1 ring-corePurple/10">
              <IconClock className="h-4 w-4 text-corePurple" />
              <span className="text-sm font-semibold text-zinc-800">
                Question {currentIndex + 1} of {totalQuestionsCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5">
              <span className="text-xs text-zinc-500">Time:</span>
              <span className="text-sm tabular-nums text-zinc-600">
                {timeRemainingSeconds != null
                  ? `${Math.floor(timeRemainingSeconds / 60)}:${String(timeRemainingSeconds % 60).padStart(2, "0")}`
                  : `${totalDurationMinutes}:00`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => prevQuestionId && router.push(`/tests/${testId}/preview?question=${encodeURIComponent(prevQuestionId)}`)}
              disabled={!prevQuestionId}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                if (nextQuestionId) {
                  router.push(`/tests/${testId}/preview?question=${encodeURIComponent(nextQuestionId)}`);
                } else {
                  router.push(`/tests/${testId}/preview`);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(77,62,240,0.5)] ring-1 ring-black/5 transition hover:shadow-[0_6px_20px_-2px_rgba(77,62,240,0.55)] hover:brightness-105"
            >
              {nextQuestionId ? "Next" : "Submit"}
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-8">
        {question ? (
          <div className="grid min-h-[calc(100vh-140px)] gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Left: Question */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_8px_30px_-8px_rgba(77,62,240,0.12),0_2px_12px_-4px_rgba(0,0,0,0.06)] ring-1 ring-zinc-900/5">
              <div className="border-b border-zinc-100/80 bg-gradient-to-b from-zinc-50/80 to-white px-8 py-6">
                <span className="inline-block rounded-full bg-corePurple/12 px-3 py-1 text-xs font-semibold tracking-wide text-corePurple">
                  {question.skill}
                </span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900">
                  {question.title}
                </h2>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.7] text-zinc-600">
                  {question.description}
                </p>
                {question.imageUrl && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
                    <Image
                      src={question.imageUrl}
                      alt="Question reference"
                      width={600}
                      height={400}
                      className="w-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1" />
            </div>

            {/* Right: Answer / Options */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_8px_30px_-8px_rgba(77,62,240,0.12),0_2px_12px_-4px_rgba(0,0,0,0.06)] ring-1 ring-zinc-900/5">
              <div className="border-b border-zinc-100/80 bg-gradient-to-b from-zinc-50/80 to-white px-8 py-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Your answer</h3>
              </div>
              <div className="flex-1 overflow-auto p-8">
              {isMultipleChoice && question.options && question.options.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {question.options.map((opt, i) => (
                      <label
                        key={i}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md has-[:checked]:border-corePurple has-[:checked]:bg-gradient-to-br has-[:checked]:from-softLavender/50 has-[:checked]:to-corePurple/5 has-[:checked]:shadow-[0_0_0_2px_rgba(77,62,240,0.2)]"
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={opt}
                          checked={selectedOption === opt}
                          onChange={() => setSelectedOption(opt)}
                          className="h-5 w-5 border-zinc-300 text-corePurple focus:ring-corePurple"
                        />
                        <span className="text-[15px] text-zinc-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Explain your reasoning
                    </label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Why did you choose this answer?"
                      rows={4}
                      className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-[15px] leading-relaxed outline-none transition placeholder:text-zinc-400 focus:border-corePurple focus:shadow-[0_0_0_3px_rgba(77,62,240,0.12)]"
                    />
                  </div>
                </div>
              ) : isLongAnswer ? (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here. Be as detailed as you like..."
                  rows={16}
                  className="min-h-[300px] w-full rounded-xl border border-zinc-200/80 bg-white px-5 py-4 text-[15px] leading-relaxed shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-corePurple focus:shadow-[0_0_0_3px_rgba(77,62,240,0.12)] focus:ring-2 focus:ring-corePurple/20"
                />
              ) : isVoice ? (
                <>
                  <div className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-10 min-h-[280px]">
                    {!voiceRecordingStarted ? (
                      <>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-corePurple/10">
                          <IconMic className="h-10 w-10 text-corePurple" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-zinc-700">Record your voice response</p>
                          <p className="mt-1 text-xs text-zinc-500">Click the button below to start</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowVoiceIntroModal(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(77,62,240,0.4)] transition hover:brightness-105"
                        >
                          <IconMic className="h-5 w-5" />
                          Start recording
                        </button>
                      </>
                    ) : voiceCountdown !== null && voiceCountdown > 0 ? (
                      <div className="flex flex-col items-center gap-6">
                        <p className="text-sm text-zinc-600">
                          Take a moment to gather your thoughts. Recording will start automatically, or begin whenever you&apos;re ready.
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-medium tabular-nums text-zinc-400">
                            {voiceCountdown}s
                          </span>
                          <span className="text-sm text-zinc-400">to prepare</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVoiceCountdown(0)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                        >
                          <IconMic className="h-4 w-4" />
                          Start recording now
                        </button>
                      </div>
                    ) : voiceRecordingStopped ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                          <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-zinc-700">Recording saved</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                        <div className="flex items-end justify-center gap-1.5 h-20">
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
                            onClick={() => setVoiceRecordingStopped(true)}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Stop recording
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {showVoiceIntroModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
                      <div
                        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
                        onClick={() => setShowVoiceIntroModal(false)}
                        aria-hidden="true"
                      />
                      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] sm:p-8">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-corePurple/10">
                            <IconMic className="h-6 w-6 text-corePurple" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-zinc-900">Verbal question</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
                              This is a verbal question. We want to understand your process and how you think through the problem. Once you click &quot;Start question&quot;, you&apos;ll have up to 45 seconds to prepare—or begin recording right away if you&apos;re ready. Click &quot;Stop recording&quot; when you&apos;re finished.
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowVoiceIntroModal(false);
                                  setVoiceModalDismissed(true);
                                }}
                                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowVoiceIntroModal(false);
                                  setVoiceRecordingStarted(true);
                                  setVoiceCountdown(45);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-corePurple to-violet px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(77,62,240,0.4)] transition hover:brightness-105"
                              >
                                <IconMic className="h-4 w-4" />
                                Start question
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : isSimulation ? (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80">
                  <div className="flex flex-col items-center justify-center gap-4 p-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/60">
                      <IconSimulation className="h-8 w-8 text-corePurple" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Up", "Down", "Left", "Right", "Rotate", "Snap"].map((label, i) => (
                        <button
                          key={i}
                          type="button"
                          className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-corePurple/30"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500">Simulation controls — use to position the component</p>
                    <div className="h-32 w-full max-w-xs rounded-lg border-2 border-dashed border-zinc-200 bg-white/60" />
                  </div>
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-corePurple focus:shadow-[0_0_0_3px_rgba(77,62,240,0.15)]"
                />
              )}
              </div>
            </div>
          </div>
        ) : questionId ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-12 text-center">
            <p className="text-sm text-zinc-500">Question not found. It may have been removed.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-12 text-center">
            <p className="text-sm text-zinc-500">Assessment content will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
