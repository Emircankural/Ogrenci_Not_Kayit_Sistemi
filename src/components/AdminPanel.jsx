import React, { useEffect, useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { adminCourses, adminStudents, adminTeachers } from "../data/mockData.js";
import {
  calculateTranscriptSummary,
  cloneTranscriptCourses,
  getCourseResult,
  getGradeClassName,
  gradeCoefficients,
  transcriptGradeOptions,
  transcriptStudents
} from "../data/transcriptData.js";
import { colors } from "../utils/theme.js";
import { api } from "../services/api.js";
import Modal from "./Modal.jsx";
import { DangerButton, PrimaryButton, SelectInput, Sidebar, StatCard, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "stats", label: "📊 İstatistikler" },
  { key: "students", label: "👥 Öğrenci Yönetimi" },
  { key: "teachers", label: "👨‍🏫 Öğretmen Yönetimi" },
  { key: "courses", label: "📚 Ders Yönetimi" },
  { key: "transcripts", label: "📄 Transkript Yönetimi" }
];

const emptyStudent = { name: "", no: "", email: "", password: "", department: "", year: "" };
const emptyTeacher = { name: "", registry: "", email: "", password: "", title: "", department: "" };
const emptyCourse = { name: "", code: "", credit: "", department: "", teacher: "" };

