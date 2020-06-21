import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface ITokenState {
  accessToken: string;
  refreshToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export const useTokenHooks = (): ITokenState => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const access = Cookies.get('access_token');
    const refresh = Cookies.get('refresh_token');
    if (access && refresh) {
      setAccessToken(access);
      setRefreshToken(refresh);
    }
  }, []);

  return {
    accessToken,
    refreshToken,
    setAccessToken,
  };
};
