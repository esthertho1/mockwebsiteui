"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ENGINEER_TYPES = [
  { id: "mechanical", label: "Mechanical Engineer", icon: "⚙" },
  { id: "electrical", label: "Electrical Engineer", icon: "⚡" },
] as const;

const INDUSTRIES = [
  "Automotive",
  "Aerospace & Defense",
  "Consumer Electronics",
  "Industrial",
  "Medical Devices",
  "Energy & Utilities",
  "Semiconductors",
  "Other",
] as const;

const MECHANICAL_SKILLS = [
  "CAD / SolidWorks",
  "GD&T",
  "DFM / DFA",
  "FEA / Simulation",
  "Tolerance Analysis",
  "Materials Selection",
  "Thermal Management",
  "Prototyping",
  "Manufacturing",
  "Root Cause Analysis",
];

const ELECTRICAL_SKILLS = [
  "Schematic Capture",
  "PCB Design",
  "Power Electronics",
  "EMI/EMC",
  "Signal Integrity",
  "Embedded Systems",
  "Debugging",
  "Component Selection",
  "Test & Validation",
  "Documentation",
];

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 6v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

export default function CreateTestV0() {
  const router = useRouter();
  const [engineerType, setEngineerType] = React.useState<
    "mechanical" | "electrical" | null
  >(null);
  const [industry, setIndustry] = React.useState<string>("");
  const [lookingFor, setLookingFor] = React.useState<string[]>([]);
  const [skillSearch, setSkillSearch] = React.useState("");

  const skillOptions =
    engineerType === "mechanical"
      ? MECHANICAL_SKILLS
      : engineerType === "electrical"
        ? ELECTRICAL_SKILLS
        : [];

  const addSkill = (skill: string) => {
    if (lookingFor.includes(skill)) return;
    setLookingFor((prev) => [...prev, skill]);
  };

  const removeSkill = (skill: string) => {
    setLookingFor((prev) => prev.filter((s) => s !== skill));
  };

  const filteredSkills = React.useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    if (!q) return skillOptions;
    return skillOptions.filter((s) => s.toLowerCase().includes(q));
  }, [skillOptions, skillSearch]);

  const canAddCustom =
    skillSearch.trim().length > 0 &&
    !skillOptions.some(
      (s) => s.toLowerCase() === skillSearch.trim().toLowerCase(),
    ) &&
    !lookingFor.some(
      (s) => s.toLowerCase() === skillSearch.trim().toLowerCase(),
    );

  const canCreate =
    engineerType && industry && lookingFor.length > 0;

  const handleCreateTest = () => {
    if (!canCreate) return;
    const roleId =
      engineerType === "mechanical"
        ? "mechanical-design-engineer"
        : "electrical-design-engineer";
    router.push(`/tests/${roleId}`);
  };

  const previewTitle = engineerType
    ? `${engineerType === "mechanical" ? "Mechanical" : "Electrical"} Engineer Hiring Test`
    : "Hiring Test";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6">
        <header className="mb-4 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50"
          >
            <span className="text-lg leading-none">×</span>
          </Link>
          <div className="font-fustat text-lg font-semibold text-graphite">
            Create Test <span className="ml-2 text-xs font-normal text-zinc-400">v0</span>
          </div>
          <div className="ml-auto" />
        </header>

        <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
          <section className="min-w-0 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-zinc-800">
                Engineer type
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {ENGINEER_TYPES.map((opt) => {
                  const selected = engineerType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setEngineerType(opt.id);
                        setLookingFor([]);
                        setSkillSearch("");
                      }}
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition",
                        selected
                          ? "bg-corePurple text-white shadow-sm"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                      ].join(" ")}
                    >
                      <span className="text-base">{opt.icon}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-5">
              <h2 className="text-sm font-semibold text-zinc-800">
                Industry
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => {
                  const selected = industry === ind;
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={[
                        "inline-flex rounded-full px-4 py-2.5 text-sm font-medium transition",
                        selected
                          ? "bg-corePurple text-white shadow-sm"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                      ].join(" ")}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-5">
              <h2 className="text-sm font-semibold text-zinc-800">
                What are you looking for?
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {engineerType
                  ? `Which skills do you want to test? (${lookingFor.length} selected)`
                  : "Select an engineer type first"}
              </p>
              {engineerType ? (
                <>
                  {lookingFor.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lookingFor.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove ${skill}`}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="relative mt-3">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <IconSearch className="h-4 w-4" />
                    </span>
                    <input
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Search for a skill..."
                      className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-zinc-100">
                    {canAddCustom ? (
                      <button
                        type="button"
                        onClick={() => {
                          addSkill(skillSearch.trim());
                          setSkillSearch("");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                      >
                        <span>
                          Add &quot;{skillSearch.trim()}&quot;
                        </span>
                        <span className="text-corePurple">+</span>
                      </button>
                    ) : null}
                    {filteredSkills.map((skill) => {
                      const selected = lookingFor.includes(skill);
                      return (
                        <div
                          key={skill}
                          className={[
                            "flex items-center justify-between px-3 py-2.5 text-sm transition",
                            selected
                              ? "bg-amber-50"
                              : "hover:bg-zinc-50",
                          ].join(" ")}
                        >
                          <span className={selected ? "font-medium text-amber-900" : "text-zinc-700"}>
                            {skill}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              selected ? removeSkill(skill) : addSkill(skill)
                            }
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition hover:text-corePurple"
                            aria-label={selected ? `Remove ${skill}` : `Add ${skill}`}
                          >
                            {selected ? "×" : "+"}
                          </button>
                        </div>
                      );
                    })}
                    {filteredSkills.length === 0 && !canAddCustom ? (
                      <div className="px-3 py-6 text-center text-xs text-zinc-500">
                        No skills match your search
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          </section>

          <aside className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-800">
                Test Preview
              </h2>
              <button
                type="button"
                onClick={handleCreateTest}
                disabled={!canCreate}
                className={[
                  "inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-semibold transition",
                  canCreate
                    ? "bg-corePurple text-white shadow-sm hover:bg-violet"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                Create Test
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                {previewTitle}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
                <IconClock className="h-4 w-4" />
                <span>~{Math.max(60, lookingFor.length * 20)} mins</span>
              </div>

              {lookingFor.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {lookingFor.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm">
                        <span className="text-[11px] font-semibold">Q</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-900">
                          {skill}
                        </div>
                        <div className="text-xs text-zinc-600">
                          1 question
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-6 text-center text-xs text-zinc-500">
                  Select skills to see preview
                </div>
              )}

              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
                You&apos;ll be able to edit this test in the next step
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
