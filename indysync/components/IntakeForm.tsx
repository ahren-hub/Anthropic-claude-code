"use client";

import { useState } from "react";

const LANGUAGES = ["Spanish (LATAM)", "Portuguese (Brazil)", "Yoruba (Nigeria)"];
const PLATFORMS = ["Film Festivals", "Netflix / Streaming", "YouTube", "Direct Distribution", "Other"];

type FormData = {
  filmTitle: string;
  filmLength: string;
  languages: string[];
  addSubtitles: boolean;
  platforms: string[];
  fileFormat: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  referral: string;
};

const initial: FormData = {
  filmTitle: "",
  filmLength: "",
  languages: [],
  addSubtitles: false,
  platforms: [],
  fileFormat: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
  referral: "",
};

export default function IntakeForm() {
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);

  function toggle<K extends "languages" | "platforms">(field: K, value: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const minutes = Number(form.filmLength) || 0;
  const dubbingCostPerLang = minutes <= 75 ? minutes * 30 : 75 * 30 + (minutes - 75) * 40;
  const totalDubbing = dubbingCostPerLang * (form.languages.length || 1);
  const totalSubtitles = form.addSubtitles ? minutes * 2 * (form.languages.length || 1) : 0;
  const total = totalDubbing + totalSubtitles;
  const deposit = Math.round(total / 2);
  const showEstimate = minutes > 0 && form.languages.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace with real form submission (e.g. email via API route, Airtable, Notion)
    console.log("Intake submitted:", form);
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen name={form.name} email={form.email} deposit={deposit} />;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <Section title="About your film">
        <Field label="Film title" required>
          <TextInput
            value={form.filmTitle}
            onChange={(v) => set("filmTitle", v)}
            placeholder="e.g. Blood Meridian (Indie Short)"
            required
          />
        </Field>
        <Field label="Film length (minutes)" required>
          <TextInput
            type="number"
            value={form.filmLength}
            onChange={(v) => set("filmLength", v)}
            placeholder="e.g. 94"
            required
          />
        </Field>
      </Section>

      <Section title="Localization options">
        <Field label="Target languages (select all that apply)" required>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map((lang) => (
              <Toggle
                key={lang}
                active={form.languages.includes(lang)}
                onClick={() => toggle("languages", lang)}
                label={lang}
              />
            ))}
          </div>
        </Field>
        <Field label="Add subtitles? ($2/min flat rate)">
          <div className="flex gap-3">
            <Toggle active={form.addSubtitles} onClick={() => set("addSubtitles", true)} label="Yes — add subtitles" />
            <Toggle active={!form.addSubtitles} onClick={() => set("addSubtitles", false)} label="Dubbing only" />
          </div>
        </Field>
      </Section>

      <Section title="Distribution plans">
        <Field label="Where will this film be shown?">
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((p) => (
              <Toggle
                key={p}
                active={form.platforms.includes(p)}
                onClick={() => toggle("platforms", p)}
                label={p}
              />
            ))}
          </div>
        </Field>
        <Field label="Current file format">
          <TextInput
            value={form.fileFormat}
            onChange={(v) => set("fileFormat", v)}
            placeholder="e.g. H.264 MP4, ProRes MOV, DCP..."
          />
        </Field>
      </Section>

      <Section title="Anything else?">
        <Field label="Notes, special requirements, or questions">
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Accent preferences, pacing notes, festival deadlines, etc."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </Field>
      </Section>

      <Section title="Your contact info">
        <Field label="Full name" required>
          <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="Your name" required />
        </Field>
        <Field label="Email" required>
          <TextInput type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="you@yourfilm.com" required />
        </Field>
        <Field label="Phone (optional)">
          <TextInput type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+1 (555) 000-0000" />
        </Field>
        <Field label="How did you hear about us?">
          <TextInput value={form.referral} onChange={(v) => set("referral", v)} placeholder="Instagram, filmmaker community, friend..." />
        </Field>
      </Section>

      {showEstimate && (
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--gold)" }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--gold)" }}>Your estimated cost</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <EstimateItem label="Dubbing" value={`$${totalDubbing.toLocaleString()}`} />
            {form.addSubtitles && <EstimateItem label="Subtitles" value={`$${totalSubtitles.toLocaleString()}`} />}
            <EstimateItem label="Total" value={`$${total.toLocaleString()}`} highlight />
            <EstimateItem label="Deposit today" value={`$${deposit.toLocaleString()}`} />
          </div>
          <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
            50% due at project start · 50% due on delivery approval
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!form.filmTitle || !form.filmLength || !form.languages.length || !form.name || !form.email}
        className="w-full py-4 rounded-full font-semibold text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ background: "var(--gold)", color: "#0a0a0a" }}
      >
        Submit — We&apos;ll respond within 24 hours
      </button>
      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        No payment required now. We&apos;ll send your quote and deposit link after review.
      </p>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-8 space-y-6"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-base font-semibold" style={{ color: "var(--gold)" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span style={{ color: "var(--gold)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    />
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        background: active ? "rgba(201,168,76,0.15)" : "var(--surface-2)",
        border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
        color: active ? "var(--gold)" : "var(--foreground)",
      }}
    >
      {active && "✓ "}{label}
    </button>
  );
}

function EstimateItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="text-xl font-bold" style={{ color: highlight ? "var(--gold)" : "var(--foreground)" }}>{value}</div>
    </div>
  );
}

function SuccessScreen({ name, email, deposit }: { name: string; email: string; deposit: number }) {
  return (
    <div
      className="max-w-2xl mx-auto rounded-2xl p-12 text-center"
      style={{ background: "var(--surface)", border: "1px solid var(--gold)" }}
    >
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
        style={{ background: "rgba(201,168,76,0.1)" }}
      >
        ✓
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--gold)" }}>You&apos;re in the queue.</h2>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        Thanks, {name.split(" ")[0]}. We&apos;ll review your project and send a quote + deposit link to{" "}
        <strong className="text-white">{email}</strong> within 24 hours.
      </p>
      <div
        className="rounded-xl p-6 text-left mb-6"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-2">What happens next</p>
        <ol className="text-sm space-y-2" style={{ color: "var(--text-muted)" }}>
          <li>1. We review your intake and confirm the scope</li>
          <li>2. You receive a quote and ${deposit.toLocaleString()} deposit link (50% of total)</li>
          <li>3. You pay the deposit and send your encrypted file</li>
          <li>4. We start production — 5 to 10 business days to your first review cut</li>
        </ol>
      </div>
      <a
        href="/sample"
        className="text-sm"
        style={{ color: "var(--gold)" }}
      >
        While you wait — try a free 30-second sample →
      </a>
    </div>
  );
}
