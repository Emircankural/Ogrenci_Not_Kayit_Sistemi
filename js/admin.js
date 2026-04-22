const adminForms = {
  student: {
    fullName: "",
    number: "",
    email: "",
    password: "",
    department: ""
  },
  teacher: {
    fullName: "",
    registry: "",
    email: "",
    password: "",
    title: ""
  },
  course: {
    name: "",
    code: "",
    credit: "",
    teacher: ""
  }
};

const transcriptStudents = [
  { number: "220101045", name: "Mehmet Demir" },
  { number: "220101046", name: "Zeynep Arslan" },
  { number: "220101047", name: "Burak Çelik" },
  { number: "220101048", name: "Selin Kaya" },
  { number: "220101049", name: "Emre Yıldız" }
];

const gradeCoefficients = {
  AA: 4,
  BA: 3.5,
  BB: 3,
  CB: 2.5,
  CC: 2,
  DC: 1.5,
  DD: 1,
  FD: 0.5,
  FF: 0,
  G: 0,
  VZ: 0,
  MU: 0
};

const transcriptGradeOptions = Object.keys(gradeCoefficients);

const baseTranscriptCourses = [
  { semester: 1, code: "1010001", name: "Mühendisliğe Giriş", ects: 4, grade: "BB" },
  { semester: 1, code: "1010002", name: "Algoritma ve Programlama I", ects: 4, grade: "CC" },
  { semester: 1, code: "1010003", name: "Programlama Lab. I", ects: 2, grade: "BA" },
  { semester: 1, code: "1010004", name: "İş Sağlığı ve Güvenliği", ects: 2, grade: "AA" },
  { semester: 1, code: "1010005", name: "Matematik I", ects: 5, grade: "CB" },
  { semester: 1, code: "1010006", name: "Fizik I", ects: 5, grade: "CC" },
  { semester: 1, code: "1010007", name: "Türk Dili I", ects: 2, grade: "BB" },
  { semester: 1, code: "1010008", name: "İngilizce I", ects: 4, grade: "CB" },
  { semester: 1, code: "1010009", name: "Atatürk İlkeleri I", ects: 2, grade: "BA" },
  { semester: 2, code: "1010010", name: "Algoritma ve Programlama II", ects: 4, grade: "BA" },
  { semester: 2, code: "1010011", name: "Programlama Lab. II", ects: 2, grade: "AA" },
  { semester: 2, code: "1010012", name: "Veri Yapıları", ects: 4, grade: "BB" },
  { semester: 2, code: "1010013", name: "Matematik II", ects: 5, grade: "CC" },
  { semester: 2, code: "1010014", name: "Fizik II", ects: 5, grade: "CB" },
  { semester: 2, code: "1010015", name: "Türk Dili II", ects: 2, grade: "BB" },
  { semester: 2, code: "1010016", name: "İngilizce II", ects: 4, grade: "AA" },
  { semester: 2, code: "1010017", name: "Atatürk İlkeleri II", ects: 2, grade: "BA" },
  { semester: 2, code: "1010018", name: "Kariyer Planlama", ects: 0, grade: "G" },
  { semester: 3, code: "1010019", name: "Nesneye Yönelimli Programlama", ects: 4, grade: "DC" },
  { semester: 3, code: "1010020", name: "Veritabanı Yönetim Sistemleri", ects: 4, grade: "BB" },
  { semester: 3, code: "1010021", name: "Diferansiyel Denklemler", ects: 4, grade: "FF" },
  { semester: 3, code: "1010022", name: "İstatistik ve Olasılık", ects: 4, grade: "CC" },
  { semester: 3, code: "1010023", name: "Elektrik Elektronik Devreler", ects: 5, grade: "CB" },
  { semester: 3, code: "1010024", name: "Lineer Cebir", ects: 3, grade: "DC" },
  { semester: 4, code: "1010025", name: "Web Programlama", ects: 4, grade: "AA" },
  { semester: 4, code: "1010026", name: "Bilgisayar Ağları", ects: 4, grade: "BA" },
  { semester: 4, code: "1010027", name: "İşletim Sistemleri", ects: 4, grade: "BB" },
  { semester: 4, code: "1010028", name: "Yazılım Mühendisliği", ects: 3, grade: "CB" },
  { semester: 4, code: "1010029", name: "Diferansiyel Denklemler (Tekrar)", ects: 4, grade: "CC" },
  { semester: 4, code: "1010030", name: "Teknik Seçmeli I", ects: 3, grade: "BA" }
];

const transcriptState = {
  selectedStudent: null,
  courses: [],
  editingId: null
};

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupAdminNavigation() {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view-section").forEach((section) => section.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(`[data-section="${button.dataset.view}"]`).classList.add("active");
      sidebar.classList.remove("open");
      scrim.classList.remove("show");
    });
  });

  document.querySelector("[data-sidebar-toggle]").addEventListener("click", () => {
    sidebar.classList.add("open");
    scrim.classList.add("show");
  });

  scrim.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  });
}

