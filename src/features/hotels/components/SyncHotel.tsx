import clsx from "clsx";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { useSyncHotel } from "../api/syncHotel";


export function SyncHotel({ hotelUuid}: { hotelUuid: string }) {
  const syncHotelMutation = useSyncHotel();

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold",
        syncHotelMutation.isLoading 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : "bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
      )}
      onClick={() => syncHotelMutation.mutate({ hotelUuid })}
      disabled={syncHotelMutation.isLoading}
    >
      <ArrowPathIcon 
        className={clsx(
          "-ml-0.5 h-5 w-5",
          syncHotelMutation.isLoading ? 'animate-spin' : '',
        )}
        aria-hidden="true" 
      />
      Sync
    </button>
  )
};