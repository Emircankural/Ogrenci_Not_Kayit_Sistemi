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

const teacherGradeState = {
  course: "",
  student: "",
  midterm: "",
  final: ""
};

let activeCourseModalCode = "";

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupTeacherNavigation() {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      activateTeacherView(button.dataset.view);
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

function activateTeacherView(view) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  document.querySelectorAll(".view-section").forEach((section) => {
    section.classList.toggle("active", section.dataset.section === view);
  });
}

function setupGradeForm() {
  const form = document.getElementById("gradeForm");
  const fields = {
    course: document.getElementById("gradeCourse"),
    student: document.getElementById("gradeStudent"),
    midterm: document.getElementById("midtermGrade"),
    final: document.getElementById("finalGrade")
  };

  fields.course.innerHTML = `<option value="">Ders seçiniz</option>${Object.entries(dersOgrencileri)
    .map(([kod, ders]) => `<option value="${ders.dersAdi}" data-course-code="${kod}">${ders.dersAdi}</option>`)
    .join("")}`;

  Object.entries(fields).forEach(([key, input]) => {
    input.addEventListener("input", () => {
      teacherGradeState[key] = input.value;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Not kaydı başarıyla oluşturuldu.");
    form.reset();
    Object.keys(teacherGradeState).forEach((key) => {
      teacherGradeState[key] = "";
    });
  });
}

function setupTeacherCourses() {
  const grid = document.querySelector('[data-section="courses"] .course-grid');
  if (!grid) return;

  grid.innerHTML = Object.entries(dersOgrencileri).map(([kod, ders]) => {
    return `
      <article class="info-card glass-card teacher-course-card" data-course-code="${kod}" tabindex="0" role="button" aria-label="${ders.dersAdi} öğrenci listesini aç">
        <span>${kod}</span>
        <h3>${ders.dersAdi}</h3>
        <p>${ders.ogrenciler.length} öğrenci</p>
        <strong>${ders.kredi} Kredi</strong>
      </article>
    `;
  }).join("");

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".teacher-course-card");
    if (!card) return;
    openCourseStudentsModal(card.dataset.courseCode);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".teacher-course-card");
    if (!card) return;
    event.preventDefault();
    openCourseStudentsModal(card.dataset.courseCode);
  });
}

function openCourseStudentsModal(kod) {
  const ders = dersOgrencileri[kod];
  if (!ders) return;
  activeCourseModalCode = kod;

  const existingModal = document.getElementById("courseStudentsModal");
  if (existingModal) existingModal.remove();

  const stats = getCourseStats(ders);
  const modal = document.createElement("div");
  modal.id = "courseStudentsModal";
  modal.className = "course-students-overlay";
  modal.innerHTML = `
    <div class="course-students-modal" role="dialog" aria-modal="true" aria-labelledby="courseStudentsTitle">
      <header class="course-modal-header">
        <div>
          <span class="course-modal-code">${kod}</span>
          <h2 id="courseStudentsTitle">${ders.dersAdi}</h2>
          <p>${ders.ogrenciler.length} öğrenci kayıtlı</p>
        </div>
        <button class="course-modal-close" type="button" data-close-course-modal aria-label="Kapat">×</button>
      </header>

      <div class="course-modal-body">
        <div class="course-summary-bar">
          <span>📚 Kredi: <strong>${ders.kredi}</strong></span>
          <span>📅 Gün/Saat: <strong>${ders.gunSaat}</strong></span>
          <span>👥 Kayıtlı: <strong>${ders.ogrenciler.length} öğrenci</strong></span>
          <span>✅ Geçen: <strong>${stats.passed}</strong></span>
          <span>❌ Kalan: <strong>${stats.failed}</strong></span>
        </div>

        <div class="student-list-toolbar">
          <h3>Öğrenci Listesi</h3>
          <label class="course-student-search">
            <span>🔍</span>
            <input id="courseStudentSearch" type="search" placeholder="Öğrenci ara...">
          </label>
        </div>

        <div class="course-students-table-wrap">
          <table class="course-students-table">
            ${renderCourseStudentTableHead(ders)}
            <tbody id="courseStudentsRows">
              ${renderCourseStudentRows(ders, "")}
            </tbody>
          </table>
        </div>
      </div>

      <footer class="course-modal-footer">
        <button class="course-modal-primary" type="button" data-open-grade-entry>📝 Not Gir</button>
        <button class="course-modal-secondary" type="button" data-close-course-modal>✕ Kapat</button>
      </footer>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("courseStudentSearch").addEventListener("input", (event) => {
    document.getElementById("courseStudentsRows").innerHTML = renderCourseStudentRows(ders, event.target.value);
  });
}

function renderCourseStudentTableHead(ders) {
  const componentHeads = ders.degerlenirme.yicBilesenleri
    .map((component) => `<th>${component.ad}</th>`)
    .join("");

  return `
    <thead>
      <tr>
        <th>#</th>
        <th>Öğrenci No</th>
        <th>Ad Soyad</th>
        ${componentHeads}
        <th>YİÇ</th>
        <th>Final</th>
        <th>Dönem Notu</th>
        <th>Harf</th>
        <th>Durum</th>
      </tr>
    </thead>
  `;
}

function renderCourseStudentRows(ders, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredStudents = ders.ogrenciler.filter((student) => {
    const searchText = `${student.no} ${student.ad}`.toLocaleLowerCase("tr-TR");
    return searchText.includes(normalizedQuery);
  });
  const colSpan = ders.degerlenirme.yicBilesenleri.length + 8;

  if (!filteredStudents.length) {
    return `<tr><td class="course-empty-row" colspan="${colSpan}">🔍 Arama sonucu bulunamadı</td></tr>`;
  }

  return filteredStudents.map((student, index) => {
    const result = calculateStudentResult(ders, student);
    const componentCells = ders.degerlenirme.yicBilesenleri
      .map((component) => `<td>${formatMaybeScore(getStudentComponentScore(student, component.ad))}</td>`)
      .join("");

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${student.no}</td>
        <td class="student-name-cell">${student.ad}</td>
        ${componentCells}
        <td>${formatMaybeScore(result.yic)}</td>
        <td>${formatMaybeScore(student.final)}</td>
        <td>${formatMaybeScore(result.termScore)}</td>
        <td>${result.letter || '<span class="empty-score">—</span>'}</td>
        <td>${renderStatusBadge(result.status)}</td>
      </tr>
    `;
  }).join("");
}

