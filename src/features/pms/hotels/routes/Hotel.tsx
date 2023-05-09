import { ClockIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Spinner } from 'components/Elements'
import { Head } from 'components/Head'
import { RoomTypeList } from 'features/pms/roomTypes/components/RoomTypeList'
import { DynamicPricingSetting } from 'features/rms/dynamicPricingSetting/components/DynamicPricingSetting'
import { formatDate } from 'utils/format'
import { useHotel } from '../api/getHotel'
import { HotelGeneral } from '../components/HotelGeneral'
import { SyncHotel } from '../components/SyncHotel'

const tabs = [
  { name: 'General' },
  { name: 'Base rate' },
  { name: 'Dynamic Pricing' }
]

export function Hotel() {
  const [activeTab, setActiveTab] = useState(tabs[0].name)
  const { hotelUuid } = useParams() as { hotelUuid: string }
  const hotelQuery = useHotel({ hotelUuid })

  if (hotelQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!hotelQuery.data) return <div>Something went wrong</div>

  const nestedComponents = () => {
    switch (activeTab) {
      case 'General':
        return <HotelGeneral data={hotelQuery.data} />
      case 'Base rate':
        return <RoomTypeList hotelUuid={hotelUuid} />
      case 'Dynamic Pricing':
        return (
          <DynamicPricingSetting
            currency={hotelQuery.data.currency}
            dynamicPricingSettingUuid={
              hotelQuery.data.dynamicPricingSetting.uuid
            }
          />
        )
      default:
        return <HotelGeneral data={hotelQuery.data} />
    }
  }

  return (
    <>
      <Head title="Hotel" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
          {/* Headers */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {hotelQuery.data.name}
              </h2>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <ClockIcon
                  className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                Updated on {formatDate(hotelQuery.data.updatedAt)}
              </div>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <SyncHotel hotelUuid={hotelUuid} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-10">
            <div className="sm:hidden">
              <label htmlFor="current-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="current-tab"
                name="current-tab"
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                defaultValue={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setActiveTab(tab.name)}
                    className={clsx(
                      tab.name === activeTab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                    )}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">{nestedComponents()}</div>
      </div>
    </>
  )
}
