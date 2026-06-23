"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Check,
  Mail,
  Phone,
  Tag,
  ChevronDown,
} from "lucide-react";
import {
  loadStore,
  addContact,
  updateContact,
  deleteContact,
  type Contact,
  type ContactStatus,
} from "@/lib/crm-store";

const STATUS_OPTIONS: ContactStatus[] = ["lead", "prospect", "client", "vip", "inactive"];

const STATUS_COLORS: Record<ContactStatus, { bg: string; color: string }> = {
  lead: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  prospect: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
  client: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  vip: { bg: "rgba(201,168,76,0.15)", color: "#c9a84c" },
  inactive: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af" },
};

const BLANK: Omit<Contact, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "lead",
  tags: [],
  source: "manual",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(BLANK);
  const [tagInput, setTagInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const store = loadStore();
    setContacts(store.contacts);
  }, []);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setTagInput("");
    setShowModal(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone ?? "",
      company: c.company ?? "",
      status: c.status,
      tags: [...c.tags],
      source: c.source ?? "manual",
    });
    setTagInput("");
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      updateContact(editing.id, form);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...form, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } else {
      const c = addContact(form);
      setContacts((prev) => [c, ...prev]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
            Ahrendezvous CRM
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={22} />
            Contacts
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          <Plus size={14} />
          Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-60"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            placeholder="Search by name, email, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={{
                background:
                  filterStatus === s
                    ? s === "all"
                      ? "rgba(201,168,76,0.15)"
                      : STATUS_COLORS[s as ContactStatus].bg
                    : "var(--surface)",
                color:
                  filterStatus === s
                    ? s === "all"
                      ? "var(--gold)"
                      : STATUS_COLORS[s as ContactStatus].color
                    : "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex gap-4 mb-5 text-sm" style={{ color: "var(--text-muted)" }}>
        <span>{filtered.length} contact{filtered.length !== 1 ? "s" : ""}</span>
        <span>·</span>
        {STATUS_OPTIONS.map((s) => {
          const n = contacts.filter((c) => c.status === s).length;
          return n > 0 ? (
            <span key={s} style={{ color: STATUS_COLORS[s].color }}>
              {n} {s}
            </span>
          ) : null;
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Email", "Phone", "Company", "Status", "Tags", "Source", ""].map((h) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center" style={{ color: "var(--text-muted)" }}>
                    No contacts found. Add your first contact to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)" }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-gold">
                        <Mail size={12} />
                        {c.email}
                      </a>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {c.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} />
                          {c.phone}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {c.company ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{
                          background: STATUS_COLORS[c.status].bg,
                          color: STATUS_COLORS[c.status].color,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                          >
                            {t}
                          </span>
                        ))}
                        {c.tags.length > 3 && (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            +{c.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs" style={{ color: "var(--text-muted)" }}>
                      {c.source ?? "manual"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Contact" : "Add Contact"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Name *">
              <input
                className="crm-input"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Email *">
              <input
                className="crm-input"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone">
                <input
                  className="crm-input"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </Field>
              <Field label="Company">
                <input
                  className="crm-input"
                  placeholder="Company name"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Status">
              <select
                className="crm-input"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ContactStatus }))}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tags">
              <div className="flex gap-2 mb-2">
                <input
                  className="crm-input flex-1"
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <button onClick={addTag} className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--surface-2)", color: "var(--foreground)" }}>
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                  >
                    <Tag size={10} />
                    {t}
                    <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
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
                disabled={!form.name.trim() || !form.email.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                {editing ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Contact" onClose={() => setDeleteId(null)}>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This will permanently delete the contact. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
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

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
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
