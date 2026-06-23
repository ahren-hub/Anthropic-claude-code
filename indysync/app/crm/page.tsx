"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Briefcase,
  CheckSquare,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react";
import { loadStore, type CRMStore } from "@/lib/crm-store";

const STAGE_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  consultation: "Consultation",
  proposal: "Proposal",
  booked: "Booked",
  in_progress: "In Progress",
  completed: "Completed",
  lost: "Lost",
};

const STAGE_COLORS: Record<string, string> = {
  inquiry: "#6366f1",
  consultation: "#8b5cf6",
  proposal: "#c9a84c",
  booked: "#22c55e",
  in_progress: "#06b6d4",
  completed: "#4ade80",
  lost: "#6b7280",
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#c9a84c",
  low: "#6b7280",
};

// Mock monthly revenue data for the chart
const monthlyRevenue = [
  { month: "Jan", revenue: 2400, bookings: 2 },
  { month: "Feb", revenue: 1800, bookings: 1 },
  { month: "Mar", revenue: 5200, bookings: 4 },
  { month: "Apr", revenue: 3800, bookings: 3 },
  { month: "May", revenue: 6100, bookings: 5 },
  { month: "Jun", revenue: 4900, bookings: 3 },
  { month: "Jul", revenue: 7800, bookings: 6 },
  { month: "Aug", revenue: 5600, bookings: 4 },
  { month: "Sep", revenue: 9200, bookings: 7 },
  { month: "Oct", revenue: 8100, bookings: 6 },
  { month: "Nov", revenue: 11400, bookings: 9 },
  { month: "Dec", revenue: 13200, bookings: 10 },
];

const revenueSparkline = [2400, 1800, 5200, 3800, 6100, 4900, 7800, 5600, 9200, 8100, 11400, 13200];
const contactsSparkline = [1, 3, 2, 5, 4, 6, 8, 7, 9, 11, 10, 14];
const dealsSparkline = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7];
const tasksSparkline = [5, 8, 6, 10, 7, 12, 9, 14, 11, 16, 13, 18];

function Sparkline({
  data,
  color,
  up,
}: {
  data: number[];
  color: string;
  up?: boolean;
}) {
  const points = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function CRMDashboard() {
  const [store, setStore] = useState<CRMStore | null>(null);

  useEffect(() => {
    setStore(loadStore());
  }, []);

  if (!store) return <DashboardSkeleton />;

  const totalContacts = store.contacts.length;
  const activeDeals = store.deals.filter((d) => !["completed", "lost"].includes(d.stage));
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const openTasks = store.tasks.filter((t) => t.status !== "done");
  const overdueTasks = openTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date()
  );
  const wonDeals = store.deals.filter((d) => d.stage === "completed");
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const pipelineBreakdown = (["inquiry", "consultation", "proposal", "booked", "in_progress"] as const).map(
    (stage) => ({
      name: STAGE_LABELS[stage],
      value: store.deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
      color: STAGE_COLORS[stage],
    })
  ).filter((s) => s.value > 0);

  const recentContacts = [...store.contacts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const urgentTasks = [...store.tasks]
    .filter((t) => t.status !== "done" && ["urgent", "high"].includes(t.priority))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
            Ahrendezvous CRM
          </p>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/crm/contacts"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            <Plus size={14} />
            Add Contact
          </Link>
          <Link
            href="/crm/deals"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            <Plus size={14} />
            New Deal
          </Link>
        </div>
      </div>

      {/* KPI Cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={<DollarSign size={16} />}
          label="Revenue Won"
          value={`$${wonValue.toLocaleString()}`}
          change="+18%"
          up
          sparkData={revenueSparkline}
          sparkColor="#c9a84c"
        />
        <KPICard
          icon={<Users size={16} />}
          label="Total Contacts"
          value={totalContacts.toString()}
          change="+12%"
          up
          sparkData={contactsSparkline}
          sparkColor="#6366f1"
        />
        <KPICard
          icon={<Briefcase size={16} />}
          label="Active Deals"
          value={activeDeals.length.toString()}
          change={`$${pipelineValue.toLocaleString()} pipeline`}
          up
          sparkData={dealsSparkline}
          sparkColor="#22c55e"
        />
        <KPICard
          icon={<CheckSquare size={16} />}
          label="Open Tasks"
          value={openTasks.length.toString()}
          change={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "All on track"}
          up={overdueTasks.length === 0}
          sparkData={tasksSparkline}
          sparkColor="#f97316"
          alert={overdueTasks.length > 0}
        />
      </div>

      {/* Revenue Chart + Pipeline Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue area chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold">Revenue Overview</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Monthly bookings revenue
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
              <ArrowUpRight size={12} />
              +24% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "var(--foreground)",
                }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c9a84c"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline donut */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold mb-1">Pipeline</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            By deal stage
          </p>
          {pipelineBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pipelineBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pipelineBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pipelineBreakdown.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span style={{ color: "var(--text-muted)" }}>{s.name}</span>
                    </div>
                    <span className="font-medium">${s.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
              No active deals
            </p>
          )}
        </div>
      </div>

      {/* Bookings bar chart + Tasks + Recent contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly bookings bar chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold mb-1">Bookings / Month</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Number of events booked
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v) => [v, "Bookings"]}
              />
              <Bar dataKey="bookings" fill="var(--gold)" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority tasks */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Priority Tasks</h2>
            <Link href="/crm/tasks" className="text-xs" style={{ color: "var(--gold)" }}>
              View all →
            </Link>
          </div>
          {urgentTasks.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
              All caught up!
            </p>
          ) : (
            <div className="space-y-3">
              {urgentTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                return (
                  <div key={task.id} className="flex items-start gap-3">
                    <div
                      className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: PRIORITY_COLOR[task.priority] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-snug">{task.title}</p>
                      {task.dueDate && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: isOverdue ? "#ef4444" : "var(--text-muted)" }}
                        >
                          {isOverdue ? "Overdue · " : "Due "}
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                      style={{
                        background: `${PRIORITY_COLOR[task.priority]}22`,
                        color: PRIORITY_COLOR[task.priority],
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Contacts</h2>
            <Link href="/crm/contacts" className="text-xs" style={{ color: "var(--gold)" }}>
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentContacts.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}
                >
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-snug">{c.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    {c.email}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  change,
  up,
  sparkData,
  sparkColor,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  up: boolean;
  sparkData: number[];
  sparkColor: string;
  alert?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 overflow-hidden relative"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${sparkColor}20`, color: sparkColor }}
        >
          {icon}
        </div>
        <div
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            background: alert ? "rgba(239,68,68,0.12)" : up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            color: alert ? "#ef4444" : up ? "#4ade80" : "#ef4444",
          }}
        >
          {alert ? <AlertCircle size={10} /> : up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          <span>{change}</span>
        </div>
      </div>
      <div className="text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="-mx-5 -mb-5">
        <Sparkline data={sparkData} color={sparkColor} up={up} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    lead: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
    prospect: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    client: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
    vip: { bg: "rgba(201,168,76,0.15)", color: "var(--gold)" },
    inactive: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af" },
  };
  const c = colors[status] ?? colors.lead;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0"
      style={{ background: c.bg, color: c.color }}
    >
      {status}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="h-8 w-48 rounded-lg mb-8" style={{ background: "var(--surface)" }} />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-72 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
        <div className="h-72 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
      </div>
    </div>
  );
}
