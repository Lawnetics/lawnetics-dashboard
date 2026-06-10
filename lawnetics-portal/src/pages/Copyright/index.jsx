import MatterPage from '../../components/common/MatterPage'
import { COPY_STATUSES } from '../../utils/mockData'
export default function Copyright() {
  return <MatterPage type="COPY" title="Copyright Matters" subtitle="Literary, artistic, dramatic, musical, software works" statusOptions={COPY_STATUSES} />
}
