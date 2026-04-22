import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { colors } from "../utils/theme.js";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      className="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-white shadow-2xl"
      style={{ background: colors.greenMain }}
    >
      <CheckCircle2 size={20} />
      <span className="font-bold">{message}</span>
    </div>
  );
}
