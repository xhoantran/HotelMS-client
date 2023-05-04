import axios from 'axios'
import { API_BASE_URL } from 'config'
import useAuth from 'stores/useAuth'
import { setAccessToken } from 'utils/jwt'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
})

export const axiosAuthInstance = axios.create({
  baseURL: API_BASE_URL
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axiosAuthInstance.post(
          '/api-auth/v1/token/refresh/',
          {
            refresh: localStorage.getItem('refreshToken')
          }
        )

        if (response.status === 200) {
          setAccessToken(response.data.access)
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return axiosInstance(originalRequest)
        }

        // Handle the refresh token request error
        useAuth.getState().logout()
        return Promise.reject(error)
      } catch (err) {
        // Handle the refresh token request error
        useAuth.getState().logout()
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
