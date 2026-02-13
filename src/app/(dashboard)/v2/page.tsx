"use client";

import * as React from "react";
import { ROLES, type Role } from "@/lib/roles";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatDuration(minutes: number) {
  return `${minutes} mins`;
}

function initials(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "R";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function includesQuery(role: Role, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    role.name,
    role.description,
    role.skills.join(" "),
    role.preview.testTitle,
    role.preview.sections.map((s) => `${s.title} ${s.subtitle}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

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

function IconDocument(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 3.5A1.5 1.5 0 0 1 6.5 2h5.586a1.5 1.5 0 0 1 1.06.44l3.414 3.414a1.5 1.5 0 0 1 .44 1.06V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-13Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7 8h6M7 11h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RolePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
      {label}
    </span>
  );
}

export default function CreateTestV2() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(
    ROLES[0]?.id ?? "",
  );
  const [jdFile, setJdFile] = React.useState<File | null>(null);
  const [jdPastedText, setJdPastedText] = React.useState("");
  const [jdModalOpen, setJdModalOpen] = React.useState(false);
  const [experienceLevel, setExperienceLevel] = React.useState<string>("Intermediate");
  const [extraSkills, setExtraSkills] = React.useState<string[]>([]);
  const [skillSearch, setSkillSearch] = React.useState("");
  const [skillDropdownOpen, setSkillDropdownOpen] = React.useState(false);
  const skillInputRef = React.useRef<HTMLDivElement | null>(null);

  const jdFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const hasJd = jdFile !== null || jdPastedText.trim().length > 0;

  const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

  const allSkillOptions = React.useMemo(() => {
    const set = new Set<string>();
    ROLES.forEach((r) => r.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredSkillOptions = React.useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    if (!q) return allSkillOptions.slice(0, 6);
    return allSkillOptions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allSkillOptions, skillSearch]);

  const addExtraSkill = (skill: string) => {
    if (extraSkills.includes(skill)) return;
    setExtraSkills((prev) => [...prev, skill]);
    setSkillSearch("");
    setSkillDropdownOpen(false);
  };

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (skillInputRef.current && !skillInputRef.current.contains(e.target as Node)) {
        setSkillDropdownOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  React.useEffect(() => {
    if (!jdModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setJdModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jdModalOpen]);

  const filteredRoles = React.useMemo(
    () => ROLES.filter((r) => includesQuery(r, query)),
    [query],
  );

  const selectedRole =
    ROLES.find((r) => r.id === selectedRoleId) ?? filteredRoles[0] ?? ROLES[0];

  React.useEffect(() => {
    if (!selectedRole) return;
    setSelectedRoleId(selectedRole.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6">
        <header className="mb-4 flex items-center gap-3">
          <Link
            href="/tests"
            aria-label="Back to Tests"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50"
          >
            <span className="text-lg leading-none">×</span>
          </Link>
          <div className="font-fustat text-lg font-semibold text-graphite">
            Create Test <span className="ml-2 text-xs font-normal text-zinc-400">v2</span>
          </div>
          <div className="ml-auto" />
        </header>

        <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
          <section className="min-w-0">
            <h2 className="text-sm font-semibold text-zinc-800">
              Select a Role
            </h2>

            <div className="mt-3">
              <label className="relative block">
                <span className="sr-only">Search for roles</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <IconSearch className="h-4 w-4" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for roles"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                />
              </label>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setJdModalOpen(true)}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-zinc-50 focus:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      hasJd ? "bg-softLavender text-corePurple" : "bg-zinc-100 text-zinc-500",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <IconDocument className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-900">
                      Create Test with Job Description
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 flex-col items-end">
                  <span className="text-xs font-semibold text-zinc-700">
                    {hasJd
                      ? jdFile
                        ? jdFile.name
                        : "Pasted"
                      : "Add JD"}
                  </span>
                </div>
              </button>

              {jdModalOpen ? (
                <div className="fixed inset-0 z-50">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setJdModalOpen(false)}
                    className="absolute inset-0 bg-black/40"
                  />
                  <div className="absolute left-1/2 top-1/2 w-[min(520px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
                      <div className="text-lg font-semibold text-zinc-900">
                        Add Job Description
                      </div>
                      <button
                        type="button"
                        onClick={() => setJdModalOpen(false)}
                        aria-label="Close"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-50"
                      >
                        <span className="text-xl leading-none">×</span>
                      </button>
                    </div>
                    <div className="px-6 py-5 space-y-5">
                      <div>
                        <div className="text-sm font-medium text-zinc-800 mb-2">
                          Upload file
                        </div>
                        <input
                          ref={jdFileInputRef}
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setJdFile(file);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => jdFileInputRef.current?.click()}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                        >
                          Choose file
                        </button>
                        <span className="ml-3 text-sm text-zinc-500">
                          {jdFile ? jdFile.name : "PDF, DOCX, or TXT"}
                        </span>
                      </div>
                      <div className="border-t border-zinc-100 pt-4">
                        <label className="block text-sm font-medium text-zinc-800 mb-2">
                          Or paste job description
                        </label>
                        <textarea
                          value={jdPastedText}
                          onChange={(e) => setJdPastedText(e.target.value)}
                          placeholder="Paste job description here..."
                          rows={5}
                          className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setJdModalOpen(false)}
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-corePurple px-5 text-sm font-semibold text-white hover:bg-violet"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 border-t border-zinc-100 pt-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Experience level
              </label>
              <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Experience level">
                {EXPERIENCE_LEVELS.map((level) => {
                  const selected = experienceLevel === level;
                  return (
                    <label
                      key={level}
                      className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      <span
                        className={[
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                          selected
                            ? "border-zinc-400 bg-white"
                            : "border-zinc-300 bg-white",
                        ].join(" ")}
                      >
                        {selected ? (
                          <span className="h-2 w-2 rounded-full bg-zinc-600" />
                        ) : null}
                      </span>
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={selected}
                        onChange={() => setExperienceLevel(level)}
                        className="sr-only"
                      />
                      {level}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {filteredRoles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                  No roles match your search.
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const selected = role.id === selectedRole?.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRoleId(role.id)}
                      className={[
                        "group w-full rounded-2xl border p-4 text-left transition",
                        selected
                          ? "border-violet bg-softLavender/80 shadow-[0_0_0_3px_rgba(89,76,233,0.15)]"
                          : "border-zinc-200 bg-white hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold",
                            selected
                              ? "bg-corePurple text-white"
                              : "bg-zinc-100 text-zinc-600",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {initials(role.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <div className="truncate text-sm font-semibold text-zinc-900">
                              {role.name}
                            </div>
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-600">
                            {role.description}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {role.skills.slice(0, 4).map((s) => (
                              <RolePill key={s} label={s} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <aside className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-800">
                Test Preview
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!selectedRole?.id) return;
                  router.push(`/tests/${selectedRole.id}`);
                }}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-corePurple px-4 text-sm font-semibold text-white shadow-sm hover:bg-violet"
              >
                Create Test
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                {selectedRole?.preview.testTitle ?? "Hiring Test"}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-600">
                  {formatDuration(selectedRole?.preview.durationMinutes ?? 0)}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {(selectedRole?.preview.sections ?? []).map((section) => {
                  const levelMatch = section.title.match(/\(([^)]+)\)\s*$/);
                  const level = levelMatch?.[1] ?? null;
                  const baseTitle = level
                    ? section.title.replace(/\s*\([^)]+\)\s*$/, "").trim()
                    : section.title;
                  return (
                    <div
                      key={section.title}
                      className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-900">
                            {baseTitle}
                          </span>
                          {level ? (
                            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                              {level}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-600">
                          {section.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {extraSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900">
                          {skill}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                          {experienceLevel}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setExtraSkills((prev) => prev.filter((s) => s !== skill))
                          }
                          aria-label={`Remove ${skill}`}
                          className="ml-1 text-zinc-400 hover:text-zinc-600"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-600">
                        1 question
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <div className="text-xs font-medium text-zinc-700 mb-2">
                  Add more skills
                </div>
                <div ref={skillInputRef} className="relative">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <IconSearch className="h-4 w-4" />
                    </span>
                    <input
                      value={skillSearch}
                      onChange={(e) => {
                        setSkillSearch(e.target.value);
                        setSkillDropdownOpen(true);
                      }}
                      onFocus={() => setSkillDropdownOpen(true)}
                      placeholder="Search for a skill..."
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  {skillDropdownOpen ? (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                      {filteredSkillOptions.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-zinc-500">
                          No skills found
                        </div>
                      ) : (
                        filteredSkillOptions
                          .filter((s) => !extraSkills.includes(s))
                          .map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => addExtraSkill(skill)}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                            >
                              {skill}
                              <span className="text-zinc-400">+</span>
                            </button>
                          ))
                      )}
                      {skillSearch.trim() &&
                        !allSkillOptions.some(
                          (s) =>
                            s.toLowerCase() === skillSearch.trim().toLowerCase(),
                        ) &&
                        !extraSkills.includes(skillSearch.trim()) ? (
                        <button
                          type="button"
                          onClick={() => addExtraSkill(skillSearch.trim())}
                          className="flex w-full items-center justify-between border-t border-zinc-100 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                          Add &quot;{skillSearch.trim()}&quot;
                          <span className="text-zinc-400">+</span>
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
