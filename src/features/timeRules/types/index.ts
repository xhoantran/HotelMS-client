import type { IRuleFactor } from 'types'

export interface ITimeBasedTriggerRule extends IRuleFactor {
  hour: number
  minute: number
  dayAhead: number
  minOccupancy: number
  maxOccupancy: number
}
