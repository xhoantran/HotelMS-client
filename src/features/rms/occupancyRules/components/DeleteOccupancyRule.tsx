import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'

import { useDeleteOccupancyRule } from '../api/deleteOccupancyRule'

import type { IOccupancyBasedTriggerRule } from '../types'
import clsx from 'clsx'

interface DeleteOccupancyRuleProps {
  occupancyRule: IOccupancyBasedTriggerRule
}

export function DeleteOccupancyRule(props: DeleteOccupancyRuleProps) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  const deleteOccupancyRuleMutation = useDeleteOccupancyRule({
    dynamicPricingSettingUuid: props.occupancyRule.setting
  })

  return (
    <>
      {open && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Are you sure you want to delete this occupancy rule?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-800">
                            Information about the rule:
                          </p>
                          <ul className="my-1 list-inside list-disc text-sm text-gray-800">
                            <li>
                              <span>Occupancy:</span>{' '}
                              {props.occupancyRule.minOccupancy} or above
                            </li>
                            <li>
                              <span>Factor:</span>{' '}
                              {props.occupancyRule.incrementFactor === 0
                                ? props.occupancyRule.percentageFactor + '%'
                                : props.occupancyRule.incrementFactor}
                            </li>
                          </ul>

                          <p className="text-sm text-gray-800">
                            Please note that all the rates under affected will
                            be remain{' '}
                            <span className="font-semibold text-black">
                              unchanged.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className={clsx(
                          'inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto',
                          deleteOccupancyRuleMutation.isLoading &&
                            'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => {
                          deleteOccupancyRuleMutation
                            .mutateAsync({
                              occupancyRuleUuid: props.occupancyRule.uuid
                            })
                            .then(() => setOpen(false))
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      <button
        type="button"
        className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="block h-4 w-4 lg:hidden" aria-hidden="true" />
        <span className="hidden lg:block">Delete</span>
        <span className="sr-only">, {props.occupancyRule.uuid}</span>
      </button>
    </>
  )
}
