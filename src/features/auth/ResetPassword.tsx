import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Page from 'components/Page'
import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { PATH_AUTH } from 'routes/paths'
import useAuth from 'stores/useAuth'
import * as z from 'zod'

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { requestResetPassword } = useAuth()

  const ResetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email')
  })

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const {
    handleSubmit,
    setError,
    formState: { errors },
    register
  } = methods

  const onSubmit = handleSubmit((data) => {
    requestResetPassword(data.email)
      .then(() => {
        setIsSuccess(true)
      })
      .catch((error) => {
        if (typeof error === 'string') {
          setError('email', { message: error })
        } else if (error instanceof AxiosError) {
          setError('email', { message: error.response?.data.detail })
        }
      })
  })

  return (
    <Page title="Reset Password - HotelMS">
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center lg:w-96">
        <h2 className="text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-4 text-center text-gray-500">
          Please enter the email address associated with your account and We
          will email you a link to reset your password.
        </p>

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
                  A password reset link has been sent to your email address.
                </p>
              </div>
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="w-full">
            <div className="mt-6 w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.email.message}
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

        <div className="mt-10 flex items-center justify-center gap-x-8">
          <Link
            to={PATH_AUTH.login}
            className="text-sm font-medium text-blue-600 "
          >
            <span aria-hidden="true">&larr;</span> Return to sign in
          </Link>
          <Link to="#" className="text-sm font-medium text-gray-900">
            Contact support
          </Link>
        </div>
      </div>
    </Page>
  )
}

export default ResetPassword
