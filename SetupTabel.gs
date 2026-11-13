/**
 * ============================================================
 *  SETUP TABEL - ABSENSI KORLAP SHOLAT JAMA'AH
 *  Yayasan Pondok Pesantren Salafiyah Al-Falah - Pondok Putra
 * 
 *  Menambah menu "📋 Absensi" di Google Sheet untuk membuat
 *  dan merapikan semua tab dengan satu klik.
 * ============================================================
 */

// ---------- DATA PERSONIL & JADWAL SESUAI DOKUMEN RESMI ----------

const USTADZ_AWAL = [
  'Petugas Jaga Malam',           // U001 (Koor Shubuh)
  'Ust. Rabil Afraja + Guru Piket',// U002 (Koor Dhuhur)
  'Ust. Robbul Insan',            // U003 (Koor Ashar)
  'Ust. Muhammad Sendi',          // U004 (Koor Magrib & Isya)
  // Anggota Dhuhur
  'Hairul Fadli',                 // U005
  'Habib Rifki',                  // U006
  'Ahmad Syamsudin',              // U007
  'Fikri Caisar',                 // U008
  'Fachrityo',                    // U009
  'Refi Setiawan',                // U010
  'Wahyudi Rahman',               // U011
  'Chairil Annas',                // U012
  'Restu Qodri',                  // U013
  // Anggota Ashar
  'Ust. Danil Ali',               // U014
  'Abdul Muiz',                   // U015
  'Azwil Yoga',                   // U016
  'Anggi Franitar',               // U017
  'Nanda Bagus',                  // U018
  'Bagas Satrio',                 // U019
  'Fachri Jamil',                 // U020
  'Prabowo',                      // U021
  'Hamid',                        // U022
  // Anggota Magrib
  'Aska Saputra',                 // U023
  'Tegar Firmansyah',              // U024
  'Aldo Apriansyah',              // U025
  'Miftahul Munir',               // U026
  'Hasbi An',                     // U027
  'Dwi Prayoga',                  // U028
  'Yusuf R',                      // U029
  'Fauzan Azima',                 // U030
  'Hariyadi',                     // U031
  // Anggota Isya
  'Fahri Aji Aditiya',            // U032
  'Ranu Irawan',                  // U033
  'Rehan Ahmadal',                // U034
  'Andika WK',                    // U035
  'Agustyadi',                    // U036
  'Dafinza Sadewa',               // U037
  'Ahda Fadoli',                  // U038
  'Diski Ridho',                  // U039
  'Rehan Azahir'                  // U040
];

const JADWAL_AWAL = [
  // 1. SHUBUH
  { sholat: 'Shubuh', koor: 'U001', absen: 'U001', anggota: [] },
  // 2. DHUHUR
  { sholat: 'Dhuhur', koor: 'U002', absen: 'U005', anggota: ['U006', 'U007', 'U008', 'U009', 'U010', 'U011', 'U012', 'U013'] },
  // 3. ASHAR
  { sholat: 'Ashar', koor: 'U003', absen: 'U014', anggota: ['U015', 'U016', 'U017', 'U018', 'U019', 'U020', 'U021', 'U022'] },
  // 4. MAGRIB
  { sholat: 'Magrib', koor: 'U004', absen: 'U023', anggota: ['U024', 'U025', 'U026', 'U027', 'U028', 'U029', 'U030', 'U031'] },
  // 5. ISYA
  { sholat: 'Isya', koor: 'U004', absen: 'U032', anggota: ['U033', 'U034', 'U035', 'U036', 'U037', 'U038', 'U039', 'U040'] }
];

