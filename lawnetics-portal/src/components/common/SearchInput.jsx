import { MdSearch } from 'react-icons/md'
import { cn } from '../../utils/helpers'

export default function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={cn('flex items-center gap-[0.48rem] bg-bg border-[1.5px] border-border rounded-[7px] px-[0.75rem] py-[0.42rem] transition-all focus-within:border-navy-dark focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(26,58,114,.09)]', className)}>
      <MdSearch className="w-[14px] h-[14px] text-text-3 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-none bg-transparent text-[0.79rem] text-text w-full outline-none placeholder:text-text-3"
      />
    </div>
  )
}
