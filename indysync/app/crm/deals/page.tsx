"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  X,
  Trash2,
  Edit2,
  DollarSign,
  Calendar,
  ChevronRight,
  List,
  Columns,
} from "lucide-react";
import {
  loadStore,
  addDeal,
  updateDeal,
  deleteDeal,
  type Deal,
  type DealStage,
  type Contact,
} from "@/lib/crm-store";

const STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: "inquiry", label: "Inquiry", color: "#6366f1" },
  { key: "consultation", label: "Consultation", color: "#8b5cf6" },
  { key: "proposal", label: "Proposal", color: "#c9a84c" },
  { key: "booked", label: "Booked", color: "#22c55e" },
  { key: "in_progress", label: "In Progress", color: "#06b6d4" },
  { key: "completed", label: "Completed", color: "#4ade80" },
  { key: "lost", label: "Lost", color: "#6b7280" },
];

const BLANK: Omit<Deal, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  stage: "inquiry",
  value: 0,
  eventType: "",
  eventDate: "",
  description: "",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<Omit<Deal, "id" | "createdAt" | "updatedAt">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const store = loadStore();
    setDeals(store.deals);
    setContacts(store.contacts);
  }, []);

  function openAdd(stage: DealStage = "inquiry") {
    setEditing(null);
    setForm({ ...BLANK, stage });
    setShowModal(true);
  }

  function openEdit(d: Deal) {
    setEditing(d);
    setForm({
      title: d.title,
      stage: d.stage,
      value: d.value,
      contactId: d.contactId,
      eventType: d.eventType ?? "",
      eventDate: d.eventDate ?? "",
      description: d.description ?? "",
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editing) {
      updateDeal(editing.id, form);
      setDeals((prev) =>
        prev.map((d) =>
          d.id === editing.id ? { ...d, ...form, updatedAt: new Date().toISOString() } : d
        )
      );
    } else {
      const d = addDeal(form);
      setDeals((prev) => [d, ...prev]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  }

  function moveStage(id: string, stage: DealStage) {
    updateDeal(id, { stage });
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d))
    );
  }

  const contactMap = useMemo(
    () => Object.fromEntries(contacts.map((c) => [c.id, c.name])),
    [contacts]
  );

  const totalPipeline = deals
    .filter((d) => !["completed", "lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
            Ahrendezvous CRM
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={22} />
            Pipeline
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            ${totalPipeline.toLocaleString()} in active pipeline · {deals.length} total deals
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setView("kanban")}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: view === "kanban" ? "rgba(201,168,76,0.15)" : "var(--surface)",
                color: view === "kanban" ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              <Columns size={13} />
              Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                background: view === "list" ? "rgba(201,168,76,0.15)" : "var(--surface)",
                color: view === "list" ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              <List size={13} />
              List
            </button>
          </div>
          <button
            onClick={() => openAdd()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            <Plus size={14} />
            New Deal
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {STAGES.map(({ key, label, color }) => {
            const stageDeals = deals.filter((d) => d.stage === key);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div
                key={key}
                className="flex-shrink-0 w-64 rounded-2xl p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                      {stageDeals.length}
                    </span>
                    <button
                      onClick={() => openAdd(key)}
                      className="p-1 rounded-lg transition-colors hover:bg-white/5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                {stageValue > 0 && (
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    ${stageValue.toLocaleString()}
                  </p>
                )}
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      contactName={deal.contactId ? contactMap[deal.contactId] : undefined}
                      stageColor={color}
                      onEdit={() => openEdit(deal)}
                      onDelete={() => setDeleteId(deal.id)}
                      stages={STAGES}
                      onMove={(s) => moveStage(deal.id, s)}
                    />
                  ))}
                  {stageDeals.length === 0 && (
                    <button
                      onClick={() => openAdd(key)}
                      className="w-full py-6 rounded-xl text-xs border-dashed transition-colors hover:border-gold"
                      style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}
                    >
                      + Add deal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Deal", "Contact", "Stage", "Value", "Event Date", "Type", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center" style={{ color: "var(--text-muted)" }}>
                      No deals yet. Create your first deal.
                    </td>
                  </tr>
                ) : (
                  deals.map((d) => {
                    const stage = STAGES.find((s) => s.key === d.stage)!;
                    return (
                      <tr
                        key={d.id}
                        className="transition-colors hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td className="px-4 py-3 font-medium">{d.title}</td>
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                          {d.contactId ? contactMap[d.contactId] ?? "—" : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: `${stage.color}20`, color: stage.color }}
                          >
                            {stage.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--gold)" }}>
                          ${d.value.toLocaleString()}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                          {d.eventDate
                            ? new Date(d.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                          {d.eventType ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(d)}
                              className="p-1.5 rounded-lg hover:bg-white/5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(d.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Deal" : "New Deal"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Deal Title *">
              <input
                className="crm-input"
                placeholder="e.g. Johnson Wedding Film"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stage">
                <select
                  className="crm-input"
                  value={form.stage}
                  onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as DealStage }))}
                >
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Value ($)">
                <input
                  className="crm-input"
                  type="number"
                  placeholder="0"
                  value={form.value || ""}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                />
              </Field>
            </div>
            <Field label="Contact">
              <select
                className="crm-input"
                value={form.contactId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, contactId: e.target.value || undefined }))}
              >
                <option value="">— None —</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Event Type">
                <input
                  className="crm-input"
                  placeholder="e.g. Wedding, Concert"
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                />
              </Field>
              <Field label="Event Date">
                <input
                  className="crm-input"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                className="crm-input resize-none"
                rows={3}
                placeholder="Additional details…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "var(--surface-2)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                {editing ? "Save Changes" : "Create Deal"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Deal" onClose={() => setDeleteId(null)}>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This will permanently delete this deal.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ background: "var(--surface-2)", color: "var(--foreground)" }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteId)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DealCard({
  deal,
  contactName,
  stageColor,
  onEdit,
  onDelete,
  stages,
  onMove,
}: {
  deal: Deal;
  contactName?: string;
  stageColor: string;
  onEdit: () => void;
  onDelete: () => void;
  stages: typeof STAGES;
  onMove: (stage: DealStage) => void;
}) {
  const [showMove, setShowMove] = useState(false);
  return (
    <div
      className="rounded-xl p-3 relative group"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: stageColor }}
      />
      <div className="pl-3">
        <p className="text-sm font-medium leading-snug mb-1">{deal.title}</p>
        {contactName && (
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            {contactName}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
            ${deal.value.toLocaleString()}
          </span>
          {deal.eventDate && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Calendar size={10} />
              {new Date(deal.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 rounded hover:bg-white/5" style={{ color: "var(--text-muted)" }}>
            <Edit2 size={12} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-500/10" style={{ color: "var(--text-muted)" }}>
            <Trash2 size={12} />
          </button>
          <div className="relative ml-auto">
            <button
              onClick={() => setShowMove(!showMove)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              Move <ChevronRight size={10} />
            </button>
            {showMove && (
              <div
                className="absolute right-0 top-6 z-20 rounded-xl py-1 shadow-xl w-36"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {stages
                  .filter((s) => s.key !== deal.stage)
                  .map((s) => (
                    <button
                      key={s.key}
                      onClick={() => { onMove(s.key); setShowMove(false); }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                      style={{ color: s.color }}
                    >
                      {s.label}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
