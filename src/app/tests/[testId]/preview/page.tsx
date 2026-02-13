"use client";

import * as React from "react";
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

  React.useEffect(() => {
    if (!testId || !questionId) {
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

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-5">
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
          <IconChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-zinc-500">Preview</span>
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
              {questionId ? "Question Preview" : "Assessment Preview"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/tests/${testId}`)}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Back to questions
          </button>
        </div>

        <div className="mt-6">
          {question ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                  {question.skill}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                  {question.type}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5">
                  {question.timeMinutes} mins
                </span>
              </div>
              <div className="mb-6 text-base font-medium text-zinc-900">
                {question.description}
              </div>
              {isMultipleChoice && question.options && question.options.length > 0 ? (
                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 has-[:checked]:border-corePurple has-[:checked]:bg-softLavender/50"
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={opt}
                        checked={selectedOption === opt}
                        onChange={() => setSelectedOption(opt)}
                        className="h-4 w-4 border-zinc-300 text-corePurple focus:ring-corePurple"
                      />
                      <span className="text-sm text-zinc-800">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                />
              )}
            </div>
          ) : questionId ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center">
              <p className="text-sm text-zinc-500">
                Question not found. It may have been removed.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center">
              <p className="text-sm text-zinc-500">
                Assessment content will appear here. Click &quot;Preview
                question&quot; on a question to see it in full.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
