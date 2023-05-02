import { useMutation } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { MutationConfig, queryClient } from 'lib/react-query'
import { useNotificationStore } from 'stores/notifications'

export const syncHotel = async ({
  hotelUuid
}: {
  hotelUuid: string
}): Promise<void> => {
  await axiosInstance.post(`/api/v1/pms/hotel/${hotelUuid}/sync/`)
}

type useSyncHotelOptions = {
  config?: MutationConfig<typeof syncHotel>
}

export const useSyncHotel = ({ config }: useSyncHotelOptions = {}) => {
  const { addNotification } = useNotificationStore()
  return useMutation({
    onError: (_, __, context: any) => {
      if (context?.previousHotels) {
        queryClient.setQueryData(['hotels'], context.previousHotels)
      }
      addNotification({
        type: 'error',
        title: 'Hotel sync failed'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels'])
      addNotification({
        type: 'success',
        title: 'Hotel synced successfully'
      })
    },
    ...config,
    retry: false,
    mutationFn: syncHotel
  })
}
