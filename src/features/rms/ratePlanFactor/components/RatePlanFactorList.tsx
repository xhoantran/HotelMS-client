import { Fragment } from 'react'
import clsx from 'clsx'

import { UpdateRatePlanFactor } from './UpdateRatePlanFactor'

import type { IRoomTypeRMS } from '../types'

interface IRatePlanFactorListProps {
  roomTypes: IRoomTypeRMS[]
  dynamicPricingSettingUuid: string
  defaultBaseRate: number
  currency: string
  isEnabled: boolean
}

export function RatePlanFactorList(props: IRatePlanFactorListProps) {
  const {
    roomTypes,
    dynamicPricingSettingUuid,
    defaultBaseRate,
    currency,
    isEnabled
  } = props

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Rate Plan Base Rate
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Adjust the base rate for each rate plan.
        </p>
      </div>

      <div
        className={clsx(
          'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2',
          !isEnabled && 'pointer-events-none cursor-not-allowed opacity-50'
        )}
      >
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
                    className="p-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Percentage Factor
                  </th>
                  <th scope="col" className="w-1/3 p-3">
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
                      <UpdateRatePlanFactor
                        key={ratePlan.uuid}
                        ratePlanFactor={ratePlan}
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
                {roomTypes.length === 0 && (
                  <tr className="border-t border-gray-200">
                    <td
                      colSpan={4}
                      className="py-4 text-center text-sm text-gray-500"
                    >
                      No room types found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
