import { MdAdd, MdSync } from 'react-icons/md'
import { useDataStore, useUIStore, useSyncStore } from '../../store'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card'
import Calendar from '../../components/common/Calendar'
import DeadlineItem from '../../components/common/DeadlineItem'
import { daysDiff } from '../../utils/helpers'

export default function DocketCalendar() {
  const { deadlines }  = useDataStore()
  const { openModal }  = useUIStore()
  const { startSync }  = useSyncStore()

  const upcoming = [...deadlines]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6)

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="Docket Calendar"
        subtitle="Hearings, deadlines, oppositions, renewals — synced with Google Calendar"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={startSync}>
              <MdSync className="w-3.5 h-3.5" /> Sync Google Calendar
            </Button>
            <Button size="sm" onClick={() => openModal('addDeadline')}>
              <MdAdd className="w-3.5 h-3.5" /> Add Event
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[1.1rem]">
        {/* Calendar */}
        <Card>
          <CardBody><Calendar /></CardBody>
        </Card>

        {/* Sidebar */}
        <div className="flex flex-col gap-[1.1rem]">
          {/* Upcoming Events */}
          <Card>
            <CardHeader><CardTitle>This Month Events</CardTitle></CardHeader>
            <CardBody>
              {upcoming.length > 0 ? (
                <div className="flex flex-col gap-[0.45rem]">
                  {upcoming.map(dl => <DeadlineItem key={dl.id} deadline={dl} />)}
                </div>
              ) : (
                <p className="text-[0.79rem] text-text-3 text-center py-4">No upcoming events.</p>
              )}
            </CardBody>
          </Card>

          {/* Google Calendar sync */}
          <Card>
            <CardHeader>
              <CardTitle>Google Calendar</CardTitle>
              <span className="text-[0.58rem] font-bold px-[0.5rem] py-[0.14rem] rounded bg-green-light text-green uppercase tracking-[0.06em]">Synced</span>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-[0.48rem] px-[0.82rem] py-[0.62rem] rounded-[7px] text-[0.74rem] bg-green-light text-green border border-green/20 mb-[0.7rem]">
                <svg className="w-[14px] h-[14px] flex-shrink-0 mt-[0.1rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>
                <span>Auto-sync enabled. All deadlines appear in Google Calendar instantly.</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mb-[0.4rem]" onClick={startSync}>
                Sync Now
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => window.open('https://calendar.google.com','_blank')}>
                Open Google Calendar ↗
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
