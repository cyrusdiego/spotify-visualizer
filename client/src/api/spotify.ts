import axios, { AxiosResponse } from 'axios';
import {
  IPlayerResp,
  IAudioFeatures,
  IAudioAnalysis,
  ITokenResp,
} from './types';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const CURRENT_TRACK = '/me/player/currently-playing';
const REFRESH_TOKEN_URL = 'https://spotify-visualizer-14c21.web.app/refresh';
const AUDIO_FEATURES = '/audio-features/';
const AUDIO_ANALYSIS = '/audio-analysis/';

export const getCurrentTrack = (
  token: string
): Promise<AxiosResponse<IPlayerResp>> => {
  return axios(SPOTIFY_BASE_URL + CURRENT_TRACK, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  });
};

export const getAudioFeatures = (
  token: string,
  trackID: string
): Promise<AxiosResponse<IAudioFeatures>> => {
  return axios(SPOTIFY_BASE_URL + AUDIO_FEATURES + trackID, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  });
};

export const getAudioAnalysis = (
  token: string,
  trackID: string
): Promise<AxiosResponse<IAudioAnalysis>> => {
  return axios(SPOTIFY_BASE_URL + AUDIO_ANALYSIS + trackID, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  });
};

export const getNewAccessToken = (
  token: string
): Promise<AxiosResponse<ITokenResp>> => {
  return axios(REFRESH_TOKEN_URL, {
    params: {
      token: token,
    },
  });
};

// Should do some error handling here in case controlling the track doesn't wokr
export const syncTrack = (token: string): void => {
  pauseSong(token).then(() =>
    restartSong(token).then(() => {
      playSong(token);
    })
  );
};

const restartSong = (token: string): Promise<AxiosResponse> => {
  return axios(SPOTIFY_BASE_URL + '/me/player/seek', {
    headers: { Authorization: 'Bearer ' + token },
    params: {
      position_ms: 0,
    },
    method: 'PUT',
  });
};

const pauseSong = (token: string): Promise<AxiosResponse> => {
  return axios(SPOTIFY_BASE_URL + '/me/player/pause', {
    headers: { Authorization: 'Bearer ' + token },
    method: 'PUT',
  });
};

const playSong = (token: string): Promise<AxiosResponse> => {
  return axios(SPOTIFY_BASE_URL + '/me/player/play', {
    headers: { Authorization: 'Bearer ' + token },
    method: 'PUT',
  });
};
