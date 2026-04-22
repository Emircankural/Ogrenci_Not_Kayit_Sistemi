const studentState = {
  activeView: "grades"
};

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupStudentNavigation() {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      studentState.activeView = button.dataset.view;
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".view-section").forEach((section) => section.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(`[data-section="${studentState.activeView}"]`).classList.add("active");
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

document.addEventListener("DOMContentLoaded", () => {
  const session = requireSession("ogrenci");
  if (!session) return;

  document.getElementById("studentName").textContent = session.name;
  setupStudentNavigation();
});
