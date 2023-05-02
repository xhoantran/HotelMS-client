import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { ITimeBasedTriggerRule } from '../types'

export type UpdateTimeRuleDTO = {
  data: {
    hour: number
    minute: number
    dayAhead: number
    minOccupancy: number
    maxOccupancy: number
    percentageFactor: number
    incrementFactor: number
  }
  timeRuleUuid: string
}

export const updateTimeRule = async (
  timeRuleDto: UpdateTimeRuleDTO
): Promise<ITimeBasedTriggerRule> => {
  const { data } = (await axiosInstance.patch(
    `/api/v1/rms/time-based-trigger-rule/${timeRuleDto.timeRuleUuid}/`,
    snakify(timeRuleDto.data)
  )) as { data: ITimeBasedTriggerRule }
  return camelize(data)
}

type useUpdateTimeRuleOptions = {
  config?: MutationConfig<typeof updateTimeRule>
}

export const useUpdateTimeRule = ({
  config
}: useUpdateTimeRuleOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Time based trigger rule updated successfully'
      })
    },
    ...config,
    mutationFn: updateTimeRule
  })
}
