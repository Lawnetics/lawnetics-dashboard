import { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useDataStore, useUIStore } from '../../store'
import { useTable } from '../../hooks'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchInput from '../../components/common/SearchInput'
import { Table, THead, Th, TBody, Tr, Td, EmptyRow, Pagination } from '../../components/common/Table'
import { TypeBadge, StatusBadge, PriorityDot } from '../../components/common/Badge'
import { daysDiff, getDaysLeftCls } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

// ── Deadline cell ──────────────────────────────────────────────
function DeadlineCell({ date }) {
  if (!date || date === '—') return <span className="text-text-3">—</span>
  const diff = daysDiff(date)
  const color = diff <= 7 ? 'text-red' : diff <= 30 ? 'text-gold' : 'text-text-2'
  return (
    <div>
      <div className={cn('font-semibold text-[0.78rem]', color)}>{date}</div>
      <div className={cn('text-[0.64rem]', color)}>
        {diff < 0 ? 'Overdue' : diff === 0 ? 'TODAY' : `${diff} days`}
      </div>
    </div>
  )
}

// ── Action buttons ─────────────────────────────────────────────
function RowActions({ matter }) {
  const { deleteMatter } = useDataStore()
  const { openModal }    = useUIStore()
  return (
    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
      <Button variant="outline" size="sm" onClick={() => openModal('matterDetail', matter)}>View</Button>
      <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Delete this matter?')) deleteMatter(matter.id) }}>✕</Button>
    </div>
  )
}

// ── Column definitions per type ───────────────────────────────
const COLUMNS = {
  TM: [
    { key: 'appNo',    label: 'App No.',      sortable: true },
    { key: 'mark',     label: 'Mark Name',    sortable: true },
    { key: 'clientName',label: 'Client',      sortable: true },
    { key: 'classes',  label: 'Class(es)' },
    { key: 'filingDate',label: 'Filing Date', sortable: true },
    { key: 'nextDate', label: 'Next Deadline',sortable: true },
    { key: 'status',   label: 'Status',       sortable: true },
    { key: 'priority', label: 'Priority' },
    { key: 'actions',  label: 'Actions' },
  ],
  PAT: [
    { key: 'appNo',      label: 'App No.',       sortable: true },
    { key: 'mark',       label: 'Title / Invention', sortable: true },
    { key: 'clientName', label: 'Client',        sortable: true },
    { key: 'inventors',  label: 'Inventors' },
    { key: 'filingDate', label: 'Filing Date',   sortable: true },
    { key: 'nextDate',   label: 'Next Deadline', sortable: true },
    { key: 'status',     label: 'Status',        sortable: true },
    { key: 'actions',    label: 'Actions' },
  ],
  COPY: [
    { key: 'appNo',      label: 'Diary No.',  sortable: true },
    { key: 'mark',       label: 'Work Title', sortable: true },
    { key: 'nature',     label: 'Nature' },
    { key: 'clientName', label: 'Client / Author', sortable: true },
    { key: 'filingDate', label: 'Filing Date', sortable: true },
    { key: 'status',     label: 'Status',      sortable: true },
    { key: 'actions',    label: 'Actions' },
  ],
  DESIGN: [
    { key: 'appNo',       label: 'App No.',      sortable: true },
    { key: 'mark',        label: 'Article Name', sortable: true },
    { key: 'designClass', label: 'Design Class' },
    { key: 'clientName',  label: 'Client',       sortable: true },
    { key: 'filingDate',  label: 'Filing Date',  sortable: true },
    { key: 'status',      label: 'Status',       sortable: true },
    { key: 'actions',     label: 'Actions' },
  ],
  GI: [
    { key: 'appNo',      label: 'GI App No.',         sortable: true },
    { key: 'mark',       label: 'GI Name',            sortable: true },
    { key: 'goods',      label: 'Goods / Products' },
    { key: 'area',       label: 'Geographical Area' },
    { key: 'clientName', label: 'Applicant',          sortable: true },
    { key: 'filingDate', label: 'Filing Date',        sortable: true },
    { key: 'status',     label: 'Status',             sortable: true },
    { key: 'actions',    label: 'Actions' },
  ],
  HC: [
    { key: 'caseNo',     label: 'Case No.',     sortable: true },
    { key: 'caseTitle',  label: 'Case Title',   sortable: true },
    { key: 'court',      label: 'High Court',   sortable: true },
    { key: 'bench',      label: 'Bench' },
    { key: 'filingDate', label: 'Filing Date',  sortable: true },
    { key: 'nextDate',   label: 'Next Hearing', sortable: true },
    { key: 'stage',      label: 'Stage',        sortable: true },
    { key: 'actions',    label: 'Actions' },
  ],
  DC: [
    { key: 'caseNo',     label: 'Case No.',       sortable: true },
    { key: 'caseTitle',  label: 'Case Title',     sortable: true },
    { key: 'court',      label: 'Court / District',sortable: true },
    { key: 'filingDate', label: 'Filing Date',    sortable: true },
    { key: 'nextDate',   label: 'Next Hearing',   sortable: true },
    { key: 'stage',      label: 'Stage',          sortable: true },
    { key: 'actions',    label: 'Actions' },
  ],
}

