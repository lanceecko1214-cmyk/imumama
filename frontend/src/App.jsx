import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EquipmentList from './pages/equipment/EquipmentList.jsx'
import EquipmentDetail from './pages/equipment/EquipmentDetail.jsx'
import EquipmentForm from './pages/equipment/EquipmentForm.jsx'
import Reports from './pages/Reports.jsx'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/new" element={<EquipmentForm />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/equipment/:id/edit" element={<EquipmentForm />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
