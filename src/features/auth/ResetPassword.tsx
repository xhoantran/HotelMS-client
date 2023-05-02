import Page from 'components/Page'
import { Link } from 'react-router-dom'
import { PATH_AUTH } from 'routes/paths'

const ResetPassword = () => {
  return (
    <Page title="Reset Password - Hanz">
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col items-center justify-center lg:w-96">
        <h2 className="text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-4 text-center text-gray-500">
          Please enter the email address associated with your account and We
          will email you a link to reset your password.
        </p>

        <div className="mt-6 w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
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
