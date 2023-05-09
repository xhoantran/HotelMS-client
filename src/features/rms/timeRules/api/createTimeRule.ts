import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { ITimeBasedTriggerRule } from '../types'

export type CreateTimeRuleDTO = {
  data: {
    setting: string
    hour: number
    minute: number
    dayAhead: number
    minOccupancy: number
    maxOccupancy: number
    percentageFactor: number
    incrementFactor: number
  }
}

export const createTimeRule = async (
  timeRuleDto: CreateTimeRuleDTO
): Promise<ITimeBasedTriggerRule> => {
  const { data } = (await axiosInstance.post(
    '/api/v1/rms/time-based-trigger-rule/',
    snakify(timeRuleDto.data)
  )) as { data: ITimeBasedTriggerRule }
  return camelize(data)
}

type useCreateTimeRuleOptions = {
  config?: MutationConfig<typeof createTimeRule>
}

export const useCreateTimeRule = ({
  config
}: useCreateTimeRuleOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Time based trigger rule created successfully'
      })
    },
    ...config,
    mutationFn: createTimeRule
  })
}
