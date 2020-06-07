import { useState, useEffect, useCallback } from 'react';
import {
  getAudioAnalysis,
  getCurrentTrack,
  segment,
  section,
  timeInterval,
} from '../../api/spotify';

interface ITrackInfoState {
  artist: string;
  name: string;
  art: string;
  id: string;
  progress_ms: number;
}

export interface ITrackAnalysisState {
  segments: segment[];
  sections: section[];
  tatums: timeInterval[];
  beats: timeInterval[];
  bars: timeInterval[];
}

interface ISpotifyState {
  trackInfo: ITrackInfoState;
  trackAnalysis: ITrackAnalysisState;
  updateTrackHandler: () => void;
}

export const useSpotifyHooks = (accessToken: string): ISpotifyState => {
  const setInitialTrackState: () => ITrackInfoState = () => {
    return {
      artist: '',
      name: '',
      id: '',
      art: '',
      progress_ms: -1,
    };
  };

  const setInitialTrackAnalysis: () => ITrackAnalysisState = () => {
    return {
      segments: [],
      sections: [],
      tatums: [],
      beats: [],
      bars: [],
    };
  };

  // Hooks
  const [currentTrack, setCurrentTrack] = useState(setInitialTrackState());
  const [trackAnalysis, setTrackAnalysis] = useState(setInitialTrackAnalysis());

  // get current track info
  useEffect(() => {
    if (accessToken) {
      handleGetCurrentTrack();
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && currentTrack.id) {
      handleGetTrackFeatures();
    }
  }, [accessToken, currentTrack.id]);

  const handleGetTrackFeatures = () => {
    getAudioAnalysis(accessToken, currentTrack.id).then((response) => {
      const trackAnalysis = response.data;
      setTrackAnalysis({
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
        // add some response status handling
        if (response.status === 204) {
          setInitialTrackState();
        } else {
          const playerData = response.data;
          setCurrentTrack({
            artist: playerData.item.artists[0].name,
            name: playerData.item.name,
            art: playerData.item.album.images[0].url,
            id: playerData.item.id,
            progress_ms: playerData.progress_ms,
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    trackInfo: currentTrack,
    trackAnalysis: trackAnalysis,
    updateTrackHandler: handleGetCurrentTrack,
  };
};
