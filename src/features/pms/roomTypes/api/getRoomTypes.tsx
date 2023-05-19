import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { ExtractFnReturnType, QueryConfig } from 'lib/react-query'
import camelize from 'utils/camalize'
import { SnakifyObject } from 'utils/snakify'

import type { IRoomType } from '../types'

export const getRoomTypes = async ({ hotelUuid }: { hotelUuid: string }) => {
  const { data } = (await axiosInstance.get(
    `/api/v1/pms/room-type?hotel=${hotelUuid}`
  )) as {
    data: SnakifyObject<IRoomType>[]
  }
  return data.map((roomType) => camelize(roomType))
}

type QueryFnType = typeof getRoomTypes

type UseGetRoomTypesOptions = {
  hotelUuid: string
  config?: QueryConfig<QueryFnType>
}

export const useGetRoomTypes = ({
  hotelUuid,
  config
}: UseGetRoomTypesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['roomTypes', hotelUuid],
    queryFn: () => getRoomTypes({ hotelUuid })
  })
}
