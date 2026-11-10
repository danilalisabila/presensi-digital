/** 
 * API Absensi Korlap Subuh
 * Tempelkan file ini di Google Apps Script (Extensions > Apps Script) pada Google Spreadsheet Anda.
 */

const TZ = 'Asia/Jakarta';
const HARI = [null, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];
const ss_ = () => SpreadsheetApp.getActiveSpreadsheet();
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function baca_(nama) {
  const sh = ss_().getSheetByName(nama);
  if (!sh) throw new Error('Sheet "' + nama + '" tidak ditemukan. Jalankan fungsi setupDatabaseAwal() di Apps Script.');
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return [];
  const h = v.shift();
  return v.filter(r => r[0] !== '').map(r => { const o = {}; h.forEach((k, i) => o[k] = r[i]); return o; });
}

function jam_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ, 'HH:mm') : String(v).trim(); }

function atur_() { 
  const o = {}; 
  baca_('Pengaturan').forEach(r => o[r.Kunci] = jam_(r.Nilai)); 
  return o; 
}

function sekarang_() {
  const n = new Date();
  return { 
    n, 
    hari: HARI[+Utilities.formatDate(n, TZ, 'u')], 
    tgl: Utilities.formatDate(n, TZ, 'yyyy-MM-dd'), 
    jam: Utilities.formatDate(n, TZ, 'HH:mm') 
  };
}

function tim_(hari) {
  const u = {}; 
  baca_('Ustadz').forEach(r => u[r.ID] = r.Nama);
  return baca_('Jadwal').filter(r => r.Hari === hari)
    .map(r => ({ nama: u[r.IDUstadz] || r.IDUstadz, peran: r.Peran, petugas: r.PetugasAbsen === 'Ya' }));
}

function sudah_(tgl) {
  return baca_('Absensi').some(r => r.Tanggal instanceof Date && Utilities.formatDate(r.Tanggal, TZ, 'yyyy-MM-dd') === tgl);
}

// Endpoint GET: Info hari ini untuk halaman form absensi
function doGet() {
  try {
    const s = sekarang_(), a = atur_();
    return out_({
      hari: s.hari, 
      tanggal: s.tgl, 
      jam: s.jam, 
      buka: a.jam_buka || '04:15', 
      batas: a.jam_batas_tepat || '04:45', 
      tutup: a.jam_tutup || '05:30',
      status: s.jam < a.jam_buka ? 'belum' : s.jam > a.jam_tutup ? 'tutup' : 'buka',
      sudah: sudah_(s.tgl), 
      tim: tim_(s.hari)
    });
  } catch (x) {
    return out_({ error: x.message });
  }
}

// Endpoint POST: Kirim absen, login admin, ambil data rekap, simpan pengaturan
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Permintaan data tidak valid');
    }
    const d = JSON.parse(e.postData.contents);
    const f = { kirim: kirim_, login: login_, data: data_, simpan: simpan_ }[d.aksi];
    if (!f) throw new Error('Aksi tidak dikenal');
    return out_(f(d));
  } catch (x) { 
    return out_({ error: x.message }); 
  }
}

function kirim_(d) {
  const lock = LockService.getScriptLock(); 
  lock.waitLock(20000);
  try {
    const s = sekarang_(), a = atur_();
    if (s.jam < a.jam_buka) throw new Error('Absen belum dibuka (mulai ' + a.jam_buka + ')');
    if (s.jam > a.jam_tutup) throw new Error('Absen sudah ditutup (' + a.jam_tutup + ')');
    if (sudah_(s.tgl)) throw new Error('Absen hari ini sudah dikirim');
    
    const tim = tim_(s.hari);
    if (!tim.some(t => t.nama === d.pengisi)) throw new Error('Pengisi tidak termasuk tim hari ini');
    
    const resmi = tim.find(t => t.petugas);
    const status = s.jam <= a.jam_batas_tepat ? 'Tepat Waktu' : 'Terlambat';
    const tgl = new Date(s.tgl + 'T00:00:00+07:00');
    
    const rows = tim.map(t => {
      const i = (d.items || []).find(x => x.nama === t.nama);
      if (!i || ['Hadir', 'Sakit', 'Izin', 'Alfa'].indexOf(i.ket) < 0) throw new Error('Data ' + t.nama + ' tidak lengkap');
      const al = (i.ket === 'Hadir' || i.ket === 'Alfa') ? '' : String(i.alasan || '').trim();
      if ((i.ket === 'Sakit' || i.ket === 'Izin') && !al) throw new Error('Alasan ' + t.nama + ' wajib diisi');
      return [s.n, tgl, s.hari, t.nama, i.ket, al, status, d.pengisi, resmi && resmi.nama === d.pengisi ? 'Tidak' : 'Ya'];
    });
    
    const sh = ss_().getSheetByName('Absensi');
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, 9).setValues(rows);
    return { ok: true, status, jam: s.jam };
  } finally { 
    lock.releaseLock(); 
  }
}

function login_(d) {
  const c = CacheService.getScriptCache();
  const em = String(d.email || '').trim().toLowerCase();
  const k = 'gagal_' + em;
  
  if (+c.get(k) >= 5) throw new Error('Terlalu banyak percobaan. Coba lagi 15 menit.');
  
  const ad = baca_('Admin').find(r => String(r.Email).toLowerCase() === em && r.Aktif === 'Ya' && String(r.PIN) === String(d.pin));
  if (!ad) { 
    c.put(k, String(+c.get(k) + 1), 900); 
    throw new Error('Email atau PIN salah'); 
  }
  
  c.remove(k);
  const t = Utilities.getUuid(); 
  c.put('tok_' + t, em, 21600); // sesi 6 jam
  return { token: t, nama: ad.Nama };
}

