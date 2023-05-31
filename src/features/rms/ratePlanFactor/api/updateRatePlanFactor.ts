import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

export type UpdateRatePlanFactorDTO = {
  data: {
    percentageFactor: number
  }
  ratePlanUuid: string
}

export const updateRatePlanFactor = async (
  ratePlanFactorDto: UpdateRatePlanFactorDTO
) => {
  const { data } = await axiosInstance.patch(
    `/api/v1/rms/rate-plan-percentage-factor/${ratePlanFactorDto.ratePlanUuid}/`,
    snakify(ratePlanFactorDto.data)
  )
  return camelize(data)
}

type useUpdateRatePlanFactorOptions = {
  config?: MutationConfig<typeof updateRatePlanFactor>
}

export const useUpdateRatePlanFactor = ({
  config
}: useUpdateRatePlanFactorOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Rate plan percentage factor updated successfully'
      })
    },
    ...config,
    mutationFn: updateRatePlanFactor
  })
}
