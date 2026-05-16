DROP DATABASE IF EXISTS ogrenci_not_sistemi_db;
CREATE DATABASE ogrenci_not_sistemi_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_turkish_ci;

USE ogrenci_not_sistemi_db;

CREATE TABLE ogrenciler (
  ogrenci_id INT AUTO_INCREMENT,
  ad VARCHAR(60) NOT NULL,
  soyad VARCHAR(60) NOT NULL,
  numara VARCHAR(20) NOT NULL,
  bolum VARCHAR(100) NOT NULL,
  sinif TINYINT NOT NULL DEFAULT 1,
  kayit_tarihi DATE NOT NULL DEFAULT (CURRENT_DATE),
  CONSTRAINT pk_ogrenciler PRIMARY KEY (ogrenci_id),
  CONSTRAINT uk_ogrenciler_numara UNIQUE (numara),
  CONSTRAINT chk_ogrenciler_sinif CHECK (sinif BETWEEN 1 AND 4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE ogretmenler (
  ogretmen_id INT AUTO_INCREMENT,
  ad VARCHAR(60) NOT NULL,
  soyad VARCHAR(60) NOT NULL,
  brans VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  CONSTRAINT pk_ogretmenler PRIMARY KEY (ogretmen_id),
  CONSTRAINT uk_ogretmenler_email UNIQUE (email),
  CONSTRAINT chk_ogretmenler_email CHECK (email LIKE '%@%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE dersler (
  ders_id INT AUTO_INCREMENT,
  ders_adi VARCHAR(120) NOT NULL,
  kredi TINYINT NOT NULL,
  ogretmen_id INT NOT NULL,
  CONSTRAINT pk_dersler PRIMARY KEY (ders_id),
  CONSTRAINT fk_dersler_ogretmenler FOREIGN KEY (ogretmen_id)
    REFERENCES ogretmenler (ogretmen_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_dersler_kredi CHECK (kredi BETWEEN 1 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE notlar (
  not_id INT AUTO_INCREMENT,
  ogrenci_id INT NOT NULL,
  ders_id INT NOT NULL,
  vize DECIMAL(5,2) NOT NULL DEFAULT 0,
  final_notu DECIMAL(5,2) NOT NULL DEFAULT 0,
  ortalama DECIMAL(5,2) NOT NULL DEFAULT 0,
  harf_notu CHAR(2) NOT NULL DEFAULT 'FF',
  CONSTRAINT pk_notlar PRIMARY KEY (not_id),
  CONSTRAINT uk_notlar_ogrenci_ders UNIQUE (ogrenci_id, ders_id),
  CONSTRAINT fk_notlar_ogrenciler FOREIGN KEY (ogrenci_id)
    REFERENCES ogrenciler (ogrenci_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_notlar_dersler FOREIGN KEY (ders_id)
    REFERENCES dersler (ders_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_notlar_vize CHECK (vize BETWEEN 0 AND 100),
  CONSTRAINT chk_notlar_final CHECK (final_notu BETWEEN 0 AND 100),
  CONSTRAINT chk_notlar_ortalama CHECK (ortalama BETWEEN 0 AND 100),
  CONSTRAINT chk_notlar_harf CHECK (harf_notu IN ('AA','BA','BB','CB','CC','DC','DD','FD','FF'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE kullanicilar (
  kullanici_id INT AUTO_INCREMENT,
  kullanici_adi VARCHAR(60) NOT NULL,
  sifre VARCHAR(255) NOT NULL,
  rol ENUM('admin','ogrenci','ogretmen') NOT NULL DEFAULT 'ogrenci',
  CONSTRAINT pk_kullanicilar PRIMARY KEY (kullanici_id),
  CONSTRAINT uk_kullanicilar_kullanici_adi UNIQUE (kullanici_adi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE log_kayitlari (
  log_id INT AUTO_INCREMENT,
  islem_tipi VARCHAR(30) NOT NULL,
  tablo_adi VARCHAR(60) NOT NULL,
  islem_tarihi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_log_kayitlari PRIMARY KEY (log_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE INDEX idx_ogrenciler_numara ON ogrenciler (numara);
CREATE INDEX idx_dersler_ders_adi ON dersler (ders_adi);
CREATE INDEX idx_notlar_ortalama ON notlar (ortalama);

DELIMITER $$

CREATE TRIGGER trg_notlar_bi_hesapla
BEFORE INSERT ON notlar
FOR EACH ROW
BEGIN
  SET NEW.ortalama = ROUND((NEW.vize * 0.40) + (NEW.final_notu * 0.60), 2);
  SET NEW.harf_notu = CASE
    WHEN NEW.ortalama >= 90 THEN 'AA'
    WHEN NEW.ortalama >= 85 THEN 'BA'
    WHEN NEW.ortalama >= 75 THEN 'BB'
    WHEN NEW.ortalama >= 70 THEN 'CB'
    WHEN NEW.ortalama >= 60 THEN 'CC'
    WHEN NEW.ortalama >= 55 THEN 'DC'
    WHEN NEW.ortalama >= 50 THEN 'DD'
    WHEN NEW.ortalama >= 45 THEN 'FD'
    ELSE 'FF'
  END;
END$$

CREATE TRIGGER trg_notlar_bu_hesapla
BEFORE UPDATE ON notlar
FOR EACH ROW
BEGIN
  SET NEW.ortalama = ROUND((NEW.vize * 0.40) + (NEW.final_notu * 0.60), 2);
  SET NEW.harf_notu = CASE
    WHEN NEW.ortalama >= 90 THEN 'AA'
    WHEN NEW.ortalama >= 85 THEN 'BA'
    WHEN NEW.ortalama >= 75 THEN 'BB'
    WHEN NEW.ortalama >= 70 THEN 'CB'
    WHEN NEW.ortalama >= 60 THEN 'CC'
    WHEN NEW.ortalama >= 55 THEN 'DC'
    WHEN NEW.ortalama >= 50 THEN 'DD'
    WHEN NEW.ortalama >= 45 THEN 'FD'
    ELSE 'FF'
  END;
END$$

CREATE TRIGGER trg_ogrenciler_bd_kontrol
BEFORE DELETE ON ogrenciler
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM notlar WHERE ogrenci_id = OLD.ogrenci_id) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Not kaydi bulunan ogrenci silinemez.';
  END IF;
END$$

CREATE TRIGGER trg_ogrenciler_ai_log AFTER INSERT ON ogrenciler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('INSERT', 'ogrenciler');
END$$

CREATE TRIGGER trg_ogrenciler_au_log AFTER UPDATE ON ogrenciler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('UPDATE', 'ogrenciler');
END$$

CREATE TRIGGER trg_ogrenciler_ad_log AFTER DELETE ON ogrenciler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('DELETE', 'ogrenciler');
END$$

CREATE TRIGGER trg_ogretmenler_ai_log AFTER INSERT ON ogretmenler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('INSERT', 'ogretmenler');
END$$

CREATE TRIGGER trg_ogretmenler_au_log AFTER UPDATE ON ogretmenler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('UPDATE', 'ogretmenler');
END$$

CREATE TRIGGER trg_ogretmenler_ad_log AFTER DELETE ON ogretmenler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('DELETE', 'ogretmenler');
END$$

CREATE TRIGGER trg_dersler_ai_log AFTER INSERT ON dersler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('INSERT', 'dersler');
END$$

CREATE TRIGGER trg_dersler_au_log AFTER UPDATE ON dersler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('UPDATE', 'dersler');
END$$

CREATE TRIGGER trg_dersler_ad_log AFTER DELETE ON dersler
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('DELETE', 'dersler');
END$$

CREATE TRIGGER trg_notlar_ai_log AFTER INSERT ON notlar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('INSERT', 'notlar');
END$$

CREATE TRIGGER trg_notlar_au_log AFTER UPDATE ON notlar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('UPDATE', 'notlar');
END$$

CREATE TRIGGER trg_notlar_ad_log AFTER DELETE ON notlar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('DELETE', 'notlar');
END$$

CREATE TRIGGER trg_kullanicilar_ai_log AFTER INSERT ON kullanicilar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('INSERT', 'kullanicilar');
END$$

CREATE TRIGGER trg_kullanicilar_au_log AFTER UPDATE ON kullanicilar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('UPDATE', 'kullanicilar');
END$$

CREATE TRIGGER trg_kullanicilar_ad_log AFTER DELETE ON kullanicilar
FOR EACH ROW BEGIN
  INSERT INTO log_kayitlari (islem_tipi, tablo_adi) VALUES ('DELETE', 'kullanicilar');
END$$

CREATE PROCEDURE ogrenci_ekle(
  IN p_ad VARCHAR(60),
  IN p_soyad VARCHAR(60),
  IN p_numara VARCHAR(20),
  IN p_bolum VARCHAR(100),
  IN p_sinif TINYINT
)
BEGIN
  INSERT INTO ogrenciler (ad, soyad, numara, bolum, sinif)
  VALUES (p_ad, p_soyad, p_numara, p_bolum, p_sinif);
END$$

CREATE PROCEDURE not_hesapla(IN p_not_id INT)
BEGIN
  UPDATE notlar
  SET
    ortalama = ROUND((vize * 0.40) + (final_notu * 0.60), 2),
    harf_notu = CASE
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 90 THEN 'AA'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 85 THEN 'BA'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 75 THEN 'BB'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 70 THEN 'CB'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 60 THEN 'CC'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 55 THEN 'DC'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 50 THEN 'DD'
      WHEN ROUND((vize * 0.40) + (final_notu * 0.60), 2) >= 45 THEN 'FD'
      ELSE 'FF'
    END
  WHERE not_id = p_not_id;
END$$

CREATE PROCEDURE ogrenci_notlarini_getir(IN p_ogrenci_id INT)
BEGIN
  SELECT
    o.ogrenci_id,
    CONCAT(o.ad, ' ', o.soyad) AS ogrenci_ad_soyad,
    o.numara,
    d.ders_adi,
    n.vize,
    n.final_notu,
    n.ortalama,
    n.harf_notu
  FROM notlar n
  INNER JOIN ogrenciler o ON o.ogrenci_id = n.ogrenci_id
  INNER JOIN dersler d ON d.ders_id = n.ders_id
  WHERE o.ogrenci_id = p_ogrenci_id
  ORDER BY d.ders_adi;
END$$

CREATE PROCEDURE ders_ortalama_hesapla(IN p_ders_id INT)
BEGIN
  SELECT
    d.ders_id,
    d.ders_adi,
    COUNT(n.not_id) AS kayit_sayisi,
    ROUND(AVG(n.ortalama), 2) AS ders_ortalamasi
  FROM dersler d
  LEFT JOIN notlar n ON n.ders_id = d.ders_id
  WHERE d.ders_id = p_ders_id
  GROUP BY d.ders_id, d.ders_adi;
END$$

DELIMITER ;

INSERT INTO ogretmenler (ad, soyad, brans, email) VALUES
('Ayşe', 'Kaya', 'Algoritma ve Programlama', 'ayse.kaya@kocaeli.edu.tr'),
('Mert', 'Aydın', 'Veri Tabanı Yönetimi', 'mert.aydin@kocaeli.edu.tr'),
('Selin', 'Güneş', 'Lineer Cebir', 'selin.gunes@kocaeli.edu.tr'),
('Deniz', 'Arslan', 'Web Teknolojileri', 'deniz.arslan@kocaeli.edu.tr'),
('Kerem', 'Yıldız', 'İşletim Sistemleri', 'kerem.yildiz@kocaeli.edu.tr'),
('Ece', 'Demir', 'Yazılım Mühendisliği', 'ece.demir@kocaeli.edu.tr'),
('Bora', 'Çelik', 'Makine Öğrenmesi', 'bora.celik@kocaeli.edu.tr'),
('İrem', 'Polat', 'Bilgisayar Ağları', 'irem.polat@kocaeli.edu.tr'),
('Onur', 'Şahin', 'Siber Güvenlik', 'onur.sahin@kocaeli.edu.tr'),
('Elif', 'Koç', 'Olasılık ve İstatistik', 'elif.koc@kocaeli.edu.tr');

INSERT INTO ogrenciler (ad, soyad, numara, bolum, sinif, kayit_tarihi) VALUES
('Ahmet', 'Yılmaz', '202401034', 'Bilgisayar Mühendisliği', 1, '2024-09-16'),
('Zeynep', 'Demir', '202401041', 'Endüstri Mühendisliği', 1, '2024-09-16'),
('Emir', 'Kaya', '202401052', 'Matematik', 1, '2024-09-17'),
('Naz', 'Aksoy', '202301087', 'Bilgisayar Mühendisliği', 2, '2023-09-18'),
('Can', 'Eren', '202201019', 'Elektrik Elektronik Mühendisliği', 3, '2022-09-19'),
('Mina', 'Şahin', '202401125', 'Makine Mühendisliği', 1, '2024-09-16'),
('Ege', 'Arslan', '202101044', 'İnşaat Mühendisliği', 4, '2021-09-20'),
('Duru', 'Yıldız', '202301066', 'Bilgisayar Mühendisliği', 2, '2023-09-18'),
('Kerem', 'Koç', '202201088', 'Endüstri Mühendisliği', 3, '2022-09-19'),
('Lara', 'Öz', '202401099', 'Matematik', 1, '2024-09-17');

INSERT INTO dersler (ders_adi, kredi, ogretmen_id) VALUES
('Algoritma ve Programlama', 5, 1),
('Veri Tabanı Yönetimi', 4, 2),
('Lineer Cebir', 3, 3),
('Web Teknolojileri', 4, 4),
('İşletim Sistemleri', 5, 5),
('Yazılım Mühendisliği', 4, 6),
('Makine Öğrenmesi', 4, 7),
('Bilgisayar Ağları', 4, 8),
('Siber Güvenlik', 3, 9),
('Olasılık ve İstatistik', 3, 10);

INSERT INTO notlar (ogrenci_id, ders_id, vize, final_notu) VALUES
(1, 1, 82, 90),
(1, 2, 74, 80),
(2, 4, 91, 88),
(3, 3, 45, 52),
(4, 5, 68, 76),
(5, 6, 86, 84),
(6, 8, 58, 64),
(7, 10, 38, 48),
(8, 1, 92, 91),
(9, 2, 66, 70),
(10, 3, 79, 83);

INSERT INTO kullanicilar (kullanici_adi, sifre, rol) VALUES
('admin', 'admin', 'admin'),
('ogrenci1', '123', 'ogrenci'),
('ogrenci2', '123', 'ogrenci'),
('ogrenci3', '123', 'ogrenci'),
('ogrenci4', '123', 'ogrenci'),
('ogretmen1', '123', 'ogretmen'),
('ogretmen2', '123', 'ogretmen'),
('ogretmen3', '123', 'ogretmen'),
('memur1', '123', 'admin'),
('koordinator', '123', 'admin');

INSERT INTO log_kayitlari (islem_tipi, tablo_adi, islem_tarihi) VALUES
('SYSTEM', 'kurulum', '2026-05-16 09:00:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:01:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:02:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:03:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:04:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:05:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:06:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:07:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:08:00'),
('SYSTEM', 'kurulum', '2026-05-16 09:09:00');

CREATE VIEW ogrenci_not_ortalamalari AS
SELECT
  o.ogrenci_id,
  CONCAT(o.ad, ' ', o.soyad) AS ogrenci_ad_soyad,
  o.numara,
  o.bolum,
  ROUND(AVG(n.ortalama), 2) AS genel_ortalama,
  COUNT(n.not_id) AS not_kayit_sayisi
FROM ogrenciler o
LEFT JOIN notlar n ON n.ogrenci_id = o.ogrenci_id
GROUP BY o.ogrenci_id, o.ad, o.soyad, o.numara, o.bolum;

CREATE VIEW basarisiz_ogrenciler AS
SELECT
  o.ogrenci_id,
  CONCAT(o.ad, ' ', o.soyad) AS ogrenci_ad_soyad,
  o.numara,
  d.ders_adi,
  n.ortalama,
  n.harf_notu
FROM notlar n
INNER JOIN ogrenciler o ON o.ogrenci_id = n.ogrenci_id
INNER JOIN dersler d ON d.ders_id = n.ders_id
WHERE n.ortalama < 50;

CREATE VIEW ders_bazli_basarilar AS
SELECT
  d.ders_id,
  d.ders_adi,
  CONCAT(og.ad, ' ', og.soyad) AS ogretmen_ad_soyad,
  COUNT(n.not_id) AS ogrenci_sayisi,
  ROUND(AVG(n.ortalama), 2) AS ders_ortalamasi,
  SUM(CASE WHEN n.ortalama >= 50 THEN 1 ELSE 0 END) AS basarili_sayisi,
  SUM(CASE WHEN n.ortalama < 50 THEN 1 ELSE 0 END) AS basarisiz_sayisi
FROM dersler d
INNER JOIN ogretmenler og ON og.ogretmen_id = d.ogretmen_id
LEFT JOIN notlar n ON n.ders_id = d.ders_id
GROUP BY d.ders_id, d.ders_adi, og.ad, og.soyad;
