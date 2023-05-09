import { XCircleIcon } from '@heroicons/react/20/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { useCreateTimeRule } from '../api/createTimeRule'

const CreateTimeRuleSchema = Yup.object().shape({
  setting: Yup.string().required('Setting is required'),
  hour: Yup.number()
    .integer("Hour can't be a decimal number")
    .required('Hour is required')
    .min(0, 'Hour must be greater than or equal to 0')
    .max(23, 'Hour must be less than or equal to 23'),
  minute: Yup.number()
    .integer("Minute can't be a decimal number")
    .required('Minute is required')
    .min(0, 'Minute must be greater than or equal to 0')
    .max(59, 'Minute must be less than or equal to 59'),
  dayAhead: Yup.number().oneOf([0, 1], 'Day ahead must be either 0 or 1'),
  minOccupancy: Yup.number()
    .integer("Minimum occupancy can't be a decimal number")
    .required('Minimum occupancy is required'),
  maxOccupancy: Yup.number()
    .integer("Maximum occupancy can't be a decimal number")
    .required('Maximum occupancy is required')
    .moreThan(
      Yup.ref('minOccupancy'),
      'Maximum occupancy must be greater than minimum occupancy'
    ),
  factor: Yup.number()
    .integer("Factor can't be a decimal number")
    .required('Factor is required')
    .notOneOf([0], 'Factor cannot be 0'),
  isPercentage: Yup.boolean().required(
    'Either percentage or fixed amount is required'
  )
})

interface CreateTimeRuleProps {
  dynamicPricingSettingUuid: string
  currency: string
}

export function CreateTimeRule(props: CreateTimeRuleProps) {
  const [open, setOpen] = useState(false)
  const createTimeRuleMutation = useCreateTimeRule()

  const defaultValues = {
    setting: props.dynamicPricingSettingUuid,
    hour: 0,
    minute: 0,
    dayAhead: 0,
    minOccupancy: 0,
    maxOccupancy: 0,
    factor: 0,
    isPercentage: 1
  }

  const methods = useForm({
    resolver: yupResolver(CreateTimeRuleSchema),
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
    createTimeRuleMutation.mutate(
      {
        data: {
          setting: values.setting,
          hour: values.hour,
          minute: values.minute,
          dayAhead: values.dayAhead,
          minOccupancy: values.minOccupancy,
          maxOccupancy: values.maxOccupancy,
          incrementFactor: values.isPercentage ? 0 : values.factor,
          percentageFactor: values.isPercentage ? values.factor : 0
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
                <div className="flex items-center justify-center gap-1">
                  <input
                    {...register('hour')}
                    type="number"
                    min={0}
                    max={23}
                    id="hour"
                    className="block rounded-md border-0 px-1 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                  <span className="text-gray-500">:</span>
                  <input
                    {...register('minute')}
                    type="number"
                    min={0}
                    max={23}
                    id="minute"
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
                <div className="flex items-center justify-center gap-1">
                  <input
                    {...register('minOccupancy')}
                    type="number"
                    min={0}
                    max={23}
                    id="minOccupancy"
                    className="block rounded-md border-0 px-1 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    {...register('maxOccupancy')}
                    type="number"
                    min={0}
                    max={23}
                    id="maxOccupancy"
                    className="block rounded-md border-0 px-1 py-1.5 text-center text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
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
                    disabled={createTimeRuleMutation.isLoading}
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