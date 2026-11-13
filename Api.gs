/** 
 * ============================================================
 * API Absensi Korlap Sholat Jama'ah - Pondok Putra
 * Ponpes Salafiyah Al-Falah Putak
 * 
 * Tempelkan file ini di Google Apps Script (Extensions > Apps Script)
 * pada Google Spreadsheet Anda.
 * ============================================================
 */

const TZ = 'Asia/Jakarta';
const HARI = [null, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];
const DAFTAR_SHOLAT = ['Shubuh', 'Dhuhur', 'Ashar', 'Magrib', 'Isya'];

const ss_ = () => SpreadsheetApp.getActiveSpreadsheet();
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

// Cache memori agar doGet super cepat (<1 detik) tanpa hit ulang setiap tab sheet
function getCachedData_(nama, expiredSeconds) {
  const cache = CacheService.getScriptCache();
  const k = 'sheet_' + nama;
  const c = cache.get(k);
  if (c) {
    try { return JSON.parse(c); } catch (e) {}
  }
  const data = baca_(nama);
  try {
    cache.put(k, JSON.stringify(data), expiredSeconds || 180); // cache 3 menit
  } catch (e) {}
  return data;
}

function clearSheetCache_(nama) {
  try {
    CacheService.getScriptCache().remove('sheet_' + nama);
  } catch (e) {}
}

function baca_(nama) {
  const sh = ss_().getSheetByName(nama);
  if (!sh) throw new Error('Sheet "' + nama + '" tidak ditemukan. Jalankan fungsi setupDatabaseAwal() di Apps Script.');
  const v = sh.getDataRange().getValues();
  if (v.length <= 1) return [];
  const h = v.shift();
  return v.filter(r => r[0] !== '').map(r => { const o = {}; h.forEach((k, i) => o[k] = r[i]); return o; });
}

function jam_(v) { 
  if (v instanceof Date) {
    return Utilities.formatDate(v, TZ, 'HH:mm');
  }
  const s = String(v || '').trim();
  const m = s.match(/(\d{1,2}):(\d{2})/);
  if (m) {
    return m[1].padStart(2, '0') + ':' + m[2];
  }
  return s;
}

