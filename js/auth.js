const DEMO_USERS = {
  ogrenci: {
    username: "ogrenci1",
    password: "123",
    name: "Ahmet Yılmaz",
    page: "ogrenci.html"
  },
  ogretmen: {
    username: "ogretmen1",
    password: "123",
    name: "Dr. Ayşe Kaya",
    page: "ogretmen.html"
  },
  admin: {
    username: "admin",
    password: "admin",
    name: "Admin",
    page: "admin.html"
  }
};

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("notKayitSession"));
  } catch (error) {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem("notKayitSession", JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem("notKayitSession");
}

function redirectByRole(role) {
  const user = DEMO_USERS[role];
  if (user) {
    window.location.href = user.page;
  }
}

function requireSession(expectedRole) {
  const session = getSession();
  if (!session || session.role !== expectedRole) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

function attemptLogin(role, username, password) {
  const cleanUsername = username.trim();

  if (cleanUsername === DEMO_USERS.admin.username && password === DEMO_USERS.admin.password) {
    setSession({ role: "admin", name: DEMO_USERS.admin.name });
    redirectByRole("admin");
    return { ok: true };
  }

  const user = DEMO_USERS[role];
  if (user && cleanUsername === user.username && password === user.password) {
    setSession({ role, name: user.name });
    redirectByRole(role);
    return { ok: true };
  }

  return { ok: false, message: "Kullanıcı adı veya şifre hatalı." };
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3000);
}

function setupLogoutButtons() {
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", logout);
  });
}

function setupLoginPage() {
  const loginCard = document.getElementById("loginCard");
  const roleSelection = document.getElementById("roleSelection");
  const loginForm = document.getElementById("loginForm");
  const loginTitle = document.getElementById("loginTitle");
  const backToRoles = document.getElementById("backToRoles");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("loginError");
  let selectedRole = "";

  const existingSession = getSession();
  if (existingSession && DEMO_USERS[existingSession.role]) {
    redirectByRole(existingSession.role);
    return;
  }

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRole = button.dataset.role;
      roleSelection.style.display = "none";
      loginForm.classList.add("is-visible");
      loginTitle.textContent = selectedRole === "ogrenci" ? "Öğrenci Girişi" : "Öğretmen Girişi";
      errorMessage.textContent = "";
      usernameInput.value = "";
      passwordInput.value = "";
      usernameInput.focus();
    });
  });

  backToRoles.addEventListener("click", () => {
    selectedRole = "";
    loginForm.classList.remove("is-visible");
    roleSelection.style.display = "grid";
    errorMessage.textContent = "";
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = attemptLogin(selectedRole, usernameInput.value, passwordInput.value);

    if (!result.ok) {
      errorMessage.textContent = result.message;
      loginCard.classList.remove("shake");
      void loginCard.offsetWidth;
      loginCard.classList.add("shake");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) {
    setupLoginPage();
  }
  setupLogoutButtons();
});
