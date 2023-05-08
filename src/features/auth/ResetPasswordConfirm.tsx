import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

import Page from 'components/Page'
import { PATH_AUTH } from 'routes/paths'
import useAuth from 'stores/useAuth'

export default function ResetPasswordConfirm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [redirectCount, setRedirectCount] = useState(5)

  const [params] = useSearchParams()
  const { resetPasswordConfirm } = useAuth()
  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        uid: yup.string().required(),
        token: yup.string().required(),
        newPassword1: yup.string().required("Password isn't valid"),
        newPassword2: yup
          .mixed()
          .test('match', 'Passwords does not match', function () {
            return this.parent.newPassword1 === this.parent.newPassword2
          })
      })
    ),
    defaultValues: {
      uid: params.get('uid') ?? '',
      token: params.get('token') ?? '',
      newPassword1: '',
      newPassword2: ''
    }
  })

  const {
    handleSubmit,
    setError,
    formState: { errors },
    register
  } = methods

  const onSubmit = handleSubmit((data) => {
    if (data.uid === '' || data.token === '') {
      setError('root', { message: 'Invalid link' })
      return
    }

    resetPasswordConfirm(data)
      .then(() => {
        setIsSuccess(true)
        const interval = setInterval(() => {
          setRedirectCount((prev) => prev - 1)
        }, 1000)

        setTimeout(() => {
          clearInterval(interval)
          navigate(PATH_AUTH.login)
        }, 5000)
      })
      .catch(() => {
        setError('root', { message: 'Invalid link' })
      })
  })

  return (
    <Page title="Reset Password - Hanz">
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center lg:w-96">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>

        {isSuccess && (
          <div className="mt-4 w-full rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-700">
                  Password has been reset successfully. Redirecting to login
                  page in {redirectCount} seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {errors.root && (
          <div className="mt-6 w-full rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 text-sm font-medium">
                <h3 className="text-red-800">
                  Link is invalid or expired. Plese click
                  <Link to={PATH_AUTH.resetPassword} className="text-blue-600">
                    {' '}
                    here{' '}
                  </Link>
                  to reset password again.
                </h3>
              </div>
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="w-full">
            <div className="mt-6 w-full">
              <label
                htmlFor="newPassword1"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('newPassword1')}
                  id="newPassword1"
                  type="password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                {errors.newPassword1 && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.newPassword1.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 w-full">
              <label
                htmlFor="newPassword2"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  {...register('newPassword2')}
                  id="newPassword2"
                  type="password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                {errors.newPassword2 && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.newPassword2.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 w-full">
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Page>
  )
}
