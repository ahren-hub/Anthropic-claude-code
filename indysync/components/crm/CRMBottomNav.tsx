"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, CheckSquare, FileText } from "lucide-react";

const nav = [
  { href: "/crm", label: "Home", icon: LayoutDashboard },
  { href: "/crm/contacts", label: "Contacts", icon: Users },
  { href: "/crm/deals", label: "Pipeline", icon: Briefcase },
  { href: "/crm/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/crm/notes", label: "Notes", icon: FileText },
];

export default function CRMBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-around px-2 py-2 safe-area-pb"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === "/crm" ? pathname === "/crm" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px]"
            style={{
              color: active ? "var(--gold)" : "var(--text-muted)",
            }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
