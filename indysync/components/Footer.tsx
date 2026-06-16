import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="px-6 py-12"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-xl font-bold tracking-tight mb-2">
            INDY<span style={{ color: "var(--gold)" }}>SYNC</span>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
            AI film dubbing built by an indie filmmaker, for indie filmmakers.
          </p>
        </div>
        <nav className="flex flex-col md:flex-row gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/sample" className="hover:text-white transition-colors">Free Sample</Link>
          <Link href="/intake" className="hover:text-white transition-colors">Get a Quote</Link>
          <a href="mailto:hello@indysync.com" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} INDYSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
