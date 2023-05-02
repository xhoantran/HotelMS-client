import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'lib/axios';
import { ExtractFnReturnType, QueryConfig } from 'lib/react-query';
import camelize from 'utils/camalize';
import type { SnakifyObject } from 'utils/snakify';

import type { IHotel } from '../types';

export const getHotel = async ({ hotelUuid }: { hotelUuid: string }): Promise<IHotel> => {
  const { data } = await axiosInstance.get(`/api/v1/pms/hotel/${hotelUuid}/`) as { data: SnakifyObject<IHotel> };
  return camelize(data);
};

type QueryFnType = typeof getHotel;

type UseHotelOptions = {
  hotelUuid: string;
  config?: QueryConfig<QueryFnType>;
};

export const useHotel = ({ hotelUuid, config }: UseHotelOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['hotel', hotelUuid],
    queryFn: () => getHotel({ hotelUuid }),
  });
};