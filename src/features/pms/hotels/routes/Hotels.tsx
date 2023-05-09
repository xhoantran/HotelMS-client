import { HotelsList } from '../components/HotelsList'
import { CreateHotel } from '../components/CreateHotel'
import { Head } from 'components/Head'

export function Hotels() {
  return (
    <>
      <Head title="Hotels" />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Hotels
            </h1>
            {/* <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title,
              email and role.
            </p> */}
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <CreateHotel />
          </div>
        </div>

        <HotelsList />
      </div>
    </>
  )
}
