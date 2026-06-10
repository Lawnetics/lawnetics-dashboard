import { MONTHS_SHORT, daysDiff, getDaysLeftCls, getDeadlinePriorityCls } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

export default function DeadlineItem({ deadline, onClick }) {
  const { type, matterName, date, attorney, venue, notes, priority } = deadline
  const dt   = new Date(date)
  const diff = daysDiff(date)

  const daysLabel =
    diff === null ? '—' :
    diff === 0    ? 'TODAY' :
    diff === 1    ? 'Tomorrow' :
    diff < 0      ? 'Overdue' :
    `${diff} days`

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-[0.72rem] px-[0.88rem] py-[0.62rem] bg-white border rounded-[7px] cursor-pointer transition-all duration-200 hover:shadow-sm hover:translate-x-0.5',
        getDeadlinePriorityCls(priority)
      )}
    >
      {/* Date box */}
      <div className="text-center min-w-[38px] flex-shrink-0">
        <div className="font-serif text-[1.35rem] font-bold leading-none text-navy">{dt.getDate()}</div>
        <div className="text-[0.54rem] font-bold tracking-[0.1em] uppercase text-text-3">{MONTHS_SHORT[dt.getMonth()]}</div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[0.79rem] font-semibold text-navy overflow-hidden whitespace-nowrap text-ellipsis">
          {type} – {matterName}
        </div>
        <div className="text-[0.68rem] text-text-3">
          {attorney}{venue ? ` · ${venue}` : ''}{notes ? ` · ${notes.substring(0, 40)}` : ''}
        </div>
      </div>

      {/* Days pill */}
      <span className={cn('text-[0.64rem] font-bold px-[0.45rem] py-[0.15rem] rounded whitespace-nowrap', getDaysLeftCls(diff))}>
        {daysLabel}
      </span>
    </div>
  )
}
