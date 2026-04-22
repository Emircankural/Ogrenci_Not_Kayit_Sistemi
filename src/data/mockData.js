export const gradeRows = [
  { course: "Algoritma ve Programlama", midterm: 82, final: 90, average: 87.0, status: "Geçti" },
  { course: "Veri Tabanı Yönetimi", midterm: 74, final: 80, average: 77.6, status: "Geçti" },
  { course: "Web Teknolojileri", midterm: 91, final: 88, average: 89.2, status: "Geçti" },
  { course: "Lineer Cebir", midterm: 45, final: 52, average: 49.2, status: "Kaldı" },
  { course: "İşletim Sistemleri", midterm: 68, final: 76, average: 72.8, status: "Geçti" },
  { course: "Yazılım Mühendisliği", midterm: 86, final: 84, average: 84.8, status: "Geçti" },
  { course: "Bilgisayar Ağları", midterm: 58, final: 64, average: 61.6, status: "Geçti" },
  { course: "Olasılık ve İstatistik", midterm: 38, final: 48, average: 44.0, status: "Kaldı" }
];

export const studentCourses = [
  { code: "BLM101", name: "Algoritma ve Programlama", teacher: "Dr. Ayşe Kaya", credit: 5, time: "Pzt 09:00" },
  { code: "BLM204", name: "Veri Tabanı Yönetimi", teacher: "Doç. Dr. Mert Aydın", credit: 4, time: "Sal 13:00" },
  { code: "BLM210", name: "Web Teknolojileri", teacher: "Öğr. Gör. Deniz Arslan", credit: 4, time: "Çar 10:00" },
  { code: "MAT112", name: "Lineer Cebir", teacher: "Prof. Dr. Selin Güneş", credit: 3, time: "Per 15:00" },
  { code: "BLM302", name: "İşletim Sistemleri", teacher: "Dr. Kerem Yıldız", credit: 5, time: "Cum 11:00" },
  { code: "BLM330", name: "Yazılım Mühendisliği", teacher: "Doç. Dr. Ece Demir", credit: 4, time: "Pzt 14:00" }
];

export const teacherCourses = [
  { code: "BLM101", name: "Algoritma ve Programlama", students: 42, credit: 5, time: "Pzt 09:00" },
  { code: "BLM210", name: "Web Teknolojileri", students: 36, credit: 4, time: "Çar 10:00" },
  { code: "BLM330", name: "Yazılım Mühendisliği", students: 28, credit: 4, time: "Pzt 14:00" }
];

export const teacherStudents = [
  { id: 1, name: "Ahmet Yılmaz", no: "202401034", course: "Algoritma ve Programlama", midterm: 82, final: 90 },
  { id: 2, name: "Zeynep Demir", no: "202401041", course: "Web Teknolojileri", midterm: 92, final: 91 },
  { id: 3, name: "Emir Kaya", no: "202401052", course: "Yazılım Mühendisliği", midterm: 66, final: 70 },
  { id: 4, name: "Naz Aksoy", no: "202401063", course: "Algoritma ve Programlama", midterm: 38, final: 49 },
  { id: 5, name: "Can Eren", no: "202401074", course: "Web Teknolojileri", midterm: 75, final: 82 }
];

export const adminStudents = [
  { id: 1, name: "Ahmet Yılmaz", no: "202401034", department: "Bilgisayar Mühendisliği", email: "ahmet.yilmaz@kocaeli.edu.tr", year: "2024" },
  { id: 2, name: "Zeynep Demir", no: "202401041", department: "Endüstri Mühendisliği", email: "zeynep.demir@kocaeli.edu.tr", year: "2024" },
  { id: 3, name: "Emir Kaya", no: "202401052", department: "Matematik", email: "emir.kaya@kocaeli.edu.tr", year: "2024" },
  { id: 4, name: "Naz Aksoy", no: "202301087", department: "Bilgisayar Mühendisliği", email: "naz.aksoy@kocaeli.edu.tr", year: "2023" },
  { id: 5, name: "Can Eren", no: "202201019", department: "Elektrik Elektronik Mühendisliği", email: "can.eren@kocaeli.edu.tr", year: "2022" },
  { id: 6, name: "Mina Şahin", no: "202401125", department: "Makine Mühendisliği", email: "mina.sahin@kocaeli.edu.tr", year: "2024" },
  { id: 7, name: "Ege Arslan", no: "202101044", department: "İnşaat Mühendisliği", email: "ege.arslan@kocaeli.edu.tr", year: "2021" },
  { id: 8, name: "Duru Yıldız", no: "202301066", department: "Bilgisayar Mühendisliği", email: "duru.yildiz@kocaeli.edu.tr", year: "2023" },
  { id: 9, name: "Kerem Koç", no: "202201088", department: "Endüstri Mühendisliği", email: "kerem.koc@kocaeli.edu.tr", year: "2022" },
  { id: 10, name: "Lara Öz", no: "202401099", department: "Matematik", email: "lara.oz@kocaeli.edu.tr", year: "2024" }
];

export const adminTeachers = [
  { id: 1, name: "Dr. Ayşe Kaya", registry: "AKD-2187", title: "Dr. Öğr. Üyesi", department: "Bilgisayar Mühendisliği", email: "ayse.kaya@kocaeli.edu.tr" },
  { id: 2, name: "Doç. Dr. Mert Aydın", registry: "AKD-1844", title: "Doç. Dr.", department: "Bilgisayar Mühendisliği", email: "mert.aydin@kocaeli.edu.tr" },
  { id: 3, name: "Prof. Dr. Selin Güneş", registry: "AKD-1022", title: "Prof. Dr.", department: "Matematik", email: "selin.gunes@kocaeli.edu.tr" },
  { id: 4, name: "Öğr. Gör. Deniz Arslan", registry: "AKD-3071", title: "Öğr. Gör.", department: "Bilgisayar Mühendisliği", email: "deniz.arslan@kocaeli.edu.tr" },
  { id: 5, name: "Dr. Kerem Yıldız", registry: "AKD-2260", title: "Dr. Öğr. Üyesi", department: "Elektrik Elektronik Mühendisliği", email: "kerem.yildiz@kocaeli.edu.tr" },
  { id: 6, name: "Doç. Dr. Ece Demir", registry: "AKD-1715", title: "Doç. Dr.", department: "Endüstri Mühendisliği", email: "ece.demir@kocaeli.edu.tr" },
  { id: 7, name: "Prof. Dr. Bora Çelik", registry: "AKD-0994", title: "Prof. Dr.", department: "Makine Mühendisliği", email: "bora.celik@kocaeli.edu.tr" },
  { id: 8, name: "Dr. İrem Polat", registry: "AKD-2521", title: "Dr. Öğr. Üyesi", department: "İnşaat Mühendisliği", email: "irem.polat@kocaeli.edu.tr" }
];

export const adminCourses = [
  { id: 1, name: "Algoritma ve Programlama", code: "BLM101", credit: 5, teacher: "Dr. Ayşe Kaya", department: "Bilgisayar Mühendisliği" },
  { id: 2, name: "Veri Tabanı Yönetimi", code: "BLM204", credit: 4, teacher: "Doç. Dr. Mert Aydın", department: "Bilgisayar Mühendisliği" },
  { id: 3, name: "Lineer Cebir", code: "MAT112", credit: 3, teacher: "Prof. Dr. Selin Güneş", department: "Matematik" },
  { id: 4, name: "Web Teknolojileri", code: "BLM210", credit: 4, teacher: "Öğr. Gör. Deniz Arslan", department: "Bilgisayar Mühendisliği" }
];