export default function AdminPanel({ onLogout, showToast }) {
  const [active, setActive] = useState("stats");
  const [students, setStudents] = useState(adminStudents);
  const [teachers, setTeachers] = useState(adminTeachers);
  const [courses, setCourses] = useState(adminCourses);
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [stats, setStats] = useState({ studentCount: students.length, teacherCount: teachers.length, courseCount: courses.length, averageGrade: 72.4 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    async function loadDatabaseData() {
      setIsLoading(true);
      try {
        const [studentRows, teacherRows, courseRows, statRows] = await Promise.all([
          api.getStudents(),
          api.getTeachers(),
          api.getCourses(),
          api.getStats()
        ]);

        if (!activeRequest) return;
        setStudents(studentRows);
        setTeachers(teacherRows);
        setCourses(courseRows);
        setStats(statRows);
      } catch (error) {
        showToast(`Veritabanı bağlantısı kurulamadı, demo veriler gösteriliyor: ${error.message}`);
      } finally {
        if (activeRequest) setIsLoading(false);
      }
    }

    loadDatabaseData();
    return () => {
      activeRequest = false;
    };
  }, [showToast]);

  const filteredStudents = useMemo(() => filterRows(students, studentSearch, ["name", "no", "department", "email", "year"]), [students, studentSearch]);
  const filteredTeachers = useMemo(() => filterRows(teachers, teacherSearch, ["name", "registry", "department", "email", "title"]), [teachers, teacherSearch]);
  const filteredCourses = useMemo(() => filterRows(courses, courseSearch, ["name", "code", "department", "teacher"]), [courses, courseSearch]);

  const openCreate = (type) => {
    const form = type === "student" ? emptyStudent : type === "teacher" ? emptyTeacher : emptyCourse;
    setModal({ type, mode: "create", form: { ...form } });
  };

  const openEdit = (type, row) => {
    setModal({ type, mode: "edit", id: row.id, form: { ...row, password: "" } });
  };

  const updateModalField = (field, value) => {
    setModal((current) => ({ ...current, form: { ...current.form, [field]: value } }));
  };

  const saveModal = async (event) => {
    event.preventDefault();
    if (!modal) return;
    const nextRow = { ...modal.form };
    delete nextRow.password;

    try {
      if (modal.type === "student") {
        validateStudent(nextRow);
        const payload = { ...nextRow, classLevel: nextRow.classLevel || 1 };
        const saved = modal.mode === "create" ? await api.createStudent(payload) : await api.updateStudent(modal.id, payload);
        setStudents((current) => upsertRow(current, saved, modal));
        showToast(modal.mode === "create" ? "Öğrenci kaydı veritabanına eklendi." : "Öğrenci bilgileri güncellendi.");
      }
      if (modal.type === "teacher") {
        validateTeacher(nextRow);
        const saved = modal.mode === "create" ? await api.createTeacher(nextRow) : await api.updateTeacher(modal.id, nextRow);
        setTeachers((current) => upsertRow(current, saved, modal));
        showToast(modal.mode === "create" ? "Öğretmen kaydı veritabanına eklendi." : "Öğretmen bilgileri güncellendi.");
      }
      if (modal.type === "course") {
        validateCourse(nextRow);
        const teacher = teachers.find((item) => item.name === nextRow.teacher);
        const payload = { ...nextRow, credit: Number(nextRow.credit), teacherId: teacher?.id };
        const saved = modal.mode === "create" ? await api.createCourse(payload) : await api.updateCourse(modal.id, payload);
        setCourses((current) => upsertRow(current, { ...nextRow, ...saved, credit: Number(nextRow.credit) }, modal));
        showToast(modal.mode === "create" ? "Ders kaydı veritabanına eklendi." : "Ders bilgileri güncellendi.");
      }
      setModal(null);
    } catch (error) {
      showToast(error.message);
    }
  };

  const removeRow = async (type, id) => {
    if (!window.confirm("Emin misiniz?")) return;
    try {
      if (type === "student") {
        await api.deleteStudent(id);
        setStudents((current) => current.filter((row) => row.id !== id));
      }
      if (type === "teacher") {
        await api.deleteTeacher(id);
        setTeachers((current) => current.filter((row) => row.id !== id));
      }
      if (type === "course") {
        await api.deleteCourse(id);
        setCourses((current) => current.filter((row) => row.id !== id));
      }
      showToast("Kayıt veritabanından silindi.");
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="min-h-screen p-5" style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)" }}>
      <Topbar
        icon={<Settings size={24} />}
        subtitle="Yönetim erişimi"
        title="⚙️ Yönetim Paneli"
        onLogout={onLogout}
        danger
      />
      <div className="panel-layout grid grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Sidebar items={navItems} active={active} setActive={setActive} />
        <main className="page-enter min-w-0">
          {active === "stats" && <StatsView stats={stats} isLoading={isLoading} />}
          {active === "students" && (
            <StudentManagement
              rows={filteredStudents}
              search={studentSearch}
              setSearch={setStudentSearch}
              onAdd={() => openCreate("student")}
              onEdit={(row) => openEdit("student", row)}
              onDelete={(id) => removeRow("student", id)}
            />
          )}
          {active === "teachers" && (
            <TeacherManagement
              rows={filteredTeachers}
              search={teacherSearch}
              setSearch={setTeacherSearch}
              onAdd={() => openCreate("teacher")}
              onEdit={(row) => openEdit("teacher", row)}
              onDelete={(id) => removeRow("teacher", id)}
            />
          )}
          {active === "courses" && (
            <CourseManagement
              rows={filteredCourses}
              search={courseSearch}
              setSearch={setCourseSearch}
              onAdd={() => openCreate("course")}
              onEdit={(row) => openEdit("course", row)}
              onDelete={(id) => removeRow("course", id)}
            />
          )}
          {active === "transcripts" && <TranscriptManagement showToast={showToast} />}
        </main>
      </div>

      {modal && (
        <Modal title={modalTitle(modal)} onClose={() => setModal(null)}>
          <form className="grid gap-4" onSubmit={saveModal}>
            {modal.type === "student" && <StudentForm form={modal.form} updateField={updateModalField} />}
            {modal.type === "teacher" && <TeacherForm form={modal.form} updateField={updateModalField} />}
            {modal.type === "course" && <CourseForm form={modal.form} updateField={updateModalField} teachers={teachers} />}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                className="button-soft min-h-11 rounded-xl border px-5 font-extrabold"
                style={{ borderColor: colors.grayBorder, color: colors.textMid }}
                onClick={() => setModal(null)}
              >
                İptal
              </button>
              <PrimaryButton type="submit">Kaydet</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatsView({ stats, isLoading }) {
  const bars = [
    ["Bilgisayar", 92],
    ["Endüstri", 66],
    ["Matematik", 48],
    ["Elektrik", 74],
    ["Makine", 58]
  ];

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Öğrenci" value={isLoading ? "..." : stats.studentCount} helper="Veritabanındaki kayıt" />
        <StatCard label="Öğretmen" value={isLoading ? "..." : stats.teacherCount} helper="Aktif akademisyen" />
        <StatCard label="Ders" value={isLoading ? "..." : stats.courseCount} helper="Açık ders" />
        <StatCard label="Ort. Not" value={isLoading ? "..." : Number(stats.averageGrade || 0).toFixed(1)} helper="Genel ortalama" />
      </div>
      <div className="card-flat accent-left p-6">
        <h2 className="text-3xl font-bold" style={{ color: colors.textDark }}>Bölümlere Göre Öğrenci Dağılımı</h2>
        <div className="mt-6 grid gap-4">
          {bars.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[110px_minmax(0,1fr)_48px] items-center gap-4">
              <span className="font-bold" style={{ color: colors.textMid }}>{label}</span>
              <div className="h-4 overflow-hidden rounded-full" style={{ background: colors.greenBg }}>
                <div className="h-full rounded-full" style={{ width: `${value}%`, background: colors.greenMain }} />
              </div>
              <strong style={{ color: colors.greenMain }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentManagement({ rows, search, setSearch, onAdd, onEdit, onDelete }) {
  return (
    <section className="grid gap-4">
      <ManagementHeader title="Öğrenci Yönetimi" button="➕ Yeni Öğrenci Ekle" onAdd={onAdd} search={search} setSearch={setSearch} />
      <TableShell>
        <thead><tr>{["Ad Soyad", "No", "Bölüm", "E-posta", "Kayıt Yılı", "İşlemler"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t" style={{ borderColor: colors.grayBorder }}>
              <Td strong>{row.name}</Td><Td>{row.no}</Td><Td>{row.department}</Td><Td>{row.email}</Td><Td>{row.year}</Td>
              <ActionTd row={row} onEdit={onEdit} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );
}

function TeacherManagement({ rows, search, setSearch, onAdd, onEdit, onDelete }) {
  return (
    <section className="grid gap-4">
      <ManagementHeader title="Öğretmen Yönetimi" button="➕ Yeni Öğretmen Ekle" onAdd={onAdd} search={search} setSearch={setSearch} />
      <TableShell>
        <thead><tr>{["Ad", "Sicil", "Unvan", "Bölüm", "E-posta", "İşlemler"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t" style={{ borderColor: colors.grayBorder }}>
              <Td strong>{row.name}</Td><Td>{row.registry}</Td><Td>{row.title}</Td><Td>{row.department}</Td><Td>{row.email}</Td>
              <ActionTd row={row} onEdit={onEdit} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );
}

function CourseManagement({ rows, search, setSearch, onAdd, onEdit, onDelete }) {
  return (
    <section className="grid gap-4">
      <ManagementHeader title="Ders Yönetimi" button="➕ Yeni Ders Ekle" onAdd={onAdd} search={search} setSearch={setSearch} />
      <TableShell>
        <thead><tr>{["Ders", "Kod", "Kredi", "Öğretmen", "Bölüm", "İşlemler"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t" style={{ borderColor: colors.grayBorder }}>
              <Td strong>{row.name}</Td><Td>{row.code}</Td><Td>{row.credit}</Td><Td>{row.teacher}</Td><Td>{row.department}</Td>
              <ActionTd row={row} onEdit={onEdit} onDelete={onDelete} />
            </tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );
}

function TranscriptManagement({ showToast }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftGrade, setDraftGrade] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ semester: "1", code: "", name: "", ects: "", grade: "AA" });
  const summary = calculateTranscriptSummary(courses);

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setSearch(`${student.number} — ${student.name}`);
    setCourses(cloneTranscriptCourses());
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSearch = (value) => {
    setSearch(value);
    const clean = value.trim().toLocaleLowerCase("tr-TR");
    const exact = transcriptStudents.find((student) => `${student.number} — ${student.name}`.toLocaleLowerCase("tr-TR") === clean || student.number === value.trim());
    const matches = transcriptStudents.filter((student) => clean.length >= 3 && `${student.number} — ${student.name}`.toLocaleLowerCase("tr-TR").includes(clean));
    const student = exact || (matches.length === 1 ? matches[0] : null);
    if (student) selectStudent(student);
  };

  const saveGrade = (id) => {
    setCourses((current) => current.map((course) => course.id === id ? { ...course, grade: draftGrade } : course));
    setEditingId(null);
    showToast("Ders notu güncellendi.");
  };

  const deleteCourse = (id) => {
    if (!window.confirm("Bu dersi transkriptten silmek istediğinize emin misiniz?")) return;
    setCourses((current) => current.filter((course) => course.id !== id));
    showToast("Ders transkriptten silindi.");
  };

  const addCourse = (event) => {
    event.preventDefault();
    if (!newCourse.code.trim() || !newCourse.name.trim() || newCourse.ects === "") {
      showToast("Ders eklemek için kod, ad ve AKTS alanlarını doldurun.");
      return;
    }
    setCourses((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        semester: Number(newCourse.semester),
        code: newCourse.code.trim(),
        name: newCourse.name.trim(),
        status: "Zorunlu",
        language: "Türkçe",
        ects: Number(newCourse.ects),
        grade: newCourse.grade
      }
    ]);
    setNewCourse({ semester: "1", code: "", name: "", ects: "", grade: "AA" });
    setShowAddForm(false);
    showToast("Ders transkripte eklendi.");
  };

  const openPreview = () => {
    window.open(`${window.location.origin}${window.location.pathname}?view=transcript`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="grid gap-5">
      <div className="card-flat accent-top grid gap-4 p-5 xl:grid-cols-[1fr_auto] xl:items-end">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Öğrenci Seç"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            list="transcript-students"
            placeholder="Öğrenci No veya Ad ile ara..."
          />
          <datalist id="transcript-students">
            {transcriptStudents.map((student) => <option key={student.number} value={`${student.number} — ${student.name}`} />)}
          </datalist>
          <SelectInput
            label="Liste"
            value={selectedStudent?.number || ""}
            onChange={(event) => {
              const student = transcriptStudents.find((item) => item.number === event.target.value);
              if (student) selectStudent(student);
            }}
          >
            <option value="">Öğrenci seçiniz</option>
            {transcriptStudents.map((student) => <option key={student.number} value={student.number}>{student.number} — {student.name}</option>)}
          </SelectInput>
        </div>
        <PrimaryButton type="button" onClick={openPreview}>👁 Transkript Görüntüle</PrimaryButton>
      </div>

      {selectedStudent && (
        <>
          <div className="card-flat accent-left flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-extrabold" style={{ color: colors.textDark }}>{selectedStudent.number} — {selectedStudent.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <SummaryPill label="Toplam AKTS" value={summary.totalEcts} />
                <SummaryPill label="Başarılan AKTS" value={summary.earnedEcts} />
                <SummaryPill label="GNO" value={summary.gpa} />
              </div>
            </div>
            <PrimaryButton type="button" onClick={() => setShowAddForm((current) => !current)}>➕ Ders Ekle</PrimaryButton>
          </div>

          {showAddForm && (
            <form className="card-flat grid gap-4 p-5 md:grid-cols-3 xl:grid-cols-6" onSubmit={addCourse}>
              <SelectInput label="Yarıyıl" value={newCourse.semester} onChange={(event) => setNewCourse({ ...newCourse, semester: event.target.value })}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => <option key={semester}>{semester}</option>)}
              </SelectInput>
              <TextInput label="Ders Kodu" value={newCourse.code} onChange={(event) => setNewCourse({ ...newCourse, code: event.target.value })} placeholder="1010031" />
              <TextInput label="Ders Adı" value={newCourse.name} onChange={(event) => setNewCourse({ ...newCourse, name: event.target.value })} placeholder="Ders adı" />
              <TextInput label="AKTS" type="number" min="0" value={newCourse.ects} onChange={(event) => setNewCourse({ ...newCourse, ects: event.target.value })} />
              <SelectInput label="Başarı Notu" value={newCourse.grade} onChange={(event) => setNewCourse({ ...newCourse, grade: event.target.value })}>
                {transcriptGradeOptions.map((grade) => <option key={grade}>{grade}</option>)}
              </SelectInput>
              <PrimaryButton type="submit" className="self-end">Ekle</PrimaryButton>
            </form>
          )}

          <div className="card-flat accent-left table-scroll p-4">
            <table className="w-full border-collapse text-left">
              <thead><tr>{["Yarıyıl", "Ders Kodu", "Ders Adı", "AKTS", "Başarı Notu", "Katsayı", "Başarı Durumu", "İşlemler"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
              <tbody>
                {[...courses].sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code, "tr-TR")).map((course) => {
                  const result = getCourseResult(course.grade);
                  const isEditing = editingId === course.id;
                  return (
                    <tr key={course.id} className="border-t" style={{ borderColor: colors.grayBorder }}>
                      <Td>{course.semester}</Td>
                      <Td>{course.code}</Td>
                      <Td strong>{course.name}</Td>
                      <Td>{course.ects}</Td>
                      <Td>
                        {isEditing ? (
                          <select className="focus-ring h-10 rounded-lg border bg-white px-3 text-sm font-bold" style={{ borderColor: colors.grayBorder }} value={draftGrade} onChange={(event) => setDraftGrade(event.target.value)}>
                            {transcriptGradeOptions.map((grade) => <option key={grade}>{grade}</option>)}
                          </select>
                        ) : (
                          <span className={`transcript-grade ${getGradeClassName(course.grade)}`}>{course.grade}</span>
                        )}
                      </Td>
                      <Td>{isEditing ? gradeCoefficients[draftGrade] : gradeCoefficients[course.grade]}</Td>
                      <Td><span className={result === "Başarısız" ? "transcript-grade-fail" : ""}>{isEditing ? getCourseResult(draftGrade) : result}</span></Td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={() => saveGrade(course.id)}>✅ Kaydet</button>
                              <DangerButton type="button" onClick={() => setEditingId(null)}>❌ İptal</DangerButton>
                            </>
                          ) : (
                            <>
                              <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={() => { setEditingId(course.id); setDraftGrade(course.grade); }}>✏️ Düzenle</button>
                              <DangerButton type="button" onClick={() => deleteCourse(course.id)}>🗑️ Sil</DangerButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function SummaryPill({ label, value }) {
  return (
    <span className="rounded-lg border px-3 py-2 text-sm font-extrabold" style={{ borderColor: colors.grayBorder, background: colors.greenBg, color: colors.greenMain }}>
      {label}: {value}
    </span>
  );
}

function ManagementHeader({ title, button, onAdd, search, setSearch }) {
  return (
    <div className="card-flat accent-top grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <h2 className="text-3xl font-bold" style={{ color: colors.textDark }}>{title}</h2>
        <div className="mt-4 max-w-md">
          <TextInput label="Arama" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tabloda ara" />
        </div>
      </div>
      <PrimaryButton type="button" onClick={onAdd}>{button}</PrimaryButton>
    </div>
  );
}

function StudentForm({ form, updateField }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TextInput label="Ad Soyad" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
      <TextInput label="Öğrenci No" value={form.no} onChange={(event) => updateField("no", event.target.value)} />
      <TextInput label="E-posta" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
      <TextInput label="Şifre" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
      <DepartmentSelect value={form.department} onChange={(event) => updateField("department", event.target.value)} />
      <TextInput label="Kayıt Yılı" value={form.year} onChange={(event) => updateField("year", event.target.value)} />
    </div>
  );
}

function TeacherForm({ form, updateField }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TextInput label="Ad Soyad" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
      <TextInput label="Sicil No" value={form.registry} onChange={(event) => updateField("registry", event.target.value)} />
      <TextInput label="E-posta" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
      <TextInput label="Şifre" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
      <SelectInput label="Unvan" value={form.title} onChange={(event) => updateField("title", event.target.value)}>
        <option value="">Unvan seçiniz</option>
        <option>Prof. Dr.</option><option>Doç. Dr.</option><option>Dr. Öğr. Üyesi</option><option>Öğr. Gör.</option>
      </SelectInput>
      <DepartmentSelect value={form.department} onChange={(event) => updateField("department", event.target.value)} />
    </div>
  );
}

function CourseForm({ form, updateField, teachers }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TextInput label="Ders Adı" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
      <TextInput label="Kod" value={form.code} onChange={(event) => updateField("code", event.target.value)} />
      <TextInput label="Kredi" type="number" min="1" max="10" value={form.credit} onChange={(event) => updateField("credit", event.target.value)} />
      <DepartmentSelect value={form.department} onChange={(event) => updateField("department", event.target.value)} />
      <SelectInput label="Öğretmen Ata" value={form.teacher} onChange={(event) => updateField("teacher", event.target.value)}>
        <option value="">Öğretmen seçiniz</option>
        {teachers.map((teacher) => <option key={teacher.id}>{teacher.name}</option>)}
      </SelectInput>
    </div>
  );
}

function DepartmentSelect({ value, onChange }) {
  return (
    <SelectInput label="Bölüm" value={value} onChange={onChange}>
      <option value="">Bölüm seçiniz</option>
      <option>Bilgisayar Mühendisliği</option>
      <option>Endüstri Mühendisliği</option>
      <option>Matematik</option>
      <option>Elektrik Elektronik Mühendisliği</option>
      <option>Makine Mühendisliği</option>
      <option>İnşaat Mühendisliği</option>
    </SelectInput>
  );
}

function TableShell({ children }) {
  return (
    <div className="card-flat accent-left table-scroll p-4">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

function Th({ children }) {
  return <th className="p-4 text-sm" style={{ color: colors.greenMain }}>{children}</th>;
}

function Td({ children, strong = false }) {
  return <td className={`p-4 ${strong ? "font-extrabold" : ""}`}>{children}</td>;
}

function ActionTd({ row, onEdit, onDelete }) {
  return (
    <td className="p-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={() => onEdit(row)}>✏️ Düzenle</button>
        <DangerButton type="button" onClick={() => onDelete(row.id)}>🗑️ Sil</DangerButton>
      </div>
    </td>
  );
}

function modalTitle(modal) {
  const typeLabel = modal.type === "student" ? "Öğrenci" : modal.type === "teacher" ? "Öğretmen" : "Ders";
  return `${modal.mode === "create" ? "Yeni" : "Düzenle"} ${typeLabel}`;
}

function filterRows(rows, query, fields) {
  const clean = query.trim().toLocaleLowerCase("tr-TR");
  if (!clean) return rows;
  return rows.filter((row) => fields.some((field) => String(row[field] || "").toLocaleLowerCase("tr-TR").includes(clean)));
}

function validateStudent(row) {
  if (!row.name?.trim() || !row.no?.trim() || !row.department?.trim()) {
    throw new Error("Öğrenci için ad soyad, numara ve bölüm alanları zorunludur.");
  }
  if (row.year && !/^\d{4}$/.test(String(row.year))) {
    throw new Error("Kayıt yılı 4 haneli olmalıdır.");
  }
}

function validateTeacher(row) {
  if (!row.name?.trim() || !row.email?.trim() || !row.department?.trim()) {
    throw new Error("Öğretmen için ad soyad, e-posta ve bölüm alanları zorunludur.");
  }
  if (!row.email.includes("@")) {
    throw new Error("Geçerli bir e-posta adresi giriniz.");
  }
}

function validateCourse(row) {
  const credit = Number(row.credit);
  if (!row.name?.trim() || !Number.isInteger(credit) || credit < 1 || credit > 10 || !row.teacher?.trim()) {
    throw new Error("Ders adı, 1-10 arası kredi ve öğretmen seçimi zorunludur.");
  }
}

function upsertRow(rows, nextRow, modal) {
  if (modal.mode === "edit") {
    return rows.map((row) => row.id === modal.id ? { ...row, ...nextRow, id: modal.id } : row);
  }
  const nextId = Math.max(0, ...rows.map((row) => row.id)) + 1;
  return [{ ...nextRow, id: nextId }, ...rows];
}
