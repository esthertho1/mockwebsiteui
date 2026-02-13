"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROLES } from "@/lib/roles";

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

function TabLink({
  href,
  active,
  children,
}: React.PropsWithChildren<{ href: string; active?: boolean }>) {
  return (
    <Link
      href={href}
      className={[
        "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
      ) : null}
    </Link>
  );
}

// Mock distribution: 10% buckets 0–90%, most candidates in 80-89%
const SCORE_BUCKET_LABELS = ["0-9%", "10-19%", "20-29%", "30-39%", "40-49%", "50-59%", "60-69%", "70-79%", "80-89%", "90-99%"];
const SCORE_DISTRIBUTION = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
const AVG_SCORE = 83;
const MAX_COUNT = Math.max(...SCORE_DISTRIBUTION, 1);

// Mock question-level data
const MOCK_QUESTIONS = [
  { id: "Q1", title: "CAD: Fully constrained sketch", medianScore: 0, avgScore: 0, medianTime: 0.9, avgTime: 0.9 },
  { id: "Q2", title: "GD&T: Datum selection", medianScore: 0, avgScore: 0, medianTime: 0, avgTime: 0 },
  { id: "Q3", title: "EMI/EMC: Decoupling strategy", medianScore: 0, avgScore: 0, medianTime: 0, avgTime: 0 },
];

