import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'

import type { ITimeBasedTriggerRule } from '../types'

export const deleteTimeRule = ({
  timeRuleUuid
}: {
  timeRuleUuid: string
}): Promise<ITimeBasedTriggerRule> => {
  return axiosInstance.delete(
    `/api/v1/rms/time-based-trigger-rule/${timeRuleUuid}/`
  )
}

type UseDeleteTimeRuleOptions = {
  dynamicPricingSettingUuid: string
  config?: MutationConfig<typeof deleteTimeRule>
}

export const useDeleteTimeRule = ({
  config,
  dynamicPricingSettingUuid
}: UseDeleteTimeRuleOptions) => {
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
        title: 'Time based trigger rule deleted successfully'
      })
    },
    ...config,
    mutationFn: deleteTimeRule
  })
}
