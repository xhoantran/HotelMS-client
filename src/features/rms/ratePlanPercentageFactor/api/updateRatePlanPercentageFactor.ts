import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

export type UpdateRatePlanPercentageFactorDTO = {
  data: {
    percentageFactor: number
  }
  ratePlanUuid: string
}

export const updateRatePlanPercentageFactor = async (
  ratePlanPercentageFactorDto: UpdateRatePlanPercentageFactorDTO
) => {
  const { data } = await axiosInstance.patch(
    `/api/v1/rms/rate-plan-percentage-factor/${ratePlanPercentageFactorDto.ratePlanUuid}/`,
    snakify(ratePlanPercentageFactorDto.data)
  )
  return camelize(data)
}

type useUpdateRatePlanPercentageFactorOptions = {
  config?: MutationConfig<typeof updateRatePlanPercentageFactor>
}

export const useUpdateRatePlanPercentageFactor = ({
  config
}: useUpdateRatePlanPercentageFactorOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Rate plan percentage factor updated successfully'
      })
    },
    ...config,
    mutationFn: updateRatePlanPercentageFactor
  })
}
