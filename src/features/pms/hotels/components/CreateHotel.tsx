import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Fragment, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { useCreateHotel } from '../api/createHotel'

const CreateHotelSchema = z.object({
  channelManager: z.string().nonempty('Channel manager is required'),
  cmId: z.string().nonempty('Property ID is required'),
  cmApiKey: z.string().nonempty('API Key is required')
})

const defaultValues = {
  channelManager: 'Channex',
  cmId: '',
  cmApiKey: ''
}

export function CreateHotel() {
  const [open, setOpen] = useState(false)
  const createHotelMutation = useCreateHotel()

  const methods = useForm({
    resolver: zodResolver(CreateHotelSchema),
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
    createHotelMutation.mutate(
      {
        data: {
          ...values
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
              message: err.response?.data?.detail || 'Something went wrong'
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
      <button
        type="button"
        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={() => setOpen(true)}
      >
        Add Hotel
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeSlideOver}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Create Hotel
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              onClick={() => closeSlideOver()}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <FormProvider {...methods}>
                          {errors.root && (
                            <div className="mb-6 rounded-md bg-red-50 p-4">
                              <div className="flex">
                                <div className="shrink-0">
                                  <XCircleIcon
                                    className="h-5 w-5 text-red-400"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-red-800">
                                    {errors.root.message}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          )}
                          <form onSubmit={onSubmit}>
                            <div>
                              <label
                                htmlFor="channelManager"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Source
                              </label>
                              <div className="mt-2">
                                <input
                                  {...register('channelManager')}
                                  type="text"
                                  id="channelManager"
                                  defaultValue="CHANNEX"
                                  disabled
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                                  placeholder="Channex"
                                />
                              </div>
                            </div>
                            <div className="mt-8">
                              <label
                                htmlFor="cmId"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Property ID
                              </label>
                              <div className="mt-2">
                                <input
                                  {...register('cmId')}
                                  type="text"
                                  id="cmId"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                                />
                              </div>
                              {errors.cmId && (
                                <p
                                  className="mt-2 text-sm text-red-600"
                                  id="cm-id-error"
                                >
                                  {errors.cmId.message}
                                </p>
                              )}
                            </div>
                            <div className="mt-8">
                              <label
                                htmlFor="cmApiKey"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                API Key
                              </label>
                              <div className="mt-2">
                                <input
                                  {...register('cmApiKey')}
                                  type="text"
                                  id="cmApiKey"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                              {errors.cmApiKey && (
                                <p
                                  className="mt-2 text-sm text-red-600"
                                  id="cm-api-key-error"
                                >
                                  {errors.cmApiKey.message}
                                </p>
                              )}
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                              <button
                                type="button"
                                className="text-sm font-semibold leading-6 text-gray-900"
                                onClick={() => closeSlideOver()}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                disabled={createHotelMutation.isLoading}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </FormProvider>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
