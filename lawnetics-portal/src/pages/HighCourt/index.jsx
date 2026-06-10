import MatterPage from '../../components/common/MatterPage'
import { HC_STAGES } from '../../utils/mockData'
export default function HighCourt() {
  return <MatterPage type="HC" title="High Court Cases" subtitle="Writ petitions, appeals, revisions, contempt, IP suits" statusOptions={HC_STAGES} />
}