// Pengaturan jam bawaan per waktu sholat (bisa disesuaikan via admin)
const PENGATURAN_AWAL = [
  ['shubuh_buka',  '04:15', 'Shubuh: Form absen mulai dibuka (JJ:MM)'],
  ['shubuh_batas', '04:45', 'Shubuh: Batas maksimal tepat waktu (JJ:MM)'],
  ['shubuh_tutup', '05:30', 'Shubuh: Form absen ditutup (JJ:MM)'],

  ['dhuhur_buka',  '11:45', 'Dhuhur: Form absen mulai dibuka (JJ:MM)'],
  ['dhuhur_batas', '12:15', 'Dhuhur: Batas maksimal tepat waktu (JJ:MM)'],
  ['dhuhur_tutup', '12:45', 'Dhuhur: Form absen ditutup (JJ:MM)'],

  ['ashar_buka',   '15:00', 'Ashar: Form absen mulai dibuka (JJ:MM)'],
  ['ashar_batas',  '15:30', 'Ashar: Batas maksimal tepat waktu (JJ:MM)'],
  ['ashar_tutup',  '16:00', 'Ashar: Form absen ditutup (JJ:MM)'],

  ['magrib_buka',  '17:45', 'Magrib: Form absen mulai dibuka (JJ:MM)'],
  ['magrib_batas', '18:15', 'Magrib: Batas maksimal tepat waktu (JJ:MM)'],
  ['magrib_tutup', '18:45', 'Magrib: Form absen ditutup (JJ:MM)'],

  ['isya_buka',    '19:00', 'Isya: Form absen mulai dibuka (JJ:MM)'],
  ['isya_batas',   '19:30', 'Isya: Batas maksimal tepat waktu (JJ:MM)'],
  ['isya_tutup',   '20:15', 'Isya: Form absen ditutup (JJ:MM)']
];

// ---------- WARNA ----------
const WARNA = {
  hijau: '#0F5132',
  hijauMuda: '#EAF4EE',
  putih: '#FFFFFF',
  garis: '#CFE0D6'
};

// ---------- MENU ----------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📋 Absensi')
    .addItem('🛠️ Buat / Perbarui Semua Tabel', 'buatSemuaTabel')
    .addSeparator()
    .addItem('📥 Isi Ulang Data Awal (Personil & Jadwal)', 'isiDataAwal')
    .addToUi();
}

// ---------- FUNGSI UTAMA ----------
function buatSemuaTabel() {
  const ui = SpreadsheetApp.getUi();
  const jawab = ui.alert(
    'Buat / Perbarui Tabel',
    'Tab yang belum ada akan dibuat dan tampilan semua tab dirapikan.\n' +
    'Data yang sudah Anda isi TIDAK dihapus.\n\nLanjutkan?',
    ui.ButtonSet.YES_NO
  );
  if (jawab !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Jakarta');
  ss.toast('Sedang menyiapkan tabel, mohon tunggu...', 'Absensi', 30);

  siapkanUstadz_(ss);
  siapkanJadwal_(ss);
  siapkanAbsensi_(ss);
  siapkanPengaturan_(ss);
  siapkanAdmin_(ss);
  siapkanRekap_(ss);

  urutkanTab_(ss);
  hapusLembarKosong_(ss);
  ss.setActiveSheet(ss.getSheetByName('Rekap'));
  ss.toast('Selesai! Semua tabel sudah siap.', 'Absensi', 8);
}

function isiDataAwal() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ust = ss.getSheetByName('Ustadz');
  const jad = ss.getSheetByName('Jadwal');
  if (!ust || !jad) {
    ui.alert('Jalankan dulu menu "Buat / Perbarui Semua Tabel".');
    return;
  }
  const jawab = ui.alert(
    'Isi Ulang Data Awal',
    'Isi tab Ustadz dan Jadwal akan DITIMPA dengan data resmi Korlap Sholat Jamaah.\n\nLanjutkan?',
    ui.ButtonSet.YES_NO
  );
  if (jawab !== ui.Button.YES) return;

  ust.getRange('A2:C100').clearContent();
  jad.getRange('A2:E200').clearContent();
  isiUstadz_(ust);
  isiJadwal_(jad);
  ss.toast('Data personil & jadwal berhasil diisi ulang.', 'Absensi', 5);
}

