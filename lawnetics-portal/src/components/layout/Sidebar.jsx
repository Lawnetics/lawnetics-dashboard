import { NavLink, useNavigate } from 'react-router-dom'
import {
  MdDashboard, MdPeople, MdCalendarMonth, MdBarChart,
  MdOutlineGavel, MdWorkspaces, MdLocationOn
} from 'react-icons/md'
import {
  RiShieldFlashLine, RiCopyrightLine, RiPentagonLine
} from 'react-icons/ri'
import { TbAtom2 } from 'react-icons/tb'
import { BsBuilding, BsFolder2Open } from 'react-icons/bs'
import { IoLogOutOutline } from 'react-icons/io5'
import { useAuthStore, useUIStore, useDataStore } from '../../store'
import { cn } from '../../utils/helpers'

const NAV = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard',   to: '/dashboard',       Icon: MdDashboard,       badge: null },
      { label: 'Clients',     to: '/clients',          Icon: MdPeople,          badgeKey: 'clients' },
    ],
  },
  {
    section: 'IP Matters',
    items: [
      { label: 'Trademark',        to: '/trademark',       Icon: RiShieldFlashLine, badgeKey: 'TM',     badgeColor: 'bg-org' },
      { label: 'Patent',           to: '/patent',          Icon: TbAtom2,           badgeKey: 'PAT',    badgeColor: 'bg-cyan-dark' },
      { label: 'Copyright',        to: '/copyright',       Icon: RiCopyrightLine,   badgeKey: 'COPY',   badgeColor: 'bg-gold' },
      { label: 'Design',           to: '/design',          Icon: RiPentagonLine,    badgeKey: 'DESIGN', badgeColor: 'bg-purple' },
      { label: 'GI Tag',           to: '/gi',              Icon: MdLocationOn,      badgeKey: 'GI',     badgeColor: 'bg-green' },
    ],
  },
  {
    section: 'Court Cases',
    items: [
      { label: 'High Court',       to: '/high-court',      Icon: MdOutlineGavel,    badgeKey: 'HC',     badgeColor: 'bg-org' },
      { label: 'District Court',   to: '/district-court',  Icon: BsBuilding,        badgeKey: 'DC',     badgeColor: 'bg-red' },
    ],
  },
  {
    section: 'Workflow',
    items: [
      { label: 'Docket Calendar',  to: '/docket-calendar', Icon: MdCalendarMonth,   badgeKey: 'dkt' },
      { label: 'Google Drive & Docs',to: '/google-drive',  Icon: BsFolder2Open },
      { label: 'Reports',          to: '/reports',         Icon: MdBarChart },
    ],
  },
]

export default function Sidebar() {
  const { user, logout }        = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { clients, matters, deadlines } = useDataStore()
  const navigate = useNavigate()

  const getBadgeCount = (key) => {
    if (!key) return null
    if (key === 'clients') return clients.length
    if (key === 'dkt') {
      const now = new Date()
      return deadlines.filter(d => Math.ceil((new Date(d.date) - now) / 86400000) <= 30 && Math.ceil((new Date(d.date) - now) / 86400000) >= 0).length
    }
    return matters.filter(m => m.type === key).length
  }

  const handleLogout = () => {
    if (window.confirm('Sign out of LawNetics Docket Portal?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <aside
      className={cn(
        'sidebar-gradient flex flex-col h-screen border-r border-white/[0.06] transition-all duration-300 flex-shrink-0 z-50',
        sidebarCollapsed ? 'w-[58px]' : 'w-[230px]'
      )}
    >
      {/* ── Brand ── */}
      <div
        onClick={toggleSidebar}
        className={cn(
          'flex items-center gap-[0.65rem] border-b border-white/[0.07] cursor-pointer flex-shrink-0 transition-all',
          sidebarCollapsed ? 'justify-center p-3' : 'p-4'
        )}
      >
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-org to-navy flex items-center justify-center flex-shrink-0">
          <span className="text-[0.65rem] font-black text-white tracking-tight">
            <span className="text-org">L</span>N
          </span>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-[1.02rem] font-extrabold leading-none tracking-tight">
              <span className="text-org">Law</span>
              <span className="text-white">Netics</span>
            </p>
            <p className="text-[0.52rem] tracking-[0.2em] uppercase text-white/30 mt-[3px]">
              IP Docketing Portal
            </p>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!sidebarCollapsed && (
              <p className="text-[0.54rem] font-bold tracking-[0.24em] uppercase text-white/20 px-[1.1rem] pt-[0.8rem] pb-[0.3rem] whitespace-nowrap">
                {section}
              </p>
            )}
            {items.map(({ label, to, Icon, badgeKey, badgeColor = 'bg-org' }) => {
              const count = getBadgeCount(badgeKey)
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-[0.65rem] w-full text-left border-l-[3px] transition-all cursor-pointer',
                      sidebarCollapsed ? 'justify-center py-[0.6rem] px-2' : 'py-[0.55rem] px-[1rem] pl-[1.1rem]',
                      isActive
                        ? 'bg-org/[0.12] border-org [&_svg]:text-org [&_.nav-label]:text-white [&_.nav-label]:font-semibold'
                        : 'border-transparent hover:bg-white/[0.05] hover:border-white/[0.12] [&_svg]:text-white/[0.35] [&_.nav-label]:text-white/[0.55] hover:[&_svg]:text-white/75'
                    )
                  }
                >
                  <Icon className="w-[17px] h-[17px] flex-shrink-0 transition-colors" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="nav-label text-[0.77rem] flex-1 whitespace-nowrap transition-colors">{label}</span>
                      {count != null && count > 0 && (
                        <span className={cn('text-[0.57rem] font-bold text-white px-[0.37rem] py-[0.09rem] rounded-[9px] min-w-[16px] text-center leading-[1.6]', badgeColor)}>
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="flex-shrink-0 border-t border-white/[0.07] p-[0.75rem]">
        <div
          className={cn(
            'flex items-center gap-[0.62rem] cursor-pointer rounded-[6px] p-[0.45rem] transition-colors hover:bg-white/[0.05]',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-org to-gold flex items-center justify-center text-[0.72rem] font-extrabold text-white flex-shrink-0">
            {user?.avatar || 'A'}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0">
                <p className="text-[0.76rem] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[0.58rem] text-white/30 tracking-[0.06em] uppercase">
                  {user?.role || 'Senior Advocate'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="ml-auto text-white/25 hover:text-org transition-colors flex-shrink-0"
              >
                <IoLogOutOutline className="w-[15px] h-[15px]" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
