import { useState, useEffect } from 'react';
import {
  getAudioAnalysis,
  getCurrentTrack,
  getNewAccessToken,
} from '../../api/spotify';
import { segment, section, timeInterval } from '../../api/types';

interface ITrackInfo {
  available: boolean;
  artist: string;
  name: string;
  art: string;
  id: string;
  progress_s: number;
  timeMeasured_s: number;
  duration_s: number;
}

export interface ITrackAnalysis {
  available: boolean;
  segments: segment[];
  sections: section[];
  tatums: timeInterval[];
  beats: timeInterval[];
  bars: timeInterval[];
}

interface ISpotifyData {
  trackInfo: ITrackInfo;
  trackAnalysis: ITrackAnalysis;
  updateTrackHandler: () => void;
}

const setInitialTrackState: () => ITrackInfo = () => {
  return {
    available: false,
    artist: '',
    name: '',
    id: '',
    art: '',
    progress_s: -1,
    timeMeasured_s: 0,
    duration_s: 0,
  };
};

const setInitialTrackAnalysis: () => ITrackAnalysis = () => {
  return {
    available: false,
    segments: [],
    sections: [],
    tatums: [],
    beats: [],
    bars: [],
  };
};

export const useSpotifyHooks = (
  accessToken: string,
  refreshToken: string,
  setAccessToken: React.Dispatch<React.SetStateAction<string>>
): ISpotifyData => {
  // Hooks
  const [currentTrack, setCurrentTrack] = useState(setInitialTrackState());
  const [trackAnalysis, setTrackAnalysis] = useState(setInitialTrackAnalysis());

  useEffect(() => {
    if (accessToken) {
      handleGetCurrentTrack();
    }
  }, [accessToken]);

  useEffect(() => {
    setTrackAnalysis({ ...trackAnalysis, available: false });
    if (accessToken && currentTrack.id) {
      handleGetTrackAnalysis();
    }
  }, [accessToken, currentTrack.id]);

  const handleGetTrackAnalysis = () => {
    getAudioAnalysis(accessToken, currentTrack.id).then((response) => {
      const trackAnalysis = response.data;
      setTrackAnalysis({
        available: true,
        segments: trackAnalysis.segments,
        sections: trackAnalysis.sections,
        tatums: trackAnalysis.tatums,
        beats: trackAnalysis.beats,
        bars: trackAnalysis.bars,
      });
    });
  };

  // Get current Track data
  const handleGetCurrentTrack = () => {
    getCurrentTrack(accessToken)
      .then((response) => {
        if (response.status === 204) {
          setInitialTrackState();
        } else {
          const playerData = response.data;
          if (playerData.item.id === currentTrack.id) {
            setCurrentTrack({
              ...currentTrack,
              progress_s: playerData.progress_ms / 1000,
              timeMeasured_s: window.performance.now() / 1000,
              duration_s: playerData.item.duration_ms / 1000,
            });
          } else {
            setCurrentTrack({
              available: true,
              artist: playerData.item.artists[0].name,
              name: playerData.item.name,
              art: playerData.item.album.images[0].url,
              id: playerData.item.id,
              progress_s: playerData.progress_ms / 1000,
              timeMeasured_s: window.performance.now() / 1000,
              duration_s: playerData.item.duration_ms / 1000,
            });
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          getNewAccessToken(refreshToken).then((response) => {
            setAccessToken(response.data.access_token);
          });
        }
      });
  };

  return {
    trackInfo: currentTrack,
    trackAnalysis: trackAnalysis,
    updateTrackHandler: handleGetCurrentTrack,
  };
};
