"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4h4v4H4V4ZM4 12h4v4H4v-4ZM12 4h4v4h-4V4ZM12 12h4v4h-4v-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBriefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 14a4 4 0 0 0-8 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconGear(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 10a1.5 1.5 0 0 0 .3-.9 1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 0-.9.3L13 10l.9.9.2-.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 10a1.5 1.5 0 0 1-.3.9 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1 .9-.3L7 10l-.9-.9-.2.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13 17h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4M9 14 13 10 9 6M13 10H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 3a5 5 0 0 1 5 5v3l2 2H3l2-2V8a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 17a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", icon: IconGrid },
  { href: "/tests", label: "Tests", icon: IconBriefcase },
  { href: "/candidates", label: "Candidates", icon: IconUsers },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPreview = pathname?.includes("/preview");

  return (
    <div className="flex min-h-screen bg-pageBg text-zinc-900">
      {!isPreview && (
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
        <div className="flex h-14 items-center px-5">
          <span className="font-fustat text-lg font-semibold text-graphite">
            colare
          </span>
        </div>
        <div className="border-t border-zinc-100 px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-corePurple text-sm font-semibold text-white">
              P
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-zinc-900">
                PCITEST
              </div>
              <div className="truncate text-xs text-zinc-500">
                sho@tester.com
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-corePurple text-white"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-100 p-3">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <IconLogout className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>
      )}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
