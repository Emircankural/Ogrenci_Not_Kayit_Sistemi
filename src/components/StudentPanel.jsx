import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { gradeRows, studentCourses } from "../data/mockData.js";
import { colors } from "../utils/theme.js";
import { Badge, PrimaryButton, Sidebar, StatCard, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "grades", label: "📊 Notlarım" },
  { key: "courses", label: "📅 Derslerim" },
  { key: "profile", label: "👤 Profilim" }
];

export default function StudentPanel({ user, onLogout }) {
  const [active, setActive] = useState("grades");
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", repeatPassword: "" });

  const updatePassword = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen p-5" style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)" }}>
      <Topbar
        icon={<GraduationCap size={24} />}
        subtitle="Kocaeli Üniversitesi"
        title={`Hoşgeldin, ${user?.name || "Ahmet Yılmaz"} 🎓`}
        onLogout={onLogout}
      />
      <div className="panel-layout grid grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Sidebar items={navItems} active={active} setActive={setActive} />
        <main className="page-enter min-w-0">
          {active === "grades" && <GradesView />}
          {active === "courses" && <CoursesView />}
          {active === "profile" && (
            <ProfileView form={passwordForm} updateField={updatePassword} />
          )}
        </main>
      </div>
    </div>
  );
}

function GradesView() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="GNO" value="3.24" helper="4.00 üzerinden" />
        <StatCard label="Geçilen Ders" value="8" helper="Bu akademik yıl" />
        <StatCard label="Kalan Ders" value="2" helper="Takip önerilir" />
      </div>
      <div className="card-flat accent-left table-scroll p-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ color: colors.greenMain }}>
              <th className="p-4 text-sm">Ders Adı</th>
              <th className="p-4 text-sm">Vize</th>
              <th className="p-4 text-sm">Final</th>
              <th className="p-4 text-sm">Ortalama</th>
              <th className="p-4 text-sm">Durum</th>
            </tr>
          </thead>
          <tbody>
            {gradeRows.map((row) => (
              <tr key={row.course} className="border-t" style={{ borderColor: colors.grayBorder }}>
                <td className="p-4 font-bold">{row.course}</td>
                <td className="p-4">{row.midterm}</td>
                <td className="p-4">{row.final}</td>
                <td className="p-4 font-extrabold">{row.average.toFixed(1)}</td>
                <td className="p-4"><Badge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CoursesView() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {studentCourses.map((course) => (
        <article key={course.code} className="card-flat accent-top p-5">
          <span className="text-sm font-extrabold" style={{ color: colors.greenMain }}>{course.code}</span>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: colors.textDark }}>{course.name}</h2>
          <p className="mt-3 font-semibold" style={{ color: colors.textMid }}>{course.teacher}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.greenBg, color: colors.greenMain }}>{course.credit} kredi</span>
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.grayLight, color: colors.textMid }}>{course.time}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function ProfileView({ form, updateField }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="card-flat accent-left p-6">
        <h2 className="mb-5 text-3xl font-bold" style={{ color: colors.textDark }}>Profilim</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Info label="Ad" value="Ahmet" />
          <Info label="Soyad" value="Yılmaz" />
          <Info label="Öğrenci No" value="202401034" />
          <Info label="Bölüm" value="Bilgisayar Mühendisliği" />
          <Info label="E-posta" value="ahmet.yilmaz@kocaeli.edu.tr" />
          <Info label="Kayıt Yılı" value="2024" />
        </div>
      </div>
      <form className="card-flat accent-top p-6" onSubmit={(event) => event.preventDefault()}>
        <h2 className="mb-5 text-3xl font-bold" style={{ color: colors.textDark }}>Şifre Değiştir</h2>
        <div className="grid gap-4">
          <TextInput label="Eski Şifre" type="password" value={form.oldPassword} onChange={(event) => updateField("oldPassword", event.target.value)} />
          <TextInput label="Yeni Şifre" type="password" value={form.newPassword} onChange={(event) => updateField("newPassword", event.target.value)} />
          <TextInput label="Yeni Şifre Tekrar" type="password" value={form.repeatPassword} onChange={(event) => updateField("repeatPassword", event.target.value)} />
          <PrimaryButton type="submit">Şifre Değiştir</PrimaryButton>
        </div>
      </form>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: colors.grayBorder, background: colors.grayLight }}>
      <span className="text-sm font-bold" style={{ color: colors.textMid }}>{label}</span>
      <strong className="mt-1 block" style={{ color: colors.textDark }}>{value}</strong>
    </div>
  );
}