function calculateStudentResult(ders, student) {
  const hasAllComponentScores = ders.degerlenirme.yicBilesenleri.every((component) => {
    const score = getStudentComponentScore(student, component.ad);
    return score !== null && score !== undefined && score !== "";
  });
  const hasFinal = student.final !== null && student.final !== undefined && student.final !== "";

  if (!hasAllComponentScores || !hasFinal) {
    return { yic: null, termScore: null, letter: "", status: "waiting" };
  }

  const yic = ders.degerlenirme.yicBilesenleri.reduce((sum, component) => {
    return sum + Number(getStudentComponentScore(student, component.ad)) * (component.agirlik / 100);
  }, 0);
  const termScore = yic * (ders.degerlenirme.yicEtkisi / 100) + Number(student.final) * (ders.degerlenirme.finalEtkisi / 100);
  const passed = termScore >= ders.degerlenirme.gecmeNotu;

  return {
    yic,
    termScore,
    letter: getLetterGrade(termScore),
    status: passed ? "passed" : "failed"
  };
}

function getCourseStats(ders) {
  return ders.ogrenciler.reduce((stats, student) => {
    const result = calculateStudentResult(ders, student);
    if (result.status === "passed") stats.passed += 1;
    if (result.status === "failed") stats.failed += 1;
    return stats;
  }, { passed: 0, failed: 0 });
}

function getStudentComponentScore(student, componentName) {
  const explicitKeys = {
    "Ara Sınav": "araSinav",
    Vize: "vize",
    Proje: "proje",
    "Ödev": "odev"
  };
  return student[explicitKeys[componentName] || toCamelKey(componentName)];
}

function toCamelKey(value) {
  const normalized = value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-z0-9]/g, "");
  return normalized;
}

function formatMaybeScore(value) {
  if (value === null || value === undefined || value === "") {
    return '<span class="empty-score">—</span>';
  }

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

function renderStatusBadge(status) {
  if (status === "passed") return '<span class="course-status-badge passed">✅ Geçti</span>';
  if (status === "failed") return '<span class="course-status-badge failed">❌ Kaldı</span>';
  return '<span class="course-status-badge waiting">⏳ Bekliyor</span>';
}

function closeCourseStudentsModal() {
  const modal = document.getElementById("courseStudentsModal");
  if (modal) modal.remove();
  activeCourseModalCode = "";
}

function goToGradeEntryFromModal() {
  const kod = activeCourseModalCode;
  const ders = dersOgrencileri[kod];
  closeCourseStudentsModal();
  activateTeacherView("grade-entry");

  const courseSelect = document.getElementById("gradeCourse");
  if (!courseSelect || !ders) return;
  courseSelect.value = ders.dersAdi;
  teacherGradeState.course = ders.dersAdi;
  courseSelect.dispatchEvent(new Event("input", { bubbles: true }));
}

function setupCourseModalActions() {
  document.addEventListener("click", (event) => {
    if (event.target.matches("#courseStudentsModal") || event.target.matches("[data-close-course-modal]")) {
      closeCourseStudentsModal();
      return;
    }

    if (event.target.matches("[data-open-grade-entry]")) {
      goToGradeEntryFromModal();
    }
  });
}

function setupTeacherSearch() {
  const searchInput = document.getElementById("teacherStudentSearch");
  const rows = Array.from(document.querySelectorAll("#teacherStudentRows tr"));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
    rows.forEach((row) => {
      row.style.display = row.dataset.search.toLocaleLowerCase("tr-TR").includes(query) ? "" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const session = requireSession("ogretmen");
  if (!session) return;

  document.getElementById("teacherName").textContent = session.name;
  setupTeacherNavigation();
  setupGradeForm();
  setupTeacherCourses();
  setupCourseModalActions();
  setupTeacherSearch();
});
