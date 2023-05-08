import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useChangePassword } from '../api/ChangePassword'

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword1: Yup.string().required('New password is required'),
  newPassword2: Yup.mixed().test(
    'match',
    'Passwords does not match',
    function () {
      return this.parent.newPassword1 === this.parent.newPassword2
    }
  )
})

export function ChangePassword() {
  const changePasswordMutation = useChangePassword()

  const methods = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword1: '',
      newPassword2: ''
    },
    resolver: yupResolver(ChangePasswordSchema)
  })

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = handleSubmit((values) => {
    changePasswordMutation
      .mutateAsync({
        data: values
      })
      .then(() => {
        reset()
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setError('oldPassword', {
              type: 'manual',
              message: 'Old password is incorrect'
            })
          }
        }
      })
  })

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Change password
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Update your password associated with your account.
        </p>
      </div>

      <FormProvider {...methods}>
        <form className="md:col-span-2" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-4">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Old password
              </label>
              <div className="mt-2">
                <input
                  {...register('oldPassword')}
                  type="password"
                  id="oldPassword"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.oldPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            <div className="col-span-4">
              <label
                htmlFor="newPassword1"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  {...register('newPassword1')}
                  id="newPassword1"
                  type="password"
                  autoComplete="newPassword1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label
                htmlFor="newPassword2"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  {...register('newPassword2')}
                  id="newPassword2"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              Change password
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
