import type { IRuleFactor } from 'types'

export interface ITimeBasedTriggerRule extends IRuleFactor {
  hour: number
  dayAhead: number
  minOccupancy: number
}
