/**
 * ============================================================
 *  SETUP TABEL - ABSENSI KORLAP SUBUH
 *  Menambah menu "📋 Absensi" di Google Sheet untuk membuat
 *  dan merapikan semua tab dengan satu klik.
 *
 *  Aman dijalankan berulang kali:
 *  - Tab yang belum ada dibuat.
 *  - Tampilan dirapikan ulang.
 *  - Data yang sudah Anda isi TIDAK dihapus.
 * ============================================================
 */

// ---------- DATA AWAL (sesuai file jadwal petugas) ----------

const USTADZ_AWAL = [
  'Ust. Imam Qurthubi',   // U001
  'Ust. Imam Qusyairi',   // U002
  'Ust. Makmun',          // U003
  'Ust. Muhammad Nadzir', // U004
  'Ust. Slamet Haryadi',  // U005
  'Ust. Ubaid Azuhdi',    // U006
  'Ust. Akhsan Sanusi',   // U007
  'Ust. Eko Haryadi',     // U008
  'Ust. Agung P.',        // U009
  'Ust. Malik',           // U010
  'Ust. Abdul Ghofur',    // U011
  'Ust. M. Iqbal',        // U012
  'Ust. Tulus',           // U013
  'Ust. Joko',            // U014
  'Ust. Harun',           // U015
  'Ust. Syaipudin',       // U016
  'Ust. Johan Aryasena',  // U017
  'Ust. Basyar',          // U018
  'Ust. Arif H',          // U019
  'Ust. Latief N',        // U020
  'Ust. Irham',           // U021
  'Ust. Abdullah Umam',   // U022
  'Ust. Bagus Maghfuri',  // U023
  'Ust. Ismail',          // U024
  'Ust. M. Sendi',        // U025
  'Ust. Aldo F.',         // U026
  'Ust. Daniel',          // U027
  'Ust. Rabil A',         // U028
  'Ust. Robul Insan',     // U029
  'Ust. Muadz',           // U030
  'Ust. M. Majid'         // U031
];

// ketua: ID ketua (kosong jika tidak ada), absen: ID petugas absen,
// anggota: anggota lain di luar ketua dan petugas absen
const JADWAL_AWAL = [
  { hari: 'Sabtu',  ketua: 'U001', absen: 'U009', anggota: ['U004', 'U005', 'U006', 'U007', 'U008'] },
  { hari: 'Ahad',   ketua: 'U002', absen: 'U015', anggota: ['U010', 'U007', 'U011', 'U012', 'U013', 'U014'] },
  { hari: 'Senin',  ketua: 'U003', absen: 'U020', anggota: ['U016', 'U017', 'U018', 'U019', 'U021'] },
  { hari: 'Selasa', ketua: 'U002', absen: 'U010', anggota: ['U022', 'U017', 'U023', 'U005', 'U013'] },
  { hari: 'Rabu',   ketua: 'U003', absen: 'U021', anggota: ['U018', 'U023', 'U019', 'U012', 'U015'] },
  { hari: 'Kamis',  ketua: 'U001', absen: 'U009', anggota: ['U016', 'U022', 'U024', 'U004', 'U020'] },
  { hari: 'Jumat',  ketua: '',     absen: 'U031', anggota: ['U025', 'U026', 'U027', 'U028', 'U029', 'U030'] }
];

// Pengaturan jam bawaan (bisa diubah di tab Pengaturan atau dashboard admin)
const PENGATURAN_AWAL = [
  ['jam_buka',        '03:30', 'Form absen mulai bisa diisi (format JJ:MM, 24 jam)'],
  ['jam_batas_tepat', '04:30', 'Kirim sebelum jam ini = Tepat Waktu, sesudahnya = Terlambat'],
  ['jam_tutup',       '06:00', 'Form absen ditutup, tidak bisa dikirim lagi']
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
    .addItem('📥 Isi Ulang Data Awal (Ustadz & Jadwal)', 'isiDataAwal')
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
    'Isi tab Ustadz dan Jadwal akan DITIMPA dengan data awal ' +
    '(31 ustadz dan 50 baris jadwal).\n\nLanjutkan?',
    ui.ButtonSet.YES_NO
  );
  if (jawab !== ui.Button.YES) return;

  ust.getRange('A2:C100').clearContent();
  jad.getRange('A2:D200').clearContent();
  isiUstadz_(ust);
  isiJadwal_(jad);
  ss.toast('Data awal berhasil diisi ulang.', 'Absensi', 5);
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
    judul: ['Hari', 'IDUstadz', 'Peran', 'PetugasAbsen', 'NamaOtomatis'],
    lebar: [110, 110, 120, 140, 280],
    baris: 200,
    tengah: [1, 2, 3, 4],
    warnaTab: '#1565C0',
    tinggiBaris: 28
  });

  const ustadz = ss.getSheetByName('Ustadz');
  sh.getRange('A2:A200').setDataValidation(
    daftar_(['Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'])
  );
  sh.getRange('B2:B200').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(ustadz.getRange('A2:A100'), true)
      .setAllowInvalid(false)
      .setHelpText('Pilih ID dari tab Ustadz')
      .build()
  );
  sh.getRange('C2:C200').setDataValidation(daftar_(['Ketua', 'Anggota']));
  sh.getRange('D2:D200').setDataValidation(daftar_(['Ya', 'Tidak']));

  // Kolom nama otomatis agar jadwal mudah dibaca
  const p = pemisahRumus_(ss);
  const rumus = [];
  for (let r = 2; r <= 200; r++) {
    rumus.push([
      '=IF(B' + r + '=""' + p + '""' + p + 'IFERROR(VLOOKUP(B' + r + p + 'Ustadz!$A$2:$B$100' + p + '2' + p + 'FALSE)' + p + '"ID tidak ditemukan"))'
    ]);
  }
  sh.getRange('E2:E200').setFormulas(rumus)
    .setFontColor('#6B7280').setFontStyle('italic');
  sh.getRange('A2:A200').setFontWeight('bold');

  sh.setConditionalFormatRules([
    aturanTeks_(sh.getRange('C2:C200'), 'Ketua', '#FFF3CD', '#8A6D00'),
    aturanTeks_(sh.getRange('D2:D200'), 'Ya', '#DCEBFF', '#0B4A9E')
  ]);

  if (!adaIsi_(sh, 'A2:A200')) isiJadwal_(sh);
}

