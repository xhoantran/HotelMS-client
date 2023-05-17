import { XCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { FactorBadge } from 'components/FactorBadge'
import { formatTime } from 'utils/format'
import { useUpdateTimeRule } from '../api/updateTimeRule'
import { DeleteTimeRule } from './DeleteTimeRule'

import type { ITimeBasedTriggerRule } from '../types'

const UpdateTimeRuleSchema = z.object({
  setting: z.string().nonempty(),
  hour: z.number().int().positive().max(23),
  dayAhead: z.number().int().positive().max(1),
  minOccupancy: z.number().int().positive(),
  factor: z.number().int().positive(),
  isPercentage: z.boolean()
})

interface UpdateTimeRuleProps {
  timeRule: ITimeBasedTriggerRule
  currency: string
}

export function UpdateTimeRule(props: UpdateTimeRuleProps) {
  const [open, setOpen] = useState(false)
  const updateOccupancyRuleMutation = useUpdateTimeRule()

  const defaultValues = {
    setting: props.timeRule.setting,
    hour: props.timeRule.hour,
    dayAhead: props.timeRule.dayAhead,
    minOccupancy: props.timeRule.minOccupancy,
    factor:
      props.timeRule.incrementFactor !== 0
        ? props.timeRule.incrementFactor
        : props.timeRule.percentageFactor,
    isPercentage: props.timeRule.incrementFactor !== 0 ? 0 : 1
  }

  const methods = useForm({
    resolver: zodResolver(UpdateTimeRuleSchema),
    defaultValues
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = methods

  const closeSlideOver = () => {
    setOpen(false)
  }

  const onSubmit = handleSubmit((values) => {
    updateOccupancyRuleMutation.mutate(
      {
        data: {
          hour: values.hour,
          minOccupancy: values.minOccupancy,
          dayAhead: values.dayAhead,
          incrementFactor: values.isPercentage ? 0 : values.factor,
          percentageFactor: values.isPercentage ? values.factor : 0
        },
        timeRuleUuid: props.timeRule.uuid
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
            setError('root', {
              type: 'manual',
              message: err.response?.data?.detail[0].contains('unique')
                ? 'This minimum occupancy already exists'
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
          {/* Errors */}
          <tr className="border-t border-gray-200">
            {Object.keys(errors).length > 0 && (
              <td colSpan={5}>
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
              <td className="py-3 pl-3 text-left text-sm">
                <div className="flex items-center justify-center gap-1">
                  <input
                    {...register('hour')}
                    type="number"
                    min={0}
                    max={23}
                    id="hour"
                    className="block rounded-md border-0 px-1 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                  <select
                    {...register('dayAhead')}
                    id="dayAhead"
                    className="block w-24 rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    defaultValue="Today"
                  >
                    <option value={0}>Today</option>
                    <option value={1}>Tomorrow</option>
                  </select>
                </div>
              </td>
              <td className="p-3 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <input
                    {...register('minOccupancy')}
                    type="number"
                    id="minOccupancy"
                    className="block max-w-[3rem] rounded-md border-0 px-1 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                </div>
              </td>
              <td className="p-3 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <div className="max-w-[8.5rem]">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        {...register('factor')}
                        type="text"
                        id="factor"
                        className="block w-full rounded-md border-0 py-1.5 pr-16 text-right text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                        placeholder="+10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor="factor-type" className="sr-only">
                          Factor type
                        </label>
                        <select
                          {...register('isPercentage')}
                          id="factor-type"
                          className="h-full rounded-md border-0 bg-transparent py-0 pl-1 pr-7 text-sm text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                        >
                          <option value={0}>{props.currency}</option>
                          <option value={1}>%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-right text-sm font-medium">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                    disabled={updateOccupancyRuleMutation.isLoading}
                    onClick={onSubmit}
                  >
                    <CheckIcon
                      className="block h-4 w-4 stroke-[3px] lg:hidden"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:block">Save</span>
                    <span className="sr-only">, {props.timeRule.uuid}</span>
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
                    <span className="sr-only">, {props.timeRule.uuid}</span>
                  </button>
                </div>
              </td>
            </FormProvider>
          </tr>
        </>
      ) : (
        <>
          <tr key={props.timeRule.uuid} className="border-t border-gray-200">
            <td className="py-3 pl-3 text-center text-sm">
              <div className="font-medium text-gray-900">
                {formatTime(props.timeRule.hour)}
                {props.timeRule.dayAhead === 1 ? ' Tomorrow' : ' Today'}
              </div>
            </td>
            <td>
              <div className="p-3 text-center text-sm font-medium">
                {props.timeRule.minOccupancy} or above
              </div>
            </td>
            <td className="p-3 text-center text-sm font-medium">
              <FactorBadge
                percentage={props.timeRule.percentageFactor}
                increment={props.timeRule.incrementFactor}
                currency={props.currency}
              />
            </td>
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
                  <span className="sr-only">, {props.timeRule.uuid}</span>
                </button>
                <DeleteTimeRule timeRule={props.timeRule} />
              </div>
            </td>
          </tr>
        </>
      )}
    </>
  )
}
