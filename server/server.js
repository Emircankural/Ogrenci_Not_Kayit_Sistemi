const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");

const app = express();
const port = Number(process.env.API_PORT || 3001);
const allowedOrigins = new Set([
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  }
}));
app.use(express.json());

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const required = (value) => value !== undefined && value !== null && String(value).trim() !== "";
const validScore = (value) => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100;

function splitFullName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { ad: parts[0] || "", soyad: "" };
  return { ad: parts.slice(0, -1).join(" "), soyad: parts.at(-1) };
}

function studentDateFromYear(year) {
  const cleanYear = String(year || "").trim();
  return /^\d{4}$/.test(cleanYear) ? `${cleanYear}-09-16` : undefined;
}

function sendValidation(res, message) {
  return res.status(400).json({ message });
}

const clean = (value) => String(value || "").trim();
const defaultPassword = (password) => clean(password) || "123";
const teacherUsername = ({ email }) => clean(email);

async function upsertLoginAccount(connection, username, password, role, previousUsername = username) {
  const nextUsername = clean(username);
  if (!nextUsername) return;

  const params = [nextUsername, defaultPassword(password), role];
  if (previousUsername && clean(previousUsername) !== nextUsername) {
    const [result] = await connection.execute(
      "UPDATE kullanicilar SET kullanici_adi = ?, sifre = ?, rol = ? WHERE kullanici_adi = ? AND rol = ?",
      [...params, clean(previousUsername), role]
    );
    if (result.affectedRows > 0) return;
  }

  if (password !== undefined && clean(password) !== "") {
    await connection.execute(
      "INSERT INTO kullanicilar (kullanici_adi, sifre, rol) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE sifre = VALUES(sifre), rol = VALUES(rol)",
      params
    );
    return;
  }

  await connection.execute(
    "INSERT INTO kullanicilar (kullanici_adi, sifre, rol) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rol = VALUES(rol)",
    params
  );
}

app.get("/api/health", asyncRoute(async (_req, res) => {
  await db.query("SELECT 1");
  res.json({ ok: true, database: process.env.DB_NAME || "ogrenci_not_sistemi_db" });
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const { role, username, password } = req.body;
  if (!required(username) || !required(password)) return sendValidation(res, "Kullanıcı adı ve şifre zorunludur.");

  const [rows] = await db.execute(
    "SELECT kullanici_id, kullanici_adi, rol FROM kullanicilar WHERE kullanici_adi = ? AND sifre = ? AND (? = '' OR rol = ?) LIMIT 1",
    [String(username).trim(), String(password), role || "", role || ""]
  );

  if (rows.length === 0) return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı." });
  const account = rows[0];
  res.json({ id: account.kullanici_id, username: account.kullanici_adi, role: account.rol, name: account.kullanici_adi });
}));

app.get("/api/stats", asyncRoute(async (_req, res) => {
  const [[students], [teachers], [courses], [grades]] = await Promise.all([
    db.query("SELECT COUNT(*) AS total FROM ogrenciler"),
    db.query("SELECT COUNT(*) AS total FROM ogretmenler"),
    db.query("SELECT COUNT(*) AS total FROM dersler"),
    db.query("SELECT ROUND(AVG(ortalama), 2) AS averageGrade FROM notlar")
  ]);

  res.json({
    studentCount: students[0].total,
    teacherCount: teachers[0].total,
    courseCount: courses[0].total,
    averageGrade: grades[0].averageGrade || 0
  });
}));

app.get("/api/students", asyncRoute(async (_req, res) => {
  const [rows] = await db.query(`
    SELECT
      ogrenci_id AS id,
      CONCAT(ad, ' ', soyad) AS name,
      numara AS no,
      bolum AS department,
      sinif AS classLevel,
      YEAR(kayit_tarihi) AS year,
      kayit_tarihi AS registeredAt
    FROM ogrenciler
    ORDER BY ogrenci_id DESC
  `);
  res.json(rows);
}));

