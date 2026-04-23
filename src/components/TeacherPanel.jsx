import React, { useMemo, useState } from "react";
import { School } from "lucide-react";
import { teacherCourses, teacherStudents } from "../data/mockData.js";
import { colors } from "../utils/theme.js";
import { Badge, PrimaryButton, Sidebar, SelectInput, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "grade-entry", label: "📝 Not Gir" },
  { key: "students", label: "👥 Öğrencilerim" },
  { key: "courses", label: "📋 Derslerim" },
  { key: "profile", label: "👤 Profilim" }
];

const emptyGradeForm = {
  term: "2025-2026 Güz",
  course: "",
  student: "",
  midterm: "",
  final: ""
};

const dersOgrencileri = {
  BLM101: {
    dersAdi: "Algoritma ve Programlama",
    kredi: 5,
    gunSaat: "Pzt 09:00",
    degerlenirme: {
      yicBilesenleri: [{ ad: "Ara Sınav", agirlik: 100 }],
      yicEtkisi: 40,
      finalEtkisi: 60,
      gecmeNotu: 50
    },
    ogrenciler: [
      { no: "220101001", ad: "Ahmet Yılmaz", araSinav: 78, final: 85 },
      { no: "220101002", ad: "Zeynep Arslan", araSinav: 55, final: 48 },
      { no: "220101003", ad: "Burak Çelik", araSinav: 90, final: 88 },
      { no: "220101004", ad: "Selin Kaya", araSinav: 72, final: 76 },
      { no: "220101005", ad: "Emre Yıldız", araSinav: 65, final: 70 },
      { no: "220101006", ad: "Ayşe Demir", araSinav: 50, final: 45 },
      { no: "220101007", ad: "Murat Şahin", araSinav: 88, final: 91 },
      { no: "220101008", ad: "Elif Koç", araSinav: null, final: null },
      { no: "220101009", ad: "Can Öztürk", araSinav: 60, final: 63 },
      { no: "220101010", ad: "Hande Güler", araSinav: null, final: null }
    ]
  },
  BLM210: {
    dersAdi: "Web Teknolojileri",
    kredi: 4,
    gunSaat: "Çar 10:00",
    degerlenirme: {
      yicBilesenleri: [
        { ad: "Vize", agirlik: 50 },
        { ad: "Proje", agirlik: 50 }
      ],
      yicEtkisi: 40,
      finalEtkisi: 60,
      gecmeNotu: 50
    },
    ogrenciler: [
      { no: "220101001", ad: "Ahmet Yılmaz", vize: 80, proje: 85, final: 78 },
      { no: "220101003", ad: "Burak Çelik", vize: 95, proje: 90, final: 92 },
      { no: "220101011", ad: "Deniz Yurt", vize: 60, proje: 55, final: 50 },
      { no: "220101012", ad: "Melis Tan", vize: 45, proje: 40, final: 38 },
      { no: "220101013", ad: "Serkan Aydın", vize: 70, proje: 75, final: 80 },
      { no: "220101014", ad: "Pınar Erdoğan", vize: null, proje: null, final: null }
    ]
  },
  BLM330: {
    dersAdi: "Yazılım Mühendisliği",
    kredi: 4,
    gunSaat: "Pzt 14:00",
    degerlenirme: {
      yicBilesenleri: [
        { ad: "Ödev", agirlik: 30 },
        { ad: "Vize", agirlik: 70 }
      ],
      yicEtkisi: 60,
      finalEtkisi: 40,
      gecmeNotu: 50
    },
    ogrenciler: [
      { no: "220101002", ad: "Zeynep Arslan", odev: 88, vize: 82, final: 79 },
      { no: "220101004", ad: "Selin Kaya", odev: 95, vize: 90, final: 88 },
      { no: "220101007", ad: "Murat Şahin", odev: 70, vize: 65, final: 72 },
      { no: "220101015", ad: "Kemal Bulut", odev: 55, vize: 48, final: 42 },
      { no: "220101016", ad: "Rana Işık", odev: null, vize: null, final: null }
    ]
  }
};

