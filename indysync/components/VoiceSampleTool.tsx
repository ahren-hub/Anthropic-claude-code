"use client";

import { useState, useRef } from "react";

const LANGUAGES = [
  { code: "es", label: "Spanish", region: "Latin America" },
  { code: "pt", label: "Portuguese", region: "Brazil" },
  { code: "yo", label: "Yoruba", region: "Nigeria" },
];

type Step = "upload" | "language" | "processing" | "done" | "error";

export default function VoiceSampleTool() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const validTypes = ["video/mp4", "video/quicktime", "video/mov", "audio/mpeg", "audio/wav", "audio/mp4", "audio/aac"];
    const isValid = validTypes.some((t) => f.type.startsWith(t.split("/")[0]));
    if (!isValid) return;
    if (f.size > 100 * 1024 * 1024) return; // 100MB limit for samples
    setFile(f);
    setStep("language");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleSubmit() {
    if (!language || !email) return;
    setStep("processing");
    // Simulate processing delay — replace with real API call to dubbing service
    setTimeout(() => setStep("done"), 3500);
  }

  return (
    <div className="max-w-xl mx-auto">
      {step === "upload" && (
        <UploadStep
          dragOver={dragOver}
          onDragOver={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onFileSelect={() => fileRef.current?.click()}
          fileInputRef={fileRef}
          onFileChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      )}
      {step === "language" && file && (
        <LanguageStep
          fileName={file.name}
          language={language}
          setLanguage={setLanguage}
          email={email}
          setEmail={setEmail}
          onBack={() => { setStep("upload"); setFile(null); }}
          onSubmit={handleSubmit}
        />
      )}
      {step === "processing" && <ProcessingStep />}
      {step === "done" && <DoneStep email={email} language={language} />}
    </div>
  );
}

function UploadStep({
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  fileInputRef,
  onFileChange,
}: {
  dragOver: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className="rounded-2xl p-12 text-center cursor-pointer transition-all"
      style={{
        background: dragOver ? "rgba(201,168,76,0.06)" : "var(--surface)",
        border: `2px dashed ${dragOver ? "var(--gold)" : "var(--border)"}`,
      }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onFileSelect}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        className="hidden"
        onChange={onFileChange}
      />
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
        style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}
      >
        🎬
      </div>
      <h3 className="text-lg font-semibold mb-2">Drop your clip here</h3>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        15–30 seconds of video or audio. MP4, MOV, MP3, WAV accepted. Max 100MB.
      </p>
      <button
        className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
        style={{ background: "var(--gold)", color: "#0a0a0a" }}
      >
        Choose File
      </button>
      <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
        Files are deleted after 24 hours. We never use your content without permission.
      </p>
    </div>
  );
}

function LanguageStep({
  fileName,
  language,
  setLanguage,
  email,
  setEmail,
  onBack,
  onSubmit,
}: {
  fileName: string;
  language: string;
  setLanguage: (l: string) => void;
  email: string;
  setEmail: (e: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3 mb-8 p-4 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <span className="text-xl">🎬</span>
        <div>
          <div className="text-sm font-medium truncate max-w-xs">{fileName}</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Ready for dubbing</div>
        </div>
        <button
          onClick={onBack}
          className="ml-auto text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Change
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-4">Choose target language</h3>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="py-4 px-3 rounded-xl text-center transition-all"
            style={{
              background: language === lang.code ? "rgba(201,168,76,0.15)" : "var(--surface-2)",
              border: `1px solid ${language === lang.code ? "var(--gold)" : "var(--border)"}`,
              color: language === lang.code ? "var(--gold)" : "var(--foreground)",
            }}
          >
            <div className="font-semibold text-sm">{lang.label}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{lang.region}</div>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>
          Email to receive your sample
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourfilm.com"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!language || !email}
        className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ background: "var(--gold)", color: "#0a0a0a" }}
      >
        Generate My Free Sample
      </button>
      <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>
        We&apos;ll email your dubbed sample within minutes. No commitment.
      </p>
    </div>
  );
}

function ProcessingStep() {
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{ border: "2px solid var(--border)", borderTopColor: "var(--gold)" }}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">Dubbing your clip...</h3>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        AI processing + human QC review. Usually ready in 5–10 minutes.
      </p>
      <div className="mt-8 space-y-2">
        {["Transcribing dialogue", "Translating script", "Synthesizing voices", "QC review"].map((stage, i) => (
          <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: i === 0 ? "var(--gold)" : "var(--border)" }}
            />
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}

function DoneStep({ email, language }: { email: string; language: string }) {
  const langLabel = LANGUAGES.find((l) => l.code === language)?.label ?? language;
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--gold)" }}
    >
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
        style={{ background: "rgba(201,168,76,0.1)" }}
      >
        ✓
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--gold)" }}>Sample on its way!</h3>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Your {langLabel} dub is being sent to <strong className="text-white">{email}</strong>. Check your inbox in 5–10 minutes.
      </p>
      <div
        className="rounded-xl p-6 mb-6 text-left"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-2">Ready to dub the full film?</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          If you like what you hear, we can dub your entire film for as low as $30/minute with a 5–10 business day turnaround.
        </p>
      </div>
      <a
        href="/intake"
        className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105"
        style={{ background: "var(--gold)", color: "#0a0a0a" }}
      >
        Start My Full Project →
      </a>
    </div>
  );
}
