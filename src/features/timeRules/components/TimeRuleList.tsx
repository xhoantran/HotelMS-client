import clsx from 'clsx';

import { CreateTimeRule } from './CreateTimeRule';
import { UpdateTimeRule } from './UpdateTimeRule';

import type { ITimeBasedTriggerRule } from '../types';


interface ITimeRuleListProps {
  isTimeBased: boolean;
  timeRules: ITimeBasedTriggerRule[];
  dynamicPricingSettingUuid: string;
  currency: string;
}

export function TimeRuleList(props: ITimeRuleListProps) {
  const { 
    isTimeBased,
    timeRules, 
    currency, 
    dynamicPricingSettingUuid
  } = props;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Time Based Trigger Rules</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Rate will be applied when the number of occupied rooms above the specified threshold. The rule with the highest threshold will be applied.
        </p>
      </div>

      <div className={clsx(
          "grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2",
          !isTimeBased && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="col-span-5">

          <div className="ring-1 ring-gray-300 sm:mx-0 rounded-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="w-1/5 py-3 pl-3 text-center text-sm font-semibold text-gray-900">
                    Trigger Time
                  </th>
                  <th scope="col" className="max-w-1/3 py-3 px-3 text-center text-sm font-semibold text-gray-900">
                    Occupancy
                  </th>
                  <th scope="col" className="max-w-1/3 py-3 px-3 text-center text-sm font-semibold text-gray-900">
                    Factor
                  </th>
                  <th scope="col" className="py-3 px-3">
                    <span className="sr-only">Select</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeRules.map((rule) => (
                  <UpdateTimeRule
                    key={rule.uuid}
                    timeRule={rule}
                    currency={currency}
                  />
                ))}
                <CreateTimeRule 
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
