import axios from 'axios'
import { API_BASE_URL } from 'config'
import useAuth from 'stores/useAuth'
import { setAccessToken } from 'utils/jwt'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axiosInstance.post(
          '/api-auth/v1/token/refresh/',
          {
            refresh: localStorage.getItem('refreshToken')
          }
        )
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.access}`
        setAccessToken(data.access)
        return axiosInstance(originalRequest)
      } catch (err) {
        useAuth.getState().logout()
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
