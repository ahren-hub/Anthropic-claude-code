import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/PricingCalculator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <PricingSection />
        <EthicsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-32 text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto">
        <div
          className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          Built by an indie filmmaker. For indie filmmakers.
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-6">
          Your film deserves
          <br />
          <span style={{ color: "var(--gold)" }}>a global audience.</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--text-muted)" }}>
          Professional AI dubbing with human quality control — in 5 to 10 business days, at a price indie filmmakers can actually afford. America might not be your market. Someone else is waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sample"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            Try a Free 30-Second Sample
          </Link>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            Get a Quote
          </Link>
        </div>
        <p className="mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          No credit card required for sample. 50% deposit secures your project.
        </p>
      </div>
    </section>
  );
}

function ProblemSection() {
  const stats = [
    { value: "$50,000", label: "Traditional dubbing for one language" },
    { value: "6–12 weeks", label: "Average studio turnaround" },
    { value: "95%", label: "Of indie films never reach international audiences" },
  ];
  return (
    <section className="px-6 py-20" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
          {stats.map((s, i) => (
            <div key={i} className="py-10 md:px-12 text-center" style={{ borderColor: "var(--border)" }}>
              <div className="text-4xl font-bold mb-2" style={{ color: "var(--gold)" }}>{s.value}</div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">The system wasn&apos;t built for you.</h2>
          <p style={{ color: "var(--text-muted)" }} className="text-lg leading-relaxed">
            Hollywood dubbing studios cater to studios with Hollywood budgets. You made a real film with real resources — and now the only thing stopping it from reaching audiences in Lagos, São Paulo, or Mexico City is a price tag that was never designed for someone like you.
          </p>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            INDYSync was built to change that.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Try before you commit",
      description: "Upload a 15–30 second clip and hear your film dubbed in your target language — for free. No sign-up required. Hear the voice. Know what you're getting.",
    },
    {
      number: "02",
      title: "Submit your film",
      description: "Fill out our intake form, choose your languages, and pay 50% upfront. Send your file via encrypted transfer. We take it from there.",
    },
    {
      number: "03",
      title: "AI + human quality control",
      description: "Our AI does the first pass. Our human QC team reviews every scene for emotional accuracy, lip sync, and translation fidelity. We don't ship anything robotic.",
    },
    {
      number: "04",
      title: "Review, revise, receive",
      description: "Watch your dubbed cut. You get 3 free revisions. Once you approve it, pay the remaining 50% and we deliver your files in broadcast-ready format.",
    },
  ];
  return (
    <section className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p style={{ color: "var(--text-muted)" }}>Simple process. No Hollywood middlemen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--gold)" }}>{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p style={{ color: "var(--text-muted)" }} className="leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            5–10 business days standard turnaround. Subtitles add approximately 5 business days.
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="px-6 py-24" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Transparent pricing</h2>
          <p style={{ color: "var(--text-muted)" }}>Per language. No surprises. Know your cost before you commit.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-2xl" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Dubbing</div>
            <div className="text-3xl font-bold mb-1">$30<span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}>/min</span></div>
            <div className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>First 75 minutes</div>
            <div className="text-3xl font-bold mb-1">$40<span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}>/min</span></div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>Every minute after 75</div>
          </div>
          <div
            className="p-8 rounded-2xl relative"
            style={{ background: "var(--background)", border: "1px solid var(--gold)" }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              Add-on
            </div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Subtitles</div>
            <div className="text-3xl font-bold mb-1">$2<span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}>/min</span></div>
            <div className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Flat rate, any length</div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Synced to the dubbed audio. Adds ~5 business days. Available in all supported languages.
            </div>
          </div>
          <div className="p-8 rounded-2xl" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Languages</div>
            <ul className="space-y-3">
              {["Spanish (LATAM)", "Portuguese (Brazil)", "Yoruba (Nigeria)", "More coming soon"].map((lang, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--gold)" }}>✓</span>
                  <span style={{ color: i === 3 ? "var(--text-muted)" : "var(--foreground)" }}>{lang}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PricingCalculator />
      </div>
    </section>
  );
}

function EthicsSection() {
  const pillars = [
    {
      title: "Consented voices. Always.",
      description: "Every voice model in our system was contributed by a real person who signed explicit consent for training and commercial use. We don't scrape. We don't steal.",
    },
    {
      title: "Human quality control.",
      description: "AI handles speed. Humans handle soul. Every dub is reviewed by a quality team that checks translation accuracy, emotional range, and lip sync — scene by scene.",
    },
    {
      title: "Founded by a filmmaker.",
      description: "This company exists because the founder needed it and it didn't exist. Every product decision is made by someone who has sat in the edit bay at 2am wondering how to reach audiences abroad.",
    },
  ];
  return (
    <section className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ethical AI. Real humans. Real results.</h2>
          <p style={{ color: "var(--text-muted)" }} className="max-w-xl mx-auto">
            The AI dubbing industry has a consent problem. We built INDYSync to be the alternative.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center text-lg font-bold"
                style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-3">{pillar.title}</h3>
              <p style={{ color: "var(--text-muted)" }} className="text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="px-6 py-24 text-center"
      style={{ borderTop: "1px solid var(--border)", background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Stop letting language be the wall.
        </h2>
        <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
          You could be a nobody here and Spike Lee somewhere else. Let&apos;s find out.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sample"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            Hear Your Film in Another Language
          </Link>
          <Link
            href="/intake"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}
