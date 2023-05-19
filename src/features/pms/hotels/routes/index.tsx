import { Navigate, Route, Routes } from 'react-router-dom'
import { Hotel } from './Hotel'
import { Hotels } from './Hotels'

export default function HotelsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Hotels />} />
      <Route path="/:hotelUuid" element={<Hotel />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
