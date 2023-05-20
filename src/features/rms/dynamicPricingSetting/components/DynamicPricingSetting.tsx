import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Spinner } from 'components/Elements'
import { Toggle } from 'components/Elements/Toggle'
import { IntervalBaseRateList } from 'features/rms/intervalBaseRates/components/IntervalBaseRateList'
import { OccupancyRuleList } from 'features/rms/occupancyRules/components/OccupancyRuleList'
import { TimeRuleList } from 'features/rms/timeRules/components/TimeRuleList'
import { useDynamicPricingSetting } from '../api/getDynamicPricingSetting'
import { useUpdateDynamicPricingSetting } from '../api/updateDynamicPricingSetting'
import { RatePlanPercentageFactorList } from 'features/rms/ratePlanPercentageFactor/components/RatePlanPercentageFactorList'
import { RecalculateAllRate } from './RecalculateAllRate'

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
  .refine(
    (data) => !data.isEnabled || (data.isEnabled && data.defaultBaseRate) > 0,
    {
      message: 'Default base rate must be greater than 0',
      path: ['defaultBaseRate']
    }
  )

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
  const {
    handleSubmit,
    control,
    reset,
    register,
    watch,
    formState: { errors, isDirty }
  } = methods

  // For the form only
  const isEnabled = watch('isEnabled', false)

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

  if (!dynamicPricingSettingQuery.data) {
    return <span>Couldn&apos;t find dynamic pricing setting</span>
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
              <div className="col-span-6">
                <Controller
                  control={control}
                  name="isEnabled"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      {...field}
                      title="Enabled"
                      description="When enabled, the pricing engine will be used to calculate the price."
                    />
                  )}
                />
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:justify-between">
                <span className="flex grow flex-col">
                  <label
                    htmlFor="defaultBaseRate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Default base rate
                  </label>
                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    This is the base rate that all the rate plan prices will be
                    derived from.
                  </p>
                  {errors.defaultBaseRate && (
                    <p className="mt-1 text-sm leading-5 text-red-600">
                      {errors.defaultBaseRate.message}
                    </p>
                  )}
                </span>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register('defaultBaseRate', { valueAsNumber: true })}
                    id="defaultBaseRate"
                    autoComplete="defaultBaseRate"
                    className="block w-full rounded-md border-0 py-1.5 pr-12 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-50 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                    disabled={!isEnabled}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="defaultBaseRateCurrency"
                    >
                      {currency}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <Controller
                  control={control}
                  name="isOccupancyBased"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      {...field}
                      title="Occupancy based rules"
                      description="Price will be adjusted based on the number of occupied rooms."
                      disabled={!isEnabled}
                    />
                  )}
                />
              </div>
              <div className="col-span-6">
                <Controller
                  control={control}
                  name="isTimeBased"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { ref, ...field } }) => (
                    <Toggle
                      {...field}
                      title="Time based rules"
                      description="Price will be adjusted based on the time of the day."
                      disabled={!isEnabled}
                    />
                  )}
                />
              </div>

              <div className="col-span-6">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                  disabled={
                    updateDynamicPricingSettingMutation.isLoading || !isDirty
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      <RecalculateAllRate
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data.uuid}
        isEnabled={dynamicPricingSettingQuery.data.isEnabled}
      />

      <IntervalBaseRateList
        intervalBaseRates={dynamicPricingSettingQuery.data.intervalBaseRates}
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data.uuid}
        currency={currency}
        isEnabled={dynamicPricingSettingQuery.data.isEnabled}
      />

      <RatePlanPercentageFactorList
        roomTypes={dynamicPricingSettingQuery.data.roomTypes}
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data.uuid}
        currency={currency}
        defaultBaseRate={dynamicPricingSettingQuery.data.defaultBaseRate}
        isEnabled={dynamicPricingSettingQuery.data.isEnabled}
      />

      <OccupancyRuleList
        isOccupancyBased={dynamicPricingSettingQuery.data.isOccupancyBased}
        occupancyRules={
          dynamicPricingSettingQuery.data.occupancyBasedTriggerRules
        }
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data.uuid}
        currency={currency}
        isEnabled={dynamicPricingSettingQuery.data.isEnabled}
      />

      <TimeRuleList
        isTimeBased={dynamicPricingSettingQuery.data.isTimeBased}
        timeRules={dynamicPricingSettingQuery.data.timeBasedTriggerRules}
        dynamicPricingSettingUuid={dynamicPricingSettingQuery.data.uuid}
        currency={currency}
        isEnabled={dynamicPricingSettingQuery.data.isEnabled}
      />
    </div>
  )
}