function cek_(t) { 
  if (!t || !CacheService.getScriptCache().get('tok_' + t)) {
    throw new Error('Sesi habis, silakan login lagi'); 
  }
}

function data_(d) {
  cek_(d.token);
  const s = sekarang_();
  const rows = baca_('Absensi').map(r => ({
    tanggal: r.Tanggal instanceof Date ? Utilities.formatDate(r.Tanggal, TZ, 'yyyy-MM-dd') : String(r.Tanggal),
    jam: r.Timestamp instanceof Date ? Utilities.formatDate(r.Timestamp, TZ, 'HH:mm') : String(r.Timestamp),
    hari: r.Hari, 
    nama: r.Nama, 
    ket: r.Keterangan, 
    alasan: r.Alasan, 
    waktu: r.StatusWaktu, 
    pengisi: r.DiisiOleh, 
    pengganti: r.Pengganti
  })).slice(-1500);
  
  return { rows, atur: atur_(), hari: s.hari, tgl: s.tgl, tim: tim_(s.hari) };
}

function simpan_(d) {
  cek_(d.token);
  const sh = ss_().getSheetByName('Pengaturan');
  if (!sh) throw new Error('Sheet "Pengaturan" tidak ditemukan');
  
  const v = sh.getDataRange().getValues();
  ['jam_buka', 'jam_batas_tepat', 'jam_tutup'].forEach(k => {
    const x = String(d.atur[k]);
    if (!/^\d\d:\d\d$/.test(x)) throw new Error('Format jam harus JJ:MM');
    const i = v.findIndex(r => r[0] === k);
    if (i !== -1) sh.getRange(i + 1, 2).setValue(x);
  });
  
  return { ok: true, pesan: 'Pengaturan jam berhasil diperbarui' };
}

/**
 * ========================================================
 * FUNGSI SETUP DATABASE OTOMATIS
 * Jalankan fungsi ini 1x di editor Apps Script (Pilih setupDatabaseAwal -> Klik Run)
 * ========================================================
 */
function setupDatabaseAwal() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Pengaturan
  let shAtur = ss.getSheetByName('Pengaturan');
  if (!shAtur) shAtur = ss.insertSheet('Pengaturan');
  if (shAtur.getLastRow() === 0) {
    shAtur.appendRow(['Kunci', 'Nilai', 'Keterangan']);
    shAtur.appendRow(['jam_buka', '04:15', 'Waktu buka form absensi']);
    shAtur.appendRow(['jam_batas_tepat', '04:45', 'Batas maksimal tepat waktu']);
    shAtur.appendRow(['jam_tutup', '05:30', 'Waktu tutup form absensi']);
    formatHeader_(shAtur, 3);
  }

  // 2. Sheet Ustadz
  let shUstadz = ss.getSheetByName('Ustadz');
  if (!shUstadz) shUstadz = ss.insertSheet('Ustadz');
  if (shUstadz.getLastRow() === 0) {
    shUstadz.appendRow(['ID', 'Nama', 'Kontak']);
    shUstadz.appendRow(['U01', 'Ustadz Ahmad', '081234567890']);
    shUstadz.appendRow(['U02', 'Ustadz Abdullah', '081234567891']);
    shUstadz.appendRow(['U03', 'Ustadz Hasan', '081234567892']);
    formatHeader_(shUstadz, 3);
  }

  // 3. Sheet Jadwal
  let shJadwal = ss.getSheetByName('Jadwal');
  if (!shJadwal) shJadwal = ss.insertSheet('Jadwal');
  if (shJadwal.getLastRow() === 0) {
    shJadwal.appendRow(['Hari', 'IDUstadz', 'Peran', 'PetugasAbsen']);
    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];
    hariList.forEach(h => {
      shJadwal.appendRow([h, 'U01', 'Ketua', 'Ya']);
      shJadwal.appendRow([h, 'U02', 'Anggota', 'Tidak']);
    });
    formatHeader_(shJadwal, 4);
  }

  // 4. Sheet Absensi
  let shAbsen = ss.getSheetByName('Absensi');
  if (!shAbsen) shAbsen = ss.insertSheet('Absensi');
  if (shAbsen.getLastRow() === 0) {
    shAbsen.appendRow(['Timestamp', 'Tanggal', 'Hari', 'Nama', 'Keterangan', 'Alasan', 'StatusWaktu', 'DiisiOleh', 'Pengganti']);
    formatHeader_(shAbsen, 9);
  }

  // 5. Sheet Admin
  let shAdmin = ss.getSheetByName('Admin');
  if (!shAdmin) shAdmin = ss.insertSheet('Admin');
  if (shAdmin.getLastRow() === 0) {
    shAdmin.appendRow(['Email', 'Nama', 'PIN', 'Aktif']);
    shAdmin.appendRow(['admin@korlap.com', 'Admin Korlap', '1234', 'Ya']);
    formatHeader_(shAdmin, 4);
  }

  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1 && sheet1.getLastRow() === 0) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  Logger.log('Setup database berhasil dibuat!');
}

function formatHeader_(sh, cols) {
  const headerRange = sh.getRange(1, 1, 1, cols);
  headerRange.setBackground('#0F5132').setFontColor('#FFFFFF').setFontWeight('bold');
  sh.setFrozenRows(1);
}
