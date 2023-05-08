import { Navigate, Route, Routes } from 'react-router-dom'
import { Account } from './Account'

export default function SettingRoutes() {
  return (
    <Routes>
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<Navigate to="../" />} />
    </Routes>
  )
}
