import MatterPage from '../../components/common/MatterPage'
import { DC_STAGES } from '../../utils/mockData'
export default function DistrictCourt() {
  return <MatterPage type="DC" title="District Court Cases" subtitle="Civil suits, injunctions, execution proceedings" statusOptions={DC_STAGES} />
}
