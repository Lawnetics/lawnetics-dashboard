import { useForm } from 'react-hook-form'
import Modal from './Modal'
import Button from './Button'
import { FormGrid, FormGroup, Label, Input, Select, Textarea, InfoBox } from './Form'
import { useDataStore, useUIStore } from '../../store'
import { useToast } from '../../hooks'
import { ATTORNEYS, EVENT_TYPES } from '../../utils/mockData'
import { todayStr } from '../../utils/helpers'

export default function AddDeadlineModal({ onClose }) {
  const { matters, addDeadline } = useDataStore()
  const { modalData }            = useUIStore()
  const toast                    = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      type:     'Hearing',
      priority: 'wa',
      attorney: 'Self',
      time:     '10:00',
      date:     todayStr(),
      matterId: modalData?.id || '',
    },
  })

  const onSubmit = (data) => {
    if (!data.date) { toast.error('Date is required'); return }
    const matter = matters.find(m => m.id === data.matterId)
    addDeadline({
      ...data,
      matterName: matter
        ? `${matter.mark || matter.caseTitle} (${matter.clientName})`
        : 'General',
    })
    toast.success('Event added to Docket & Google Calendar!')
    onClose()
  }

  return (
    <Modal
      title="Add Docket Event"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Add to Docket + Calendar</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          {/* Event type */}
          <FormGroup>
            <Label required>Event Type</Label>
            <Select {...register('type', { required: true })}>
              {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormGroup>

          {/* Priority */}
          <FormGroup>
            <Label>Priority</Label>
            <Select {...register('priority')}>
              <option value="ug">Urgent</option>
              <option value="wa">Warning</option>
              <option value="ok">Normal</option>
            </Select>
          </FormGroup>

          {/* Matter */}
          <FormGroup span>
            <Label>Related Matter</Label>
            <Select {...register('matterId')}>
              <option value="">— Select Matter —</option>
              {matters.map(m => (
                <option key={m.id} value={m.id}>
                  {m.type}: {m.mark || m.caseTitle} ({m.clientName})
                </option>
              ))}
            </Select>
          </FormGroup>

          {/* Date */}
          <FormGroup>
            <Label required>Date</Label>
            <Input type="date" {...register('date', { required: true })} />
            {errors.date && <p className="text-[0.68rem] text-red mt-1">Date is required</p>}
          </FormGroup>

          {/* Time */}
          <FormGroup>
            <Label>Time</Label>
            <Input type="time" {...register('time')} />
          </FormGroup>

          {/* Venue */}
          <FormGroup>
            <Label>Venue / Court</Label>
            <Input {...register('venue')} placeholder="e.g. IPO Mumbai / DHC Courtroom 3" />
          </FormGroup>

          {/* Attorney */}
          <FormGroup>
            <Label>Assigned Attorney</Label>
            <Select {...register('attorney')}>
              {ATTORNEYS.map(a => <option key={a}>{a}</option>)}
            </Select>
          </FormGroup>

          {/* Notes */}
          <FormGroup span>
            <Label>Notes</Label>
            <Textarea {...register('notes')} rows={2} placeholder="Hearing officer, instructions, etc." />
          </FormGroup>

          <InfoBox color="green">
            Event syncs to Google Calendar. Email reminders sent 7 days and 1 day before.
          </InfoBox>
        </FormGrid>
      </form>
    </Modal>
  )
}
