import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Spinner } from 'components/Elements'
import { Toggle } from 'components/Elements/Toggle'
import { OccupancyRuleList } from 'features/rms/occupancyRules/components/OccupancyRuleList'
import { TimeRuleList } from 'features/rms/timeRules/components/TimeRuleList'
import { useDynamicPricingSetting } from '../api/getDynamicPricingSetting'
import { useUpdateDynamicPricingSetting } from '../api/updateDynamicPricingSetting'

interface DynamicPricingSettingProps {
  dynamicPricingSettingUuid: string
  currency: string
}

const DynamicPricingSettingSchema = z
  .object({
    isEnabled: z.boolean(),
    defaultBaseRate: z.number().nonnegative(),
    isOccupancyBased: z.boolean(),
    isTimeBased: z.boolean()
  })
  .refine((data) => {
    if (data.isEnabled) {
      return data.defaultBaseRate > 0
    }
    return true
  }, 'Default base rate is required')

export function DynamicPricingSetting({
  dynamicPricingSettingUuid,
  currency
}: DynamicPricingSettingProps) {
  const dynamicPricingSettingQuery = useDynamicPricingSetting({
    dynamicPricingSettingUuid,
    config: {
      onSuccess: (data) => {
        reset(data)
      }
    }
  })
  const updateDynamicPricingSettingMutation = useUpdateDynamicPricingSetting()

  const methods = useForm({
    resolver: zodResolver(DynamicPricingSettingSchema),
    defaultValues: {
      isEnabled: dynamicPricingSettingQuery.data?.isEnabled ?? false,
      defaultBaseRate: dynamicPricingSettingQuery.data?.defaultBaseRate ?? 0,
      isOccupancyBased:
        dynamicPricingSettingQuery.data?.isOccupancyBased ?? false,
      isTimeBased: dynamicPricingSettingQuery.data?.isTimeBased ?? false
    }
  })
  const { handleSubmit, control, reset } = methods

  const onSubmit = handleSubmit((values) => {
    updateDynamicPricingSettingMutation.mutate({
      data: values,
      dynamicPricingSettingUuid
    })
  })

  if (dynamicPricingSettingQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                General
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This can be used to temporarily disable the pricing engine or a
                subset of rules.
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-6">
                <Controller
                  control={control}
                  name="isEnabled"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle {...field} title="Enabled" />
                  )}
                />
              </div>
              <div className="sm:col-span-6 sm:col-start-1">
                <Controller
                  control={control}
                  name="isOccupancyBased"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      {...field}
                      title="Occupancy based rules"
                      description="Price will be adjusted based on the number of occupied rooms."
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-6 sm:col-start-1">
                <Controller
                  control={control}
                  name="isTimeBased"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      {...field}
                      title="Time based rules"
                      description="Price will be adjusted based on the time of the day."
                    />
                  )}
                />
              </div>

              <div className="sm:col-start-1 ">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                  disabled={updateDynamicPricingSettingMutation.isLoading}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      <OccupancyRuleList
        isOccupancyBased={
          dynamicPricingSettingQuery.data?.isOccupancyBased ?? false
        }
        occupancyRules={
          dynamicPricingSettingQuery.data?.occupancyBasedTriggerRules ?? []
        }
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data?.uuid ?? ''}
        currency={currency}
      />

      <TimeRuleList
        isTimeBased={dynamicPricingSettingQuery.data?.isTimeBased ?? false}
        timeRules={dynamicPricingSettingQuery.data?.timeBasedTriggerRules ?? []}
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data?.uuid ?? ''}
        currency={currency}
      />
    </div>
  )
}
