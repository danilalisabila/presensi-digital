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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconChevronDown({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconMenu({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function IconChevronRight({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
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
    title: 'Waktu Subuh',
    tagText: 'Jadwal',
    targetType: 'closed'
  })

  useEffect(() => {
    if (!info) return

    function hitung() {
      const now = new Date()
      const [bH, bM] = (info.buka || '03:30').split(':').map(Number)
      const [lH, lM] = (info.batas || '04:30').split(':').map(Number)
      const [tH, tM] = (info.tutup || '06:00').split(':').map(Number)

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
        title = 'Dibuka Dalam'
        tagText = 'Buka ' + (info.buka || '03:30') + ' WIB'
        targetType = 'pending'
      } else if (now >= openToday && now < limitToday) {
        targetDate = limitToday
        title = 'Sisa Waktu Tepat'
        tagText = 'Tepat s/d ' + (info.batas || '04:30')
        targetType = 'ontime'
      } else if (now >= limitToday && now < closeToday) {
        targetDate = closeToday
        title = 'Sisa Waktu Formulir'
        tagText = 'Tutup ' + (info.tutup || '06:00') + ' WIB'
        targetType = 'late'
      } else {
        const openTomorrow = new Date(openToday)
        openTomorrow.setDate(openTomorrow.getDate() + 1)
        targetDate = openTomorrow
        title = 'Buka Besok Subuh'
        tagText = 'Pukul ' + (info.buka || '03:30') + ' WIB'
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

/* ================= COMPONENT: MODERN POP-UP STATUS & KONFIRMASI ================= */
function StatusModal({ modal, onClose, onConfirm }) {
  if (!modal || !modal.open) return null

  const isSuccess = modal.type === 'success'
  const isError = modal.type === 'error'
  const isConfirm = modal.type === 'confirm'

  return (
    <div className="status-modal-backdrop" onClick={onClose}>
      <div className="status-modal-card" onClick={e => e.stopPropagation()}>
        {/* Animated Glow Icon Ring */}
        <div className={`status-modal-icon-ring ${modal.type}`}>
          {isSuccess && <IconCheckCircle size={30} className="icon-pop" />}
          {isError && <IconAlertCircle size={30} className="icon-pop" />}
          {isConfirm && <IconShield size={28} className="icon-pop" />}
        </div>

        {/* Title */}
        <h3 className={`status-modal-title ${modal.type}`}>{modal.title}</h3>

        {/* Message */}
        <p className="status-modal-message">{modal.message}</p>

        {/* Success Data Info Box */}
        {isSuccess && modal.data && (
          <div className="status-modal-detail-box">
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

        {/* Confirm Summary Grid */}
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

        {/* Actions Row */}
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
                className="modal-btn primary emerald"
                onClick={() => {
                  onClose()
                  if (onConfirm) onConfirm()
                }}
              >
                <IconCheck size={15} />
                <span>Kirim Sekarang</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`modal-btn primary ${isSuccess ? 'emerald' : 'danger'}`}
              onClick={onClose}
            >
              <span>{isSuccess ? 'Selesai' : 'Tutup'}</span>
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
      <div className="form-footer-credits">
        <span>Ponpes Al - Falah Putak</span>
        <span className="dot-divider">•</span>
        <span>{subtitle || 'Presensi Korlap Subuh'}</span>
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
      setLaporErr('Nama Ustadz / Pelapor wajib diisi.')
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

    const pesan = `*PENGADUAN KORLAP SUBUH*\n*Ponpes Al - Falah Putak*\n----------------------------------------\n*Nama Ustadz:* ${namaLapor.trim()}\n*Waktu:* ${waktuStr}\n\n*Deskripsi Pengaduan:*\n${deskripsiLapor.trim()}\n----------------------------------------\n_Dikirim via Sistem Absensi Korlap Subuh_`

    const url = `https://wa.me/6282118702717?text=${encodeURIComponent(pesan)}`
    window.open(url, '_blank')
    setLaporOpen(false)
    setDeskripsiLapor('')
  }

  return (
    <div className="mobile-viewport">
      {/* 1. Sticky Header Bar: Tetap di atas & tidak ikut ter-scroll */}
      <header className="sticky-top-appbar">
        <div className="brand-identity">
          <div className="brand-emblem-wrap">
            <img src="/logo.png" alt="Logo Al-Falah" />
          </div>
          <div className="brand-text-col">
            <span className="brand-main-title">
              {admin ? 'DASHBOARD ADMIN' : 'KORLAP SUBUH'}
            </span>
            <span className="brand-sub-title">Ponpes Al - Falah Putak</span>
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
            {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </header>

      {/* 2. Top-Down Dropdown Menu (Muncul dari Atas ke Bawah) */}
      <div
        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`menu-top-sheet ${menuOpen ? 'open' : ''}`}>
        <div className="menu-sheet-inner">
          <p className="menu-section-label">LAYANAN & NAVIGASI</p>

          <div className="menu-sheet-grid">
            {/* Menu Item 1: Laporkan Masalah (Official Authentic WhatsApp) */}
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
                {/* Menu Item 2 (Khusus Admin): Kembali ke Presensi */}
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
                    <span className="drawer-item-desc">Buka formulir absensi subuh</span>
                  </div>
                  <IconChevronRight size={16} className="drawer-chevron" />
                </button>

                {/* Menu Item 3 (Khusus Admin): Keluar Admin (Logout) */}
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
              /* Menu Item 2 (Khusus Presensi): Login Administrator */
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
        <Form liveClock={liveClock} />
      )}

      {/* 3. Modal Form Pengaduan / Laporkan (Official WhatsApp) */}
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
                  Nama Ustadz / Pelapor <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Contoh: Ust. Dani Lalisabila"
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
                  placeholder="Jelaskan kendala yang dialami, izin tugas mendadak, atau kendala lapangan..."
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

/* ================= FORM USTADZ (NATIVE MOBILE EXPERIENCE) ================= */
function Form() {
  const [info, setInfo] = useState(null)
  const [item, setItem] = useState({})
  const [pengisi, setPengisi] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [liveClock, setLiveClock] = useState('')
  const [statusModal, setStatusModal] = useState({ open: false, type: 'success', title: '', message: '', data: null })
  const [confirmModal, setConfirmModal] = useState({ open: false, summary: null })

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setLiveClock(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB')
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    api().then(i => {
      setInfo(i)
      const list = i.tim || []
      setItem(Object.fromEntries(list.map(t => [t.nama, { ket: 'Hadir', alasan: '' }])))
      setPengisi((list.find(t => t.petugas) || list[0] || {}).nama || '')
    }).catch(e => setErr(e.message))
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
        pengisi,
        items: (info.tim || []).map(t => ({ nama: t.nama, ...(item[t.nama] || { ket: 'Hadir', alasan: '' }) }))
      }
      const res = await api(payload)
      setDone(res)
      setStatusModal({
        open: true,
        type: 'success',
        title: 'Presensi Berhasil Terkirim',
        message: 'Jazakumullahu khairan. Laporan kehadiran telah berhasil tercatat.',
        data: {
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
          Presensi Korlap Subuh
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '2px', marginBottom: '24px' }}>
          Ponpes Al - Falah Putak
        </p>
        {err ? (
          <div className="notice-strip danger" style={{ textAlign: 'left', width: '100%' }}>
            <div className="notice-icon-wrap"><IconAlertCircle size={18} /></div>
            <div>{err}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-700)', fontSize: '13px', fontWeight: '600' }}>
            <IconSpinner size={18} className="spinner-spin" />
            <span>Memuat jadwal kehadiran...</span>
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
        {/* Hero Card dengan Jam Hitungan Mundur Terintegrasi */}
        <div className="unified-hero">
          <div className="hero-meta-bar">
            <span className="session-chip">
              <IconShield size={11} />
              Tugas Subuh
            </span>
            <div className="status-glow-pill">
              <span className={`status-dot-sm ${info.status === 'buka' ? 'open' : info.status === 'belum' ? 'pending' : 'closed'}`} />
              <span>
                {info.status === 'buka' ? 'Formulir Dibuka' : info.status === 'belum' ? 'Belum Buka' : 'Formulir Ditutup'}
              </span>
            </div>
          </div>

          {/* Jam Hitungan Mundur (Countdown Widget) */}
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
            <div>Laporan terkirim ({done.status}, {done.jam} WIB). Jazakumullahu khairan.</div>
          </div>
        ) : info.sudah ? (
          <div className="notice-strip success">
            <div className="notice-icon-wrap"><IconCheckCircle size={18} /></div>
            <div>Laporan kehadiran tugas subuh hari ini sudah selesai dikirim.</div>
          </div>
        ) : tutup ? (
          <div className="notice-strip warning">
            <div className="notice-icon-wrap"><IconAlertCircle size={18} /></div>
            <div>
              {info.status === 'belum'
                ? `Formulir akan mulai dibuka pukul ${info.buka} WIB.`
                : `Formulir terkunci setelah jam ${info.tutup} WIB. Jadwal hari ini dapat dilihat di bawah.`}
            </div>
          </div>
        ) : null}

        {/* 3. Section Header */}
        <div className="list-section-header">
          <div className="list-section-title">
            <span>Daftar Petugas Hari Ini</span>
            <span className="badge-count">{tim.length}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: '600' }}>
            Jadwal {info.hari}
          </span>
        </div>

        {/* 4. Grouped Officers List (Fluid & Mobile First) */}
        <div className="grouped-list-card">
          {tim.map(t => {
            const currentItem = item[t.nama] || { ket: 'Hadir', alasan: '' }
            const isKetua = t.peran === 'Ketua'
            const isOfficial = t.petugas

            return (
              <div className="officer-row-item" key={t.nama}>
                <div className="officer-top-info">
                  <div className="officer-avatar-name">
                    <div className={`avatar-initial ${isKetua ? 'ketua' : isOfficial ? 'petugas' : ''}`}>
                      {getInitials(t.nama)}
                    </div>
                    <div className="name-role-col">
                      <span className="officer-fullname">{t.nama}</span>
                      <div className="role-pill-tags">
                        {isKetua && (
                          <span className="mini-role-pill ketua">
                            <IconShield size={9} />
                            Ketua Tim
                          </span>
                        )}
                        {isOfficial && (
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

        {/* 5. Submitter Selection Card */}
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
                  {t.nama} {t.petugas ? '— (Petugas Resmi)' : t.peran === 'Ketua' ? '— (Ketua)' : ''}
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

        {/* 6. Action Button: Natural page flow, clean mobile card (No fixed sticky overlay) */}
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
                <span>Absen Telah Terkirim</span>
              </>
            ) : info.sudah ? (
              <>
                <IconCheckCircle size={18} />
                <span>Sudah Diabsen Hari Ini</span>
              </>
            ) : tutup ? (
              <>
                <IconLock size={16} />
                <span>Formulir Terkunci (Buka {info.buka} WIB)</span>
              </>
            ) : (
              <>
                <IconCheck size={18} />
                <span>Kirim Presensi Subuh</span>
              </>
            )}
          </button>
          
          {tutup && !info.sudah && (
            <p className="submit-lock-notice">
              Presensi otomatis terbuka pada pukul {info.buka} s/d {info.tutup} WIB.
            </p>
          )}

          <AppFooter subtitle="Presensi Korlap Subuh" />
        </div>
      </div>

      {/* Pop Up Modern Status (Berhasil / Gagal) */}
      <StatusModal
        modal={statusModal}
        onClose={() => setStatusModal({ ...statusModal, open: false })}
      />

      {/* Pop Up Modern Konfirmasi */}
      <StatusModal
        modal={{
          open: confirmModal.open,
          type: 'confirm',
          title: 'Kirim Presensi Subuh?',
          message: 'Pastikan data kehadiran petugas subuh hari ini sudah sesuai.',
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
        message: res.pesan || 'Jam operasional presensi subuh berhasil diperbarui.'
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
      <div className="admin-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
        <div className="admin-glass-card" style={{ width: '100%', maxWidth: '380px', padding: '26px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className="login-shield-badge">
              <IconShield size={28} />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--slate-900)' }}>Login Administrator</h1>
            <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '3px' }}>
              Ponpes Al - Falah Putak
            </p>
          </div>

          <form onSubmit={masuk}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '5px' }}>
                Email Admin
              </label>
              <input
                type="email"
                className="inline-reason-input"
                style={{ padding: '10px 12px' }}
                placeholder="admin@email.com"
                value={f.email}
                onChange={e => setF({ ...f, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--slate-700)', display: 'block', marginBottom: '5px' }}>
                PIN 4 Digit
              </label>
              <div className="input-eye-wrap">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  className="inline-reason-input input-with-eye"
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
              <div className="notice-strip danger" style={{ padding: '8px 12px', marginBottom: '12px' }}>
                <div className="notice-icon-wrap"><IconAlertCircle size={15} /></div>
                <div>{err}</div>
              </div>
            )}

            <button type="submit" className="native-submit-btn" disabled={busy} style={{ width: '100%', padding: '12px' }}>
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
  const hariIni = rows.filter(r => r.tanggal === d.tgl)
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
    const h = 'Tanggal,Hari,Nama,Keterangan,Alasan,Status Waktu,Diisi Oleh,Pengganti\n'
    const c = bl.map(r => [r.tanggal, r.hari, r.nama, r.ket, r.alasan, r.waktu, r.pengisi, r.pengganti]
      .map(x => '"' + String(x || '').replace(/"/g, '""') + '"').join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\ufeff' + h + c], { type: 'text/csv' }))
    a.download = 'absensi-' + b + '.csv'
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

  return (
    <div className="scroll-body">
      {/* 1. Executive Admin Hero Card (Mewah, Modern, Ala Mobile App) */}
      <div className="unified-hero admin-hero-card">
        <div className="hero-meta-bar">
          <span className="session-chip">
            <IconShield size={11} />
            Panel Admin
          </span>
        </div>

        <div className="admin-hero-main-row">
          <div>
            <span className="admin-hero-eyebrow">Pemantauan Presensi</span>
            <h2 className="admin-hero-heading">{formatTanggalIndo(d.tgl, d.hari)}</h2>
          </div>
          {hariIni.length > 0 && (
            <span className={`admin-hero-status-pill ${hariIni[0].waktu === 'Tepat Waktu' ? 'ontime' : 'late'}`}>
              {hariIni[0].waktu === 'Tepat Waktu' ? <IconCheckCircle size={13} /> : <IconAlertCircle size={13} />}
              <span>{hariIni[0].waktu}</span>
            </span>
          )}
        </div>

        {hariIni.length > 0 ? (
          <div className="admin-hero-meta-box">
            <div className="meta-box-row">
              <span className="meta-box-label">
                <IconClock size={12} />
                <span>Masuk {hariIni[0].jam} WIB</span>
              </span>
              <span className="meta-box-val">
                Oleh: <strong>{hariIni[0].pengisi}</strong> {hariIni[0].pengganti === 'Ya' ? '(Pengganti)' : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="admin-hero-meta-box pending">
            <span>Presensi subuh hari ini belum dikirimkan oleh petugas.</span>
          </div>
        )}

        {/* 4 Hero Counters for Instant Glance */}
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
          ['atur', 'Setelan Jam', <IconSettings size={14} key="t3" />]
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

      {/* Tab 1: Hari Ini (100% Native Mobile Cards) */}
      {tab === 'hari' && (
        <div className="admin-tab-content">
          {!hariIni.length ? (
            <div className="mobile-empty-card">
              <div className="empty-icon-ring">
                <IconCalendar size={28} />
              </div>
              <h4 className="empty-title">Belum Ada Presensi Masuk</h4>
              <p className="empty-subtitle">
                Petugas terjadwal: {(d.tim || []).map(t => t.nama).join(', ') || '-'}
              </p>
            </div>
          ) : (
            <div className="mobile-officers-card">
              <div className="officers-card-header">
                <div>
                  <h3 className="officers-header-title">Petugas Subuh Hari Ini</h3>
                  <span className="officers-header-sub">Status kehadiran {hariIni.length} personil</span>
                </div>
                <span className="officers-chip">{hariIni.length} Petugas</span>
              </div>

              <div className="mobile-officers-feed">
                {hariIni.map(r => {
                  const isHadir = r.ket === 'Hadir'
                  const isSakit = r.ket === 'Sakit'
                  const isIzin = r.ket === 'Izin'
                  const isAlfa = r.ket === 'Alfa'
                  const ketClass = r.ket.toLowerCase()

                  return (
                    <div className={`mobile-officer-item ${ketClass}`} key={r.nama}>
                      <div className="officer-item-left">
                        <div className={`officer-avatar ${ketClass}`}>
                          {getInitials(r.nama)}
                        </div>
                        <div className="officer-item-details">
                          <span className="officer-fullname">{r.nama}</span>
                          {isHadir && (
                            <span className="officer-activity-tag hadir">
                              Oprak-oprak subuh
                            </span>
                          )}
                          {(isSakit || isIzin) && (
                            <div className={`officer-reason-badge ${ketClass}`}>
                              <span className="reason-label">Alasan:</span>
                              <span className="reason-text">{r.alasan ? r.alasan : (isSakit ? 'Sakit' : 'Izin')}</span>
                            </div>
                          )}
                          {isAlfa && (
                            <span className="officer-activity-tag alfa">
                              Tidak oprak-oprak
                            </span>
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

      {/* Tab 2: Rekap Bulanan (100% Native Mobile UX) */}
      {tab === 'rekap' && (
        <div className="admin-tab-content">
          {/* 1. Touch-Friendly Month Navigator */}
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

          {/* 2. Monthly Executive Summary Card */}
          <div className="monthly-performance-card">
            <div className="performance-top-row">
              <div>
                <span className="performance-eyebrow">Performa Subuh Bulan Ini</span>
                <h3 className="performance-title">
                  {rateKehadiranBulanIni}% Tingkat Kehadiran
                </h3>
              </div>
              <span className="performance-total-tag">
                {totalTugasBulanIni} Total Tugas
              </span>
            </div>

            {/* Visual Multi-Segment Progress Bar */}
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
                  className="multi-segment sick"
                  style={{ width: `${((totalStats.Sakit + totalStats.Izin) / totalTugasBulanIni) * 100}%` }}
                  title="Sakit & Izin"
                />
                <div
                  className="multi-segment alfa"
                  style={{ width: `${(totalStats.Alfa / totalTugasBulanIni) * 100}%` }}
                  title="Alfa"
                />
              </div>
            ) : null}

            {/* 4 Overview Mini Stat Counters */}
            <div className="performance-stat-grid">
              <div className="perf-item hadir">
                <span className="perf-val">{totalStats.Hadir}</span>
                <span className="perf-lbl">Hadir</span>
                {totalStats.Terlambat > 0 && (
                  <span className="perf-sub">({totalStats.Terlambat} Telat)</span>
                )}
              </div>
              <div className="perf-item sakit">
                <span className="perf-val">{totalStats.Sakit}</span>
                <span className="perf-lbl">Sakit</span>
              </div>
              <div className="perf-item izin">
                <span className="perf-val">{totalStats.Izin}</span>
                <span className="perf-lbl">Izin</span>
              </div>
              <div className="perf-item alfa">
                <span className="perf-val">{totalStats.Alfa}</span>
                <span className="perf-lbl">Alfa</span>
              </div>
            </div>
          </div>

          {/* 3. Search & Quick Filter Controls */}
          <div className="rekap-filter-section">
            <div className="rekap-search-box">
              <IconSearch size={15} className="rekap-search-icon" />
              <input
                type="text"
                className="rekap-search-input"
                placeholder="Cari nama ustadz..."
                value={cariRekap}
                onChange={e => setCariRekap(e.target.value)}
              />
              {cariRekap && (
                <button
                  type="button"
                  className="rekap-clear-btn"
                  onClick={() => setCariRekap('')}
                  aria-label="Hapus Pencarian"
                >
                  <IconClose size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="rekap-filter-chips-bar">
              {[
                ['semua', `Semua (${allRekapNames.length})`],
                ['alfa', `Ada Alfa (${allRekapNames.filter(n => (rek[n]?.Alfa || 0) > 0).length})`],
                ['absen', `Izin/Sakit (${allRekapNames.filter(n => (rek[n]?.Sakit || 0) > 0 || (rek[n]?.Izin || 0) > 0).length})`],
                ['rajin', `100% Hadir (${allRekapNames.filter(n => {
                  const tot = (rek[n]?.Hadir || 0) + (rek[n]?.Sakit || 0) + (rek[n]?.Izin || 0) + (rek[n]?.Alfa || 0)
                  return tot > 0 && rek[n]?.Hadir === tot
                }).length})`]
              ].map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  className={`rekap-chip-btn ${filterRekap === k ? 'active' : ''}`}
                  onClick={() => setFilterRekap(k)}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Individual Ustadz Cards Feed (Zero Tables!) */}
          <div className="rekap-ustadz-feed">
            {filteredUstadz.map(n => {
              const u = rek[n]
              const tot = (u.Hadir || 0) + (u.Sakit || 0) + (u.Izin || 0) + (u.Alfa || 0)
              const rate = tot > 0 ? Math.round((u.Hadir / tot) * 100) : 0
              const rateTone = rate >= 90 ? 'good' : rate >= 70 ? 'warn' : 'bad'

              return (
                <div className="rekap-ustadz-card" key={n}>
                  <div className="rekap-card-top-row">
                    <div className="rekap-ustadz-info">
                      <div className={`rekap-ustadz-avatar ${rateTone}`}>
                        {getInitials(n)}
                      </div>
                      <div>
                        <span className="rekap-ustadz-name">{n}</span>
                        <span className="rekap-ustadz-sub">{tot} kali tugas subuh</span>
                      </div>
                    </div>

                    <div className={`rekap-rate-pill ${rateTone}`}>
                      <span className="rate-num">{rate}%</span>
                      <span className="rate-txt">Hadir</span>
                    </div>
                  </div>

                  {/* Individual Mini Progress Track */}
                  {tot > 0 && (
                    <div className="ustadz-progress-track">
                      <div
                        className="u-seg ontime"
                        style={{ width: `${Math.max(0, (u.Hadir - u.Terlambat) / tot * 100)}%` }}
                        title="Tepat Waktu"
                      />
                      <div
                        className="u-seg late"
                        style={{ width: `${(u.Terlambat / tot) * 100}%` }}
                        title="Terlambat"
                      />
                      <div
                        className="u-seg sick"
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

                  {/* Clean Stat Chips */}
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
                    ? `Tidak ada ustadz dengan nama "${cariRekap}" pada filter ini.`
                    : !bl.length
                    ? `Belum ada presensi yang tercatat untuk bulan ${formatBulanIndo(b)}.`
                    : 'Tidak ada ustadz yang memenuhi kriteria filter terpilih.'}
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

      {/* Tab 3: Setelan Jam Operasional */}
      {tab === 'atur' && (
        <div className="admin-tab-content">
          <div className="ios-settings-card">
            <div className="ios-settings-header">
              <h3 className="ios-settings-title">Jam Operasional Presensi</h3>
              <p className="ios-settings-subtitle">Atur batas waktu otomatis formulir subuh</p>
            </div>

            <div className="ios-settings-group">
              {[
                ['jam_buka', 'Jam Buka Form', 'Mulai bisa dibuka untuk presensi', <IconClock size={16} key="i1" />],
                ['jam_batas_tepat', 'Batas Waktu Tepat', 'Lewat dari jam ini tercatat Terlambat', <IconShield size={16} key="i2" />],
                ['jam_tutup', 'Jam Penutupan Form', 'Formulir otomatis terkunci dan ditutup', <IconLock size={16} key="i3" />]
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
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Pop Up Modern Status Admin */}
      <StatusModal modal={statusModal} onClose={() => setStatusModal({ ...statusModal, open: false })} />

      <AppFooter subtitle="Dashboard Admin" />
    </div>
  )
}
