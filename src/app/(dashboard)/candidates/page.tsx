"use client";

import * as React from "react";
import Link from "next/link";
import { ROLES } from "@/lib/roles";
import { CandidateReviewModal } from "@/components/CandidateReviewModal";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 15a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13.25 13.25 17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSort(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 8 10 4l4 4M10 4v12M14 12l-4 4-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 6h14"
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
        d="M12.5 15.5 7 10l5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.6"
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
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Candidate = {
  name: string;
  email: string;
  testId: string;
  testTitle: string;
  lastActivity: string;
  dateTime: string;
};

const MOCK_CANDIDATES: Candidate[] = [
  {
    name: "Esther Thomas",
    email: "esther@colare.com",
    testId: "mechanical-design-engineer",
    testTitle: "Mechanical Design Engineer Hiring Test",
    lastActivity: "Attempted Mechanical Design Engineer Hiring Test",
    dateTime: "Feb 12, 2026 05:05 PM",
  },
  {
    name: "Esther T",
    email: "nain@colare.com",
    testId: "firmware-engineer",
    testTitle: "Firmware Engineer Hiring Test",
    lastActivity: "Recruiter scheduled an interview",
    dateTime: "Feb 11, 2026 05:36 PM",
  },
  {
    name: "—",
    email: "estherthomas2004@gmail.com",
    testId: "electrical-design-engineer",
    testTitle: "Electrical Design Engineer Hiring Test",
    lastActivity: "Sent invite for Electrical Design Engineer Hiring Test",
    dateTime: "Feb 08, 2026 07:58 PM",
  },
];

export default function CandidatesListPage() {
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [reviewCandidate, setReviewCandidate] = React.useState<{
    candidate: { name: string; email: string };
    testId: string;
    testTitle: string;
  } | null>(null);

  React.useEffect(() => {
    const list: Candidate[] = [];
    const seen = new Set<string>();
    for (const r of ROLES) {
      try {
        const raw = window.localStorage.getItem(`invites:${r.id}`);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) continue;
        for (const inv of parsed) {
          const email =
            typeof inv === "string"
              ? inv
              : inv && typeof inv === "object" && "email" in inv
                ? String(inv.email)
                : "";
          const name =
            typeof inv === "object" && inv && "name" in inv
              ? String(inv.name)
              : email.split("@")[0] ?? "—";
          if (email && !seen.has(`${email}-${r.id}`)) {
            seen.add(`${email}-${r.id}`);
            list.push({
              name: name || "—",
              email,
              testId: r.id,
              testTitle: r.preview.testTitle,
              lastActivity: r.preview.testTitle,
              dateTime: "Feb 12, 2026 05:05 PM",
            });
          }
        }
      } catch {
        // ignore
      }
    }
    setCandidates(list.length > 0 ? list : MOCK_CANDIDATES);
  }, []);

  const filteredCandidates = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.testTitle.toLowerCase().includes(q)
    );
  }, [candidates, searchQuery]);

  const displayList = filteredCandidates;

  return (
    <div className="flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex min-h-[72px] items-center justify-between px-8 py-5">
          <h1 className="font-fustat text-2xl font-semibold text-graphite">
            Candidates
          </h1>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search by name or candidate email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-corePurple focus:ring-1 focus:ring-corePurple"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  <span className="inline-flex items-center gap-1">
                    Email
                    <IconSort className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  <span className="inline-flex items-center gap-1">
                    Name
                    <IconSort className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  Last Activity
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  <span className="inline-flex items-center gap-1">
                    Date & Time
                    <IconSort className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((c, i) => (
                <tr
                  key={c.email + c.testId + i}
                  onClick={() =>
                    setReviewCandidate({
                      candidate: { name: c.name, email: c.email },
                      testId: c.testId,
                      testTitle: c.testTitle,
                    })
                  }
                  className="cursor-pointer border-b border-zinc-100 transition hover:bg-zinc-50/80"
                >
                  <td className="px-6 py-4 text-zinc-900">{c.email}</td>
                  <td className="px-6 py-4 text-zinc-900">{c.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{c.testTitle}</td>
                  <td className="px-6 py-4 text-zinc-600">{c.dateTime}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete handler
                      }}
                      aria-label="Delete"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {displayList.length > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2">
              <button
                type="button"
                disabled
                className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-400"
                aria-label="Previous page"
              >
                <IconChevronLeft className="h-4 w-4" />
              </button>
              <span className="flex h-8 min-w-[40px] items-center justify-center text-sm font-medium text-zinc-700">
                1
              </span>
              <button
                type="button"
                disabled={displayList.length <= 10}
                className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-400 disabled:opacity-50"
                aria-label="Next page"
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {reviewCandidate && (
        <CandidateReviewModal
          candidate={reviewCandidate.candidate}
          testId={reviewCandidate.testId}
          testTitle={reviewCandidate.testTitle}
          onClose={() => setReviewCandidate(null)}
        />
      )}
    </div>
  );
}
