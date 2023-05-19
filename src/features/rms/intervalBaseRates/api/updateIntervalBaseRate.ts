import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { IIntervalBaseRate } from '../types'
import type { IDateRange } from 'types'

export type UpdateIntervalBaseRateDTO = {
  data: {
    baseRate: number
    dates: IDateRange
  }
  intervalBaseRateUuid: string
}

export const updateIntervalBaseRate = async (
  intervalBaseRateDto: UpdateIntervalBaseRateDTO
): Promise<IIntervalBaseRate> => {
  const { data } = (await axiosInstance.patch(
    `/api/v1/rms/interval-base-rate/${intervalBaseRateDto.intervalBaseRateUuid}/`,
    snakify({
      ...intervalBaseRateDto.data,
      dates: {
        ...intervalBaseRateDto.data.dates,
        bounds: '[]'
      }
    })
  )) as { data: IIntervalBaseRate }
  return camelize(data)
}

type useUpdateIntervalBaseRateOptions = {
  config?: MutationConfig<typeof updateIntervalBaseRate>
}

export const useUpdateIntervalBaseRate = ({
  config
}: useUpdateIntervalBaseRateOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Occupancy rule updated successfully'
      })
    },
    ...config,
    mutationFn: updateIntervalBaseRate
  })
}
