import { cn } from '../../utils/helpers'

const COLOR_MAP = {
  org:    'stat-org',
  cyan:   'stat-cyan',
  gold:   'stat-gold',
  green:  'stat-green',
  navy:   'stat-navy',
  red:    'stat-red',
  purple: 'stat-purple',
}

export default function StatCard({ value, label, sub, Icon, color = 'org' }) {
  return (
    <div className={cn('relative bg-white border border-border rounded-card p-[1.1rem] overflow-hidden shadow-sm topbar-accent', COLOR_MAP[color])}>
      {/* Icon */}
      <div className="absolute top-[0.9rem] right-[0.9rem] w-[34px] h-[34px] bg-bg rounded-[8px] flex items-center justify-center">
        {Icon && <Icon className="w-[17px] h-[17px] text-text-3" />}
      </div>
      {/* Value */}
      <div className="font-serif text-[2rem] font-bold text-navy leading-none">{value}</div>
      {/* Label */}
      <div className="text-[0.62rem] font-bold tracking-[0.1em] uppercase text-text-3 mt-[0.2rem]">{label}</div>
      {/* Sub */}
      {sub && <div className="text-[0.67rem] text-text-3 mt-[0.28rem]">{sub}</div>}
    </div>
  )
}
