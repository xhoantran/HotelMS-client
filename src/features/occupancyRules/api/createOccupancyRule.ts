import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { IOccupancyBasedTriggerRule } from '../types'

export type CreateOccupancyRuleDTO = {
  data: {
    setting: string
    minOccupancy: number
    percentageFactor: number
    incrementFactor: number
  }
}

export const createOccupancyRule = async (
  occupancyRuleDto: CreateOccupancyRuleDTO
): Promise<IOccupancyBasedTriggerRule> => {
  const { data } = (await axiosInstance.post(
    '/api/v1/rms/occupancy-based-trigger-rule/',
    snakify(occupancyRuleDto.data)
  )) as { data: IOccupancyBasedTriggerRule }
  return camelize(data)
}

type useCreateOccupancyRuleOptions = {
  config?: MutationConfig<typeof createOccupancyRule>
}

export const useCreateOccupancyRule = ({
  config
}: useCreateOccupancyRuleOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Occupancy rule created successfully'
      })
    },
    ...config,
    mutationFn: createOccupancyRule
  })
}
