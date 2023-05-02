import { useMutation } from '@tanstack/react-query';

import axiosInstance from "lib/axios";
import { MutationConfig, queryClient } from "lib/react-query";
import { useNotificationStore } from 'stores/notifications';

import type { IHotel } from "../types";

export const deleteHotel = ({ hotelUuid }: { hotelUuid: string }) => {
  return axiosInstance.delete(`/api/v1/pms/hotel/${hotelUuid}`);
};

type UseDeleteHotelOptions = {
  config?: MutationConfig<typeof deleteHotel>;
};

export const useDeleteHotel = ({ config }: UseDeleteHotelOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deletedHotel) => {
      await queryClient.cancelQueries(['hotels']);

      const previousHotels = queryClient.getQueryData<IHotel[]>(['hotels']);

      queryClient.setQueryData(
        ['hotels'],
        previousHotels?.filter(
          (hotel) => hotel.uuid !== deletedHotel.hotelUuid
        )
      );

      return { previousHotels };
    },
    onError: (_, __, context: any) => {
      if (context?.previousHotels) {
        queryClient.setQueryData(['hotels'], context.previousHotels);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels']);
      addNotification({
        type: 'success',
        title: 'Hotel Deleted',
      });
    },
    ...config,
    mutationFn: deleteHotel,
  });
};