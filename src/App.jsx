import React, { useCallback, useState } from "react";
import GlobalStyles from "./components/GlobalStyles.jsx";
import Toast from "./components/Toast.jsx";
import Login from "./components/Login.jsx";
import StudentPanel from "./components/StudentPanel.jsx";
import TeacherPanel from "./components/TeacherPanel.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { api } from "./services/api.js";

const DEMO_USERS = {
  ogrenci: { username: "202401034", password: "123", name: "Ahmet Yılmaz" },
  ogretmen: { username: "ayse.kaya@kocaeli.edu.tr", password: "123", name: "Dr. Ayşe Kaya" },
  admin: { username: "admin", password: "admin", name: "Admin" }
};

export default function App() {
  const isTranscriptPreview = new URLSearchParams(window.location.search).get("view") === "transcript";
  const [screen, setScreen] = useState(isTranscriptPreview ? "ogrenci" : "login");
  const [user, setUser] = useState(isTranscriptPreview ? { role: "ogrenci", name: "Mehmet Demir" } : null);
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => setToast(message), []);

  const handleLogin = async ({ role, username, password }) => {
    const cleanUsername = username.trim();

    try {
      const account = await api.login({ role, username: cleanUsername, password });
      setUser({ role: account.role, name: account.name || account.username });
      setScreen(account.role);
      return { ok: true };
    } catch (_error) {
      // Backend kapalıyken mevcut demo akışı bozulmasın diye eski girişler yedek olarak korunur.
    }

    if (cleanUsername === DEMO_USERS.admin.username && password === DEMO_USERS.admin.password) {
      setUser({ role: "admin", name: DEMO_USERS.admin.name });
      setScreen("admin");
      return { ok: true };
    }

    const account = DEMO_USERS[role];
    if (account && cleanUsername === account.username && password === account.password) {
      setUser({ role, name: account.name });
      setScreen(role);
      return { ok: true };
    }

    return { ok: false };
  };

  const logout = () => {
    setUser(null);
    setScreen("login");
  };

  return (
    <>
      <GlobalStyles />
      {screen === "login" && <Login onLogin={handleLogin} />}
      {screen === "ogrenci" && <StudentPanel user={user} onLogout={logout} initialActive={isTranscriptPreview ? "transcript" : "grades"} previewOnly={isTranscriptPreview} />}
      {screen === "ogretmen" && <TeacherPanel user={user} onLogout={logout} showToast={showToast} />}
      {screen === "admin" && <AdminPanel onLogout={logout} showToast={showToast} />}
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
