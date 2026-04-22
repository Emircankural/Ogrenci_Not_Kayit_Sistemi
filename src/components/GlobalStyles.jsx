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
    `}</style>
  );
}
