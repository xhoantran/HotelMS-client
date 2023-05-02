export interface IHotel {
  readonly uuid: string
  name: string
  inventoryDays: number
  address: string
  city: string
  country: string
  currency: string
  timezone: string
  pms: string
  pmsId: string
  pmsApiKey: string
  dynamicPricingSetting: {
    readonly uuid: string
    readonly isEnabled: boolean
    readonly createdAt: string
    readonly updatedAt: string
  }
  readonly createdAt: string
  readonly updatedAt: string
}