// ---------- TAB: USTADZ ----------
function siapkanUstadz_(ss) {
  const sh = ambilTab_(ss, 'Ustadz');
  formatTabel_(sh, {
    judul: ['ID', 'Nama', 'Aktif'],
    lebar: [90, 280, 100],
    baris: 100,
    tengah: [1, 3],
    warnaTab: '#2E7D32',
    tinggiBaris: 28
  });

  sh.getRange('C2:C100').setDataValidation(daftar_(['Ya', 'Tidak']));
  sh.getRange('A2:A100').setFontWeight('bold');

  sh.setConditionalFormatRules([
    aturanTeks_(sh.getRange('C2:C100'), 'Tidak', '#FDE2E1', '#9B1C1C')
  ]);

  if (!adaIsi_(sh, 'A2:A100')) isiUstadz_(sh);
}

function isiUstadz_(sh) {
  const data = USTADZ_AWAL.map((nama, i) => [idUstadz_(i), nama, 'Ya']);
  sh.getRange(2, 1, data.length, 3).setValues(data);
}

function idUstadz_(index) {
  return 'U' + String(index + 1).padStart(3, '0');
}

// ---------- TAB: JADWAL ----------
function siapkanJadwal_(ss) {
  const sh = ambilTab_(ss, 'Jadwal');
  formatTabel_(sh, {
    judul: ['Sholat', 'IDUstadz', 'Peran', 'PetugasAbsen', 'NamaOtomatis'],
    lebar: [110, 110, 130, 140, 280],
    baris: 100,
    tengah: [1, 2, 3, 4],
    warnaTab: '#1565C0',
    tinggiBaris: 28
  });

  const ustadz = ss.getSheetByName('Ustadz');
  sh.getRange('A2:A100').setDataValidation(
    daftar_(['Shubuh', 'Dhuhur', 'Ashar', 'Magrib', 'Isya'])
  );
  sh.getRange('B2:B100').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(ustadz.getRange('A2:A100'), true)
      .setAllowInvalid(false)
      .setHelpText('Pilih ID dari tab Ustadz')
      .build()
  );
  sh.getRange('C2:C100').setDataValidation(daftar_(['Koordinator', 'Anggota']));
  sh.getRange('D2:D100').setDataValidation(daftar_(['Ya', 'Tidak']));

  const p = pemisahRumus_(ss);
  const rumus = [];
  for (let r = 2; r <= 100; r++) {
    rumus.push([
      '=IF(B' + r + '=""' + p + '""' + p + 'IFERROR(VLOOKUP(B' + r + p + 'Ustadz!$A$2:$B$100' + p + '2' + p + 'FALSE)' + p + '"ID tidak ditemukan"))'
    ]);
  }
  sh.getRange('E2:E100').setFormulas(rumus)
    .setFontColor('#6B7280').setFontStyle('italic');
  sh.getRange('A2:A100').setFontWeight('bold');

  sh.setConditionalFormatRules([
    aturanTeks_(sh.getRange('C2:C100'), 'Koordinator', '#FFF3CD', '#8A6D00'),
    aturanTeks_(sh.getRange('D2:D100'), 'Ya', '#DCEBFF', '#0B4A9E')
  ]);

  if (!adaIsi_(sh, 'A2:A100')) isiJadwal_(sh);
}

function isiJadwal_(sh) {
  const baris = [];
  JADWAL_AWAL.forEach(function (j) {
    if (j.koor) {
      baris.push([j.sholat, j.koor, 'Koordinator', j.absen === j.koor ? 'Ya' : 'Tidak']);
    }
    j.anggota.forEach(function (id) {
      baris.push([j.sholat, id, 'Anggota', j.absen === id ? 'Ya' : 'Tidak']);
    });
  });
  sh.getRange(2, 1, baris.length, 4).setValues(baris);
}

