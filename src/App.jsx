import { useEffect, useState } from 'react'
import './style.css'

const API = import.meta.env.VITE_API_URL
const isConfigured = API && !API.includes('GANTI_DENGAN_ID_ANDA')

async function api(body) {
  if (!isConfigured) {
    throw new Error('Sistem presensi belum terhubung. Silakan hubungi admin.')
  }
  const r = await fetch(API, body ? { method: 'POST', body: JSON.stringify(body) } : {})
  const j = await r.json()
  if (j.error) throw new Error(j.error)
  return j
}

function formatTanggalIndo(tglStr, hariStr) {
  if (!tglStr) return ''
  try {
    const parts = String(tglStr).split('-')
    if (parts.length === 3) {
      const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      const bIndex = parseInt(parts[1], 10) - 1
      const bNama = bulanNama[bIndex] || parts[1]
      const tglFormatted = `${parseInt(parts[2], 10)} ${bNama} ${parts[0]}`
      return hariStr ? `${hariStr}, ${tglFormatted}` : tglFormatted
    }
  } catch (e) {}
  return hariStr ? `${hariStr}, ${tglStr}` : String(tglStr)
}

function formatBulanIndo(yyyyMm) {
  if (!yyyyMm) return ''
  const parts = String(yyyyMm).split('-')
  if (parts.length === 2) {
    const bulanFull = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const bIndex = parseInt(parts[1], 10) - 1
    return `${bulanFull[bIndex] || parts[1]} ${parts[0]}`
  }
  return String(yyyyMm)
}

function geserBulan(yyyyMm, delta) {
  const parts = String(yyyyMm).split('-').map(Number)
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  const d = new Date(parts[0], parts[1] - 1 + delta, 1)
  const newY = d.getFullYear()
  const newM = String(d.getMonth() + 1).padStart(2, '0')
  return `${newY}-${newM}`
}

function sanitizeErrMsg(msg) {
  if (!msg) return 'Terjadi kendala saat memproses data. Silakan coba kembali.'
  const str = String(msg)
  if (/database|spreadsheet|sheet|apps script|google|gas|script|endpoint|api/i.test(str)) {
    return 'Terjadi kendala pada jaringan server. Silakan coba kembali.'
  }
  return str
}

/* ================= SVG VECTOR ICONS (Bebas Emoji 100%) ================= */
function IconHourglass({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  )
}

