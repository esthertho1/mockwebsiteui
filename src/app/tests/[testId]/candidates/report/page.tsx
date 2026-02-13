"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

type QuestionType = "video" | "multiple-choice" | "long-answer";

const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "CAD: Fully constrained sketch with dimensioning",
    type: "Project (Generated)" as const,
    questionType: "video" as QuestionType,
    skill: "CAD",
    score: 0,
    maxScore: 75,
    status: "incorrect" as const,
    hasVideo: true,
    language: undefined as string | undefined,
    description:
      "Given a part outline, create a fully constrained sketch using proper dimensions and constraints.\n\n• Explain your datum selection and constraint strategy.\n• Ensure all degrees of freedom are removed.\n• Use best practices for sketch organization and naming.\n\nDeliverable: A fully constrained sketch with dimensions shown.",
    tags: ["CAD", "Intermediate", "Sketch", "Dimensioning"],
  },
  {
    id: "2",
    title: "GD&T: Datum selection for manufacturing",
    type: "Multiple Choice" as const,
    questionType: "multiple-choice" as QuestionType,
    skill: "GD&T",
    score: 0,
    maxScore: 5,
    status: "incorrect" as const,
    hasVideo: false,
    language: undefined as string | undefined,
    description:
      "For a bracket with a mounting face and two locating holes, which datum selection strategy is best for manufacturing repeatability?",
    tags: ["Multiple Choice", "Medium", "GD&T", "Datum", "Manufacturing"],
    options: [
      "Use the largest hole as primary datum A, mounting face as secondary B.",
      "Use the mounting face as primary datum A, one hole as secondary B, the other as tertiary C for orientation.",
      "Use all three features as equal datums with no hierarchy.",
      "Use the centroid of the hole pattern as the primary datum.",
    ],
    answer: "Use the largest hole as primary datum A, mounting face as secondary B.",
    correctAnswer: "Use the mounting face as primary datum A, one hole as secondary B, the other as tertiary C for orientation.",
  },
  {
    id: "3",
    title: "EMI/EMC: Decoupling capacitor strategy",
    type: "Long Answer" as const,
    questionType: "long-answer" as QuestionType,
    skill: "EMI/EMC",
    score: 18,
    maxScore: 30,
    status: "partial" as const,
    hasVideo: false,
    language: undefined as string | undefined,
    description:
      "Describe decoupling capacitor placement and selection for a mixed-signal PCB. Cover:\n• Capacitor values and placement strategy\n• High-frequency vs bulk decoupling\n• Considerations for analog/digital partitioning",
    answer:
      "Decoupling caps should be placed as close as possible to power pins. For high-frequency noise, 100nF ceramics work well; for bulk capacitance, 10µF low-ESR ceramics are preferred. I would add local caps at each IC power pin and ensure short via connections to the power plane. For mixed-signal, I'd separate analog and digital power domains with ferrite beads and use star grounding at a single point.",
  },
];

// Red = cheating flag, Blue = suspicious activity (positions as % of timeline)
const MOCK_VIDEO_TAGS = [
  { position: 12, type: "red" as const, timestamp: "00:15", label: "Tab switch detected" },
  { position: 35, type: "blue" as const, timestamp: "00:42", label: "CAD file pasted from external source" },
  { position: 58, type: "red" as const, timestamp: "01:08", label: "Multiple application windows detected" },
  { position: 72, type: "blue" as const, timestamp: "01:23", label: "CAD file pasted from external source" },
  { position: 88, type: "red" as const, timestamp: "01:40", label: "Tab switch detected" },
];

