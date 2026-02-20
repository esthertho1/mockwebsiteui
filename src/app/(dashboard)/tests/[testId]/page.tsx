"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROLES } from "@/lib/roles";

type Question = {
  id: string;
  title: string;
  skill: string;
  type: string;
  timeMinutes: number;
};

type SectionState = {
  id: string;
  title: string;
  minutes: number;
  questions: Question[];
};

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M7 5v10l8-5-8-5Z" fill="currentColor" />
    </svg>
  );
}

function Tab({ active, children }: React.PropsWithChildren<{ active?: boolean }>) {
  return (
    <span
      className={[
        "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium",
        active ? "text-zinc-900" : "text-zinc-500",
      ].join(" ")}
    >
      {children}
      {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />}
    </span>
  );
}

function seedQuestionsForRole(role: (typeof ROLES)[0]): SectionState[] {
  const base = role.preview.sections ?? [];
  const total = role.preview.durationMinutes ?? 0;
  return base.map((s, idx) => {
    const minutes = s.minutes ?? Math.max(30, Math.round(total * (idx === 0 ? 0.85 : 0.5)));
    return {
      id: `section-${idx}`,
      title: s.title,
      minutes,
      questions: [
        {
          id: `seed-${idx}`,
          title: `${s.title}: Practical system question`,
          skill: s.title.replace(/\s*\(.*?\)\s*/g, "").trim(),
          type: "Project (Generated)",
          timeMinutes: minutes,
        },
      ],
    };
  });
}

export default function TestDetailsPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [sections, setSections] = React.useState<SectionState[]>([]);

  const role = React.useMemo(() => ROLES.find((r) => r.id === testId) ?? ROLES[0], [testId]);

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(`test-sections:${testId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setSections(seedQuestionsForRole(role));
  }, [role, testId]);

  const totalMinutes = sections.reduce(
    (acc, s) => acc + s.questions.reduce((a, q) => a + q.timeMinutes, 0),
    0,
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/tests" className="hover:text-zinc-700">Tests</Link>
          <IconChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="truncate text-zinc-600">{role?.preview.testTitle ?? "Hiring Test"}</span>
        </div>

        {/* Header */}
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
            {role?.preview.testTitle ?? "Hiring Test"}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/tests/${testId}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              <IconPlay className="h-3.5 w-3.5" />
              Preview test
            </Link>
            <Link
              href={`/tests/${testId}/candidates?invite=1`}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-corePurple px-3 text-sm font-semibold text-white hover:bg-violet"
            >
              + Invite
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-zinc-200">
          <div className="flex gap-6">
            <Tab active>Questions</Tab>
            <Link href={`/tests/${testId}/candidates`} className="relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700">
              Candidates
            </Link>
            <Link href={`/tests/${testId}/insights`} className="relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700">
              Insights
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            {/* Duration */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-700">
                Test duration: <span className="text-zinc-900">{totalMinutes} mins</span>
              </div>
              <span className="text-xs font-medium text-zinc-500">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400 align-middle" />
                Active
              </span>
            </div>

            {/* Sections */}
            <div className="mt-5 border-t border-zinc-100 pt-5">
              <div className="mb-3 text-sm font-semibold text-zinc-900">
                Sections ({sections.length})
              </div>
              <div className="space-y-2">
                {sections.map((s) => {
                  const isOpen = openSection === s.id;
                  const sectionMins = s.questions.reduce((acc, q) => acc + q.timeMinutes, 0);
                  const levelMatch = s.title.match(/\(([^)]+)\)\s*$/);
                  const sectionLevel = levelMatch?.[1] ?? null;
                  const baseSectionTitle = sectionLevel
                    ? s.title.replace(/\s*\([^)]+\)\s*$/, "").trim()
                    : s.title;

                  return (
                    <div key={s.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            aria-label="Expand"
                            aria-expanded={isOpen}
                            onClick={() => setOpenSection((prev) => (prev === s.id ? null : s.id))}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50"
                          >
                            <span className={["text-lg leading-none transition-transform", isOpen ? "rotate-90" : ""].join(" ")}>
                              ›
                            </span>
                          </button>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-zinc-900">{baseSectionTitle}</div>
                            <div className="truncate text-xs text-zinc-500">{s.questions.length} question{s.questions.length !== 1 ? "s" : ""}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                          <span>{sectionMins} mins</span>
                          {sectionLevel && (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">{sectionLevel}</span>
                          )}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="border-t border-zinc-200 bg-zinc-50/30 px-4 py-4">
                          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                            <div className="grid grid-cols-[1.7fr_1fr_0.7fr_0.9fr] gap-3 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-600">
                              <div>Questions ({s.questions.length})</div>
                              <div>Type</div>
                              <div>Time</div>
                              <div>Skills</div>
                            </div>
                            <div className="divide-y divide-zinc-100">
                              {s.questions.map((q) => {
                                const displayTitle = q.title
                                  .replace(/\s*\([^)]+\)\s*/, "")
                                  .replace(/\s+/g, " ")
                                  .trim();
                                return (
                                  <div key={q.id} className="grid grid-cols-[1.7fr_1fr_0.7fr_0.9fr] gap-3 px-4 py-3 text-xs text-zinc-700">
                                    <div className="min-w-0 truncate font-medium text-zinc-800">{displayTitle}</div>
                                    <div className="text-zinc-600">{q.type}</div>
                                    <div className="text-zinc-600">{q.timeMinutes} mins</div>
                                    <div className="text-zinc-600">{q.skill}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
