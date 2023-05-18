import type { IDateRange } from 'types'

export interface IIntervalBaseRate {
  uuid: string
  setting: string
  dates: IDateRange
  baseRate: number
}
