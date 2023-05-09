import type { IRuleFactor } from 'types'

export interface IOccupancyBasedTriggerRule extends IRuleFactor {
  minOccupancy: number
}
