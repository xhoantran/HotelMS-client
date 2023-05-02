import { Link } from 'react-router-dom';

import { Spinner } from 'components/Elements';
import { useHotels } from '../api/getHotels';

export function HotelsList() {
  const hotelsQuery = useHotels();

  if (hotelsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!hotelsQuery.data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="-mx-4 mt-8 sm:-mx-0">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
              Name
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Location
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
            >
              Property ID
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Dynamic Pricing
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {hotelsQuery.data.map((hotel) => (
            <tr key={hotel.name}>
              <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                {hotel.name}
                <dl className="font-normal lg:hidden">
                  <dt className="sr-only">Location</dt>
                  <dd className="mt-1 truncate text-gray-700">
                    {
                      hotel.city && hotel.country ? (
                        <>{hotel.city}, {hotel.country}</>
                      ) : "Unkown"
                    }
                  </dd>
                  <dt className="sr-only sm:hidden">Property ID</dt>
                  <dd className="mt-1 truncate text-gray-500 sm:hidden">{hotel.pmsId}</dd>
                </dl>
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                {
                  hotel.city && hotel.country ? (
                    <>{hotel.city}, {hotel.country}</>
                  ) : "Unkown"
                }
              </td>
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{hotel.pmsId}</td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {hotel.dynamicPricingSetting.isEnabled ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                    Disabled
                  </span>
                )}
              </td>
              <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <Link 
                  to={`./${hotel.uuid}`} 
                  className="text-blue-600 hover:text-blue-900"
                >
                  View<span className="sr-only">, {hotel.name}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hotelsQuery.data.length === 0 && (
        <div className="w-full h-48 flex justify-center items-center">
          <div className="text-gray-500">No hotels found</div>
        </div>
      )}
    </div>
  );
}
