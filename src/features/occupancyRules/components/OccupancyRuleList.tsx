import clsx from 'clsx'

import { CreateOccupancyRule } from './CreateOccupancyRule'
import { UpdateOccupancyRule } from './UpdateOccupancyRule'

import type { IOccupancyBasedTriggerRule } from '../types'

interface IOccupancyRuleListProps {
  isOccupancyBased: boolean
  occupancyRules: IOccupancyBasedTriggerRule[]
  dynamicPricingSettingUuid: string
  currency: string
}

export function OccupancyRuleList(props: IOccupancyRuleListProps) {
  const {
    isOccupancyBased,
    occupancyRules,
    currency,
    dynamicPricingSettingUuid
  } = props
  occupancyRules.sort((a, b) => a.minOccupancy - b.minOccupancy)

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Occupancy Based Trigger Rules
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Rate will be applied when the number of occupied rooms above the
          specified threshold. The rule with the highest threshold will be
          applied.
        </p>
      </div>

      <div
        className={clsx(
          'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2',
          !isOccupancyBased &&
            'pointer-events-none cursor-not-allowed opacity-50'
        )}
      >
        <div className="col-span-5">
          <div className="rounded-md ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-1/4 py-3 pl-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Occupancy
                  </th>
                  <th
                    scope="col"
                    className="w-2/4 p-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Factor
                  </th>
                  <th scope="col" className="p-3">
                    <span className="sr-only">Select</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {occupancyRules.map((rule) => (
                  <UpdateOccupancyRule
                    key={rule.uuid}
                    occupancyRule={rule}
                    currency={currency}
                  />
                ))}
                <CreateOccupancyRule
                  dynamicPricingSettingUuid={dynamicPricingSettingUuid}
                  currency={currency}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