function bindFormState(formId, fieldMap, stateKey, successMessage) {
  const form = document.getElementById(formId);

  Object.entries(fieldMap).forEach(([key, selector]) => {
    const input = document.querySelector(selector);
    input.addEventListener("input", () => {
      adminForms[stateKey][key] = input.value;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast(successMessage);
    form.reset();
    Object.keys(adminForms[stateKey]).forEach((key) => {
      adminForms[stateKey][key] = "";
    });
  });
}

function setupAdminForms() {
  bindFormState("addStudentForm", {
    fullName: "#studentFullName",
    number: "#studentNumber",
    email: "#studentEmail",
    password: "#studentPassword",
    department: "#studentDepartment"
  }, "student", "Öğrenci kaydı başarıyla oluşturuldu.");

  bindFormState("addTeacherForm", {
    fullName: "#teacherFullName",
    registry: "#teacherRegistry",
    email: "#teacherEmail",
    password: "#teacherPassword",
    title: "#teacherTitle"
  }, "teacher", "Öğretmen kaydı başarıyla oluşturuldu.");

  bindFormState("addCourseForm", {
    name: "#courseName",
    code: "#courseCode",
    credit: "#courseCredit",
    teacher: "#courseTeacher"
  }, "course", "Ders kaydı başarıyla oluşturuldu.");
}

function setupTableSearch(inputId, rowSelector) {
  const input = document.getElementById(inputId);
  const rows = Array.from(document.querySelectorAll(rowSelector));

  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase("tr-TR");
    rows.forEach((row) => {
      row.style.display = row.dataset.search.toLocaleLowerCase("tr-TR").includes(query) ? "" : "none";
    });
  });
}

function setupRowActions() {
  document.querySelectorAll(".action-cell button").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.textContent.trim();
      showToast(`${action} işlemi demo arayüzünde hazır.`);
    });
  });
}

function getGradeStatus(grade) {
  if (grade === "FF" || grade === "FD" || grade === "VZ") {
    return "Başarısız";
  }
  return gradeCoefficients[grade] > 0 || grade === "G" || grade === "MU" ? "Başarılı" : "Başarısız";
}

function getGradeClass(grade) {
  if (grade === "AA" || grade === "BA") return "grade-high";
  if (grade === "DC" || grade === "DD") return "grade-warn";
  if (grade === "FF" || grade === "FD" || grade === "VZ") return "grade-fail";
  return "grade-good";
}

function createGradeSelect(value, id) {
  const options = transcriptGradeOptions
    .map((grade) => `<option value="${grade}"${grade === value ? " selected" : ""}>${grade}</option>`)
    .join("");
  return `<select class="inline-grade-select" data-grade-select="${id}">${options}</select>`;
}

function cloneTranscriptCourses() {
  return baseTranscriptCourses.map((course, index) => ({
    ...course,
    id: `${course.code}-${index}`
  }));
}

function updateTranscriptSummary() {
  const totalEcts = transcriptState.courses.reduce((sum, course) => sum + Number(course.ects), 0);
  const earnedEcts = transcriptState.courses
    .filter((course) => getGradeStatus(course.grade) === "Başarılı")
    .reduce((sum, course) => sum + Number(course.ects), 0);
  const gpaCourses = transcriptState.courses.filter((course) => course.grade !== "FF");
  const gpaEcts = gpaCourses.reduce((sum, course) => sum + Number(course.ects), 0);
  const gpaTotal = gpaCourses.reduce((sum, course) => sum + (gradeCoefficients[course.grade] * Number(course.ects)), 0);

  document.getElementById("totalEcts").textContent = totalEcts;
  document.getElementById("earnedEcts").textContent = earnedEcts;
  document.getElementById("gpaValue").textContent = gpaEcts ? (gpaTotal / gpaEcts).toFixed(2) : "0.00";
}

function renderTranscriptRows() {
  const tbody = document.getElementById("transcriptCourseRows");
  tbody.innerHTML = transcriptState.courses
    .sort((a, b) => a.semester - b.semester || a.code.localeCompare(b.code, "tr"))
    .map((course) => {
      const coefficient = gradeCoefficients[course.grade];
      const status = getGradeStatus(course.grade);
      const isEditing = transcriptState.editingId === course.id;
      const gradeCell = isEditing
        ? createGradeSelect(course.grade, course.id)
        : `<span class="grade ${getGradeClass(course.grade)}">${course.grade}</span>`;
      const actions = isEditing
        ? `<button type="button" data-save-course="${course.id}">✅ Kaydet</button><button type="button" data-cancel-course>❌ İptal</button>`
        : `<button type="button" data-edit-course="${course.id}">✏️ Düzenle</button><button type="button" data-delete-course="${course.id}">🗑️ Sil</button>`;

      return `
        <tr>
          <td>${course.semester}</td>
          <td>${course.code}</td>
          <td>${course.name}</td>
          <td>${course.ects}</td>
          <td>${gradeCell}</td>
          <td>${coefficient}</td>
          <td class="${status === "Başarısız" ? "fail-text" : ""}">${status}</td>
          <td class="transcript-row-actions">${actions}</td>
        </tr>
      `;
    })
    .join("");
  updateTranscriptSummary();
}

