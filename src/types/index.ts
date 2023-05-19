export interface IRuleFactor {
  readonly uuid: string
  readonly setting: string
  percentageFactor: number
  incrementFactor: number
  readonly createdAt: string
  readonly updatedAt: string
}

export interface IDateRange {
  startDate: string
  endDate: string
}
