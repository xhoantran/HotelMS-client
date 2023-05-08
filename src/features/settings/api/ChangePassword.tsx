import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import snakify from 'utils/snakify'

export type ChangePasswordDTO = {
  data: {
    oldPassword: string
    newPassword1: string
    newPassword2: string
  }
}

export const changePassword = (dto: ChangePasswordDTO) => {
  return axiosInstance.post('/api-auth/v1/password/change/', snakify(dto.data))
}

export const useChangePassword = (
  config?: MutationConfig<typeof changePassword>
) => {
  const { addNotification } = useNotificationStore()

  return useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password changed successfully.'
      })
    },
    ...config,
    mutationFn: changePassword
  })
}
