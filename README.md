# Öğrenci Not Kayıt Sistemi

React ve MySQL tabanlı öğrenci not kayıt sistemi. Projede öğrenci, öğretmen, ders ve not kayıtları için CRUD işlemleri bulunur; MySQL tarafında primary key, foreign key, unique/check/default constraint, index, view, trigger ve stored procedure yapıları hazırlanmıştır.

## Kurulum

1. MySQL Workbench ile `database/ogrenci_not_sistemi_db.sql` dosyasını çalıştırın.
2. `.env.example` dosyasını `.env` olarak kopyalayın ve MySQL kullanıcı bilgilerinizi düzenleyin.
3. Bağımlılıkları kurun:

```bash
npm install
```

4. API sunucusunu başlatın:

```bash
npm run server
```

5. Ayrı bir terminalde React uygulamasını başlatın:

```bash
npm run dev
```

## Giriş Bilgileri

Admin: `admin / admin`

Öğrenci: `ogrenci1 / 123`

Öğretmen: `ogretmen1 / 123`

## ER Diyagram Mantığı

`ogretmenler` tablosu `dersler` tablosuna bire çok bağlıdır. Bir öğretmen birden fazla ders verebilir.

`ogrenciler` tablosu `notlar` tablosuna bire çok bağlıdır. Bir öğrencinin farklı derslerden birden fazla not kaydı olabilir.

`dersler` tablosu `notlar` tablosuna bire çok bağlıdır. Her not kaydı tam olarak bir öğrenciye ve bir derse bağlıdır.

`log_kayitlari` bağımsız denetim tablosudur; trigger’lar insert, update ve delete işlemlerini bu tabloya kaydeder.

## SQL İçeriği

Tüm veritabanı çıktıları tek dosyada toplanmıştır:

`database/ogrenci_not_sistemi_db.sql`

Dosyada sırasıyla database oluşturma, tablolar, indexler, triggerlar, stored procedure’ler, dummy data ve view’lar yer alır.

## Uygulama Yapısı

`server/config/database.js` MySQL bağlantı ayarlarını `.env` üzerinden okur.

`server/server.js` Express API route’larını içerir ve tüm sorguları parametreli şekilde çalıştırır.

`src/services/api.js` React tarafındaki tüm API isteklerini tek noktadan yönetir.

`src/components/AdminPanel.jsx` öğrenci, öğretmen ve ders CRUD işlemlerini MySQL API’ye bağlar.

`src/components/TeacherPanel.jsx` not ekleme, güncelleme ve silme işlemlerini MySQL API’ye bağlar.

`src/components/StudentPanel.jsx` ders ve not listelerini API’den okur; API kapalıysa mevcut demo veriyle çalışmaya devam eder.
