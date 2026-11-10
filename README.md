# Absensi Korlap Subuh

Aplikasi web pencatatan absensi harian untuk tim Koordinator Lapangan (Korlap) Subuh / Ustadz bertugas. Dibangun menggunakan **React + Vite** untuk antarmuka pengguna (*mobile-friendly*) dan **Google Apps Script (GAS) + Google Sheets** sebagai database & API backend tanpa biaya server (*serverless & free*).

---

## Fitur Utama

1. **Form Absensi Harian**:
   - Menampilkan daftar ustadz/petugas yang bertugas sesuai jadwal hari ini secara otomatis.
   - Pilihan status cepat: **Hadir**, **Sakit**, atau **Izin** (wajib mengisi alasan jika Sakit/Izin).
   - Validasi jam operasional (buka, tepat waktu, terlambat, dan tutup).
   - Deteksi otomatis pengisi resmi vs pengisi pengganti.
2. **Dashboard Admin (`/#admin`)**:
   - Proteksi login menggunakan **Email & PIN** (tercatat di Google Sheets).
   - Pantauan absensi hari ini (status kehadiran & waktu kirim).
   - Rekap bulanan dilengkapi ringkasan statistik (Total Hadir, Terlambat, Sakit, Izin).
   - Ekspor rekapitulasi data kehadiran ke format **CSV**.
   - Pengaturan jam operasional (jam buka, batas tepat waktu, dan jam tutup) langsung dari web.

---

## Panduan Instalasi & Setup

### 1. Setup Backend (Google Sheets & Apps Script)

1. Buka [Google Spreadsheet](https://sheets.new) baru di browser Anda.
2. Beri nama spreadsheet, misalnya: **Database Absensi Korlap**.
3. Di menu atas spreadsheet, klik **Ekstensi** > **Apps Script**.
4. Hapus kode bawaan di `Code.gs`, lalu salin seluruh isi file [`Api.gs`](./Api.gs) ke editor Apps Script.
5. **Inisialisasi Database Otomatis**:
   - Pada dropdown fungsi di toolbar atas Apps Script, pilih fungsi **`setupDatabaseAwal`**.
   - Klik tombol **Jalankan (Run)**.
   - Berikan izin akses (*Review permissions*) saat Google meminta otorisasi.
   - Tunggu hingga selesai. Seluruh sheet (`Pengaturan`, `Ustadz`, `Jadwal`, `Absensi`, `Admin`) beserta header kolom dan data awal akan otomatis terbuat di spreadsheet Anda!
6. **Deploy sebagai Web App**:
   - Klik tombol **Terapkan (Deploy)** di pojok kanan atas > **Penerapan baru (New deployment)**.
   - Klik ikon gerigi (Pilih jenis) > pilih **Aplikasi web (Web app)**.
   - Isi deskripsi: `v1`.
   - **Jalankan sebagai (Execute as)**: Pilih **Saya (Me / email Anda)**.
   - **Yang memiliki akses (Who has access)**: Pilih **Siapa saja (Anyone)** *(Penting agar aplikasi React bisa mengakses API)*.
   - Klik **Terapkan (Deploy)**.
   - Salin **URL Aplikasi Web** yang berakhiran `/exec`.

---

### 2. Setup Frontend (React + Vite)

1. Pastikan dependensi sudah terinstall:
   ```bash
   npm install
   ```
2. Buka file [`.env`](./.env), lalu tempelkan URL Web App dari langkah sebelumnya:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```
3. Jalankan server lokal untuk mencoba:
   ```bash
   npm run dev
   ```
4. Buka tautan lokal yang muncul (biasanya `http://localhost:5173`) di browser atau handphone Anda.

---

### 3. Build & Deployment Frontend

Untuk mempublikasikan aplikasi ke hosting publik (seperti **Vercel**, **Netlify**, **Cloudflare Pages**, atau **GitHub Pages**):

1. Buat bundle produksi:
   ```bash
   npm run build
   ```
2. Hasil build akan berada di folder `dist/`.
3. Jika di-deploy ke Vercel/Netlify, hubungkan repository Anda dan atur *Environment Variable* `VITE_API_URL` di dashboard hosting tersebut.

---

## Struktur Database (Google Sheets)

Fungsi `setupDatabaseAwal()` sudah otomatis menyiapkan sheet berikut:

| Sheet | Kolom | Fungsi |
| :--- | :--- | :--- |
| **`Pengaturan`** | `Kunci`, `Nilai`, `Keterangan` | Menyimpan parameter jam buka (`jam_buka`), batas tepat waktu (`jam_batas_tepat`), dan jam tutup (`jam_tutup`). |
| **`Ustadz`** | `ID`, `Nama`, `Kontak` | Master data ustadz / petugas. |
| **`Jadwal`** | `Hari`, `IDUstadz`, `Peran`, `PetugasAbsen` | Penugasan ustadz per hari (Senin - Ahad). |
| **`Absensi`** | `Timestamp`, `Tanggal`, `Hari`, `Nama`, `Keterangan`, `Alasan`, `StatusWaktu`, `DiisiOleh`, `Pengganti` | Riwayat transaksi absensi yang dikirim dari form. |
| **`Admin`** | `Email`, `Nama`, `PIN`, `Aktif` | Akun admin pengelola dashboard (Bawaan: `admin@korlap.com` / PIN: `1234`). |

---

## Kredensial Default Admin

- **Akses Dashboard**: Ketik `/#admin` di akhir URL browser (misal: `http://localhost:5173/#admin`). Tidak ada tautan publik di form agar panel admin tetap tersembunyi.
- **Email**: `admin@korlap.com`
- **PIN**: `1234`
*(Dapat diubah atau ditambah langsung pada sheet `Admin` di Google Spreadsheet Anda)*