app.post("/api/students", asyncRoute(async (req, res) => {
  const { name, no, department, year, classLevel, password } = req.body;
  if (!required(name) || !required(no) || !required(department)) return sendValidation(res, "Ad soyad, öğrenci no ve bölüm zorunludur.");

  const { ad, soyad } = splitFullName(name);
  if (!soyad) return sendValidation(res, "Ad soyad alanı en az iki kelime olmalıdır.");

  const kayitTarihi = studentDateFromYear(year);
  const sinif = Number(classLevel || 1);
  if (!Number.isInteger(sinif) || sinif < 1 || sinif > 4) return sendValidation(res, "Sınıf 1 ile 4 arasında olmalıdır.");

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO ogrenciler (ad, soyad, numara, bolum, sinif, kayit_tarihi) VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE))",
      [ad, soyad, clean(no), clean(department), sinif, kayitTarihi]
    );
    await upsertLoginAccount(connection, no, password, "ogrenci");
    const [[created]] = await connection.query("SELECT ogrenci_id AS id, CONCAT(ad, ' ', soyad) AS name, numara AS no, bolum AS department, sinif AS classLevel, YEAR(kayit_tarihi) AS year FROM ogrenciler WHERE ogrenci_id = ?", [result.insertId]);
    await connection.commit();
    res.status(201).json(created);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.put("/api/students/:id", asyncRoute(async (req, res) => {
  const { name, no, department, year, classLevel, password } = req.body;
  if (!required(name) || !required(no) || !required(department)) return sendValidation(res, "Ad soyad, öğrenci no ve bölüm zorunludur.");

  const { ad, soyad } = splitFullName(name);
  if (!soyad) return sendValidation(res, "Ad soyad alanı en az iki kelime olmalıdır.");

  const kayitTarihi = studentDateFromYear(year);
  const sinif = Number(classLevel || 1);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[existing]] = await connection.query("SELECT numara FROM ogrenciler WHERE ogrenci_id = ?", [req.params.id]);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ message: "Öğrenci bulunamadı." });
    }
    const [result] = await connection.execute(
      "UPDATE ogrenciler SET ad = ?, soyad = ?, numara = ?, bolum = ?, sinif = ?, kayit_tarihi = COALESCE(?, kayit_tarihi) WHERE ogrenci_id = ?",
      [ad, soyad, clean(no), clean(department), sinif, kayitTarihi, req.params.id]
    );
    await upsertLoginAccount(connection, no, password, "ogrenci", existing.numara);
    await connection.commit();
    if (result.affectedRows === 0) return res.status(404).json({ message: "Öğrenci bulunamadı." });
    res.json({ id: Number(req.params.id), name, no, department, year, classLevel: sinif });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.delete("/api/students/:id", asyncRoute(async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[existing]] = await connection.query("SELECT numara FROM ogrenciler WHERE ogrenci_id = ?", [req.params.id]);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ message: "Öğrenci bulunamadı." });
    }
    const [result] = await connection.execute("DELETE FROM ogrenciler WHERE ogrenci_id = ?", [req.params.id]);
    await connection.execute("DELETE FROM kullanicilar WHERE kullanici_adi = ? AND rol = 'ogrenci'", [existing.numara]);
    await connection.commit();
    if (result.affectedRows === 0) return res.status(404).json({ message: "Öğrenci bulunamadı." });
    res.status(204).end();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.get("/api/teachers", asyncRoute(async (_req, res) => {
  const [rows] = await db.query(`
    SELECT
      ogretmen_id AS id,
      CONCAT(ad, ' ', soyad) AS name,
      CONCAT('AKD-', LPAD(ogretmen_id, 4, '0')) AS registry,
      brans AS department,
      brans AS title,
      email
    FROM ogretmenler
    ORDER BY ogretmen_id DESC
  `);
  res.json(rows);
}));

