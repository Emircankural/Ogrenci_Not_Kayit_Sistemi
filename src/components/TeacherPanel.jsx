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

export default function TeacherPanel({ user, onLogout, showToast }) {
  const [active, setActive] = useState("grade-entry");
  const [gradeForm, setGradeForm] = useState(emptyGradeForm);
  const [students, setStudents] = useState(teacherStudents);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(null);

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
          {active === "courses" && <TeacherCoursesView />}
          {active === "profile" && <TeacherProfileView />}
        </main>
      </div>
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

function TeacherCoursesView() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {teacherCourses.map((course) => (
        <article key={course.code} className="card-flat accent-top p-5">
          <span className="text-sm font-extrabold" style={{ color: colors.greenMain }}>{course.code}</span>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: colors.textDark }}>{course.name}</h2>
          <p className="mt-3 font-semibold" style={{ color: colors.textMid }}>{course.students} öğrenci</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.greenBg, color: colors.greenMain }}>{course.credit} kredi</span>
            <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: colors.grayLight, color: colors.textMid }}>{course.time}</span>
          </div>
        </article>
      ))}
    </section>
  );
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
