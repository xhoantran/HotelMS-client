import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import snakify from 'utils/snakify'

import { IDynamicPricingSetting } from '../types'

export type IUpdateDynamicPricingSettingVariables = {
  data: {
    isEnabled: boolean
    defaultBaseRate: number
    isOccupancyBased: boolean
    isTimeBased: boolean
  }
  dynamicPricingSettingUuid: string
}

export const updateDynamicPricingSetting = ({
  data,
  dynamicPricingSettingUuid
}: IUpdateDynamicPricingSettingVariables) => {
  const snakifiedData = snakify(data)
  return axiosInstance.put<IDynamicPricingSetting>(
    `/api/v1/rms/dynamic-pricing-setting/${dynamicPricingSettingUuid}/`,
    snakifiedData
  )
}

type UseUpdateDynamicPricingSettingOptions = {
  config?: MutationConfig<typeof updateDynamicPricingSetting>
}

export const useUpdateDynamicPricingSetting = ({
  config
}: UseUpdateDynamicPricingSettingOptions = {}) => {
  const { addNotification } = useNotificationStore()

  return useMutation({
    onMutate: async (updatingDynamicPricingSetting: any) => {
      await queryClient.cancelQueries([
        'dynamicPricingSetting',
        updatingDynamicPricingSetting?.dynamicPricingSettingId
      ])

      const previousDynamicPricingSetting =
        queryClient.getQueryData<IDynamicPricingSetting>([
          'dynamicPricingSetting',
          updatingDynamicPricingSetting?.dynamicPricingSettingId
        ])

      queryClient.setQueryData(
        [
          'dynamicPricingSetting',
          updatingDynamicPricingSetting?.dynamicPricingSettingId
        ],
        {
          ...previousDynamicPricingSetting,
          ...updatingDynamicPricingSetting.data,
          id: updatingDynamicPricingSetting.dynamicPricingSettingId
        }
      )

      return { previousDynamicPricingSetting }
    },
    onError: (_, __, context: any) => {
      if (context?.previousDynamicPricingSetting) {
        queryClient.setQueryData(
          ['dynamicPricingSetting', context.previousDynamicPricingSetting.id],
          context.previousDynamicPricingSetting
        )
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['dynamicPricingSetting', data?.data.uuid])
      addNotification({
        type: 'success',
        title: 'Dynamic pricing setting updated successfully'
      })
    },
    ...config,
    mutationFn: updateDynamicPricingSetting
  })
}
