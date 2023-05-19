import { XCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { useCreateIntervalBaseRate } from '../api/createIntervalBaseRate'

const CreateIntervalBaseRateSchema = z.object({
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
  baseRate: z.number().positive()
})

interface CreateIntervalBaseRateProps {
  dynamicPricingSettingUuid: string
  currency: string
}

const defaultValues = {
  startDate: new Date(Date.now()).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  baseRate: 0
}

export function CreateIntervalBaseRate(props: CreateIntervalBaseRateProps) {
  const [open, setOpen] = useState(false)
  const createIntervalBaseRateMutation = useCreateIntervalBaseRate()

  const methods = useForm({
    resolver: zodResolver(CreateIntervalBaseRateSchema),
    defaultValues
  })

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = methods

  const closeSlideOver = () => {
    setOpen(false)
    reset(defaultValues)
  }

  const onSubmit = handleSubmit((values) => {
    createIntervalBaseRateMutation.mutate(
      {
        data: {
          setting: props.dynamicPricingSettingUuid,
          dates: {
            startDate: values.startDate,
            endDate: values.endDate
          },
          baseRate: values.baseRate
        }
      },
      {
        onSuccess: () => {
          closeSlideOver()
        },
        onError: (err: unknown) => {
          if (typeof err === 'string') {
            setError('root', {
              type: 'manual',
              message: err
            })
          } else if (err instanceof AxiosError) {
            const errorMessage: string = err.response?.data?.detail[0]
            setError('root', {
              type: 'manual',
              message: errorMessage.includes('unique')
                ? 'The minimum occupancy already exists'
                : 'Something went wrong'
            })
          } else {
            setError('root', {
              type: 'manual',
              message: 'Something went wrong'
            })
          }
        }
      }
    )
  })

  return (
    <>
      {open ? (
        <>
          <tr className="border-t border-gray-200">
            {Object.keys(errors).length > 0 && (
              <td colSpan={4}>
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Invalid input
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                          {Object.values(errors).map((error, errorIdx) => (
                            <li key={errorIdx}>{error.message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            )}
          </tr>
          <tr className="border-gray-200">
            <FormProvider {...methods}>
              <td className="py-3 pl-3 text-center text-sm">
                <div className="flex items-center justify-center">
                  <input
                    {...register('startDate')}
                    type="date"
                    id="startDate"
                    className="block max-w-[8rem] rounded-md border-0 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                </div>
              </td>
              <td className="py-3 pl-3 text-center text-sm">
                <div className="flex items-center justify-center">
                  <input
                    {...register('endDate')}
                    type="date"
                    min={0}
                    id="endDate"
                    className="block max-w-[8rem] rounded-md border-0 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                </div>
              </td>
              <td className="p-3 text-center text-sm text-gray-500">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register('baseRate', { valueAsNumber: true })}
                    id="baseRate"
                    autoComplete="baseRate"
                    className="block w-full rounded-md border-0 py-1.5 pr-12 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-50 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="baseRateCurrency"
                    >
                      {props.currency}
                    </span>
                  </div>
                </div>
              </td>
              <td className="p-3 text-right text-sm font-medium">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:bg-gray-200 disabled:text-gray-500"
                    disabled={createIntervalBaseRateMutation.isLoading}
                    onClick={onSubmit}
                  >
                    <CheckIcon
                      className="block h-4 w-4 stroke-[3px] lg:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:block">Save</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    onClick={closeSlideOver}
                  >
                    <XMarkIcon
                      className="block h-4 w-4 stroke-[2px] lg:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:block">Cancel</span>
                  </button>
                </div>
              </td>
            </FormProvider>
          </tr>
        </>
      ) : (
        <tr className="border-t border-gray-200">
          <td colSpan={4} className="p-3 text-center text-sm">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true">+</span> Add another rule
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
