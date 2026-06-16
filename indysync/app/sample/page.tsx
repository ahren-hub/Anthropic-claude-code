import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VoiceSampleTool from "@/components/VoiceSampleTool";

export const metadata = {
  title: "Free Voice Sample — INDYSync",
  description: "Upload 15–30 seconds of your film and hear it dubbed for free. No credit card required.",
};

export default function SamplePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <Header />
      <main className="flex-1 pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div
            className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            Free — No credit card
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Hear your film<br /><span style={{ color: "var(--gold)" }}>in another language.</span>
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Upload a 15–30 second clip. Choose a language. Get a dubbed preview within minutes. No sign-up required.
          </p>
        </div>
        <VoiceSampleTool />
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Samples are for evaluation only and not stored after 24 hours. Want the full film done?{" "}
            <a href="/intake" style={{ color: "var(--gold)" }} className="underline underline-offset-2">Start your project →</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