function isiJadwal_(sh) {
  const baris = [];
  JADWAL_AWAL.forEach(function (h) {
    if (h.ketua) baris.push([h.hari, h.ketua, 'Ketua', 'Tidak']);
    h.anggota.forEach(function (id) {
      baris.push([h.hari, id, 'Anggota', 'Tidak']);
    });
    baris.push([h.hari, h.absen, 'Anggota', 'Ya']);
  });
  sh.getRange(2, 1, baris.length, 4).setValues(baris);
}

// ---------- TAB: ABSENSI ----------

function siapkanAbsensi_(ss) {
  const sh = ambilTab_(ss, 'Absensi');
  const BARIS = 5000;
  formatTabel_(sh, {
    judul: ['Timestamp', 'Tanggal', 'Hari', 'Nama', 'Keterangan', 'Alasan',
            'StatusWaktu', 'DiisiOleh', 'Pengganti'],
    lebar: [165, 110, 90, 230, 120, 320, 130, 230, 110],
    baris: BARIS,
    tengah: [2, 3, 5, 7, 9],
    warnaTab: '#F57C00'
  });

  sh.getRange('A2:A' + BARIS).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sh.getRange('B2:B' + BARIS).setNumberFormat('dd/MM/yyyy');
  sh.getRange('F2:F' + BARIS).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  sh.getRange('E2:E' + BARIS).setDataValidation(daftar_(['Hadir', 'Sakit', 'Izin', 'Alfa']));
  sh.getRange('G2:G' + BARIS).setDataValidation(daftar_(['Tepat Waktu', 'Terlambat']));
  sh.getRange('I2:I' + BARIS).setDataValidation(daftar_(['Ya', 'Tidak']));

  const ket = sh.getRange('E2:E' + BARIS);
  const wkt = sh.getRange('G2:G' + BARIS);
  const png = sh.getRange('I2:I' + BARIS);
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
    baris: 20,
    tengah: [2],
    warnaTab: '#6A1B9A',
    tinggiBaris: 30
  });

  sh.getRange('B2:B20').setNumberFormat('@'); // jam disimpan sebagai teks
  sh.getRange('A2:A20').setFontWeight('bold');
  sh.getRange('B2:B20').setFontWeight('bold');
  sh.getRange('C2:C20').setFontColor('#6B7280');

  const kunci = sh.getRange('A2:A20').getValues().map(function (r) { return String(r[0]); });
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

  sh.getRange('B2:B20').setNumberFormat('@'); // PIN disimpan sebagai teks
  sh.getRange('D2:D20').setDataValidation(daftar_(['Ya', 'Tidak']));
  sh.getRange('B1').setNote('PIN admin: 4 digit angka. Jangan bagikan Sheet ini ke siapa pun.');

  sh.setConditionalFormatRules([
    aturanTeks_(sh.getRange('D2:D20'), 'Tidak', '#FDE2E1', '#9B1C1C'),
    aturanTeks_(sh.getRange('D2:D20'), 'Ya', '#D9F2E3', '#0B6B3A')
  ]);

  // Baris contoh (nonaktif) supaya Anda tahu cara mengisinya
  if (!adaIsi_(sh, 'A2:D20')) {
    sh.getRange('A2:D2').setValues([['isi-email-anda@gmail.com', '', 'Nama Admin', 'Tidak']]);
  }

  // Peringatan jika ada yang mengedit tab ini
  sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); });
  sh.protect().setWarningOnly(true).setDescription('Berisi PIN admin. Jangan dibagikan.');
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
    .setValue('REKAP ABSENSI BULANAN')
    .setFontFamily('Roboto').setFontSize(20).setFontWeight('bold')
    .setFontColor(WARNA.hijau).setVerticalAlignment('middle');

  // Pilihan bulan
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
  sh.getRange('D3').setValue('← ketik tanggal 1 bulan lain, misalnya 01/10/2026')
    .setFontColor('#6B7280').setFontStyle('italic').setVerticalAlignment('middle');

  // Rumus rekap per ustadz (baris 6 sampai 65 = 60 ustadz)
  const rumus = [];
  for (let r = 6; r <= 65; r++) {
    const u = r - 4; // baris 6 -> Ustadz!B2
    const orang = 'Absensi!$D$2:$D$20000' + p + '$A' + r;
    const tgl = 'Absensi!$B$2:$B$20000' + p + '">="&$B$3' + p + 'Absensi!$B$2:$B$20000' + p + '"<"&EDATE($B$3' + p + '1)';
    const ket = function (teks) {
      return '=IF($A' + r + '=""' + p + '""' + p + 'COUNTIFS(' + orang +
        p + 'Absensi!$E$2:$E$20000' + p + '"' + teks + '"' + p + tgl + '))';
    };
    rumus.push([
      '=IF(Ustadz!B' + u + '=""' + p + '""' + p + 'Ustadz!B' + u + ')',
      ket('Hadir'),
      '=IF($A' + r + '=""' + p + '""' + p + 'COUNTIFS(' + orang +
        p + 'Absensi!$E$2:$E$20000' + p + '"Hadir"' + p + 'Absensi!$G$2:$G$20000' + p + '"Terlambat"' + p + tgl + '))',
      ket('Sakit'),
      ket('Izin'),
      ket('Alfa'),
      '=IF($A' + r + '=""' + p + '""' + p + 'B' + r + '+D' + r + '+E' + r + '+F' + r + ')'
    ]);
  }
  sh.getRange(6, 1, 60, 7).setFormulas(rumus);
  sh.getRange('A6:A65').setFontWeight('bold');
  sh.getRange('G6:G65').setFontWeight('bold');

  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0)
      .setBackground('#FDE2E1').setFontColor('#9B1C1C').setBold(true)
      .setRanges([sh.getRange('C6:C65')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0)
      .setBackground('#FFF1CC').setFontColor('#8A5A00').setBold(true)
      .setRanges([sh.getRange('D6:D65')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0)
      .setBackground('#DCEBFF').setFontColor('#0B4A9E').setBold(true)
      .setRanges([sh.getRange('E6:E65')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0)
      .setBackground('#FDE2E1').setFontColor('#9B1C1C').setBold(true)
      .setRanges([sh.getRange('F6:F65')]).build()
  ]);
}

