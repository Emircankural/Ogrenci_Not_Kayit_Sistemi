import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { gradeRows, studentCourses } from "../data/mockData.js";
import {
  getCourseResult,
  getGradeClassName,
  gradeCoefficients,
  groupCoursesBySemester,
  internshipRows,
  transcriptCourses,
  transcriptStudentInfo
} from "../data/transcriptData.js";
import { colors } from "../utils/theme.js";
import { Badge, PrimaryButton, Sidebar, StatCard, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "grades", label: "📊 Notlarım" },
  { key: "courses", label: "📅 Derslerim" },
  { key: "profile", label: "👤 Profilim" },
  { key: "transcript", label: "📄 Transkript" }
];

export default function StudentPanel({ user, onLogout, initialActive = "grades", previewOnly = false }) {
  const [active, setActive] = useState(initialActive);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", repeatPassword: "" });

  const updatePassword = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  if (active === "transcript") {
    return <TranscriptView onBack={() => setActive("grades")} previewOnly={previewOnly} />;
  }

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

function TranscriptView({ onBack, previewOnly }) {
  const semesters = groupCoursesBySemester(transcriptCourses);

  return (
    <main className="transcript-page">
      <div className="transcript-document">
        <div className="transcript-toolbar">
          {!previewOnly && <button type="button" className="transcript-back" onClick={onBack}>← Geri Dön</button>}
          <button type="button" className="transcript-print" onClick={() => window.print()}>🖨️ Yazdır</button>
        </div>

        <header className="transcript-title">
          <h1>BAŞARI DURUM BELGESİ</h1>
        </header>

        <section className="transcript-info-grid">
          {[transcriptStudentInfo.left, transcriptStudentInfo.right].map((column, index) => (
            <div key={index}>
              {column.map(([label, value]) => (
                <p key={label}><strong>{label}</strong><span>:</span>{value}</p>
              ))}
            </div>
          ))}
        </section>

        <section className="transcript-block">
          <h2>STAJ BİLGİLERİ</h2>
          <div className="transcript-table-scroll">
            <table className="transcript-table">
              <thead>
                <tr>
                  {["Staj Konusu", "Başlangıç", "Bitiş", "Staj Türü", "Gün Sayısı", "Firma Adı", "Firma Adresi"].map((head) => <th key={head}>{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {internshipRows.map((row) => (
                  <tr key={`${row.start}-${row.company}`}>
                    <td>{row.topic}</td><td>{row.start}</td><td>{row.end}</td><td>{row.type}</td><td>{row.days}</td><td>{row.company}</td><td>{row.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {Object.entries(semesters).map(([semester, rows]) => (
          <section className="transcript-semester" key={semester}>
            <h2>{semester}. Yarıyıl</h2>
            <div className="transcript-table-scroll">
              <table className="transcript-table">
                <thead>
                  <tr>
                    {["Ders Kodu", "Ders Adı", "Ders Statüsü", "Öğretim Dili", "AKTS", "Başarı Notu", "Katsayı", "Başarı Durumu", "Açıklama"].map((head) => <th key={head}>{head}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((course) => {
                    const result = getCourseResult(course.grade);
                    return (
                      <tr key={course.code}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.status}</td>
                        <td>{course.language}</td>
                        <td>{course.ects}</td>
                        <td className={`transcript-grade ${getGradeClassName(course.grade)}`}>{course.grade}</td>
                        <td>{gradeCoefficients[course.grade]}</td>
                        <td className={result === "Başarısız" ? "transcript-grade-fail" : ""}>{result}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <footer className="transcript-footer">Öğrenci İşleri Sistemi — Belge Tarihi: 22/04/2026</footer>
      </div>
    </main>
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
