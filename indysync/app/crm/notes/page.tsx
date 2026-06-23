"use client";

import { useEffect, useState, useMemo } from "react";
import { FileText, Plus, X, Trash2, Edit2, Search, Clock } from "lucide-react";
import {
  loadStore,
  addNote,
  updateNote,
  deleteNote,
  type Note,
  type Contact,
  type Deal,
} from "@/lib/crm-store";

const BLANK: Omit<Note, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  content: "",
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState<Omit<Note, "id" | "createdAt" | "updatedAt">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const store = loadStore();
    setNotes(store.notes);
    setContacts(store.contacts);
    setDeals(store.deals);
    if (store.notes.length > 0) setSelected(store.notes[0]);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const contactMap = Object.fromEntries(contacts.map((c) => [c.id, c.name]));
  const dealMap = Object.fromEntries(deals.map((d) => [d.id, d.title]));

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setShowModal(true);
  }

  function openEdit(n: Note) {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      contactId: n.contactId,
      dealId: n.dealId,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editing) {
      updateNote(editing.id, form);
      const updated = { ...editing, ...form, updatedAt: new Date().toISOString() };
      setNotes((prev) => prev.map((n) => (n.id === editing.id ? updated : n)));
      setSelected(updated);
    } else {
      const n = addNote(form);
      setNotes((prev) => [n, ...prev]);
      setSelected(n);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteNote(id);
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (selected?.id === id) setSelected(next[0] ?? null);
      return next;
    });
    setDeleteId(null);
  }

  const displayNote = selected ?? filtered[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
            Ahrendezvous CRM
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText size={22} />
            Notes
          </h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          <Plus size={14} />
          New Note
        </button>
      </div>

      <div className="flex gap-5 h-[calc(100vh-200px)] min-h-[400px]">
        {/* Sidebar list */}
        <div
          className="w-64 flex-shrink-0 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "var(--surface-2)" }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                className="flex-1 bg-transparent text-xs outline-none"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-xs text-center" style={{ color: "var(--text-muted)" }}>
                No notes found
              </p>
            ) : (
              filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className="w-full text-left px-4 py-3 transition-colors hover:bg-white/[0.03]"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: displayNote?.id === n.id ? "rgba(201,168,76,0.06)" : "transparent",
                    borderLeft: displayNote?.id === n.id ? "2px solid var(--gold)" : "2px solid transparent",
                  }}
                >
                  <p className="text-sm font-medium truncate mb-1">{n.title}</p>
                  <p className="text-xs truncate mb-1" style={{ color: "var(--text-muted)" }}>
                    {n.content.slice(0, 60)}…
                  </p>
                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <Clock size={10} />
                    {new Date(n.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Note viewer */}
        <div
          className="flex-1 rounded-2xl flex flex-col overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {displayNote ? (
            <>
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div>
                  <h2 className="font-semibold text-lg">{displayNote.title}</h2>
                  <div className="flex gap-3 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(displayNote.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {displayNote.contactId && contactMap[displayNote.contactId] && (
                      <span style={{ color: "#818cf8" }}>
                        @ {contactMap[displayNote.contactId]}
                      </span>
                    )}
                    {displayNote.dealId && dealMap[displayNote.dealId] && (
                      <span style={{ color: "var(--gold)" }}>
                        # {dealMap[displayNote.dealId]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(displayNote)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(displayNote.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/10"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {displayNote.content}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <FileText size={40} className="opacity-20" />
              <p style={{ color: "var(--text-muted)" }}>Select a note or create a new one</p>
              <button
                onClick={openAdd}
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                + New Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Note" : "New Note"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Title *">
              <input
                className="crm-input"
                placeholder="Note title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
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
              <Field label="Deal">
                <select
                  className="crm-input"
                  value={form.dealId ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, dealId: e.target.value || undefined }))}
                >
                  <option value="">— None —</option>
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Content *">
              <textarea
                className="crm-input resize-none"
                rows={8}
                placeholder="Write your note here…"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--surface-2)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                {editing ? "Save Changes" : "Create Note"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Note" onClose={() => setDeleteId(null)}>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This note will be permanently deleted.
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

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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
