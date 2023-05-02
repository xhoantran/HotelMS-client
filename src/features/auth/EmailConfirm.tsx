import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Page from 'components/Page';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PATH_AUTH } from 'routes/paths';
import useAuth from 'stores/useAuth';

const EmailConfirm = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [countdown, setCountdown] = useState(4);
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const key = searchParams.get('key');
    if (typeof key === 'string' && key.length > 0) {
      verifyEmail(key)
        .then(() => {
          setStatus('success');
        })
        .catch(() => {
          setStatus('error');
        });
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      if (countdown === 0) {
        navigate(PATH_AUTH.login);
      }

      return () => clearTimeout(timer);
    }
  }, [status, countdown]);

  return (
    <Page title="Confirm email - Hanz">
      <div className="min-h-full flex flex-col items-center justify-center mx-auto w-full max-w-sm lg:w-96">
        {status === 'loading' ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900">
              Confirming your email
            </h2>

            <div className="mt-4">
              <svg
                className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircleIcon className="text-green-500 h-20" />
            <h2 className="text-3xl font-bold text-gray-900">
              Redirect in {countdown}...
            </h2>
          </>
        ) : (
          <>
            <ExclamationCircleIcon className="text-red-500 h-20" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-4 text-gray-500 text-center">
              This link is invalid or expired.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-8">
              <Link
                to={PATH_AUTH.login}
                className="text-blue-600 text-sm font-medium "
              >
                <span aria-hidden="true">&larr;</span> Return to sign in
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-900">
                Contact support
              </Link>
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default EmailConfirm;
