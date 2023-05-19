export type IRoomType = {
  uuid: string
  pmsId: string
  name: string
  ratePlans: {
    uuid: string
    roomType: string
    name: string
    pmsId: string
    createdAt: string
    updatedAt: string
  }[]
  hotel: string
  createdAt: string
  updatedAt: string
}
