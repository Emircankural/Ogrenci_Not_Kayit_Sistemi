const teacherGradeState = {
  course: "",
  student: "",
  midterm: "",
  final: ""
};

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

function setupGradeForm() {
  const form = document.getElementById("gradeForm");
  const fields = {
    course: document.getElementById("gradeCourse"),
    student: document.getElementById("gradeStudent"),
    midterm: document.getElementById("midtermGrade"),
    final: document.getElementById("finalGrade")
  };

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
  setupTeacherSearch();
});
