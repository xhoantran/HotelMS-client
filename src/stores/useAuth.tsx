import axios from 'lib/axios';
import { setAccessToken, setRefreshToken, isValidToken } from 'utils/jwt';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useEffect } from 'react';
import baseAxios from 'axios';

interface IAuthState {
  isAuthenticated: boolean;
  user: {
    pk: string; // uuid
    username: string;
    email: string;
    name: string;
  };
  login: (email: string, password: string) => Promise<void | Error>;
  verifyEmail: (key: string) => Promise<void | Error>;
  logout: () => void;
  me: () => Promise<void | Error>;
}

const useAuth = create<IAuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: {
          pk: '',
          username: '',
          email: '',
          name: '',
        },
        login: async (email, password) => {
          const response = await axios.post('/api-auth/v1/login/', {
            email,
            password,
          });
          const { access_token, refresh_token, user } = await response.data;
          set({ isAuthenticated: true, user });
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
        },
        verifyEmail: async (key) => {
          await axios.post('/api-auth/v1/registration/verify-email/', {
            key,
          });
        },
        logout: () => {
          set({ isAuthenticated: false });
          setAccessToken();
          setRefreshToken();
        },
        me: async () => {
          const response = await axios.get('/api-auth/v1/user/');
          const user = await response.data;
          set({ isAuthenticated: true, user });
        },
      }),
      { name: 'auth' }
    )
  )
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { me, logout } = useAuth();

  useEffect(() => {
    try {
      const access_token = localStorage.getItem('accessToken');
      const refresh_token = localStorage.getItem('refreshToken');
      // Initialize using access_token
      if (access_token && isValidToken(access_token)) {
        setAccessToken(access_token);
        me();
      } else if (refresh_token && isValidToken(refresh_token)) {
        baseAxios
          .post('/api-auth/v1/token/refresh/', {
            refresh: refresh_token,
          })
          .then(({ data }) => {
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
            me();
          })
          .catch(() => {
            setAccessToken();
            setRefreshToken();
          });
        // Ehh
      } else {
        setAccessToken();
        setRefreshToken();
        logout();
      }
    } catch (error) {
      setAccessToken();
      setRefreshToken();
      logout()
    }
  }, []);
  return <>{children}</>;
}

export default useAuth;
