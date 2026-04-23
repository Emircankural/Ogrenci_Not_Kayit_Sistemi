import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Download,
  FileUp,
  Keyboard,
  Save,
  School,
  Trash2,
  UploadCloud
} from "lucide-react";
import { teacherStudents } from "../data/mockData.js";
import { colors } from "../utils/theme.js";
import { Badge, PrimaryButton, Sidebar, SelectInput, TextInput, Topbar } from "./Shared.jsx";

const navItems = [
  { key: "grade-entry", label: "Not Gir" },
  { key: "students", label: "Öğrencilerim" },
  { key: "courses", label: "Derslerim" },
  { key: "profile", label: "Profilim" }
];

const emptyGradeForm = {
  term: "2025-2026 Güz",
  course: "",
  student: "",
  midterm: "",
  final: ""
};

const initialCourseCatalog = {
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

const componentKeyByName = {
  "Ara Sınav": "araSinav",
  Vize: "vize",
  Proje: "proje",
  Ödev: "odev",
  Final: "final"
};

const terms = ["2025-2026 Güz", "2025-2026 Bahar", "2024-2025 Yaz"];

const emptyCsvState = {
  fileName: "",
  fileSize: "",
  rows: [],
  missingColumns: false,
  isDragging: false,
  parseMessage: ""
};

export default function TeacherPanel({ user, onLogout, showToast }) {
  const [active, setActive] = useState("grade-entry");
  const [gradeForm, setGradeForm] = useState(emptyGradeForm);
  const [students, setStudents] = useState(teacherStudents);
  const [courseCatalog, setCourseCatalog] = useState(initialCourseCatalog);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  const courseOptions = useMemo(() => {
    return Object.entries(courseCatalog).map(([code, course]) => ({
      code,
      name: course.dersAdi,
      credit: course.kredi,
      time: course.gunSaat,
      students: course.ogrenciler.length
    }));
  }, [courseCatalog]);

  const gradeStudents = useMemo(() => {
    const unique = new Map();
    Object.values(courseCatalog).forEach((course) => {
      course.ogrenciler.forEach((student) => unique.set(student.no, { id: student.no, name: student.ad, no: student.no }));
    });
    return Array.from(unique.values());
  }, [courseCatalog]);

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

  const saveBulkGrades = ({ courseCode, componentName, values, filledCount, skippedCount }) => {
    const componentKey = getComponentKey(componentName);
    if (!componentKey) {
      showToast("Seçilen bileşen için kayıt alanı bulunamadı.");
      return;
    }

    setCourseCatalog((current) => {
      const course = current[courseCode];
      if (!course) return current;

      return {
        ...current,
        [courseCode]: {
          ...course,
          ogrenciler: course.ogrenciler.map((student) => {
            const rawValue = values[student.no];
            if (rawValue === "" || rawValue === undefined || !isValidScore(rawValue)) return student;
            return { ...student, [componentKey]: Number(rawValue) };
          })
        }
      };
    });

    showToast(`✅ ${filledCount} öğrencinin notu kaydedildi. ${skippedCount} öğrenci atlandı (not girilmemiş).`);
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
    const course = courseCatalog[code];
    setSelectedCourseCode("");
    setActive("grade-entry");
    if (course) {
      setGradeForm((current) => ({ ...current, course: code }));
    }
  };

  return (
    <div className="min-h-screen p-5" style={{ background: "linear-gradient(135deg, #f8fafc, #f0fdf4)" }}>
      <Topbar
        icon={<School size={24} />}
        subtitle="Kocaeli Üniversitesi"
        title={`Hoşgeldin, ${user?.name || "Dr. Ayşe Kaya"}`}
        onLogout={onLogout}
      />
      <div className="panel-layout grid grid-cols-[280px_minmax(0,1fr)] gap-6">
        <Sidebar items={navItems} active={active} setActive={setActive} />
        <main className="page-enter min-w-0">
          {active === "grade-entry" && (
            <GradeEntryView
              allStudents={gradeStudents}
              average={average}
              courseCatalog={courseCatalog}
              courseOptions={courseOptions}
              form={gradeForm}
              onBulkSave={saveBulkGrades}
              onSubmit={saveGrade}
              showToast={showToast}
              updateField={updateGradeForm}
            />
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
          {active === "courses" && <TeacherCoursesView courses={courseOptions} onOpenCourse={setSelectedCourseCode} />}
          {active === "profile" && <TeacherProfileView />}
        </main>
      </div>
      {selectedCourseCode && (
        <CourseStudentsModal
          code={selectedCourseCode}
          course={courseCatalog[selectedCourseCode]}
          onClose={() => setSelectedCourseCode("")}
          onGradeEntry={() => openGradeEntryForCourse(selectedCourseCode)}
        />
      )}
    </div>
  );
}

function GradeEntryView({
  allStudents,
  average,
  courseCatalog,
  courseOptions,
  form,
  onBulkSave,
  onSubmit,
  showToast,
  updateField
}) {
  const defaultCourseCode = courseOptions[0]?.code || "";
  const [mode, setMode] = useState("single");
  const [bulkFilters, setBulkFilters] = useState({
    term: "2025-2026 Güz",
    courseCode: defaultCourseCode,
    componentName: ""
  });
  const [listVisible, setListVisible] = useState(false);
  const [gradeValues, setGradeValues] = useState({});
  const [csvState, setCsvState] = useState(emptyCsvState);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedCourse = courseCatalog[bulkFilters.courseCode];
  const componentOptions = useMemo(() => getCourseComponents(selectedCourse), [selectedCourse]);
  const selectedStudents = selectedCourse?.ogrenciler || [];
  const gradeStats = useMemo(() => getGradeStats(gradeValues, selectedStudents.length), [gradeValues, selectedStudents.length]);
  const csvCounts = useMemo(() => getCsvCounts(csvState.rows), [csvState.rows]);
  const invalidInputCount = useMemo(() => Object.values(gradeValues).filter((value) => value !== "" && !isValidScore(value)).length, [gradeValues]);

  useEffect(() => {
    if (componentOptions.length === 0) return;
    setBulkFilters((current) => {
      if (componentOptions.some((component) => component.ad === current.componentName)) return current;
      return { ...current, componentName: componentOptions[0].ad };
    });
  }, [componentOptions]);

  useEffect(() => {
    if (!listVisible || !firstInputRef.current) return;
    const timer = window.setTimeout(() => {
      firstInputRef.current.focus();
      firstInputRef.current.select();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [listVisible, bulkFilters.courseCode, bulkFilters.componentName]);

  const setFilter = (field, value) => {
    setBulkFilters((current) => {
      const next = { ...current, [field]: value };
      if (field === "courseCode") {
        const nextCourse = courseCatalog[value];
        next.componentName = getCourseComponents(nextCourse)[0]?.ad || "";
      }
      return next;
    });
    setListVisible(false);
    setCsvState(emptyCsvState);
  };

  const showBulkList = (event) => {
    event.preventDefault();
    if (!selectedCourse || !bulkFilters.componentName) {
      showToast("Ders ve bileşen seçmeden liste getirilemez.");
      return;
    }

    setGradeValues(createInitialGradeValues(selectedCourse, bulkFilters.componentName));
    setCsvState(emptyCsvState);
    setListVisible(true);
  };

  const updateGradeValue = (studentNo, value) => {
    setGradeValues((current) => ({ ...current, [studentNo]: value }));
  };

  const moveGradeFocus = (event, index) => {
    if (event.key !== "Enter" && event.key !== "Tab") return;
    event.preventDefault();

    const nextIndex = event.shiftKey ? index - 1 : index + 1;
    const nextInput = document.querySelector(`.bulk-grade-input[data-index="${nextIndex}"]`);
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  };

  const downloadTemplate = () => {
    if (!selectedCourse || !bulkFilters.componentName) {
      showToast("Şablon indirmek için ders ve bileşen seçin.");
      return;
    }
    const content = generateCSV(selectedCourse.ogrenciler);
    const filename = `${bulkFilters.courseCode}_${sanitizeFilename(bulkFilters.componentName)}_sablonu.csv`;
    downloadCSV(content, filename);
  };

  const handleFile = (file) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLocaleLowerCase("tr-TR");
    if (!["csv", "txt"].includes(extension)) {
      setCsvState((current) => ({ ...current, parseMessage: "Sadece .csv ve .txt dosyaları desteklenir." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const parsed = parseCSV(text);
      const validatedRows = validateCsvRows(parsed.data, selectedStudents);
      setCsvState({
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        rows: validatedRows,
        missingColumns: parsed.missingColumns,
        isDragging: false,
        parseMessage: parsed.missingColumns ? "CSV başlığı eksik veya hatalı. Gerekli sütunlar: ogrenci_no, ad_soyad, not." : ""
      });
    };
    reader.readAsText(file, "UTF-8");
  };

  const applyCsvToTable = () => {
    if (csvState.missingColumns || csvState.rows.length === 0) return;

    const usableRows = csvState.rows.filter((row) => !row.hasError && !row.hasWarning);
    if (usableRows.length === 0) {
      showToast("Aktarılacak geçerli CSV satırı bulunamadı.");
      return;
    }

    if (!window.confirm("CSV verisi mevcut tablo değerlerinin üzerine yazılacak. Devam edilsin mi?")) return;

    setGradeValues((current) => {
      const next = { ...current };
      usableRows.forEach((row) => {
        next[row.ogrenciNo] = row.notText;
      });
      return next;
    });
    showToast(`${usableRows.length} CSV satırı tabloya aktarıldı.`);
  };

  const clearGrades = () => {
    if (!window.confirm("Tüm not girişleri temizlensin mi?")) return;
    setGradeValues(Object.fromEntries(selectedStudents.map((student) => [student.no, ""])));
    setCsvState(emptyCsvState);
  };

  const saveAllGrades = () => {
    if (invalidInputCount > 0) {
      showToast("Kaydetmeden önce kırmızı işaretli notları düzeltin.");
      return;
    }

    onBulkSave({
      courseCode: bulkFilters.courseCode,
      componentName: bulkFilters.componentName,
      values: gradeValues,
      filledCount: gradeStats.filled,
      skippedCount: selectedStudents.length - gradeStats.filled
    });
  };

  return (
    <section className="grid gap-5">
      <div className="card-flat p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4" style={{ borderColor: colors.grayBorder }}>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: colors.textDark }}>Not Gir</h2>
            <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMid }}>Tekli kayıt veya sınıf listesi üzerinden toplu not girişi</p>
          </div>
          <div className="grade-mode-tabs flex flex-wrap gap-2">
            <ModeTab active={mode === "single"} icon={<Keyboard size={18} />} onClick={() => setMode("single")}>
              Tekli Not Gir
            </ModeTab>
            <ModeTab active={mode === "bulk"} icon={<FileUp size={18} />} onClick={() => setMode("bulk")}>
              Toplu Not Girişi
            </ModeTab>
          </div>
        </div>

        {mode === "single" ? (
          <SingleGradeForm
            allStudents={allStudents}
            average={average}
            courseOptions={courseOptions}
            form={form}
            onSubmit={onSubmit}
            updateField={updateField}
          />
        ) : (
          <form className="mt-5 grid gap-5" onSubmit={showBulkList}>
            <div className="bulk-filter-bar grid gap-4 rounded-[14px] border p-4 lg:grid-cols-[1fr_1.25fr_1fr_auto]" style={{ borderColor: colors.grayBorder, background: colors.grayLight }}>
              <SelectInput label="Dönem" value={bulkFilters.term} onChange={(event) => setFilter("term", event.target.value)}>
                {terms.map((term) => <option key={term}>{term}</option>)}
              </SelectInput>
              <SelectInput label="Ders" value={bulkFilters.courseCode} onChange={(event) => setFilter("courseCode", event.target.value)}>
                {courseOptions.map((course) => <option key={course.code} value={course.code}>{course.code} - {course.name}</option>)}
              </SelectInput>
              <SelectInput label="Bileşen" value={bulkFilters.componentName} onChange={(event) => setFilter("componentName", event.target.value)}>
                {componentOptions.map((component) => <option key={component.ad} value={component.ad}>{component.ad}</option>)}
              </SelectInput>
              <PrimaryButton type="submit" className="mt-auto min-h-12 whitespace-nowrap">
                <ChevronRight size={18} /> Listeyi Getir
              </PrimaryButton>
            </div>

            {listVisible && selectedCourse && (
              <>
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
                  <InlineGradePanel
                    componentName={bulkFilters.componentName}
                    firstInputRef={firstInputRef}
                    gradeStats={gradeStats}
                    gradeValues={gradeValues}
                    moveGradeFocus={moveGradeFocus}
                    students={selectedStudents}
                    updateGradeValue={updateGradeValue}
                  />

                  <CsvUploadPanel
                    applyCsvToTable={applyCsvToTable}
                    csvCounts={csvCounts}
                    csvState={csvState}
                    downloadTemplate={downloadTemplate}
                    fileInputRef={fileInputRef}
                    handleFile={handleFile}
                    setCsvState={setCsvState}
                  />
                </div>

                <BulkSaveBar
                  filled={gradeStats.filled}
                  invalidInputCount={invalidInputCount}
                  onClear={clearGrades}
                  onSave={saveAllGrades}
                  average={gradeStats.average}
                  total={selectedStudents.length}
                />
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function ModeTab({ active, children, icon, onClick }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 border-b-[3px] px-4 text-sm font-bold transition-colors"
      style={{
        borderBottomColor: active ? colors.greenMain : "transparent",
        color: active ? colors.greenMain : colors.textMid,
        background: active ? colors.greenBg : "transparent"
      }}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

function SingleGradeForm({ allStudents, average, courseOptions, form, onSubmit, updateField }) {
  return (
    <form className="mt-5 grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectInput label="Dönem seç" value={form.term} onChange={(event) => updateField("term", event.target.value)}>
          {terms.map((term) => <option key={term}>{term}</option>)}
        </SelectInput>
        <SelectInput label="Ders seç" value={form.course} onChange={(event) => updateField("course", event.target.value)}>
          <option value="">Ders seçiniz</option>
          {courseOptions.map((course) => <option key={course.code} value={course.code}>{course.name}</option>)}
        </SelectInput>
        <SelectInput label="Öğrenci seç" value={form.student} onChange={(event) => updateField("student", event.target.value)}>
          <option value="">Öğrenci seçiniz</option>
          {allStudents.map((student) => <option key={student.no} value={student.no}>{student.name}</option>)}
        </SelectInput>
        <TextInput label="Vize" type="number" min="0" max="100" value={form.midterm} onChange={(event) => updateField("midterm", event.target.value)} />
        <TextInput label="Final" type="number" min="0" max="100" value={form.final} onChange={(event) => updateField("final", event.target.value)} />
        <div className="rounded-[14px] border p-4" style={{ borderColor: colors.grayBorder, background: colors.greenBg }}>
          <span className="text-sm font-bold" style={{ color: colors.textMid }}>Anlık Ortalama</span>
          <strong className="mt-1 block text-3xl" style={{ color: colors.greenMain }}>{average}</strong>
        </div>
      </div>
      <PrimaryButton type="submit" className="w-fit">Kaydet</PrimaryButton>
    </form>
  );
}

function InlineGradePanel({ componentName, firstInputRef, gradeStats, gradeValues, moveGradeFocus, students, updateGradeValue }) {
  return (
    <section className="card-flat overflow-hidden">
      <div className="border-b p-5" style={{ borderColor: colors.grayBorder }}>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px]" style={{ background: colors.greenBg, color: colors.greenMain }}>
            <Keyboard size={21} />
          </span>
          <div>
            <h3 className="text-2xl font-bold" style={{ color: colors.textDark }}>Klavye ile Hızlı Giriş</h3>
            <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMid }}>Tab veya Enter ile sonraki öğrenciye geç</p>
          </div>
        </div>
      </div>

      <div className="bulk-table-wrap overflow-x-auto">
        <table className="bulk-grade-table w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr>
              {["#", "Öğrenci No", "Ad Soyad", componentName, "Durum"].map((head) => (
                <th key={head} className="px-4 py-3 text-sm font-extrabold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const value = gradeValues[student.no] ?? "";
              const invalid = value !== "" && !isValidScore(value);
              return (
                <tr key={student.no}>
                  <td className="px-4 py-3 text-sm font-bold">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{student.no}</td>
                  <td className="px-4 py-3 text-sm font-extrabold">{student.ad}</td>
                  <td className="px-4 py-3">
                    <input
                      ref={index === 0 ? firstInputRef : null}
                      className={`bulk-grade-input focus-ring h-11 w-28 rounded-[10px] border px-3 text-sm font-bold ${invalid ? "bulk-grade-input-invalid" : ""}`}
                      data-index={index}
                      inputMode="decimal"
                      max="100"
                      min="0"
                      title={invalid ? getScoreTooltip(value) : ""}
                      type="number"
                      value={value}
                      onChange={(event) => updateGradeValue(student.no, event.target.value)}
                      onKeyDown={(event) => moveGradeFocus(event, index)}
                    />
                  </td>
                  <td className="px-4 py-3"><ScoreStatusBadge value={value} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t px-5 py-4 text-sm font-extrabold" style={{ borderColor: colors.grayBorder, color: colors.textMid }}>
        <span>Girilen: <strong style={{ color: colors.greenMain }}>{gradeStats.filled} / {students.length}</strong></span>
        <span>Ortalama: <strong style={{ color: colors.greenMain }}>{gradeStats.average}</strong></span>
        <span>En Yüksek: <strong style={{ color: colors.greenMain }}>{gradeStats.highest}</strong></span>
        <span>En Düşük: <strong style={{ color: colors.greenMain }}>{gradeStats.lowest}</strong></span>
      </div>
    </section>
  );
}

function CsvUploadPanel({
  applyCsvToTable,
  csvCounts,
  csvState,
  downloadTemplate,
  fileInputRef,
  handleFile,
  setCsvState
}) {
  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <section className="card-flat grid gap-5 p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px]" style={{ background: colors.greenBg, color: colors.greenMain }}>
          <UploadCloud size={22} />
        </span>
        <div>
          <h3 className="text-2xl font-bold" style={{ color: colors.textDark }}>CSV Dosyası ile Yükle</h3>
          <p className="mt-1 text-sm font-semibold" style={{ color: colors.textMid }}>Önce şablonu indirin, Excel'de doldurun, tekrar yükleyin.</p>
        </div>
      </div>

      <button
        type="button"
        className="button-soft inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-4 font-extrabold text-white"
        style={{ background: colors.greenMain }}
        onClick={downloadTemplate}
      >
        <Download size={18} /> CSV Şablonu İndir
      </button>

      <div
        className={`upload-zone grid place-items-center rounded-[12px] border-2 border-dashed px-5 py-8 text-center ${csvState.isDragging ? "is-dragging" : ""}`}
        onDragLeave={(event) => {
          event.preventDefault();
          setCsvState((current) => ({ ...current, isDragging: false }));
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setCsvState((current) => ({ ...current, isDragging: true }));
        }}
        onDrop={(event) => {
          event.preventDefault();
          setCsvState((current) => ({ ...current, isDragging: false }));
          handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={fileInputRef}
          accept=".csv,.txt"
          className="hidden"
          type="file"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <UploadCloud size={38} style={{ color: colors.greenMain }} />
        <p className="mt-3 text-base font-extrabold" style={{ color: colors.greenMain }}>CSV dosyanızı buraya sürükleyin</p>
        <p className="mt-1 text-sm font-bold" style={{ color: colors.textMid }}>veya</p>
        <button
          type="button"
          className="mt-3 rounded-xl border bg-white px-4 py-2 text-sm font-extrabold"
          style={{ borderColor: colors.grayBorder, color: colors.greenMain }}
          onClick={openFilePicker}
        >
          Dosya Seç
        </button>
        <p className="mt-3 text-xs font-bold" style={{ color: colors.textMid }}>Desteklenen format: .csv, .txt</p>
      </div>

      {csvState.fileName && (
        <div className="rounded-[12px] border p-3 text-sm font-bold" style={{ borderColor: colors.grayBorder, background: colors.grayLight, color: colors.textMid }}>
          <span style={{ color: colors.textDark }}>{csvState.fileName}</span> · {csvState.fileSize}
        </div>
      )}

      {csvState.parseMessage && (
        <div className="rounded-[12px] border p-3 text-sm font-extrabold" style={{ borderColor: "#fecaca", background: "#fee2e2", color: "#dc2626" }}>
          {csvState.parseMessage}
        </div>
      )}

      {csvState.rows.length > 0 && !csvState.missingColumns && (
        <div className="grid gap-3">
          <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: colors.grayBorder }}>
            <table className="csv-preview-table w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr>
                  {["Öğrenci No", "Ad Soyad", "Not", "Durum"].map((head) => (
                    <th key={head} className="px-3 py-2 text-xs font-extrabold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvState.rows.slice(0, 8).map((row, index) => (
                  <tr key={`${row.ogrenciNo}-${index}`} className={row.hasError ? "csv-row-error" : row.hasWarning ? "csv-row-warning" : ""}>
                    <td className="px-3 py-2 text-xs font-bold">{row.ogrenciNo || "—"}</td>
                    <td className="px-3 py-2 text-xs font-bold">{row.adSoyad || "—"}</td>
                    <td className="px-3 py-2 text-xs font-extrabold">{row.notText || "—"}</td>
                    <td className="px-3 py-2 text-xs font-extrabold">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-extrabold" style={{ color: colors.textMid }}>
            {csvCounts.success} satır başarıyla okundu, {csvCounts.errors} hata var{csvCounts.warnings > 0 ? `, ${csvCounts.warnings} uyarı var` : ""}.
          </p>
          <button
            type="button"
            className="button-soft inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={csvCounts.success === 0}
            style={{ background: colors.greenMain }}
            onClick={applyCsvToTable}
          >
            <Check size={18} /> Tabloya Aktar
          </button>
        </div>
      )}
    </section>
  );
}

function BulkSaveBar({ average, filled, invalidInputCount, onClear, onSave, total }) {
  const empty = total - filled;
  return (
    <section className="card-flat overflow-hidden">
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-sm font-extrabold" style={{ background: colors.greenBg, color: colors.textMid }}>
        <span>Toplam: <strong style={{ color: colors.greenMain }}>{total} öğrenci</strong></span>
        <span>Doldurulmuş: <strong style={{ color: colors.greenMain }}>{filled}</strong></span>
        <span>Boş: <strong style={{ color: colors.greenMain }}>{empty}</strong></span>
        <span>Ortalama: <strong style={{ color: colors.greenMain }}>{average}</strong></span>
      </div>

      {(empty > 0 || invalidInputCount > 0) && (
        <div className="border-t px-5 py-3 text-sm font-extrabold" style={{ borderColor: colors.grayBorder, background: "#fff7ed", color: "#9a3412" }}>
          {empty > 0 && <span>⚠️ {empty} öğrencinin notu girilmemiş. Boş olanlar kaydedilmeyecek.</span>}
          {invalidInputCount > 0 && <span className="ml-3">Kırmızı işaretli {invalidInputCount} not düzeltilmeli.</span>}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t px-5 py-4" style={{ borderColor: colors.grayBorder }}>
        <button
          type="button"
          className="button-soft inline-flex min-h-11 items-center gap-2 rounded-xl border px-5 font-extrabold"
          style={{ borderColor: colors.grayBorder, color: colors.textMid, background: "#ffffff" }}
          onClick={onClear}
        >
          <Trash2 size={18} /> Temizle
        </button>
        <button
          type="button"
          className="button-soft inline-flex min-h-11 items-center gap-2 rounded-xl px-5 font-extrabold text-white"
          style={{ background: colors.greenMain }}
          onClick={onSave}
        >
          <Save size={18} /> Tümünü Kaydet
        </button>
      </div>
    </section>
  );
}

function ScoreStatusBadge({ value }) {
  const status = getScoreStatus(value);
  return (
    <span className="inline-flex min-w-20 justify-center rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: status.background, color: status.color }}>
      {status.label}
    </span>
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
                        <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={saveInlineEdit}>Kaydet</button>
                        <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.redDanger }} onClick={cancelEdit}>İptal</button>
                      </div>
                    ) : (
                      <button type="button" className="rounded-lg px-3 py-2 font-bold text-white" style={{ background: colors.greenMain }} onClick={() => startEdit(student)}>Düzenle</button>
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

function TeacherCoursesView({ courses, onOpenCourse }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
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
            <span>Kredi: <strong style={{ color: "#166534" }}>{course.kredi}</strong></span>
            <span>Gün/Saat: <strong style={{ color: "#166534" }}>{course.gunSaat}</strong></span>
            <span>Kayıtlı: <strong style={{ color: "#166534" }}>{course.ogrenciler.length} öğrenci</strong></span>
            <span>Geçen: <strong style={{ color: "#166534" }}>{stats.passed}</strong></span>
            <span>Kalan: <strong style={{ color: "#166534" }}>{stats.failed}</strong></span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold" style={{ color: "#1e293b" }}>Öğrenci Listesi</h3>
            <label className="flex min-h-10 w-full max-w-xs items-center gap-2 rounded-lg border px-3" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
              <span>Arama</span>
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
                  <tr><td className="px-4 py-8 text-center font-extrabold" colSpan={colSpan} style={{ color: "#475569" }}>Arama sonucu bulunamadı</td></tr>
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
          <button type="button" className="button-soft rounded-lg px-4 py-2 font-extrabold text-white" style={{ background: "#166534" }} onClick={onGradeEntry}>Not Gir</button>
          <button type="button" className="button-soft rounded-lg border px-4 py-2 font-extrabold" style={{ borderColor: "#e2e8f0", color: "#475569", background: "#ffffff" }} onClick={onClose}>Kapat</button>
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
    passed: { background: "#dcfce7", color: "#166534", label: "Geçti" },
    failed: { background: "#fee2e2", color: "#dc2626", label: "Kaldı" },
    waiting: { background: "#fef9c3", color: "#854d0e", label: "Bekliyor" }
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

function getCourseComponents(course) {
  if (!course) return [];
  return [...course.degerlenirme.yicBilesenleri, { ad: "Final", agirlik: course.degerlenirme.finalEtkisi }];
}

function createInitialGradeValues(course, componentName) {
  return Object.fromEntries(course.ogrenciler.map((student) => {
    const score = getStudentComponentScore(student, componentName);
    return [student.no, score === null || score === undefined ? "" : String(score)];
  }));
}

function getComponentKey(componentName) {
  return componentKeyByName[componentName] || null;
}

function getStudentComponentScore(student, componentName) {
  const key = getComponentKey(componentName);
  return key ? student[key] : undefined;
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

function isValidScore(value) {
  if (value === "" || value === null || value === undefined) return false;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100;
}

function getScoreTooltip(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "Geçersiz not";
  if (number > 100) return "Max 100";
  if (number < 0) return "Min 0";
  return "";
}

function getScoreStatus(value) {
  if (value === "" || value === null || value === undefined) return { label: "—", background: "#f1f5f9", color: "#64748b" };
  if (!isValidScore(value)) return { label: getScoreTooltip(value), background: "#fee2e2", color: "#dc2626" };

  const score = Number(value);
  if (score <= 49) return { label: "❌ Düşük", background: "#fee2e2", color: "#dc2626" };
  if (score <= 69) return { label: "⚠️ Orta", background: "#ffedd5", color: "#9a3412" };
  if (score <= 84) return { label: "📘 İyi", background: "#dbeafe", color: "#1e40af" };
  return { label: "✅ Yüksek", background: "#dcfce7", color: "#166534" };
}

function getGradeStats(values, total) {
  const scores = Object.values(values)
    .filter((value) => value !== "" && isValidScore(value))
    .map(Number);

  if (scores.length === 0) {
    return { filled: 0, empty: total, average: "—", highest: "—", lowest: "—" };
  }

  const sum = scores.reduce((totalScore, score) => totalScore + score, 0);
  return {
    filled: scores.length,
    empty: total - scores.length,
    average: (sum / scores.length).toFixed(1),
    highest: Math.max(...scores),
    lowest: Math.min(...scores)
  };
}

function parseCSV(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { data: [], missingColumns: true };

  const headerCells = splitCsvLine(lines[0]).map(normalizeHeader);
  const hasRequiredHeaders = headerCells.includes("ogrenci_no") && headerCells.includes("ad_soyad") && headerCells.includes("not");
  const missingColumns = headerCells.length < 3 || !hasRequiredHeaders;

  const data = lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line);
    const rawScore = cells[2]?.trim() || "";
    const parsedScore = rawScore === "" ? null : Number.parseInt(rawScore, 10);

    return {
      lineNumber: index + 2,
      ogrenciNo: cells[0]?.trim() || "",
      adSoyad: cells[1]?.trim() || "",
      not: Number.isNaN(parsedScore) ? null : parsedScore,
      notText: rawScore
    };
  });

  return { data, missingColumns };
}

function splitCsvLine(line) {
  return line.split(",");
}

function validateCsvRows(rows, students) {
  const studentMap = new Map(students.map((student) => [student.no, student]));
  return rows.map((row) => {
    const matchedStudent = studentMap.get(row.ogrenciNo);
    const hasWarning = !matchedStudent;
    const hasScore = row.notText !== "";
    const hasError = hasScore && !isValidScore(row.notText);
    let status = "Okundu";

    if (hasWarning) status = "Öğrenci no eşleşmiyor";
    if (hasError) status = "Not 0-100 dışında";
    if (!hasScore && !hasWarning) status = "Boş not";

    return {
      ...row,
      adSoyad: matchedStudent?.ad || row.adSoyad,
      hasError,
      hasWarning,
      status
    };
  });
}

function getCsvCounts(rows) {
  const errors = rows.filter((row) => row.hasError).length;
  const warnings = rows.filter((row) => row.hasWarning).length;
  const success = rows.filter((row) => !row.hasError && !row.hasWarning).length;
  return { errors, success, warnings };
}

function generateCSV(students) {
  const header = "ogrenci_no,ad_soyad,not";
  const rows = students.map((student) => `${student.no},${escapeCsvCell(student.ad)},`);
  return [header, ...rows].join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function sanitizeFilename(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeHeader(value) {
  return sanitizeFilename(value.trim()).toLocaleLowerCase("tr-TR");
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
          <div key={label} className="rounded-[14px] border p-4" style={{ borderColor: colors.grayBorder, background: colors.grayLight }}>
            <span className="text-sm font-bold" style={{ color: colors.textMid }}>{label}</span>
            <strong className="mt-1 block">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
