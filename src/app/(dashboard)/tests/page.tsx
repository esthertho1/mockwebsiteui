"use client";

import * as React from "react";
import Link from "next/link";
import { ROLES } from "@/lib/roles";

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

function IconFilter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 4h16M4 10h12M6 16h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 10.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM10 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM10 15a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPencil(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 2 18 6l-10 10H4v-4l10-10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDuplicate(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 2h8a2 2 0 0 1 2 2v8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconArchive(props: React.SVGProps<SVGSVGElement>) {
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

type TestStatus = "active" | "draft" | "closed";

// Assign statuses: first 2 active, then draft, closed, active, draft, closed...
function getStatusForIndex(i: number): TestStatus {
  const cycle = ["active", "active", "draft", "closed"] as const;
  return cycle[i % cycle.length];
}

export default function TestsListPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [testCounts, setTestCounts] = React.useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    const counts: Record<string, number> = {};
    for (const r of ROLES) {
      try {
        const raw = window.localStorage.getItem(`invites:${r.id}`);
        const parsed = raw ? JSON.parse(raw) : [];
        counts[r.id] = Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        counts[r.id] = 0;
      }
    }
    setTestCounts(counts);
  }, []);

  React.useEffect(() => {
    function handleClickOutside() {
      setMenuOpen(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredTests = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ROLES;
    return ROLES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.preview.testTitle.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex h-[72px] items-center justify-between px-8">
          <h1 className="font-fustat text-2xl font-semibold text-graphite">
            Tests
          </h1>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-corePurple focus:ring-1 focus:ring-corePurple"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <IconFilter className="h-4 w-4 text-zinc-400" />
            <select className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-corePurple">
              <option>All Tests</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  TEST NAME
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  CANDIDATES
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  CREATED
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((r, i) => {
                const status = getStatusForIndex(i);
                const isActive = status === "active";
                return (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-100 transition hover:bg-zinc-50/50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/tests/${r.id}`}
                        className="font-medium text-zinc-900 hover:text-corePurple"
                      >
                        {r.preview.testTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {status === "active" && (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      )}
                      {status === "draft" && (
                        <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          Draft
                        </span>
                      )}
                      {status === "closed" && (
                        <span className="inline-flex rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500">
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {testCounts[r.id] ?? 0}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">Feb 3, 2026</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {isActive && (
                          <Link
                            href={`/tests/${r.id}/candidates?invite=1`}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                          >
                            Invite
                          </Link>
                        )}
                        <div className="relative">
                          <button
                            type="button"
                            aria-label="More"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === r.id ? null : r.id);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
                          >
                            <IconDots className="h-5 w-5" />
                          </button>
                          {menuOpen === r.id && (
                            <div
                              className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                <IconPencil className="h-4 w-4" />
                                Rename
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                <IconDuplicate className="h-4 w-4" />
                                Duplicate
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                <IconArchive className="h-4 w-4" />
                                Archive
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                <IconTrash className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
