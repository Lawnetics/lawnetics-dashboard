import { cn } from '../../utils/helpers'

const VARIANTS = {
  primary:  'bg-org text-white hover:bg-org-dark hover:-translate-y-px hover:shadow-org',
  navy:     'bg-navy text-white hover:bg-navy-dark hover:-translate-y-px',
  cyan:     'bg-cyan text-white hover:bg-cyan-dark',
  outline:  'bg-white text-text border-[1.5px] border-border-2 hover:border-navy hover:text-navy',
  ghost:    'bg-transparent text-text-2 hover:bg-bg hover:text-navy',
  danger:   'bg-red-light text-red border-[1.5px] border-red/20 hover:bg-red hover:text-white',
}

const SIZES = {
  sm: 'text-[0.7rem] px-[0.8rem] py-[0.38rem]',
  md: 'text-[0.74rem] px-[1rem] py-[0.48rem]',
  lg: 'text-[0.8rem] px-[1.25rem] py-[0.6rem]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-[0.42rem] font-bold tracking-[0.06em] uppercase rounded-[7px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap font-sans',
        VARIANTS[variant],
        SIZES[size],
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
