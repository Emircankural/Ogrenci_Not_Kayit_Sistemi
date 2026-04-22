import React from "react";
import { colors, fonts } from "../utils/theme.js";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :root {
        --green-dark: ${colors.greenDark};
        --green-main: ${colors.greenMain};
        --green-mid: ${colors.greenMid};
        --green-light: ${colors.greenLight};
        --green-bg: ${colors.greenBg};
        --white: ${colors.white};
        --gray-light: ${colors.grayLight};
        --gray-border: ${colors.grayBorder};
        --text-dark: ${colors.textDark};
        --text-mid: ${colors.textMid};
        --red-danger: ${colors.redDanger};
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text-dark);
        background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
        font-family: ${fonts.body};
      }

      h1, h2, h3 { font-family: ${fonts.heading}; letter-spacing: 0; }
      button, input, select { font: inherit; }
      button { cursor: pointer; }

      .page-enter { animation: fadeInUp 260ms ease both; }
      .button-soft { transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease, color 180ms ease; }
      .button-soft:hover { transform: scale(1.02); }
      .card-flat {
        background: white;
        border: 1px solid var(--gray-border);
        border-radius: 16px;
        box-shadow: 0 18px 45px rgba(21, 83, 45, 0.08);
      }
      .accent-top { border-top: 4px solid var(--green-main); }
      .accent-left { border-left: 4px solid var(--green-main); }
      .focus-ring:focus {
        outline: none;
        border-color: var(--green-mid);
        box-shadow: 0 0 0 4px rgba(187, 247, 208, 0.95);
      }
      .nav-item { transition: background 180ms ease, border-color 180ms ease, color 180ms ease; }
      .nav-item.active {
        color: var(--green-main);
        background: var(--green-bg);
        border-left-color: var(--green-main);
      }
      .table-scroll { overflow-x: auto; }
      .table-scroll table { min-width: 860px; }
      .modal-backdrop { animation: fadeOnly 180ms ease both; }
      .modal-card { animation: modalIn 220ms ease both; }
      .toast { animation: toastIn 220ms ease both; }
      .transcript-page {
        min-height: 100vh;
        padding: 24px;
        color: #111827;
        background: #ffffff;
        font-family: ${fonts.body};
      }
      .transcript-document {
        width: min(1180px, 100%);
        margin: 0 auto;
        color: #111827;
        background: #ffffff;
        font-size: 11.5px;
        line-height: 1.38;
      }
      .transcript-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }
      .transcript-back,
      .transcript-print {
        min-height: 38px;
        padding: 0 14px;
        color: #0f172a;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: #ffffff;
        font-weight: 800;
      }
      .transcript-print {
        color: #ffffff;
        border-color: #0f172a;
        background: #0f172a;
      }
      .transcript-title {
        display: flex;
        justify-content: center;
        margin-bottom: 18px;
        padding-bottom: 12px;
        border-bottom: 2px solid #111827;
      }
      .transcript-title h1 {
        color: #000000;
        font-family: ${fonts.body};
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0;
        text-align: center;
      }
      .transcript-info-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
        padding: 12px;
        border: 1px solid #d1d5db;
      }
      .transcript-info-grid p {
        display: grid;
        grid-template-columns: 132px 12px minmax(0, 1fr);
        gap: 2px;
        min-height: 22px;
        margin: 0;
        color: #111827;
      }
      .transcript-info-grid strong {
        font-weight: 800;
      }
      .transcript-block,
      .transcript-semester {
        margin-top: 14px;
      }
      .transcript-block h2,
      .transcript-semester h2 {
        margin: 0;
        color: #111827;
        font-family: ${fonts.body};
        font-size: 12px;
        font-weight: 800;
      }
      .transcript-semester {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .transcript-semester h2 {
        padding: 8px 10px;
        border: 1px solid #bbf7d0;
        border-bottom: 3px solid #16a34a;
        background: #f0fdf4;
      }
      .transcript-table-scroll {
        width: 100%;
        margin-top: 8px;
        overflow-x: auto;
      }
      .transcript-table {
        width: 100%;
        min-width: 980px;
        border-collapse: collapse;
        color: #111827;
      }
      .transcript-table th,
      .transcript-table td {
        padding: 7px 8px;
        color: #111827;
        text-align: left;
        border: 1px solid #d1d5db;
      }
      .transcript-table th {
        background: #f3f4f6;
        font-size: 10.5px;
        font-weight: 800;
        letter-spacing: 0;
        text-transform: none;
      }
      .transcript-table tbody tr:nth-child(even) {
        background: #f9fafb;
      }
      .transcript-grade {
        font-weight: 900;
      }
      .transcript-grade-high {
        color: #166534 !important;
      }
      .transcript-grade-neutral {
        color: #111827 !important;
      }
      .transcript-grade-warn {
        color: #f97316 !important;
      }
      .transcript-grade-fail {
        color: #dc2626 !important;
        font-weight: 900;
      }
      .transcript-footer {
        margin-top: 18px;
        padding-top: 10px;
        color: #111827;
        border-top: 1px solid #d1d5db;
        text-align: center;
        font-weight: 700;
      }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOnly {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalIn {
        from { opacity: 0; transform: translateY(14px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 860px) {
        .panel-layout { grid-template-columns: 1fr !important; }
        .panel-sidebar { position: static !important; }
        .topbar-stack { align-items: flex-start !important; flex-direction: column; }
      }
      @media (max-width: 640px) {
        .transcript-page { padding: 16px; }
        .transcript-toolbar {
          align-items: stretch;
          flex-direction: column;
        }
        .transcript-info-grid {
          grid-template-columns: 1fr;
        }
        .transcript-info-grid p {
          grid-template-columns: 126px 10px minmax(0, 1fr);
        }
      }
      @media print {
        @page {
          size: A4 landscape;
          margin: 9mm;
        }
        html,
        body,
        #root {
          width: auto;
          min-height: auto;
          background: #ffffff !important;
        }
        .transcript-page {
          min-height: auto;
          padding: 0;
          background: #ffffff !important;
        }
        .transcript-toolbar {
          display: none !important;
        }
        .transcript-document {
          width: 100%;
          max-width: none;
          font-size: 11px;
        }
        .transcript-table-scroll {
          overflow: visible;
        }
        .transcript-table {
          min-width: 0;
          page-break-inside: auto;
        }
        .transcript-table th,
        .transcript-table td {
          padding: 5px 6px;
        }
        .transcript-semester {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `}</style>
  );
}
