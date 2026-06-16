import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";

export const metadata = {
  title: "Start Your Project — INDYSync",
  description: "Get a quote and start your indie film dubbing project. 5–10 business day turnaround.",
};

export default function IntakePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Header />
      <main className="flex-1 pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Start your <span style={{ color: "var(--gold)" }}>project</span>
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Fill this out and we&apos;ll follow up within 24 hours with your quote and a 50% deposit link to secure your spot.
          </p>
        </div>
        <IntakeForm />
      </main>
      <Footer />
    </div>
  );
}
