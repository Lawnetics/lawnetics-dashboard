import { MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { cn } from '../../utils/helpers'

// ── Table Shell ───────────────────────────────────────────────
export function Table({ children, className = '' }) {
  return (
    <div className={cn('overflow-x-auto rounded-card border border-border', className)}>
      <table className="w-full border-collapse text-[0.79rem]">{children}</table>
    </div>
  )
}

// ── THead ─────────────────────────────────────────────────────
export function THead({ children }) {
  return <thead className="bg-bg">{children}</thead>
}

// ── Th – sortable header cell ─────────────────────────────────
export function Th({ children, sortKey, currentSort, sortDir, onSort, className = '' }) {
  const isSorted = currentSort === sortKey
  return (
    <th
      onClick={() => sortKey && onSort?.(sortKey)}
      className={cn(
        'px-[0.9rem] py-[0.6rem] text-left text-[0.6rem] font-bold tracking-[0.12em] uppercase text-text-3 border-b-[2px] border-border whitespace-nowrap select-none',
        sortKey && 'cursor-pointer hover:text-navy',
        className
      )}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortKey && (
          <span className="ml-0.5">
            {isSorted
              ? (sortDir === 'asc' ? <MdArrowUpward className="w-3 h-3" /> : <MdArrowDownward className="w-3 h-3" />)
              : <MdUnfoldMore className="w-3 h-3 opacity-40" />}
          </span>
        )}
      </span>
    </th>
  )
}

// ── TBody ─────────────────────────────────────────────────────
export function TBody({ children }) {
  return <tbody>{children}</tbody>
}

// ── Tr ────────────────────────────────────────────────────────
export function Tr({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={cn('border-b border-border last:border-b-0 transition-colors duration-150', onClick && 'cursor-pointer hover:bg-navy/[0.02]', className)}
    >
      {children}
    </tr>
  )
}

// ── Td ────────────────────────────────────────────────────────
export function Td({ children, className = '', strong = false }) {
  return (
    <td className={cn('px-[0.9rem] py-[0.58rem] text-text-2 align-middle', strong && 'font-semibold text-navy', className)}>
      {children}
    </td>
  )
}

// ── EmptyRow ──────────────────────────────────────────────────
export function EmptyRow({ colSpan = 10, message = 'No records yet. Click "+ Add" to create one.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-10 text-text-3 text-[0.82rem]">
        {message}
      </td>
    </tr>
  )
}

// ── Pagination ────────────────────────────────────────────────
export function Pagination({ page, totalPages, total, pageSize, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-[0.9rem] py-[0.65rem] border-t border-border bg-bg text-[0.75rem] text-text-3">
      <span>Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <MdChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = page <= 3 ? i + 1 : page - 2 + i
          if (p < 1 || p > totalPages) return null
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={cn('w-7 h-7 flex items-center justify-center rounded text-[0.72rem] font-medium', p === page ? 'bg-org text-white' : 'hover:bg-bg-2')}
            >
              {p}
            </button>
          )
        })}
        <button
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <MdChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
