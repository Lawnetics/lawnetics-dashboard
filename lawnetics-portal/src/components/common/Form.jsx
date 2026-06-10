import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const base = 'w-full px-[0.75rem] py-[0.5rem] border-[1.5px] border-border rounded-[7px] text-[0.8rem] font-sans text-text bg-white transition-all duration-200 outline-none focus:border-navy-dark focus:shadow-[0_0_0_3px_rgba(26,58,114,.09)]'

export function Label({ children, required }) {
  return (
    <label className="block text-[0.63rem] font-bold tracking-[0.09em] uppercase text-text-2 mb-[0.3rem]">
      {children}{required && <span className="text-red ml-0.5">*</span>}
    </label>
  )
}

export const Input = forwardRef(({ className = '', ...props }, ref) => {
  return <input ref={ref} className={cn(base, className)} {...props} />
})
Input.displayName = 'Input'

export const Select = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select ref={ref} className={cn(base, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  )
})
Select.displayName = 'Select'

export const Textarea = forwardRef(({ className = '', rows = 3, ...props }, ref) => {
  return <textarea ref={ref} className={cn(base, 'resize-y', className)} rows={rows} {...props} />
})
Textarea.displayName = 'Textarea'

export function FormGroup({ children, className = '', span = false }) {
  return (
    <div className={cn('mb-[0.9rem]', span && 'col-span-2', className)}>
      {children}
    </div>
  )
}

export function FormGrid({ children, cols = 2, className = '' }) {
  return (
    <div className={cn('grid gap-[0.9rem]', cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1', className)}>
      {children}
    </div>
  )
}

export function FormSectionTitle({ children }) {
  return (
    <div className="col-span-2 text-[0.62rem] font-bold tracking-[0.15em] uppercase text-text-3 pt-[0.65rem] pb-[0.28rem] border-b border-border mb-[0.65rem]">
      {children}
    </div>
  )
}

export function InfoBox({ children, color = 'blue' }) {
  const colors = {
    blue:  'bg-cyan-light text-cyan-dark border-cyan/20',
    green: 'bg-green-light text-green border-green/20',
    org:   'bg-org-light text-org-dark border-org/20',
  }
  return (
    <div className={cn('col-span-2 flex items-start gap-[0.48rem] px-[0.82rem] py-[0.62rem] rounded-[7px] text-[0.74rem] border', colors[color])}>
      <svg className="w-[14px] h-[14px] flex-shrink-0 mt-[0.1rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>{children}</span>
    </div>
  )
}