// ── Row renderer ───────────────────────────────────────────────
function renderCell(key, matter) {
  switch (key) {
    case 'mark':       return <strong className="font-semibold text-navy">{matter.mark}</strong>
    case 'caseTitle':  return <strong className="font-semibold text-navy">{matter.caseTitle}</strong>
    case 'appNo':      return <span className="font-semibold text-navy">{matter.appNo}</span>
    case 'caseNo':     return <span className="font-semibold text-navy">{matter.caseNo}</span>
    case 'status':     return <StatusBadge status={matter.status} />
    case 'stage':      return <StatusBadge status={matter.stage} />
    case 'priority':   return <PriorityDot priority={matter.priority} />
    case 'nextDate':   return <DeadlineCell date={matter.nextDate} />
    case 'investors':  return <span className="text-[0.74rem]">{matter.inventors || '—'}</span>
    case 'nature':     return matter.nature || '—'
    case 'designClass':return matter.designClass || '—'
    case 'goods':      return matter.goods || '—'
    case 'area':       return matter.area || '—'
    case 'bench':      return matter.bench || '—'
    case 'actions':    return <RowActions matter={matter} />
    default:           return matter[key] || '—'
  }
}

// ── Main MatterPage ────────────────────────────────────────────
export default function MatterPage({ type, title, subtitle, statusOptions = [] }) {
  const { matters } = useDataStore()
  const { openModal } = useUIStore()
  const [statusFilter, setStatusFilter] = useState('')

  const raw = matters.filter(m =>
    m.type === type && (!statusFilter || (m.status === statusFilter || m.stage === statusFilter))
  )

  const searchKeys = ['mark','caseTitle','appNo','caseNo','clientName']
  const { query, setQuery, sortKey, sortDir, toggleSort, page, setPage, totalPages, paginated, total } = useTable(raw, searchKeys, 10)

  const cols = COLUMNS[type] || []

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={`Search ${title.toLowerCase()}…`}
              className="w-[200px]"
            />
            {statusOptions.length > 0 && (
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                className="px-[0.65rem] py-[0.4rem] text-[0.75rem] border-[1.5px] border-border rounded-[7px] outline-none font-sans bg-white text-text"
              >
                <option value="">All Status</option>
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            )}
            <Button size="sm" onClick={() => openModal('addMatter', { defaultType: type })}>
              <MdAdd className="w-3.5 h-3.5" /> Add {type === 'HC' ? 'HC' : type === 'DC' ? 'DC' : type}
            </Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full border-collapse text-[0.79rem]">
          <thead className="bg-bg">
            <tr>
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={cn(
                    'px-[0.9rem] py-[0.6rem] text-left text-[0.6rem] font-bold tracking-[0.12em] uppercase text-text-3 border-b-[2px] border-border whitespace-nowrap select-none',
                    col.sortable && 'cursor-pointer hover:text-navy'
                  )}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="opacity-70">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="text-center py-10 text-text-3 text-[0.82rem]">
                  No {title.toLowerCase()} yet. Click "+ Add" to create one.
                </td>
              </tr>
            ) : (
              paginated.map(m => (
                <tr
                  key={m.id}
                  onClick={() => openModal('matterDetail', m)}
                  className="border-b border-border last:border-b-0 cursor-pointer hover:bg-navy/[0.02] transition-colors"
                >
                  {cols.map(col => (
                    <td key={col.key} className="px-[0.9rem] py-[0.58rem] text-text-2 align-middle">
                      {renderCell(col.key, m)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-[0.9rem] py-[0.65rem] border-t border-border bg-bg text-[0.75rem] text-text-3">
            <span>Showing {Math.min((page - 1) * 10 + 1, total)}–{Math.min(page * 10, total)} of {total}</span>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30">‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i
                if (p < 1 || p > totalPages) return null
                return (
                  <button key={p} onClick={() => setPage(p)} className={cn('w-7 h-7 flex items-center justify-center rounded text-[0.72rem] font-medium', p === page ? 'bg-org text-white' : 'hover:bg-bg-2')}>
                    {p}
                  </button>
                )
              })}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
