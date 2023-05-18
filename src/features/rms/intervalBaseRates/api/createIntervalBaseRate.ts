import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { IDateRange } from 'types'
import type { IIntervalBaseRate } from '../types'

export type CreateIntervalBaseRateDTO = {
  data: {
    setting: string
    dates: IDateRange
    baseRate: number
  }
}

export const createIntervalBaseRate = async (
  IntervalBaseRateDto: CreateIntervalBaseRateDTO
): Promise<IIntervalBaseRate> => {
  const { data } = (await axiosInstance.post(
    '/api/v1/rms/interval-base-rate/',
    snakify({
      ...IntervalBaseRateDto.data,
      dates: {
        ...IntervalBaseRateDto.data.dates,
        bounds: '[]'
      }
    })
  )) as { data: IIntervalBaseRate }
  return camelize(data)
}

type useCreateIntervalBaseRateOptions = {
  config?: MutationConfig<typeof createIntervalBaseRate>
}

export const useCreateIntervalBaseRate = ({
  config
}: useCreateIntervalBaseRateOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Fail to create interval base rate'
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['dynamicPricingSetting', data.setting])
      addNotification({
        type: 'success',
        title: 'Interval base rate created successfully'
      })
    },
    ...config,
    mutationFn: createIntervalBaseRate
  })
}
