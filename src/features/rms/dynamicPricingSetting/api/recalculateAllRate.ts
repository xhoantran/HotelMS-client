import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'

export type IRecalculateAllRateDTO = {
  dynamicPricingSettingUuid: string
}

export const recalculateAllRate = ({
  dynamicPricingSettingUuid
}: IRecalculateAllRateDTO) => {
  return axiosInstance.post(
    `/api/v1/rms/recalculate-all-rate/${dynamicPricingSettingUuid}/`
  )
}

type UseRecalculateAllRateOptions = {
  config?: MutationConfig<typeof recalculateAllRate>
}

export const useRecalculateAllRate = ({
  config
}: UseRecalculateAllRateOptions = {}) => {
  const { addNotification } = useNotificationStore()

  return useMutation({
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Error while requesting recalculate all rates'
      })
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Recalculate all rates successfully'
      })
    },
    ...config,
    mutationFn: recalculateAllRate
  })
}
