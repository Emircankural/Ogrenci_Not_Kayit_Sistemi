import React, { useCallback, useState } from "react";
import GlobalStyles from "./components/GlobalStyles.jsx";
import Toast from "./components/Toast.jsx";
import Login from "./components/Login.jsx";
import StudentPanel from "./components/StudentPanel.jsx";
import TeacherPanel from "./components/TeacherPanel.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

const DEMO_USERS = {
  ogrenci: { username: "ogrenci1", password: "123", name: "Ahmet Yılmaz" },
  ogretmen: { username: "ogretmen1", password: "123", name: "Dr. Ayşe Kaya" },
  admin: { username: "admin", password: "admin", name: "Admin" }
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => setToast(message), []);

  const handleLogin = ({ role, username, password }) => {
    const cleanUsername = username.trim();

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
      {screen === "ogrenci" && <StudentPanel user={user} onLogout={logout} />}
      {screen === "ogretmen" && <TeacherPanel user={user} onLogout={logout} showToast={showToast} />}
      {screen === "admin" && <AdminPanel onLogout={logout} showToast={showToast} />}
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
