import MatterPage from '../../components/common/MatterPage'
import { PAT_STATUSES } from '../../utils/mockData'
export default function Patent() {
  return <MatterPage type="PAT" title="Patent Matters" subtitle="Applications, examination, grant, renewal, PCT filings" statusOptions={PAT_STATUSES} />
}
