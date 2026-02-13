"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

function IconExternal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 4H4.5A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17h10A1.5 1.5 0 0 0 16 15.5V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11 3h6v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11 17 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M15 6.5a2 2 0 1 0-1.9-2.6L7.8 7.2a2 2 0 0 0 0 5.6l5.3 3.3A2 2 0 1 0 14.9 14l-5.3-3.3a2 2 0 0 0 0-1.4L15 6.5Z"
        fill="currentColor"
        opacity="0.65"
      />
      <path
        d="M15 6.5a2 2 0 1 0-1.9-2.6L7.8 7.2a2 2 0 0 0 0 5.6l5.3 3.3A2 2 0 1 0 14.9 14l-5.3-3.3a2 2 0 0 0 0-1.4L15 6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 13V3M10 13l4-4M10 13l-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompactHistoryItem({
  label,
  timestamp,
}: {
  label: string;
  timestamp: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-zinc-800">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-corePurple" />
        <span>{label}</span>
      </div>
      <span className="shrink-0 text-zinc-500">{timestamp}</span>
    </div>
  );
}

function SkillRow(props: {
  label: string;
  points: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="font-medium text-zinc-900">{props.label}</div>
        <div className="text-zinc-500">{props.points}</div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-4 text-sm text-zinc-600">
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={["h-full", props.colorClass].join(" ")}
              style={{ width: `${props.value}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type CandidateReviewModalCandidate = {
  name: string;
  email: string;
};

export function CandidateReviewModal({
  candidate,
  testId,
  testTitle,
  onClose,
}: {
  candidate: CandidateReviewModalCandidate;
  testId: string;
  testTitle: string;
  onClose: () => void;
}) {
  const [tab, setTab] = React.useState<"performance" | "activity">("performance");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 flex h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5">
          <div className="min-w-0">
            <div className="font-fustat truncate text-xl font-semibold text-graphite">
              {candidate.name || "—"}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              Assessment review (mock) • {testTitle}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              <IconExternal className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              <IconShare className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Download"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              <IconDownload className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-50"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="flex gap-6 border-b border-zinc-200">
              <button
                type="button"
                onClick={() => setTab("performance")}
                className={[
                  "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
                  tab === "performance"
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700",
                ].join(" ")}
              >
                Performance Overview
                {tab === "performance" ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => setTab("activity")}
                className={[
                  "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
                  tab === "activity"
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700",
                ].join(" ")}
              >
                Candidate Details
                {tab === "activity" ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
                ) : null}
              </button>
            </div>

            {tab === "activity" ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="text-sm font-semibold text-zinc-900">
                      Candidate Details
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">Full Name</span>
                        <span className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2">
                          {candidate.name || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">Email</span>
                        <span className="font-medium text-zinc-900">
                          {candidate.email || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">Work Experience</span>
                        <span className="font-medium text-zinc-900">2 years</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="text-xs font-semibold text-zinc-900">
                      Assessment Timeline
                    </div>
                    <div className="mt-3 space-y-2">
                      <CompactHistoryItem
                        label="Assessment completed"
                        timestamp="2/11/2026, 6:17 PM"
                      />
                      <CompactHistoryItem
                        label="Assessment started"
                        timestamp="2/11/2026, 6:15 PM"
                      />
                      <CompactHistoryItem
                        label="Assessment sent"
                        timestamp="2/11/2026, 5:15 PM"
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="text-sm font-semibold text-zinc-900">
                    Interviewer Comments
                  </div>
                  <textarea
                    placeholder="Add notes or feedback from the interview..."
                    rows={4}
                    className="mt-4 w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-corePurple focus:outline-none focus:ring-1 focus:ring-corePurple"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Score
                    </div>
                    <div className="mt-2 text-xl font-semibold text-zinc-900">
                      200/240 <span className="text-zinc-500">(83%)</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div className="h-full w-[83%] bg-emerald-500" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Rank
                    </div>
                    <div className="mt-2 text-xl font-semibold text-zinc-900">
                      1 <span className="text-zinc-500">/ 1</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Integrity Issues
                    </div>
                    <div className="mt-2 text-xl font-semibold text-zinc-900">
                      — <span className="text-zinc-500">0 flags</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-zinc-900">
                      Report
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <SkillRow
                      label="Circuit reasoning"
                      points="72 / 100pts"
                      value={72}
                      colorClass="bg-softLavender"
                    />
                    <SkillRow
                      label="EMI/EMC intuition"
                      points="54 / 100pts"
                      value={54}
                      colorClass="bg-softLavender"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white">
                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="text-sm font-semibold text-zinc-900">
                      Questions
                    </div>
                    <Link
                      href={`/tests/${testId}/candidates/report?candidate=${encodeURIComponent(candidate.email)}&name=${encodeURIComponent(candidate.name)}&completed=Feb%2012%2C%202026`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                    >
                      View Detailed Report
                    </Link>
                  </div>
                  <div className="border-t border-zinc-200">
                    <div className="grid grid-cols-[60px_1.4fr_1fr_120px_90px] gap-3 bg-zinc-50 px-5 py-3 text-xs font-semibold text-zinc-600">
                      <div>No.</div>
                      <div>Question</div>
                      <div>Skills</div>
                      <div>Score</div>
                      <div>Status</div>
                    </div>
                    <div className="grid grid-cols-[60px_1.4fr_1fr_120px_90px] gap-3 px-5 py-4 text-sm text-zinc-800">
                      <div className="text-zinc-500">1</div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-zinc-900">
                          Schematic review
                        </div>
                      </div>
                      <div className="text-sm text-zinc-700">Schematic Review</div>
                      <div className="text-zinc-700">0/75</div>
                      <div className="text-zinc-500">×</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-zinc-200 bg-white px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm font-medium text-zinc-700">
                  Candidate Status
                </div>
                <button
                  type="button"
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                >
                  Passed
                </button>
                <button
                  type="button"
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Failed
                </button>
                <button
                  type="button"
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  To evaluate
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:underline"
              >
                <span className="text-lg leading-none">＋</span> Create Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
