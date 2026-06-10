import { cn } from '../../utils/helpers'
import { typeBadgeCls, statusBadgeCls } from '../../utils/helpers'

export function TypeBadge({ type, className = '' }) {
  return (
    <span className={cn('inline-flex items-center text-[0.58rem] font-bold tracking-[0.06em] uppercase px-[0.5rem] py-[0.14rem] rounded', typeBadgeCls(type), className)}>
      {type}
    </span>
  )
}

export function StatusBadge({ status, className = '' }) {
  if (!status) return null
  return (
    <span className={cn('inline-flex items-center text-[0.58rem] font-bold tracking-[0.06em] uppercase px-[0.5rem] py-[0.14rem] rounded', statusBadgeCls(status), className)}>
      {status}
    </span>
  )
}

export function PriorityDot({ priority }) {
  const colors = { h: 'bg-red', m: 'bg-gold', l: 'bg-green' }
  return (
    <span className={cn('inline-block w-[7px] h-[7px] rounded-full flex-shrink-0', colors[priority] || 'bg-text-3')} />
  )
}

export function Chip({ children, color = 'default', className = '' }) {
  const colors = {
    default: 'bg-bg-2 text-text-3 border-border',
    org:     'bg-org-light text-org border-org/20',
    cyan:    'bg-cyan-light text-cyan-dark border-cyan/20',
    gold:    'bg-gold-light text-gold border-gold/20',
    gn:      'bg-green-light text-green border-green/20',
    rd:      'bg-red-light text-red border-red/20',
    navy:    'bg-navy-light text-navy-dark border-navy/20',
  }
  return (
    <span className={cn('inline-block text-[0.59rem] font-medium px-[0.46rem] py-[0.13rem] rounded border', colors[color] || colors.default, className)}>
      {children}
    </span>
  )
}
