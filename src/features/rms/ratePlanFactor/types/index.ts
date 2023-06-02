export interface IRatePlanRMS {
  uuid: string
  name: string
  percentageFactor: number
  incrementFactor: number
}

export interface IRoomTypeRMS {
  uuid: string
  name: string
  ratePlans: IRatePlanRMS[]
}