export default function TeacherPanel({ user, onLogout, showToast }) {
  const [active, setActive] = useState("grade-entry");
  const [gradeForm, setGradeForm] = useState(emptyGradeForm);
  const [students, setStudents] = useState(teacherStudents);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  const average = useMemo(() => {
    const midterm = Number(gradeForm.midterm) || 0;
    const final = Number(gradeForm.final) || 0;
    return (midterm * 0.4 + final * 0.6).toFixed(1);
  }, [gradeForm.midterm, gradeForm.final]);

  const filteredStudents = students.filter((student) => {
    const text = `${student.name} ${student.no} ${student.course}`.toLocaleLowerCase("tr-TR");
    return text.includes(search.toLocaleLowerCase("tr-TR"));
  });

  const updateGradeForm = (field, value) => {
    setGradeForm((current) => ({ ...current, [field]: value }));
  };

  const saveGrade = (event) => {
    event.preventDefault();
    showToast("Not kaydı başarıyla oluşturuldu.");
    setGradeForm(emptyGradeForm);
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditRow({ ...student });
  };

  const saveInlineEdit = () => {
    setStudents((current) => current.map((student) => student.id === editingId ? { ...editRow } : student));
    setEditingId(null);
    setEditRow(null);
    showToast("Öğrenci notu güncellendi.");
  };

  const openGradeEntryForCourse = (code) => {
    const course = dersOgrencileri[code];
    setSelectedCourseCode("");
    setActive("grade-entry");
    if (course) {
      setGradeForm((current) => ({ ...current, course: course.dersAdi }));
    }
  };

  return (
    <div className="min-h-screen p-5" style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)" }}>
      <Topbar
        icon={<School size={24} />}
        subtitle="Kocaeli Üniversitesi"
        title={`Hoşgeldin, ${user?.name || "Dr. Ayşe Kaya"} 👨‍🏫`}
        onLogout={onLogout}
      />
      <div className="panel-layout grid grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Sidebar items={navItems} active={active} setActive={setActive} />
        <main className="page-enter min-w-0">
          {active === "grade-entry" && (
            <GradeEntryView form={gradeForm} updateField={updateGradeForm} average={average} onSubmit={saveGrade} />
          )}
          {active === "students" && (
            <StudentsView
              search={search}
              setSearch={setSearch}
              students={filteredStudents}
              editingId={editingId}
              editRow={editRow}
              setEditRow={setEditRow}
              startEdit={startEdit}
              saveInlineEdit={saveInlineEdit}
              cancelEdit={() => {
                setEditingId(null);
                setEditRow(null);
              }}
            />
          )}
          {active === "courses" && <TeacherCoursesView onOpenCourse={setSelectedCourseCode} />}
          {active === "profile" && <TeacherProfileView />}
        </main>
      </div>
      {selectedCourseCode && (
        <CourseStudentsModal
          code={selectedCourseCode}
          course={dersOgrencileri[selectedCourseCode]}
          onClose={() => setSelectedCourseCode("")}
          onGradeEntry={() => openGradeEntryForCourse(selectedCourseCode)}
        />
      )}
    </div>
  );
}

function GradeEntryView({ form, updateField, average, onSubmit }) {
  return (
    <form className="card-flat accent-left max-w-5xl p-6" onSubmit={onSubmit}>
      <h2 className="mb-5 text-3xl font-bold" style={{ color: colors.textDark }}>Not Gir</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectInput label="Dönem seç" value={form.term} onChange={(event) => updateField("term", event.target.value)}>
          <option>2025-2026 Güz</option>
          <option>2025-2026 Bahar</option>
          <option>2024-2025 Yaz</option>
        </SelectInput>
        <SelectInput label="Ders seç" value={form.course} onChange={(event) => updateField("course", event.target.value)}>
          <option value="">Ders seçiniz</option>
          {teacherCourses.map((course) => <option key={course.code}>{course.name}</option>)}
        </SelectInput>
        <SelectInput label="Öğrenci seç" value={form.student} onChange={(event) => updateField("student", event.target.value)}>
          <option value="">Öğrenci seçiniz</option>
          {teacherStudents.map((student) => <option key={student.id}>{student.name}</option>)}
        </SelectInput>
        <TextInput label="Vize" type="number" min="0" max="100" value={form.midterm} onChange={(event) => updateField("midterm", event.target.value)} />
        <TextInput label="Final" type="number" min="0" max="100" value={form.final} onChange={(event) => updateField("final", event.target.value)} />
        <div className="rounded-2xl border p-4" style={{ borderColor: colors.grayBorder, background: colors.greenBg }}>
          <span className="text-sm font-bold" style={{ color: colors.textMid }}>Anlık Ortalama</span>
          <strong className="mt-1 block text-3xl" style={{ color: colors.greenMain }}>{average}</strong>
        </div>
      </div>
      <PrimaryButton type="submit" className="mt-5">Kaydet</PrimaryButton>
    </form>
  );
}

