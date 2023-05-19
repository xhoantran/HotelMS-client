/* eslint-disable */

import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AuthGuard, GuestGuard } from './guards'
import { PATH_DASHBOARD } from './paths'

const Loadable =
  (Component: React.ComponentType) =>
  (props: React.ComponentProps<typeof Component>) => {
    return (
      <Suspense>
        <Component {...props} />
      </Suspense>
    )
  }

// AUTHENTICATION
const Login = Loadable(lazy(() => import('features/auth/Login')))
const ResetPassword = Loadable(
  lazy(() => import('features/auth/ResetPassword'))
)
const ResetPasswordConfirm = Loadable(
  lazy(() => import('features/auth/ResetPasswordConfirm'))
)
const EmailConfirm = Loadable(lazy(() => import('features/auth/EmailConfirm')))

// DASHBOARD
const DashboardLayout = Loadable(
  lazy(() => import('components/Layouts/Dashboard/DashboardLayout'))
)
const Hotels = Loadable(lazy(() => import('features/pms/hotels/routes')))
const Settings = Loadable(lazy(() => import('features/settings/routes')))

// MISC
const NotFoundScreen = Loadable(
  lazy(() => import('features/mics/routes/NotFoundScreen'))
)

const router = createBrowserRouter([
  // AUTHENTICATION
  {
    path: 'auth',
    children: [
      { element: <Navigate to={PATH_DASHBOARD.root} replace />, index: true },
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      },
      {
        path: 'reset-password',
        element: (
          <GuestGuard>
            <ResetPassword />
          </GuestGuard>
        )
      },
      {
        path: 'password-reset-confirm',
        element: (
          <GuestGuard>
            <ResetPasswordConfirm />
          </GuestGuard>
        )
      },
      { path: 'email-confirm', element: <EmailConfirm /> }
    ]
  },

  // DASHBOARD
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      // { element: <Dashboard />, index: true },
      { element: <Navigate to={PATH_DASHBOARD.hotels} replace />, index: true },
      { path: 'hotels/*', element: <Hotels /> },
      { path: 'settings/*', element: <Settings /> }
    ]
  },

  // MISC
  { path: '/', element: <Navigate to={PATH_DASHBOARD.root} replace /> },
  { path: '404', element: <NotFoundScreen /> },
  { path: '*', element: <Navigate to="/404" replace /> }
])

export default router