app.post("/api/teachers", asyncRoute(async (req, res) => {
  const { name, email, department, title, password } = req.body;
  if (!required(name) || !required(email) || !required(department)) return sendValidation(res, "Ad soyad, e-posta ve bölüm zorunludur.");

  const { ad, soyad } = splitFullName(name);
  if (!soyad) return sendValidation(res, "Ad soyad alanı en az iki kelime olmalıdır.");
  const brans = String(department || title).trim();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute("INSERT INTO ogretmenler (ad, soyad, brans, email) VALUES (?, ?, ?, ?)", [ad, soyad, brans, clean(email)]);
    const generatedRegistry = `AKD-${String(result.insertId).padStart(4, "0")}`;
    const username = teacherUsername({ email });
    await upsertLoginAccount(connection, username, password, "ogretmen");
    await connection.commit();
    res.status(201).json({ id: result.insertId, name, registry: generatedRegistry, title: brans, department: brans, email });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.put("/api/teachers/:id", asyncRoute(async (req, res) => {
  const { name, email, department, title, password } = req.body;
  if (!required(name) || !required(email) || !required(department)) return sendValidation(res, "Ad soyad, e-posta ve bölüm zorunludur.");

  const { ad, soyad } = splitFullName(name);
  if (!soyad) return sendValidation(res, "Ad soyad alanı en az iki kelime olmalıdır.");
  const brans = String(department || title).trim();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[existing]] = await connection.query("SELECT email FROM ogretmenler WHERE ogretmen_id = ?", [req.params.id]);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ message: "Öğretmen bulunamadı." });
    }
    const oldGeneratedRegistry = `AKD-${String(req.params.id).padStart(4, "0")}`;
    const [result] = await connection.execute("UPDATE ogretmenler SET ad = ?, soyad = ?, brans = ?, email = ? WHERE ogretmen_id = ?", [ad, soyad, brans, clean(email), req.params.id]);
    const username = teacherUsername({ email });
    await upsertLoginAccount(connection, username, password, "ogretmen", existing.email);
    await connection.commit();
    if (result.affectedRows === 0) return res.status(404).json({ message: "Öğretmen bulunamadı." });
    res.json({ id: Number(req.params.id), name, registry: oldGeneratedRegistry, title: brans, department: brans, email });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.delete("/api/teachers/:id", asyncRoute(async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[existing]] = await connection.query("SELECT email FROM ogretmenler WHERE ogretmen_id = ?", [req.params.id]);
    if (!existing) {
      await connection.rollback();
      return res.status(404).json({ message: "Öğretmen bulunamadı." });
    }
    const [result] = await connection.execute("DELETE FROM ogretmenler WHERE ogretmen_id = ?", [req.params.id]);
    await connection.execute("DELETE FROM kullanicilar WHERE rol = 'ogretmen' AND kullanici_adi = ?", [existing.email]);
    await connection.commit();
    if (result.affectedRows === 0) return res.status(404).json({ message: "Öğretmen bulunamadı." });
    res.status(204).end();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.get("/api/courses", asyncRoute(async (_req, res) => {
  const [rows] = await db.query(`
    SELECT
      d.ders_id AS id,
      d.ders_adi AS name,
      CONCAT('DERS-', LPAD(d.ders_id, 3, '0')) AS code,
      d.kredi AS credit,
      d.ogretmen_id AS teacherId,
      CONCAT(o.ad, ' ', o.soyad) AS teacher,
      o.brans AS department
    FROM dersler d
    INNER JOIN ogretmenler o ON o.ogretmen_id = d.ogretmen_id
    ORDER BY d.ders_id DESC
  `);
  res.json(rows);
}));

app.post("/api/courses", asyncRoute(async (req, res) => {
  const { name, credit, teacherId, teacher } = req.body;
  if (!required(name) || !required(credit)) return sendValidation(res, "Ders adı ve kredi zorunludur.");
  const resolvedTeacherId = teacherId || await findTeacherIdByName(teacher);
  if (!resolvedTeacherId) return sendValidation(res, "Geçerli bir öğretmen seçiniz.");

  const [result] = await db.execute("INSERT INTO dersler (ders_adi, kredi, ogretmen_id) VALUES (?, ?, ?)", [String(name).trim(), Number(credit), resolvedTeacherId]);
  res.status(201).json({ id: result.insertId, name, code: `DERS-${String(result.insertId).padStart(3, "0")}`, credit: Number(credit), teacherId: resolvedTeacherId, teacher });
}));

app.put("/api/courses/:id", asyncRoute(async (req, res) => {
  const { name, credit, teacherId, teacher } = req.body;
  if (!required(name) || !required(credit)) return sendValidation(res, "Ders adı ve kredi zorunludur.");
  const resolvedTeacherId = teacherId || await findTeacherIdByName(teacher);
  if (!resolvedTeacherId) return sendValidation(res, "Geçerli bir öğretmen seçiniz.");

  const [result] = await db.execute("UPDATE dersler SET ders_adi = ?, kredi = ?, ogretmen_id = ? WHERE ders_id = ?", [String(name).trim(), Number(credit), resolvedTeacherId, req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Ders bulunamadı." });
  res.json({ id: Number(req.params.id), name, code: `DERS-${String(req.params.id).padStart(3, "0")}`, credit: Number(credit), teacherId: resolvedTeacherId, teacher });
}));

app.delete("/api/courses/:id", asyncRoute(async (req, res) => {
  const [result] = await db.execute("DELETE FROM dersler WHERE ders_id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Ders bulunamadı." });
  res.status(204).end();
}));

app.get("/api/grades", asyncRoute(async (_req, res) => {
  const [rows] = await db.query(`
    SELECT
      n.not_id AS id,
      n.ogrenci_id AS studentId,
      CONCAT(o.ad, ' ', o.soyad) AS name,
      o.numara AS no,
      n.ders_id AS courseId,
      d.ders_adi AS course,
      n.vize AS midterm,
      n.final_notu AS final,
      n.ortalama AS average,
      n.harf_notu AS letterGrade
    FROM notlar n
    INNER JOIN ogrenciler o ON o.ogrenci_id = n.ogrenci_id
    INNER JOIN dersler d ON d.ders_id = n.ders_id
    ORDER BY n.not_id DESC
  `);
  res.json(rows);
}));

app.post("/api/grades", asyncRoute(async (req, res) => {
  const { studentId, courseId, midterm, final } = req.body;
  if (!studentId || !courseId || !validScore(midterm) || !validScore(final)) return sendValidation(res, "Öğrenci, ders, vize ve final 0-100 aralığında olmalıdır.");
  const [result] = await db.execute("INSERT INTO notlar (ogrenci_id, ders_id, vize, final_notu) VALUES (?, ?, ?, ?)", [studentId, courseId, Number(midterm), Number(final)]);
  res.status(201).json({ id: result.insertId });
}));

app.put("/api/grades/:id", asyncRoute(async (req, res) => {
  const { midterm, final } = req.body;
  if (!validScore(midterm) || !validScore(final)) return sendValidation(res, "Vize ve final 0-100 aralığında olmalıdır.");
  const [result] = await db.execute("UPDATE notlar SET vize = ?, final_notu = ? WHERE not_id = ?", [Number(midterm), Number(final), req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Not kaydı bulunamadı." });
  res.json({ id: Number(req.params.id), midterm: Number(midterm), final: Number(final) });
}));

app.delete("/api/grades/:id", asyncRoute(async (req, res) => {
  const [result] = await db.execute("DELETE FROM notlar WHERE not_id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Not kaydı bulunamadı." });
  res.status(204).end();
}));

app.get("/api/logs", asyncRoute(async (_req, res) => {
  const [rows] = await db.query("SELECT log_id AS id, islem_tipi AS operation, tablo_adi AS tableName, islem_tarihi AS createdAt FROM log_kayitlari ORDER BY log_id DESC LIMIT 100");
  res.json(rows);
}));

async function findTeacherIdByName(name) {
  if (!required(name)) return null;
  const [rows] = await db.execute("SELECT ogretmen_id AS id FROM ogretmenler WHERE CONCAT(ad, ' ', soyad) = ? LIMIT 1", [String(name).trim()]);
  return rows[0]?.id || null;
}

app.use((err, _req, res, _next) => {
  const message = err.sqlMessage || err.message || "Beklenmeyen bir hata oluştu.";
  const status = err.code === "ER_DUP_ENTRY" || err.sqlState === "45000" ? 400 : 500;
  res.status(status).json({ message });
});

app.listen(port, () => {
  console.log(`API server http://localhost:${port} adresinde çalışıyor.`);
});