const SPEED_OPTIONS = [1, 2, 3, 8] as const;

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.5 4l-7 6 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 4l7 6-7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 5v10l7-5-7-5z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 4H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M14 4h2a2 2 0 012 2v2M8 8h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 10l3.5 3.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCircleCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M6 10l2.5 2.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCircleX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const testId = String(params.testId ?? "");
  const candidateEmail =
    searchParams.get("candidate") ?? "candidate@example.com";
  const candidateName =
    searchParams.get("name") ?? candidateEmail.split("@")[0] ?? "Candidate";

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<
    "suspicious" | "comments"
  >("suspicious");
  const [questionListOpen, setQuestionListOpen] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(8);
  const [hoveredTag, setHoveredTag] = React.useState<number | null>(null);
  const [speedMenuOpen, setSpeedMenuOpen] = React.useState(false);
  const [playbackPosition, setPlaybackPosition] = React.useState(15);

  const question = MOCK_QUESTIONS[currentIndex];
  const total = MOCK_QUESTIONS.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  const completedDate = searchParams.get("completed") ?? "Feb 12, 2026";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-zinc-900">
              {candidateName}
            </span>
            <span className="text-sm text-zinc-500">
              Completed {completedDate}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/tests/${testId}/candidates`}
            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-zinc-900">
              {question.title}
            </h1>
            <p className="text-xs text-zinc-500">
              Question {currentIndex + 1} of {total}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={!canGoPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((i) => Math.min(total - 1, i + 1))
            }
            disabled={!canGoNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconChevronRight className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setQuestionListOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <IconList className="h-4 w-4" />
              All Questions
            </button>

            {/* Question list dropdown - modal style */}
            {questionListOpen && (
              <>
                <div
                  className="fixed inset-0 z-20 bg-black/20"
                  aria-hidden
                  onClick={() => setQuestionListOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-[min(400px,calc(100vw-2rem))] max-h-[70vh] overflow-auto rounded-xl border border-zinc-200 bg-white shadow-xl">
            <div className="border-b border-zinc-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-zinc-900">All Questions</h3>
            </div>
            <div className="p-2">
              {MOCK_QUESTIONS.map((q, i) => {
                const isComplete = q.status === "correct";
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(i);
                      setQuestionListOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition ${
                      i === currentIndex ? "bg-zinc-100" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className="shrink-0 text-sm font-medium text-zinc-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-zinc-900">
                        {q.title}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {q.type}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isComplete ? (
                        <IconCircleCheck className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <IconCircleX className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
          </div>
        </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Status + Language + Score */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
              question.status === "correct"
                ? "bg-emerald-100 text-emerald-700"
                : question.status === "partial"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {question.status === "correct"
              ? "Correct"
              : question.status === "partial"
                ? "Partial"
                : "Incorrect"}
          </span>
          {question.language && (
            <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
              {question.language}
            </span>
          )}
          <span className="text-sm text-zinc-600">
            Score: {question.score} / {question.maxScore}
          </span>
        </div>

        {/* Two-panel layout: left = submission (video or answer), right = problem statement */}
        <div className="flex gap-5">
          {/* Left: Candidate submission - video for video questions, text for others */}
          <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            {question.questionType === "video" ? (
              <>
                <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-600">
                  Candidate submission
                </div>
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <div className="text-zinc-500 text-sm">
                    Mock video player (no playback)
                  </div>
                </div>
                {/* Playbar with red/blue tags */}
                <div className="border-t border-zinc-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    >
                      <IconPlay className="h-5 w-5" />
                    </button>
                    <span className="text-xs text-zinc-500">00:00</span>
                    <div className="relative flex-1 h-10 flex items-center">
                      <div className="relative w-full h-2 rounded-full bg-zinc-200 overflow-visible">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-corePurple transition-[width] duration-200"
                          style={{ width: `${playbackPosition}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-zinc-300 shadow transition-[left] duration-200"
                          style={{ left: `${playbackPosition}%`, marginLeft: -6 }}
                        />
                        {MOCK_VIDEO_TAGS.map((tag, idx) => (
                          <div
                            key={`${tag.position}-${tag.type}-${idx}`}
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-sm cursor-pointer z-10"
                            style={{
                              left: `${tag.position}%`,
                              marginLeft: -3,
                              backgroundColor:
                                tag.type === "red" ? "#dc2626" : "#2563eb",
                            }}
                            onMouseEnter={() => setHoveredTag(idx)}
                            onMouseLeave={() => setHoveredTag(null)}
                          >
                            {hoveredTag === idx && (
                              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-3 py-2 rounded-lg bg-zinc-800 text-white text-xs font-medium shadow-lg pointer-events-none z-20 whitespace-normal max-w-[240px] text-left">
                                {tag.timestamp} {tag.label}
                                <div
                                  className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-zinc-800"
                                  style={{ marginTop: -1 }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">01:52</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSpeedMenuOpen((o) => !o)}
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        {playbackSpeed}x
                      </button>
                      {speedMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            aria-hidden
                            onClick={() => setSpeedMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 min-w-[4rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                            {SPEED_OPTIONS.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setPlaybackSpeed(s);
                                  setSpeedMenuOpen(false);
                                }}
                                className={`block w-full px-3 py-1.5 text-left text-sm ${
                                  playbackSpeed === s
                                    ? "bg-softLavender text-corePurple font-medium"
                                    : "text-zinc-700 hover:bg-zinc-50"
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-zinc-600">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-3.5 w-3.5 rounded border-zinc-300"
                      />
                      Skip Inactivity
                    </label>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100"
                    >
                      <IconCopy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Cheating flagged
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Suspicious activity
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-600">
                  Candidate submission
                </div>
                <div className="max-h-[400px] overflow-auto">
                  {question.questionType === "multiple-choice" ? (
                    <div className="p-4 space-y-3">
                      <p className="text-sm font-medium text-zinc-700 mb-3">
                        Options (Correct answers indicated with a check mark in green):
                      </p>
                      {(question.options as string[]).map((opt) => {
                        const correctAnswer = "correctAnswer" in question ? (question as { correctAnswer?: string }).correctAnswer : question.answer;
                        const isCorrect = opt === correctAnswer;
                        const isSelected = opt === question.answer;
                        const isWrongSelection = isSelected && !isCorrect;
                        return (
                          <div
                            key={opt}
                            className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition ${
                              isCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : isWrongSelection
                                  ? "border-red-200 bg-red-50/50"
                                  : "border-zinc-200 bg-white"
                            }`}
                          >
                            <div
                              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                                isCorrect
                                  ? "border-emerald-600 bg-emerald-600"
                                  : isWrongSelection
                                    ? "border-red-400 bg-red-400"
                                    : "border-zinc-300"
                              }`}
                            />
                            <p className="flex-1 text-sm text-zinc-800">
                              {opt}
                            </p>
                            {isCorrect && (
                              <IconCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
                      {question.answer}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Problem statement */}
          <div className="w-[360px] shrink-0 rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-600">
              Problem Statement
            </div>
            <div className="max-h-[400px] overflow-auto p-4">
              <h3 className="text-base font-semibold text-zinc-900">
                {question.title}
              </h3>
              {"tags" in question && question.tags && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(question.tags as string[]).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-softLavender px-2.5 py-0.5 text-xs font-medium text-corePurple"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 text-sm text-zinc-700 whitespace-pre-wrap">
                {question.description}
              </div>
              {question.questionType !== "multiple-choice" && "options" in question && question.options && (
                <ul className="mt-3 space-y-1.5 text-sm text-zinc-600">
                  {(question.options as string[]).map((opt, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-zinc-400">
                        {String.fromCharCode(65 + i)})
                      </span>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Bottom tabs: Suspicious Activity, Comments */}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="flex gap-6 border-b border-zinc-200">
            {[
              { id: "suspicious" as const, label: "Suspicious Activity" },
              { id: "comments" as const, label: "Comments" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700",
                ].join(" ")}
              >
                {tab.label}
                {activeTab === tab.id ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
                ) : null}
              </button>
            ))}
          </div>
          <div className="p-5 text-sm text-zinc-600">
            {activeTab === "suspicious" && (
              question.questionType === "video" ? (
                <ul className="space-y-2">
                  {MOCK_VIDEO_TAGS.map((tag, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => setPlaybackPosition(tag.position)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-50"
                      >
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            tag.type === "red" ? "bg-red-500" : "bg-blue-500"
                          }`}
                        />
                        <span className="flex-1 font-medium text-zinc-800">
                          {tag.timestamp} — {tag.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          Jump to
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500">
                  No session recording for this question. Suspicious activity flags are only available for questions with video recordings.
                </p>
              )
            )}
            {activeTab === "comments" && (
              <textarea
                placeholder="Add reviewer comments..."
                rows={3}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-corePurple focus:outline-none focus:ring-1 focus:ring-corePurple"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
