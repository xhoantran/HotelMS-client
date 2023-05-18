import axiosInstance, { axiosAuthInstance } from 'lib/axios'
import { useEffect } from 'react'
import { isValidToken, setAccessToken, setRefreshToken } from 'utils/jwt'
import snakify from 'utils/snakify'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface IResetPasswordConfirm {
  uid: string
  token: string
  newPassword1: string
  newPassword2: string
}

interface IAuthState {
  isAuthenticated: boolean
  user: {
    pk: string // uuid
    username: string
    email: string
    name: string
  }
  login: (email: string, password: string) => Promise<void | Error>
  verifyEmail: (key: string) => Promise<void | Error>
  requestResetPassword: (email: string) => Promise<void>
  resetPasswordConfirm: (data: IResetPasswordConfirm) => Promise<void | Error>
  logout: () => void
  me: () => Promise<void | Error>
}

const useAuth = create<IAuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: {
          pk: '',
          username: '',
          email: '',
          name: ''
        },
        login: async (email, password) => {
          const response = await axiosAuthInstance.post('/api-auth/v1/login/', {
            email,
            password
          })
          const { access, refresh, user } = await response.data
          set({ isAuthenticated: true, user })
          setAccessToken(access)
          setRefreshToken(refresh)
        },
        verifyEmail: async (key) => {
          await axiosAuthInstance.post(
            '/api-auth/v1/registration/verify-email/',
            {
              key
            }
          )
        },
        requestResetPassword: async (email) => {
          await axiosAuthInstance.post('/api-auth/v1/password/reset/', {
            email
          })
        },
        resetPasswordConfirm: async (data) => {
          await axiosAuthInstance.post(
            '/api-auth/v1/password/reset/confirm/',
            snakify(data)
          )
        },
        logout: () => {
          set({ isAuthenticated: false })
          setAccessToken()
          setRefreshToken()
        },
        me: async () => {
          const response = await axiosInstance.get('/api-auth/v1/user/')
          const user = await response.data
          set({ isAuthenticated: true, user })
        }
      }),
      { name: 'auth' }
    )
  )
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { me, logout } = useAuth()

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken && isValidToken(accessToken)) {
        setAccessToken(accessToken)
        me()
      }
    } catch (error) {
      logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{children}</>
}

export default useAuth
