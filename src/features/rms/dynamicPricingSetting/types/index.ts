import type { IIntervalBaseRate } from 'features/rms/intervalBaseRates/types'
import type { IOccupancyBasedTriggerRule } from 'features/rms/occupancyRules/types'
import type { ITimeBasedTriggerRule } from 'features/rms/timeRules/types'
import type { IRoomTypeRMS } from 'features/rms/ratePlanPercentageFactor/types'

export interface IDynamicPricingSetting {
  readonly uuid: string
  isEnabled: boolean
  defaultBaseRate: number
  intervalBaseRates: IIntervalBaseRate[]
  roomTypes: IRoomTypeRMS[]
  isOccupancyBased: boolean
  occupancyBasedTriggerRules: IOccupancyBasedTriggerRule[]
  isTimeBased: boolean
  timeBasedTriggerRules: ITimeBasedTriggerRule[]
  readonly createdAt: string
  readonly updatedAt: string
}
