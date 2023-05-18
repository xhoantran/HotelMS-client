import type { IIntervalBaseRate } from 'features/rms/intervalBaseRates/types'
import type { IOccupancyBasedTriggerRule } from 'features/rms/occupancyRules/types'
import type { ITimeBasedTriggerRule } from 'features/rms/timeRules/types'

export interface IDynamicPricingSetting {
  readonly uuid: string
  isEnabled: boolean
  defaultBaseRate: number
  intervalBaseRates: IIntervalBaseRate[]
  isOccupancyBased: boolean
  occupancyBasedTriggerRules: IOccupancyBasedTriggerRule[]
  isTimeBased: boolean
  timeBasedTriggerRules: ITimeBasedTriggerRule[]
  readonly createdAt: string
  readonly updatedAt: string
}
