function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  emailConfirm: path(ROOTS_AUTH, '/email-confirm'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  hotels: path(ROOTS_DASHBOARD, '/hotels'),
};
