import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from './Modal'
import Button from './Button'
import {
  FormGrid, FormGroup, FormSectionTitle, Label,
  Input, Select, Textarea, InfoBox,
} from './Form'
import { useDataStore, useUIStore } from '../../store'
import { useToast } from '../../hooks'
import { ATTORNEYS, TM_STATUSES, PAT_STATUSES, COPY_STATUSES, HC_STAGES, DC_STAGES } from '../../utils/mockData'
import { getDriveFolderName } from '../../utils/helpers'

const TYPE_NAMES = {
  TM:'Trademark', PAT:'Patent', COPY:'Copyright',
  DESIGN:'Design', GI:'GI Tag', HC:'High Court Case', DC:'District Court Case',
}
const HC_COURTS = [
  'Delhi High Court','Bombay High Court','Madras High Court',
  'Calcutta High Court','Allahabad High Court','Karnataka High Court',
  'Gujarat High Court','Rajasthan High Court','Punjab & Haryana HC','Other',
]

export default function AddMatterModal({ onClose }) {
  const { modalData }         = useUIStore()
  const { clients, addMatter }= useDataStore()
  const toast                 = useToast()

  const [type, setType] = useState(modalData?.defaultType || 'TM')
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'TM', priority: 'm', attorney: 'Self', status: 'Pending', stage: 'Filing' },
    shouldUnregister: true,
  })

  const appNo = watch('appNo') || 'AppNo'
  const mark  = watch('mark')  || 'MarkName'
  const cls   = watch('classes') || 'X'
  const folderPreview = type === 'TM'
    ? `TM_${appNo}_${(mark || '').replace(/ /g,'_')}_Class${cls}`
    : type === 'HC' || type === 'DC'
      ? `${type}_CaseNo`
      : `${type}_${appNo}`

  useEffect(() => {
    reset({
      type,
      priority: 'm',
      attorney: 'Self',
      status: ['HC','DC'].includes(type) ? undefined : 'Pending',
      stage: ['HC','DC'].includes(type) ? 'Filing' : undefined,
    })
  }, [type, reset])

  const onSubmit = (data) => {
    const client = clients.find(c => c.id === data.clientId)
    if (!client) { toast.error('Please select a client'); return }

    addMatter({
      ...data,
      type,
      clientId:   client.id,
      clientName: client.name,
    })

    toast.success(`Matter saved! Drive folder "${folderPreview}" created.`)
    onClose()
  }

  return (
    <Modal
      title={`Add ${TYPE_NAMES[type]} Matter`}
      chip={type}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Save &amp; Create Drive Folder</Button>
        </>
      }
    >
      {/* Type selector tabs */}
      <div className="flex gap-1 flex-wrap mb-5 p-1 bg-bg rounded-[8px]">
        {Object.entries(TYPE_NAMES).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setType(k)}
            className={`px-3 py-1.5 rounded-[6px] text-[0.68rem] font-bold tracking-wide transition-all ${
              type === k ? 'bg-org text-white shadow-org' : 'text-text-2 hover:bg-white hover:text-navy'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          {/* Client – always shown */}
          <FormGroup span>
            <Label required>Client</Label>
            <Select {...register('clientId', { required: true })} className={errors.clientId ? 'border-red' : ''}>
              <option value="">— Select Client —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            {errors.clientId && <p className="text-[0.68rem] text-red mt-1">Client selection is required</p>}
          </FormGroup>

          {/* ── TM ── */}
          {type === 'TM' && <>
            <FormSectionTitle>Trademark Details</FormSectionTitle>
            <FormGroup>
              <Label required>Application No.</Label>
              <Input {...register('appNo', { required: true })} placeholder="e.g. 5896321" className={errors.appNo ? 'border-red' : ''} />
              {errors.appNo && <p className="text-[0.68rem] text-red mt-1">Application number is required</p>}
            </FormGroup>
            <FormGroup>
              <Label required>Mark Name</Label>
              <Input {...register('mark', { required: true })} placeholder="e.g. ZENOVA" className={errors.mark ? 'border-red' : ''} />
              {errors.mark && <p className="text-[0.68rem] text-red mt-1">Mark name is required</p>}
            </FormGroup>
            <FormGroup>
              <Label required>Class(es)</Label>
              <Input {...register('classes', { required: true })} placeholder="e.g. 35 or 9,42" className={errors.classes ? 'border-red' : ''} />
              {errors.classes && <p className="text-[0.68rem] text-red mt-1">Class(es) is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Type of Mark</Label>
              <Select {...register('markType')}>
                {['Word Mark','Device Mark','Combined Mark','3D Mark','Sound Mark','Colour Mark'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label required>Filing Date</Label>
              <Input type="date" {...register('filingDate', { required: true })} className={errors.filingDate ? 'border-red' : ''} />
              {errors.filingDate && <p className="text-[0.68rem] text-red mt-1">Filing date is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Priority Date</Label>
              <Input type="date" {...register('priorityDate')} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                {TM_STATUSES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Next Deadline Date</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
          </>}

          {/* ── PAT ── */}
          {type === 'PAT' && <>
            <FormSectionTitle>Patent Details</FormSectionTitle>
            <FormGroup>
              <Label required>Application No.</Label>
              <Input {...register('appNo', { required: true })} placeholder="e.g. IN202441002234" className={errors.appNo ? 'border-red' : ''} />
              {errors.appNo && <p className="text-[0.68rem] text-red mt-1">Application number is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label required>Title of Invention</Label>
              <Input {...register('mark', { required: true })} placeholder="Title of the invention" className={errors.mark ? 'border-red' : ''} />
              {errors.mark && <p className="text-[0.68rem] text-red mt-1">Title of invention is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label>Inventors</Label>
              <Input {...register('inventors')} placeholder="Name1, Name2…" />
            </FormGroup>
            <FormGroup>
              <Label>Patent Type</Label>
              <Select {...register('patentType')}>
                {['Ordinary','PCT National Phase','Convention','Divisional'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Field of Invention</Label>
              <Input {...register('field')} placeholder="e.g. Electronics, Pharma" />
            </FormGroup>
            <FormGroup>
              <Label required>Filing Date</Label>
              <Input type="date" {...register('filingDate', { required: true })} className={errors.filingDate ? 'border-red' : ''} />
              {errors.filingDate && <p className="text-[0.68rem] text-red mt-1">Filing date is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                {PAT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Next Deadline</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
          </>}

          {/* ── COPY ── */}
          {type === 'COPY' && <>
            <FormSectionTitle>Copyright Details</FormSectionTitle>
            <FormGroup>
              <Label>Diary / App No.</Label>
              <Input {...register('appNo')} placeholder="e.g. SW/2025/00456" />
            </FormGroup>
            <FormGroup span>
              <Label required>Work Title</Label>
              <Input {...register('mark', { required: true })} placeholder="Title of the copyrighted work" className={errors.mark ? 'border-red' : ''} />
              {errors.mark && <p className="text-[0.68rem] text-red mt-1">Work title is required</p>}
            </FormGroup>
            <FormGroup>
              <Label required>Nature of Work</Label>
              <Select {...register('nature', { required: true })} className={errors.nature ? 'border-red' : ''}>
                <option value="">— Select Nature —</option>
                {['Literary','Artistic','Dramatic','Musical','Sound Recording','Cinematograph Film','Computer Programme'].map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
              {errors.nature && <p className="text-[0.68rem] text-red mt-1">Nature of work is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Author / Creator</Label>
              <Input {...register('author')} placeholder="Author name" />
            </FormGroup>
            <FormGroup>
              <Label>Filing Date</Label>
              <Input type="date" {...register('filingDate')} />
            </FormGroup>
            <FormGroup>
              <Label>Registration Date</Label>
              <Input type="date" {...register('registrationDate')} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                {COPY_STATUSES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Next Deadline</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
          </>}

          {/* ── DESIGN ── */}
          {type === 'DESIGN' && <>
            <FormSectionTitle>Design Details</FormSectionTitle>
            <FormGroup>
              <Label required>Application No.</Label>
              <Input {...register('appNo', { required: true })} placeholder="e.g. D/2025/12345" className={errors.appNo ? 'border-red' : ''} />
              {errors.appNo && <p className="text-[0.68rem] text-red mt-1">Application number is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label required>Article Name</Label>
              <Input {...register('mark', { required: true })} placeholder="Name of the article" className={errors.mark ? 'border-red' : ''} />
              {errors.mark && <p className="text-[0.68rem] text-red mt-1">Article name is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Design Class</Label>
              <Input {...register('designClass')} placeholder="e.g. 09-03" />
            </FormGroup>
            <FormGroup>
              <Label>Locarno Class</Label>
              <Input {...register('locarnoClass')} placeholder="e.g. 01-01" />
            </FormGroup>
            <FormGroup>
              <Label required>Filing Date</Label>
              <Input type="date" {...register('filingDate', { required: true })} className={errors.filingDate ? 'border-red' : ''} />
              {errors.filingDate && <p className="text-[0.68rem] text-red mt-1">Filing date is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                {['Pending','Objected','Registered','Cancelled'].map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Next Deadline</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
          </>}

          {/* ── GI ── */}
          {type === 'GI' && <>
            <FormSectionTitle>Geographical Indication Details</FormSectionTitle>
            <FormGroup>
              <Label required>GI Application No.</Label>
              <Input {...register('appNo', { required: true })} placeholder="e.g. GI/1/2006/00045" className={errors.appNo ? 'border-red' : ''} />
              {errors.appNo && <p className="text-[0.68rem] text-red mt-1">GI Application number is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label required>GI Name</Label>
              <Input {...register('mark', { required: true })} placeholder="Name of Geographical Indication" className={errors.mark ? 'border-red' : ''} />
              {errors.mark && <p className="text-[0.68rem] text-red mt-1">GI Name is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label>Goods / Products</Label>
              <Input {...register('goods')} placeholder="e.g. Tea, Handicrafts, Spices" />
            </FormGroup>
            <FormGroup>
              <Label required>Geographical Area</Label>
              <Input {...register('area', { required: true })} placeholder="e.g. Darjeeling, West Bengal" className={errors.area ? 'border-red' : ''} />
              {errors.area && <p className="text-[0.68rem] text-red mt-1">Geographical area is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>GI Class</Label>
              <Input {...register('giClass')} placeholder="Class of goods" />
            </FormGroup>
            <FormGroup>
              <Label>Filing Date</Label>
              <Input type="date" {...register('filingDate')} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select {...register('status')}>
                {['Applied','Under Examination','Advertised','Registered','Renewal Due'].map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Next Deadline</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
          </>}

          {/* ── HC ── */}
          {type === 'HC' && <>
            <FormSectionTitle>High Court Case Details</FormSectionTitle>
            <FormGroup>
              <Label required>Case No.</Label>
              <Input {...register('caseNo', { required: true })} placeholder="e.g. W.P.(C) 1234/2025" className={errors.caseNo ? 'border-red' : ''} />
              {errors.caseNo && <p className="text-[0.68rem] text-red mt-1">Case number is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label required>Case Title</Label>
              <Input {...register('caseTitle', { required: true })} placeholder="Petitioner vs Respondent" className={errors.caseTitle ? 'border-red' : ''} />
              {errors.caseTitle && <p className="text-[0.68rem] text-red mt-1">Case title is required</p>}
            </FormGroup>
            <FormGroup>
              <Label required>High Court</Label>
              <Select {...register('court', { required: true })} className={errors.court ? 'border-red' : ''}>
                <option value="">— Select High Court —</option>
                {HC_COURTS.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              {errors.court && <p className="text-[0.68rem] text-red mt-1">High court is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Case Type</Label>
              <Select {...register('caseType')}>
                {['Writ Petition','Appeal','Revision','Contempt','Commercial Suit','IP Infringement Suit','Passing Off'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Bench</Label>
              <Select {...register('bench')}>
                {['Single Bench','Division Bench','Full Bench'].map(b => <option key={b}>{b}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label required>Filing Date</Label>
              <Input type="date" {...register('filingDate', { required: true })} className={errors.filingDate ? 'border-red' : ''} />
              {errors.filingDate && <p className="text-[0.68rem] text-red mt-1">Filing date is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Next Hearing Date</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
            <FormGroup span>
              <Label>Stage</Label>
              <Select {...register('stage')}>
                {HC_STAGES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
          </>}

          {/* ── DC ── */}
          {type === 'DC' && <>
            <FormSectionTitle>District Court Case Details</FormSectionTitle>
            <FormGroup>
              <Label required>Case No.</Label>
              <Input {...register('caseNo', { required: true })} placeholder="e.g. CS(OS) 567/2025" className={errors.caseNo ? 'border-red' : ''} />
              {errors.caseNo && <p className="text-[0.68rem] text-red mt-1">Case number is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label required>Case Title</Label>
              <Input {...register('caseTitle', { required: true })} placeholder="Plaintiff vs Defendant" className={errors.caseTitle ? 'border-red' : ''} />
              {errors.caseTitle && <p className="text-[0.68rem] text-red mt-1">Case title is required</p>}
            </FormGroup>
            <FormGroup span>
              <Label>Court / District</Label>
              <Input {...register('court')} placeholder="e.g. Saket District Court, Delhi" />
            </FormGroup>
            <FormGroup>
              <Label>Case Type</Label>
              <Select {...register('caseType')}>
                {['Civil Suit','Injunction','Execution','IP Infringement','Passing Off','Other'].map(o => <option key={o}>{o}</option>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label required>Filing Date</Label>
              <Input type="date" {...register('filingDate', { required: true })} className={errors.filingDate ? 'border-red' : ''} />
              {errors.filingDate && <p className="text-[0.68rem] text-red mt-1">Filing date is required</p>}
            </FormGroup>
            <FormGroup>
              <Label>Next Hearing Date</Label>
              <Input type="date" {...register('nextDate')} />
            </FormGroup>
            <FormGroup span>
              <Label>Stage</Label>
              <Select {...register('stage')}>
                {DC_STAGES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormGroup>
          </>}

          {/* ── Common tail – attorney, priority, notes ── */}
          <FormGroup>
            <Label>Assigned Attorney</Label>
            <Select {...register('attorney')}>
              {ATTORNEYS.map(a => <option key={a}>{a}</option>)}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Priority</Label>
            <Select {...register('priority')}>
              <option value="h">High</option>
              <option value="m">Medium</option>
              <option value="l">Low</option>
            </Select>
          </FormGroup>
          <FormGroup span>
            <Label>Notes / Instructions</Label>
            <Textarea {...register('notes')} placeholder="Additional notes about this matter…" />
          </FormGroup>

          {/* Drive folder preview – TM only */}
          {type === 'TM' && (
            <InfoBox color="blue">
              Drive folder will be: <strong className="font-semibold">{folderPreview}</strong>
            </InfoBox>
          )}
          {type !== 'TM' && (
            <InfoBox color="blue">
              A Google Drive folder will be automatically created for this matter with all required sub-folders.
            </InfoBox>
          )}
        </FormGrid>
      </form>
    </Modal>
  )
}
