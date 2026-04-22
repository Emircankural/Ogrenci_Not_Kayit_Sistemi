import React from "react";
import { LogOut, Menu } from "lucide-react";
import { colors } from "../utils/theme.js";

export function TextInput({ label, error, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold" style={{ color: colors.textMid }}>{label}</span>
      <input
        {...props}
        className={`focus-ring h-12 rounded-xl border bg-white px-4 text-sm ${props.className || ""}`}
        style={{ borderColor: error ? colors.redDanger : colors.grayBorder, color: colors.textDark }}
      />
    </label>
  );
}

export function SelectInput({ label, children, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold" style={{ color: colors.textMid }}>{label}</span>
      <select
        {...props}
        className="focus-ring h-12 rounded-xl border bg-white px-4 text-sm"
        style={{ borderColor: colors.grayBorder, color: colors.textDark }}
      >
        {children}
      </select>
    </label>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`button-soft inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-extrabold text-white shadow-lg ${className}`}
      style={{ background: colors.greenMain, boxShadow: "0 14px 28px rgba(22, 101, 52, 0.18)" }}
      onMouseEnter={(event) => { event.currentTarget.style.background = colors.greenDark; }}
      onMouseLeave={(event) => { event.currentTarget.style.background = colors.greenMain; }}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="button-soft inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-extrabold text-white"
      style={{ background: colors.redDanger }}
    >
      {children}
    </button>
  );
}

export function Badge({ status }) {
  const passed = status === "Geçti";
  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-extrabold"
      style={{
        color: passed ? "#166534" : "#991b1b",
        background: passed ? "#dcfce7" : "#fee2e2"
      }}
    >
      {status}
    </span>
  );
}

export function Topbar({ title, subtitle, icon, onLogout, danger = false }) {
  return (
    <header className="topbar-stack card-flat mb-6 flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl text-white"
          style={{ background: colors.greenMain }}
        >
          {icon || <Menu size={22} />}
        </div>
        <div>
          <p className="text-sm font-extrabold" style={{ color: colors.greenMain }}>{subtitle}</p>
          <h1 className="text-2xl font-bold" style={{ color: colors.textDark }}>{title}</h1>
        </div>
      </div>
      <button
        type="button"
        className="button-soft inline-flex min-h-11 items-center gap-2 rounded-xl px-5 font-extrabold text-white"
        style={{ background: danger ? colors.redDanger : colors.greenMain }}
        onClick={onLogout}
      >
        <LogOut size={18} /> Çıkış
      </button>
    </header>
  );
}

export function Sidebar({ items, active, setActive }) {
  return (
    <aside className="panel-sidebar card-flat sticky top-5 h-fit p-4">
      <div className="mb-5 border-b pb-4" style={{ borderColor: colors.grayBorder }}>
        <p className="text-sm font-extrabold" style={{ color: colors.greenMain }}>Kocaeli Üniversitesi</p>
        <p className="text-xs font-semibold" style={{ color: colors.textMid }}>Not Kayıt Sistemi</p>
      </div>
      <nav className="grid gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item rounded-xl border-l-4 px-4 py-3 text-left font-extrabold ${active === item.key ? "active" : ""}`}
            style={{ borderLeftColor: active === item.key ? colors.greenMain : "transparent", color: active === item.key ? colors.greenMain : colors.textMid }}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function StatCard({ label, value, helper }) {
  return (
    <article className="card-flat accent-top p-5">
      <p className="text-sm font-extrabold" style={{ color: colors.textMid }}>{label}</p>
      <strong className="mt-2 block text-4xl" style={{ color: colors.greenMain }}>{value}</strong>
      {helper && <span className="mt-2 block text-sm font-semibold" style={{ color: colors.textMid }}>{helper}</span>}
    </article>
  );
}
