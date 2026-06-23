"use client";

export type ContactStatus = "lead" | "prospect" | "client" | "vip" | "inactive";
export type DealStage = "inquiry" | "consultation" | "proposal" | "booked" | "in_progress" | "completed" | "lost";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
  tags: string[];
  notes?: string;
  source?: string; // e.g. "squarespace", "manual"
  squarespaceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId?: string;
  stage: DealStage;
  value: number;
  eventDate?: string;
  eventType?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  contactId?: string;
  dealId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  contactId?: string;
  dealId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMStore {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  notes: Note[];
  squarespaceApiKey?: string;
  squarespaceWebsiteId?: string;
  lastSyncedAt?: string;
}

const STORAGE_KEY = "ahrendezvous_crm";

function defaultStore(): CRMStore {
  return {
    contacts: [
      {
        id: "c1",
        name: "Marcus Rivera",
        email: "marcus.rivera@example.com",
        phone: "(555) 201-4400",
        company: "Starlight Events",
        status: "client",
        tags: ["corporate", "repeat"],
        source: "manual",
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: "c2",
        name: "Destiny Moore",
        email: "destiny@mooreproductions.com",
        phone: "(555) 340-8821",
        status: "prospect",
        tags: ["film", "wedding"],
        source: "squarespace",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "c3",
        name: "Jae-Won Park",
        email: "jaewon@parkentertainment.io",
        phone: "(555) 789-1200",
        company: "Park Entertainment",
        status: "lead",
        tags: ["music", "live"],
        source: "manual",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    deals: [
      {
        id: "d1",
        title: "Starlight Gala 2026",
        contactId: "c1",
        stage: "booked",
        value: 8500,
        eventDate: "2026-09-15",
        eventType: "Corporate Event",
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "d2",
        title: "Moore Wedding Film",
        contactId: "c2",
        stage: "proposal",
        value: 4200,
        eventDate: "2026-08-20",
        eventType: "Wedding",
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "d3",
        title: "Park Music Video",
        contactId: "c3",
        stage: "inquiry",
        value: 2800,
        eventType: "Music Video",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    tasks: [
      {
        id: "t1",
        title: "Send contract to Marcus Rivera",
        status: "todo",
        priority: "urgent",
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        contactId: "c1",
        dealId: "d1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "t2",
        title: "Follow up on Moore Wedding proposal",
        status: "in_progress",
        priority: "high",
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
        contactId: "c2",
        dealId: "d2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "t3",
        title: "Schedule consultation with Jae-Won",
        status: "todo",
        priority: "medium",
        contactId: "c3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    notes: [
      {
        id: "n1",
        title: "Starlight Gala requirements",
        content:
          "Marcus wants a 3-camera setup with drone footage. Venue: Grand Ballroom downtown. Must coordinate with venue AV team. Client prefers cinematic color grade.",
        contactId: "c1",
        dealId: "d1",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
  };
}

export function loadStore(): CRMStore {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const store = defaultStore();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return store;
    }
    return JSON.parse(raw) as CRMStore;
  } catch {
    return defaultStore();
  }
}

export function saveStore(store: CRMStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function addContact(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Contact {
  const store = loadStore();
  const contact: Contact = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.contacts.unshift(contact);
  saveStore(store);
  return contact;
}

export function updateContact(id: string, data: Partial<Contact>): void {
  const store = loadStore();
  store.contacts = store.contacts.map((c) =>
    c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
  );
  saveStore(store);
}

export function deleteContact(id: string): void {
  const store = loadStore();
  store.contacts = store.contacts.filter((c) => c.id !== id);
  saveStore(store);
}

export function addDeal(data: Omit<Deal, "id" | "createdAt" | "updatedAt">): Deal {
  const store = loadStore();
  const deal: Deal = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.deals.unshift(deal);
  saveStore(store);
  return deal;
}

export function updateDeal(id: string, data: Partial<Deal>): void {
  const store = loadStore();
  store.deals = store.deals.map((d) =>
    d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
  );
  saveStore(store);
}

export function deleteDeal(id: string): void {
  const store = loadStore();
  store.deals = store.deals.filter((d) => d.id !== id);
  saveStore(store);
}

export function addTask(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
  const store = loadStore();
  const task: Task = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.tasks.unshift(task);
  saveStore(store);
  return task;
}

export function updateTask(id: string, data: Partial<Task>): void {
  const store = loadStore();
  store.tasks = store.tasks.map((t) =>
    t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
  );
  saveStore(store);
}

export function deleteTask(id: string): void {
  const store = loadStore();
  store.tasks = store.tasks.filter((t) => t.id !== id);
  saveStore(store);
}

export function addNote(data: Omit<Note, "id" | "createdAt" | "updatedAt">): Note {
  const store = loadStore();
  const note: Note = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.notes.unshift(note);
  saveStore(store);
  return note;
}

export function updateNote(id: string, data: Partial<Note>): void {
  const store = loadStore();
  store.notes = store.notes.map((n) =>
    n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
  );
  saveStore(store);
}

export function deleteNote(id: string): void {
  const store = loadStore();
  store.notes = store.notes.filter((n) => n.id !== id);
  saveStore(store);
}

export function saveSquarespaceSettings(apiKey: string, websiteId: string): void {
  const store = loadStore();
  store.squarespaceApiKey = apiKey;
  store.squarespaceWebsiteId = websiteId;
  saveStore(store);
}
