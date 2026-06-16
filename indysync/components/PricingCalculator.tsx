"use client";

import { useState } from "react";
import Link from "next/link";

const LANGUAGES = ["Spanish (LATAM)", "Portuguese (Brazil)", "Yoruba (Nigeria)"];

export default function PricingCalculator() {
  const [minutes, setMinutes] = useState(90);
  const [langs, setLangs] = useState(1);
  const [subtitles, setSubtitles] = useState(false);

  const dubbingCostPerLang =
    minutes <= 75
      ? minutes * 30
      : 75 * 30 + (minutes - 75) * 40;

  const subtitleCostPerLang = minutes * 2;
  const totalDubbing = dubbingCostPerLang * langs;
  const totalSubtitles = subtitles ? subtitleCostPerLang * langs : 0;
  const total = totalDubbing + totalSubtitles;
  const deposit = Math.round(total / 2);

  return (
    <div
      className="rounded-2xl p-8 md:p-10"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-xl font-semibold mb-8">Calculate your project cost</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            Film length (minutes)
          </label>
          <input
            type="range"
            min={15}
            max={180}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <span>15 min</span>
            <span className="font-semibold text-white">{minutes} min</span>
            <span>180 min</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            Number of languages
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setLangs(n)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: langs === n ? "var(--gold)" : "var(--surface)",
                  color: langs === n ? "#0a0a0a" : "var(--foreground)",
                  border: `1px solid ${langs === n ? "var(--gold)" : "var(--border)"}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            {LANGUAGES.slice(0, langs).join(", ")}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            Add subtitles?
          </label>
          <button
            onClick={() => setSubtitles(!subtitles)}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: subtitles ? "rgba(201,168,76,0.15)" : "var(--surface)",
              color: subtitles ? "var(--gold)" : "var(--foreground)",
              border: `1px solid ${subtitles ? "var(--gold)" : "var(--border)"}`,
            }}
          >
            {subtitles ? "✓ Included — $2/min" : "+ Add $2/min"}
          </button>
        </div>
      </div>

      <div
        className="rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ background: "var(--background)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Dubbing total</div>
            <div className="text-2xl font-bold">${totalDubbing.toLocaleString()}</div>
          </div>
          {subtitles && (
            <div>
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Subtitles total</div>
              <div className="text-2xl font-bold">${totalSubtitles.toLocaleString()}</div>
            </div>
          )}
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Total project cost</div>
            <div className="text-2xl font-bold" style={{ color: "var(--gold)" }}>${total.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Deposit to start</div>
            <div className="text-2xl font-bold">${deposit.toLocaleString()}</div>
          </div>
        </div>
        <Link
          href={`/intake?minutes=${minutes}&langs=${langs}&subtitles=${subtitles}`}
          className="shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          Start This Project →
        </Link>
      </div>
    </div>
  );
}
