import { useForm } from 'react-hook-form'
import Modal from './Modal'
import Button from './Button'
import { FormGrid, FormGroup, Label, Input, Select, InfoBox } from './Form'
import { useDataStore } from '../../store'
import { useToast } from '../../hooks'
import { ATTORNEYS, CLIENT_TYPES, COUNTRIES } from '../../utils/mockData'

export default function AddClientModal({ onClose }) {
  const { addClient } = useDataStore()
  const toast         = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { type: 'Company', country: 'India', attorney: 'Self' },
  })

  const onSubmit = (data) => {
    if (!data.name?.trim()) { toast.error('Client name is required'); return }
    addClient(data)
    toast.success(`Client "${data.name}" created with Drive folders!`)
    onClose()
  }

  return (
    <Modal
      title="Add Client"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Create Client + Drive Folder</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          {/* Name */}
          <FormGroup span>
            <Label required>Client / Company Name</Label>
            <Input
              {...register('name', { required: true })}
              placeholder="e.g. ABC Pvt. Ltd."
              className={errors.name ? 'border-red' : ''}
            />
            {errors.name && <p className="text-[0.68rem] text-red mt-1">Client name is required</p>}
          </FormGroup>

          {/* Type */}
          <FormGroup>
            <Label>Type</Label>
            <Select {...register('type')}>
              {CLIENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormGroup>

          {/* Country */}
          <FormGroup>
            <Label>Country</Label>
            <Select {...register('country')}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </Select>
          </FormGroup>

          {/* Contact */}
          <FormGroup>
            <Label>Contact Person</Label>
            <Input {...register('contact')} placeholder="Name of contact" />
          </FormGroup>

          {/* Email */}
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" {...register('email')} placeholder="email@company.com" />
          </FormGroup>

          {/* Phone */}
          <FormGroup>
            <Label>Phone</Label>
            <Input type="tel" {...register('phone')} placeholder="+91 98100 00000" />
          </FormGroup>

          {/* Attorney */}
          <FormGroup span>
            <Label>Assigned Attorney</Label>
            <Select {...register('attorney')}>
              {ATTORNEYS.map(a => <option key={a}>{a}</option>)}
            </Select>
          </FormGroup>

          {/* Info */}
          <InfoBox color="blue">
            Google Drive folder and sub-folders (TM, Patent, Copyright, Design, GI, Court Cases) will be auto-created for this client.
          </InfoBox>
        </FormGrid>
      </form>
    </Modal>
  )
}
