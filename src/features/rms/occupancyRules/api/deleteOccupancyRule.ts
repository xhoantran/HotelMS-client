import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'

import type { IOccupancyBasedTriggerRule } from '../types'

export const deleteOccupancyRule = ({
  occupancyRuleUuid
}: {
  occupancyRuleUuid: string
}): Promise<IOccupancyBasedTriggerRule> => {
  return axiosInstance.delete(
    `/api/v1/rms/occupancy-based-trigger-rule/${occupancyRuleUuid}/`
  )
}

type UseDeleteOccupancyRuleOptions = {
  dynamicPricingSettingUuid: string
  config?: MutationConfig<typeof deleteOccupancyRule>
}

export const useDeleteOccupancyRule = ({
  config,
  dynamicPricingSettingUuid
}: UseDeleteOccupancyRuleOptions) => {
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
        title: 'Occupancy rule deleted successfully'
      })
    },
    ...config,
    mutationFn: deleteOccupancyRule
  })
}
