"use client";

import { useEffect, useState, useMemo } from "react";
import { CheckSquare, Plus, X, Trash2, Edit2, Calendar, AlertCircle, Check } from "lucide-react";
import {
  loadStore,
  addTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskStatus,
  type TaskPriority,
  type Contact,
  type Deal,
} from "@/lib/crm-store";

type TabKey = "all" | "todo" | "in_progress" | "done";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

const PRIORITY_OPTIONS: TaskPriority[] = ["urgent", "high", "medium", "low"];
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#c9a84c",
  low: "#6b7280",
};

const STATUS_OPTIONS: TaskStatus[] = ["todo", "in_progress", "done"];

const BLANK: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tab, setTab] = useState<TabKey>("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const store = loadStore();
    setTasks(store.tasks);
    setContacts(store.contacts);
    setDeals(store.deals);
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tasks, tab]);

  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()
  );

  function openAdd() {
    setEditing(null);
    setForm(BLANK);
    setShowModal(true);
  }

  function openEdit(t: Task) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ?? "",
      contactId: t.contactId,
      dealId: t.dealId,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editing) {
      updateTask(editing.id, form);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editing.id ? { ...t, ...form, updatedAt: new Date().toISOString() } : t
        )
      );
    } else {
      const t = addTask(form);
      setTasks((prev) => [t, ...prev]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
  }

  function toggleDone(t: Task) {
    const newStatus: TaskStatus = t.status === "done" ? "todo" : "done";
    updateTask(t.id, { status: newStatus });
    setTasks((prev) =>
      prev.map((x) =>
        x.id === t.id ? { ...x, status: newStatus, updatedAt: new Date().toISOString() } : x
      )
    );
  }

  const contactMap = Object.fromEntries(contacts.map((c) => [c.id, c.name]));
  const dealMap = Object.fromEntries(deals.map((d) => [d.id, d.title]));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
            Ahrendezvous CRM
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquare size={22} />
            Tasks
          </h1>
          {overdue.length > 0 && (
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: "#ef4444" }}>
              <AlertCircle size={14} />
              {overdue.length} overdue task{overdue.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 self-start sm:self-auto"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          <Plus size={14} />
          Add Task
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-xl mb-5 p-1"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {TABS.map(({ key, label }) => {
          const count = key === "all" ? tasks.length : tasks.filter((t) => t.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === key ? "rgba(201,168,76,0.12)" : "transparent",
                color: tab === key ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              {label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: tab === key ? "rgba(201,168,76,0.2)" : "var(--surface-2)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div
            className="rounded-2xl py-16 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p style={{ color: "var(--text-muted)" }}>No tasks here.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const isOverdue = t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date();
            const isDone = t.status === "done";
            return (
              <div
                key={t.id}
                className="flex items-start gap-4 px-4 py-3.5 rounded-2xl group transition-colors hover:bg-white/[0.02]"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isOverdue ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                  opacity: isDone ? 0.6 : 1,
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleDone(t)}
                  className="mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all"
                  style={{
                    borderColor: isDone ? "var(--gold)" : "var(--border)",
                    background: isDone ? "var(--gold)" : "transparent",
                    color: isDone ? "#0a0a0a" : "transparent",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <p
                      className="text-sm font-medium"
                      style={{ textDecoration: isDone ? "line-through" : "none" }}
                    >
                      {t.title}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{
                        background: `${PRIORITY_COLORS[t.priority]}20`,
                        color: PRIORITY_COLORS[t.priority],
                      }}
                    >
                      {t.priority}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      {t.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {t.dueDate && (
                      <span
                        className="flex items-center gap-1"
                        style={{ color: isOverdue ? "#ef4444" : "var(--text-muted)" }}
                      >
                        <Calendar size={11} />
                        {isOverdue ? "Overdue · " : "Due "}
                        {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    {t.contactId && contactMap[t.contactId] && (
                      <span>{contactMap[t.contactId]}</span>
                    )}
                    {t.dealId && dealMap[t.dealId] && (
                      <span style={{ color: "var(--gold)" }}>{dealMap[t.dealId]}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Task" : "New Task"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Title *">
              <input
                className="crm-input"
                placeholder="Task description"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <Field label="Description">
              <textarea
                className="crm-input resize-none"
                rows={2}
                placeholder="Optional details…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Priority">
                <select
                  className="crm-input"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="crm-input"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Due Date">
              <input
                className="crm-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
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
                disabled={!form.title.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                {editing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Task" onClose={() => setDeleteId(null)}>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This task will be permanently deleted.
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
