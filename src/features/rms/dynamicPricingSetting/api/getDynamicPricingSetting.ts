import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'lib/axios'
import { ExtractFnReturnType, QueryConfig } from 'lib/react-query'
import camelize from 'utils/camalize'
import type { SnakifyObject } from 'utils/snakify'

import type { IDynamicPricingSetting } from '../types'

export const getDynamicPricingSetting = async ({
  dynamicPricingSettingUuid
}: {
  dynamicPricingSettingUuid: string
}): Promise<IDynamicPricingSetting> => {
  const { data } = (await axiosInstance.get(
    `/api/v1/rms/dynamic-pricing-setting/${dynamicPricingSettingUuid}/`
  )) as { data: SnakifyObject<IDynamicPricingSetting> }
  return camelize(data)
}

type QueryFnType = typeof getDynamicPricingSetting

type useGetDynamicPricingSettingOptions = {
  dynamicPricingSettingUuid: string
  config?: QueryConfig<QueryFnType>
}

export const useGetDynamicPricingSetting = ({
  dynamicPricingSettingUuid,
  config
}: useGetDynamicPricingSettingOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['dynamicPricingSetting', dynamicPricingSettingUuid],
    queryFn: () => getDynamicPricingSetting({ dynamicPricingSettingUuid })
  })
}
