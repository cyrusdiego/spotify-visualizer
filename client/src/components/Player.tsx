import React, { FC, useState, useEffect } from 'react';
import { Preview } from './Preview';
import { Spectrum } from './Spectrum';
import { getHashParams } from '../api/utils';
import {
  getCurrentTrack,
  segment,
  getAudioAnalysis,
  section,
  syncTrack,
  timeInterval,
} from '../api/spotify';
import './styling/Player.css';

interface ITokenState {
  accessToken: string;
  refreshToken: string;
}

interface ITrackState {
  artist: string;
  name: string;
  art: string;
  id: string;
}

interface ITrackAnalysisState {
  segments: segment[];
  sections: section[];
  tatums: timeInterval[];
}

export const Player: FC<{}> = () => {
  // Set initial states
  const setInitialTokenState: () => ITokenState = () => {
    return {
      accessToken: '',
      refreshToken: '',
    };
  };

  const setInitialTrackState: () => ITrackState = () => {
    return {
      artist: '',
      name: '',
      id: '',
      art: '',
    };
  };

  const setInitialTrackAnalysis: () => ITrackAnalysisState = () => {
    return {
      segments: [],
      sections: [],
      tatums: [],
    };
  };

  // Hooks
  const [tokens, setTokens] = useState(setInitialTokenState());
  const [currentTrack, setCurrentTrack] = useState(setInitialTrackState());
  const [trackAnalysis, setTrackAnalysis] = useState(setInitialTrackAnalysis());

  // On mount
  useEffect(() => {
    const params = getHashParams();
    if (params) {
      setTokens({
        accessToken: params.access_token,
        refreshToken: params.refresh_token,
      });
    }
  }, []);

  // get current track info
  useEffect(() => {
    if (tokens.accessToken) {
      handleGetCurrentTrack();
    }
  }, [tokens.accessToken]);

  useEffect(() => {
    if (tokens.accessToken && currentTrack.id) {
      handleGetTrackAnalysis();
    }
  }, [tokens.accessToken, currentTrack.id]);

  const handleGetTrackAnalysis = () => {
    getAudioAnalysis(tokens.accessToken, currentTrack.id)
      .then((response) => {
        const trackAnalysis = response.data;
        setTrackAnalysis({
          segments: trackAnalysis.segments,
          sections: trackAnalysis.sections,
          tatums: trackAnalysis.tatums,
        });
      })
      .then(() => {
        // syncTrack(tokens.accessToken);
      });
  };

  // Get current Track data
  const handleGetCurrentTrack = () => {
    getCurrentTrack(tokens.accessToken)
      .then((response) => {
        if (response.status === 204) {
          setInitialTrackState();
        } else {
          const playerData = response.data.item;
          setCurrentTrack({
            artist: playerData.artists[0].name,
            name: playerData.name,
            art: playerData.album.images[0].url,
            id: playerData.id,
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const refreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // will need to find a way to get new access token when it expires...
    handleGetCurrentTrack();
  };

  return (
    <div className='player_container'>
      <Preview currentTrack={currentTrack} refresh={refreshClick} />
      <Spectrum
        segments={trackAnalysis.segments}
        sections={trackAnalysis.sections}
        tatums={trackAnalysis.tatums}
      />
    </div>
  );
};
