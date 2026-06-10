import { MdAdd, MdFolder } from 'react-icons/md'
import { useDataStore, useUIStore } from '../../store'
import { useTable } from '../../hooks'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchInput from '../../components/common/SearchInput'
import { cn } from '../../utils/helpers'

export default function Clients() {
  const { clients, matters, deleteClient } = useDataStore()
  const { openModal } = useUIStore()
  const { query, setQuery, sortKey, sortDir, toggleSort, page, setPage, totalPages, paginated, total } = useTable(clients, ['name','email','country'], 10)

  const matterCount = (clientId, type) =>
    matters.filter(m => m.clientId === clientId && (!type || m.type === type)).length

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="Clients"
        subtitle="All registered clients and their matter portfolios"
        actions={
          <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search clients…" className="w-[200px]" />
            <Button size="sm" onClick={() => openModal('addClient')}>
              <MdAdd className="w-3.5 h-3.5" /> Add Client
            </Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full border-collapse text-[0.79rem]">
          <thead className="bg-bg">
            <tr>
              {[
                { key: 'name',    label: 'Client / Company', sortable: true },
                { key: 'type',    label: 'Type' },
                { key: 'country', label: 'Country', sortable: true },
                { key: 'tm',      label: 'TM' },
                { key: 'patent',  label: 'Patent' },
                { key: 'copy',    label: 'Copyright' },
                { key: 'gi',      label: 'GI' },
                { key: 'cases',   label: 'Cases' },
                { key: 'attorney',label: 'Attorney', sortable: true },
                { key: 'actions', label: 'Actions' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={cn(
                    'px-[0.9rem] py-[0.6rem] text-left text-[0.6rem] font-bold tracking-[0.12em] uppercase text-text-3 border-b-[2px] border-border whitespace-nowrap select-none',
                    col.sortable && 'cursor-pointer hover:text-navy'
                  )}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && <span className="ml-1 opacity-70">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-text-3 text-[0.82rem]">
                  No clients yet. Click "+ Add Client" to get started.
                </td>
              </tr>
            ) : (
              paginated.map(c => (
                <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-navy/[0.02] transition-colors cursor-default">
                  <td className="px-[0.9rem] py-[0.58rem] text-text-2 align-middle">
                    <div className="font-semibold text-navy">{c.name}</div>
                    <div className="text-[0.68rem] text-text-3">{c.email}</div>
                  </td>
                  <td className="px-[0.9rem] py-[0.58rem] text-text-2 align-middle">
                    <span className="text-[0.6rem] bg-bg-2 text-text-3 border border-border px-1.5 py-0.5 rounded">{c.type}</span>
                  </td>
                  <td className="px-[0.9rem] py-[0.58rem] text-text-2 align-middle">{c.country}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle font-bold text-org">{matterCount(c.id,'TM')}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle font-bold text-cyan-dark">{matterCount(c.id,'PAT')}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle font-bold text-gold">{matterCount(c.id,'COPY')}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle font-bold text-green">{matterCount(c.id,'GI')}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle font-bold text-red">
                    {matterCount(c.id,'HC') + matterCount(c.id,'DC')}
                  </td>
                  <td className="px-[0.9rem] py-[0.58rem] text-text-2 align-middle text-[0.78rem]">{c.attorney}</td>
                  <td className="px-[0.9rem] py-[0.58rem] align-middle">
                    <div className="flex gap-1">
                      <Button
                        variant="outline" size="sm"
                        onClick={() => alert(`Opening Drive: LawNetics/${c.name}`)}
                      >
                        <MdFolder className="w-3.5 h-3.5" /> Drive
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { if (window.confirm(`Delete client "${c.name}"?`)) deleteClient(c.id) }}
                      >✕</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-[0.9rem] py-[0.65rem] border-t border-border bg-bg text-[0.75rem] text-text-3">
            <span>Showing {Math.min((page-1)*10+1,total)}–{Math.min(page*10,total)} of {total}</span>
            <div className="flex items-center gap-1">
              <button disabled={page===1} onClick={() => setPage(page-1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30">‹</button>
              {Array.from({length:Math.min(5,totalPages)},(_,i) => {
                const p = page<=3 ? i+1 : page-2+i
                if(p<1||p>totalPages)return null
                return <button key={p} onClick={() => setPage(p)} className={cn('w-7 h-7 flex items-center justify-center rounded text-[0.72rem] font-medium', p===page?'bg-org text-white':'hover:bg-bg-2')}>{p}</button>
              })}
              <button disabled={page===totalPages} onClick={() => setPage(page+1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-2 disabled:opacity-30">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