function toMinutes_(hhmm) {
  if (!hhmm) return 0;
  const m = String(hhmm).match(/(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

// Cek apakah waktu saat ini buka, tepat waktu, atau tutup (Mendukung sesi normal maupun lintas tengah malam)
function cekStatusWaktu_(jam, buka, batas, tutup) {
  const mJam = toMinutes_(jam);
  const mBuka = toMinutes_(buka);
  const mBatas = toMinutes_(batas);
  const mTutup = toMinutes_(tutup);

  let isOpen = false;
  if (mBuka <= mTutup) {
    // Sesi normal (contoh: 04:15 s/d 05:30)
    isOpen = mJam >= mBuka && mJam <= mTutup;
  } else {
    // Sesi lintas tengah malam (contoh: 23:30 s/d 00:30)
    isOpen = mJam >= mBuka || mJam <= mTutup;
  }

  let statusForm = 'tutup';
  if (isOpen) {
    statusForm = 'buka';
  } else {
    if (mBuka <= mTutup) {
      statusForm = mJam < mBuka ? 'belum' : 'tutup';
    } else {
      // Di luar jam buka sesi lintas tengah malam (contoh: antara 00:31 s/d 23:29)
      const diffKeBuka = (mBuka - mJam + 1440) % 1440;
      statusForm = diffKeBuka <= 180 ? 'belum' : 'tutup';
    }
  }

  // Penentuan Tepat Waktu vs Terlambat
  let statusWaktu = 'Tepat Waktu';
  if (mBuka <= mTutup) {
    statusWaktu = mJam <= mBatas ? 'Tepat Waktu' : 'Terlambat';
  } else {
    // Lintas tengah malam
    if (mBuka <= mBatas) {
      // batas sebelum jam 00:00 (contoh: buka 23:00, batas 23:45, tutup 00:30)
      statusWaktu = (mJam >= mBuka && mJam <= mBatas) ? 'Tepat Waktu' : 'Terlambat';
    } else {
      // batas setelah jam 00:00 (contoh: buka 23:30, batas 00:15, tutup 00:30)
      statusWaktu = (mJam >= mBuka || mJam <= mBatas) ? 'Tepat Waktu' : 'Terlambat';
    }
  }

  return { isOpen, statusForm, statusWaktu };
}

function atur_() { 
  const o = {}; 
  getCachedData_('Pengaturan', 300).forEach(r => o[r.Kunci] = jam_(r.Nilai)); 
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

function timSholat_(sholat) {
  const u = {}; 
  getCachedData_('Ustadz', 600).forEach(r => u[r.ID] = r.Nama);
  return getCachedData_('Jadwal', 600).filter(r => r.Sholat === sholat)
    .map(r => ({ 
      nama: u[r.IDUstadz] || r.IDUstadz, 
      peran: r.Peran, 
      petugas: r.PetugasAbsen === 'Ya' 
    }));
}

function getJadwalSholatConfig_(a, sholat) {
  const pfx = String(sholat).toLowerCase();
  const buka = a[pfx + '_buka'] || (sholat === 'Shubuh' ? '04:15' : sholat === 'Dhuhur' ? '11:45' : sholat === 'Ashar' ? '15:00' : sholat === 'Magrib' ? '17:45' : '19:00');
  const batas = a[pfx + '_batas'] || (sholat === 'Shubuh' ? '04:45' : sholat === 'Dhuhur' ? '12:15' : sholat === 'Ashar' ? '15:30' : sholat === 'Magrib' ? '18:15' : '19:30');
  const tutup = a[pfx + '_tutup'] || (sholat === 'Shubuh' ? '05:30' : sholat === 'Dhuhur' ? '12:45' : sholat === 'Ashar' ? '16:00' : sholat === 'Magrib' ? '18:45' : '20:15');
  return { buka: jam_(buka), batas: jam_(batas), tutup: jam_(tutup) };
}

function tentukanSholatAktif_(s, a) {
  const jam = s.jam;

  // 1. Cek apakah ada jadwal sholat yang sedang 'buka' sekarang
  for (let i = 0; i < DAFTAR_SHOLAT.length; i++) {
    const sh = DAFTAR_SHOLAT[i];
    const cfg = getJadwalSholatConfig_(a, sh);
    const st = cekStatusWaktu_(jam, cfg.buka, cfg.batas, cfg.tutup);
    if (st.isOpen) return sh;
  }

  // 2. Jika tidak ada yang buka saat ini, pilih sholat yang waktu bukanya paling dekat
  const mJam = toMinutes_(jam);
  let minDiff = 999999;
  let sholatTerdekat = 'Shubuh';

  for (let i = 0; i < DAFTAR_SHOLAT.length; i++) {
    const sh = DAFTAR_SHOLAT[i];
    const cfg = getJadwalSholatConfig_(a, sh);
    const mBuka = toMinutes_(cfg.buka);
    const diff = (mBuka - mJam + 1440) % 1440;
    if (diff < minDiff) {
      minDiff = diff;
      sholatTerdekat = sh;
    }
  }

  return sholatTerdekat;
}

function sudahAbsen_(tgl, sholat) {
  const rows = getCachedData_('Absensi', 60); // cache 1 menit untuk absensi
  return rows.some(r => {
    const tMatch = r.Tanggal instanceof Date 
      ? Utilities.formatDate(r.Tanggal, TZ, 'yyyy-MM-dd') === tgl 
      : String(r.Tanggal) === tgl;
    const sMatch = String(r.Sholat || '').trim().toLowerCase() === String(sholat).trim().toLowerCase();
    return tMatch && sMatch;
  });
}

// Endpoint GET: Info hari ini & waktu sholat (Kini Teroptimasi Cepat)
function doGet(e) {
  try {
    const s = sekarang_(), a = atur_();
    const reqSholat = (e && e.parameter && e.parameter.sholat) 
      ? e.parameter.sholat 
      : tentukanSholatAktif_(s, a);

    const sholat = DAFTAR_SHOLAT.indexOf(reqSholat) !== -1 ? reqSholat : 'Shubuh';
    const cfg = getJadwalSholatConfig_(a, sholat);
    const sudah = sudahAbsen_(s.tgl, sholat);
    const st = cekStatusWaktu_(s.jam, cfg.buka, cfg.batas, cfg.tutup);

    return out_({
      hari: s.hari, 
      tanggal: s.tgl, 
      jam: s.jam, 
      sholat: sholat,
      daftar_sholat: DAFTAR_SHOLAT,
      buka: cfg.buka, 
      batas: cfg.batas, 
      tutup: cfg.tutup,
      status: st.statusForm,
      status_waktu: st.statusWaktu,
      sudah: sudah, 
      tim: timSholat_(sholat)
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
    const sholat = d.sholat || tentukanSholatAktif_(s, a);
    const cfg = getJadwalSholatConfig_(a, sholat);
    const st = cekStatusWaktu_(s.jam, cfg.buka, cfg.batas, cfg.tutup);

    if (!st.isOpen) {
      if (st.statusForm === 'belum') {
        throw new Error('Absen ' + sholat + ' belum dibuka (jadwal buka: ' + cfg.buka + ' WIB)');
      } else {
        throw new Error('Absen ' + sholat + ' sudah ditutup (jadwal tutup: ' + cfg.tutup + ' WIB)');
      }
    }
    if (sudahAbsen_(s.tgl, sholat)) throw new Error('Absen ' + sholat + ' hari ini sudah pernah dikirim');
    
    const tim = timSholat_(sholat);
    if (!tim.some(t => t.nama === d.pengisi)) throw new Error('Pengisi tidak termasuk tim sholat ' + sholat);
    
    const resmi = tim.find(t => t.petugas);
    const status = st.statusWaktu; // 'Tepat Waktu' atau 'Terlambat'
    const tgl = new Date(s.tgl + 'T00:00:00+07:00');
    
    const rows = tim.map(t => {
      const i = (d.items || []).find(x => x.nama === t.nama);
      if (!i || ['Hadir', 'Sakit', 'Izin', 'Alfa'].indexOf(i.ket) < 0) throw new Error('Data ' + t.nama + ' tidak lengkap');
      const al = (i.ket === 'Hadir' || i.ket === 'Alfa') ? '' : String(i.alasan || '').trim();
      if ((i.ket === 'Sakit' || i.ket === 'Izin') && !al) throw new Error('Alasan ' + t.nama + ' wajib diisi');
      return [
        s.n, 
        tgl, 
        s.hari, 
        sholat,
        t.nama, 
        i.ket, 
        al, 
        status, 
        d.pengisi, 
        resmi && resmi.nama === d.pengisi ? 'Tidak' : 'Ya'
      ];
    });
    
    const sh = ss_().getSheetByName('Absensi');
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
    clearSheetCache_('Absensi');
    return { ok: true, status, jam: s.jam, sholat };
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
  c.put('tok_' + t, em, 21600);
  return { token: t, nama: ad.Nama };
}

function cek_(t) { 
  if (!t || !CacheService.getScriptCache().get('tok_' + t)) {
    throw new Error('Sesi habis, silakan login lagi'); 
  }
}

function data_(d) {
  cek_(d.token);
  const s = sekarang_(), a = atur_();
  const rows = baca_('Absensi').map(r => ({
    tanggal: r.Tanggal instanceof Date ? Utilities.formatDate(r.Tanggal, TZ, 'yyyy-MM-dd') : String(r.Tanggal),
    jam: r.Timestamp instanceof Date ? Utilities.formatDate(r.Timestamp, TZ, 'HH:mm') : String(r.Timestamp),
    hari: r.Hari, 
    sholat: r.Sholat || 'Shubuh',
    nama: r.Nama, 
    ket: r.Keterangan, 
    alasan: r.Alasan, 
    waktu: r.StatusWaktu, 
    pengisi: r.DiisiOleh, 
    pengganti: r.Pengganti
  })).slice(-2500);
  
  const sholatAktif = tentukanSholatAktif_(s, a);

  return { 
    rows, 
    atur: a, 
    hari: s.hari, 
    tgl: s.tgl, 
    sholat: sholatAktif,
    tim: timSholat_(sholatAktif),
    daftar_sholat: DAFTAR_SHOLAT
  };
}

function simpan_(d) {
  cek_(d.token);
  const sh = ss_().getSheetByName('Pengaturan');
  if (!sh) throw new Error('Sheet "Pengaturan" tidak ditemukan');
  
  const v = sh.getDataRange().getValues();
  const keys = Object.keys(d.atur || {});
  
  keys.forEach(k => {
    const x = String(d.atur[k]).trim();
    if (!/^\d\d:\d\d$/.test(x)) return;
    const i = v.findIndex(r => r[0] === k);
    if (i !== -1) {
      sh.getRange(i + 1, 2).setValue(x);
    } else {
      sh.appendRow([k, x, 'Pengaturan waktu']);
    }
  });
  
  clearSheetCache_('Pengaturan');
  return { ok: true, pesan: 'Pengaturan jam sholat berhasil diperbarui' };
}
