import Modal from './Modal'
import Button from './Button'
import { TypeBadge, StatusBadge } from './Badge'
import { useDataStore, useUIStore } from '../../store'
import { useToast } from '../../hooks'
import { FOLDER_SUBFOLDERS } from '../../utils/mockData'
import { getDriveFolderName, daysDiff } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

const PRIORITY_CLS  = { h: 'bg-red-light text-red', m: 'bg-gold-light text-gold', l: 'bg-green-light text-green' }
const PRIORITY_LABEL= { h: 'High Priority', m: 'Medium', l: 'Low' }

const DL_BORDER = { ug: 'border-l-[3px] border-red bg-red-light', wa: 'border-l-[3px] border-gold bg-gold-light', ok: 'border-l-[3px] border-green' }

const FILE_CLS = { pdf:'bg-red-50 text-red-600', doc:'bg-blue-50 text-blue-600', docx:'bg-blue-50 text-blue-600' }

export default function MatterDetailModal({ onClose }) {
  const { modalData, openModal } = useUIStore()
  const { deadlines, documents, deleteMatter, addDocument } = useDataStore()
  const toast = useToast()

  const matter = modalData
  if (!matter) return null

  const handleUpload = (files) => {
    Array.from(files).forEach(f => {
      addDocument(f, matter.id, ['Uploaded'])
    })
    toast.success(`${files.length} file(s) uploaded successfully!`)
  }

  const mDeadlines = deadlines.filter(d => d.matterId === matter.id)
  const mDocs      = documents.filter(d => d.matterId === matter.id)
  const subs       = FOLDER_SUBFOLDERS[matter.type] || ['Filing_Documents','Registration','Client_Communication','Miscellaneous']
  const base       = getDriveFolderName(matter)

  const InfoRow = ({ label, value }) => value ? (
    <tr>
      <td className="py-[0.3rem] text-text-3 text-[0.78rem] w-[110px] align-top">{label}</td>
      <td className="py-[0.3rem] text-text text-[0.78rem] font-medium pl-2">{value}</td>
    </tr>
  ) : null

  return (
    <Modal
      title={matter.mark || matter.caseTitle || 'Matter'}
      chip={matter.type}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => { openModal('addDeadline', matter); }}>Add Deadline</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info('Opening Drive folder…')}>📁 Open Folder</Button>
          <Button
            variant="danger" size="sm"
            onClick={() => {
              if (window.confirm('Delete this matter?')) {
                deleteMatter(matter.id)
                toast.info('Matter deleted')
                onClose()
              }
            }}
          >Delete</Button>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        {/* ── Left – Details ── */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-4">
            <TypeBadge type={matter.type} />
            <StatusBadge status={matter.status || matter.stage} />
            {matter.priority && (
              <span className={cn('text-[0.58rem] font-bold tracking-[0.06em] uppercase px-[0.5rem] py-[0.14rem] rounded', PRIORITY_CLS[matter.priority])}>
                {PRIORITY_LABEL[matter.priority]}
              </span>
            )}
          </div>

          {/* Key info table */}
          <table className="w-full border-collapse">
            <tbody>
              <InfoRow label="App / Case No."  value={matter.appNo || matter.caseNo} />
              <InfoRow label="Client"          value={matter.clientName} />
              <InfoRow label="Classes"         value={matter.classes} />
              <InfoRow label="Inventors"       value={matter.inventors} />
              <InfoRow label="Nature"          value={matter.nature} />
              <InfoRow label="Court"           value={matter.court} />
              <InfoRow label="Bench"           value={matter.bench} />
              <InfoRow label="Geographical Area" value={matter.area} />
              <InfoRow label="Goods"           value={matter.goods} />
              <InfoRow label="Filing Date"     value={matter.filingDate} />
              <InfoRow label="Next Deadline"   value={matter.nextDate} />
              <InfoRow label="Attorney"        value={matter.attorney} />
            </tbody>
          </table>
          {matter.notes && (
            <div className="mt-3 p-3 bg-bg rounded-[7px] text-[0.77rem] text-text-2 leading-relaxed">
              <span className="font-semibold text-text-3 uppercase tracking-wider text-[0.62rem] block mb-1">Notes</span>
              {matter.notes}
            </div>
          )}

          {/* Deadlines */}
          <div className="mt-4">
            <div className="text-[0.62rem] font-bold tracking-[0.15em] uppercase text-text-3 mb-2">
              Deadlines ({mDeadlines.length})
            </div>
            <div className="flex flex-col gap-1">
              {mDeadlines.length > 0 ? mDeadlines.map(d => (
                <div key={d.id} className={cn('flex items-center gap-2 px-3 py-2 rounded-[5px] border', DL_BORDER[d.priority] || 'border-border')}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.78rem] font-semibold text-navy">{d.type}</div>
                    <div className="text-[0.68rem] text-text-3">{d.date}{d.venue ? ` · ${d.venue}` : ''}</div>
                  </div>
                  {(() => {
                    const diff = daysDiff(d.date)
                    if (diff === null) return null
                    const c = diff <= 3 ? 'text-red' : diff <= 14 ? 'text-gold' : 'text-green'
                    return <span className={cn('text-[0.64rem] font-bold', c)}>{diff === 0 ? 'TODAY' : diff + 'd'}</span>
                  })()}
                </div>
              )) : <p className="text-[0.75rem] text-text-3">No deadlines set.</p>}
            </div>
          </div>
        </div>

        {/* ── Right – Drive + Docs ── */}
        <div>
          {/* Folder tree */}
          <div className="text-[0.62rem] font-bold tracking-[0.15em] uppercase text-text-3 mb-2">
            Drive Folder Structure
          </div>
          <div className="font-mono text-[0.65rem] bg-dark rounded-[9px] px-[1.1rem] py-[0.9rem] leading-[2] mb-4 text-[#7dd3fc]">
            <div><span className="text-white/20">📁 </span><span className="text-[#86efac]">{base}</span></div>
            {subs.map((s, i) => (
              <div key={s} style={{ paddingLeft: '1.35rem' }}>
                <span className="text-white/20">{i === subs.length - 1 ? '└' : '├'}── 📁 </span>
                <span className="text-[#fde68a]">{s}</span>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="text-[0.62rem] font-bold tracking-[0.15em] uppercase text-text-3 mb-2">
            Documents ({mDocs.length})
          </div>
          <div className="flex flex-col gap-1">
            {mDocs.length > 0 ? mDocs.map(d => (
              <div key={d.id} className="group flex items-center gap-3 px-3 py-2 bg-white border border-border rounded-[6px] hover:border-border-2 transition-colors">
                <div className={cn('w-[30px] h-[30px] rounded-[5px] flex items-center justify-center text-[0.56rem] font-extrabold flex-shrink-0', FILE_CLS[d.type] || 'bg-bg-2 text-text-3')}>
                  {d.type.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.76rem] font-semibold text-navy overflow-hidden whitespace-nowrap text-ellipsis">{d.name}</div>
                  <div className="text-[0.64rem] text-text-3">{d.size}</div>
                </div>
                {d.url && (
                  <button
                    onClick={() => window.open(d.url, '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-text-3 hover:text-navy cursor-pointer bg-transparent border-none p-1"
                    title="Download / View"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                )}
              </div>
            )) : <p className="text-[0.75rem] text-text-3">No documents uploaded.</p>}
          </div>

          {/* Quick actions */}
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <Button size="sm" className="w-full" onClick={() => { document.getElementById('lawnetics-file-upload')?.click() }}>
              Upload Document
            </Button>
            <input
              id="lawnetics-file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button variant="outline" size="sm" className="w-full" onClick={() => openModal('addDeadline', matter)}>
              Add Deadline / Event
            </Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => toast.info('Opening Drive folder…')}>
              📁 Open in Google Drive
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
