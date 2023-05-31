export interface IRatePlanRMS {
  uuid: string
  name: string
  percentageFactor: number
}

export interface IRoomTypeRMS {
  uuid: string
  name: string
  ratePlans: IRatePlanRMS[]
}
