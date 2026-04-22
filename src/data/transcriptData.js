export const transcriptStudents = [
  { number: "220101045", name: "Mehmet Demir" },
  { number: "220101046", name: "Zeynep Arslan" },
  { number: "220101047", name: "Burak Çelik" },
  { number: "220101048", name: "Selin Kaya" },
  { number: "220101049", name: "Emre Yıldız" }
];

export const gradeCoefficients = {
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

export const transcriptGradeOptions = Object.keys(gradeCoefficients);

export const transcriptStudentInfo = {
  left: [
    ["Öğrenci No", "220101045"],
    ["Adı", "MEHMET"],
    ["Soyadı", "DEMİR"],
    ["Eğitim Birimi", "Mühendislik Fakültesi"],
    ["Program", "Bilişim Sistemleri Mühendisliği"],
    ["Derece Türü", "Lisans"],
    ["Başarılan AKTS", "142"]
  ],
  right: [
    ["T.C. Kimlik No", "123******89"],
    ["Doğum Tarihi", "05/03/2002"],
    ["Belge Tarihi", "22/04/2026"],
    ["Kayıt Tarihi", "15/09/2020"],
    ["Giriş Türü", "ÖSYS"],
    ["Sınıf/Dönem", "4. Sınıf / 8. Dönem"],
    ["Genel Not Ort.", "2.87"]
  ]
};

export const internshipRows = [
  {
    topic: "—",
    start: "01-07-2024",
    end: "09-08-2024",
    type: "Zorunlu Staj",
    days: "30 İş Günü",
    company: "Yazılım A.Ş.",
    address: "İstanbul"
  }
];

export const transcriptCourses = [
  { semester: 1, code: "1010001", name: "Mühendisliğe Giriş", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BB" },
  { semester: 1, code: "1010002", name: "Algoritma ve Programlama I", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "CC" },
  { semester: 1, code: "1010003", name: "Programlama Lab. I", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "BA" },
  { semester: 1, code: "1010004", name: "İş Sağlığı ve Güvenliği", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "AA" },
  { semester: 1, code: "1010005", name: "Matematik I", status: "Zorunlu", language: "Türkçe", ects: 5, grade: "CB" },
  { semester: 1, code: "1010006", name: "Fizik I", status: "Zorunlu", language: "Türkçe", ects: 5, grade: "CC" },
  { semester: 1, code: "1010007", name: "Türk Dili I", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "BB" },
  { semester: 1, code: "1010008", name: "İngilizce I", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "CB" },
  { semester: 1, code: "1010009", name: "Atatürk İlkeleri I", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "BA" },
  { semester: 2, code: "1010010", name: "Algoritma ve Programlama II", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BA" },
  { semester: 2, code: "1010011", name: "Programlama Lab. II", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "AA" },
  { semester: 2, code: "1010012", name: "Veri Yapıları", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BB" },
  { semester: 2, code: "1010013", name: "Matematik II", status: "Zorunlu", language: "Türkçe", ects: 5, grade: "CC" },
  { semester: 2, code: "1010014", name: "Fizik II", status: "Zorunlu", language: "Türkçe", ects: 5, grade: "CB" },
  { semester: 2, code: "1010015", name: "Türk Dili II", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "BB" },
  { semester: 2, code: "1010016", name: "İngilizce II", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "AA" },
  { semester: 2, code: "1010017", name: "Atatürk İlkeleri II", status: "Zorunlu", language: "Türkçe", ects: 2, grade: "BA" },
  { semester: 2, code: "1010018", name: "Kariyer Planlama", status: "Zorunlu", language: "Türkçe", ects: 0, grade: "G" },
  { semester: 3, code: "1010019", name: "Nesneye Yönelimli Programlama", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "DC" },
  { semester: 3, code: "1010020", name: "Veritabanı Yönetim Sistemleri", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BB" },
  { semester: 3, code: "1010021", name: "Diferansiyel Denklemler", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "FF" },
  { semester: 3, code: "1010022", name: "İstatistik ve Olasılık", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "CC" },
  { semester: 3, code: "1010023", name: "Elektrik Elektronik Devreler", status: "Zorunlu", language: "Türkçe", ects: 5, grade: "CB" },
  { semester: 3, code: "1010024", name: "Lineer Cebir", status: "Zorunlu", language: "Türkçe", ects: 3, grade: "DC" },
  { semester: 4, code: "1010025", name: "Web Programlama", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "AA" },
  { semester: 4, code: "1010026", name: "Bilgisayar Ağları", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BA" },
  { semester: 4, code: "1010027", name: "İşletim Sistemleri", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "BB" },
  { semester: 4, code: "1010028", name: "Yazılım Mühendisliği", status: "Zorunlu", language: "Türkçe", ects: 3, grade: "CB" },
  { semester: 4, code: "1010029", name: "Diferansiyel Denklemler (Tekrar)", status: "Zorunlu", language: "Türkçe", ects: 4, grade: "CC" },
  { semester: 4, code: "1010030", name: "Teknik Seçmeli I", status: "Seçmeli", language: "Türkçe", ects: 3, grade: "BA" }
];

export function cloneTranscriptCourses() {
  return transcriptCourses.map((course, index) => ({ ...course, id: `${course.code}-${index}` }));
}

export function getCourseResult(grade) {
  if (grade === "FF" || grade === "FD" || grade === "VZ") return "Başarısız";
  return gradeCoefficients[grade] > 0 || grade === "G" || grade === "MU" ? "Başarılı" : "Başarısız";
}

export function getGradeClassName(grade) {
  if (grade === "AA" || grade === "BA") return "transcript-grade-high";
  if (grade === "DC" || grade === "DD") return "transcript-grade-warn";
  if (grade === "FF" || grade === "FD" || grade === "VZ") return "transcript-grade-fail";
  return "transcript-grade-neutral";
}

export function groupCoursesBySemester(courses) {
  return courses.reduce((groups, course) => {
    groups[course.semester] = [...(groups[course.semester] || []), course];
    return groups;
  }, {});
}

export function calculateTranscriptSummary(courses) {
  const totalEcts = courses.reduce((sum, course) => sum + Number(course.ects), 0);
  const earnedEcts = courses
    .filter((course) => getCourseResult(course.grade) === "Başarılı")
    .reduce((sum, course) => sum + Number(course.ects), 0);
  const gpaCourses = courses.filter((course) => course.grade !== "FF");
  const gpaEcts = gpaCourses.reduce((sum, course) => sum + Number(course.ects), 0);
  const gpaTotal = gpaCourses.reduce((sum, course) => sum + (gradeCoefficients[course.grade] * Number(course.ects)), 0);

  return {
    totalEcts,
    earnedEcts,
    gpa: gpaEcts ? (gpaTotal / gpaEcts).toFixed(2) : "0.00"
  };
}