function IconCheck({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconCheckCircle({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconClock({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconCalendar({ size = 13, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconShield({ size = 11, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconBadgeCheck({ size = 11, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function IconAlertCircle({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconDownload({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconFileText({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconSettings({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconLogOut({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconLock({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconChevronDown({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconMenu({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconClose({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconWhatsApp({ size = 19, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function IconChevronRight({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconChevronLeft({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconSearch({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconEye({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function IconSpinner({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function getInitials(name) {
  if (!name) return 'U'
  const parts = name.replace(/^Ust(\.|adz)?\s+/i, '').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/* ================= HOOK: LIVE COUNTDOWN TIMER ================= */
function useCountdown(info) {
  const [cd, setCd] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    title: 'Waktu Sholat',
    tagText: 'Jadwal',
    targetType: 'closed'
  })

  useEffect(() => {
    if (!info) return

    function hitung() {
      const now = new Date()
      const sholatNama = info.sholat || 'Sholat'
      const [bH, bM] = (info.buka || '04:15').split(':').map(Number)
      const [lH, lM] = (info.batas || '04:45').split(':').map(Number)
      const [tH, tM] = (info.tutup || '05:30').split(':').map(Number)

      const openToday = new Date(now)
      openToday.setHours(bH, bM, 0, 0)

      const limitToday = new Date(now)
      limitToday.setHours(lH, lM, 0, 0)

      const closeToday = new Date(now)
      closeToday.setHours(tH, tM, 0, 0)

      let targetDate
      let title = ''
      let tagText = ''
      let targetType = ''

      if (now < openToday) {
        targetDate = openToday
        title = `Dibuka Dalam (${sholatNama})`
        tagText = 'Buka ' + (info.buka || '04:15') + ' WIB'
        targetType = 'pending'
      } else if (now >= openToday && now < limitToday) {
        targetDate = limitToday
        title = `Sisa Waktu Tepat (${sholatNama})`
        tagText = 'Tepat s/d ' + (info.batas || '04:45')
        targetType = 'ontime'
      } else if (now >= limitToday && now < closeToday) {
        targetDate = closeToday
        title = `Sisa Waktu Formulir (${sholatNama})`
        tagText = 'Tutup ' + (info.tutup || '05:30') + ' WIB'
        targetType = 'late'
      } else {
        const openTomorrow = new Date(openToday)
        openTomorrow.setDate(openTomorrow.getDate() + 1)
        targetDate = openTomorrow
        title = `Sesi ${sholatNama} Selesai`
        tagText = 'Buka ' + (info.buka || '04:15') + ' WIB'
        targetType = 'closed'
      }

      const diff = Math.max(0, targetDate - now)
      const totalSec = Math.floor(diff / 1000)
      const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0')
      const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
      const seconds = String(totalSec % 60).padStart(2, '0')

      setCd({
        hours,
        minutes,
        seconds,
        title,
        tagText,
        targetType
      })
    }

    hitung()
    const interval = setInterval(hitung, 1000)
    return () => clearInterval(interval)
  }, [info])

  return cd
}

const KET = ['Hadir', 'Sakit', 'Izin', 'Alfa']
const DAFTAR_SHOLAT_DEFAULT = ['Shubuh', 'Dhuhur', 'Ashar', 'Magrib', 'Isya']

/* ================= COMPONENT: MODERN POP-UP STATUS & KONFIRMASI ================= */
function StatusModal({ modal, onClose, onConfirm }) {
  if (!modal || !modal.open) return null

  const isSuccess = modal.type === 'success'
  const isError = modal.type === 'error'
  const isConfirm = modal.type === 'confirm'

  return (
    <div className="status-modal-backdrop" onClick={onClose}>
      <div className="status-modal-card" onClick={e => e.stopPropagation()}>
        <div className={`status-modal-icon-ring ${modal.type}`}>
          {isSuccess && <IconCheckCircle size={30} className="icon-pop" />}
          {isError && <IconAlertCircle size={30} className="icon-pop" />}
          {isConfirm && <IconShield size={28} className="icon-pop" />}
        </div>

        <h3 className={`status-modal-title ${modal.type}`}>{modal.title}</h3>
        <p className="status-modal-message">{modal.message}</p>

        {isSuccess && modal.data && (
          <div className="status-modal-detail-box">
            {modal.data.sholat && (
              <div className="detail-row">
                <span className="detail-lbl">Waktu Sholat:</span>
                <span className="detail-val" style={{ fontWeight: '800', color: 'var(--emerald-800)' }}>
                  Sholat {modal.data.sholat}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-lbl">Status Jam:</span>
              <span className={`detail-pill ${modal.data.status === 'Tepat Waktu' ? 'ontime' : 'late'}`}>
                {modal.data.status} {modal.data.jam ? `(${modal.data.jam} WIB)` : ''}
              </span>
            </div>
            {modal.data.pengisi && (
              <div className="detail-row">
                <span className="detail-lbl">Pengisi:</span>
                <span className="detail-val">{modal.data.pengisi}</span>
              </div>
            )}
            {modal.data.tanggal && (
              <div className="detail-row">
                <span className="detail-lbl">Tanggal:</span>
                <span className="detail-val">{modal.data.tanggal}</span>
              </div>
            )}
          </div>
        )}

        {isConfirm && modal.summary && (
          <div className="status-modal-summary-grid">
            <div className="summary-item hadir">
              <span className="summary-val">{modal.summary.hadir || 0}</span>
              <span className="summary-lbl">Hadir</span>
            </div>
            <div className="summary-item sakit">
              <span className="summary-val">{modal.summary.sakit || 0}</span>
              <span className="summary-lbl">Sakit</span>
            </div>
            <div className="summary-item izin">
              <span className="summary-val">{modal.summary.izin || 0}</span>
              <span className="summary-lbl">Izin</span>
            </div>
            <div className="summary-item alfa">
              <span className="summary-val">{modal.summary.alfa || 0}</span>
              <span className="summary-lbl">Alfa</span>
            </div>
          </div>
        )}

        <div className="status-modal-actions">
          {isConfirm ? (
            <>
              <button
                type="button"
                className="modal-btn secondary"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                type="button"
                className="modal-btn primary"
                onClick={onConfirm}
              >
                Ya, Kirim Sekarang
              </button>
            </>
          ) : (
            <button
              type="button"
              className="modal-btn primary single"
              onClick={onClose}
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AppFooter({ subtitle }) {
  return (
    <footer className="app-global-footer">
      <div className="form-footer-credits" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontWeight: '800', letterSpacing: '0.04em' }}>PONDOK PUTRA</span>
        <span style={{ fontSize: '10px', opacity: 0.9 }}>YAYASAN PONDOK PESANTREN SALAFIYAH AL-FALAH PUTAK</span>
        <span style={{ fontSize: '10.5px', marginTop: '2px', color: 'var(--emerald-800)', fontWeight: '700' }}>
          {subtitle || "Presensi Korlap Sholat Jama'ah"}
        </span>
      </div>
      <p className="app-copyright-footer">
        © JAKASTRA OFFICIAL 2026. All Rights Reserved.
      </p>
    </footer>
  )
}

export default function App() {
  const [admin, setAdmin] = useState(location.hash === '#admin')
  const [tok, setTok] = useState(() => sessionStorage.getItem('tok') || '')
  const [menuOpen, setMenuOpen] = useState(false)
  const [laporOpen, setLaporOpen] = useState(false)
  const [namaLapor, setNamaLapor] = useState('')
  const [deskripsiLapor, setDeskripsiLapor] = useState('')
  const [laporErr, setLaporErr] = useState('')
  const [liveClock, setLiveClock] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setLiveClock(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB')
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const f = () => setAdmin(location.hash === '#admin')
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  const handleKeluarAdmin = () => {
    sessionStorage.removeItem('tok')
    setTok('')
    setMenuOpen(false)
    window.location.hash = ''
  }

  const handleKirimWA = e => {
    e.preventDefault()
    if (!namaLapor.trim()) {
      setLaporErr('Nama Petugas / Pelapor wajib diisi.')
      return
    }
    if (!deskripsiLapor.trim()) {
      setLaporErr('Deskripsi pengaduan wajib diisi.')
      return
    }
    setLaporErr('')

    const now = new Date()
    const waktuStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ' (' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB)'

    const pesan = `*PENGADUAN KORLAP SHOLAT JAMA'AH*\n*PONDOK PUTRA*\n*YAYASAN PONDOK PESANTREN SALAFIYAH AL-FALAH PUTAK*\n----------------------------------------\n*Nama Petugas:* ${namaLapor.trim()}\n*Waktu:* ${waktuStr}\n\n*Deskripsi Pengaduan:*\n${deskripsiLapor.trim()}\n----------------------------------------\n_Dikirim via Sistem Presensi Korlap Sholat Jama'ah_`

    const url = `https://wa.me/6282118702717?text=${encodeURIComponent(pesan)}`
    window.open(url, '_blank')
    setLaporOpen(false)
    setDeskripsiLapor('')
  }

  return (
    <div className="mobile-viewport">
      {/* 1. Sticky Header Bar */}
      <header className="sticky-top-appbar">
        <div className="brand-identity">
          <div className="brand-emblem-wrap">
            <img src="/logo.png" alt="Logo Al-Falah" />
          </div>
          <div className="brand-text-col">
            <span className="brand-main-title">
              {admin ? 'DASHBOARD ADMIN' : "KORLAP SHOLAT JAMA'AH"}
            </span>
            <span className="brand-sub-title">
              Pondok Putra • Al-Falah Putak
            </span>
          </div>
        </div>

        <div className="header-right-group">
          <div className="clock-capsule">
            <span className="clock-live-dot" />
            <span>{liveClock || 'WIB'}</span>
          </div>
          <button
            type="button"
            className={`burger-btn ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup Menu' : 'Buka Menu'}
          >
            {menuOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </header>

      {/* 2. Top-Down Dropdown Menu */}
      <div
        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`menu-top-sheet ${menuOpen ? 'open' : ''}`}>
        <div className="menu-sheet-inner">
          <p className="menu-section-label">LAYANAN & NAVIGASI</p>

          <div className="menu-sheet-grid">
            <button
              type="button"
              className="drawer-nav-item primary"
              onClick={() => {
                setMenuOpen(false)
                setLaporOpen(true)
              }}
            >
              <div className="drawer-item-icon whatsapp">
                <IconWhatsApp size={22} />
              </div>
              <div className="drawer-item-text">
                <span className="drawer-item-title">Laporkan Kendala</span>
                <span className="drawer-item-desc">Pengaduan via WA (0821-1870-2717)</span>
              </div>
              <IconChevronRight size={16} className="drawer-chevron" />
            </button>

            {admin ? (
              <>
                <button
                  type="button"
                  className="drawer-nav-item"
                  onClick={() => {
                    setMenuOpen(false)
                    window.location.hash = ''
                  }}
                >
                  <div className="drawer-item-icon admin">
                    <IconCalendar size={20} />
                  </div>
                  <div className="drawer-item-text">
                    <span className="drawer-item-title">Kembali ke Presensi</span>
                    <span className="drawer-item-desc">Buka formulir presensi sholat jama'ah</span>
                  </div>
                  <IconChevronRight size={16} className="drawer-chevron" />
                </button>

                <button
                  type="button"
                  className="drawer-nav-item logout-danger"
                  onClick={handleKeluarAdmin}
                >
                  <div className="drawer-item-icon logout">
                    <IconLogOut size={20} />
                  </div>
                  <div className="drawer-item-text">
                    <span className="drawer-item-title">Keluar Admin</span>
                    <span className="drawer-item-desc">Keluar dari sesi administrator</span>
                  </div>
                  <IconChevronRight size={16} className="drawer-chevron" />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="drawer-nav-item"
                onClick={() => {
                  setMenuOpen(false)
                  window.location.hash = '#admin'
                }}
              >
                <div className="drawer-item-icon admin">
                  <IconShield size={20} />
                </div>
                <div className="drawer-item-text">
                  <span className="drawer-item-title">Login Administrator</span>
                  <span className="drawer-item-desc">Kelola jadwal, rekap & konfigurasi</span>
                </div>
                <IconChevronRight size={16} className="drawer-chevron" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      {admin ? (
        <Admin tok={tok} setTok={setTok} onLogout={handleKeluarAdmin} />
      ) : (
        <Form />
      )}

      {/* Modal WhatsApp Form */}
      {laporOpen && (
        <div className="modal-backdrop" onClick={() => setLaporOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge whatsapp">
                  <IconWhatsApp size={22} />
                </div>
                <div>
                  <h3 className="modal-title">Formulir Pengaduan</h3>
                  <p className="modal-subtitle">Terhubung langsung ke WA Admin (0821-1870-2717)</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setLaporOpen(false)}
                aria-label="Tutup"
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleKirimWA} className="modal-form-body">
              <div className="modal-field-group">
                <label className="modal-label">
                  Nama Petugas / Pelapor <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Contoh: Hairul Fadli / Petugas Jaga Malam"
                  value={namaLapor}
                  onChange={e => setNamaLapor(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">
                  Deskripsi Pengaduan / Masalah <span className="req-star">*</span>
                </label>
                <textarea
                  className="modal-textarea"
                  rows={4}
                  placeholder="Jelaskan kendala saat bertugas keliling mushola, izin mendadak, atau kendala lapangan..."
                  value={deskripsiLapor}
                  onChange={e => setDeskripsiLapor(e.target.value)}
                  required
                />
              </div>

              {laporErr && (
                <div className="notice-strip danger" style={{ padding: '8px 12px', marginBottom: '12px' }}>
                  <div className="notice-icon-wrap"><IconAlertCircle size={15} /></div>
                  <div>{laporErr}</div>
                </div>
              )}

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setLaporOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="modal-wa-submit-btn"
                >
                  <IconWhatsApp size={17} />
                  <span>Kirim ke WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const CACHE_KEY_INFO = 'korlap_info_cache'

function getLocalInfoCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_INFO)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function setLocalInfoCache(data) {
  try {
    localStorage.setItem(CACHE_KEY_INFO, JSON.stringify(data))
  } catch (e) {}
}

/* ================= FORM KORLAP SHOLAT JAMA'AH ================= */
function Form() {
  const [info, setInfo] = useState(() => getLocalInfoCache())
  const [item, setItem] = useState(() => {
    const cached = getLocalInfoCache()
    if (cached?.tim) {
      return Object.fromEntries(cached.tim.map(t => [t.nama, { ket: 'Hadir', alasan: '' }]))
    }
    return {}
  })
  const [pengisi, setPengisi] = useState(() => {
    const cached = getLocalInfoCache()
    if (cached?.tim) {
      return (cached.tim.find(t => t.petugas) || cached.tim[0] || {}).nama || ''
    }
    return ''
  })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [statusModal, setStatusModal] = useState({ open: false, type: 'success', title: '', message: '', data: null })
  const [confirmModal, setConfirmModal] = useState({ open: false, summary: null })

  // Hanya memuat 1 waktu sholat yang sedang aktif saat ini (tanpa parameter, server otomatis tentukan)
  const muatDataSholatAktif = () => {
    setBusy(true)
    setErr('')
    setDone(null)
    fetch(API)
      .then(res => res.json())
      .then(i => {
        if (i.error) throw new Error(i.error)
        setInfo(i)
        setLocalInfoCache(i)
        const list = i.tim || []
        setItem(Object.fromEntries(list.map(t => [t.nama, { ket: 'Hadir', alasan: '' }])))
        setPengisi((list.find(t => t.petugas) || list[0] || {}).nama || '')
      })
      .catch(e => setErr(e.message))
      .finally(() => setBusy(false))
  }

  useEffect(() => {
    muatDataSholatAktif()
  }, [])

  const countdown = useCountdown(info)
  const ubah = (n, p) => setItem(s => ({ ...s, [n]: { ...(s[n] || { ket: 'Hadir', alasan: '' }), ...p } }))

  async function kirim() {
    setErr('')
    for (const n in item) {
      if ((item[n].ket === 'Sakit' || item[n].ket === 'Izin') && !item[n].alasan.trim()) {
        const msg = 'Alasan ' + item[n].ket.toLowerCase() + ' untuk ' + n + ' wajib diisi.'
        setErr(msg)
        setStatusModal({
          open: true,
          type: 'error',
          title: 'Isian Belum Lengkap',
          message: msg
        })
        return
      }
    }

    const counts = { hadir: 0, sakit: 0, izin: 0, alfa: 0 }
    ;(info?.tim || []).forEach(t => {
      const k = (item[t.nama]?.ket || 'Hadir').toLowerCase()
      if (counts[k] !== undefined) counts[k]++
    })

    setConfirmModal({
      open: true,
      summary: counts
    })
  }

  async function jalankanKirim() {
    setConfirmModal({ open: false, summary: null })
    setBusy(true)
    setErr('')
    try {
      const payload = {
        aksi: 'kirim',
        sholat: info.sholat,
        pengisi,
        items: (info.tim || []).map(t => ({ nama: t.nama, ...(item[t.nama] || { ket: 'Hadir', alasan: '' }) }))
      }
      const res = await api(payload)
      setDone(res)
      setStatusModal({
        open: true,
        type: 'success',
        title: 'Presensi Berhasil Terkirim',
        message: `Jazakumullahu khairan. Laporan kehadiran Korlap Sholat ${info.sholat} telah berhasil tercatat.`,
        data: {
          sholat: info.sholat,
          status: res.status || 'Tepat Waktu',
          jam: res.jam || info.jam,
          pengisi: pengisi,
          tanggal: formatTanggalIndo(info.tanggal, info.hari)
        }
      })
    } catch (e) {
      const errorMsg = sanitizeErrMsg(e.message)
      setErr(errorMsg)
      setStatusModal({
        open: true,
        type: 'error',
        title: 'Gagal Mengirim',
        message: errorMsg
      })
    } finally {
      setBusy(false)
    }
  }

  if (!info) {
    return (
      <div className="scroll-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="Logo Al-Falah"
          style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '16px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}
        />
        <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--slate-900)' }}>
          Presensi Korlap Sholat Jama'ah
        </h2>
        <div style={{ marginTop: '3px', marginBottom: '24px', lineHeight: '1.4' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--slate-800)' }}>PONDOK PUTRA</div>
          <div style={{ fontSize: '10.5px', color: 'var(--slate-500)' }}>YAYASAN PONDOK PESANTREN SALAFIYAH AL-FALAH PUTAK</div>
        </div>
        {err ? (
          <div className="notice-strip danger" style={{ textAlign: 'left', width: '100%' }}>
            <div className="notice-icon-wrap"><IconAlertCircle size={18} /></div>
            <div>{err}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-700)', fontSize: '13px', fontWeight: '600' }}>
            <IconSpinner size={18} className="spinner-spin" />
            <span>Memuat jadwal sholat jama'ah...</span>
          </div>
        )}
      </div>
    )
  }

  const tutup = info.status !== 'buka'
  const tim = info.tim || []
  const submitterObj = tim.find(t => t.nama === pengisi)

  return (
    <>
      <div className="scroll-body">
        {/* Hero Card Waktu Sholat yang Sedang Berjalan */}
        <div className="unified-hero">
          <div className="hero-meta-bar">
            <span className="session-chip">
              <IconShield size={11} />
              Tugas {info.sholat}
            </span>
            <div className="status-glow-pill">
              <span className={`status-dot-sm ${info.status === 'buka' ? 'open' : info.status === 'belum' ? 'pending' : 'closed'}`} />
              <span>
                {info.status === 'buka' ? 'Formulir Dibuka' : info.status === 'belum' ? 'Belum Buka' : 'Formulir Ditutup'}
              </span>
            </div>
          </div>

          {/* Jam Hitungan Mundur */}
          <div className="hero-timer-panel">
            <div className="timer-label-row">
              <span className="timer-target-title">
                <IconHourglass size={13} />
                <span>{countdown.title}</span>
              </span>
              <span className="timer-sub-tag">
                {countdown.tagText}
              </span>
            </div>

            <div className="timer-digits-row">
              <div className="timer-unit-card">
                <span className="timer-val">{countdown.hours}</span>
                <span className="timer-unit-label">Jam</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit-card">
                <span className="timer-val">{countdown.minutes}</span>
                <span className="timer-unit-label">Menit</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit-card">
                <span className="timer-val">{countdown.seconds}</span>
                <span className="timer-unit-label">Detik</span>
              </div>
            </div>
          </div>

          <div className="hero-footer-bar">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconCalendar size={12} />
              {info.hari}, {info.tanggal}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <IconClock size={12} />
              {info.buka} - {info.tutup} WIB
            </span>
          </div>
        </div>

        {/* Notice Banners */}
        {done ? (
          <div className="notice-strip success">
            <div className="notice-icon-wrap"><IconCheckCircle size={18} /></div>
            <div>Laporan {info.sholat} terkirim ({done.status}, {done.jam} WIB). Jazakumullahu khairan.</div>
          </div>
        ) : info.sudah ? (
          <div className="notice-strip success">
            <div className="notice-icon-wrap"><IconCheckCircle size={18} /></div>
            <div>Laporan kehadiran Korlap {info.sholat} hari ini sudah selesai dikirim.</div>
          </div>
        ) : tutup ? (
          <div className="notice-strip warning">
            <div className="notice-icon-wrap"><IconAlertCircle size={18} /></div>
            <div>
              {info.status === 'belum'
                ? `Formulir Sholat ${info.sholat} akan mulai dibuka pukul ${info.buka} WIB.`
                : `Formulir Sholat ${info.sholat} ditutup setelah jam ${info.tutup} WIB.`}
            </div>
          </div>
        ) : null}

        {/* Section Header */}
        <div className="list-section-header">
          <div className="list-section-title">
            <span>Petugas Korlap {info.sholat}</span>
            <span className="badge-count">{tim.length}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: '600' }}>
            Setiap Hari
          </span>
        </div>

        {/* Grouped Officers List */}
        <div className="grouped-list-card">
          {tim.map(t => {
            const currentItem = item[t.nama] || { ket: 'Hadir', alasan: '' }
            const isKoor = t.peran === 'Koordinator' || t.peran === 'Ketua'
            const isOfficial = t.petugas

            return (
              <div className="officer-row-item" key={t.nama}>
                <div className="officer-top-info">
                  <div className="officer-avatar-name">
                    <div className={`avatar-initial ${isKoor ? 'ketua' : isOfficial ? 'petugas' : ''}`}>
                      {getInitials(t.nama)}
                    </div>
                    <div className="name-role-col">
                      <span className="officer-fullname">{t.nama}</span>
                      <div className="role-pill-tags">
                        {isKoor && (
                          <span className="mini-role-pill ketua">
                            <IconShield size={9} />
                            Koordinator
                          </span>
                        )}
                        {isOfficial && !isKoor && (
                          <span className="mini-role-pill petugas">
                            <IconBadgeCheck size={9} />
                            Petugas Absen
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Segmented Pills (Hadir, Sakit, Izin, Alfa) */}
                <div className="segmented-pill-bar">
                  {KET.map(k => {
                    const isSelected = currentItem.ket === k
                    return (
                      <button
                        key={k}
                        type="button"
                        className={`pill-option-btn ${k} ${isSelected ? 'active' : ''}`}
                        onClick={() => ubah(t.nama, { ket: k })}
                      >
                        {isSelected && <IconCheck size={11} />}
                        <span>{k}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Reason Drawer */}
                {(currentItem.ket === 'Sakit' || currentItem.ket === 'Izin') && (
                  <div className="reason-drawer">
                    <input
                      type="text"
                      className="inline-reason-input"
                      placeholder={`Alasan ${currentItem.ket.toLowerCase()} untuk ${t.nama}...`}
                      value={currentItem.alasan}
                      onChange={e => ubah(t.nama, { alasan: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submitter Selection Card */}
        <div className="submitter-box">
          <label className="submitter-label">Nama Pengisi Laporan</label>
          <div className="select-native-wrap">
            <select
              className="select-native"
              value={pengisi}
              onChange={e => setPengisi(e.target.value)}
            >
              {tim.map(t => (
                <option key={t.nama} value={t.nama}>
                  {t.nama} {t.petugas ? '— (Petugas Resmi)' : (t.peran === 'Koordinator' || t.peran === 'Ketua') ? '— (Koordinator)' : ''}
                </option>
              ))}
            </select>
            <div className="select-chevron">
              <IconChevronDown size={15} />
            </div>
          </div>
          <p className="submitter-hint">
            {submitterObj && submitterObj.petugas
              ? 'Petugas yang dipilih adalah petugas absen resmi terjadwal.'
              : 'Mengisi form sebagai pengganti akan tercatat otomatis di laporan.'}
          </p>
        </div>

        {/* Error message */}
        {err && (
          <div className="notice-strip danger" style={{ marginTop: '14px' }}>
            <div className="notice-icon-wrap"><IconAlertCircle size={16} /></div>
            <div>{err}</div>
          </div>
        )}

        {/* Action Button */}
        <div className="submit-action-area">
          <button
            type="button"
            className="native-submit-btn"
            disabled={busy || tutup || info.sudah || !!done}
            onClick={kirim}
          >
            {busy ? (
              <>
                <IconSpinner size={18} className="spinner-spin" />
                <span>Mengirim Laporan...</span>
              </>
            ) : done ? (
              <>
                <IconCheckCircle size={18} />
                <span>Absen {info.sholat} Telah Terkirim</span>
              </>
            ) : info.sudah ? (
              <>
                <IconCheckCircle size={18} />
                <span>{info.sholat} Sudah Diabsen Hari Ini</span>
              </>
            ) : tutup ? (
              <>
                <IconLock size={16} />
                <span>Formulir Terkunci (Buka {info.buka} WIB)</span>
              </>
            ) : (
              <>
                <IconCheck size={18} />
                <span>Kirim Presensi Korlap {info.sholat}</span>
              </>
            )}
          </button>
          
          {tutup && !info.sudah && (
            <p className="submit-lock-notice">
              Presensi {info.sholat} otomatis terbuka pada pukul {info.buka} s/d {info.tutup} WIB.
            </p>
          )}

          <AppFooter subtitle={`Presensi Korlap Sholat Jama'ah`} />
        </div>
      </div>

      <StatusModal
        modal={statusModal}
        onClose={() => setStatusModal({ ...statusModal, open: false })}
      />

      <StatusModal
        modal={{
          open: confirmModal.open,
          type: 'confirm',
          title: `Kirim Presensi ${info.sholat}?`,
          message: `Pastikan data kehadiran personil Korlap Sholat ${info.sholat} hari ini sudah sesuai.`,
          summary: confirmModal.summary
        }}
        onClose={() => setConfirmModal({ open: false, summary: null })}
        onConfirm={jalankanKirim}
      />
    </>
  )
}

/* ================= ADMIN DASHBOARD ================= */
function Admin({ tok, setTok, onLogout }) {
  const [f, setF] = useState({ email: '', pin: '' })
  const [showPin, setShowPin] = useState(false)
  const [err, setErr] = useState('')
  const [d, setD] = useState(null)
  const [tab, setTab] = useState('hari')
  const [filterSholat, setFilterSholat] = useState('Semua')
  const [bulan, setBulan] = useState('')
  const [cariRekap, setCariRekap] = useState('')
  const [filterRekap, setFilterRekap] = useState('semua')
  const [atur, setAtur] = useState({})
  const [busy, setBusy] = useState(false)
  const [statusModal, setStatusModal] = useState({ open: false, type: 'success', title: '', message: '' })

  const keluar = () => {
    sessionStorage.removeItem('tok')
    setTok('')
    setD(null)
    if (onLogout) onLogout()
  }

  const muat = t => {
    setBusy(true)
    api({ aksi: 'data', token: t })
      .then(x => {
        setD(x)
        setAtur(x.atur || {})
      })
      .catch(e => {
        setErr(e.message)
        keluar()
      })
      .finally(() => setBusy(false))
  }

  useEffect(() => {
    if (tok) {
      muat(tok)
    } else {
      setD(null)
    }
  }, [tok])

  async function masuk(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const r = await api({ aksi: 'login', ...f })
      sessionStorage.setItem('tok', r.token)
      setTok(r.token)
      muat(r.token)
    } catch (x) {
      const msg = sanitizeErrMsg(x.message || 'Email atau PIN salah. Silakan coba kembali.')
      setErr(msg)
      setStatusModal({
        open: true,
        type: 'error',
        title: 'Login Gagal',
        message: msg
      })
    } finally {
      setBusy(false)
    }
  }

  async function simpan() {
    setErr('')
    setBusy(true)
    try {
      const res = await api({ aksi: 'simpan', token: tok, atur })
      setStatusModal({
        open: true,
        type: 'success',
        title: 'Pengaturan Disimpan',
        message: res.pesan || 'Jam operasional presensi sholat berhasil diperbarui.'
      })
      muat(tok)
    } catch (e) {
      const msg = sanitizeErrMsg(e.message || 'Terjadi gangguan saat menyimpan pengaturan.')
      setErr(msg)
      setStatusModal({
        open: true,
        type: 'error',
        title: 'Gagal Menyimpan',
        message: msg
      })
    } finally {
      setBusy(false)
    }
  }

  if (!tok) {
    return (
      <div className="login-page-wrap">
        <div className="admin-glass-card">
          <div className="login-header">
            <div className="login-logo-badge">
              <img src="/logo.png" alt="Logo Al-Falah" />
            </div>
            <h1 className="login-title">Login Administrator</h1>
            <div className="login-subtitle" style={{ marginTop: '5px', lineHeight: '1.4' }}>
              <div style={{ fontWeight: '800', color: 'var(--slate-800)', fontSize: '12px' }}>PONDOK PUTRA</div>
              <div style={{ fontSize: '10px', color: 'var(--slate-500)' }}>YAYASAN PONDOK PESANTREN SALAFIYAH AL-FALAH PUTAK</div>
            </div>
          </div>

          <form onSubmit={masuk}>
            <div className="login-field">
              <label className="login-field-label">
                Email Admin
              </label>
              <input
                type="email"
                className="inline-reason-input login-input"
                placeholder="admin@email.com"
                value={f.email}
                onChange={e => setF({ ...f, email: e.target.value })}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-field-label">
                PIN 4 Digit
              </label>
              <div className="input-eye-wrap">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  className="inline-reason-input input-with-eye login-input"
                  placeholder="••••"
                  value={f.pin}
                  onChange={e => setF({ ...f, pin: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPin(!showPin)}
                  aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                >
                  {showPin ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {err && (
              <div className="notice-strip danger login-error-notice">
                <div className="notice-icon-wrap"><IconAlertCircle size={15} /></div>
                <div>{err}</div>
              </div>
            )}

            <button type="submit" className="native-submit-btn login-submit-btn" disabled={busy}>
              {busy ? (
                <>
                  <IconSpinner size={16} className="spinner-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk Panel</span>
              )}
            </button>
          </form>
        </div>
        <AppFooter subtitle="Dashboard Admin" />
        <StatusModal modal={statusModal} onClose={() => setStatusModal({ ...statusModal, open: false })} />
      </div>
    )
  }

  if (!d) {
    return (
      <div className="scroll-body">
        <div className="admin-wrap" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <IconSpinner size={24} className="spinner-spin" style={{ color: 'var(--emerald-700)', marginBottom: '10px' }} />
          <p style={{ fontSize: '13px', color: 'var(--slate-500)' }}>{err || 'Memuat data dashboard...'}</p>
        </div>
        <AppFooter subtitle="Dashboard Admin" />
      </div>
    )
  }

  const rows = d.rows || []
  const b = bulan || d.tgl.slice(0, 7)
  const hariIniSemua = rows.filter(r => r.tanggal === d.tgl)
  const hariIni = filterSholat === 'Semua' 
    ? hariIniSemua 
    : hariIniSemua.filter(r => r.sholat === filterSholat)

  const bl = rows.filter(r => r.tanggal.startsWith(b))

  const rek = {}
  bl.forEach(r => {
    rek[r.nama] ??= { Hadir: 0, Terlambat: 0, Sakit: 0, Izin: 0, Alfa: 0 }
    if (rek[r.nama][r.ket] !== undefined) {
      rek[r.nama][r.ket]++
    }
    if (r.ket === 'Hadir' && r.waktu === 'Terlambat') {
      rek[r.nama].Terlambat++
    }
  })

  const totalStats = Object.values(rek).reduce(
    (acc, cur) => {
      acc.Hadir += cur.Hadir || 0
      acc.Terlambat += cur.Terlambat || 0
      acc.Sakit += cur.Sakit || 0
      acc.Izin += cur.Izin || 0
      acc.Alfa += cur.Alfa || 0
      return acc
    },
    { Hadir: 0, Terlambat: 0, Sakit: 0, Izin: 0, Alfa: 0 }
  )

  const unduh = () => {
    const h = 'Tanggal,Hari,Sholat,Nama,Keterangan,Alasan,Status Waktu,Diisi Oleh,Pengganti\n'
    const c = bl.map(r => [r.tanggal, r.hari, r.sholat, r.nama, r.ket, r.alasan, r.waktu, r.pengisi, r.pengganti]
      .map(x => '"' + String(x || '').replace(/"/g, '""') + '"').join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\ufeff' + h + c], { type: 'text/csv' }))
    a.download = 'absensi-korlap-sholat-' + b + '.csv'
    a.click()
  }

  const hariIniStats = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 }
  hariIni.forEach(r => {
    if (hariIniStats[r.ket] !== undefined) {
      hariIniStats[r.ket]++
    }
  })

  // Perhitungan Rekap Bulanan
  const totalTugasBulanIni = totalStats.Hadir + totalStats.Sakit + totalStats.Izin + totalStats.Alfa
  const rateKehadiranBulanIni = totalTugasBulanIni > 0 ? Math.round((totalStats.Hadir / totalTugasBulanIni) * 100) : 0

  const allRekapNames = Object.keys(rek).sort()
  const filteredUstadz = allRekapNames.filter(n => {
    const u = rek[n]
    const tot = (u.Hadir || 0) + (u.Sakit || 0) + (u.Izin || 0) + (u.Alfa || 0)
    const rRate = tot > 0 ? Math.round((u.Hadir / tot) * 100) : 0

    if (cariRekap.trim() && !n.toLowerCase().includes(cariRekap.trim().toLowerCase())) {
      return false
    }

    if (filterRekap === 'alfa' && (u.Alfa || 0) === 0) return false
    if (filterRekap === 'absen' && ((u.Sakit || 0) === 0 && (u.Izin || 0) === 0)) return false
    if (filterRekap === 'rajin' && (rRate < 100 || tot === 0)) return false

    return true
  })

  const daftarSholatAdmin = ['Semua', 'Shubuh', 'Dhuhur', 'Ashar', 'Magrib', 'Isya']

  return (
    <div className="scroll-body">
      {/* 1. Executive Admin Hero Card */}
      <div className="unified-hero admin-hero-card">
        <div className="hero-meta-bar">
          <span className="session-chip">
            <IconShield size={11} />
            Panel Admin Korlap
          </span>
        </div>

        <div className="admin-hero-main-row">
          <div>
            <span className="admin-hero-eyebrow">Pemantauan Presensi Sholat</span>
            <h2 className="admin-hero-heading">{formatTanggalIndo(d.tgl, d.hari)}</h2>
          </div>
          {hariIni.length > 0 && (
            <span className={`admin-hero-status-pill ${hariIni[0].waktu === 'Tepat Waktu' ? 'ontime' : 'late'}`}>
              {hariIni[0].waktu === 'Tepat Waktu' ? <IconCheckCircle size={13} /> : <IconAlertCircle size={13} />}
              <span>{hariIni[0].waktu}</span>
            </span>
          )}
        </div>

        {hariIniSemua.length > 0 ? (
          <div className="admin-hero-meta-box">
            <div className="meta-box-row">
              <span className="meta-box-label">
                <IconClock size={12} />
                <span>Terdata {hariIniSemua.length} laporan personil hari ini</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="admin-hero-meta-box pending">
            <span>Presensi sholat jama'ah hari ini belum dikirimkan oleh petugas.</span>
          </div>
        )}

        {/* 4 Hero Counters */}
        {hariIni.length > 0 && (
          <div className="admin-hero-stats-row">
            <div className="hero-stat-pill hadir">
              <span className="val">{hariIniStats.Hadir}</span>
              <span className="lbl">Hadir</span>
            </div>
            <div className="hero-stat-pill sakit">
              <span className="val">{hariIniStats.Sakit}</span>
              <span className="lbl">Sakit</span>
            </div>
            <div className="hero-stat-pill izin">
              <span className="val">{hariIniStats.Izin}</span>
              <span className="lbl">Izin</span>
            </div>
            <div className="hero-stat-pill alfa">
              <span className="val">{hariIniStats.Alfa}</span>
              <span className="lbl">Alfa</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Modern Segmented Tabs */}
      <nav className="segmented-admin-tabs">
        {[
          ['hari', 'Hari Ini', <IconCalendar size={14} key="t1" />],
          ['rekap', 'Rekap Bulanan', <IconFileText size={14} key="t2" />],
          ['atur', 'Setelan Waktu', <IconSettings size={14} key="t3" />]
        ].map(([k, n, icon]) => (
          <button
            key={k}
            type="button"
            className={`admin-tab-btn ${tab === k ? 'active' : ''}`}
            onClick={() => setTab(k)}
          >
            {icon}
            <span>{n}</span>
          </button>
        ))}
      </nav>

      {err && (
        <div className="notice-strip danger" style={{ marginBottom: '14px' }}>
          <div className="notice-icon-wrap"><IconAlertCircle size={16} /></div>
          <div>{err}</div>
        </div>
      )}

      {/* Tab 1: Hari Ini */}
      {tab === 'hari' && (
        <div className="admin-tab-content">
          {/* Filter Waktu Sholat di Admin */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '2px' }}>
            {daftarSholatAdmin.map(sh => (
              <button
                key={sh}
                type="button"
                onClick={() => setFilterSholat(sh)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid ' + (filterSholat === sh ? 'var(--emerald-600)' : 'var(--slate-200)'),
                  background: filterSholat === sh ? 'var(--emerald-50)' : '#ffffff',
                  color: filterSholat === sh ? 'var(--emerald-800)' : 'var(--slate-600)',
                  fontSize: '12px',
                  fontWeight: filterSholat === sh ? '800' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {sh}
              </button>
            ))}
          </div>

          {!hariIni.length ? (
            <div className="mobile-empty-card">
              <div className="empty-icon-ring">
                <IconCalendar size={28} />
              </div>
              <h4 className="empty-title">Belum Ada Presensi Masuk</h4>
              <p className="empty-subtitle">
                {filterSholat === 'Semua' 
                  ? "Belum ada laporan presensi sholat jama'ah untuk hari ini."
                  : `Belum ada laporan presensi untuk Sholat ${filterSholat} hari ini.`}
              </p>
            </div>
          ) : (
            <div className="mobile-officers-card">
              <div className="officers-card-header">
                <div>
                  <h3 className="officers-header-title">Petugas Korlap Hari Ini</h3>
                  <span className="officers-header-sub">{hariIni.length} data kehadiran ({filterSholat})</span>
                </div>
                <span className="officers-chip">{hariIni.length} Data</span>
              </div>

              <div className="mobile-officers-feed">
                {hariIni.map((r, idx) => {
                  const isHadir = r.ket === 'Hadir'
                  const isSakit = r.ket === 'Sakit'
                  const isIzin = r.ket === 'Izin'
                  const isAlfa = r.ket === 'Alfa'
                  const ketClass = r.ket.toLowerCase()

                  return (
                    <div className={`mobile-officer-item ${ketClass}`} key={r.nama + idx}>
                      <div className="officer-item-left">
                        <div className={`officer-avatar ${ketClass}`}>
                          {getInitials(r.nama)}
                        </div>
                        <div className="officer-item-details">
                          <span className="officer-fullname">{r.nama}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: '800', background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '2px 6px', borderRadius: '4px' }}>
                              {r.sholat || 'Sholat'}
                            </span>
                            {isHadir && (
                              <span className="officer-activity-tag hadir">
                                Keliling santri
                              </span>
                            )}
                            {isAlfa && (
                              <span className="officer-activity-tag alfa">
                                Tidak hadir
                              </span>
                            )}
                          </div>
                          {(isSakit || isIzin) && (
                            <div className={`officer-reason-badge ${ketClass}`}>
                              <span className="reason-label">Alasan:</span>
                              <span className="reason-text">{r.alasan ? r.alasan : (isSakit ? 'Sakit' : 'Izin')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="officer-item-right">
                        <span className={`officer-status-capsule ${ketClass}`}>
                          {isHadir && <IconCheck size={11} />}
                          {isSakit && <IconAlertCircle size={11} />}
                          {isIzin && <IconClock size={11} />}
                          {isAlfa && <IconAlertCircle size={11} />}
                          <span>{r.ket}</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Rekap Bulanan */}
      {tab === 'rekap' && (
        <div className="admin-tab-content">
          <div className="month-navigator-card">
            <div className="month-nav-controls">
              <button
                type="button"
                className="month-nav-btn"
                onClick={() => setBulan(geserBulan(b, -1))}
                aria-label="Bulan Sebelumnya"
              >
                <IconChevronLeft size={16} />
              </button>

              <div className="month-nav-display">
                <span className="month-nav-name">{formatBulanIndo(b)}</span>
                <input
                  type="month"
                  className="month-nav-hidden-input"
                  value={b}
                  onChange={e => setBulan(e.target.value)}
                  title="Pilih Bulan Spesifik"
                />
              </div>

              <button
                type="button"
                className="month-nav-btn"
                onClick={() => setBulan(geserBulan(b, 1))}
                aria-label="Bulan Berikutnya"
              >
                <IconChevronRight size={16} />
              </button>
            </div>

            <button
              type="button"
              className="rekap-export-pill-btn"
              onClick={unduh}
              disabled={!bl.length}
            >
              <IconDownload size={13} />
              <span>Ekspor CSV</span>
            </button>
          </div>

          <div className="monthly-performance-card">
            <div className="performance-top-row">
              <div>
                <span className="performance-eyebrow">Performa Korlap Bulan Ini</span>
                <h3 className="performance-title">
                  {rateKehadiranBulanIni}% Tingkat Kehadiran
                </h3>
              </div>
              <span className="performance-total-tag">
                {totalTugasBulanIni} Total Tugas
              </span>
            </div>

            {totalTugasBulanIni > 0 ? (
              <div className="attendance-multi-bar">
                <div
                  className="multi-segment ontime"
                  style={{ width: `${Math.max(0, (totalStats.Hadir - totalStats.Terlambat) / totalTugasBulanIni * 100)}%` }}
                  title="Tepat Waktu"
                />
                <div
                  className="multi-segment late"
                  style={{ width: `${(totalStats.Terlambat / totalTugasBulanIni) * 100}%` }}
                  title="Terlambat"
                />
                <div
                  className="multi-segment excuse"
                  style={{ width: `${((totalStats.Sakit + totalStats.Izin) / totalTugasBulanIni) * 100}%` }}
                  title="Sakit / Izin"
                />
                <div
                  className="multi-segment alfa"
                  style={{ width: `${(totalStats.Alfa / totalTugasBulanIni) * 100}%` }}
                  title="Alfa"
                />
              </div>
            ) : null}

            <div className="legend-pills-row">
              <span className="l-pill ontime">Tepat ({totalStats.Hadir - totalStats.Terlambat})</span>
              <span className="l-pill late">Telat ({totalStats.Terlambat})</span>
              <span className="l-pill sakit">Sakit ({totalStats.Sakit})</span>
              <span className="l-pill izin">Izin ({totalStats.Izin})</span>
              <span className="l-pill alfa">Alfa ({totalStats.Alfa})</span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="rekap-filter-section">
            <div className="rekap-search-input-wrap">
              <IconSearch size={15} className="rekap-search-icon" />
              <input
                type="text"
                className="rekap-search-input"
                placeholder="Cari nama personil / ustadz..."
                value={cariRekap}
                onChange={e => setCariRekap(e.target.value)}
              />
              {cariRekap && (
                <button
                  type="button"
                  className="rekap-clear-search-btn"
                  onClick={() => setCariRekap('')}
                >
                  <IconClose size={13} />
                </button>
              )}
            </div>

            <div className="rekap-filter-chips-row">
              {[
                ['semua', 'Semua (' + allRekapNames.length + ')'],
                ['alfa', 'Ada Alfa (' + allRekapNames.filter(n => (rek[n]?.Alfa || 0) > 0).length + ')'],
                ['absen', 'Sakit/Izin (' + allRekapNames.filter(n => (rek[n]?.Sakit || 0) > 0 || (rek[n]?.Izin || 0) > 0).length + ')'],
                ['rajin', '100% Hadir (' + allRekapNames.filter(n => {
                  const u = rek[n]
                  const t = (u.Hadir || 0) + (u.Sakit || 0) + (u.Izin || 0) + (u.Alfa || 0)
                  return t > 0 && u.Hadir === t
                }).length + ')']
              ].map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  className={`rekap-filter-chip ${filterRekap === k ? 'active' : ''}`}
                  onClick={() => setFilterRekap(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* List Personil Rekap */}
          <div className="rekap-ustadz-list">
            {filteredUstadz.map(n => {
              const u = rek[n]
              const tot = (u.Hadir || 0) + (u.Sakit || 0) + (u.Izin || 0) + (u.Alfa || 0)
              const rate = tot > 0 ? Math.round((u.Hadir / tot) * 100) : 0

              return (
                <div className="rekap-ustadz-card" key={n}>
                  <div className="rekap-ustadz-header">
                    <div className="rekap-ustadz-left">
                      <div className="rekap-ustadz-avatar">
                        {getInitials(n)}
                      </div>
                      <div>
                        <span className="rekap-ustadz-name">{n}</span>
                        <span className="rekap-ustadz-sub">{tot} kali tugas korlap</span>
                      </div>
                    </div>
                    <div className="rekap-ustadz-rate-badge">
                      <span className="rate-num">{rate}%</span>
                      <span className="rate-lbl">Hadir</span>
                    </div>
                  </div>

                  {tot > 0 && (
                    <div className="rekap-mini-progress">
                      <div
                        className="u-seg ontime"
                        style={{ width: `${((u.Hadir - u.Terlambat) / tot) * 100}%` }}
                        title="Tepat Waktu"
                      />
                      <div
                        className="u-seg late"
                        style={{ width: `${(u.Terlambat / tot) * 100}%` }}
                        title="Terlambat"
                      />
                      <div
                        className="u-seg excuse"
                        style={{ width: `${((u.Sakit + u.Izin) / tot) * 100}%` }}
                        title="Sakit & Izin"
                      />
                      <div
                        className="u-seg alfa"
                        style={{ width: `${(u.Alfa / tot) * 100}%` }}
                        title="Alfa"
                      />
                    </div>
                  )}

                  <div className="rekap-stat-chips-row">
                    <span className="r-chip hadir">
                      <span className="lbl">Hadir</span>
                      <span className="val">{u.Hadir}</span>
                    </span>
                    {u.Terlambat > 0 && (
                      <span className="r-chip terlambat">
                        <span className="lbl">Telat</span>
                        <span className="val">{u.Terlambat}</span>
                      </span>
                    )}
                    <span className="r-chip sakit">
                      <span className="lbl">Sakit</span>
                      <span className="val">{u.Sakit}</span>
                    </span>
                    <span className="r-chip izin">
                      <span className="lbl">Izin</span>
                      <span className="val">{u.Izin}</span>
                    </span>
                    <span className="r-chip alfa">
                      <span className="lbl">Alfa</span>
                      <span className="val">{u.Alfa}</span>
                    </span>
                  </div>
                </div>
              )
            })}

            {!filteredUstadz.length && (
              <div className="rekap-empty-state-card">
                <div className="empty-icon-wrap">
                  <IconSearch size={22} />
                </div>
                <h4 className="empty-state-h">Tidak Ada Data Ditemukan</h4>
                <p className="empty-state-p">
                  {cariRekap
                    ? `Tidak ada personil dengan nama "${cariRekap}" pada filter ini.`
                    : !bl.length
                    ? `Belum ada presensi yang tercatat untuk bulan ${formatBulanIndo(b)}.`
                    : 'Tidak ada personil yang memenuhi kriteria filter terpilih.'}
                </p>
                {(cariRekap || filterRekap !== 'semua') && (
                  <button
                    type="button"
                    className="rekap-reset-filter-btn"
                    onClick={() => {
                      setCariRekap('')
                      setFilterRekap('semua')
                    }}
                  >
                    Reset Filter & Pencarian
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Setelan Waktu Sholat */}
      {tab === 'atur' && (
        <div className="admin-tab-content">
          {[
            { id: 'shubuh', label: 'Shubuh', defaultBuka: '04:15', defaultBatas: '04:45', defaultTutup: '05:30' },
            { id: 'dhuhur', label: 'Dhuhur', defaultBuka: '11:45', defaultBatas: '12:15', defaultTutup: '12:45' },
            { id: 'ashar', label: 'Ashar', defaultBuka: '15:00', defaultBatas: '15:30', defaultTutup: '16:00' },
            { id: 'magrib', label: 'Magrib', defaultBuka: '17:45', defaultBatas: '18:15', defaultTutup: '18:45' },
            { id: 'isya', label: 'Isya', defaultBuka: '19:00', defaultBatas: '19:30', defaultTutup: '20:15' }
          ].map(sh => (
            <div key={sh.id} className="ios-settings-card" style={{ marginBottom: '14px' }}>
              <div className="ios-settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="ios-settings-title">Jam Operasional Sholat {sh.label}</h3>
                  <p className="ios-settings-subtitle">Batas buka, tepat waktu, dan tutup form</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--emerald-100)', color: 'var(--emerald-800)', padding: '3px 8px', borderRadius: '6px' }}>
                  {sh.label}
                </span>
              </div>

              <div className="ios-settings-group">
                {[
                  [`${sh.id}_buka`, 'Jam Buka Form', 'Mulai bisa dibuka untuk presensi', <IconClock size={16} key="i1" />],
                  [`${sh.id}_batas`, 'Batas Waktu Tepat', 'Lewat dari jam ini tercatat Terlambat', <IconShield size={16} key="i2" />],
                  [`${sh.id}_tutup`, 'Jam Penutupan Form', 'Formulir otomatis terkunci dan ditutup', <IconLock size={16} key="i3" />]
                ].map(([k, n, desc, icon]) => (
                  <div key={k} className="ios-settings-row">
                    <div className="ios-row-left">
                      <div className="ios-icon-box">
                        {icon}
                      </div>
                      <div className="ios-row-text">
                        <span className="ios-row-label">{n}</span>
                        <span className="ios-row-desc">{desc}</span>
                      </div>
                    </div>
                    <div className="ios-row-right">
                      <input
                        type="time"
                        className="ios-time-picker"
                        value={atur[k] || ''}
                        onChange={e => setAtur({ ...atur, [k]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="native-submit-btn"
            disabled={busy}
            onClick={simpan}
            style={{ marginTop: '16px' }}
          >
            {busy ? (
              <>
                <IconSpinner size={16} className="spinner-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <IconCheck size={16} />
                <span>Simpan Semua Pengaturan Jam</span>
              </>
            )}
          </button>
        </div>
      )}

      <StatusModal modal={statusModal} onClose={() => setStatusModal({ ...statusModal, open: false })} />
      <AppFooter subtitle="Dashboard Admin" />
    </div>
  )
}
