import { useState, useRef } from 'react'
import { MdUpload, MdSearch, MdDelete, MdDownload, MdFolder } from 'react-icons/md'
import { useDataStore, useUIStore } from '../../store'
import { useToast } from '../../hooks'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card'
import { genId, todayStr } from '../../utils/helpers'
import { MATTER_TYPES } from '../../utils/mockData'
import { cn } from '../../utils/helpers'

const FILE_STYLE = {
  pdf:  'bg-red-50 text-red-600',
  doc:  'bg-blue-50 text-blue-600',
  docx: 'bg-blue-50 text-blue-600',
  img:  'bg-green-50 text-green-600',
  xls:  'bg-emerald-50 text-emerald-600',
  xlsx: 'bg-emerald-50 text-emerald-600',
}

const DRIVE_FOLDERS = [
  { name: 'Trademark',      icon: '™',  key: 'TM'     },
  { name: 'Patent',         icon: '⚙',  key: 'PAT'    },
  { name: 'Copyright',      icon: '©',  key: 'COPY'   },
  { name: 'Design',         icon: '◈',  key: 'DESIGN' },
  { name: 'GI Tags',        icon: '📍', key: 'GI'     },
  { name: 'High Court',     icon: '⚖',  key: 'HC'     },
  { name: 'District Court', icon: '🏛', key: 'DC'     },
  { name: 'Clients',        icon: '👤', key: 'CL'     },
]

const FOLDER_TREE = ['Trademark','Patent','Copyright','Design','GI','High_Court','District_Court','Clients']

export default function GoogleDrive() {
  const { documents, matters, addDocument, deleteDocument, pushDocumentsToDrive } = useDataStore()
  const toast = useToast()
  const fileRef = useRef()
  const [docSearch, setDocSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState(null)
  const [syncing, setSyncing] = useState(false)

  const filtered = documents.filter(d => {
    const matchSearch = !docSearch || d.name.toLowerCase().includes(docSearch.toLowerCase())
    const matchFolder = !activeFolder || (matters.find(m => m.id === d.matterId)?.type === activeFolder)
    return matchSearch && matchFolder
  })

  const handleUpload = (files) => {
    Array.from(files).forEach(f => {
      if (documents.find(d => d.name === f.name)) { toast.error(`"${f.name}" already exists`); return }
      addDocument(f, '', ['Uploaded'])
    })
    toast.success(`${files.length} file(s) uploaded!`)
  }

  const handlePushToDrive = async () => {
    setSyncing(true)
    toast.info('Pushing local files to Google Drive...')
    try {
      const res = await pushDocumentsToDrive()
      toast.success(res.message || 'Files pushed to Google Drive successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to sync documents')
    } finally {
      setSyncing(false)
    }
  }

  const matterCount = (key) => key === 'CL' ? 0 : matters.filter(m => m.type === key).length

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="Google Drive & Documents"
        subtitle="Auto-synced folders · Gmail attachments · Secure cloud storage"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <MdUpload className="w-3.5 h-3.5" /> Upload Files
            </Button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
            <Button
              size="sm"
              className="bg-org hover:bg-org-dark text-white"
              onClick={handlePushToDrive}
              disabled={syncing}
            >
              {syncing ? 'Pushing...' : 'Push to Drive'}
            </Button>
          </>
        }
      />



      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-[1.1rem]">
        {/* Folder Sidebar */}
        <Card>
          <CardHeader><CardTitle>Drive Folders</CardTitle></CardHeader>
          <CardBody noPadding className="p-2">
            {DRIVE_FOLDERS.map(f => (
              <div
                key={f.key}
                onClick={() => setActiveFolder(activeFolder === f.key ? null : f.key)}
                className={cn(
                  'flex items-center gap-[0.55rem] px-[0.65rem] py-[0.45rem] rounded-[6px] cursor-pointer transition-all border border-transparent',
                  activeFolder === f.key ? 'bg-navy-light border-navy/20' : 'hover:bg-bg hover:border-border'
                )}
              >
                <span className="text-[0.95rem]">{f.icon}</span>
                <span className={cn('text-[0.78rem] flex-1', activeFolder === f.key ? 'text-navy font-semibold' : 'text-text-2')}>
                  {f.name}
                </span>
                <span className="text-[0.64rem] text-text-3">{matterCount(f.key)}</span>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* File Area */}
        <div>
          {/* Search */}
          <div className="flex items-center gap-[0.65rem] mb-[0.9rem]">
            <div className="flex-1 flex items-center gap-[0.48rem] bg-bg border-[1.5px] border-border rounded-[7px] px-[0.75rem] py-[0.42rem] focus-within:border-navy-dark focus-within:bg-white">
              <MdSearch className="w-[14px] h-[14px] text-text-3 flex-shrink-0" />
              <input
                type="text" value={docSearch} onChange={e => setDocSearch(e.target.value)}
                placeholder="Search documents…"
                className="border-none bg-transparent text-[0.79rem] text-text w-full outline-none placeholder:text-text-3"
              />
            </div>
            <span className="text-[0.59rem] font-medium px-[0.46rem] py-[0.13rem] rounded border bg-cyan-light text-cyan-dark border-cyan/20">
              {filtered.length} files
            </span>
          </div>

          {/* File List */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-[0.4rem] mb-6">
              {filtered.map(doc => (
                <div
                  key={doc.id}
                  className="group flex items-center gap-[0.7rem] px-[0.85rem] py-[0.55rem] bg-white border border-border rounded-[7px] transition-all hover:border-border-2 hover:shadow-sm"
                >
                  <div className={cn('w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-[0.56rem] font-extrabold flex-shrink-0', FILE_STYLE[doc.type] || 'bg-bg-2 text-text-3')}>
                    {doc.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.78rem] font-semibold text-navy overflow-hidden whitespace-nowrap text-ellipsis">{doc.name}</div>
                    <div className="text-[0.66rem] text-text-3">{doc.size} · {doc.date} · {doc.tags?.join(', ')}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => {
                      if (doc.url) {
                        window.open(doc.url, '_blank')
                      } else {
                        toast.info('No download link available')
                      }
                    }}>
                      <MdDownload className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Delete?')) deleteDocument(doc.id) }}>
                      <MdDelete className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-3">
              <MdFolder className="w-12 h-12 mx-auto mb-3 opacity-25" />
              <p className="text-[0.82rem]">No documents yet. Upload files to get started.</p>
            </div>
          )}

          {/* Folder Tree Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Auto Folder Structure</CardTitle>
              <span className="text-[0.58rem] font-bold px-[0.5rem] py-[0.14rem] rounded bg-green-light text-green uppercase tracking-[0.06em]">Live</span>
            </CardHeader>
            <CardBody>
              <div className="font-mono text-[0.68rem] bg-dark rounded-[9px] p-[0.9rem_1.1rem] leading-[2] text-[#7dd3fc]">
                <div><span className="text-white/20">📁 </span><span className="text-[#86efac]">LawNetics_Drive/</span></div>
                {FOLDER_TREE.map((f, i) => (
                  <div key={f} style={{ paddingLeft: '1.4rem' }}>
                    <span className="text-white/20">{i === FOLDER_TREE.length - 1 ? '└' : '├'}── 📁 </span>
                    <span className="text-[#86efac]">{f}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
