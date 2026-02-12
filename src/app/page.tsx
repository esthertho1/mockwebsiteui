"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-fustat text-2xl font-semibold text-graphite mb-2">
          Create Test
        </h1>
        <p className="text-sm text-zinc-600 mb-8">
          Choose a flow version to get started.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Link
            href="/v0"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition"
          >
            v0 — Simplified
          </Link>
          <Link
            href="/v1"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition"
          >
            v1 — Full flow
          </Link>
          <Link
            href="/v2"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-corePurple px-6 text-sm font-semibold text-white shadow-sm hover:bg-violet transition"
          >
            v2 — New
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          v0: Engineer type → industry → skills. v1: Role + JD. v2: New flow to customize.
        </p>
      </div>
    </div>
  );
}
