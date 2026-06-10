import { useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import { cn } from '../../utils/helpers'

export default function Modal({ title, chip, onClose, children, footer, size = 'md' }) {
  const sizes = {
    sm:  'max-w-[460px]',
    md:  'max-w-[700px]',
    lg:  'max-w-[900px]',
    xl:  'max-w-[1100px]',
  }

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-[rgba(8,16,38,.70)] z-[1000] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(5px)', animation: 'fadeIn 0.2s ease' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div
        className={cn(
          'bg-white rounded-modal w-full overflow-hidden flex flex-col shadow-lg max-h-[90vh]',
          sizes[size]
        )}
        style={{ animation: 'fadeUp 0.25s ease' }}
      >
        {/* Header */}
        <div className="navy-gradient flex items-center justify-between px-6 py-[1.1rem] flex-shrink-0">
          <h3 className="font-serif text-[1.18rem] text-white flex items-center gap-2">
            {title}
            {chip && (
              <span className="text-[0.58rem] bg-white/15 text-white/80 px-[0.48rem] py-[0.14rem] rounded font-bold tracking-[0.08em] uppercase">
                {chip}
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="bg-white/10 border-none cursor-pointer text-white/60 w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:text-white"
          >
            <MdClose className="w-[14px] h-[14px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-[0.9rem] border-t border-border flex items-center justify-end gap-[0.55rem] bg-bg flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
