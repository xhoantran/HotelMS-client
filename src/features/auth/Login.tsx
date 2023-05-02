import { EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Page from 'components/Page';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { PATH_AUTH } from 'routes/paths';
import useAuth from 'stores/useAuth';
import * as Yup from 'yup';
import { AxiosError } from 'axios';

const Login = () => {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      if (typeof err === 'string') {
        setError('password', {
          type: 'manual',
          message: err,
        });
      } else if (err instanceof AxiosError) {
        if (isMountedRef.current) {
          setError('password', {
            type: 'manual',
            message: err.response?.data.detail,
          });
        }
      } else {
        if (isMountedRef.current) {
          setError('password', {
            type: 'manual',
            message: 'Something went wrong, please try again.',
          });
        }
      }
    }
  };

  return (
    <Page title="Login - Hanz">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          {errors.password && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.password.message}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <FormProvider {...methods}>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      to={PATH_AUTH.resetPassword}
                      className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  <div className="text-gray-400 cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                    {showPassword ? (
                      <EyeIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={clsx(
                    'flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Page>
  );
};

export default Login;