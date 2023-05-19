import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'
import camelize from 'utils/camalize'
import snakify from 'utils/snakify'

import type { IHotel } from '../types'

export type CreateHotelDTO = {
  data: {
    channelManager: string
    cmId: string
    cmApiKey: string
  }
}

export const createHotel = async (
  hotelDto: CreateHotelDTO
): Promise<IHotel> => {
  const { data } = (await axiosInstance.post(
    '/api/v1/cm/hotel/setup/',
    snakify(hotelDto.data)
  )) as { data: IHotel }
  return camelize(data)
}

type useCreateHotelOptions = {
  config?: MutationConfig<typeof createHotel>
}

export const useCreateHotel = ({ config }: useCreateHotelOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onError: (_, __, context: any) => {
      if (context?.previousHotels) {
        queryClient.setQueryData(['hotels'], context.previousHotels)
      }
      addNotification({
        type: 'error',
        title: 'Hotel creation failed'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels'])
      addNotification({
        type: 'success',
        title: 'Hotel set up request sent'
      })
    },
    ...config,
    mutationFn: createHotel
  })
}
