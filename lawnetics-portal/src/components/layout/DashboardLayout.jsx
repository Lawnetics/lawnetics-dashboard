import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AddMatterModal from '../common/AddMatterModal'
import AddClientModal from '../common/AddClientModal'
import AddDeadlineModal from '../common/AddDeadlineModal'
import MatterDetailModal from '../common/MatterDetailModal'
import { useEffect } from 'react'
import { useUIStore, useDataStore } from '../../store'

export default function DashboardLayout() {
  const { activeModal, closeModal } = useUIStore()

  useEffect(() => {
    useDataStore.getState().fetchInitialData()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      {activeModal === 'addMatter'    && <AddMatterModal   onClose={closeModal} />}
      {activeModal === 'addClient'    && <AddClientModal    onClose={closeModal} />}
      {activeModal === 'addDeadline'  && <AddDeadlineModal  onClose={closeModal} />}
      {activeModal === 'matterDetail' && <MatterDetailModal onClose={closeModal} />}
    </div>
  )
}
