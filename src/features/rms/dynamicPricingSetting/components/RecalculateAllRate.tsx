import { useRecalculateAllRate } from '../api/recalculateAllRate'

interface DynamicPricingSettingProps {
  dynamicPricingSettingUuid: string
  isEnabled: boolean
}

export function RecalculateAllRate({
  dynamicPricingSettingUuid,
  isEnabled
}: DynamicPricingSettingProps) {
  const recalculateAllRateMutation = useRecalculateAllRate()

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Recalculate all rate
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Recalculate all rate for all rooms with the most updated dynamic
          pricing setting.
        </p>
      </div>
      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-6">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            disabled={recalculateAllRateMutation.isLoading || !isEnabled}
            onClick={() => {
              recalculateAllRateMutation.mutate({ dynamicPricingSettingUuid })
            }}
          >
            Recalculate all rate
          </button>
        </div>
      </div>
    </div>
  )
}
