// import { UpdateRoomType } from './UpdateRoomType'

// import type { IOccupancyBasedTriggerRule } from '../types'

interface RoomTypeListProps {
  hotelUuid: string
  currency: string
}

export function RoomTypeList(props: RoomTypeListProps) {
  const { currency, hotelUuid } = props

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Interval Base Rates
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Rate will be applied when the date is within the specified interval.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-6">
          <div className="rounded-md ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-1/4 py-3 pl-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Occupancy
                  </th>
                  <th
                    scope="col"
                    className="w-2/4 p-3 text-center text-sm font-semibold text-gray-900"
                  >
                    Factor
                  </th>
                  <th scope="col" className="p-3">
                    <span className="sr-only">Select</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {RoomTypes.map((rule) => (
                  <UpdateRoomType
                    key={rule.uuid}
                    RoomType={rule}
                    currency={currency}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
