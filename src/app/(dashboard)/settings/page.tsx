"use client";

import * as React from "react";
import Link from "next/link";

const SETTINGS_TABS = [
  "profile",
  "emails",
  "company settings",
  "test settings",
  "integrations",
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

const TEST_SETTINGS_SECTIONS = ["Test Emails", "Test Home Page", "Test Integrity", "Test Evaluation"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set([TEST_SETTINGS_SECTIONS[0]])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex min-h-[72px] items-center justify-between px-8 py-5">
          <h1 className="font-fustat text-2xl font-semibold text-graphite">
            Settings
          </h1>
        </div>
      </header>

      {/* Top panel navigation */}
      <div className="border-b border-zinc-200 bg-white px-8">
        <nav className="flex gap-6">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative -mb-px inline-flex items-center px-4 py-3.5 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab}
              {activeTab === tab ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-corePurple" />
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Profile</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Display name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="mt-1 w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "emails" && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Email Notifications
              </h2>
              <div className="mt-6 space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-zinc-300" />
                  <span className="text-sm text-zinc-700">
                    Candidate assessment updates
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-zinc-300" />
                  <span className="text-sm text-zinc-700">
                    Weekly digest
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "company settings" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Company Logo
                </h2>
                <div className="mt-4 flex items-start gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-10 w-10 text-zinc-400"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="border-t border-zinc-200 pt-8">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Company Details
                </h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="mt-2 w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Send Invites As
                    </label>
                    <input
                      type="text"
                      defaultValue="Hiring Team"
                      className="mt-2 w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "test settings" && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Test Settings
              </h2>
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6 text-emerald-700"
                    >
                      <path
                        d="M12 15v2m-4 4h.01M8 7V4m0 0h4M8 4a4 4 0 1 0 0 8m8-8a4 4 0 1 0 0 8m0 0v2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Locking fields for all tests
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-emerald-800">
                      <li className="flex items-start gap-2">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="mt-0.5 h-4 w-4 shrink-0"
                        >
                          <path
                            d="M8 11V7a4 4 0 1 1 8 0m-4 8v2m0 0h4m-4 0h-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        When a setting is unlocked, its value will be the default for new tests, but users can modify it within individual tests.
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="mt-0.5 h-4 w-4 shrink-0"
                        >
                          <path
                            d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        When a setting is locked, its value will be applied to all existing and new tests. Users will not be able to modify it within individual tests.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-0 border-t border-zinc-200">
                {TEST_SETTINGS_SECTIONS.map((section) => {
                  const isExpanded = expandedSections.has(section);
                  return (
                    <div key={section} className="border-b border-zinc-200">
                      <button
                        type="button"
                        onClick={() => toggleSection(section)}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className="font-medium text-zinc-900">{section}</span>
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-5 w-5 text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 8 10 4l4 4M10 4v12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isExpanded && section === "Test Emails" && (
                        <div className="space-y-6 pb-6 pt-2">
                          {/* Confirmation Email */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-zinc-900">Confirmation Email</h4>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={true}
                              className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-zinc-800"
                            >
                              <span className="pointer-events-none inline-block h-5 w-5 translate-y-0.5 translate-x-5 rounded-full bg-white shadow transition" />
                            </button>
                          </div>
                          {/* Confirmation Email Content */}
                          <div>
                            <h4 className="font-semibold text-zinc-900">Confirmation Email Content</h4>
                            <div className="mt-3 flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-zinc-200 bg-zinc-50 px-2 py-2">
                              <button type="button" className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200" aria-label="Undo">↶</button>
                              <button type="button" className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200" aria-label="Redo">↷</button>
                              <span className="mx-1 w-px bg-zinc-300" />
                              <button type="button" className="rounded p-1.5 text-sm font-bold text-zinc-600 hover:bg-zinc-200">B</button>
                              <button type="button" className="rounded p-1.5 italic text-zinc-600 hover:bg-zinc-200">I</button>
                              <button type="button" className="rounded p-1.5 text-sm underline text-zinc-600 hover:bg-zinc-200">U</button>
                              <button type="button" className="rounded p-1.5 text-sm line-through text-zinc-600 hover:bg-zinc-200">S</button>
                              <button type="button" className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200" aria-label="Link">🔗</button>
                              <span className="mx-1 w-px bg-zinc-300" />
                              <button type="button" className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200">1.</button>
                              <button type="button" className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200">•</button>
                              <span className="mx-1 w-px bg-zinc-300" />
                              <select className="rounded border-0 bg-transparent px-2 py-1 text-sm text-zinc-600">
                                <option>Normal</option>
                              </select>
                              <select className="rounded border-0 bg-transparent px-2 py-1 text-sm text-zinc-600">
                                <option>Aa Arial</option>
                              </select>
                              <select className="rounded border-0 bg-transparent px-2 py-1 text-sm text-zinc-600">
                                <option>14px</option>
                              </select>
                              <span className="ml-auto" />
                              <button type="button" className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                                Add Field
                              </button>
                            </div>
                            <textarea
                              rows={12}
                              defaultValue={`Hello,

Thanks for completing **{{ test.name }}**. We've sent your submission to **{{ company.name }}**.

In the meantime, you can go ahead and solve more of such code challenges on HackerRank. Solving code challenges is a great way to keep your skills sharp for interviews.

Wish you all the best for your test result! 👋

This is an automated message. Please **do not** reply to this. You'll need to contact **{{ company.name }}** directly for any follow-up questions.

Thanks,

**HackerRank Team**`}
                              className="w-full resize-y rounded-b-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
                            />
                          </div>
                          {/* Invite Email */}
                          <div className="flex items-start justify-between gap-4 border-t border-zinc-200 pt-6">
                            <div>
                              <h4 className="font-semibold text-zinc-900">Invite Email</h4>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={false}
                              className="relative inline-flex h-6 w-11 shrink-0 rounded-full bg-zinc-200"
                            >
                              <span className="pointer-events-none inline-block h-5 w-5 translate-y-0.5 translate-x-0.5 rounded-full bg-white shadow transition" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Integrations
              </h2>
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Applicant Tracking Systems (ATS)
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {["Ashby", "Greenhouse", "Lever"].map((name) => (
                    <div
                      key={name}
                      className="flex items-start gap-4 rounded-xl border border-zinc-200 p-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-lg font-bold text-zinc-600">
                        {name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-zinc-900">{name}</div>
                        <button
                          type="button"
                          className="mt-3 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          + Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
