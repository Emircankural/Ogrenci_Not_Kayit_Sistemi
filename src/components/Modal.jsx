import React from "react";
import { X } from "lucide-react";
import { colors } from "../utils/theme.js";

export default function Modal({ title, children, onClose }) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4"
      onMouseDown={onClose}
    >
      <section
        className="modal-card card-flat w-full max-w-2xl p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold" style={{ color: colors.textDark }}>{title}</h2>
          <button
            type="button"
            className="button-soft grid h-10 w-10 place-items-center rounded-full border"
            style={{ borderColor: colors.grayBorder, color: colors.textMid }}
            onClick={onClose}
            aria-label="Modal kapat"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
