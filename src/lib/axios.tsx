import axios from 'axios'
import { HOST_API } from 'config'
import { setAccessToken, setRefreshToken } from 'utils/jwt'

const axiosInstance = axios.create({
  baseURL: HOST_API
})

// TODO: Implement returnPath
const loginPage = () => {
  window.location.href = `/auth/login?returnPath=${encodeURIComponent(
    window.location.pathname + window.location.search
  )}`
}

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
        setRefreshToken(data.refresh)
        return axiosInstance(originalRequest)
      } catch (err) {
        setAccessToken()
        setRefreshToken()
        loginPage()
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
