import { cn } from '../../utils/helpers'

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn('bg-white border border-border rounded-card shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'px-[1.1rem] py-[0.88rem] border-b border-border flex items-center justify-between gap-[0.75rem] flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('font-serif text-[1.02rem] font-bold text-navy', className)}>
      {children}
    </h3>
  )
}

export function CardBody({ children, className = '', noPadding = false, ...props }) {
  return (
    <div className={cn(!noPadding && 'p-[1.1rem]', className)} {...props}>
      {children}
    </div>
  )
}
