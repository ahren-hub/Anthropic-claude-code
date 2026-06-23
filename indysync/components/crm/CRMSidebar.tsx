"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileText,
  Settings,
  Zap,
  ArrowLeft,
} from "lucide-react";

const nav = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm/contacts", label: "Contacts", icon: Users },
  { href: "/crm/deals", label: "Pipeline", icon: Briefcase },
  { href: "/crm/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/crm/notes", label: "Notes", icon: FileText },
];

export default function CRMSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-40"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            A
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">Ahrendezvous</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--gold)" }}>
              CRM
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest px-3 mb-2" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
          Main
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/crm" ? pathname === "/crm" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                color: active ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-widest px-3 mb-2" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
            System
          </p>
          <Link
            href="/crm/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: pathname.startsWith("/crm/settings") ? "rgba(201,168,76,0.12)" : "transparent",
              color: pathname.startsWith("/crm/settings") ? "var(--gold)" : "var(--text-muted)",
            }}
          >
            <Settings size={16} />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} />
            Back to Site
          </Link>
        </div>
      </nav>

      {/* Squarespace CTA */}
      <div className="px-4 pb-5">
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold" style={{ color: "var(--gold)" }}>
            <Zap size={12} />
            Squarespace Sync
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
            Import contacts from your website automatically.
          </p>
          <Link href="/crm/settings" className="text-xs font-semibold" style={{ color: "var(--gold)" }}>
            Connect →
          </Link>
        </div>
      </div>
    </aside>
  );
}
