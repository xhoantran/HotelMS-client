import { CreateIntervalBaseRate } from './CreateIntervalBaseRate'
import { UpdateIntervalBaseRate } from './UpdateIntervalBaseRate'

import type { IIntervalBaseRate } from '../types'

interface IIntervalBaseRateListProps {
  intervalBaseRates: IIntervalBaseRate[]
  dynamicPricingSettingUuid: string
  currency: string
}

export function IntervalBaseRateList(props: IIntervalBaseRateListProps) {
  const { intervalBaseRates, currency, dynamicPricingSettingUuid } = props

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Interval Base Rates
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Override the base rate for specific date ranges.
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
                    className="w-1/4 py-3 pl-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 py-3 text-center text-sm font-semibold text-gray-900"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 p-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Base Rate
                  </th>
                  <th scope="col" className="p-3">
                    <span className="sr-only">Select</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {intervalBaseRates.map((intervalBaseRate) => (
                  <UpdateIntervalBaseRate
                    key={intervalBaseRate.uuid}
                    intervalBaseRate={intervalBaseRate}
                    currency={currency}
                  />
                ))}
                <CreateIntervalBaseRate
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
