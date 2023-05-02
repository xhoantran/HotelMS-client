import { useQuery } from "@tanstack/react-query";

import axiosInstance from "lib/axios";
import { ExtractFnReturnType, QueryConfig } from "lib/react-query";
import camelize from "utils/camalize";

import type { IHotel } from "../types";

type IHotelResponse = IHotel;

export const getHotels = async (): Promise<IHotelResponse[]> => {
  const res = await axiosInstance.get("/api/v1/pms/hotel/");
  return res.data.map((hotel: IHotelResponse) => camelize(hotel));
}

type QueryFnType = typeof getHotels;

type useHotelsOptions = {
  config?: QueryConfig<QueryFnType>;
}

export const useHotels = ({ config }: useHotelsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
  })
};