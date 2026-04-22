import React, { useState } from "react";
import { BookOpen, Eye, EyeOff, GraduationCap, School, Shapes } from "lucide-react";
import { colors, fonts } from "../utils/theme.js";
import { PrimaryButton, TextInput } from "./Shared.jsx";

const roleLabels = {
  ogrenci: "Öğrenci Girişi",
  ogretmen: "Öğretmen Girişi"
};

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setHasError(false);
  };

  const submit = (event) => {
    event.preventDefault();
    const result = onLogin({ role: selectedRole, ...form });
    if (!result.ok) setHasError(true);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2" style={{ fontFamily: fonts.body }}>
      <section
        className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
        style={{ background: `linear-gradient(135deg, ${colors.greenDark}, ${colors.greenMain} 58%, #052e16)` }}
      >
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/15" />
        <div className="absolute bottom-16 left-16 grid grid-cols-4 gap-3 opacity-20">
          {Array.from({ length: 24 }).map((_, index) => <span key={index} className="h-3 w-3 rounded-full bg-white" />)}
        </div>
        <div>
          <div className="mb-8 grid h-20 w-20 place-items-center rounded-3xl bg-white/15">
            <School size={42} />
          </div>
          <h1 className="max-w-xl text-6xl font-bold leading-tight" style={{ fontFamily: fonts.heading }}>
            Kocaeli Üniversitesi
          </h1>
          <p className="mt-5 max-w-lg text-lg text-green-50">
            Modern öğrenci not kayıt ve akademik değerlendirme otomasyonu.
          </p>
        </div>
        <div className="flex items-center gap-3 text-green-50">
          <Shapes size={22} />
          <span className="font-bold">Kurumsal, hızlı ve anlaşılır akademik deneyim.</span>
        </div>
      </section>

      <section className="grid place-items-center px-5 py-10" style={{ background: colors.white }}>
        <div className="page-enter w-full max-w-md">
          <div className="card-flat accent-top p-8">
            <div className="mb-7 flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: colors.greenMain }}>
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-extrabold" style={{ color: colors.greenMain }}>Not Kayıt Sistemi</p>
                <h2 className="text-4xl font-bold" style={{ color: colors.textDark }}>Hoşgeldin 👋</h2>
              </div>
            </div>

            {!selectedRole ? (
              <div className="grid gap-4">
                <RoleButton icon={<GraduationCap />} label="Öğrenci Girişi" onClick={() => setSelectedRole("ogrenci")} />
                <RoleButton icon={<School />} label="Öğretmen Girişi" onClick={() => setSelectedRole("ogretmen")} />
                <div className="rounded-2xl border p-4 text-sm font-semibold" style={{ borderColor: colors.grayBorder, background: colors.grayLight, color: colors.textMid }}>
                  <p><b>Öğrenci:</b> ogrenci1 / 123</p>
                  <p><b>Öğretmen:</b> ogretmen1 / 123</p>
                  <p><b>Admin:</b> admin / admin</p>
                </div>
              </div>
            ) : (
              <form className="page-enter grid gap-4" onSubmit={submit}>
                <button
                  type="button"
                  className="w-fit text-sm font-extrabold"
                  style={{ color: colors.greenMain }}
                  onClick={() => {
                    setSelectedRole("");
                    setHasError(false);
                    setForm({ username: "", password: "" });
                  }}
                >
                  ← Geri
                </button>
                <h3 className="text-2xl font-bold" style={{ color: colors.textDark }}>{roleLabels[selectedRole]}</h3>
                <TextInput
                  label="Kullanıcı Adı"
                  value={form.username}
                  error={hasError}
                  onChange={(event) => updateField("username", event.target.value)}
                  placeholder="Kullanıcı adınız"
                />
                <label className="grid gap-2">
                  <span className="text-sm font-bold" style={{ color: colors.textMid }}>Şifre</span>
                  <div className="relative">
                    <input
                      className="focus-ring h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm"
                      style={{ borderColor: hasError ? colors.redDanger : colors.grayBorder, color: colors.textDark }}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Şifreniz"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: colors.textMid }}
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label="Şifreyi göster veya gizle"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                {hasError && <p className="text-sm font-extrabold" style={{ color: colors.redDanger }}>Kullanıcı adı veya şifre hatalı</p>}
                <PrimaryButton type="submit" className="w-full">Giriş Yap</PrimaryButton>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function RoleButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      className="button-soft flex items-center gap-4 rounded-2xl border p-5 text-left"
      style={{ borderColor: colors.grayBorder, background: colors.greenBg, color: colors.textDark }}
      onClick={onClick}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: colors.greenMain }}>{icon}</span>
      <strong>{label}</strong>
    </button>
  );
}
