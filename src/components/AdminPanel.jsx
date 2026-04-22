import React, { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { adminCourses, adminStudents, adminTeachers } from "../data/mockData.js";
import { colors } from "../utils/theme.js";
import Modal from "./Modal.jsx";
import { DangerButton, PrimaryButton, SelectInput, Sidebar, StatCard, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "stats", label: "📊 İstatistikler" },
  { key: "students", label: "👥 Öğrenci Yönetimi" },
  { key: "teachers", label: "👨‍🏫 Öğretmen Yönetimi" },
  { key: "courses", label: "📚 Ders Yönetimi" }
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

  const saveModal = (event) => {
    event.preventDefault();
    if (!modal) return;
    const nextRow = { ...modal.form };
    delete nextRow.password;

    if (modal.type === "student") {
      setStudents((current) => upsertRow(current, nextRow, modal));
      showToast(modal.mode === "create" ? "Öğrenci kaydı oluşturuldu." : "Öğrenci bilgileri güncellendi.");
    }
    if (modal.type === "teacher") {
      setTeachers((current) => upsertRow(current, nextRow, modal));
      showToast(modal.mode === "create" ? "Öğretmen kaydı oluşturuldu." : "Öğretmen bilgileri güncellendi.");
    }
    if (modal.type === "course") {
      setCourses((current) => upsertRow(current, { ...nextRow, credit: Number(nextRow.credit) }, modal));
      showToast(modal.mode === "create" ? "Ders kaydı oluşturuldu." : "Ders bilgileri güncellendi.");
    }
    setModal(null);
  };

  const removeRow = (type, id) => {
    if (!window.confirm("Emin misiniz?")) return;
    if (type === "student") setStudents((current) => current.filter((row) => row.id !== id));
    if (type === "teacher") setTeachers((current) => current.filter((row) => row.id !== id));
    if (type === "course") setCourses((current) => current.filter((row) => row.id !== id));
    showToast("Kayıt silindi.");
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
          {active === "stats" && <StatsView />}
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

function StatsView() {
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
        <StatCard label="Toplam Öğrenci" value="128" helper="+12 bu dönem" />
        <StatCard label="Öğretmen" value="24" helper="Aktif akademisyen" />
        <StatCard label="Ders" value="36" helper="Açık ders" />
        <StatCard label="Ort. Not" value="72.4" helper="Genel ortalama" />
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

function upsertRow(rows, nextRow, modal) {
  if (modal.mode === "edit") {
    return rows.map((row) => row.id === modal.id ? { ...row, ...nextRow, id: modal.id } : row);
  }
  const nextId = Math.max(0, ...rows.map((row) => row.id)) + 1;
  return [{ ...nextRow, id: nextId }, ...rows];
}
