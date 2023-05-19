import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'

import type { IIntervalBaseRate } from '../types'

export const deleteIntervalBaseRate = ({
  intervalBaseRateUuid
}: {
  intervalBaseRateUuid: string
}): Promise<IIntervalBaseRate> => {
  return axiosInstance.delete(
    `/api/v1/rms/interval-base-rate/${intervalBaseRateUuid}/`
  )
}

type UseDeleteIntervalBaseRateOptions = {
  dynamicPricingSettingUuid: string
  config?: MutationConfig<typeof deleteIntervalBaseRate>
}

export const useDeleteIntervalBaseRate = ({
  config,
  dynamicPricingSettingUuid
}: UseDeleteIntervalBaseRateOptions) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: () => {
      if (dynamicPricingSettingUuid)
        queryClient.invalidateQueries([
          'dynamicPricingSetting',
          dynamicPricingSettingUuid
        ])
      addNotification({
        type: 'success',
        title: 'Interval base rate deleted successfully'
      })
    },
    ...config,
    mutationFn: deleteIntervalBaseRate
  })
}