// ---------- TAB: ABSENSI ----------
function siapkanAbsensi_(ss) {
  const sh = ambilTab_(ss, 'Absensi');
  const BARIS = 5000;
  formatTabel_(sh, {
    judul: ['Timestamp', 'Tanggal', 'Hari', 'Sholat', 'Nama', 'Keterangan', 'Alasan',
            'StatusWaktu', 'DiisiOleh', 'Pengganti'],
    lebar: [165, 110, 90, 100, 230, 120, 320, 130, 230, 110],
    baris: BARIS,
    tengah: [2, 3, 4, 6, 8, 10],
    warnaTab: '#F57C00'
  });

  sh.getRange('A2:A' + BARIS).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sh.getRange('B2:B' + BARIS).setNumberFormat('dd/MM/yyyy');
  sh.getRange('G2:G' + BARIS).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sh.getRange('D2:D' + BARIS).setDataValidation(daftar_(['Shubuh', 'Dhuhur', 'Ashar', 'Magrib', 'Isya']));
  sh.getRange('F2:F' + BARIS).setDataValidation(daftar_(['Hadir', 'Sakit', 'Izin', 'Alfa']));
  sh.getRange('H2:H' + BARIS).setDataValidation(daftar_(['Tepat Waktu', 'Terlambat']));
  sh.getRange('J2:J' + BARIS).setDataValidation(daftar_(['Ya', 'Tidak']));

  const ket = sh.getRange('F2:F' + BARIS);
  const wkt = sh.getRange('H2:H' + BARIS);
  const png = sh.getRange('J2:J' + BARIS);
  sh.setConditionalFormatRules([
    aturanTeks_(ket, 'Hadir', '#D9F2E3', '#0B6B3A'),
    aturanTeks_(ket, 'Sakit', '#FFF1CC', '#8A5A00'),
    aturanTeks_(ket, 'Izin', '#DCEBFF', '#0B4A9E'),
    aturanTeks_(ket, 'Alfa', '#FDE2E1', '#9B1C1C'),
    aturanTeks_(wkt, 'Tepat Waktu', '#D9F2E3', '#0B6B3A'),
    aturanTeks_(wkt, 'Terlambat', '#FDE2E1', '#9B1C1C'),
    aturanTeks_(png, 'Ya', '#FFE5CC', '#9A4A00')
  ]);
}

// ---------- TAB: PENGATURAN ----------
function siapkanPengaturan_(ss) {
  const sh = ambilTab_(ss, 'Pengaturan');
  formatTabel_(sh, {
    judul: ['Kunci', 'Nilai', 'Keterangan'],
    lebar: [200, 130, 460],
    baris: 30,
    tengah: [2],
    warnaTab: '#6A1B9A',
    tinggiBaris: 30
  });

  sh.getRange('B2:B30').setNumberFormat('@'); // teks jam
  sh.getRange('A2:A30').setFontWeight('bold');
  sh.getRange('B2:B30').setFontWeight('bold');
  sh.getRange('C2:C30').setFontColor('#6B7280');

  const kunci = sh.getRange('A2:A30').getValues().map(r => String(r[0]));
  PENGATURAN_AWAL.forEach(function (d) {
    if (kunci.indexOf(d[0]) !== -1) return;
    const idx = kunci.indexOf('');
    if (idx === -1) return;
    sh.getRange(idx + 2, 1, 1, 3).setValues([d]);
    kunci[idx] = d[0];
  });
}