export default function InsightsPage() {
  const params = useParams();
  const testId = String(params.testId ?? "");
  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/tests" className="hover:text-zinc-700">
            Tests
          </Link>
          <IconChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <Link
            href={`/tests/${testId}`}
            className="truncate text-zinc-600 hover:text-zinc-700"
          >
            {role?.preview.testTitle ?? "Hiring Test"}
          </Link>
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0 flex items-center gap-2">
            <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
              {role?.preview.testTitle ?? "Hiring Test"}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex gap-6">
            <TabLink href={`/tests/${testId}`} active={false}>
              Questions
            </TabLink>
            <TabLink href={`/tests/${testId}/candidates`} active={false}>
              Candidates
            </TabLink>
            <TabLink href={`/tests/${testId}/insights`} active>
              Insights
            </TabLink>
            <TabLink href={`/tests/${testId}/settings`} active={false}>
              Settings
            </TabLink>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Test Details + Test Activities */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Test Details
                </h2>
                <button
                  type="button"
                  aria-label="Menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50"
                >
                  <IconDots className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Attribute</td>
                      <td className="py-2 font-medium text-zinc-900">Value</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Name</td>
                      <td className="py-2 font-medium text-zinc-900">
                        {role?.preview.testTitle ?? "Full Stack Engineer Test"}
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Id</td>
                      <td className="py-2 font-medium text-zinc-900">
                        2297429
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Create Date</td>
                      <td className="py-2 font-medium text-zinc-900">
                        2/7/2026
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Update Date</td>
                      <td className="py-2 font-medium text-zinc-900">
                        2/10/2026
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-500">Test Duration</td>
                      <td className="py-2 font-medium text-zinc-900">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-900">
                Test Activities
              </h2>
              <div className="mt-4 flex gap-6">
                <div className="flex shrink-0 items-center gap-4">
                  <div
                    className="relative h-32 w-32 shrink-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        var(--color-corePurple) 0deg 180deg,
                        #b8aef0 180deg 360deg
                      )`,
                    }}
                  >
                    <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-xs text-zinc-500">Status</span>
                      <span className="text-lg font-semibold text-zinc-900">
                        2
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-corePurple" />
                      Passed 50%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#b8aef0" }} />
                      To Evaluate 50%
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold text-zinc-900">
                        3
                      </span>
                      <span className="text-sm text-zinc-600">
                        Total Invited
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Info" className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600">
                        <span className="text-[10px] font-semibold">i</span>
                      </button>
                      <IconDots className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold text-zinc-900">
                        2
                      </span>
                      <span className="text-sm text-zinc-600">
                        Total Attempted
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Info" className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600">
                        <span className="text-[10px] font-semibold">i</span>
                      </button>
                      <IconDots className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold text-zinc-900">
                        67%
                      </span>
                      <span className="text-sm text-zinc-600">
                        Attempt Rate
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Info" className="inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600">
                        <span className="text-[10px] font-semibold">i</span>
                      </button>
                      <IconDots className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Level Insights */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              Test Level Insights
            </h2>
            <div className="mt-5 grid gap-6 lg:grid-cols-[200px_1fr]">
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-zinc-200 bg-softLavender/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-zinc-900">0</span>
                    <IconDots className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
                    Median Score
                    <button
                      type="button"
                      aria-label="Info"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600"
                    >
                      <span className="text-[10px] font-semibold">i</span>
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-softLavender/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-zinc-900">
                      1.5
                    </span>
                    <IconDots className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
                    Median Attempt Time (minutes)
                    <button
                      type="button"
                      aria-label="Info"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600"
                    >
                      <span className="text-[10px] font-semibold">i</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Distribution of Candidate Score - styled like reference */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5">
                <h3 className="text-base font-semibold text-zinc-900">
                  Average score: {AVG_SCORE}%
                </h3>
                <div className="mt-4">
                  <div className="flex justify-between gap-2">
                    {SCORE_BUCKET_LABELS.map((label, i) => {
                      const count = SCORE_DISTRIBUTION[i] ?? 0;
                      const barHeight =
                        MAX_COUNT > 0 ? Math.max((count / MAX_COUNT) * 72, 0) : 2;
                      return (
                        <div
                          key={label}
                          className="flex flex-1 flex-col items-center"
                        >
                          <span className="text-xs font-medium text-zinc-800">
                            {count}
                          </span>
                          <div className="mt-1 flex h-20 w-full flex-1 items-end justify-center">
                            <div
                              className="w-full min-w-[8px] max-w-[24px] rounded-t"
                              style={{
                                height: count > 0 ? barHeight : 2,
                                backgroundColor:
                                  count > 0 ? "#b8aef0" : "#e4e4e7",
                              }}
                            />
                          </div>
                          <span className="mt-2 text-[10px] text-zinc-500">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 border-t border-zinc-100 pt-2 text-center text-xs text-zinc-500">
                    Score bucket
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Level Insights */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Question Level Insights
            </h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Median Score per Question
                </h3>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {MOCK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <span className="text-[10px] text-zinc-500">
                        {q.medianScore}
                      </span>
                      <div
                        className="mt-1 w-full max-w-[32px] rounded-t bg-softLavender"
                        style={{
                          height: Math.max(q.medianScore * 4, 2),
                        }}
                      />
                      <span className="mt-1 truncate text-[10px] text-zinc-500 max-w-full">
                        {q.id}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Questions</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Average Score per Question
                </h3>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {MOCK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <span className="text-[10px] text-zinc-500">
                        {q.avgScore}
                      </span>
                      <div
                        className="mt-1 w-full max-w-[32px] rounded-t bg-softLavender"
                        style={{
                          height: Math.max(q.avgScore * 4, 2),
                        }}
                      />
                      <span className="mt-1 truncate text-[10px] text-zinc-500 max-w-full">
                        {q.id}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Questions</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Median Time per Question (Minutes)
                </h3>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {MOCK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <span className="text-[10px] text-zinc-500">
                        {q.medianTime}
                      </span>
                      <div
                        className="mt-1 w-full max-w-[32px] rounded-t bg-corePurple"
                        style={{
                          height: Math.max(q.medianTime * 24, 2),
                        }}
                      />
                      <span className="mt-1 truncate text-[10px] text-zinc-500 max-w-full">
                        {q.id}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Questions</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Average Time per Question (Minutes)
                </h3>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {MOCK_QUESTIONS.map((q) => (
                    <div
                      key={q.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <span className="text-[10px] text-zinc-500">
                        {q.avgTime}
                      </span>
                      <div
                        className="mt-1 w-full max-w-[32px] rounded-t bg-corePurple"
                        style={{
                          height: Math.max(q.avgTime * 24, 2),
                        }}
                      />
                      <span className="mt-1 truncate text-[10px] text-zinc-500 max-w-full">
                        {q.id}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-zinc-500">Questions</p>
              </div>
            </div>
          </div>

          {/* Performance Funnel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              Performance Funnel - All Candidates
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl">
              <div className="bg-corePurple py-3 text-center text-sm font-medium text-white">
                Test Invited: 3 (100%)
              </div>
              <div className="bg-violet py-3 text-center text-sm font-medium text-white">
                Test Link Clicked: 2 (67%)
              </div>
              <div className="bg-softLavender py-3 text-center text-sm font-medium text-corePurple">
                Test Attempted: 2 (100%)
              </div>
              <div className="border border-corePurple/30 bg-softLavender/50 py-3 text-center text-sm font-medium text-corePurple">
                Test Attempted At Least One Question: 2 (100%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
