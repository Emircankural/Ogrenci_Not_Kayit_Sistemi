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

  const activateView = (view) => {
    studentState.activeView = view;
    document.body.classList.toggle("transcript-mode", view === "transcript");
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.view === view);
    });
    document.querySelectorAll(".view-section").forEach((section) => {
      section.classList.toggle("active", section.dataset.section === view);
    });
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  };

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      activateView(button.dataset.view);
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

  document.querySelector("[data-print-transcript]").addEventListener("click", () => {
    window.print();
  });

  document.querySelector("[data-transcript-back]").addEventListener("click", () => {
    activateView("grades");
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "transcript") {
    activateView("transcript");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("view") === "transcript" && getSession()?.role === "admin"
    ? getSession()
    : requireSession("ogrenci");
  if (!session) return;

  if (session.role === "ogrenci") {
    document.getElementById("studentName").textContent = session.name;
  }
  setupStudentNavigation();
});
