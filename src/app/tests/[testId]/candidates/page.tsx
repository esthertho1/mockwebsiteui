"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m14 14 4 4"
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

function IconRefresh(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.5 10a6.5 6.5 0 1 1-2-4.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16.5 4v4h-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      <div className="flex items-center gap-2 min-w-0">
        <span className="h-2 w-2 shrink-0 rounded-full bg-corePurple" />
        <span>{label}</span>
      </div>
      <span className="shrink-0 text-zinc-500">{timestamp}</span>
    </div>
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

function parseCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function extractEmailsFromCsv(csvText: string) {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headerCells = parseCsvLine(lines[0]).map((c) => c.toLowerCase());
  const emailIdx = headerCells.findIndex((c) => c.includes("email"));
  const startRow = emailIdx >= 0 ? 1 : 0;
  const idx = emailIdx >= 0 ? emailIdx : 0;
  const emails: string[] = [];
  for (let i = startRow; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const candidate = (cells[idx] ?? "").trim();
    if (candidate) emails.push(candidate);
  }
  return emails;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailToDisplayName(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return email;
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

export default function CandidatesPage() {
  const params = useParams<{ testId: string }>();
  const testId = params?.testId ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const invitesStorageKey = React.useMemo(() => `invites:${testId}`, [testId]);
  const [invites, setInvites] = React.useState<
    Array<{ name: string; email: string }>
  >([]);
  const [selectedCandidates, setSelectedCandidates] = React.useState<
    Set<string>
  >(new Set());
  const inviteParam = searchParams.get("invite") === "1";

  const [inviteStep, setInviteStep] = React.useState<"candidates" | "preview">(
    "candidates",
  );
  const [inviteRows, setInviteRows] = React.useState<
    Array<{ name: string; email: string }>
  >([{ name: "", email: "" }]);
  const [inviteCandidates, setInviteCandidates] = React.useState<
    Array<{ name: string; email: string }>
  >([]);
  const [inviteEmailSubject, setInviteEmailSubject] = React.useState("");
  const [inviteEmailBody, setInviteEmailBody] = React.useState("");
  const [csvPopoverOpen, setCsvPopoverOpen] = React.useState(false);
  const [csvPopoverAnchor, setCsvPopoverAnchor] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [lastCsvImport, setLastCsvImport] = React.useState<{
    fileName: string;
    imported: number;
  } | null>(null);
  const csvInputRef = React.useRef<HTMLInputElement | null>(null);
  const csvTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const csvPopoverRef = React.useRef<HTMLDivElement | null>(null);

  const [customDurationMinutes, setCustomDurationMinutes] = React.useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusChip, setStatusChip] = React.useState<
    "all" | "invited" | "to_review" | "rejected" | "passed"
  >("all");

  const [reviewCandidate, setReviewCandidate] = React.useState<{
    name: string;
    email: string;
  } | null>(null);
  const [reviewTopTab, setReviewTopTab] = React.useState<
    "performance" | "activity"
  >("performance");
  const [reviewPanelOpen, setReviewPanelOpen] = React.useState(true);

  function openCandidateReview(candidate: { name: string; email: string }) {
    setReviewTopTab("performance");
    setReviewPanelOpen(true);
    setReviewCandidate(candidate);
  }

  React.useEffect(() => {
    if (!reviewCandidate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReviewCandidate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reviewCandidate]);

  const showInviteForm = inviteParam && inviteStep === "candidates";
  const showEmailPreview = inviteParam && inviteStep === "preview";

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(`invites:${testId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        const items: Array<{ name: string; email: string }> = parsed
          .filter(Boolean)
          .map((x) => {
            if (typeof x === "string") {
              const e = x.trim().toLowerCase();
              return e && isValidEmail(e)
                ? { name: emailToDisplayName(e), email: e }
                : null;
            }
            if (x && typeof x === "object" && "email" in x) {
              const e = String((x as { email?: string }).email ?? "")
                .trim()
                .toLowerCase();
              const n = String((x as { name?: string }).name ?? "").trim();
              return e && isValidEmail(e)
                ? { name: n || emailToDisplayName(e), email: e }
                : null;
            }
            return null;
          })
          .filter(Boolean) as Array<{ name: string; email: string }>;
        setInvites(items);
      }
    } catch {
      setInvites([]);
    }
  }, [testId]);

  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(`test-duration:${testId}`);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n > 0) setCustomDurationMinutes(n);
      }
    } catch {
      // ignore
    }
  }, [testId]);

  React.useLayoutEffect(() => {
    if (!csvPopoverOpen || !csvTriggerRef.current) return;
    const rect = csvTriggerRef.current.getBoundingClientRect();
    const popoverWidth = 320;
    const left = Math.max(
      16,
      Math.min(rect.right - popoverWidth, window.innerWidth - popoverWidth - 16),
    );
    setCsvPopoverAnchor({ top: rect.bottom + 8, left });
  }, [csvPopoverOpen]);

  React.useEffect(() => {
    if (!csvPopoverOpen) return;
    function handleClickOutside(ev: MouseEvent) {
      const el = ev.target as Node;
      if (
        csvPopoverRef.current &&
        !csvPopoverRef.current.contains(el) &&
        csvTriggerRef.current &&
        !csvTriggerRef.current.contains(el)
      ) {
        setCsvPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [csvPopoverOpen]);

  const defaultInviteEmail = React.useMemo(() => {
    const title = role?.preview.testTitle ?? "Hiring Test";
    const duration =
      customDurationMinutes ?? role?.preview.durationMinutes ?? 60;
    return {
      subject: `Your ${title} Invitation`,
      body: `Hi,

Thank you for your interest. You've been invited to take the **${title}** assessment.

Here's what you need to know:
• **Timeline:** Please complete the assessment within 7 calendar days, or as discussed with your recruiter.
• **Practice Makes Perfect:** We've included a sample test where you can explore the environment and practice before starting the official test.

A few tips for success:
• **Create the Right Environment:** Set up in a quiet, private space where you can focus.
• **Understand Each Question:** Take a moment to carefully read each question before diving in.
• **Avoid Disruptions:** Once you start, complete the test in one uninterrupted session.

Duration: ${duration} min

[Start Test] - You can use this test link to access the test at any time.

For any technical queries, please refer to FAQ or contact support. For other inquiries please reply to this email to contact the individual who sent you the invitation.`,
    };
  }, [role?.preview.testTitle, role?.preview.durationMinutes, customDurationMinutes]);

  function addInviteRow(rowIndex: number) {
    const row = inviteRows[rowIndex];
    if (!row || !isValidEmail(row.email.trim())) return;
    if (rowIndex !== inviteRows.length - 1) return;
    const email = row.email.trim().toLowerCase();
    const name =
      row.name.trim() || emailToDisplayName(email);
    setInviteCandidates((prev) => {
      if (prev.some((c) => c.email === email)) return prev;
      const next = [...prev, { name, email }];
      try {
        window.localStorage.setItem(invitesStorageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setInviteRows((prev) => [...prev, { name: "", email: "" }]);
  }

  function handleNextToPreview() {
    const fromRows = inviteRows
      .filter((r) => r.email.trim() && isValidEmail(r.email.trim()))
      .map((r) => ({
        name: r.name.trim() || emailToDisplayName(r.email.trim()),
        email: r.email.trim().toLowerCase(),
      }));
    const fromCsv = inviteCandidates.filter(
      (c) => !fromRows.some((r) => r.email === c.email),
    );
    const seen = new Set<string>();
    const finalCandidates: Array<{ name: string; email: string }> = [];
    for (const c of [...fromRows, ...fromCsv]) {
      if (seen.has(c.email)) continue;
      seen.add(c.email);
      finalCandidates.push(c);
    }
    if (finalCandidates.length === 0) return;
    try {
      window.localStorage.setItem(
        invitesStorageKey,
        JSON.stringify(finalCandidates),
      );
    } catch {
      // ignore
    }
    setInviteCandidates(finalCandidates);
    if (!inviteEmailSubject)
      setInviteEmailSubject(defaultInviteEmail.subject);
    if (!inviteEmailBody) setInviteEmailBody(defaultInviteEmail.body);
    setInviteStep("preview");
  }

  function handleSendInvites() {
    try {
      window.localStorage.setItem(
        invitesStorageKey,
        JSON.stringify(inviteCandidates),
      );
    } catch {
      // ignore
    }
    setInvites(inviteCandidates);
    setInviteStep("candidates");
    router.replace(`/tests/${testId}/candidates`, { scroll: false });
  }

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
            <button
              type="button"
              aria-label="Edit title"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path
                  d="M11.5 4.5 15.5 8.5 5.5 18.5 1.5 19 2.5 15 11.5 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => router.push(`/tests/${testId}/preview`)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Try Test
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(`/tests/${testId}/candidates?invite=1`)
              }
              className="inline-flex h-9 items-center justify-center rounded-lg bg-corePurple px-3 text-sm font-semibold text-white hover:bg-violet"
            >
              + Invite
            </button>
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex gap-6">
            <TabLink href={`/tests/${testId}`} active={false}>
              Questions
            </TabLink>
            <TabLink href={`/tests/${testId}/candidates`} active>
              Candidates
            </TabLink>
            <TabLink href={`/tests/${testId}/insights`} active={false}>
              Insights
            </TabLink>
            <TabLink href={`/tests/${testId}/settings`} active={false}>
              Settings
            </TabLink>
          </div>
        </div>

        <div className="mt-6">
          {showInviteForm ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-zinc-900">
                Invite candidates
              </h2>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm font-medium text-zinc-800">
                  <div>Name</div>
                  <div>
                    Email <span className="text-red-500">*</span>
                  </div>
                </div>
                {inviteRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-4"
                  >
                    <div>
                      <input
                        value={row.name}
                        onChange={(e) => {
                          setInviteRows((prev) => {
                            const next = [...prev];
                            next[idx] = { ...next[idx], name: e.target.value };
                            return next;
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInviteRow(idx);
                          }
                        }}
                        placeholder="Hermione Granger"
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                      />
                    </div>
                    <input
                      value={row.email}
                      onChange={(e) => {
                        setInviteRows((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], email: e.target.value };
                          return next;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addInviteRow(idx);
                        }
                      }}
                      placeholder="hermione@colare.com"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end">
                <div className="relative">
                  <button
                    ref={csvTriggerRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCsvPopoverOpen((open) => !open);
                    }}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-800"
                  >
                    Import CSV
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-500">
                      ?
                    </span>
                  </button>
                  {csvPopoverOpen &&
                    csvPopoverAnchor &&
                    typeof document !== "undefined" &&
                    createPortal(
                      <div
                        ref={csvPopoverRef}
                        className="fixed z-[60] w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-lg"
                        style={{
                          top: csvPopoverAnchor.top,
                          left: csvPopoverAnchor.left,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-900">
                            Sample Format:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const csv =
                                "Email,Name\nhermione@colare.com,Hermione Granger";
                              const blob = new Blob([csv], {
                                type: "text/csv",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "candidates-sample.csv";
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="text-sm font-medium text-corePurple hover:underline"
                          >
                            Download
                          </button>
                        </div>
                        <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 text-xs">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-zinc-50">
                                <th className="border-b border-r border-zinc-200 px-3 py-2 text-left font-semibold">
                                  Email
                                </th>
                                <th className="border-b border-zinc-200 px-3 py-2 text-left font-semibold">
                                  Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-b border-r border-zinc-200 px-3 py-2">
                                  hermione@colare.com
                                </td>
                                <td className="border-b border-zinc-200 px-3 py-2">
                                  Hermione Granger
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-600">
                          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-300 text-zinc-600">
                            i
                          </span>
                          Maximum size limit: 2MB
                        </div>
                        <button
                          type="button"
                          onClick={() => csvInputRef.current?.click()}
                          className="mt-3 w-full rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-3 text-sm font-semibold text-zinc-700 hover:border-corePurple hover:bg-softLavender/30 hover:text-corePurple"
                        >
                          Click to upload CSV file
                        </button>
                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setCsvPopoverOpen(false)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              csvInputRef.current?.click();
                              setCsvPopoverOpen(false);
                            }}
                            className="rounded-lg bg-corePurple px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet"
                          >
                            Upload CSV
                          </button>
                        </div>
                      </div>,
                      document.body,
                    )}
                </div>
              </div>

              <input
                ref={csvInputRef}
                type="file"
                className="hidden"
                accept=".csv,text/csv"
                onChange={async (e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (!file) return;
                  const csv = await file.text();
                  const candidates = extractEmailsFromCsv(csv);
                  const newRows: Array<{ name: string; email: string }> = [];
                  const seen = new Set(inviteCandidates.map((c) => c.email));
                  for (const c of candidates) {
                    const norm = c.trim().toLowerCase();
                    if (!norm || !isValidEmail(norm) || seen.has(norm)) continue;
                    seen.add(norm);
                    newRows.push({
                      name: emailToDisplayName(norm),
                      email: norm,
                    });
                  }
                  setInviteCandidates((prev) => {
                    const byEmail = new Map(prev.map((c) => [c.email, c]));
                    for (const r of newRows) byEmail.set(r.email, r);
                    return Array.from(byEmail.values());
                  });
                  setLastCsvImport({
                    fileName: file.name,
                    imported: newRows.length,
                  });
                  setInviteRows((prev) => {
                    const keep = prev.slice(0, -1);
                    const lastRow = prev[prev.length - 1];
                    const hasLast = lastRow?.email?.trim();
                    return [
                      ...keep,
                      ...(hasLast ? [lastRow] : []),
                      ...newRows,
                      { name: "", email: "" },
                    ];
                  });
                  e.currentTarget.value = "";
                }}
              />

              {lastCsvImport ? (
                <div className="mt-2 text-xs text-zinc-600">
                  Imported{" "}
                  <span className="font-semibold">{lastCsvImport.imported}</span>{" "}
                  from{" "}
                  <span className="font-medium">{lastCsvImport.fileName}</span>.
                </div>
              ) : null}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                    disabled={
                      inviteRows.every(
                        (r) =>
                          !r.email.trim() || !isValidEmail(r.email.trim()),
                    ) && inviteCandidates.length === 0
                  }
                  onClick={handleNextToPreview}
                  className={[
                    "inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold",
                    inviteRows.every(
                      (r) =>
                        !r.email.trim() || !isValidEmail(r.email.trim()),
                    ) && inviteCandidates.length === 0
                      ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                      : "bg-corePurple text-white hover:bg-violet",
                  ].join(" ")}
                >
                  Next step: preview invitation
                </button>
              </div>
            </div>
          ) : showEmailPreview ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-zinc-900">
                Preview invitation
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Subject
                  </label>
                  <input
                    value={inviteEmailSubject}
                    onChange={(e) => setInviteEmailSubject(e.target.value)}
                    placeholder="Your test invitation"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Email body
                  </label>
                  <p className="mb-2 text-xs text-zinc-500">
                    Press &apos;fn + option + O&apos; for accessibility instructions
                    in the editor.
                  </p>
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50">
                    <textarea
                      value={inviteEmailBody}
                      onChange={(e) => setInviteEmailBody(e.target.value)}
                      rows={18}
                      className="w-full resize-y rounded-xl border-0 bg-transparent p-4 text-sm text-zinc-900 outline-none focus:ring-0"
                      placeholder="Hi,\n\nThank you for your interest..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={() => setInviteStep("candidates")}
                  className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSendInvites}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-corePurple px-6 text-sm font-semibold text-white hover:bg-violet"
                >
                  Send invites
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
                {/* Top chips - counts match actual status: all invited = Invited chip only */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {[
                    {
                      id: "all" as const,
                      label: "All",
                      count: invites.length,
                    },
                    {
                      id: "invited" as const,
                      label: "Invited",
                      count: invites.length,
                    },
                    {
                      id: "to_review" as const,
                      label: "To review",
                      count: 0,
                    },
                    { id: "rejected" as const, label: "Rejected", count: 0 },
                    { id: "passed" as const, label: "Passed", count: 0 },
                  ].map(({ id, label, count }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setStatusChip(id)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
                        statusChip === id
                          ? "bg-corePurple text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                      ].join(" ")}
                    >
                      {label}
                      <span
                        className={[
                          "rounded-full px-1.5 text-xs",
                          statusChip === id
                            ? "bg-white/20"
                            : "bg-zinc-200/80 text-zinc-600",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or tag"
                      className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <IconRefresh className="h-4 w-4" />
                      Refresh
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <IconDownload className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                  <div className="grid grid-cols-[auto_minmax(220px,360px)_90px_70px_minmax(160px,1fr)_100px_110px_32px] gap-3 bg-zinc-50/80 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          invites.length > 0 &&
                          invites.every((c) => selectedCandidates.has(c.email))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCandidates(
                              new Set(invites.map((c) => c.email)),
                            );
                          } else {
                            setSelectedCandidates(new Set());
                          }
                        }}
                        className="h-4 w-4 rounded border-zinc-300 text-corePurple focus:ring-corePurple"
                      />
                    </div>
                    <div className="whitespace-nowrap">Candidate</div>
                    <div className="whitespace-nowrap">Status</div>
                    <div className="whitespace-nowrap">Score</div>
                    <div className="whitespace-nowrap">Invited by</div>
                    <div className="whitespace-nowrap">Invited on</div>
                    <div className="whitespace-nowrap">Invitation expiry</div>
                    <div />
                  </div>

                  {invites
                    .filter(
                      (c) =>
                        (statusChip === "all" || statusChip === "invited") &&
                        (!searchQuery.trim() ||
                          c.name
                            .toLowerCase()
                            .includes(searchQuery.trim().toLowerCase()) ||
                          c.email
                            .toLowerCase()
                            .includes(searchQuery.trim().toLowerCase())),
                    )
                    .length === 0 ? (
                    <div className="px-4 py-12 text-center text-sm text-zinc-500">
                      No invited candidates yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {invites
                        .filter(
                          (c) =>
                            (statusChip === "all" || statusChip === "invited") &&
                            (!searchQuery.trim() ||
                              c.name
                                .toLowerCase()
                                .includes(searchQuery.trim().toLowerCase()) ||
                              c.email
                                .toLowerCase()
                                .includes(searchQuery.trim().toLowerCase())),
                        )
                        .map((c) => (
                          <div
                            key={c.email}
                            onClick={() =>
                              openCandidateReview({
                                name: c.name || emailToDisplayName(c.email),
                                email: c.email,
                              })
                            }
                            className="grid cursor-pointer grid-cols-[auto_minmax(220px,360px)_90px_70px_minmax(160px,1fr)_100px_110px_32px] gap-3 px-5 py-4 text-sm text-zinc-800 transition-colors hover:bg-zinc-50/50"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.has(c.email)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const next = new Set(selectedCandidates);
                                  if (e.target.checked) {
                                    next.add(c.email);
                                  } else {
                                    next.delete(c.email);
                                  }
                                  setSelectedCandidates(next);
                                }}
                                className="h-4 w-4 rounded border-zinc-300 text-corePurple focus:ring-corePurple"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="break-words font-medium text-zinc-900">
                                {c.name || emailToDisplayName(c.email)}
                              </div>
                              <div className="mt-0.5 break-words text-xs text-zinc-500">
                                {c.email}
                              </div>
                            </div>
                            <div className="whitespace-nowrap">
                              <span className="inline-flex items-center rounded-full bg-softLavender px-2 py-0.5 text-xs font-medium text-corePurple">
                                Invited
                              </span>
                            </div>
                            <div className="whitespace-nowrap text-zinc-400">—</div>
                            <div className="flex items-center gap-2 whitespace-nowrap text-zinc-600">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600">
                                N
                              </span>
                              Nain Abdi
                            </div>
                            <div className="whitespace-nowrap text-zinc-600">
                              {new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                            <div className="whitespace-nowrap text-zinc-600">
                              {new Date(
                                Date.now() + 14 * 24 * 60 * 60 * 1000,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                            <div className="flex items-center">
                              <button
                                type="button"
                                aria-label="View"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCandidateReview({
                                    name: c.name || emailToDisplayName(c.email),
                                    email: c.email,
                                  });
                                }}
                                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                              >
                                <IconArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {invites.length > 0 && (
                    <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2">
                      <div className="text-xs text-zinc-500">
                        1-{invites.length} of {invites.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled
                          className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-400"
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-4 w-4"
                          >
                            <path
                              d="M12.5 4.5 7 10l5.5 5.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span className="flex h-8 min-w-[32px] items-center justify-center rounded bg-zinc-100 text-sm font-medium text-zinc-900">
                          1
                        </span>
                        <button
                          type="button"
                          disabled
                          className="inline-flex h-8 w-8 items-center justify-center rounded text-zinc-400"
                        >
                          <span className="sr-only">Next</span>
                          <IconChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {selectedCandidates.size > 0 && (
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const next = invites.filter(
                          (c) => !selectedCandidates.has(c.email),
                        );
                        try {
                          window.localStorage.setItem(
                            invitesStorageKey,
                            JSON.stringify(next),
                          );
                        } catch {
                          // ignore
                        }
                        setInvites(next);
                        setSelectedCandidates(new Set());
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Delete ({selectedCandidates.size})
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {reviewCandidate && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setReviewCandidate(null)}
                className="absolute inset-0 bg-black/40"
              />
              <div className="relative z-10 flex h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5">
                  <div className="min-w-0">
                    <div className="font-fustat truncate text-xl font-semibold text-graphite">
                      {reviewCandidate.name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      Assessment review (mock) • {role?.preview.testTitle}
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
                      onClick={() => setReviewCandidate(null)}
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
                      onClick={() => setReviewTopTab("performance")}
                      className={[
                        "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
                        reviewTopTab === "performance"
                          ? "text-zinc-900"
                          : "text-zinc-500 hover:text-zinc-700",
                      ].join(" ")}
                    >
                      Performance Overview
                      {reviewTopTab === "performance" ? (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewTopTab("activity")}
                      className={[
                        "relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium transition",
                        reviewTopTab === "activity"
                          ? "text-zinc-900"
                          : "text-zinc-500 hover:text-zinc-700",
                      ].join(" ")}
                    >
                      Candidate Details
                      {reviewTopTab === "activity" ? (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
                      ) : null}
                    </button>
                  </div>

                  {reviewTopTab === "activity" ? (
                    <div className="mt-5 space-y-5">
                      {/* Candidate Details + Assessment Timeline side by side */}
                      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                          <div className="text-sm font-semibold text-zinc-900">
                            Candidate Details
                          </div>
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-500">Full Name</span>
                              <span className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2">
                                {reviewCandidate.name || "—"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-500">Email</span>
                              <span className="font-medium text-zinc-900">
                                {reviewCandidate.email || "—"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-500">Work Experience</span>
                              <span className="font-medium text-zinc-900">
                                2 years
                              </span>
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
                              label="Assessment opened"
                              timestamp="2/11/2026, 6:15 PM"
                            />
                            <CompactHistoryItem
                              label="Assessment sent"
                              timestamp="2/11/2026, 5:15 PM"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interviewer comments */}
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
                      {/* KPI cards */}
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
                          <div className="mt-2 text-sm text-zinc-500">
                            Benchmarking (mock) will appear here.
                          </div>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Integrity Issues
                          </div>
                          <div className="mt-2 text-xl font-semibold text-zinc-900">
                            — <span className="text-zinc-500">0 flags</span>
                          </div>
                          <div className="mt-2 text-sm text-zinc-500">
                            No suspicious activity detected (mock).
                          </div>
                        </div>
                      </div>

                      {/* Report-style breakdown */}
                      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="text-sm font-semibold text-zinc-900">
                            Report
                          </div>
                          <div className="flex items-center gap-6 text-sm text-zinc-600">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">Duration</span>
                              <span className="font-semibold text-zinc-900">
                                2 min
                              </span>
                              <span className="text-zinc-400">/ 14 min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">Points</span>
                              <span className="font-semibold text-zinc-900">
                                200/240 (83%)
                              </span>
                            </div>
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
                          <SkillRow
                            label="Debug approach"
                            points="63 / 100pts"
                            value={63}
                            colorClass="bg-softLavender"
                          />
                          <SkillRow
                            label="Documentation quality"
                            points="58 / 100pts"
                            value={58}
                            colorClass="bg-softLavender"
                          />
                        </div>
                      </div>

                      {/* Questions table */}
                      <div className="rounded-2xl border border-zinc-200 bg-white">
                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                          <div className="text-sm font-semibold text-zinc-900">
                            Questions
                          </div>
                          <Link
                            href={`/tests/${testId}/candidates/report?candidate=${encodeURIComponent(reviewCandidate.email)}&name=${encodeURIComponent(reviewCandidate.name)}&completed=Feb%2012%2C%202026`}
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
                                Schematic review: power + interfaces
                              </div>
                              <div className="text-xs text-zinc-500">
                                Project (Generated)
                              </div>
                            </div>
                            <div className="text-sm text-zinc-700">
                              Schematic Review
                              <div className="text-xs text-zinc-500">
                                Intermediate
                              </div>
                            </div>
                            <div className="text-zinc-700">0/75</div>
                            <div className="text-zinc-500">×</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Sticky footer: always-visible status controls */}
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
          )
        : null}
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
