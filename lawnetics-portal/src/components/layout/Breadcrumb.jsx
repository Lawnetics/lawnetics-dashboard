import { useLocation } from 'react-router-dom'

const LABELS = {
  '/dashboard':       'Dashboard',
  '/clients':         'Clients',
  '/trademark':       'Trademark',
  '/patent':          'Patent',
  '/copyright':       'Copyright',
  '/design':          'Design',
  '/gi':              'GI – Geographical Indications',
  '/high-court':      'High Court Cases',
  '/district-court':  'District Court Cases',
  '/docket-calendar': 'Docket Calendar',
  '/google-drive':    'Google Drive & Documents',
  '/reports':         'Reports & Analytics',
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const current = LABELS[pathname] || 'Dashboard'

  return (
    <div className="flex items-center gap-[0.38rem] text-[0.76rem] text-text-3 min-w-0">
      <span>LawNetics</span>
      <span className="text-border-2">›</span>
      <span className="font-semibold text-navy whitespace-nowrap">{current}</span>
    </div>
  )
}
