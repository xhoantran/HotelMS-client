import { XCircleIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useCreateOccupancyRule } from '../api/createOccupancyRule';

const CreateOccupancyRuleSchema = Yup.object().shape({
  setting: Yup.string().required('Setting is required'),
  minOccupancy: Yup.number().required('Minimum occupancy is required'),
  factor: Yup.number().required('Factor is required').notOneOf([0], 'Factor cannot be 0'),
  isPercentage: Yup.boolean().required('Either percentage or fixed amount is required'),
})

interface CreateOccupancyRuleProps {
  dynamicPricingSettingUuid: string;
  currency: string;
}

export function CreateOccupancyRule(props: CreateOccupancyRuleProps) {
  const [open, setOpen] = useState(false)
  const createOccupancyRuleMutation = useCreateOccupancyRule()

  const defaultValues = {
    setting: props.dynamicPricingSettingUuid,
    minOccupancy: 0,
    factor: 0,
    isPercentage: 1,
  };

  const methods = useForm({
    resolver: yupResolver(CreateOccupancyRuleSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const closeSlideOver = () => {
    setOpen(false);
    reset(defaultValues);
  };

  console.log(errors);

  const onSubmit = handleSubmit((values) => {
    createOccupancyRuleMutation.mutate({
      data: {
        setting: values.setting,
        minOccupancy: values.minOccupancy,
        incrementFactor: values.isPercentage ? 0 : values.factor,
        percentageFactor: values.isPercentage ? values.factor : 0,
      },
    }, {
      onSuccess: () => {
        closeSlideOver();
      },
      onError: (err: unknown) => {
        if (typeof err === 'string') {
          setError('root', {
            type: 'manual',
            message: err,
          })
        } else if (err instanceof AxiosError) {
          setError('root', {
            type: 'manual',
            message: err.response?.data?.detail[0].contains("unique") ? "This minimum occupancy already exists" : "Something went wrong",
          })
        } else {
          setError('root', {
            type: 'manual',
            message: 'Something went wrong',
          })
        }
      },
    })
  });


  return (
    <>
      {open ? (
        <>
          <tr className="border-t border-gray-200">
            {
              (Object.keys(errors).length > 0) && (
                <td colSpan={4}>
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Invalid input</h3>
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
              )
            }
          </tr>
          <tr className="border-gray-200">
            <FormProvider {...methods}>
              <td className="py-3 pl-3 text-sm text-center">
                <div className="flex items-center justify-center">
                  <input
                    {...register('minOccupancy')}
                    type="number"
                    min={0}
                    id="minOccupancy"
                    className="block max-w-[3rem] rounded-md border-0 py-1.5 text-sm text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                  />
                  </div>
              </td>
              <td className="py-3 px-3 text-sm text-center text-gray-500">
                <div className="flex items-center justify-center">
                  <div className="max-w-[8.5rem]">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        {...register('factor')}
                        type="text"
                        id="factor"
                        className="block w-full rounded-md border-0 py-1.5 pr-16 text-sm text-right text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
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
              <td className="py-3 px-3 text-right text-sm font-medium">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className={clsx("rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                      isSubmitting
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                    )}
                    onClick={onSubmit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    onClick={closeSlideOver}
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </FormProvider>
          </tr>
        </>
      ) : (
        <tr className="border-t border-gray-200">
          <td colSpan={3} className="py-3 px-3 text-sm text-center">
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