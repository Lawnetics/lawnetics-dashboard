import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import DashboardLayout from '../components/layout/DashboardLayout'

// Pages
import LoginPage        from '../pages/Login'
import Dashboard        from '../pages/Dashboard'
import Clients          from '../pages/Clients'
import Trademark        from '../pages/Trademark'
import Patent           from '../pages/Patent'
import Copyright        from '../pages/Copyright'
import Design           from '../pages/Design'
import GI               from '../pages/GI'
import HighCourt        from '../pages/HighCourt'
import DistrictCourt    from '../pages/DistrictCourt'
import DocketCalendar   from '../pages/DocketCalendar'
import GoogleDrive      from '../pages/GoogleDrive'
import Reports          from '../pages/Reports'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="clients"         element={<Clients />} />
        <Route path="trademark"       element={<Trademark />} />
        <Route path="patent"          element={<Patent />} />
        <Route path="copyright"       element={<Copyright />} />
        <Route path="design"          element={<Design />} />
        <Route path="gi"              element={<GI />} />
        <Route path="high-court"      element={<HighCourt />} />
        <Route path="district-court"  element={<DistrictCourt />} />
        <Route path="docket-calendar" element={<DocketCalendar />} />
        <Route path="google-drive"    element={<GoogleDrive />} />
        <Route path="reports"         element={<Reports />} />
        <Route path="*"               element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
