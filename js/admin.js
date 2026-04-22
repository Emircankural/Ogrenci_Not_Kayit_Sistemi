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

document.addEventListener("DOMContentLoaded", () => {
  const session = requireSession("admin");
  if (!session) return;

  setupAdminNavigation();
  setupAdminForms();
  setupTableSearch("adminStudentSearch", "#adminStudentRows tr");
  setupTableSearch("adminTeacherSearch", "#adminTeacherRows tr");
  setupRowActions();
});
