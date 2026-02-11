"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
        "relative px-1 pb-3 text-sm font-medium transition",
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700",
      ].join(" ")}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-corePurple" />
      ) : null}
    </Link>
  );
}

export default function CandidatesPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";
  const router = useRouter();

  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const [invites, setInvites] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(`invites:${testId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setInvites(
          parsed
            .map((x) => (typeof x === "string" ? x : ""))
            .map((x) => x.trim())
            .filter(Boolean),
        );
      }
    } catch {
      setInvites([]);
    }
  }, [testId]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-700">
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
          <div className="min-w-0">
            <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
              {role?.preview.testTitle ?? "Hiring Test"}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(`/tests/${testId}`)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Back to questions
            </button>
            <button
              type="button"
              aria-label="More"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              <IconDots className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex items-end gap-5">
            <TabLink href={`/tests/${testId}`} active={false}>
              Questions
            </TabLink>
            <TabLink href={`/tests/${testId}/candidates`} active>
              Candidates
            </TabLink>
            <TabLink href={`/tests/${testId}`} active={false}>
              Settings
            </TabLink>
          </div>
        </div>

        {/* Filters removed per request: no left sidebar */}
        <div className="mt-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">
                Invited candidates ({invites.length})
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200">
              <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-3 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-600">
                <div>Candidate</div>
                <div>Status</div>
                <div>Invited</div>
              </div>

              {invites.length === 0 ? (
                <div className="px-4 py-8 text-sm text-zinc-500">
                  No invited candidates yet.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {invites.map((email) => (
                    <div
                      key={email}
                      className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-3 px-4 py-3 text-sm text-zinc-800"
                    >
                      <div className="min-w-0 truncate font-medium">
                        {email}
                      </div>
                      <div className="text-zinc-600">Invited</div>
                      <div className="text-zinc-600">Just now</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

