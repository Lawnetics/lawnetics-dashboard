// ── Trademark ─────────────────────────────────────────────────
import MatterPage from '../../components/common/MatterPage'
import { TM_STATUSES } from '../../utils/mockData'
export default function Trademark() {
  return <MatterPage type="TM" title="Trademark Matters" subtitle="Applications, FER, hearings, oppositions, registration, renewals" statusOptions={TM_STATUSES} />
}
