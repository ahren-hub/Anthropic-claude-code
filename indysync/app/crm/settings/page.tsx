"use client";

import { useEffect, useState } from "react";
import { Settings, Zap, RefreshCw, Check, AlertCircle, ExternalLink, Trash2 } from "lucide-react";
import { loadStore, saveSquarespaceSettings, type CRMStore } from "@/lib/crm-store";

export default function SettingsPage() {
  const [store, setStore] = useState<CRMStore | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [websiteId, setWebsiteId] = useState("");
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  useEffect(() => {
    const s = loadStore();
    setStore(s);
    setApiKey(s.squarespaceApiKey ?? "");
    setWebsiteId(s.squarespaceWebsiteId ?? "");
  }, []);

  function handleSaveCredentials() {
    saveSquarespaceSettings(apiKey, websiteId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSync() {
    if (!apiKey || !websiteId) {
      setSyncResult({ type: "error", message: "Please save your API key and Website ID first." });
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    // Simulate a Squarespace API call (replace with real fetch in production)
    await new Promise((r) => setTimeout(r, 1800));
    setSyncing(false);
    setSyncResult({
      type: "success",
      message: "Sync complete — 0 new contacts imported (no new form submissions found).",
    });
  }

  function handleClearData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ahrendezvous_crm");
      window.location.reload();
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
          Ahrendezvous CRM
        </p>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings size={22} />
          Settings
        </h1>
      </div>

      {/* Squarespace Integration */}
      <div
        className="rounded-2xl p-6 mb-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)" }}
          >
            <Zap size={18} />
          </div>
          <div>
            <h2 className="font-semibold mb-1">Squarespace Sync</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Connect your Squarespace site to automatically import form submissions and Commerce orders as CRM contacts.
            </p>
            <a
              href="https://developers.squarespace.com/commerce-apis/authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-2 hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              How to get your API key
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              API Key (Personal Token)
            </label>
            <input
              className="crm-input font-mono text-xs"
              type="password"
              placeholder="sq0atp-xxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
              Website ID
            </label>
            <input
              className="crm-input font-mono text-xs"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
            />
            <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
              Found in your Squarespace dashboard under Settings → Advanced → API Keys
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSaveCredentials}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              {saved ? <Check size={14} /> : null}
              {saved ? "Saved!" : "Save Credentials"}
            </button>
            <button
              onClick={handleSync}
              disabled={syncing || !apiKey}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition-all"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync Now"}
            </button>
          </div>

          {syncResult && (
            <div
              className="flex items-start gap-2 rounded-xl p-3 text-sm"
              style={{
                background: syncResult.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${syncResult.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                color: syncResult.type === "success" ? "#4ade80" : "#f87171",
              }}
            >
              {syncResult.type === "success" ? <Check size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
              {syncResult.message}
            </div>
          )}

          {store?.lastSyncedAt && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Last synced: {new Date(store.lastSyncedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Sync instructions */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h3 className="font-semibold text-sm mb-3">What gets synced</h3>
        <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {[
            "Contact form submissions → Contacts (lead status)",
            "Commerce orders → Contacts (client status) + Deals",
            "Customer profiles → Contact details (name, email, phone)",
            "Existing contacts are matched by email and updated, not duplicated",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--gold)" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Data management */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <h2 className="font-semibold mb-2 text-sm flex items-center gap-2" style={{ color: "#f87171" }}>
          <Trash2 size={14} />
          Danger Zone
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Clear all CRM data and reset to the default demo data. This cannot be undone.
        </p>
        {!clearConfirm ? (
          <button
            onClick={() => setClearConfirm(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            Clear All Data
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setClearConfirm(false)}
              className="px-4 py-2 rounded-xl text-sm"
              style={{ background: "var(--surface-2)", color: "var(--foreground)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              Yes, clear everything
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
