import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdMenu, MdCalendarMonth, MdBackup, MdAdd, MdSearch } from 'react-icons/md'
import { useUIStore, useSyncStore, useDataStore } from '../../store'
import { useToast } from '../../hooks'
import Breadcrumb from './Breadcrumb'
import AddMatterModal from '../common/AddMatterModal'

export default function Header() {
  const { toggleSidebar, openModal } = useUIStore()
  const { status, startSync }        = useSyncStore()
  const { matters }                  = useDataStore()
  const toast                        = useToast()
  const navigate                     = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); setShowResults(false); return }
    const r = matters.filter(m =>
      (m.mark || m.caseTitle || '').toLowerCase().includes(q.toLowerCase()) ||
      (m.appNo || m.caseNo || '').toLowerCase().includes(q.toLowerCase()) ||
      (m.clientName || '').toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
    setSearchResults(r)
    setShowResults(true)
  }

  const handleBackup = () => toast.info('Creating backup…')

  const syncColor = status === 'syncing'
    ? 'bg-cyan-light text-cyan-dark'
    : 'bg-green-light text-green'

  return (
    <header className="h-[54px] bg-white border-b border-border flex items-center gap-4 px-6 flex-shrink-0 shadow-sm z-40 relative">
      {/* Left */}
      <div className="flex items-center gap-[0.85rem] flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="w-[32px] h-[32px] flex items-center justify-center border-none bg-transparent cursor-pointer rounded-[6px] transition-colors hover:bg-bg flex-shrink-0"
        >
          <MdMenu className="w-[18px] h-[18px] text-text-2" />
        </button>
        <Breadcrumb />
      </div>

      {/* Search */}
      <div className="relative flex-shrink-0">
        <div className="flex items-center gap-[0.48rem] bg-bg border-[1.5px] border-border rounded-[7px] px-[0.8rem] py-[0.38rem] w-[260px] transition-all focus-within:border-navy-dark focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(26,58,114,.09)]">
          <MdSearch className="w-[14px] h-[14px] text-text-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search matters, clients…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="border-none bg-transparent text-[0.78rem] text-text w-full outline-none placeholder:text-text-3"
          />
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-[7px] shadow-md z-50 overflow-hidden">
            {searchResults.map((m) => (
              <button
                key={m.id}
                onMouseDown={() => { navigate(`/${m.type.toLowerCase() === 'tm' ? 'trademark' : m.type.toLowerCase()}`); setShowResults(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bg text-left text-[0.78rem] border-b border-border last:border-b-0"
              >
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded bg-bg-2 text-text-3">{m.type}</span>
                <span className="font-medium text-navy">{m.mark || m.caseTitle}</span>
                <span className="text-text-3 ml-auto">{m.clientName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-[0.45rem] flex-shrink-0">
        {/* Sync pill */}
        <div
          onClick={() => { startSync(); navigate('/google-drive') }}
          className={`flex items-center gap-[0.38rem] text-[0.68rem] font-semibold px-[0.65rem] py-[0.26rem] rounded-[18px] cursor-pointer transition-colors ${syncColor}`}
        >
          <span className={`w-[6px] h-[6px] rounded-full ${status === 'syncing' ? 'bg-cyan animate-pulse' : 'bg-green'}`} />
          <span>{status === 'syncing' ? 'Syncing…' : 'Drive Synced'}</span>
        </div>

        {/* Calendar bell */}
        <button
          onClick={() => navigate('/docket-calendar')}
          className="relative w-[32px] h-[32px] flex items-center justify-center border-none bg-transparent cursor-pointer rounded-[6px] transition-colors hover:bg-bg"
        >
          <MdCalendarMonth className="w-[17px] h-[17px] text-text-2" />
          <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] bg-org rounded-full border-[2px] border-white animate-pulse" />
        </button>

        {/* Backup */}
        <button
          onClick={handleBackup}
          className="w-[32px] h-[32px] flex items-center justify-center border-none bg-transparent cursor-pointer rounded-[6px] transition-colors hover:bg-bg"
          title="Backup"
        >
          <MdBackup className="w-[17px] h-[17px] text-text-2" />
        </button>

        {/* Add Matter */}
        <button
          onClick={() => openModal('addMatter')}
          className="flex items-center gap-[0.38rem] bg-org text-white border-none rounded-[7px] px-[0.85rem] py-[0.4rem] text-[0.72rem] font-extrabold tracking-[0.05em] uppercase cursor-pointer transition-all hover:bg-org-dark hover:-translate-y-px hover:shadow-org flex-shrink-0"
        >
          <MdAdd className="w-[13px] h-[13px]" />
          Add Matter
        </button>
      </div>
    </header>
  )
}
