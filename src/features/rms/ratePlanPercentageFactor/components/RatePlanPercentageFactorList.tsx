import { UpdateRatePlanPercentageFactor } from './UpdateRatePlanPercentageFactor'
import { Fragment } from 'react'

import type { IRoomTypeRMS } from '../types'

interface IRatePlanPercentageFactorListProps {
  roomTypes: IRoomTypeRMS[]
  dynamicPricingSettingUuid: string
  defaultBaseRate: number
  currency: string
}

export function RatePlanPercentageFactorList(
  props: IRatePlanPercentageFactorListProps
) {
  const { roomTypes, dynamicPricingSettingUuid, defaultBaseRate, currency } =
    props

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Rate Plan Percentage Factor
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          This can be used to adjust the base rate of the rate plan by a fixed
          percentage.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-6">
          <div className="rounded-md ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-1/4 py-3 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-8"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 p-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Percentage Factor
                  </th>
                  <th
                    scope="col"
                    className="hidden w-1/4 p-3 text-center text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Base Rate
                  </th>
                  <th scope="col" className="p-3">
                    <span className="sr-only">Select</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((roomType) => (
                  <Fragment key={roomType.uuid}>
                    <tr className="border-t border-gray-200">
                      <td className="bg-gray-50 py-3 pl-3 text-left text-sm font-medium text-gray-900 sm:pl-8">
                        {roomType.name}
                      </td>
                      <td colSpan={3} className="bg-gray-50" />
                    </tr>
                    {roomType.ratePlans.map((ratePlan) => (
                      <UpdateRatePlanPercentageFactor
                        key={ratePlan.uuid}
                        ratePlanPercentageFactor={ratePlan}
                        dynamicPricingSettingUuid={dynamicPricingSettingUuid}
                        defaultBaseRate={defaultBaseRate}
                        currency={currency}
                      />
                    ))}
                    {roomType.ratePlans.length === 0 && (
                      <tr className="border-t border-gray-200">
                        <td
                          colSpan={4}
                          className="py-4 text-center text-sm text-gray-500"
                        >
                          No rate plans found
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