function selectTranscriptStudent(student) {
  transcriptState.selectedStudent = student;
  transcriptState.courses = cloneTranscriptCourses();
  transcriptState.editingId = null;
  document.getElementById("transcriptWorkspace").hidden = false;
  document.getElementById("selectedTranscriptStudent").textContent = `${student.number} — ${student.name}`;
  renderTranscriptRows();
}

function setupTranscriptManagement() {
  const searchInput = document.getElementById("transcriptStudentSearch");
  const studentSelect = document.getElementById("transcriptStudentSelect");
  const workspace = document.getElementById("transcriptWorkspace");
  const addForm = document.getElementById("transcriptCourseForm");
  const gradeSelect = document.getElementById("newCourseGrade");
  const tbody = document.getElementById("transcriptCourseRows");

  gradeSelect.innerHTML = transcriptGradeOptions.map((grade) => `<option>${grade}</option>`).join("");

  const handleStudentValue = (value) => {
    const normalizedValue = value.toLocaleLowerCase("tr-TR");
    const exactStudent = transcriptStudents.find((item) => {
      const label = `${item.number} — ${item.name}`.toLocaleLowerCase("tr-TR");
      return label === normalizedValue || item.number === value;
    });
    const matches = transcriptStudents.filter((item) => {
      const label = `${item.number} — ${item.name}`.toLocaleLowerCase("tr-TR");
      return normalizedValue.length >= 3 && label.includes(normalizedValue);
    });
    const student = exactStudent || (matches.length === 1 ? matches[0] : null);

    if (!student) {
      workspace.hidden = true;
      return;
    }

    studentSelect.value = student.number;
    searchInput.value = `${student.number} — ${student.name}`;
    selectTranscriptStudent(student);
  };

  searchInput.addEventListener("input", () => {
    handleStudentValue(searchInput.value.trim());
  });

  studentSelect.addEventListener("change", () => {
    const student = transcriptStudents.find((item) => item.number === studentSelect.value);
    if (student) {
      searchInput.value = `${student.number} — ${student.name}`;
      selectTranscriptStudent(student);
    } else {
      workspace.hidden = true;
    }
  });

  document.getElementById("toggleTranscriptCourseForm").addEventListener("click", () => {
    addForm.hidden = !addForm.hidden;
  });

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = document.getElementById("newCourseCode").value.trim();
    const name = document.getElementById("newCourseName").value.trim();
    const ects = Number(document.getElementById("newCourseEcts").value);

    if (!code || !name || Number.isNaN(ects)) {
      showToast("Ders eklemek için kod, ad ve AKTS alanlarını doldurun.");
      return;
    }

    transcriptState.courses.push({
      id: `new-${Date.now()}`,
      semester: Number(document.getElementById("newCourseSemester").value),
      code,
      name,
      ects,
      grade: document.getElementById("newCourseGrade").value
    });
    addForm.reset();
    addForm.hidden = true;
    renderTranscriptRows();
    showToast("Ders transkripte eklendi.");
  });

  tbody.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const editId = button.dataset.editCourse;
    const saveId = button.dataset.saveCourse;
    const deleteId = button.dataset.deleteCourse;

    if (editId) {
      transcriptState.editingId = editId;
      renderTranscriptRows();
      return;
    }

    if (saveId) {
      const course = transcriptState.courses.find((item) => item.id === saveId);
      const select = document.querySelector(`[data-grade-select="${saveId}"]`);
      if (course && select) {
        course.grade = select.value;
        transcriptState.editingId = null;
        renderTranscriptRows();
        showToast("Ders notu güncellendi.");
      }
      return;
    }

    if (button.hasAttribute("data-cancel-course")) {
      transcriptState.editingId = null;
      renderTranscriptRows();
      return;
    }

    if (deleteId && confirm("Bu dersi transkriptten silmek istediğinize emin misiniz?")) {
      transcriptState.courses = transcriptState.courses.filter((course) => course.id !== deleteId);
      renderTranscriptRows();
      showToast("Ders transkriptten silindi.");
    }
  });

  document.getElementById("previewTranscript").addEventListener("click", () => {
    window.open("ogrenci.html?view=transcript", "_blank");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const session = requireSession("admin");
  if (!session) return;

  setupAdminNavigation();
  setupAdminForms();
  setupTableSearch("adminStudentSearch", "#adminStudentRows tr");
  setupTableSearch("adminTeacherSearch", "#adminTeacherRows tr");
  setupTranscriptManagement();
  setupRowActions();
});
