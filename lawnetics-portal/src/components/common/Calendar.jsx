import { useCalendarStore, useDataStore } from '../../store'
import { MONTHS, cn } from '../../utils/helpers'

const EVENT_COLOR = {
  'Hearing':             'o',
  'FER Deadline':        'cy',
  'FER':                 'cy',
  'Renewal Due':         'gd',
  'Renewal':             'gd',
  'Opposition Deadline': 'rd',
  'Opposition':          'rd',
  'Court Date':          'o',
  'Filing Deadline':     'gn',
}

const EVENT_CLS = {
  o:  'bg-org-light text-org',
  cy: 'bg-cyan-light text-cyan-dark',
  gd: 'bg-gold-light text-gold',
  rd: 'bg-red-light text-red',
  gn: 'bg-green-light text-green',
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function Calendar() {
  const { year, month, navigateMonth } = useCalendarStore()
  const { deadlines } = useDataStore()

  const firstDay  = new Date(year, month, 1).getDay()
  const offset    = firstDay === 0 ? 6 : firstDay - 1
  const daysCount = new Date(year, month + 1, 0).getDate()
  const prevDays  = new Date(year, month, 0).getDate()
  const today     = new Date()
  const total     = Math.ceil((offset + daysCount) / 7) * 7

  const cells = []
  let day = 1
  for (let i = 0; i < total; i++) {
    let d, isCurrent = true
    if (i < offset)         { d = prevDays - offset + i + 1; isCurrent = false }
    else if (day > daysCount){ d = day - daysCount; day++; isCurrent = false }
    else                    { d = day; day++ }

    const dateStr = isCurrent
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      : ''

    const isToday = isCurrent
      && d === today.getDate()
      && month === today.getMonth()
      && year === today.getFullYear()

    const events = dateStr ? deadlines.filter(x => x.date === dateStr) : []

    cells.push({ d, isCurrent, isToday, dateStr, events })
  }

  const handleDayClick = (cell) => {
    if (cell.events.length > 0) {
      alert(`${cell.events.length} event(s) on ${cell.dateStr}:\n${cell.events.map(e => `• ${e.type} – ${e.matterName}`).join('\n')}`)
    }
  }

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="px-2 py-1 rounded text-[0.75rem] font-bold hover:bg-bg text-text-2 transition-colors">‹</button>
          <span className="font-serif text-[1rem] font-bold text-navy">
            {MONTHS[month]} {year}
          </span>
          <button onClick={() => navigateMonth(1)} className="px-2 py-1 rounded text-[0.75rem] font-bold hover:bg-bg text-text-2 transition-colors">›</button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {[['Hearing','o'],['FER/Exam','cy'],['Renewal','gd'],['Opposition','rd'],['Filing','gn']].map(([l,c]) => (
            <span key={l} className={cn('text-[0.59rem] font-medium px-[0.46rem] py-[0.13rem] rounded border', EVENT_CLS[c], 'border-current/20')}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-[2px] mb-[2px]">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[0.58rem] font-bold tracking-[0.1em] uppercase text-text-3 py-[0.35rem]">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-[2px]">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => handleDayClick(cell)}
            className={cn(
              'bg-white border rounded-[5px] p-[0.38rem_0.4rem] min-h-[68px] transition-all duration-150 text-[0.72rem]',
              cell.events.length && 'cursor-pointer hover:border-cyan hover:bg-cyan-light shadow-[inset_2px_0_0_#e85020]',
              !cell.events.length && cell.isCurrent && 'hover:border-cyan hover:bg-cyan-light cursor-default',
              cell.isToday ? 'border-org bg-org-light' : 'border-border',
              !cell.isCurrent && 'opacity-30'
            )}
          >
            <div className={cn('font-semibold mb-[0.2rem]', cell.isToday ? 'text-org font-extrabold' : 'text-text-2')}>
              {cell.d}
            </div>
            {cell.events.slice(0, 2).map((ev, i) => {
              const clr = EVENT_COLOR[ev.type] || 'cy'
              return (
                <div
                  key={i}
                  title={ev.matterName}
                  className={cn('text-[0.55rem] font-semibold px-[0.25rem] py-[0.08rem] rounded mb-[2px] overflow-hidden whitespace-nowrap text-ellipsis leading-[1.4]', EVENT_CLS[clr])}
                >
                  {ev.type.substring(0, 8)}
                </div>
              )
            })}
            {cell.events.length > 2 && (
              <div className="text-[0.55rem] bg-bg-2 text-text-3 px-[0.25rem] py-[0.08rem] rounded">
                +{cell.events.length - 2}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