// ---------- FUNGSI BANTU ----------

function ambilTab_(ss, nama) {
  return ss.getSheetByName(nama) || ss.insertSheet(nama);
}

/**
 * Merapikan satu tab: header hijau, garis, selang-seling warna baris,
 * lebar kolom, freeze header, sembunyikan gridline, dll.
 */
function formatTabel_(sheet, cfg) {
  const hr = cfg.barisHeader || 1;
  const n = cfg.judul.length;
  const total = cfg.baris;

  // Bersihkan format lama supaya hasilnya selalu konsisten
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .clearFormat().clearDataValidations();
  sheet.getBandings().forEach(function (b) { b.remove(); });
  sheet.setConditionalFormatRules([]);

  aturUkuran_(sheet, total, n);

  // Header
  sheet.getRange(hr, 1, 1, n).setValues([cfg.judul]);

  // Seluruh tabel
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

  // Lebar kolom
  cfg.lebar.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });

  // Kolom rata tengah
  (cfg.tengah || []).forEach(function (c) {
    sheet.getRange(hr + 1, c, total - hr, 1).setHorizontalAlignment('center');
  });

  if (cfg.tinggiBaris) sheet.setRowHeights(hr + 1, total - hr, cfg.tinggiBaris);

  sheet.setFrozenRows(hr);
  sheet.setHiddenGridlines(true);
  if (cfg.warnaTab) sheet.setTabColor(cfg.warnaTab);
}

/** Menyesuaikan jumlah baris dan kolom tab agar tidak ada ruang kosong berlebih */
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
  return sheet.getRange(a1).getValues().some(function (baris) {
    return baris.some(function (sel) { return sel !== ''; });
  });
}

function urutkanTab_(ss) {
  ['Rekap', 'Absensi', 'Jadwal', 'Ustadz', 'Pengaturan', 'Admin'].forEach(function (nama, i) {
    const sh = ss.getSheetByName(nama);
    if (sh) {
      ss.setActiveSheet(sh);
      ss.moveActiveSheet(i + 1);
    }
  });
}

function hapusLembarKosong_(ss) {
  ['Sheet1', 'Sheet 1', 'Lembar1', 'Lembar 1'].forEach(function (nama) {
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
