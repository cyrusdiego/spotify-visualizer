import axios, { AxiosResponse } from 'axios';
import { spotifyBaseUrl, spotifyCurrentTrack } from './constants';

export type image = {
  height: number;
  width: number;
  url: string;
};

type artists = {
  name: string;
};

type album = {
  name: string;
  images: image[];
};

interface IPlayerResp {
  item: {
    album: album;
    artists: artists[];
    name: string;
    id: string;
  };
}

interface IAudioFeatures {
  duration_ms: number;
  time_signature: number;
}

interface IAudioAnalysis {
  bars: timeInterval[];
  beat: timeInterval[];
  sections: section[];
  segments: segment[];
  tatums: timeInterval[];
}

export type timeInterval = {
  start: number;
  duration: number;
  confidence: number;
};

export type segment = {
  start: number;
  duration: number;
  confidence: number;
  loudnessStart: number;
  loudnessMax: number;
  loudnessMaxTime: number;
  loudnessEnd: number;
  pitches: number[];
  timbre: number[];
};

export type section = {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempoConfidence: number;
  key: number;
  keyConfidence: number;
  mode: number;
  modeConfidence: number;
  timeSignature: number;
  timeSignatureConfidence: number;
};

export const getCurrentTrack = (
  token: string
): Promise<AxiosResponse<IPlayerResp>> => {
  return axios(spotifyBaseUrl + spotifyCurrentTrack, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  });
};

export const getAudioFeatures = (
  token: string,
  trackID: string
): Promise<AxiosResponse<IAudioFeatures>> => {
  return axios(spotifyBaseUrl + '/audio-features/' + trackID, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
  });
};

export const getAudioAnalysis = (
  token: string,
  trackID: string
): Promise<AxiosResponse<IAudioAnalysis>> => {
  // pauseSong(token);
  return axios(spotifyBaseUrl + '/audio-analysis/' + trackID, {
    headers: { Authorization: 'Bearer ' + token },
    method: 'GET',
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
  return axios(spotifyBaseUrl + '/me/player/seek', {
    headers: { Authorization: 'Bearer ' + token },
    params: {
      position_ms: 0,
    },
    method: 'PUT',
  });
};

const pauseSong = (token: string): Promise<AxiosResponse> => {
  return axios(spotifyBaseUrl + '/me/player/pause', {
    headers: { Authorization: 'Bearer ' + token },
    method: 'PUT',
  });
};

const playSong = (token: string): Promise<AxiosResponse> => {
  return axios(spotifyBaseUrl + '/me/player/play', {
    headers: { Authorization: 'Bearer ' + token },
    method: 'PUT',
  });
};
