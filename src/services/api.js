const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Sunucu isteği tamamlanamadı.");
  }
  return data;
}

const jsonOptions = (method, body) => ({
  method,
  body: JSON.stringify(body)
});

export const api = {
  login: (payload) => request("/auth/login", jsonOptions("POST", payload)),
  getStats: () => request("/stats"),
  getStudents: () => request("/students"),
  createStudent: (payload) => request("/students", jsonOptions("POST", payload)),
  updateStudent: (id, payload) => request(`/students/${id}`, jsonOptions("PUT", payload)),
  deleteStudent: (id) => request(`/students/${id}`, { method: "DELETE" }),
  getTeachers: () => request("/teachers"),
  createTeacher: (payload) => request("/teachers", jsonOptions("POST", payload)),
  updateTeacher: (id, payload) => request(`/teachers/${id}`, jsonOptions("PUT", payload)),
  deleteTeacher: (id) => request(`/teachers/${id}`, { method: "DELETE" }),
  getCourses: () => request("/courses"),
  createCourse: (payload) => request("/courses", jsonOptions("POST", payload)),
  updateCourse: (id, payload) => request(`/courses/${id}`, jsonOptions("PUT", payload)),
  deleteCourse: (id) => request(`/courses/${id}`, { method: "DELETE" }),
  getGrades: () => request("/grades"),
  createGrade: (payload) => request("/grades", jsonOptions("POST", payload)),
  updateGrade: (id, payload) => request(`/grades/${id}`, jsonOptions("PUT", payload)),
  deleteGrade: (id) => request(`/grades/${id}`, { method: "DELETE" })
};