function StudentsView({ search, setSearch, students, editingId, editRow, setEditRow, startEdit, saveInlineEdit, cancelEdit }) {
  return (
    <section className="grid gap-4">
      <TextInput label="Arama" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ad, no veya ders ara" />
      <div className="card-flat accent-left table-scroll p-4">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ color: colors.greenMain }}>
              <th className="p-4 text-sm">Ad Soyad</th>
              <th className="p-4 text-sm">No</th>
              <th className="p-4 text-sm">Ders</th>
              <th className="p-4 text-sm">Vize</th>
              <th className="p-4 text-sm">Final</th>
              <th className="p-4 text-sm">Ort</th>
              <th className="p-4 text-sm">Durum</th>
              <th className="p-4 text-sm">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const row = editingId === student.id ? editRow : student;
              const average = Number(row.midterm) * 0.4 + Number(row.final) * 0.6;
              const status = average >= 50 ? "Geçti" : "Kaldı";
              return (
                <tr key={student.id} className="border-t" style={{ borderColor: colors.grayBorder }}>
                  <td className="p-4 font-bold">{student.name}</td>
                  <td className="p-4">{student.no}</td>
                  <td className="p-4">{student.course}</td>
                  <td className="p-4">
                    {editingId === student.id ? <SmallInput value={editRow.midterm} onChange={(value) => setEditRow((current) => ({ ...current, midterm: value }))} /> : student.midterm}
                  </td>
                  <td className="p-4">
                    {editingId === student.id ? <SmallInput value={editRow.final} onChange={(value) => setEditRow((current) => ({ ...current, final: value }))} /> : student.final}
                  </td>
                  <td className="p-4 font-extrabold">{average.toFixed(1)}</td>
                  <td className="p-4"><Badge status={status} /></td>
                  <td className="p-4">
                    {editingId === student.id ? (
                      <div className="flex gap-2">
                        <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={saveInlineEdit}>✅ Kaydet</button>
                        <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.redDanger }} onClick={cancelEdit}>❌ İptal</button>
                      </div>
                    ) : (
                      <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={() => startEdit(student)}>✏️ Düzenle</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SmallInput({ value, onChange }) {
  return (
    <input
      className="focus-ring h-10 w-20 rounded-lg border px-3"
      style={{ borderColor: colors.grayBorder }}
      type="number"
      min="0"
      max="100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function TeacherCoursesView({ onOpenCourse }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {teacherCourses.map((course) => (
        <button
          key={course.code}
          type="button"
          className="card-flat accent-top p-5 text-left"
          style={{
            cursor: "pointer",
            transition: "transform 180ms ease, box-shadow 180ms ease",
            borderColor: colors.grayBorder
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = "scale(1.02)";
            event.currentTarget.style.boxShadow = "0 22px 55px rgba(21, 83, 45, 0.16)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = "scale(1)";
            event.currentTarget.style.boxShadow = "0 18px 45px rgba(21, 83, 45, 0.08)";
          }}
          onClick={() => onOpenCourse(course.code)}
        >
          <span className="text-sm font-extrabold" style={{ color: colors.greenMain }}>{course.code}</span>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: colors.textDark }}>{course.name}</h2>
          <p className="mt-3 font-semibold" style={{ color: colors.textMid }}>{course.students} öğrenci</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.greenBg, color: colors.greenMain }}>{course.credit} kredi</span>
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.grayLight, color: colors.textMid }}>{course.time}</span>
          </div>
        </button>
      ))}
    </section>
  );
}

