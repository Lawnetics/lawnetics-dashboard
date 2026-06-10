import { useNavigate } from 'react-router-dom'
import { MATTER_TYPES } from '../../utils/mockData'
import { useDataStore } from '../../store'

export default function PortfolioGrid() {
  const { matters } = useDataStore()
  const navigate = useNavigate()

  const BG = {
    TM:     { bg: '#fff3ee', color: '#e85020' },
    PAT:    { bg: '#e6f7fd', color: '#0090bb' },
    COPY:   { bg: '#fdf5e0', color: '#c89b30' },
    DESIGN: { bg: '#f3eeff', color: '#7c3aed' },
    GI:     { bg: '#e6f5ed', color: '#1a7a4a' },
    HC:     { bg: '#fff3ee', color: '#c04010' },
    DC:     { bg: '#fdeaea', color: '#c0392b' },
  }

  return (
    <div className="grid grid-cols-4 gap-[0.65rem] sm:grid-cols-7">
      {MATTER_TYPES.map((t) => {
        const count = matters.filter((m) => m.type === t.key).length
        const { bg, color } = BG[t.key] || {}
        return (
          <div
            key={t.key}
            onClick={() => navigate(t.route)}
            style={{ background: bg }}
            className="rounded-[10px] p-[0.82rem] text-center cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="text-[1.25rem] mb-[0.28rem]">{t.icon}</div>
            <div className="font-serif text-[1.55rem] font-bold" style={{ color }}>{count}</div>
            <div className="text-[0.6rem] font-bold tracking-[0.08em] uppercase opacity-80" style={{ color }}>
              {t.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
