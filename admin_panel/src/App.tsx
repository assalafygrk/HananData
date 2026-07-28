import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLogin } from './pages/AdminLogin'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { UserDetail } from './pages/UserDetail'
import { TransactionManagement } from './pages/TransactionManagement'
import { TransactionDetail } from './pages/TransactionDetail'
import { PricingManagement } from './pages/PricingManagement'
import { AggregatorSettings } from './pages/AggregatorSettings'
import { NotificationsBroadcast } from './pages/NotificationsBroadcast'
import { AdminRoles } from './pages/AdminRoles'
import { AdminSettings } from './pages/AdminSettings'
import { Layout } from './components/Layout/Layout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/transactions" element={<TransactionManagement />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
        <Route path="/pricing" element={<PricingManagement />} />
        <Route path="/aggregator" element={<AggregatorSettings />} />
        <Route path="/notifications" element={<NotificationsBroadcast />} />
        <Route path="/roles" element={<AdminRoles />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
