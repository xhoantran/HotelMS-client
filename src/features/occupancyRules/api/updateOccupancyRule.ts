import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { IOccupancyBasedTriggerRule } from '../types'

export type UpdateOccupancyRuleDTO = {
  data: {
    minOccupancy: number
    percentageFactor: number
    incrementFactor: number
  }
  occupancyRuleUuid: string
}

export const updateOccupancyRule = async (
  occupancyRuleDto: UpdateOccupancyRuleDTO
): Promise<IOccupancyBasedTriggerRule> => {
  const { data } = (await axiosInstance.patch(
    `/api/v1/rms/occupancy-based-trigger-rule/${occupancyRuleDto.occupancyRuleUuid}/`,
    snakify(occupancyRuleDto.data)
  )) as { data: IOccupancyBasedTriggerRule }
  return camelize(data)
}

type useUpdateOccupancyRuleOptions = {
  config?: MutationConfig<typeof updateOccupancyRule>
}

export const useUpdateOccupancyRule = ({
  config
}: useUpdateOccupancyRuleOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Occupancy Rule Updated'
      })
    },
    ...config,
    mutationFn: updateOccupancyRule
  })
}
