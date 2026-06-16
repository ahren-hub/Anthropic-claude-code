import Link from "next/link";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">
          INDY<span style={{ color: "var(--gold)" }}>SYNC</span>
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        <Link href="/#how-it-works" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">
          How It Works
        </Link>
        <Link href="/#pricing" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="/sample" style={{ color: "var(--text-muted)" }} className="hover:text-white transition-colors">
          Free Sample
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/intake"
          className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