// ---------- TAB: ADMIN ----------
function siapkanAdmin_(ss) {
  const sh = ambilTab_(ss, 'Admin');
  formatTabel_(sh, {
    judul: ['Email', 'PIN', 'Nama', 'Aktif'],
    lebar: [280, 100, 220, 100],
    baris: 20,
    tengah: [2, 4],
    warnaTab: '#C62828',
    tinggiBaris: 30
  });

  sh.getRange('B2:B20').setNumberFormat('@');
  sh.getRange('D2:D20').setDataValidation(daftar_(['Ya', 'Tidak']));
  sh.getRange('B1').setNote('PIN admin: 4 digit angka.');

  sh.setConditionalFormatRules([
    aturanTeks_(sh.getRange('D2:D20'), 'Tidak', '#FDE2E1', '#9B1C1C'),
    aturanTeks_(sh.getRange('D2:D20'), 'Ya', '#D9F2E3', '#0B6B3A')
  ]);

  if (!adaIsi_(sh, 'A2:D20')) {
    sh.getRange('A2:D2').setValues([['admin@korlap.com', '1234', 'Admin Korlap', 'Ya']]);
  }

  sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove());
  sh.protect().setWarningOnly(true).setDescription('Berisi PIN admin.');
}

// ---------- TAB: REKAP ----------
function siapkanRekap_(ss) {
  const sh = ambilTab_(ss, 'Rekap');
  formatTabel_(sh, {
    judul: ['Nama', 'Hadir', 'Hadir Terlambat', 'Sakit', 'Izin', 'Alfa', 'Total'],
    barisHeader: 5,
    baris: 65,
    lebar: [250, 85, 130, 85, 85, 85, 85],
    tengah: [2, 3, 4, 5, 6, 7],
    warnaTab: '#FBC02D',
    tinggiBaris: 28
  });

  // Judul
  sh.setRowHeight(1, 48);
  sh.getRange('A1:G1').merge()
    .setValue("REKAP ABSENSI KORLAP SHOLAT JAMA'AH")
    .setFontFamily('Roboto').setFontSize(18).setFontWeight('bold')
    .setFontColor(WARNA.hijau).setVerticalAlignment('middle');

  const p = pemisahRumus_(ss);
  sh.setRowHeight(3, 32);
  sh.getRange('A3').setValue('Bulan yang ditampilkan')
    .setFontFamily('Roboto').setFontWeight('bold').setVerticalAlignment('middle');
  const bulan = sh.getRange('B3:C3').merge();
  const valB3 = String(sh.getRange('B3').getValue());
  if (sh.getRange('B3').isBlank() || valB3.indexOf('#') !== -1) {
    sh.getRange('B3').setFormula('=EOMONTH(TODAY()' + p + '-1)+1');
  }
  bulan.setNumberFormat('MMMM yyyy').setBackground('#FFF8DC').setFontWeight('bold')
    .setFontFamily('Roboto').setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setBorder(true, true, true, true, false, false, '#E0B000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Rumus rekap per personil (baris 6 sampai 65)
  const rumus = [];
  for (let r = 6; r <= 65; r++) {
    const u = r - 4;
    const orang = 'Absensi!$E$2:$E$20000' + p + '$A' + r;
    const tgl = 'Absensi!$B$2:$B$20000' + p + '">="&$B$3' + p + 'Absensi!$B$2:$B$20000' + p + '"<"&EDATE($B$3' + p + '1)';
    const ket = function (teks) {
      return '=IF($A' + r + '=""' + p + '""' + p + 'COUNTIFS(' + orang +
        p + 'Absensi!$F$2:$F$20000' + p + '"' + teks + '"' + p + tgl + '))';
    };
    rumus.push([
      '=IF(Ustadz!B' + u + '=""' + p + '""' + p + 'Ustadz!B' + u + ')',
      ket('Hadir'),
      '=IF($A' + r + '=""' + p + '""' + p + 'COUNTIFS(' + orang +
        p + 'Absensi!$F$2:$F$20000' + p + '"Hadir"' + p + 'Absensi!$H$2:$H$20000' + p + '"Terlambat"' + p + tgl + '))',
      ket('Sakit'),
      ket('Izin'),
      ket('Alfa'),
      '=IF($A' + r + '=""' + p + '""' + p + 'B' + r + '+D' + r + '+E' + r + '+F' + r + ')'
    ]);
  }
  sh.getRange(6, 1, 60, 7).setFormulas(rumus);
  sh.getRange('A6:A65').setFontWeight('bold');
  sh.getRange('G6:G65').setFontWeight('bold');
}

// ---------- FUNGSI BANTU ----------
function ambilTab_(ss, nama) {
  return ss.getSheetByName(nama) || ss.insertSheet(nama);
}

function formatTabel_(sheet, cfg) {
  const hr = cfg.barisHeader || 1;
  const n = cfg.judul.length;
  const total = cfg.baris;

  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .clearFormat().clearDataValidations();
  sheet.getBandings().forEach(b => b.remove());
  sheet.setConditionalFormatRules([]);

  aturUkuran_(sheet, total, n);

  sheet.getRange(hr, 1, 1, n).setValues([cfg.judul]);

  const tabel = sheet.getRange(hr, 1, total - hr + 1, n);
  tabel.setFontFamily('Roboto').setFontSize(11).setFontColor('#1F2937')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, WARNA.garis, SpreadsheetApp.BorderStyle.SOLID);

  const band = tabel.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  band.setHeaderRowColor(WARNA.hijau)
    .setFirstRowColor(WARNA.putih)
    .setSecondRowColor(WARNA.hijauMuda);

  sheet.getRange(hr, 1, 1, n)
    .setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(hr, 38);

  cfg.lebar.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  (cfg.tengah || []).forEach(c => sheet.getRange(hr + 1, c, total - hr, 1).setHorizontalAlignment('center'));

  if (cfg.tinggiBaris) sheet.setRowHeights(hr + 1, total - hr, cfg.tinggiBaris);

  sheet.setFrozenRows(hr);
  sheet.setHiddenGridlines(true);
  if (cfg.warnaTab) sheet.setTabColor(cfg.warnaTab);
}

