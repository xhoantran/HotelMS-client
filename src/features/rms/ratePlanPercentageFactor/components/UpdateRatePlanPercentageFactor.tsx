import { XCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { FactorBadge } from 'components/FactorBadge'
import { queryClient } from 'lib/react-query'
import { useUpdateRatePlanPercentageFactor } from '../api/updateRatePlanPercentageFactor'

import type { IRatePlanRMS } from '../types'

const UpdateRatePlanPercentageFactorSchema = z.object({
  percentageFactor: z.number().int().min(-100)
})

interface UpdateRatePlanPercentageFactorProps {
  ratePlanPercentageFactor: IRatePlanRMS
  dynamicPricingSettingUuid: string
  defaultBaseRate: number
  currency: string
}

export function UpdateRatePlanPercentageFactor(
  props: UpdateRatePlanPercentageFactorProps
) {
  const [open, setOpen] = useState(false)
  const updateRatePlanPercentageFactorMutation =
    useUpdateRatePlanPercentageFactor()

  const defaultValues = {
    percentageFactor: props.ratePlanPercentageFactor.percentageFactor
  }

  const methods = useForm({
    resolver: zodResolver(UpdateRatePlanPercentageFactorSchema),
    defaultValues
  })

  const {
    register,
    handleSubmit,
    setError,
    // watch,
    formState: { errors }
  } = methods

  // const percentageFactor = watch('percentageFactor', 0)

  const onSubmit = handleSubmit((values) => {
    updateRatePlanPercentageFactorMutation.mutate(
      {
        data: {
          percentageFactor: values.percentageFactor
        },
        ratePlanUuid: props.ratePlanPercentageFactor.uuid
      },
      {
        onSuccess: () => {
          setOpen(false)
          queryClient.invalidateQueries([
            'dynamicPricingSetting',
            props.dynamicPricingSettingUuid
          ])
        },
        onError: (err: unknown) => {
          if (typeof err === 'string') {
            setError('root', {
              type: 'manual',
              message: err
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
          {/* Errors */}
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

          {/* Form */}
          <tr className="border-gray-200">
            <FormProvider {...methods}>
              <td className="py-3 pl-3 text-left text-sm sm:pl-10">
                <div className="truncate font-medium text-gray-900">
                  {props.ratePlanPercentageFactor.name}
                </div>
              </td>
              <td className="p-3 text-center text-sm">
                <div className="flex items-center justify-center">
                  <div className="max-w-[5rem]">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        {...register('percentageFactor', {
                          valueAsNumber: true
                        })}
                        type="text"
                        id="percentageFactor"
                        className="block w-full rounded-md border-0 py-1 pr-8 text-right text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                        placeholder="+10"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id="price-currency"
                        >
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              {/* <td className="hidden p-3 text-center text-sm text-gray-500 sm:table-cell">
                {props.defaultBaseRate * (1 + percentageFactor / 100)}{' '}
                {props.currency}
              </td> */}
              <td className="p-3 text-right text-sm font-medium">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                    disabled={updateRatePlanPercentageFactorMutation.isLoading}
                    onClick={onSubmit}
                  >
                    <CheckIcon
                      className="block h-4 w-4 stroke-[3px] lg:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:block">Save</span>
                    <span className="sr-only">
                      , {props.ratePlanPercentageFactor.uuid}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon
                      className="block h-4 w-4 stroke-[2px] lg:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:block">Cancel</span>
                    <span className="sr-only">
                      , {props.ratePlanPercentageFactor.uuid}
                    </span>
                  </button>
                </div>
              </td>
            </FormProvider>
          </tr>
        </>
      ) : (
        <>
          <tr
            key={props.ratePlanPercentageFactor.uuid}
            className="border-t border-gray-200"
          >
            <td className="py-3 pl-3 text-left text-sm sm:pl-10">
              <div className="truncate font-medium text-gray-900">
                {props.ratePlanPercentageFactor.name}
              </div>
            </td>
            <td className="p-3 text-center text-sm text-gray-500">
              <FactorBadge
                percentage={props.ratePlanPercentageFactor.percentageFactor}
                increment={0}
                currency={props.currency}
              />
            </td>
            {/* <td className="hidden p-3 text-center text-sm text-gray-500 sm:table-cell">
              {props.defaultBaseRate *
                (1 +
                  props.ratePlanPercentageFactor.percentageFactor / 100)}{' '}
              {props.currency}
            </td> */}
            <td className="w-fit p-3 text-right text-sm font-medium">
              <div className="inline-flex  items-center gap-2">
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  onClick={() => setOpen(true)}
                >
                  <PencilIcon
                    className="block h-4 w-4 text-gray-500 lg:hidden"
                    aria-hidden="true"
                  />
                  <span className="hidden lg:block">Edit</span>
                  <span className="sr-only">
                    , {props.ratePlanPercentageFactor.uuid}
                  </span>
                </button>
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  )
}