function CourseStudentsModal({ code, course, onClose, onGradeEntry }) {
  const [query, setQuery] = useState("");
  if (!course) return null;

  const stats = getCourseStats(course);
  const cleanQuery = query.trim().toLocaleLowerCase("tr-TR");
  const rows = course.ogrenciler.filter((student) => {
    const text = `${student.no} ${student.ad}`.toLocaleLowerCase("tr-TR");
    return text.includes(cleanQuery);
  });
  const colSpan = course.degerlenirme.yicBilesenleri.length + 8;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-5"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full overflow-y-auto bg-white"
        style={{
          maxWidth: 800,
          maxHeight: "85vh",
          borderRadius: 14,
          boxShadow: "0 30px 90px rgba(15, 23, 42, 0.35)",
          animation: "modalIn 250ms ease both"
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b-2 px-6 py-5" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
          <div>
            <span className="text-sm font-semibold" style={{ color: "#16a34a" }}>{code}</span>
            <h2 className="mt-1 text-3xl font-bold leading-tight" style={{ color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>{course.dersAdi}</h2>
            <p className="mt-2 text-sm font-semibold" style={{ color: "#475569" }}>{course.ogrenciler.length} öğrenci kayıtlı</p>
          </div>
          <button type="button" className="rounded-lg px-3 py-1 text-3xl font-bold" style={{ color: "#64748b" }} onClick={onClose}>×</button>
        </header>

        <div className="grid gap-5 px-6 py-5">
          <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-3 text-sm font-bold" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#475569" }}>
            <span>📚 Kredi: <strong style={{ color: "#166534" }}>{course.kredi}</strong></span>
            <span>📅 Gün/Saat: <strong style={{ color: "#166534" }}>{course.gunSaat}</strong></span>
            <span>👥 Kayıtlı: <strong style={{ color: "#166534" }}>{course.ogrenciler.length} öğrenci</strong></span>
            <span>✅ Geçen: <strong style={{ color: "#166534" }}>{stats.passed}</strong></span>
            <span>❌ Kalan: <strong style={{ color: "#166534" }}>{stats.failed}</strong></span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold" style={{ color: "#1e293b" }}>Öğrenci Listesi</h3>
            <label className="flex min-h-10 w-full max-w-xs items-center gap-2 rounded-lg border px-3" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
              <span>🔍</span>
              <input
                className="h-9 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
                style={{ color: "#1e293b" }}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Öğrenci ara..."
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-[10px] border" style={{ borderColor: "#e2e8f0" }}>
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  {["#", "Öğrenci No", "Ad Soyad", ...course.degerlenirme.yicBilesenleri.map((component) => component.ad), "YİÇ", "Final", "Dönem Notu", "Harf", "Durum"].map((head) => (
                    <th key={head} className="px-3 py-3 text-sm font-semibold text-white" style={{ background: "#166534" }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td className="px-4 py-8 text-center font-extrabold" colSpan={colSpan} style={{ color: "#475569" }}>🔍 Arama sonucu bulunamadı</td></tr>
                ) : rows.map((student, index) => {
                  const result = calculateStudentResult(course, student);
                  return (
                    <tr key={student.no} style={{ background: index % 2 ? "#f9fafb" : "#ffffff" }}>
                      <ModalTd>{index + 1}</ModalTd>
                      <ModalTd>{student.no}</ModalTd>
                      <ModalTd strong>{student.ad}</ModalTd>
                      {course.degerlenirme.yicBilesenleri.map((component) => (
                        <ModalTd key={component.ad}>{formatMaybeScore(getStudentComponentScore(student, component.ad))}</ModalTd>
                      ))}
                      <ModalTd>{formatMaybeScore(result.yic)}</ModalTd>
                      <ModalTd>{formatMaybeScore(student.final)}</ModalTd>
                      <ModalTd>{formatMaybeScore(result.termScore)}</ModalTd>
                      <ModalTd>{result.letter || <EmptyScore />}</ModalTd>
                      <ModalTd><StatusBadge status={result.status} /></ModalTd>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t px-6 py-4" style={{ borderColor: "#e2e8f0" }}>
          <button type="button" className="button-soft rounded-lg px-4 py-2 font-extrabold text-white" style={{ background: "#166534" }} onClick={onGradeEntry}>📝 Not Gir</button>
          <button type="button" className="button-soft rounded-lg border px-4 py-2 font-extrabold" style={{ borderColor: "#e2e8f0", color: "#475569", background: "#ffffff" }} onClick={onClose}>✕ Kapat</button>
        </footer>
      </div>
    </div>
  );
}

function ModalTd({ children, strong = false }) {
  return <td className={`border-b px-3 py-3 text-sm ${strong ? "font-extrabold" : ""}`} style={{ borderColor: "#e2e8f0", color: "#1e293b" }}>{children}</td>;
}

function EmptyScore() {
  return <span className="italic" style={{ color: "#94a3b8" }}>—</span>;
}

function StatusBadge({ status }) {
  const styles = {
    passed: { background: "#dcfce7", color: "#166534", label: "✅ Geçti" },
    failed: { background: "#fee2e2", color: "#dc2626", label: "❌ Kaldı" },
    waiting: { background: "#fef9c3", color: "#854d0e", label: "⏳ Bekliyor" }
  };
  const current = styles[status] || styles.waiting;
  return <span className="inline-flex rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: current.background, color: current.color }}>{current.label}</span>;
}

function getCourseStats(course) {
  return course.ogrenciler.reduce((stats, student) => {
    const result = calculateStudentResult(course, student);
    if (result.status === "passed") stats.passed += 1;
    if (result.status === "failed") stats.failed += 1;
    return stats;
  }, { passed: 0, failed: 0 });
}

function calculateStudentResult(course, student) {
  const hasComponents = course.degerlenirme.yicBilesenleri.every((component) => {
    const score = getStudentComponentScore(student, component.ad);
    return score !== null && score !== undefined && score !== "";
  });
  const hasFinal = student.final !== null && student.final !== undefined && student.final !== "";
  if (!hasComponents || !hasFinal) return { yic: null, termScore: null, letter: "", status: "waiting" };

  const yic = course.degerlenirme.yicBilesenleri.reduce((sum, component) => {
    return sum + Number(getStudentComponentScore(student, component.ad)) * (component.agirlik / 100);
  }, 0);
  const termScore = yic * (course.degerlenirme.yicEtkisi / 100) + Number(student.final) * (course.degerlenirme.finalEtkisi / 100);
  return {
    yic,
    termScore,
    letter: getLetterGrade(termScore),
    status: termScore >= course.degerlenirme.gecmeNotu ? "passed" : "failed"
  };
}

function getStudentComponentScore(student, componentName) {
  const keys = {
    "Ara Sınav": "araSinav",
    Vize: "vize",
    Proje: "proje",
    "Ödev": "odev"
  };
  return student[keys[componentName]];
}

function formatMaybeScore(value) {
  if (value === null || value === undefined || value === "") return <EmptyScore />;
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function getLetterGrade(score) {
  if (score >= 90) return "AA";
  if (score >= 85) return "BA";
  if (score >= 75) return "BB";
  if (score >= 70) return "CB";
  if (score >= 60) return "CC";
  if (score >= 55) return "DC";
  if (score >= 50) return "DD";
  if (score >= 45) return "FD";
  return "FF";
}

function TeacherProfileView() {
  const items = [
    ["Ad Soyad", "Dr. Ayşe Kaya"],
    ["Sicil No", "AKD-2187"],
    ["Unvan", "Dr. Öğr. Üyesi"],
    ["Bölüm", "Bilgisayar Mühendisliği"],
    ["E-posta", "ayse.kaya@kocaeli.edu.tr"]
  ];

  return (
    <section className="card-flat accent-left p-6">
      <h2 className="mb-5 text-3xl font-bold" style={{ color: colors.textDark }}>Profilim</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border p-4" style={{ borderColor: colors.grayBorder, background: colors.grayLight }}>
            <span className="text-sm font-bold" style={{ color: colors.textMid }}>{label}</span>
            <strong className="mt-1 block">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
