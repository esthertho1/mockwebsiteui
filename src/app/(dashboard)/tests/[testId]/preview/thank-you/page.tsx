"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ThankYouPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8ff] px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-10 w-10 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">Thank you</h1>
        <p className="mt-3 text-zinc-600">
          Your assessment has been submitted successfully. We appreciate you taking the time to complete it.
        </p>
        <Link
          href={`/tests/${testId}/preview`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-corePurple px-6 py-3 text-sm font-medium text-white transition hover:brightness-105"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
