import { Navigate } from 'react-router-dom'
import { PATH_DASHBOARD } from 'routes/paths'
import useAuth from 'stores/useAuth'

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} replace />
  }

  return <>{children}</>
}
