"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROLES } from "@/lib/roles";

const SIDEBAR_ITEMS = [
  "general",
  "onboarding",
  "emails",
  "questions",
  "test integrity",
  "test invites",
] as const;

type SettingsSection = (typeof SIDEBAR_ITEMS)[number];

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

export default function SettingsPage() {
  const params = useParams();
  const testId = String(params.testId ?? "");
  const role = React.useMemo(
    () => ROLES.find((r) => r.id === testId) ?? ROLES[0],
    [testId],
  );

  const [activeSection, setActiveSection] = React.useState<SettingsSection>("general");

  // General
  const [testName, setTestName] = React.useState(role?.preview.testTitle ?? "");
  const [expiryStart, setExpiryStart] = React.useState("");
  const [expiryEnd, setExpiryEnd] = React.useState("");
  const [language, setLanguage] = React.useState("en");

  // Onboarding - candidate details to collect
  const [collectDetails, setCollectDetails] = React.useState({
    fullName: true,
    workExperience: true,
    gender: false,
    personalEmail: false,
    contactNumber: false,
    universityCollege: false,
  });
  const [testInstructions, setTestInstructions] = React.useState(
    "This is a timed test. Please make sure you are not interrupted during the test.\n\nPlease ensure you have a stable internet connection."
  );

  // Emails - invite template matches the initial flow (candidates invite preview)
  const testDurationStorageKey = React.useMemo(
    () => `test-duration:${testId}`,
    [testId],
  );
  const [storedDuration, setStoredDuration] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!testId) return;
    try {
      const raw = window.localStorage.getItem(testDurationStorageKey);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n > 0) setStoredDuration(n);
      }
    } catch {
      // ignore
    }
  }, [testId, testDurationStorageKey]);

  const defaultInviteEmail = React.useMemo(() => {
    const title = role?.preview.testTitle ?? "Hiring Test";
    const duration = storedDuration ?? role?.preview.durationMinutes ?? 60;
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
  }, [role?.preview.testTitle, role?.preview.durationMinutes, storedDuration]);

  const [reminderEmails, setReminderEmails] = React.useState(false);
  const [inviteEmailSubject, setInviteEmailSubject] = React.useState("");
  const [inviteEmailBody, setInviteEmailBody] = React.useState("");
  const [confirmationEmail, setConfirmationEmail] = React.useState(true);
  const inviteEmailInitialized = React.useRef(false);

  React.useEffect(() => {
    if (inviteEmailInitialized.current) return;
    inviteEmailInitialized.current = true;
    setInviteEmailSubject(defaultInviteEmail.subject);
    setInviteEmailBody(defaultInviteEmail.body);
  }, [defaultInviteEmail.subject, defaultInviteEmail.body]);

  // Test Integrity
  const [unusualActivityAlerts, setUnusualActivityAlerts] = React.useState(false);
  const [copyPasteBlocking, setCopyPasteBlocking] = React.useState(false);
  const [webcamProctoring, setWebcamProctoring] = React.useState(false);

  // Test Invites
  const [inviteExpiry, setInviteExpiry] = React.useState(false);
  const [privateUrl, setPrivateUrl] = React.useState("");

  // Questions
  const [showSections, setShowSections] = React.useState(true);
  const [shuffleSections, setShuffleSections] = React.useState(false);
  const [revisitSections, setRevisitSections] = React.useState(true);
  const [timeRollover, setTimeRollover] = React.useState(true);

  const toggleDetail = (key: keyof typeof collectDetails) =>
    setCollectDetails((p) => ({ ...p, [key]: !p[key] }));

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-corePurple" : "bg-zinc-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/tests" className="hover:text-zinc-700">
            Tests
          </Link>
          <IconChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <Link href={`/tests/${testId}`} className="truncate text-zinc-600 hover:text-zinc-700">
            {role?.preview.testTitle ?? "Hiring Test"}
          </Link>
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-fustat truncate text-2xl font-semibold text-graphite">
            {role?.preview.testTitle ?? "Hiring Test"}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Share
            </button>
            <Link
              href={`/tests/${testId}/preview`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              Try Test
            </Link>
            <Link
              href={`/tests/${testId}/candidates?invite=1`}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-corePurple px-3 text-sm font-semibold text-white hover:bg-violet"
            >
              + Invite
            </Link>
          </div>
        </div>

        <div className="mt-4 border-b border-zinc-200">
          <div className="flex gap-6">
            <TabLink href={`/tests/${testId}`} active={false}>
              Questions
            </TabLink>
            <TabLink href={`/tests/${testId}/candidates`} active={false}>
              Candidates
            </TabLink>
            <TabLink href={`/tests/${testId}/insights`} active={false}>
              Insights
            </TabLink>
            <TabLink href={`/tests/${testId}/settings`} active>
              Settings
            </TabLink>
          </div>
        </div>

        <div className="mt-6 flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="space-y-0.5">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveSection(item)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium capitalize transition ${
                    activeSection === item
                      ? "bg-softLavender text-corePurple"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            {activeSection === "general" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">General</h2>
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Test name
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="Enter test name"
                      className="mt-2 w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple focus:ring-1 focus:ring-corePurple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Test expiration
                    </label>
                    <p className="mt-1 text-xs text-zinc-500">
                      Timezone: America/Los_Angeles
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={expiryStart}
                        onChange={(e) => setExpiryStart(e.target.value)}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                      />
                      <span className="text-zinc-500">to</span>
                      <input
                        type="datetime-local"
                        value={expiryEnd}
                        onChange={(e) => setExpiryEnd(e.target.value)}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="mt-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                    >
                      <option value="en">English (en)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "onboarding" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Onboarding</h2>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-zinc-900">
                    Candidate Details
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    Candidates will be asked to provide this information before starting the test.
                  </p>
                  <div className="mt-3 space-y-2">
                    {(
                      [
                        { key: "fullName" as const, label: "Full Name", type: "Text Field" },
                        { key: "workExperience" as const, label: "Work Experience", type: "Single Select" },
                        { key: "gender" as const, label: "Gender", type: "Single Select" },
                        { key: "personalEmail" as const, label: "Personal Email Address", type: "Text Field" },
                        { key: "contactNumber" as const, label: "Contact Number", type: "Text Field" },
                        { key: "universityCollege" as const, label: "Univ/College Name", type: "Text Field" },
                      ] as const
                    ).map(({ key, label, type }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400">⋮⋮</span>
                          <button
                            type="button"
                            onClick={() => toggleDetail(key)}
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${
                              collectDetails[key]
                                ? "bg-corePurple text-white"
                                : "border border-zinc-300 text-zinc-500"
                            }`}
                          >
                            {collectDetails[key] ? "✓" : "+"}
                          </button>
                          <span className="text-sm font-medium text-zinc-900">
                            {label}
                          </span>
                          <span className="text-xs text-zinc-500">({type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-corePurple hover:underline"
                  >
                    + Add field
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-zinc-900">
                    Test Instructions
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600">
                    These instructions will be displayed on the test login page.
                  </p>
                  <textarea
                    value={testInstructions}
                    onChange={(e) => setTestInstructions(e.target.value)}
                    rows={6}
                    placeholder="Enter test instructions..."
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple focus:ring-1 focus:ring-corePurple"
                  />
                </div>
              </div>
            )}

            {activeSection === "emails" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Emails</h2>

                <div className="mt-6 space-y-6">
                  <div className="flex items-start justify-between border-b border-zinc-100 pb-6">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">
                        Reminder Emails
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600">
                        Send a reminder email to invited recipients. Only one reminder per candidate.
                      </p>
                    </div>
                    <Toggle checked={reminderEmails} onChange={() => setReminderEmails(!reminderEmails)} />
                  </div>
                  <div className="border-b border-zinc-100 pb-6">
                    <h3 className="text-sm font-medium text-zinc-900">
                      Invite Email
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">
                      This email will be sent when candidates are invited. Edit the template below.
                    </p>
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-600">Subject</label>
                        <input
                          type="text"
                          value={inviteEmailSubject}
                          onChange={(e) => setInviteEmailSubject(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600">Body</label>
                        <textarea
                          value={inviteEmailBody}
                          onChange={(e) => setInviteEmailBody(e.target.value)}
                          rows={12}
                          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">
                        Confirmation Email
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600">
                        Send an email when the candidate completes the test.
                      </p>
                    </div>
                    <Toggle checked={confirmationEmail} onChange={() => setConfirmationEmail(!confirmationEmail)} />
                  </div>
                  {confirmationEmail && (
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/30 p-4">
                      <textarea
                        placeholder="Thanks for completing the test. We've sent your submission to the team..."
                        rows={4}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-corePurple"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "questions" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Questions</h2>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      key: "showSections",
                      label: "Show sections to candidates",
                      desc: "Candidates can see section names before starting; turn off to hide.",
                      checked: showSections,
                      set: setShowSections,
                    },
                    {
                      key: "shuffleSections",
                      label: "Shuffle sections",
                      desc: "Sections may appear in a different order; turn off to keep same order.",
                      checked: shuffleSections,
                      set: setShuffleSections,
                    },
                    {
                      key: "revisitSections",
                      label: "Revisit earlier sections",
                      desc: "Candidates can go back to previous sections; turn off for forward-only.",
                      checked: revisitSections,
                      set: setRevisitSections,
                    },
                    {
                      key: "timeRollover",
                      label: "Time rollover",
                      desc: "Unused time carries over to the next section; turn off for fixed time per section.",
                      checked: timeRollover,
                      set: setTimeRollover,
                    },
                  ].map(({ label, desc, checked, set }) => (
                    <div key={label} className="flex items-start justify-between border-b border-zinc-100 pb-4 last:border-0">
                      <div>
                        <h3 className="text-sm font-medium text-zinc-900">{label}</h3>
                        <p className="mt-1 text-xs text-zinc-600">{desc}</p>
                      </div>
                      <Toggle checked={checked} onChange={() => set(!checked)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "test integrity" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Test Integrity
                </h2>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      label: "Unusual activity alerts",
                      desc: "Get alerted when suspicious activity is detected during the test.",
                      checked: unusualActivityAlerts,
                      set: setUnusualActivityAlerts,
                    },
                    {
                      label: "Copy paste blocking",
                      desc: "Prevent candidates from copying or pasting content during the test.",
                      checked: copyPasteBlocking,
                      set: setCopyPasteBlocking,
                    },
                    {
                      label: "Webcam proctoring",
                      desc: "Require webcam and capture periodic snapshots for the report.",
                      checked: webcamProctoring,
                      set: setWebcamProctoring,
                    },
                  ].map(({ label, desc, checked, set }) => (
                    <div key={label} className="flex items-start justify-between border-b border-zinc-100 pb-4 last:border-0">
                      <div>
                        <h3 className="text-sm font-medium text-zinc-900">{label}</h3>
                        <p className="mt-1 text-xs text-zinc-600">{desc}</p>
                      </div>
                      <Toggle checked={checked} onChange={() => set(!checked)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "test invites" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Test Invites
                </h2>

                <div className="mt-6 space-y-6">
                  <div className="flex items-start justify-between border-b border-zinc-100 pb-6">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">
                        Invite Expiry
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600">
                        Set how long a test invite stays valid.
                      </p>
                    </div>
                    <Toggle checked={inviteExpiry} onChange={() => setInviteExpiry(!inviteExpiry)} />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">
                      Private URL
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">
                      A private link for limited internal testing. Requires master password to access.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <div className="flex flex-1 items-center rounded-lg border border-zinc-200 bg-zinc-50/50">
                        <span className="px-3 text-sm text-zinc-500">https://test.link/</span>
                        <input
                          type="text"
                          value={privateUrl}
                          onChange={(e) => setPrivateUrl(e.target.value)}
                          placeholder="your-custom-url"
                          className="flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none focus:ring-0"
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded-lg bg-corePurple px-4 py-2 text-sm font-semibold text-white hover:bg-violet"
                      >
                        Create link
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">
                      Master Password
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">
                      Password required when using the private link above.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="password"
                        placeholder="Set password"
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-corePurple"
                      />
                      <button
                        type="button"
                        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                      >
                        Set password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