function aturUkuran_(sheet, jumlahBaris, jumlahKolom) {
  const maxR = sheet.getMaxRows();
  if (maxR < jumlahBaris) {
    sheet.insertRowsAfter(maxR, jumlahBaris - maxR);
  } else if (maxR > jumlahBaris && sheet.getLastRow() <= jumlahBaris) {
    sheet.deleteRows(jumlahBaris + 1, maxR - jumlahBaris);
  }
  const maxC = sheet.getMaxColumns();
  if (maxC < jumlahKolom) {
    sheet.insertColumnsAfter(maxC, jumlahKolom - maxC);
  } else if (maxC > jumlahKolom && sheet.getLastColumn() <= jumlahKolom) {
    sheet.deleteColumns(jumlahKolom + 1, maxC - jumlahKolom);
  }
}

function daftar_(opsi) {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(opsi, true)
    .setAllowInvalid(false)
    .build();
}

function aturanTeks_(range, teks, latar, huruf) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(teks)
    .setBackground(latar)
    .setFontColor(huruf)
    .setBold(true)
    .setRanges([range])
    .build();
}

function adaIsi_(sheet, a1) {
  return sheet.getRange(a1).getValues().some(baris => baris.some(sel => sel !== ''));
}

function urutkanTab_(ss) {
  ['Rekap', 'Absensi', 'Jadwal', 'Ustadz', 'Pengaturan', 'Admin'].forEach((nama, i) => {
    const sh = ss.getSheetByName(nama);
    if (sh) {
      ss.setActiveSheet(sh);
      ss.moveActiveSheet(i + 1);
    }
  });
}

function hapusLembarKosong_(ss) {
  ['Sheet1', 'Sheet 1', 'Lembar1', 'Lembar 1'].forEach(nama => {
    const sh = ss.getSheetByName(nama);
    if (sh && ss.getSheets().length > 1 && sh.getLastRow() === 0) ss.deleteSheet(sh);
  });
}

function pemisahRumus_(ss) {
  try {
    const loc = ss.getSpreadsheetLocale().toLowerCase();
    if (loc.startsWith('en') || loc.startsWith('us')) return ',';
  } catch (e) {}
  return ';';
}
