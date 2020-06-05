import { useState, useEffect } from 'react';
import { getHashParams } from '../../api/utils';

interface ITokenState {
  accessToken: string;
  refreshToken: string;
}

export const useTokenHooks = (): ITokenState => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const params = getHashParams();
    if (params) {
      setAccessToken(params.access_token);
      setRefreshToken(params.refresh_token);
    }
  }, []);

  return {
    accessToken,
    refreshToken,
  };
};
